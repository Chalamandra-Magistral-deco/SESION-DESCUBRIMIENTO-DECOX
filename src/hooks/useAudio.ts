import { useRef, useCallback } from 'react';

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTick = useCallback((frequency = 880, type: OscillatorType = 'sine', duration = 0.05) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio playback fallback
    }
  }, [getAudioContext]);

  const playSuccessChime = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
      });
    } catch (e) {}
  }, [getAudioContext]);

  const playBinauralDrone = useCallback((baseFreq = 200, beatFreq = 10, durationSec = 10) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return () => {};

      const oscLeft = ctx.createOscillator();
      const oscRight = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);
      const gain = ctx.createGain();

      oscLeft.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      oscRight.frequency.setValueAtTime(baseFreq + beatFreq, ctx.currentTime);

      oscLeft.type = 'sine';
      oscRight.type = 'sine';

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + durationSec);

      oscLeft.connect(merger, 0, 0); // Left channel
      oscRight.connect(merger, 0, 1); // Right channel
      merger.connect(gain);
      gain.connect(ctx.destination);

      oscLeft.start();
      oscRight.start();

      oscLeft.stop(ctx.currentTime + durationSec);
      oscRight.stop(ctx.currentTime + durationSec);

      return () => {
        try {
          oscLeft.stop();
          oscRight.stop();
        } catch (e) {}
      };
    } catch (e) {
      return () => {};
    }
  }, [getAudioContext]);

  return {
    playTick,
    playSuccessChime,
    playBinauralDrone
  };
}
