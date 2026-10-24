import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger?: boolean;
}

export function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f59e0b', '#8b5cf6', '#06b6d4', '#10b981']
  });
}

export default function Confetti({ trigger }: ConfettiProps) {
  useEffect(() => {
    if (trigger) {
      triggerConfetti();
    }
  }, [trigger]);

  return null;
}
