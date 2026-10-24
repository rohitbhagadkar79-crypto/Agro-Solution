/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#18382d',
    tint: '#e89a11',

    // Core surfaces
    background: '#f8f5ee',
    foreground: '#18382d',

    // Cards / elevated surfaces
    card: '#fffdf8',
    cardForeground: '#18382d',

    // Primary action color (buttons, links, active states)
    primary: '#1e5b45',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#f2dfb8',
    secondaryForeground: '#18382d',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#ece7da',
    mutedForeground: '#6b756c',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#e89a11',
    accentForeground: '#18382d',

    // Destructive actions (delete, error states)
    destructive: '#b94c3d',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#ded8c9',
    input: '#ded8c9',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
