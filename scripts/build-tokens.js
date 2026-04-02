#!/usr/bin/env node
/**
 * Token compiler — converts src/tokens/*.json into src/styles/tokens.css
 *
 * File roles:
 *   Style.tokens.json        → Tier 1 primitive color palette
 *   Light mode.tokens.json   → Tier 2 semantic colors (light, default)
 *   Dark mode.tokens.json    → Tier 2 semantic colors (dark mode overrides)
 *   tokens.json              → Tier 2 spacing scale
 *   Mode 1.tokens.json       → Tier 2 border radius scale
 *   Mode 1.tokens 3.json     → Tier 2 width / breakpoint scale
 *   Value.tokens.json        → Tier 2 layout tokens (container)
 *   Value.tokens 2.json      → Tier 2 typography (font family, size, line height, weight)
 */

const fs   = require('fs');
const path = require('path');

const TOKENS_DIR  = path.join(__dirname, '../src/tokens');
const OUTPUT_FILE = path.join(__dirname, '../src/styles/tokens.css');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Slugify a single segment.
 * By default strips all parentheticals: "text-primary (900)" → "text-primary"
 * Set keepMode=true to map mode qualifiers:
 *   "Gray (light mode)" → "gray"   (light is the default, no suffix)
 *   "Gray (dark mode)"  → "gray-dark"
 *   "Gray (alpha)"      → "gray-alpha"
 */
function slug(str, keepMode = false) {
  if (keepMode) {
    str = str
      .replace(/\(light\s+mode\)/i, '')                    // strip "(light mode)" — default
      .replace(/\(dark\s+mode\s+alpha\)/i, ' dark alpha')  // "(dark mode alpha)"
      .replace(/\(dark\s+mode\)/i, ' dark')                // "(dark mode)"
      .replace(/\(alpha\)/i, ' alpha');                    // "(alpha)"
    // Strip any remaining parentheticals
    str = str.replace(/\s*\([^)]*\)/g, '');
  } else {
    str = str.replace(/\s*\([^)]*\)/g, '');
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Map Figma aliasData.targetVariableName → CSS custom property name.
 * Uses keepMode=true so palette variants stay distinct.
 *
 * "Colors/Gray (light mode)/900"  → "--color-gray-900"
 * "Colors/Gray (dark mode)/900"   → "--color-gray-dark-900"
 * "Colors/Gray (alpha)/500"       → "--color-gray-alpha-500"
 * "Colors/Base/white"             → "--color-base-white"
 * "Colors/Brand/600"              → "--color-brand-600"
 */
function primitiveCssVar(figmaPath) {
  const parts = figmaPath.split('/').map(p => slug(p, true)).filter(Boolean);
  if (parts[0] === 'colors') {
    return '--color-' + parts.slice(1).join('-');
  }
  return '--' + parts.join('-');
}

function readJson(filename) {
  const p = path.join(TOKENS_DIR, filename);
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (_) {
    console.warn(`  [warn] could not read ${filename}`);
    return null;
  }
}

/** Recursively flatten nested token objects to [{ path[], token }] */
function flatten(obj, pathParts = []) {
  const result = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key === '$extensions' || key.startsWith('$')) continue;
    if (val && val.$type !== undefined) {
      result.push({ path: [...pathParts, key], token: val });
    } else if (val && typeof val === 'object') {
      result.push(...flatten(val, [...pathParts, key]));
    }
  }
  return result;
}

function getHex(token) {
  const v = token.$value;
  if (typeof v === 'string' && v.startsWith('#')) return v;
  if (v && v.hex) return v.hex;
  return null;
}

function getAlpha(token) {
  const v = token.$value;
  return (v && typeof v === 'object' && v.alpha !== undefined) ? v.alpha : 1;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = Math.round(alpha * 1000) / 1000;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Returns the CSS value for a color token.
 * If the token has aliasData it returns var(--color-primitive-ref).
 * Otherwise it returns the hex (or rgba for alpha < 1).
 */
function colorValue(token, useAlias = true) {
  const alpha = getAlpha(token);
  const hex   = getHex(token);
  const alias = token.$extensions?.['com.figma.aliasData'];

  if (useAlias && alias?.targetVariableName) {
    if (alpha < 1 && hex) return hexToRgba(hex, alpha);
    return `var(${primitiveCssVar(alias.targetVariableName)})`;
  }

  if (alpha < 1 && hex) return hexToRgba(hex, alpha);
  return hex || 'transparent';
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildPrimitives() {
  const data = readJson('Style.tokens.json');
  if (!data) return [];
  return flatten(data)
    .filter(({ token }) => token.$type === 'color')
    .map(({ path, token }) => {
      // Use keepMode=true for palette group names so "Gray (dark mode)" → "gray-dark"
      const parts = path.map((p, i) => slug(p, i > 0)).filter(Boolean);
      // ["colors","base","white"] or ["colors","gray-dark","900"]
      const name  = '--color-' + parts.slice(1).join('-');
      const alpha = getAlpha(token);
      const hex   = getHex(token);
      const val   = (alpha < 1 && hex) ? hexToRgba(hex, alpha) : (hex || 'transparent');
      return `  ${name}: ${val};`;
    });
}

function buildSpacing() {
  const data = readJson('tokens.json');
  if (!data) return [];
  return flatten(data)
    .filter(({ token }) => token.$type === 'number')
    .map(({ path, token }) => {
      const key = path[path.length - 1]; // already "spacing-xxs" etc.
      return `  --${key}: ${token.$value}px;`;
    });
}

function buildRadius() {
  const data = readJson('Mode 1.tokens.json');
  if (!data) return [];
  return flatten(data)
    .filter(({ token }) => token.$type === 'number')
    .map(({ path, token }) => {
      const key = path[path.length - 1]; // "radius-none", "radius-full" etc.
      const px  = token.$value === 9999 ? '9999px' : `${token.$value}px`;
      return `  --${key}: ${px};`;
    });
}

function buildWidths() {
  const data = readJson('Mode 1.tokens 3.json');
  if (!data) return [];
  return flatten(data)
    .filter(({ token }) => token.$type === 'number')
    .map(({ path, token }) => {
      const key = path[path.length - 1]; // "width-xxs", "paragraph-max-width"
      return `  --${key}: ${token.$value}px;`;
    });
}

function buildLayout() {
  const data = readJson('Value.tokens.json');
  if (!data) return [];
  return flatten(data)
    .filter(({ token }) => token.$type === 'number')
    .map(({ path, token }) => {
      const key = path[path.length - 1];
      return `  --${key}: ${token.$value}px;`;
    });
}

function buildTypography() {
  const data = readJson('Value.tokens 2.json');
  if (!data) return [];
  const lines = [];
  const weightMap = {
    regular: '400', 'regular-italic': '400',
    medium: '500', 'medium-italic': '500',
    semibold: '600', 'semibold-italic': '600',
    bold: '700', 'bold-italic': '700',
  };

  for (const { path, token } of flatten(data)) {
    const category = path[0];  // "Font family", "Font size", "Line height", "Font weight"
    const key      = path[path.length - 1]; // leaf key

    if (category === 'Font family') {
      lines.push(`  --${key}: '${token.$value}', sans-serif;`);

    } else if (category === 'Font size') {
      // key is already "text-sm", "display-xl" etc. — matches CLAUDE.md convention
      lines.push(`  --${key}: ${token.$value}px;`);

    } else if (category === 'Line height') {
      // Prefix with "line-height-" to avoid clashing with font size keys
      lines.push(`  --line-height-${key}: ${token.$value}px;`);

    } else if (category === 'Font weight') {
      const w = weightMap[slug(key)] ?? token.$value;
      lines.push(`  --font-weight-${slug(key)}: ${w};`);
    }
  }
  return lines;
}

function buildSemanticColors(filename, useAlias = true) {
  const data = readJson(filename);
  if (!data) return [];
  return flatten(data)
    .filter(({ token }) => token.$type === 'color')
    .map(({ path, token }) => {
      const key  = path[path.length - 1];
      const name = '--color-' + slug(key);
      return `  ${name}: ${colorValue(token, useAlias)};`;
    });
}

// ---------------------------------------------------------------------------
// Assemble
// ---------------------------------------------------------------------------

const sections = {
  primitives:   buildPrimitives(),
  spacing:      buildSpacing(),
  radius:       buildRadius(),
  widths:       buildWidths(),
  layout:       buildLayout(),
  typography:   buildTypography(),
  lightColors:  buildSemanticColors('Light mode.tokens.json'),
  darkColors:   buildSemanticColors('Dark mode.tokens.json'),
};

const today = new Date().toISOString().split('T')[0];

const css = `/* =============================================================================
   Hygaar Design Tokens
   Auto-generated from src/tokens/ — DO NOT EDIT MANUALLY
   Re-generate: node scripts/build-tokens.js
   Source: Figma Hygaar UI-Kit
   Generated: ${today}

   3-TIER TOKEN SYSTEM
   Tier 1 — Primitives  : raw palette values  (--color-gray-900, --color-brand-600)
   Tier 2 — Semantic    : intent-based aliases (--color-text-primary, --spacing-lg)
   Tier 3 — Component   : scoped overrides defined inside each component's CSS
   ============================================================================= */

/* ---------------------------------------------------------------------------
   Google Fonts — Onest (display/heading) + Inter (body)
   @import rules must precede all other rules.
   --------------------------------------------------------------------------- */
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Onest:wght@400;500;600;700&display=swap');

@import "tailwindcss";

/* ---------------------------------------------------------------------------
   Tier 1 — Primitive color palette
   Never use these directly in components — reference via semantic aliases.
   --------------------------------------------------------------------------- */
:root {
${sections.primitives.join('\n')}
}

/* ---------------------------------------------------------------------------
   Tier 2 — Spacing scale
   --------------------------------------------------------------------------- */
:root {
${sections.spacing.join('\n')}
}

/* ---------------------------------------------------------------------------
   Tier 2 — Border radius scale
   --------------------------------------------------------------------------- */
:root {
${sections.radius.join('\n')}
}

/* ---------------------------------------------------------------------------
   Tier 2 — Width / breakpoint scale
   --------------------------------------------------------------------------- */
:root {
${sections.widths.join('\n')}
}

/* ---------------------------------------------------------------------------
   Tier 2 — Layout tokens
   --------------------------------------------------------------------------- */
:root {
${sections.layout.join('\n')}
}

/* ---------------------------------------------------------------------------
   Tier 2 — Typography scale
   --------------------------------------------------------------------------- */
:root {
${sections.typography.join('\n')}
}

/* ---------------------------------------------------------------------------
   Tier 2 — Semantic color tokens  (light mode — default)
   --------------------------------------------------------------------------- */
:root {
${sections.lightColors.join('\n')}
}

/* ---------------------------------------------------------------------------
   Tier 2 — Semantic color tokens  (dark mode)
   --------------------------------------------------------------------------- */
@media (prefers-color-scheme: dark) {
  :root {
${sections.darkColors.map(l => '  ' + l).join('\n')}
  }
}

[data-theme="dark"] {
${sections.darkColors.join('\n')}
}
`;

fs.writeFileSync(OUTPUT_FILE, css, 'utf8');

console.log(`✓ tokens.css written to ${OUTPUT_FILE}`);
console.log(`  Tier 1 primitives : ${sections.primitives.length} vars`);
console.log(`  Spacing           : ${sections.spacing.length} vars`);
console.log(`  Radius            : ${sections.radius.length} vars`);
console.log(`  Widths            : ${sections.widths.length} vars`);
console.log(`  Layout            : ${sections.layout.length} vars`);
console.log(`  Typography        : ${sections.typography.length} vars`);
console.log(`  Semantic (light)  : ${sections.lightColors.length} vars`);
console.log(`  Semantic (dark)   : ${sections.darkColors.length} vars`);
