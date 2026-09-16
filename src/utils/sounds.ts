let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, type: OscillatorType, duration: number, volume = 0.15, delay = 0) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch { /* silent fail */ }
}

export function soundCorrect() {
  playTone(880, "sine", 0.18, 0.12);
  playTone(1175, "sine", 0.18, 0.12, 0.09);
}

export function soundWrong() {
  playTone(180, "sawtooth", 0.28, 0.08);
}

export function soundClick() {
  playTone(520, "square", 0.06, 0.08);
}

export function soundFinish() {
  playTone(660, "sine", 0.2, 0.12);
  playTone(880, "sine", 0.2, 0.12, 0.15);
  playTone(1046, "sine", 0.3, 0.12, 0.3);
}

export function soundLevelUp() {
  playTone(523, "sine", 0.15, 0.12);
  playTone(659, "sine", 0.15, 0.12, 0.1);
  playTone(784, "sine", 0.25, 0.12, 0.2);
}

export function soundBoss() {
  playTone(110, "sawtooth", 0.3, 0.1);
  playTone(138, "sawtooth", 0.3, 0.1, 0.15);
}

export function soundBadgeUnlock() {
  playTone(784, "sine", 0.15, 0.1);
  playTone(1047, "sine", 0.2, 0.1, 0.12);
  playTone(1319, "sine", 0.3, 0.1, 0.24);
}

export function soundVictory() {
  const notes = [523, 587, 659, 784, 880, 1047];
  notes.forEach((f, i) => playTone(f, "sine", 0.2, 0.1, i * 0.1));
}

export function soundDefeat() {
  playTone(440, "sine", 0.3, 0.1);
  playTone(349, "sine", 0.3, 0.1, 0.2);
  playTone(261, "sine", 0.5, 0.1, 0.4);
}

export function soundQuizStart() {
  playTone(440, "sine", 0.15, 0.1);
  playTone(554, "sine", 0.15, 0.1, 0.12);
  playTone(659, "sine", 0.2, 0.1, 0.24);
}

export function hapticLight() {
  try { navigator.vibrate?.(50); } catch { /* silent */ }
}

export function hapticMedium() {
  try { navigator.vibrate?.(100); } catch { /* silent */ }
}

export function hapticHeavy() {
  try { navigator.vibrate?.(200); } catch { /* silent */ }
}
