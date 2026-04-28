import { useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "../../hooks/useCountUp";

interface CounterProps {
  from?: number; // Kept for API compatibility, though hook starts from 0 as requested
  to: number;
  duration?: number;
  suffix?: string;
}

export const Counter = ({ to, duration = 2000, suffix = "" }: CounterProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  // Only pass 'to' when inView is true, otherwise pass 0 to keep it static until visible
  const count = useCountUp(inView ? to : 0, duration);

  return <span ref={ref}>{count}{suffix}</span>;
};
