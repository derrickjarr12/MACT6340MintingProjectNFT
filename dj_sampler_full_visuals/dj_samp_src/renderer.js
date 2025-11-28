// Audio setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const NUM_CHANNELS = 5;
const STEPS = 16;

// Per-channel state
const buffers = new Array(NUM_CHANNELS);
const gains = Array.from({length: NUM_CHANNELS}, () => audioCtx.createGain());
gains.forEach(g => g.gain.value = 1);

// Master bus & FX
const masterGain = audioCtx.createGain();
masterGain.gain.value = 1;

const eqLow = audioCtx.createBiquadFilter(); eqLow.type = 'lowshelf'; eqLow.frequency.value = 120; eqLow.gain.value = 0;
const eqMid = audioCtx.createBiquadFilter(); eqMid.type = 'peaking';  eqMid.frequency.value = 1000; eqMid.Q.value = 1; eqMid.gain.value = 0;
const eqHigh= audioCtx.createBiquadFilter(); eqHigh.type= 'highshelf'; eqHigh.frequency.value = 6000; eqHigh.gain.value = 0;

const delay = audioCtx.createDelay(1.0);
delay.delayTime.value = 0.25;
const delayGain = audioCtx.createGain(); delayGain.gain.value = 0.25; // wet
const delayFb = audioCtx.createGain(); delayFb.gain.value = 0.3;
delay.connect(delayFb).connect(delay);

const convolver = audioCtx.createConvolver(); // IR optional
const reverbWet = audioCtx.createGain(); reverbWet.gain.value = 0;

// Dynamics: compressor then limiter
const compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.value = -24; compressor.ratio.value = 12; compressor.knee.value = 30; compressor.attack.value = 0.003; compressor.release.value = 0.25;

const limiter = audioCtx.createDynamicsCompressor(); // pseudo-limiter
limiter.threshold.value = -1; limiter.knee.value = 0; limiter.ratio.value = 20; limiter.attack.value = 0.001; limiter.release.value = 0.01;

// Analyser for visuals
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

// Wire the graph: (channels) -> sum -> EQ -> (split to delay/reverb dry/wet) -> compressor -> limiter -> analyser -> destination
const channelSum = audioCtx.createGain();
gains.forEach(g => g.connect(channelSum));

// Dry path
const dryGain = audioCtx.createGain(); dryGain.gain.value = 1;

// Wet path
channelSum.connect(eqLow);
eqLow.connect(eqMid);
eqMid.connect(eqHigh);

eqHigh.connect(dryGain);
eqHigh.connect(delay);
eqHigh.connect(reverbWet);

// delay mix
delay.connect(delayGain);

// reverb mix
convolver.connect(reverbWet);

// Sum FX
const postFXSum = audioCtx.createGain();
dryGain.connect(postFXSum);
delayGain.connect(postFXSum);
reverbWet.connect(postFXSum);

// Dynamics + out
postFXSum.connect(compressor);
compressor.connect(limiter);
limiter.connect(analyser);
analyser.connect(masterGain);
masterGain.connect(audioCtx.destination);

// UI build: channels
const channelsDiv = document.querySelector('.channels');
for (let i = 0; i < NUM_CHANNELS; i++) {
  const wrap = document.createElement('div');
  wrap.className = 'channel';

  const drop = document.createElement('div');
  drop.className = 'drop';
  drop.textContent = `Drop Sample ${i+1}`;
  drop.dataset.id = i;

  const vol = document.createElement('div');
  vol.className = 'vol';
  vol.innerHTML = `<label>Volume <input type="range" min="0" max="2" step="0.01" value="1" data-id="${i}" class="volSlider"></label>`;

  wrap.appendChild(drop);
  wrap.appendChild(vol);
  channelsDiv.appendChild(wrap);
}

// Drag & drop loaders
document.querySelectorAll('.drop').forEach(el => {
  el.addEventListener('dragover', e => { e.preventDefault(); });
  el.addEventListener('drop', async e => {
    e.preventDefault();
    const id = parseInt(el.dataset.id);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const arr = await file.arrayBuffer();
    buffers[id] = await audioCtx.decodeAudioData(arr);
    el.textContent = `${file.name}`;
    el.classList.add('loaded');
  });
});

// Volume
document.querySelectorAll('.volSlider').forEach(s => {
  s.addEventListener('input', e => {
    const id = parseInt(e.target.dataset.id);
    gains[id].gain.value = parseFloat(e.target.value);
  });
});

// Sequencer grid
let pattern = Array.from({length: NUM_CHANNELS}, () => new Array(STEPS).fill(0));
const grid = document.getElementById('grid');

for (let r = 0; r < NUM_CHANNELS; r++) {
  for (let c = 0; c < STEPS; c++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.r = r; cell.dataset.c = c;
    cell.addEventListener('click', () => {
      pattern[r][c] = pattern[r][c] ? 0 : 1;
      cell.classList.toggle('active');
    });
    grid.appendChild(cell);
  }
}

// Transport
let currentStep = 0;
let timer = null;

function stepPlay() {
  const lookahead = 0.1; // seconds
  const scheduleTime = audioCtx.currentTime;

  // play active cells on currentStep
  for (let i = 0; i < NUM_CHANNELS; i++) {
    if (pattern[i][currentStep] && buffers[i]) {
      const src = audioCtx.createBufferSource();
      src.buffer = buffers[i];
      src.connect(gains[i]);
      src.start(scheduleTime + 0.0);
    }
  }

  highlightStep(currentStep);
  currentStep = (currentStep + 1) % STEPS;
}

function highlightStep(step) {
  document.querySelectorAll('.cell').forEach(cell => {
    const c = parseInt(cell.dataset.c);
    if (c === step) cell.classList.add('current'); else cell.classList.remove('current');
  });
}

function startSeq() {
  if (timer) return;
  const bpm = parseFloat(document.getElementById('bpm').value || 120);
  const intervalMs = (60000 / bpm) / 4; // 16th notes
  timer = setInterval(stepPlay, intervalMs);
  audioCtx.resume();
}

function stopSeq() {
  if (timer) clearInterval(timer);
  timer = null;
}

document.getElementById('startSeq').addEventListener('click', startSeq);
document.getElementById('stopSeq').addEventListener('click', stopSeq);
document.getElementById('bpm').addEventListener('change', () => {
  if (timer) { stopSeq(); startSeq(); }
});

// FX controls
document.getElementById('eqLow').addEventListener('input', e => eqLow.gain.value = parseFloat(e.target.value));
document.getElementById('eqMid').addEventListener('input', e => eqMid.gain.value = parseFloat(e.target.value));
document.getElementById('eqHigh').addEventListener('input', e => eqHigh.gain.value = parseFloat(e.target.value));

document.getElementById('delayTime').addEventListener('input', e => delay.delayTime.value = parseFloat(e.target.value));
document.getElementById('delayFb').addEventListener('input', e => delayFb.gain.value = parseFloat(e.target.value));
document.getElementById('delayMix').addEventListener('input', e => delayGain.gain.value = parseFloat(e.target.value));

document.getElementById('reverbWet').addEventListener('input', e => reverbWet.gain.value = parseFloat(e.target.value));
document.getElementById('irLoader').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const arr = await file.arrayBuffer();
  const buf = await audioCtx.decodeAudioData(arr);
  convolver.buffer = buf;
  if (reverbWet.gain.value === 0) reverbWet.gain.value = 0.25;
});

document.getElementById('compThr').addEventListener('input', e => compressor.threshold.value = parseFloat(e.target.value));
document.getElementById('compRatio').addEventListener('input', e => compressor.ratio.value = parseFloat(e.target.value));
document.getElementById('limitThr').addEventListener('input', e => limiter.threshold.value = parseFloat(e.target.value));
document.getElementById('masterGain').addEventListener('input', e => masterGain.gain.value = parseFloat(e.target.value));

// Sample set save/load
document.getElementById('saveSet').addEventListener('click', () => {
  const state = {
    pattern,
    volumes: gains.map(g => g.gain.value),
    bpm: parseFloat(document.getElementById('bpm').value)
  };
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sample_set.json';
  a.click();
});

document.getElementById('loadSet').addEventListener('click', () => {
  document.getElementById('setLoader').click();
});
document.getElementById('setLoader').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  const data = JSON.parse(text);
  if (data.pattern) pattern = data.pattern;
  if (data.volumes) data.volumes.forEach((v, i) => gains[i].gain.value = v);
  if (data.bpm) document.getElementById('bpm').value = data.bpm;

  // Refresh grid UI
  document.querySelectorAll('.cell').forEach(cell => {
    const r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
    if (pattern[r][c]) cell.classList.add('active'); else cell.classList.remove('active');
  });
});

// DJ Visuals
const canvas = document.getElementById('viz');
const ctx = canvas.getContext('2d');
const freqs = new Uint8Array(analyser.frequencyBinCount);
const timeData = new Uint8Array(analyser.fftSize);

let pulseEnabled = true, glowEnabled = true, spotlightEnabled = true;
document.getElementById('pulse').addEventListener('change', e => pulseEnabled = e.target.checked);
document.getElementById('glow').addEventListener('change', e => glowEnabled = e.target.checked);
document.getElementById('spotlight').addEventListener('change', e => spotlightEnabled = e.target.checked);

let beatHold = 0, beatDecay = 0.97, beatThreshold = 180, beatMaxHold = 8;
function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(freqs);
  analyser.getByteTimeDomainData(timeData);

  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);

  // Spotlight gradient
  if (spotlightEnabled) {
    const grd = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, Math.max(w,h)/1.2);
    grd.addColorStop(0, 'rgba(255,255,255,0.04)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,w,h);
  }

  // Compute bass energy
  let bass = 0;
  const bassBins =  Math.max(1, Math.floor(freqs.length * 0.08));
  for (let i=0;i<bassBins;i++) bass += freqs[i];
  bass /= bassBins;

  // Beat detect (simple)
  if (bass > beatThreshold && beatHold === 0) {
    beatHold = beatMaxHold;
  } else if (beatHold > 0) {
    beatHold--;
  }
  beatThreshold = beatThreshold * beatDecay + bass * (1 - beatDecay);

  // Bars
  const bars = 64;
  const step = Math.floor(freqs.length / bars);
  for (let i=0;i<bars;i++) {
    const mag = freqs[i*step] / 255;
    const barH = mag * (h - 20);
    const x = (i / bars) * w;
    const y = h - barH;
    if (glowEnabled) {
      ctx.shadowBlur = 10 + mag * 30;
      ctx.shadowColor = 'rgba(120,160,255,0.8)';
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.fillStyle = `rgba(${120+mag*100}, ${140+mag*80}, 255, ${0.8})`;
    ctx.fillRect(x, y, w/bars - 2, barH);
  }

  // Pulse overlay
  if (pulseEnabled && beatHold > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.fillRect(0,0,w,h);
  }

  // Waveform line
  ctx.beginPath();
  const slice = w / timeData.length;
  for (let i=0;i<timeData.length;i++) {
    const v = timeData[i] / 255;
    const y = v * h;
    const x = i * slice;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(200,220,255,0.6)';
  ctx.stroke();
}
requestAnimationFrame(draw);
