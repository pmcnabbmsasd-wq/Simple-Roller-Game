var Sound = {
  ctx: null,
  master: null,
  started: false,
  loopTimer: null,
  step: 0,
  enabled: true,
  noiseBuffer: null
};

Sound.init = function () {
  if (this.ctx || !this.enabled) { return; }
  var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    this.enabled = false;
    return;
  }
  this.ctx = new AudioContextCtor();
  this.master = this.ctx.createGain();
  this.master.gain.value = 0.12;
  this.master.connect(this.ctx.destination);
};

Sound.ensureStarted = function () {
  if (!this.enabled) { return; }
  this.init();
  if (!this.ctx) { return; }
  if (this.ctx.state === "suspended") {
    this.ctx.resume();
  }
  if (!this.started) {
    this.started = true;
    this.startLoop();
  }
};

Sound.startLoop = function () {
  if (!this.ctx || this.loopTimer) { return; }
  var self = this;
  this.loopTimer = window.setInterval(function () {
    self.step = (self.step + 1) % 16;
    if (self.step % 4 === 0) {
      self.playKick(50);
    }
    if (self.step % 8 === 0) {
      self.playSnare();
    }
    if (self.step % 2 === 0) {
      self.playHiHat();
    }
    if (self.step % 4 === 0 || self.step % 8 === 0) {
      self.playBass(self.step % 8 === 0 ? 42 : 45);
    }
    if (self.step === 0 || self.step === 8) {
      self.sayCashRap();
    }
  }, 170);
};

Sound.playKick = function (frequency) {
  if (!this.ctx) { return; }
  var now = this.ctx.currentTime;
  var oscillator = this.ctx.createOscillator();
  var gain = this.ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(28, now + 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  oscillator.connect(gain);
  gain.connect(this.master);
  oscillator.start(now);
  oscillator.stop(now + 0.24);
};

Sound.playSnare = function () {
  if (!this.ctx) { return; }
  var now = this.ctx.currentTime;
  var noise = this.ctx.createBufferSource();
  var buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.18, this.ctx.sampleRate);
  var data = buffer.getChannelData(0);
  for (var i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  noise.buffer = buffer;

  var filter = this.ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1500;

  var gain = this.ctx.createGain();
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(this.master);
  noise.start(now);
  noise.stop(now + 0.18);
};

Sound.playHiHat = function () {
  if (!this.ctx) { return; }
  var now = this.ctx.currentTime;
  var noise = this.ctx.createBufferSource();
  var buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
  var data = buffer.getChannelData(0);
  for (var i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.6;
  }
  noise.buffer = buffer;

  var gain = this.ctx.createGain();
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  var filter = this.ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 6500;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(this.master);
  noise.start(now);
  noise.stop(now + 0.05);
};

Sound.playBass = function (frequency) {
  if (!this.ctx) { return; }
  var now = this.ctx.currentTime;
  var oscillator = this.ctx.createOscillator();
  var gain = this.ctx.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  oscillator.connect(gain);
  gain.connect(this.master);
  oscillator.start(now);
  oscillator.stop(now + 0.22);
};

Sound.playJump = function () {
  if (!this.ctx) { return; }
  var now = this.ctx.currentTime;
  var oscillator = this.ctx.createOscillator();
  var gain = this.ctx.createGain();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(220, now);
  oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  oscillator.connect(gain);
  gain.connect(this.master);
  oscillator.start(now);
  oscillator.stop(now + 0.12);
};

Sound.playShoot = function () {
  if (!this.ctx) { return; }
  var now = this.ctx.currentTime;
  var oscillator = this.ctx.createOscillator();
  var gain = this.ctx.createGain();
  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(780, now);
  oscillator.frequency.exponentialRampToValueAtTime(520, now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
  oscillator.connect(gain);
  gain.connect(this.master);
  oscillator.start(now);
  oscillator.stop(now + 0.1);
};

Sound.playHit = function () {
  if (!this.ctx) { return; }
  var now = this.ctx.currentTime;
  var oscillator = this.ctx.createOscillator();
  var gain = this.ctx.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(120, now);
  oscillator.frequency.exponentialRampToValueAtTime(56, now + 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.14, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  oscillator.connect(gain);
  gain.connect(this.master);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
};

Sound.sayCashRap = function () {
  if (!window || !window.speechSynthesis) { return; }
  var lines = [
    "Roman here, I got 20 grand, no cap, that's the real flex.",
    "Roman in the booth, stackin' paper, yeah, I got 50K in the mix.",
    "I'm Roman, money on me, baby, you know I got the cash.",
    "I'm Roman, two hundred grand talk, yeah, I'm making it stack.",
    "My name is Roman and I love to eat poop, and my iq 7, I dont know how to read and I like to lick feet."
  ];
  var selected = lines[Math.floor(Math.random() * lines.length)];
  var utterance = new SpeechSynthesisUtterance(selected);
  utterance.rate = 1.04;
  utterance.pitch = 1.2;
  utterance.volume = 0.7;
  utterance.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

document.addEventListener("pointerdown", function () {
  Sound.ensureStarted();
}, { once: true });

document.addEventListener("keydown", function () {
  Sound.ensureStarted();
}, { once: true });
