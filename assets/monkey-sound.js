/* A small, original cartoon monkey call. Audio starts only after a deliberate poke. */
(() => {
  'use strict';
  let context, silence;
  function stop() { if (silence) silence(); }
  async function play() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    stop();
    try {
      context ||= new Audio();
      await context.resume();
      if (context.state !== 'running') return;
      const start = context.currentTime + .015;
      const master = context.createGain();
      master.gain.value = .22;
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -18; limiter.ratio.value = 6;
      master.connect(limiter); limiter.connect(context.destination);
      silence = () => {
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setTargetAtTime(0, context.currentTime, .025);
      };
      function voice(at, length, pitch, endPitch, volume, type = 'sawtooth') {
        const t = start + at;
        const source = context.createOscillator();
        const throat = context.createBiquadFilter();
        const envelope = context.createGain();
        source.type = type;
        source.frequency.setValueAtTime(pitch, t);
        source.frequency.exponentialRampToValueAtTime(Math.max(60, endPitch), t + length);
        throat.type = type === 'sine' ? 'lowpass' : 'bandpass';
        throat.frequency.setValueAtTime(type === 'sine' ? 2400 : 1250, t);
        throat.Q.value = .85;
        envelope.gain.setValueAtTime(.0001, t);
        envelope.gain.exponentialRampToValueAtTime(volume, t + .018);
        envelope.gain.exponentialRampToValueAtTime(.0001, t + length);
        source.connect(throat); throat.connect(envelope); envelope.connect(master);
        source.start(t); source.stop(t + length + .025);
        source.onended = () => { source.disconnect(); throat.disconnect(); envelope.disconnect(); };
      }
      // Uneven nasal "ook-ook!", a surprised squeal, then a falling pitch.
      voice(0, .12, 245, 190, .42);
      voice(.14, .14, 285, 210, .38);
      voice(.31, .22, 540, 760, .28);
      voice(.50, .48, 620, 110, .22);
      // A soft ascending sparkle accompanies the soul's return.
      voice(2.95, .60, 659, 662, .16, 'sine');
      voice(3.10, .65, 988, 991, .13, 'sine');
      voice(3.25, .75, 1318, 1321, .10, 'sine');
      setTimeout(() => { master.disconnect(); limiter.disconnect(); }, 5500);
    } catch (_) { /* A browser audio restriction must never interrupt the animation. */ }
  }
  window.GyanMonkeySound = { play, stop };
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
})();
