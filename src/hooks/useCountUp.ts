import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook that animates a number from 0 to a target value.
 * Uses requestAnimationFrame for smooth performance.
 * 
 * @param end - The target number to count up to.
 * @param duration - Animation duration in milliseconds (default: 2000).
 * @returns The current animated count value.
 */
export function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const runtime = timestamp - startTime;
      const relativeProgress = Math.min(runtime / duration, 1);
      
      // Easing function: easeOutExpo (optional, but makes it feel more "premium")
      // If linear is preferred, just use relativeProgress
      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };
      
      const easedProgress = easeOutExpo(relativeProgress);
      const currentCount = Math.floor(easedProgress * end);
      
      if (countRef.current !== currentCount) {
        setCount(currentCount);
        countRef.current = currentCount;
      }

      if (runtime < duration) {
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    // Reset and start animation
    startTime = null;
    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration]);

  return count;
}
