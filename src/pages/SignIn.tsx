import Logo from '../components/Logo';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

// ---------------------------------------------------------------------------
// Icon assets from Figma MCP (URLs expire 7 days from 2026-04-02)
// Replace with versioned assets in /public when stabilised
// ---------------------------------------------------------------------------
const imgMailIcon   = 'https://www.figma.com/api/mcp/asset/d693d5b4-7008-4802-a15c-1b0b7d5b4035';
const imgLockIcon   = 'https://www.figma.com/api/mcp/asset/2df3ced0-8c5f-42ad-8dec-941fb4a6d231';
const imgHelpIcon   = 'https://www.figma.com/api/mcp/asset/9f011147-9b34-4133-933b-32d5bf7862e9';
// Google icon — 4 colour vectors composited inside a 24×24 container
const imgGoogleR    = 'https://www.figma.com/api/mcp/asset/a4868bfc-ef4c-4ba4-bd33-1707b490d69c';
const imgGoogleB    = 'https://www.figma.com/api/mcp/asset/adff59ba-4970-4fbf-8f62-ab03ec535602';
const imgGoogleG    = 'https://www.figma.com/api/mcp/asset/558d758c-c0b6-4df6-a5d5-cfa219467188';
const imgGoogleY    = 'https://www.figma.com/api/mcp/asset/f2354ae1-efa0-4c67-a4a2-f7b38529fe6a';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Composite Google logo mark — replicates the 4-vector Figma structure. */
function GoogleIcon() {
  return (
    <div className="relative shrink-0" style={{ width: 24, height: 24 }}>
      {/* Red — top-right quadrant */}
      <img alt="" className="absolute block max-w-none w-full h-full"
        style={{ inset: '41% 1% 12% 51%' }} src={imgGoogleR} />
      {/* Blue — bottom half */}
      <img alt="" className="absolute block max-w-none w-full h-full"
        style={{ inset: '60% 16% 0 6%' }} src={imgGoogleB} />
      {/* Green — left strip */}
      <img alt="" className="absolute block max-w-none w-full h-full"
        style={{ inset: '28% 77% 28% 1%' }} src={imgGoogleG} />
      {/* Yellow — top-left */}
      <img alt="" className="absolute block max-w-none w-full h-full"
        style={{ inset: '0 16% 60% 6%' }} src={imgGoogleY} />
    </div>
  );
}

/** "or" divider row */
function OrDivider() {
  return (
    <div className="flex items-center w-full" style={{ gap: 11 }}>
      <div
        className="flex-1 h-px"
        style={{ background: 'var(--color-border-primary)' }}
      />
      <span
        style={{
          fontFamily: 'var(--font-family-body)',
          fontWeight: 'var(--font-weight-regular)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-quaternary)', /* TODO: Figma spec is #9fabbb, no exact token match */
          whiteSpace: 'nowrap',
        }}
      >
        or
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: 'var(--color-border-primary)' }}
      />
    </div>
  );
}

/** Google SSO button */
function GoogleButton() {
  return (
    <button
      type="button"
      className="relative flex items-center justify-center w-full overflow-hidden cursor-pointer"
      style={{
        gap: 'var(--spacing-lg)',
        padding: '10px var(--spacing-xl)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-primary)',
        boxShadow: [
          '0px 1px 2px 0px var(--color-shadow-xs)',
          'inset 0px 0px 0px 1px var(--color-shadow-skeumorphic-inner-border)',
          'inset 0px -2px 0px 0px var(--color-shadow-skeumorphic-inner)',
        ].join(', '),
      }}
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{ background: 'var(--color-bg-primary)' }}
      />
      <GoogleIcon />
      <span
        className="relative shrink-0"
        style={{
          fontFamily: 'var(--font-family-body)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--text-md)',
          lineHeight: 'var(--line-height-text-md)',
          color: 'var(--color-text-secondary)',
          whiteSpace: 'nowrap',
        }}
      >
        Sign in with Google
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SignIn() {
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background: 'linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)',
        paddingTop: 120,
        paddingBottom: 60,
        paddingLeft: 'var(--spacing-xl)',
        paddingRight: 'var(--spacing-xl)',
      }}
    >
      {/* Sign-in card */}
      <div
        className="flex flex-col w-full"
        style={{
          maxWidth: 480,
          background: 'var(--color-bg-primary)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--spacing-5xl)',
          gap: 'var(--spacing-4xl)',
          boxShadow: [
            '0px 1px 3px 0px var(--color-shadow-sm-01)',
            '0px 1px 2px -1px var(--color-shadow-sm-02)',
          ].join(', '),
        }}
      >
        {/* Logo */}
        <Logo />

        {/* Heading */}
        <div className="flex flex-col w-full" style={{ gap: 0 }}>
          <h1
            style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--display-sm)',
              lineHeight: 'var(--line-height-display-sm)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-family-body)',
              fontWeight: 'var(--font-weight-regular)',
              fontSize: 'var(--text-md)',
              lineHeight: 'var(--line-height-text-md)',
              color: 'var(--color-text-tertiary-hover)',
              margin: 0,
            }}
          >
            Sign in to your Hygaar account
          </p>
        </div>

        {/* Form */}
        <form
          className="flex flex-col items-center w-full"
          style={{ gap: 'var(--spacing-3xl)' }}
          onSubmit={e => e.preventDefault()}
        >
          {/* Fields */}
          <div
            className="flex flex-col w-full"
            style={{ gap: 'var(--spacing-xl)' }}
          >
            <TextInput
              label="Email"
              type="email"
              placeholder="you@mail.com"
              required
              autoComplete="email"
              leadingIcon={
                <img src={imgMailIcon} alt="" style={{ width: 20, height: 20 }} />
              }
            />

            <TextInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              leadingIcon={
                <img src={imgLockIcon} alt="" style={{ width: 20, height: 20 }} />
              }
              trailingIcon={
                <img src={imgHelpIcon} alt="Password hint" style={{ width: 16, height: 16 }} />
              }
            />

            {/* Forgot password */}
            <div className="flex justify-end w-full">
              <button
                type="button"
                className="bg-transparent border-none p-0 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-fg-brand-primary)',
                  whiteSpace: 'nowrap',
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex flex-col items-start w-full"
            style={{ gap: 'var(--spacing-lg)' }}
          >
            <Button type="submit">Sign in</Button>
            <OrDivider />
            <GoogleButton />
          </div>

          {/* Footer */}
          <div
            className="flex items-center"
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--text-sm)',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--color-text-tertiary-hover)',
              }}
            >
              Don't have an account?{' '}
            </span>
            <button
              type="button"
              className="bg-transparent border-none p-0 cursor-pointer"
              style={{
                fontFamily: 'var(--font-family-body)',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-fg-brand-primary)',
              }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
