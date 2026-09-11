/* Letter Fishing TV — ES5 only (Tizen 3.0 / Chromium 47). */
(function () {
'use strict';
var DATA = {"ar":[{"letter":"ا","name":"ألف","word":"أسد"},{"letter":"ب","name":"باء","word":"بيت"},{"letter":"ت","name":"تاء","word":"تفاحة"},{"letter":"ث","name":"ثاء","word":"ثعلب"},{"letter":"ج","name":"جيم","word":"جمل"},{"letter":"ح","name":"حاء","word":"حصان"},{"letter":"خ","name":"خاء","word":"خبز"},{"letter":"د","name":"دال","word":"دجاجة"},{"letter":"ذ","name":"ذال","word":"ذئب"},{"letter":"ر","name":"راء","word":"رمان"},{"letter":"ز","name":"زاي","word":"زهرة"},{"letter":"س","name":"سين","word":"سمكة"},{"letter":"ش","name":"شين","word":"شمس"},{"letter":"ص","name":"صاد","word":"صقر"},{"letter":"ض","name":"ضاد","word":"ضفدع"},{"letter":"ط","name":"طاء","word":"طائرة"},{"letter":"ظ","name":"ظاء","word":"ظرف"},{"letter":"ع","name":"عين","word":"عصفور"},{"letter":"غ","name":"غين","word":"غزال"},{"letter":"ف","name":"فاء","word":"فراشة"},{"letter":"ق","name":"قاف","word":"قمر"},{"letter":"ك","name":"كاف","word":"كتاب"},{"letter":"ل","name":"لام","word":"ليمون"},{"letter":"م","name":"ميم","word":"موز"},{"letter":"ن","name":"نون","word":"نجم"},{"letter":"ه","name":"هاء","word":"هلال"},{"letter":"و","name":"واو","word":"وردة"},{"letter":"ي","name":"ياء","word":"يد"}],"en":[{"letter":"A","name":"A","word":"Apple"},{"letter":"B","name":"B","word":"Ball"},{"letter":"C","name":"C","word":"Cat"},{"letter":"D","name":"D","word":"Dog"},{"letter":"E","name":"E","word":"Elephant"},{"letter":"F","name":"F","word":"Fish"},{"letter":"G","name":"G","word":"Goat"},{"letter":"H","name":"H","word":"House"},{"letter":"I","name":"I","word":"Ice"},{"letter":"J","name":"J","word":"Juice"},{"letter":"K","name":"K","word":"Kite"},{"letter":"L","name":"L","word":"Lion"},{"letter":"M","name":"M","word":"Moon"},{"letter":"N","name":"N","word":"Nest"},{"letter":"O","name":"O","word":"Orange"},{"letter":"P","name":"P","word":"Pear"},{"letter":"Q","name":"Q","word":"Queen"},{"letter":"R","name":"R","word":"Rabbit"},{"letter":"S","name":"S","word":"Sun"},{"letter":"T","name":"T","word":"Tree"},{"letter":"U","name":"U","word":"Umbrella"},{"letter":"V","name":"V","word":"Van"},{"letter":"W","name":"W","word":"Whale"},{"letter":"X","name":"X","word":"Xylophone"},{"letter":"Y","name":"Y","word":"Yacht"},{"letter":"Z","name":"Z","word":"Zebra"}],"fr":[{"letter":"A","name":"A","word":"Avion"},{"letter":"B","name":"B","word":"Bateau"},{"letter":"C","name":"C","word":"Chat"},{"letter":"D","name":"D","word":"Dauphin"},{"letter":"E","name":"E","word":"Étoile"},{"letter":"F","name":"F","word":"Fleur"},{"letter":"G","name":"G","word":"Gâteau"},{"letter":"H","name":"H","word":"Hibou"},{"letter":"I","name":"I","word":"Île"},{"letter":"J","name":"J","word":"Jardin"},{"letter":"K","name":"K","word":"Kiwi"},{"letter":"L","name":"L","word":"Lune"},{"letter":"M","name":"M","word":"Maison"},{"letter":"N","name":"N","word":"Nuage"},{"letter":"O","name":"O","word":"Orange"},{"letter":"P","name":"P","word":"Poisson"},{"letter":"Q","name":"Q","word":"Quatre"},{"letter":"R","name":"R","word":"Rose"},{"letter":"S","name":"S","word":"Soleil"},{"letter":"T","name":"T","word":"Tortue"},{"letter":"U","name":"U","word":"Uniforme"},{"letter":"V","name":"V","word":"Vélo"},{"letter":"W","name":"W","word":"Wagon"},{"letter":"X","name":"X","word":"Xylophone"},{"letter":"Y","name":"Y","word":"Yaourt"},{"letter":"Z","name":"Z","word":"Zèbre"}]};

var lang = 'ar', voiceOn = true, musicOn = true;
var screen = 'home', lesson = [], index = 0, score = 0, streak = 0;
var attempts = 0, misses = 0, selected = 1, locked = false;
var timers = [], generation = 0;
var ROUND = 10;

var locale = {ar:'ar-SA', en:'en-US', fr:'fr-FR'};
var texts = {
ar:{title:'صيد الحروف',sub:'مغامرة صغيرة في بحر الحروف',play:'▶ ابدأ الصيد',again:'العب مرة أخرى',home:'الرئيسية',
    voiceOn:'♪ الصوت',voiceOff:'✕ الصوت',musicOn:'♫ الموسيقى',musicOff:'✕ الموسيقى',
    listen:'استمع ثم اصطد الحرف الصحيح',choose:'أي سمكة تحمل هذا الحرف؟',yes:'أحسنت! صيد رائع ★',
    no:'لا بأس، جرّب سمكة أخرى',hintMsg:'انظر إلى السمكة اللامعة ★',done:'أحسنت يا بطل!',
    score:'النقاط',streak:'متتالية',accuracy:'الدقة',
    hint:'◀ ▶ اختر  ·  OK اصطد  ·  ▲ استمع  ·  رجوع للرئيسية',
    quiet:'ملفات النطق غير موجودة. طابق الحرف الظاهر.'},
en:{title:'Letter Fishing',sub:'Little catches. Bright discoveries.',play:'▶ Let’s go fishing',again:'Fish again',home:'Home',
    voiceOn:'♪ Voice',voiceOff:'✕ Voice',musicOn:'♫ Music',musicOff:'✕ Music',
    listen:'Listen, then catch the matching fish',choose:'Which fish has this letter?',yes:'Great catch! ★',
    no:'That’s okay — try another fish',hintMsg:'Look at the glowing fish ★',done:'What a wonderful catch!',
    score:'Points',streak:'In a row',accuracy:'Accuracy',
    hint:'◀ ▶ Choose  ·  OK Catch  ·  ▲ Listen  ·  Back Home',
    quiet:'Pronunciation files are missing. Match the letter on screen.'},
fr:{title:'La pêche aux lettres',sub:'Petites prises. Grandes découvertes.',play:'▶ Allons pêcher',again:'Rejouer',home:'Accueil',
    voiceOn:'♪ Voix',voiceOff:'✕ Voix',musicOn:'♫ Musique',musicOff:'✕ Musique',
    listen:'Écoute, puis attrape la bonne lettre',choose:'Quel poisson porte cette lettre ?',yes:'Bravo ! Quelle prise ★',
    no:'Pas grave — essaie un autre poisson',hintMsg:'Regarde le poisson qui brille ★',done:'Une pêche formidable !',
    score:'Points',streak:'À la suite',accuracy:'Précision',
    hint:'◀ ▶ Choisir  ·  OK Attraper  ·  ▲ Écouter  ·  Retour Accueil',
    quiet:'Fichiers de prononciation absents. Retrouve la lettre affichée.'}};

function el(id){return document.getElementById(id);}
function all(sel){return Array.prototype.slice.call(document.querySelectorAll(sel));}
function t(){return texts[lang];}
function clips(){return window.FISHING_AUDIO && window.FISHING_AUDIO[lang];}
function hasVoice(){var c=clips();return !!(c&&c.letters);}
function pick(a){return a[Math.floor(Math.random()*a.length)];}

/* ---------- audio ------------------------------------------------------
   Tizen TVs are unreliable with several media elements at once, so there is
   exactly one element for effects and one for narration, and the music is
   ducked (or paused, if the TV ignores .volume) while anything is spoken. */
var MUSIC_VOL = 0.12, DUCK_VOL = 0.03;
var music = new Audio('assets/music/letter_fishing_loop.wav');
music.loop = true;
try { music.volume = MUSIC_VOL; } catch (e) {}
var sfxEl = new Audio(), voiceEl = new Audio();
sfxEl.preload = 'auto'; voiceEl.preload = 'auto';
var SFX = {select:'assets/sfx/select.wav', correct:'assets/sfx/correct.wav',
           retry:'assets/sfx/retry.wav', complete:'assets/sfx/complete.wav'};

function play(a){ try { var p = a.play(); if (p && p['catch']) p['catch'](function(){}); } catch (e) {} }

function duck(on){
  if (!musicOn) return;
  var want = on ? DUCK_VOL : MUSIC_VOL;
  try {
    music.volume = want;
    if (Math.abs(music.volume - want) < 0.005) return;   // TV honoured it
  } catch (e) {}
  if (on) music.pause();                                  // TV ignores volume
  else if (screen === 'game') play(music);
}

function fx(name){
  if (!voiceOn || !SFX[name]) return;
  try { sfxEl.pause(); sfxEl.src = SFX[name]; sfxEl.currentTime = 0; } catch (e) {}
  play(sfxEl);
}

var queue = [], speakGen = 0, speakTimer = null;
function stopVoice(){
  speakGen++; queue = [];
  if (speakTimer) { clearTimeout(speakTimer); speakTimer = null; }
  try { voiceEl.pause(); } catch (e) {}
  if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  el('speakerBtn').className = 'speaker';
  duck(false);
}
function drain(){
  if (!queue.length) { el('speakerBtn').className = 'speaker'; duck(false); return; }
  var g = speakGen, src = queue.shift();
  var next = function(){ if (g === speakGen) { speakTimer = setTimeout(drain, 180); } };
  voiceEl.onended = next;
  voiceEl.onerror = next;
  try { voiceEl.pause(); voiceEl.src = src; voiceEl.currentTime = 0; } catch (e) { next(); return; }
  duck(true);
  el('speakerBtn').className = 'speaker speaking';
  play(voiceEl);
  // Safety net: some TVs never fire 'ended' on short clips.
  speakTimer = setTimeout(function(){ if (g === speakGen) next(); }, 4000);
}
function say(list){
  if (!voiceOn || !list || !list.length) return;
  stopVoice();
  queue = list.slice();
  drain();
}
/* Desktop fallback so the game is still testable in a normal browser. */
function speakText(text){
  if (!voiceOn || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
  try {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = locale[lang]; u.rate = 0.8;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}
function letterClip(kind){
  var c = clips(), item = lesson[index];
  if (!c || !item || !c.letters[item.letter]) return null;
  return c.letters[item.letter][kind];
}
function uiClip(kind){
  var c = clips();
  if (!c || !c.ui || !c.ui[kind] || !c.ui[kind].length) return null;
  return pick(c.ui[kind]);
}
/* Speak the current target: prompt + letter name (+ example word). */
function sayTarget(withWord){
  var item = lesson[index];
  if (!item) return;
  if (!hasVoice()) { speakText(item.name + (withWord ? '. ' + item.word : '')); return; }
  var list = [], n = letterClip('name'), w = letterClip('word');
  if (n) list.push(n);
  if (withWord && w) list.push(w);
  say(list);
}

/* ---------- helpers ---------------------------------------------------- */
function later(fn, delay){
  var g = generation;
  timers.push(setTimeout(function(){ if (g === generation) fn(); }, delay));
}
function cancel(){
  generation++;
  for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
  timers = [];
  locked = false;
  stopVoice();
}
function shuffle(a){
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)), v = a[i];
    a[i] = a[j]; a[j] = v;
  }
  return a;
}
function show(name){
  screen = name;
  var list = ['home','game','result'];
  for (var i = 0; i < list.length; i++) {
    var n = list[i], on = n === name;
    el(n).className = on ? 'screen active' : 'screen';
    el(n).setAttribute('aria-hidden', on ? 'false' : 'true');
  }
}

/* ---------- rendering -------------------------------------------------- */
function buildDots(){
  var html = '';
  for (var i = 0; i < ROUND; i++) html += '<span class="dot"></span>';
  el('dots').innerHTML = html;
}
function updateScore(){
  el('score').textContent = score;
  el('streak').textContent = streak;
  var dots = all('#dots .dot');
  for (var i = 0; i < dots.length; i++) {
    dots[i].className = 'dot' + (i < index ? ' done' : (i === index ? ' now' : ''));
  }
}
function select(){
  var fish = all('.fish');
  for (var i = 0; i < fish.length; i++) {
    var on = i === selected;
    fish[i].className = fish[i].getAttribute('data-base') + (on ? ' selected' : '');
    fish[i].setAttribute('tabindex', on ? '0' : '-1');
  }
  if (fish[selected]) fish[selected].focus();
}
function popConfetti(node){
  var marks = ['★','✦','●','◆'], box = el('game');
  var rect = node.getBoundingClientRect();
  for (var i = 0; i < 7; i++) {
    var s = document.createElement('span');
    s.className = 'pop';
    s.textContent = marks[i % marks.length];
    s.style.left = (rect.left + rect.width * (0.15 + Math.random() * 0.7)) + 'px';
    s.style.top = (rect.top + rect.height * 0.3) + 'px';
    s.style.animationDelay = (i * 0.06) + 's';
    box.appendChild(s);
    (function (node2){ setTimeout(function(){
      if (node2.parentNode) node2.parentNode.removeChild(node2);
    }, 1400); })(s);
  }
}
function setMessage(text, kind){
  var m = el('message');
  m.textContent = text;
  m.className = 'message' + (kind ? ' ' + kind : '');
}
function render(){
  var item = lesson[index];
  locked = false; misses = 0;
  updateScore();
  el('targetLetter').textContent = item.letter;
  el('targetName').textContent = item.name;
  el('targetWord').textContent = item.word;
  el('instruction').textContent = t().listen;
  el('targetCard').dir = lang === 'ar' ? 'rtl' : 'ltr';
  setMessage(t().choose, '');
  el('voiceNote').textContent = hasVoice() ? '' : t().quiet;
  el('speakerBtn').disabled = !voiceOn;

  var others = shuffle(DATA[lang].filter(function (x){ return x.letter !== item.letter; }))
                 .slice(0, 2).map(function (x){ return x.letter; });
  var pool = shuffle(others.concat([item.letter]));
  var row = el('fishRow');
  row.innerHTML = '';
  for (var i = 0; i < pool.length; i++) {
    (function (ch, i){
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-base', 'fish fish-' + i);
      b.setAttribute('data-letter', ch);
      b.setAttribute('aria-label', ch);
      b.className = 'fish fish-' + i;
      b.innerHTML = '<span class="pointer" aria-hidden="true">▼</span>' +
                    '<span class="fish-eye" aria-hidden="true"></span>' +
                    '<span class="fish-smile" aria-hidden="true"></span>' +
                    '<span class="fish-letter"></span>' +
                    '<span class="fish-fin" aria-hidden="true"></span>';
      b.querySelector('.fish-letter').textContent = ch;
      b.onclick = function (){ selected = i; select(); catchFish(); };
      row.appendChild(b);
    })(pool[i], i);
  }
  selected = 1;
  select();
  later(function (){
    var prompt = uiClip('find');
    if (hasVoice() && prompt) { say([prompt, letterClip('name')]); }
    else sayTarget(false);
  }, 400);
}

/* ---------- flow ------------------------------------------------------- */
function start(){
  cancel();
  lesson = shuffle(DATA[lang]).slice(0, ROUND);
  index = 0; score = 0; streak = 0; attempts = 0;
  show('game');
  buildDots();
  if (musicOn) { try { music.currentTime = 0; } catch (e) {} play(music); }
  render();
}
function home(){
  cancel();
  music.pause();
  try { sfxEl.pause(); } catch (e) {}
  show('home');
  translate();
  el('playBtn').focus();
}
function catchFish(){
  if (locked || screen !== 'game') return;
  var fish = all('.fish'), b = fish[selected];
  if (!b) return;
  attempts++;
  locked = true;

  if (b.getAttribute('data-letter') === lesson[index].letter) {
    streak++;
    score += 10 + Math.min(10, streak * 2);
    b.className = b.getAttribute('data-base') + ' selected correct';
    setMessage(t().yes, 'good');
    popConfetti(b);
    fx('correct');
    index++;
    updateScore();
    later(function (){
      var praise = uiClip('praise'), w = null;
      var c = clips();
      if (c && c.letters[lesson[index - 1].letter]) w = c.letters[lesson[index - 1].letter].word;
      if (hasVoice()) say([praise, w].filter(Boolean));
      else speakText(lesson[index - 1].word);
    }, 420);
    later(function (){
      if (index === ROUND) finish(); else render();
    }, 2300);
  } else {
    streak = 0; misses++;
    updateScore();
    b.className = b.getAttribute('data-base') + ' selected wrong';
    setMessage(t().no, 'bad');
    fx('retry');
    later(function (){
      if (hasVoice()) say([uiClip('retry'), letterClip('name')].filter(Boolean));
      else sayTarget(false);
    }, 380);
    later(function (){
      b.className = b.getAttribute('data-base');
      select();
      locked = false;
      if (misses >= 2) showHint();
    }, 900);
  }
}
/* After two misses, dim the wrong fish and make the right one glow. */
function showHint(){
  var fish = all('.fish');
  setMessage(t().hintMsg, '');
  for (var i = 0; i < fish.length; i++) {
    var right = fish[i].getAttribute('data-letter') === lesson[index].letter;
    var base = fish[i].getAttribute('data-base');
    var sel = i === selected ? ' selected' : '';
    fish[i].className = base + sel + (right ? ' hint' : ' faded');
  }
}
function finish(){
  cancel();
  music.pause();
  fx('complete');
  var acc = Math.round(ROUND * 100 / Math.max(ROUND, attempts));
  var stars = acc >= 90 ? 3 : acc >= 70 ? 2 : 1;
  el('resultTitle').textContent = t().done;
  var html = '';
  for (var i = 0; i < 3; i++) html += '<i>' + (i < stars ? '★' : '☆') + '</i>';
  el('resultStars').innerHTML = html;
  el('resultStats').textContent = t().score + ': ' + score + '   ·   ' + t().accuracy + ': ' + acc + '%';
  show('result');
  el('againBtn').focus();
  later(function (){
    if (hasVoice()) say([uiClip('done')].filter(Boolean));
    else speakText(t().done);
  }, 700);
}

/* ---------- chrome ----------------------------------------------------- */
function translate(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  el('homeTitle').textContent = t().title;
  el('subtitle').textContent = t().sub;
  el('playBtn').textContent = t().play;
  el('againBtn').textContent = t().again;
  el('homeBtn').textContent = t().home;
  el('soundBtn').textContent = voiceOn ? t().voiceOn : t().voiceOff;
  el('musicBtn').textContent = musicOn ? t().musicOn : t().musicOff;
  el('homeHint').textContent = t().hint;
  el('controls').textContent = t().hint;
  el('pointsLabel').textContent = t().score;
  el('streakLabel').textContent = t().streak;
  el('speakerBtn').setAttribute('aria-label',
    lang === 'ar' ? 'إعادة النطق' : lang === 'fr' ? 'Répéter' : 'Repeat pronunciation');
  var langs = all('.lang');
  for (var i = 0; i < langs.length; i++) {
    var on = langs[i].getAttribute('data-lang') === lang;
    langs[i].className = on ? 'lang selected' : 'lang';
    langs[i].setAttribute('aria-pressed', on ? 'true' : 'false');
  }
}
function store(k, v){ try { localStorage.setItem(k, v); } catch (e) {} }

var langBtns = all('.lang');
for (var i = 0; i < langBtns.length; i++) {
  (function (b){
    b.onclick = function (){
      lang = b.getAttribute('data-lang');
      translate();
      fx('select');
      store('fishing-language', lang);
      var c = clips();
      if (c && c.ui && c.ui.welcome) say([c.ui.welcome[0]]);
    };
  })(langBtns[i]);
}
el('playBtn').onclick = start;
el('againBtn').onclick = start;
el('homeBtn').onclick = home;
el('speakerBtn').onclick = function (){ sayTarget(true); };
el('soundBtn').onclick = function (){
  voiceOn = !voiceOn;
  if (!voiceOn) { stopVoice(); try { sfxEl.pause(); } catch (e) {} }
  el('speakerBtn').disabled = !voiceOn;
  translate();
  store('fishing-sound', voiceOn ? 'on' : 'off');
};
el('musicBtn').onclick = function (){
  musicOn = !musicOn;
  if (!musicOn) music.pause();
  else if (screen === 'game') { try { music.volume = MUSIC_VOL; } catch (e) {} play(music); }
  translate();
  store('fishing-music', musicOn ? 'on' : 'off');
};

document.addEventListener('keydown', function (e){
  var code = e.keyCode;
  if ([37,38,39,40,13,32,27,8,10009,461].indexOf(code) < 0) return;
  e.preventDefault();
  if (e.repeat) return;

  if (code === 27 || code === 8 || code === 10009 || code === 461) {
    if (screen !== 'home') home();
    else if (window.tizen) {
      try { window.tizen.application.getCurrentApplication().exit(); } catch (err) {}
    }
    return;
  }
  if (screen === 'game') {
    if (code === 37 || code === 39) {
      if (locked) return;
      var dir = code === 37 ? -1 : 1;
      if (lang === 'ar') dir = -dir;                 // mirror for RTL layout
      selected = (selected + dir + 3) % 3;
      select();
      fx('select');
    } else if (code === 38) {
      sayTarget(true);
    } else if (code === 13 || code === 32) {
      if (document.activeElement === el('speakerBtn')) sayTarget(true);
      else catchFish();
    } else if (code === 40) {
      el('speakerBtn').focus();
    }
    return;
  }
  var buttons = all('#' + screen + ' button');
  var i = buttons.indexOf(document.activeElement);
  if (code === 13 || code === 32) { if (i >= 0) buttons[i].click(); return; }
  i = (i + (code === 37 || code === 38 ? -1 : 1) + buttons.length) % buttons.length;
  buttons[i].focus();
  fx('select');
});

document.addEventListener('visibilitychange', function (){ if (document.hidden) home(); });

try {
  lang = localStorage.getItem('fishing-language') || 'ar';
  if (!DATA[lang]) lang = 'ar';
  voiceOn = localStorage.getItem('fishing-sound') !== 'off';
  musicOn = localStorage.getItem('fishing-music') !== 'off';
} catch (e) {}

buildDots();
translate();
home();
})();
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register('./service-worker.js')['catch'](function (){});
}
