# Kawaii Color System

## Overview

The kawaii blog uses a system of 8 rotating colors (`--k-1` through `--k-8`) that are applied to headings and other design elements throughout the site. These colors now have **separate palettes for dark and light modes** to ensure optimal readability and visual appeal in both themes.

## Color Palettes

### Dark Mode (Default) - Soft Pastels
These soft, pastel colors work beautifully against dark backgrounds:

| Variable | Color | Hex Code | Description |
|----------|-------|----------|-------------|
| `--k-1` | Pink | `#ffc0cb` | Soft pink |
| `--k-2` | Blue | `#a7c7e7` | Pastel blue |
| `--k-3` | Mint | `#b2f2bb` | Soft mint green |
| `--k-4` | Gold | `#ffd166` | Warm gold |
| `--k-5` | Lavender | `#c7ceea` | Soft lavender |
| `--k-6` | Peach | `#ffdac1` | Gentle peach |
| `--k-7` | Lime | `#e2f0cb` | Soft lime |
| `--k-8` | Salmon | `#ff9aa2` | Coral salmon |

### Light Mode - Deep Vibrant Colors
These saturated colors provide strong contrast on light backgrounds:

| Variable | Color | Hex Code | Description |
|----------|-------|----------|-------------|
| `--k-1` | Hot Pink | `#e91e63` | Vibrant hot pink |
| `--k-2` | Royal Blue | `#2563eb` | Deep royal blue |
| `--k-3` | Emerald | `#059669` | Rich emerald green |
| `--k-4` | Amber | `#d97706` | Warm amber/orange |
| `--k-5` | Violet | `#7c3aed` | Deep violet |
| `--k-6` | Orange | `#ea580c` | Vibrant orange |
| `--k-7` | Lime | `#65a30d` | Bright lime green |
| `--k-8` | Red | `#dc2626` | Bold red |

## Usage

### In PostLayout.astro

The colors are used in a cycling pattern for:

1. **Post Title Gradient**: Uses `--k-1` and `--k-2` for a dynamic gradient effect
2. **H2 Headings**: Each H2 cycles through all 8 colors using nth-of-type selectors
3. **H3 Headings**: Similar cycling pattern as H2s

Example:
```css
.post-title {
  background: linear-gradient(135deg, var(--k-1), var(--k-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content :global(h2):nth-of-type(8n + 1) {
  color: var(--k-1);
}
.content :global(h2):nth-of-type(8n + 2) {
  color: var(--k-2);
}
/* ... and so on through --k-8 */
```

## How It Works

1. **CSS Custom Properties**: The kawaii colors are defined as CSS custom properties (CSS variables)
2. **Theme-Aware**: The colors automatically switch when the user toggles between light and dark mode
3. **No Code Changes Needed**: All pages using these variables will automatically use the correct palette
4. **Semantic Cycling**: The nth-of-type selectors ensure headings cycle through all 8 colors in order

## Benefits of Separate Palettes

✨ **Better Readability**: Dark mode gets soft pastels, light mode gets saturated colors
🎨 **Consistent Aesthetics**: Colors are always optimized for their background
♿ **Improved Accessibility**: Better contrast ratios in both modes
🌈 **Cohesive Design**: The color relationships remain consistent across themes

## Implementation Details

The color definitions are in [`global.css`](file:///c:/Users/Kawaiisan/Projects/kawaiiblog%202.0/src/styles/global.css):

- **Lines 30-47**: Dark mode palette (in `:root`)
- **Lines 62-76**: Light mode palette (in `[data-theme="light"]`)

The colors are applied in [`PostLayout.astro`](file:///c:/Users/Kawaiisan/Projects/kawaiiblog%202.0/src/layouts/PostLayout.astro):

- **Line 117**: Title gradient
- **Lines 143-166**: H2 cycling
- **Lines 174-197**: H3 cycling

## Future Enhancements

You could extend this system to:
- Apply kawaii colors to other elements (tags, categories, etc.)
- Use the colors for animated backgrounds or decorative elements
- Create themed color variations (e.g., seasonal palettes)
- Add smooth color transitions when switching themes
