import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary';
}

export default function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`relative flex items-center justify-center overflow-hidden w-full cursor-pointer ${className ?? ''}`}
      style={{
        minHeight: 'calc(var(--spacing-5xl) + var(--spacing-xs))',
        gap: 'var(--spacing-xs)',
        padding: 'calc(var(--spacing-md) + var(--spacing-xxs)) calc(var(--spacing-xl) - var(--spacing-xxs))',
        borderRadius: 'var(--radius-md)',
        border: '2px solid rgba(255, 255, 255, 0.12)',
        boxShadow: [
          '0px 1px 2px 0px var(--color-shadow-xs)',
          'inset 0px 0px 0px 1px var(--color-shadow-skeumorphic-inner-border)',
          'inset 0px -2px 0px 0px var(--color-shadow-skeumorphic-inner)',
        ].join(', '),
      }}
      {...props}
    >
      {/* Background fill — separate layer allows pseudo-effects without overflow clipping the text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{ background: 'var(--color-bg-brand-solid)' }}
      />
      <span
        className="relative shrink-0"
        style={{
          fontFamily: 'var(--font-family-body)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--line-height-text-sm)',
          color: 'var(--color-text-white)',
          padding: '0 var(--spacing-xxs)',
        }}
      >
        {children}
      </span>
    </button>
  );
}
