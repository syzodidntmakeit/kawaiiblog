# KawaiiBlog Theme Guide 🌸

A comprehensive guide to understanding the visual identity, tone, and aesthetic of the KawaiiBlog 2.0 project.

---

## 🎨 Core Aesthetic

**Dark Pastel Cyberpunk** - A unique fusion of soft kawaii aesthetics with cyberpunk edge. Think neon-lit Tokyo streets meets pastel Instagram feeds. The visual language balances between playful cuteness and moody, atmospheric depth.

### Design Philosophy
- **Glassmorphism** - Translucent cards with backdrop blur effects
- **Cycling Gradients** - Dynamic color rotation through headings
- **Soft Edges** - Rounded corners (10px-14px) throughout
- **Minimal Motion** - Subtle (0.18s) transitions, not overwhelming
- **Mobile-First** - Responsive from 320px to 1200px+

---

## 🌈 Color Palettes

### Dark Mode (Default)
**Background Vibes**: Deep purple-black `#0d011f` - Almost cosmic, like staring into space

**Text Colors**:
- Primary: `#e5e7eb` (Soft white, easy on eyes)
- Muted: `#9ca3af` (Gray for secondary info)

**Accent Colors**:
- Pink: `#ffc0cb` (Primary brand color, used EVERYWHERE)
- Blue: `#a7c7e7` (Pastel baby blue)
- Mint: `#b2f2bb` (Soft green-mint)
- Gold: `#ffd166` (Warm yellow-gold)

**Kawaii Palette** (8 rotating colors for H2/H3 headings):
1. `#ffc0cb` - Pink (soft, dreamy)
2. `#a7c7e7` - Blue (calm pastel)
3. `#b2f2bb` - Mint (fresh green)
4. `#ffd166` - Gold (warm sunshine)
5. `#c7ceea` - Lavender (purple-ish)
6. `#ffdac1` - Peach (warm orange-pink)
7. `#e2f0cb` - Lime-ish (soft yellow-green)
8. `#ff9aa2` - Salmon (vibrant pink-orange)

### Light Mode
**Background**: `#fef3f2` (Warm off-white, like paper)

**Text Colors**:
- Primary: `#1f2937` (Dark gray-black)
- Muted: `#6b7280` (Medium gray)

**Accent Colors** (More vibrant/saturated than dark mode):
- Pink: `#db2777` (Hot pink)
- Blue: `#3b82f6` (Royal blue)
- Mint: `#10b981` (Emerald green)
- Gold: `#f59e0b` (Amber/orange-gold)

**Kawaii Palette** (Deep, vibrant colors):
1. `#e91e63` - Hot Pink
2. `#2563eb` - Royal Blue
3. `#059669` - Emerald
4. `#d97706` - Amber
5. `#7c3aed` - Violet
6. `#ea580c` - Orange
7. `#65a30d` - Lime
8. `#dc2626` - Red

**Color Strategy**:
- **Pink** is the hero - used for links, categories, scrollbars, hover states, borders
- **Gradients** combine pink + blue for brand elements (logo, titles)
- **Cycling colors** keep headings visually interesting (each H2/H3 gets next color in rotation)
- **Card borders** use semi-transparent pink `rgba(255, 192, 203, 0.28)`

---

## ✍️ Typography

### Font Families

**Primary**: `"Nunito", sans-serif`
- Google Font, weights: 400 (regular), 700 (bold), 900 (black)
- Rounded, friendly, modern sans-serif
- Used for: All body text, headings, UI elements
- **Vibe**: Approachable, clean, slightly playful

**Monospace**: `"VT323", monospace`
- Retro terminal/arcade font
- Used for: Reading time indicators, code snippets
- **Vibe**: Nostalgic, cyberpunk, tech-y

### Typography Scale

#### Headings
- **H1** (Page titles): `3rem` (48px), font-weight 900, gradient background
- **H2** (Post content): `1.8rem` (28.8px), kawaii color rotation
- **H3** (Post content): `1.4rem` (22.4px), kawaii color rotation
- **Section titles**: `1.8rem`, font-weight 900, pink color

#### Body
- **Post content**: `1.125rem` (18px), line-height 1.8 (generous spacing)
- **Card text**: `1rem` (16px)
- **Post excerpts**: `1rem`, 3-line clamp
- **Meta info**: `0.85rem` (13.6px), uppercase, letter-spacing 0.05em

### Typography Choices
- **Line height 1.6** for body, **1.8 for posts** (very readable)
- **Uppercase + letter-spacing** for categories and meta (TECH, GAMES)
- **Gradient text** using `-webkit-background-clip` for brand moments
- **Text-wrap: balance** for better title wrapping

---

## 🗣️ Tone & Voice

### Writing Style

**Raw. Unfiltered. Aggressively Authentic.**

The blog doesn't pull punches or sanitize opinions. The voice is:

#### Key Characteristics:
1. **Profanity-laden** - Fuck, shit, bitch used liberally for emphasis
2. **Conversational** - Writes like talking to a friend over Discord
3. **Self-aware** - Acknowledges cringe, admits uncertainty ("Maybe I'm wrong")
4. **Confrontational** - Directly challenges reader ("Tell me I'm wrong", "Stop being nonchalant fucks")
5. **Cultural references** - Heavy hip-hop/music refs (Kendrick Lamar, MF DOOM), gaming (Elden Ring, Cyberpunk 2077), internet culture (TikTok, "ion giv a fuk lmao")
6. **Gen Z slang** - "lowkey", "fr fr", "ion no", "shii", "gang", "sigma", "skibidi"
7. **Technical precision** - Suddenly drops cybersecurity knowledge, philosophy, neuroscience
8. **Vulnerable** - Shares personal moments (beating Malenia, friends responding "crazy")

#### Sentence Structure:
- **Short. Punchy. Often fragments.**
- Uses one-word sentences for emphasis. "Fuck."
- Long analytical paragraphs mixed with abrupt transitions
- Rhetorical questions everywhere
- Lists (numbered, bulleted) for structure

#### Recurring Phrases:
- "Let me be clear..."
- "Here's where it gets [adjective]..."
- "Here's the thing..."
- "Fuck 'em." (dismissive ending)
- "I get it tho..."
- "Reality check:"
- "But [name], what if you're wrong?"

### Snarky Subtitles (Homepage)

Rotates daily based on day of month:
1. "A blogging website no one asked for"
2. "Why are you even here?"
3. "Is it just me or is this low-key gas?"
4. "Anti-corpo like my name Pop Smoke"
5. "Tech. Music. Commentary. No bloat."
6. "Peak procrastination energy"
7. "Just vibes and semicolons"

**Vibe**: Self-deprecating, questioning, meme-y, but also confident

### Time-Based Greetings (Homepage)

Changes based on Singapore time (UTC+8):
- **5am-11am**: "KawaiiBlog up for coffee" ☀️
- **11am-5pm**: "KawaiiBlog down to work" ⛅
- **5pm-9pm**: "KawaiiBlog chilling in the sunset" 🌆
- **9pm-5am**: "KawaiiBlog up at night" 🌙

**Vibe**: Casual, relatable, human

---

## 🏗️ Visual Components

### Cards (`.card`)
- **Background**: `rgba(31, 41, 55, 0.6)` - Semi-transparent dark overlay
- **Border**: `1px solid rgba(255, 192, 203, 0.28)` - Subtle pink outline
- **Border Radius**: `14px` (rounded but not circular)
- **Hover Effect**:
  - Lift: `translateY(-4px)`
  - Border: Full pink `var(--pink)`
  - Shadow: `0 15px 30px rgba(0,0,0,0.35) + 0 10px 30px rgba(255,192,203,0.12)` (double shadow, dark + pink glow)

### Navigation
- **Sticky**: Stays at top when scrolling
- **Backdrop blur**: `blur(10px)` - Glassmorphism effect
- **Border**: `1px solid rgba(255, 192, 203, 0.25)` bottom only
- **Logo**: "Kawaii" (white) + "Blog" (pink)
- **Links**: Muted gray → Pink on hover/active
- **Theme Toggle**: Icon-based, persists to localStorage

### Scrollbar (Custom)
- **Width**: `10px`
- **Thumb**: Pink `var(--pink)`, rounded pill shape
- **Track**: Transparent
- **Border**: `2px solid var(--bg)` on thumb (creates floating effect)

### Reading Progress Bar
- Appears only on blog posts (not homepage/archive)
- Fixed to top of viewport
- Pink `var(--pink)` indicator
- Updates on scroll

### Post Layout
- **Max-width**: `800px` for header + content (readability)
- **Two-column** on desktop (1024px+): Content + sticky TOC sidebar
- **Category badge**: Pink, uppercase, bold
- **Post title**: Gradient (pink→blue), huge (2-3.5rem responsive)
- **Meta info**: Category • Date • Reading time (all in one line, separated by `•`)

### Table of Contents (Desktop Only)
- **Sticky**: Follows scroll at `top: 120px`
- **Max height**: `calc(100vh - 140px)`
- **Overflow**: Scrollable if needed
- **Hidden**: On mobile (<1024px)

---

## 🎯 Content Categories

Four categories with distinct identities:

1. **tech** - Cybersecurity, Linux, dev rants
2. **music** - Hip-hop deep dives (Kendrick, MF DOOM)
3. **games** - Gaming commentary (Cyberpunk 2077, Elden Ring)
4. **commentary** - Cultural criticism, Gen Z rants, philosophy

**Category Display**:
- Always uppercase (TECH, MUSIC, GAMES, COMMENTARY)
- Pink color
- Bold font-weight
- Letter-spacing for impact

---

## 💬 Copywriting Patterns

### Post Titles
- Direct, confrontational, no clickbait
- Examples:
  - "Stop being nonchalant fucks"
  - "Why I am breaking up with Windows and you should too"
  - "Cyberpunk 2077: From Corporate Greed to Redemption"
  - "The Greatest Rapper: MF DOOM"

### Excerpts
- 1-2 sentences
- Hook with conflict or question
- Example: "You traded your humanity for safety and social credits because you thought it made you look cool. The fucked up part? You're not even getting real safety and you not even cooler."

### Section Headings (H2 in posts)
- Cultural references: "Kung Fu Kenny", "The Tyler Durden Delusion"
- Direct address: "But Isaiah, What If You're Wrong?"
- Provocative: "I'm Horny, Therefore I Perform"
- Playful: "MF DOOM (I'll keep it short, I promise)"
- Memes: "Big Brain Not So Big", "What's Wrong with my FYP?"

### Call-to-Actions
- Imperative mood
- Often profane: "Do. It. Anyway."
- Numbered lists (clear, actionable)
- Personal stakes: "This is about whether you get to have a real life or not"

---

## 🎬 Interactive Elements

### Hover States
- **Links**: Underline appears (2px thick, 4px offset)
- **Cards**: Lift + glow + pink border intensifies
- **Buttons**: Subtle color shift
- **All transitions**: `0.18s ease` (unified timing)

### Focus States
- Pink outline for keyboard navigation
- Maintains accessibility

### Loading States
- Minimal - static site, instant page loads
- No spinners needed

### Error States
- **404 Page**: Exists, maintains theme
- Custom error handling in CLI tools

---

## 🔤 Microcopy

### Footer
- "© 2025 KawaiiBlog. **All wrongs reserved.**" (wordplay on "rights")
- Dual license: "Content licensed under CC BY-NC 4.0 · Code licensed under MIT"

### Meta Text
- "min read" (not "minute read" or "mins")
- Dates: "October 31, 2025" (full month name)
- No Oxford comma in lists

### Buttons/Links
- "Back to Top" (not "Return" or "Scroll Up")
- "Share" (not "Share this post")
- Simple, direct language

---

## 🧩 Layout Patterns

### Homepage Grid
- **Latest Post**: Full-width card
- **Featured Posts**: 3-column grid (1-col mobile)
- **Recent Posts**: Auto-fit grid, min 300px columns
- Sections separated by subtle borders `rgba(255, 192, 203, 0.1)`

### Archive Page
- Searchable (Fuse.js fuzzy search)
- Grid layout (same as homepage)
- All posts in reverse chronological order

### Blog Post Page
- Centered content column
- Sticky TOC sidebar (desktop)
- Related posts at bottom
- Share buttons after content

---

## 🎨 Image Treatment

### Blog Images
- **Border radius**: `14px` (matches card radius)
- **Border**: `1px solid rgba(255, 255, 255, 0.1)` (subtle outline)
- **Margin**: `1rem 0` (breathing room)
- **Max-width**: `100%` (responsive)
- **Lazy loading**: Enabled via Astro

### Cover Images
- Optional in frontmatter
- WebP format preferred
- Stored in post folder

### Icons/Favicon
- **Favicon**: Backwards "K" in Nunito font, pink
- **SVG format**: Scalable, theme-aware potential

---

## 📐 Spacing System

CSS variables for consistency:

- `--spacing-sm`: `0.5rem` (8px)
- `--spacing-md`: `1rem` (16px)
- `--spacing-lg`: `2rem` (32px)
- `--spacing-xl`: `3rem` (48px)

**Usage**:
- **Cards**: `md` padding
- **Sections**: `xl` margin-bottom
- **Component gaps**: `md` or `lg`
- **Tight groups**: `sm`

---

## 🌐 Responsive Breakpoints

- **Mobile**: < 768px (1-column everything)
- **Tablet**: 768px+ (Featured grid starts)
- **Desktop**: 1024px+ (TOC sidebar appears)
- **Max container**: `1200px`

**Mobile-first approach**: Base styles are mobile, media queries add complexity

---

## 🔊 Brand Voice Examples

### When Explaining Tech:
> "I know that everything I do online is being tracked, logged, analyzed, fed to me through adverts. Every search query, every click, every ChatGPT prompt, every moment of engagement is data that feeds the machine."

**Tone**: Matter-of-fact, technical, but accessible

### When Calling Out Behavior:
> "You're not protecting yourself. You're just slowly killing the parts of yourself that define you and make life worth living for."

**Tone**: Direct, unflinching, harsh but caring

### When Being Vulnerable:
> "I'm writing this because I'm fucking terrified. I'm terrified that I'm watching an entire generation—MY generation—voluntarily lobotomize themselves."

**Tone**: Raw emotion, personal stakes, confession

### When Using Humor:
> "Brother, you drank an egg. You didn't cure cancer."

**Tone**: Sarcastic, mocking, but playful

---

## 🎭 Personality Dimensions

If the blog were a person:

- **Age**: 17-19 (Gen Z core)
- **Energy**: High, intense, passionate
- **Attitude**: Skeptical, anti-establishment, pro-authenticity
- **Interests**: Hip-hop, gaming, cybersecurity, philosophy
- **Social vibe**: The friend who keeps it real, won't let you bullshit yourself
- **Education level**: Very online, self-taught, autodidact references
- **Humor**: Dark, self-deprecating, referential
- **Confidence**: High in opinions, but admits uncertainty
- **Relationships**: Values depth over breadth, quality over quantity

---

## 🚫 What This Blog Is NOT

To understand the vibe, here's what to **avoid**:

❌ Corporate/professional tone  
❌ Neutral "both sides" centrism  
❌ Sanitized, brand-safe language  
❌ Clickbait headlines  
❌ SEO keyword stuffing  
❌ Overly polished, "perfect" aesthetic  
❌ Inspirational quotes in cursive fonts  
❌ "Hustle culture" positivity  
❌ Trying to appeal to everyone  
❌ Hiding opinions behind "just my thoughts"  

---

## ✅ Design Checklist

When creating new content or components, ask:

1. **Color**: Does it use the kawaii palette? Is pink the primary accent?
2. **Typography**: Nunito for text, VT323 for code/tech elements?
3. **Spacing**: Using CSS variables, not arbitrary values?
4. **Borders**: Rounded corners (10-14px)? Pink accents?
5. **Hover**: 0.18s transition? Lift effect on cards?
6. **Tone**: Raw and authentic? Would you say this to a friend?
7. **Mobile**: Does it work on 375px width?
8. **Accessibility**: Keyboard navigable? Sufficient contrast?

---

## 🎨 Style Guide Quick Reference

| Element | Style |
|---------|-------|
| **Primary Color** | Pink `#ffc0cb` (dark) / `#db2777` (light) |
| **Background** | `#0d011f` (dark) / `#fef3f2` (light) |
| **Font** | Nunito (primary), VT323 (mono) |
| **Border Radius** | 10-14px |
| **Transition** | 0.18s ease |
| **Max Width** | 1200px |
| **Card Hover** | translateY(-4px) + pink glow |
| **Links** | Pink color, underline on hover |
| **Headings** | Cycling kawaii colors (8 rotations) |
| **Categories** | Uppercase, pink, bold, 700 weight |
| **Tone** | Raw, profane, authentic, passionate |

---

## 📝 Content Guidelines

### When Writing Posts:

1. **Start strong** - No preamble, dive into the conflict
2. **Use subheadings** - H2s every 3-5 paragraphs for scannability
3. **Vary sentence length** - Mix long analytical with short punchy
4. **Include examples** - Personal stories, cultural refs, specific instances
5. **Challenge the reader** - Ask questions, pose thought experiments
6. **Admit uncertainty** - "Maybe I'm wrong" sections show intellectual honesty
7. **End with action** - Give concrete next steps, not vague inspiration
8. **Profanity with purpose** - Not just edgy, but emphatic
9. **Show your work** - If citing neuroscience/tech, be accurate
10. **Be vulnerable** - Share failures, fears, cringe moments

### Excerpt Formula:
**[Provocative statement]. [Twist/contradiction].**

Example: "You traded your humanity for safety and social credits. The fucked up part? You're not even getting real safety."

---

## 🧠 Core Values (Expressed Through Design & Copy)

1. **Authenticity > Performance** - Raw, unfiltered voice
2. **Depth > Breadth** - Long-form content, nuanced arguments
3. **Passion > Nonchalance** - Enthusiasm is celebrated
4. **Quality > Quantity** - 7 posts deeply researched > 100 shallow takes
5. **Community > Audience** - Writing for readers who care
6. **Function > Form** - But why not both? (Hence the aesthetic)
7. **Open > Closed** - MIT license, RSS feeds, no paywalls

---

## 🎯 Target Audience Vibe

Who is this blog for?

- **Age**: 16-25 (Gen Z, maybe young millennials)
- **Interests**: Hip-hop, gaming, tech, internet culture
- **Values**: Authenticity, anti-conformity, depth
- **Reading level**: High (dense references, philosophical tangents)
- **Attention span**: Paradoxical - will scroll past TikToks but read 10k word essays
- **Tech savvy**: Understands VPNs, RSS, cybersecurity basics
- **Media diet**: Discord, Reddit, YouTube essays, not Instagram aesthetics
- **Personality**: Skeptical, introspective, anti-mainstream but not contrarian

**Not for**: People who need content warnings, corporate types, those seeking neutrality, casual scrollers

---

## 🔮 Vibe in Three Words

1. **Cyberpunk** (aesthetic, tech-forward, dystopian-aware)
2. **Kawaii** (soft colors, rounded edges, playful typography)
3. **Raw** (unfiltered voice, profane, vulnerable)

Or as a mood board: **Neon-lit alleyway + pastel Instagram filters + Discord argument thread**

---

## 🎪 Easter Eggs & Details

Small touches that add personality:

- **Footer**: "All wrongs reserved" (not "rights")
- **Snarky subtitles**: Rotate daily, self-aware humor
- **Time greetings**: Singapore timezone (personal touch)
- **Favicon**: Backwards K (subtle branding)
- **Scrollbar**: Pink to match theme (most sites ignore this)
- **H2/H3 colors**: Cycle through 8 colors (fresh on each heading)
- **Reading time**: Uses VT323 font (tech aesthetic)
- **CLI tool names**: "kawaii-blog.ts" (stays on-brand even in terminal)
- **License combo**: CC BY-NC for content, MIT for code (principled)

---

## 📚 Cultural References to Know

To maintain the blog's voice, be familiar with:

**Music**:
- Kendrick Lamar (especially *Mr. Morale & The Big Steppers*, "N95")
- MF DOOM (mask as metaphor, underground hip-hop)
- Pop Smoke ("Anti-corpo like my name Pop Smoke")

**Gaming**:
- Elden Ring (Malenia boss fight)
- Cyberpunk 2077 (redemption arc)

**Philosophy**:
- Stoicism (often misunderstood by "sigma males")
- Authenticity (existentialist themes)

**Internet Culture**:
- TikTok trends (nonchalance, stoic edits)
- Gen Z slang ("lowkey", "fr fr", "ion")
- Sigma male/Andrew Tate critique
- "Main character energy" memes

**Tech**:
- VPNs, digital footprints, threat models
- Arch Linux (joke for Linux nerds)
- Algorithms, engagement patterns

---

## 🛠️ Technical Aesthetic

The blog's tech stack reinforces the "lightweight, no bloat" ethos:

- **Astro**: Static site gen (fast, minimal JS)
- **No frameworks**: Vanilla CSS, no Tailwind bloat
- **RSS feeds**: Old-school discoverability
- **Markdown**: Plain text, portable
- **Self-hosted**: GitHub Pages (not VC-funded platforms)
- **Open source**: MIT license

**This matters for brand alignment**: The tech choices ARE the aesthetic. No CMS bloat, no WordPress, no React for static content. The minimalism is ideological.

---

## 💎 Signature Moves

Recurring patterns that define the KawaiiBlog style:

1. **The Kendrick Reference** - Using "N95" as metaphor for emotional masks
2. **The Self-Aware Tangent** - "MF DOOM (I'll keep it short, I promise)" then writing 6 paragraphs
3. **The Reality Check Section** - "But Isaiah, what if you're wrong?" addressing counterarguments
4. **The Profane Punctuation** - Ending sections with "Fuck 'em."
5. **The Vulnerable Admission** - "I'm fucking terrified" moments
6. **The Numbered Action List** - Concrete steps, not vague advice
7. **The Cultural Callout** - Mocking TikTok trends, sigma males, performative nonchalance
8. **The Technical Sidebar** - Dropping cybersecurity knowledge mid-rant
9. **The One-Word Paragraph** - "Fuck." for emphasis
10. **The Stakes Escalation** - "This isn't just about X, this is about whether you get to have a real life"

---

## 🎨 Color Psychology Breakdown

Why these specific colors?

**Pink** (`#ffc0cb` dark / `#db2777` light):
- Traditionally feminine → reclaimed as rebellion
- Soft + aggressive (pastel in dark mode, hot in light mode)
- Stands out against dark purple-black
- **Meaning**: Passion, vulnerability, anti-masculinity toxicity

**Blue** (`#a7c7e7` dark / `#3b82f6` light):
- Calming, trustworthy
- Balances pink's intensity
- **Meaning**: Clarity, logic, tech

**Mint** (`#b2f2bb` dark / `#10b981` light):
- Fresh, energizing
- Less common than pink/blue
- **Meaning**: Growth, renewal, optimism

**Gold** (`#ffd166` dark / `#f59e0b` light):
- Warm, valuable
- Complements cool palette
- **Meaning**: Insight, worth, emphasis

**Purple-black background** (`#0d011f`):
- Deep, cosmic, mysterious
- Not pure black (warmer, less harsh)
- **Meaning**: Depth, night, cyberpunk dystopia

**Strategy**: Dual palettes (soft dark mode for long reading, vibrant light mode for energy) maintain vibe across themes.

---

## 📸 Visual Inspiration

If you need a mental image:

- **Tokyo at night** - Neon signs reflecting on wet pavement
- **Vaporwave aesthetics** - But less ironic, more sincere
- **Cyberpunk 2077** - UI elements, color grading
- **Lo-fi hip-hop streams** - Chill but focused
- **Discord dark mode** - Comfortable for long sessions
- **Pastel goth fashion** - Soft colors, dark base
- **Terminal aesthetics** - VT323 font, monospace charm
- **Glassmorphism** - iOS/macOS translucent cards

**NOT**:
- ❌ Corporate tech blogs (Medium, dev.to sterility)
- ❌ Minimalist brutalism (too harsh)
- ❌ Maximalist novelty (too chaotic)
- ❌ Pastel Instagram (too soft, no edge)

---

## ✨ In Summary

**KawaiiBlog is**:
- A **Dark Pastel Cyberpunk** blog
- With **raw, profane, authentic** voice
- Using **pink as religion**
- **Nunito + VT323** fonts
- **Glassmorphism cards** that lift on hover
- **Cycling gradient headings** (8 kawaii colors)
- **Long-form essays** about culture, tech, music, games
- **Gen Z slang** + Cultural references + Vulnerability
- **Anti-nonchalance**, pro-passion
- **Lightweight tech** (Astro, no bloat)
- **Time-based greetings** + Snarky subtitles
- **"All wrongs reserved"** energy

If you can describe it in one sentence:
> **"A Gen Z cyberpunk diary that yells at you to stop being emotionally dead while looking absolutely gorgeous in pink and purple."**

---

**Last Updated**: November 23, 2025  
**Maintained by**: KawaiiBlog Team  
**License**: This theme guide is CC BY-NC 4.0, just like the blog content.
