import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export function LandingSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        {eyebrow ? <p className="mb-3 text-xs uppercase tracking-[0.24em] text-indigo-300">{eyebrow}</p> : null}
        <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
        {description ? <p className="mt-4 max-w-2xl text-slate-300">{description}</p> : null}
      </motion.div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function LandingCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className={clsx(
        'rounded-2xl border border-white/15 bg-white/8 p-5 shadow-[0_10px_50px_rgba(2,6,23,0.35)] backdrop-blur-xl transition-all duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function PrimaryButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button
      className={clsx(
        'rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-105 hover:bg-indigo-400',
        className
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button
      className={clsx(
        'rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white/10',
        className
      )}
    >
      {children}
    </button>
  );
}
