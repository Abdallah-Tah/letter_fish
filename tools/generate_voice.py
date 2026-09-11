#!/usr/bin/env python3
"""Render every spoken line in the game to an MP3 that ships inside the .wgt.

The Samsung Tizen TV browser has no Web Speech API, so nothing can be spoken at
runtime — each clip has to exist as a file. Microsoft Edge's neural voices are
used because they are far warmer than the macOS `say` voices, and en-US-Ana is
an actual child voice.

    tools/.venv/bin/python tools/generate_voice.py            # build missing
    tools/.venv/bin/python tools/generate_voice.py --force    # rebuild all
    tools/.venv/bin/python tools/generate_voice.py --engine say   # offline

Note: the Edge engine sends each line of text to Microsoft's TTS endpoint.
The lines are alphabet names and example words only.
"""
import asyncio, json, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FORCE = '--force' in sys.argv
ENGINE = 'say' if '--engine' in sys.argv and 'say' in sys.argv else 'edge'

EDGE_VOICE = {'ar': 'ar-SA-ZariyahNeural', 'en': 'en-US-AnaNeural', 'fr': 'fr-FR-DeniseNeural'}
EDGE_RATE  = {'ar': '-15%', 'en': '-10%', 'fr': '-10%'}
SAY_VOICE  = {'ar': ('Majed', 140), 'en': ('Samantha', 150), 'fr': ('Jacques', 150)}

UI_LINES = {
    'ar': {'praise':  ['أحسنت', 'ما شاء الله', 'رائع جدا'],
           'retry':   ['حاول مرة أخرى', 'لا بأس، جرب سمكة أخرى'],
           'find':    ['أين هذا الحرف؟'],
           'done':    ['أحسنت يا بطل! لقد أنهيت اللعبة'],
           'welcome': ['أهلا بك في صيد الحروف']},
    'en': {'praise':  ['Great job!', 'Wonderful!', 'You got it!'],
           'retry':   ['Try again', 'Almost! Try another fish'],
           'find':    ['Can you find this letter?'],
           'done':    ['Amazing fishing! Well done!'],
           'welcome': ['Welcome to Letter Fishing!']},
    'fr': {'praise':  ['Bravo !', 'Super !', "C'est ça !"],
           'retry':   ['Essaie encore', 'Presque ! Essaie un autre poisson'],
           'find':    ['Trouve cette lettre'],
           'done':    ['Quelle belle pêche ! Bravo !'],
           'welcome': ['Bienvenue à la pêche aux lettres !']},
}


def render_say(text, lang, dest):
    voice, rate = SAY_VOICE[lang]
    wav = dest.with_suffix('.wav')
    subprocess.run(['say', '-v', voice, '-r', str(rate), '-o', str(wav),
                    '--data-format=LEI16@22050', text], check=True)
    subprocess.run(['lame', '--quiet', '-m', 'm', '-b', '48', str(wav), str(dest)], check=True)
    wav.unlink()


TRIM = ('silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB:detection=peak,'
        'areverse,'
        'silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB:detection=peak,'
        'areverse')


def trim_silence(path):
    """Edge pads every clip with ~0.4s of silence, which makes the game drag."""
    tmp = path.with_suffix('.trim.mp3')
    r = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(path), '-af', TRIM,
                        '-c:a', 'libmp3lame', '-b:a', '48k', '-ar', '24000', '-ac', '1',
                        str(tmp)], capture_output=True)
    if r.returncode == 0 and tmp.exists() and tmp.stat().st_size > 500:
        tmp.replace(path)
    elif tmp.exists():
        tmp.unlink()


async def render_edge(text, lang, dest):
    import edge_tts
    tts = edge_tts.Communicate(text, EDGE_VOICE[lang], rate=EDGE_RATE[lang])
    await tts.save(str(dest))
    if dest.stat().st_size < 800:
        raise RuntimeError('suspiciously small clip for %r' % text)
    trim_silence(dest)


def collect(data):
    """[(text, lang, relative_path)] for every clip the app can ask for."""
    jobs, manifest = [], {}
    for lang, items in data.items():
        entry = {'letters': {}, 'ui': {}}
        for i, item in enumerate(items):
            n = 'assets/voice/%s/%02dn.mp3' % (lang, i)
            w = 'assets/voice/%s/%02dw.mp3' % (lang, i)
            jobs.append((item.get('say', item['name']), lang, n))
            jobs.append((item['word'], lang, w))
            entry['letters'][item['letter']] = {'name': n, 'word': w}
        for kind, lines in UI_LINES[lang].items():
            paths = []
            for j, line in enumerate(lines):
                rel = 'assets/voice/%s/ui_%s%d.mp3' % (lang, kind, j)
                jobs.append((line, lang, rel))
                paths.append(rel)
            entry['ui'][kind] = paths
        manifest[lang] = entry
    return jobs, manifest


async def main():
    data = json.loads((ROOT / 'data.json').read_text())
    jobs, manifest = collect(data)
    todo = [(t, l, p) for t, l, p in jobs if FORCE or not (ROOT / p).exists()]
    print('%d clips total, %d to render with %s' % (len(jobs), len(todo), ENGINE))

    if ENGINE == 'say' and not shutil.which('lame'):
        sys.exit('lame not found (brew install lame)')

    gate = asyncio.Semaphore(6)
    failures = []

    async def one(text, lang, rel):
        dest = ROOT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        async with gate:
            for attempt in range(3):
                try:
                    if ENGINE == 'edge':
                        await render_edge(text, lang, dest)
                    else:
                        render_say(text, lang, dest)
                    return
                except Exception as exc:                      # noqa: BLE001
                    if attempt == 2:
                        failures.append((rel, text, repr(exc)))
                    else:
                        await asyncio.sleep(1.5 * (attempt + 1))

    done = 0
    for i in range(0, len(todo), 24):
        await asyncio.gather(*(one(*j) for j in todo[i:i + 24]))
        done = min(i + 24, len(todo))
        print('  %d/%d' % (done, len(todo)), flush=True)

    if failures:
        print('\n%d clips FAILED:' % len(failures))
        for rel, text, err in failures[:10]:
            print('  %s  %r  %s' % (rel, text, err))
        sys.exit(1)

    (ROOT / 'audio-manifest.js').write_text(
        '/* Generated by tools/generate_voice.py (%s engine). */\n' % ENGINE +
        'window.FISHING_AUDIO = ' + json.dumps(manifest, ensure_ascii=False) + ';\n')
    size = sum(f.stat().st_size for f in (ROOT / 'assets' / 'voice').rglob('*.mp3'))
    print('OK — %d clips referenced, %.0f KB' % (len(jobs), size / 1024))

asyncio.run(main())
