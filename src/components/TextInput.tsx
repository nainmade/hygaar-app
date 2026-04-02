import { type InputHTMLAttributes, type ReactNode } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export default function TextInput({
  label,
  leadingIcon,
  trailingIcon,
  required,
  id,
  ...inputProps
}: TextInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col w-full" style={{ gap: 'var(--spacing-xxs)' }}>
      {/* Label row */}
      <div
        className="flex items-start"
        style={{
          gap: 'var(--spacing-xxs)',
          fontFamily: 'var(--font-family-body)',
          fontWeight: 'var(--font-weight-medium)',
        }}
      >
        <label
          htmlFor={inputId}
          style={{
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--line-height-text-xs)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {label}
        </label>
        {required && (
          <span
            aria-hidden="true"
            style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--line-height-text-sm)',
              color: 'var(--color-text-brand-tertiary)',
            }}
          >
            *
          </span>
        )}
      </div>

      {/* Input row */}
      <div
        className="flex items-center w-full"
        style={{
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border-primary)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0px 1px 2px 0px var(--color-shadow-xs)',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          gap: 'var(--spacing-md)',
        }}
      >
        {leadingIcon && (
          <span className="shrink-0 flex items-center" style={{ color: 'var(--color-text-placeholder)' }}>
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          required={required}
          className="flex-1 min-w-0 bg-transparent border-none outline-none"
          style={{
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--line-height-text-sm)',
            color: 'var(--color-text-placeholder)',
          }}
          {...inputProps}
        />
        {trailingIcon && (
          <span className="shrink-0 flex items-center" style={{ color: 'var(--color-text-placeholder)' }}>
            {trailingIcon}
          </span>
        )}
      </div>
    </div>
  );
}
