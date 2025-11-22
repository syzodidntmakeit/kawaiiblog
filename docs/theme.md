# KawaiiReview Theme Documentation

This document captures the visual identity, design system, and "vibe" of the KawaiiReview website. It is intended as a reference for applying this theme to other projects.

## 1. Core Identity & Vibe
- **Aesthetic:** "Dark Pastel Cyberpunk" / "Soft Neon Noir".
- **Atmosphere:** Moody but approachable. A deep, dark background allows pastel accents to pop without being blinding. It feels like a late-night chill session.
- **Tone:** "No-bullshit", authentic, slightly edgy but playful.
    - *Example Copy:* "All wrongs reserved.", "Don't be a bitch." (Footer)
    - *Keywords:* Authentic, Direct, Cozy, Dark.

## 2. Color Palette
The theme relies on a high-contrast combination of a very dark violet/navy background and soft pastel accents.

### CSS Variables (Design Tokens)
Defined in `:root`:

| Variable | Hex Value | Usage |
| :--- | :--- | :--- |
| `--bg` | `#0d011f` | **Main Background**. Deep violet/black. |
| `--text` | `#e5e7eb` | **Primary Text**. Off-white/Light gray (readable on dark). |
| `--muted` | `#9ca3af` | **Secondary Text**. Muted gray for metadata, footers. |
| `--card` | `rgba(31, 41, 55, 0.6)` | **Card Background**. Semi-transparent dark gray. |
| `--pink` | `#ffc0cb` | **Primary Accent**. Links, buttons, borders, focus rings. |
| `--blue` | `#a7c7e7` | **Secondary Accent**. Gradients, decorative elements. |
| `--mint` | `#b2f2bb` | **Tertiary Accent**. Success states, runtime chips. |
| `--gold` | `#ffd166` | **Highlight Accent**. Review scores, stars. |

### Usage Patterns
- **Glassmorphism:** `rgba` colors are frequently used with `backdrop-filter: blur(10px)` for navigation and overlays.
- **Gradients:** Subtle gradients (e.g., `linear-gradient(120deg, rgba(167, 199, 231, 0.18), rgba(255, 192, 203, 0.08))`) are used on hero sections to add depth without overwhelming the dark theme.
- **Shadows:** Colored shadows (e.g., `box-shadow: 0 10px 30px rgba(255, 192, 203, 0.12)`) create a "glow" effect.

## 3. Typography
- **Primary Font:** `'Nunito', sans-serif` (Google Fonts).
    - Used for almost everything: Body, Headings, UI elements.
    - Weights: 400 (Regular), 700 (Bold), 900 (Black).
    - *Vibe:* Rounded, friendly, modern. Balances the "edgy" dark theme.
- **Secondary/Code Font:** `'VT323', monospace` (Imported).
    - *Potential Use:* Retro/Terminal style accents (though primarily Nunito is observed in active UI).

## 4. Layout & Structure
- **Container:** `max-width: 1200px`, centered with `padding: 0 1rem`.
- **Navigation:** Sticky top bar (`position: sticky`), glassmorphism effect (`backdrop-filter: blur(10px)`), bottom border with low opacity pink (`rgba(255, 192, 203, 0.25)`).
- **Spacing:** Generous padding (`padding: 3rem 0` for main content).
- **Cards:**
    - Grid layouts (`grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`).
    - Horizontal scroll strips for mobile/featured lists (`overflow-x: auto`, `scroll-snap-type: x mandatory`).

## 5. UI Components & Interactive Elements

### Buttons & Links
- **Primary Button/Link:**
    - Background: Transparent or semi-transparent.
    - Border: `1px solid rgba(255, 192, 203, 0.4)`.
    - Text: Pink (`var(--pink)`).
    - Hover: Transforms to solid Pink background with Dark text.
    - Radius: `border-radius: 10px` or `999px` (pill shape).
- **"See More" Link:** Outline style, pill shape, pink text.

### Cards (Reviews/Items)
- **Background:** `var(--card)` (Semi-transparent).
- **Border:** Thin, low-opacity pink (`1px solid rgba(255, 192, 203, 0.28)`).
- **Radius:** `14px`.
- **Hover Effect:**
    - Translates up (`transform: translateY(-4px)`).
    - Border becomes solid pink.
    - Adds a "glow" shadow.
- **Images:**
    - Portrait (Anime): Aspect ratio `9 / 16`.
    - Square (Albums): Aspect ratio `1 / 1`.
    - Shadow: Deep drop shadow (`box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3)`).

### Chips & Tags
- **Style:** Pill-shaped (`border-radius: 999px`).
- **Background:** Gradient (`linear-gradient(135deg, rgba(255, 192, 203, 0.35), rgba(15, 7, 33, 0.85))`).
- **Border:** Thin white/transparent (`1px solid rgba(255, 255, 255, 0.12)`).
- **Text:** Uppercase, bold, small (`font-size: 0.78rem`).

### Review Score Ring
- **Visual:** SVG Circle with stroke-dasharray animation.
- **Color:** Pink stroke on a faint white track.
- **Value:** Large, centered number (`font-size: 2rem`, `font-weight: 900`).

## 6. Accessibility & Polish
- **Focus States:** High visibility.
    - `outline: 3px solid var(--pink)` with `outline-offset: 3px`.
- **Skip Link:** "Skip to main content" button hidden off-screen, slides down on focus. Pink background, dark text.
- **Scroll to Top:** Floating button, bottom-right, pink, appears on scroll.

## 7. Implementation Snippets (CSS)

```css
:root {
  --bg: #0d011f;
  --text: #e5e7eb;
  --pink: #ffc0cb;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Nunito', sans-serif;
}

.card {
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(255, 192, 203, 0.28);
  border-radius: 14px;
  transition: transform 0.18s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--pink);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.35), 0 10px 30px rgba(255, 192, 203, 0.12);
}
```
