// Asset URL from Figma — expires 7 days from generation (2026-04-02)
// Replace with a versioned asset in /public when stabilised
const imgLogoMark = 'https://www.figma.com/api/mcp/asset/bf28f252-3eeb-4dd2-8b98-4a7595421305';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div
      className={`flex items-center shrink-0 ${className ?? ''}`}
      style={{ gap: 'var(--spacing-md)' }}
    >
      <img
        src={imgLogoMark}
        alt=""
        aria-hidden="true"
        className="shrink-0"
        style={{ width: 32, height: 32, objectFit: 'contain' }}
      />
      <span
        style={{
          fontFamily: 'var(--font-family-display)',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--text-xl)',
          lineHeight: 'var(--line-height-text-xl)',
          color: 'var(--color-text-primary)',
          whiteSpace: 'nowrap',
        }}
      >
        Hygaar
      </span>
    </div>
  );
}
