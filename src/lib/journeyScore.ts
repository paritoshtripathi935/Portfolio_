/**
 * Ambient score for /journey, synthesised with Web Audio — no audio files to host or license.
 * A pad, bass and soft arpeggio move through vi–IV–I–V (Am, F, C, G), one chord per scene;
 * scene changes get a filtered-noise whoosh.
 */

// Semitones from A4 (440 Hz). Each chord: four pad notes (with an added 9th) and a bass root.
const CHORDS = [
  { pad: [-12, -9, -5, 2], bass: -36 }, // Am(add9)
  { pad: [-16, -12, -9, -2], bass: -40 }, // F(add9)
  { pad: [-9, -5, -2, 5], bass: -33 }, // C(add9)
  { pad: [-14, -10, -7, 0], bass: -38 }, // G(add9)
];
const hz = (semi: number) => 440 * 2 ** (semi / 12);
const VOLUME = 0.2;
const EIGHTH = 60 / 84 / 2; // arpeggio at 84 bpm

export type Score = {
  /** Resolves true once audio is actually running (needs a user gesture on most browsers). */
  start(): Promise<boolean>;
  chord(index: number): void;
  whoosh(): void;
  pause(): void;
  resume(): void;
  mute(muted: boolean): void;
  dispose(): void;
};

export const createScore = (): Score | null => {
  const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!Ctx) return null;
  const ctx: AudioContext = new Ctx();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.createDynamicsCompressor()).connect(ctx.destination);

  // Generated impulse response: decaying noise reads as a large, soft room.
  const verb = ctx.createConvolver();
  const len = ctx.sampleRate * 3.5;
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.5;
  }
  verb.buffer = ir;
  const wet = ctx.createGain();
  wet.gain.value = 0.5;
  verb.connect(wet).connect(master);

  const bus = ctx.createGain();
  bus.connect(master);
  bus.connect(verb);
  const warm = ctx.createBiquadFilter();
  warm.type = "lowpass";
  warm.frequency.value = 1100;
  warm.connect(bus);

  let held: { stop(at: number): void }[] = [];
  let current = -1;
  let muted = false;
  let running = false;
  let nextNote = 0;
  let step = 0;
  let timer = 0;

  const sustain = (freq: number, type: OscillatorType, peak: number, dest: AudioNode, detune = 0) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 1.6);
    osc.connect(g).connect(dest);
    osc.start(t);
    return {
      stop(at: number) {
        g.gain.cancelScheduledValues(at);
        g.gain.setValueAtTime(g.gain.value, at);
        g.gain.linearRampToValueAtTime(0, at + 2);
        osc.stop(at + 2.1);
      },
    };
  };

  const pluck = (freq: number, at: number) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(0.05, at + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.9);
    osc.connect(g).connect(bus);
    osc.start(at);
    osc.stop(at + 1);
  };

  const schedule = () => {
    if (current < 0) return;
    const notes = CHORDS[current % CHORDS.length].pad;
    while (nextNote < ctx.currentTime + 0.12) {
      // Up and back down the chord, an octave above the pad.
      const order = [0, 1, 2, 3, 2, 1];
      pluck(hz(notes[order[step % order.length]] + 12), nextNote);
      nextNote += EIGHTH;
      step++;
    }
  };

  return {
    async start() {
      try {
        await ctx.resume();
      } catch (_) {}
      if (ctx.state !== "running") return false;
      if (!running) {
        running = true;
        nextNote = ctx.currentTime + 0.1;
        timer = window.setInterval(schedule, 25);
        if (!muted) master.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 2);
      }
      return true;
    },
    chord(index) {
      if (index === current) return;
      current = index;
      const t = ctx.currentTime;
      held.forEach((v) => v.stop(t));
      const c = CHORDS[index % CHORDS.length];
      held = [
        ...c.pad.flatMap((n) => [sustain(hz(n), "sawtooth", 0.022, warm, -7), sustain(hz(n), "sawtooth", 0.022, warm, 7)]),
        sustain(hz(c.bass), "sine", 0.12, bus),
      ];
    },
    whoosh() {
      if (!running) return;
      const t = ctx.currentTime;
      const dur = 1.1;
      const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = 1.2;
      band.frequency.setValueAtTime(300, t);
      band.frequency.exponentialRampToValueAtTime(2800, t + dur * 0.45);
      band.frequency.exponentialRampToValueAtTime(500, t + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.09, t + dur * 0.45);
      g.gain.linearRampToValueAtTime(0, t + dur);
      src.connect(band).connect(g).connect(bus);
      src.start(t);
    },
    pause() {
      ctx.suspend();
    },
    resume() {
      if (running) ctx.resume();
    },
    mute(m) {
      muted = m;
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(m ? 0 : VOLUME, t + 0.6);
    },
    dispose() {
      clearInterval(timer);
      ctx.close();
    },
  };
};
