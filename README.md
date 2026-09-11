# Letter Fishing TV

An Arabic, English and French letter-matching game for young children, driven
entirely by a TV remote. Built for a Samsung UN55MU6290 (2017, Tizen 3.0).

Listen to a letter, then catch the fish carrying it. Ten rounds, stars for
accuracy, and spoken encouragement in the chosen language.

## Running it locally

```
python3 -m http.server 8080 --bind 127.0.0.1
open http://127.0.0.1:8080/
```

## Platform constraints

The Tizen 3.0 browser is Chromium 47, which shapes most of the code:

- **No Web Speech API.** `window.speechSynthesis` does not exist, so every
  spoken line is pre-rendered to MP3 and shipped inside the package. See
  [Pronunciation](#pronunciation).
- **No CSS custom properties, no CSS grid.** Layout is flexbox with literal
  colour values.
- **ES5 only.** No arrow functions, `let`/`const`, or template literals.
- **No emoji.** Many render as tofu boxes on 2017 firmware; the UI uses BMP
  symbols (`★ ♪ ♫ ▼`) instead.

## Pronunciation

`assets/voice/` holds 184 clips — a letter name and an example word for each
letter, plus praise, retry, prompt and welcome lines — indexed by the generated
`audio-manifest.js`. They are committed so the app builds without network
access.

To regenerate:

```
python3 -m venv tools/.venv
tools/.venv/bin/pip install edge-tts
tools/.venv/bin/python tools/generate_voice.py          # only missing clips
tools/.venv/bin/python tools/generate_voice.py --force  # all of them
```

Voices are `ar-SA-ZariyahNeural`, `en-US-AnaNeural` (a child voice) and
`fr-FR-DeniseNeural`, trimmed of Edge's silence padding with ffmpeg. This sends
each line of text to Microsoft's TTS endpoint; the lines are alphabet names and
example words only. `--engine say` renders offline with macOS `say` and `lame`
instead, at noticeably lower quality.

Two traps worth knowing if you change the voice pipeline:

- macOS `say` narrates a bare uppercase letter as "**capital** A". Edge does not.
- Do not hand-write phonetics for letter names. Spelling A as `"ay"` made Edge
  voice it /aɪ/ — byte-identical to `"eye"`, so A and I shared a clip. Passing
  the bare letter is correct. `data.json` keeps a `say` field separate from the
  displayed `name` for exactly this reason.

A useful check: every clip within a language should be byte-distinct. A
collision means the engine misread something.

## Installing on the TV

See [TV_INSTALL.md](TV_INSTALL.md).
