/**
 * Utilitário de áudio sintetizado nativo via Web Audio API
 * Produz um sinal sonoro delicado (chime de acolhimento) sem arquivos externos
 */

export function playGentleChime(): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // Se o contexto estiver suspenso por política do navegador, tenta resumir
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Oscilador 1: Tom base doce (Re5 ~ 587.33Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // desliza suavemente para La5

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.04); // volume suave
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Oscilador 2: Harmônico de brilho (Fa#5 ~ 739.99Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(739.99, now + 0.08);

    gain2.gain.setValueAtTime(0, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.65);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.75);

    // Fecha o contexto após o término para liberar recursos
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1000);
  } catch {
    // Silently ignore if audio is blocked
  }
}
