---
name: tailwindcss
description: Best practices for writing maintainable Tailwind CSS v4 in React and Next.js. Use when implementing or reviewing responsive layouts, design tokens, utility classes, variants, component styling, accessibility states, or Tailwind CSS architecture.
---

# Tailwind CSS v4 — Coding & UI Best Practices

## Purpose

Skill ini menjadi guideline utama agent ketika menulis, mengubah, atau mereview styling menggunakan **Tailwind CSS v4**.

Prioritas:

```text
Consistency
→ Readability
→ Responsive Design
→ Accessibility
→ Reusability
→ Performance
→ Visual Quality
```

Gunakan pendekatan **utility-first**.

Jangan mengubah Tailwind menjadi traditional CSS framework dengan membuat class custom untuk setiap komponen.

Tailwind memang dirancang untuk membangun UI dengan menggabungkan utility kecil langsung di markup.

---

# 1. Tailwind CSS v4 First

Untuk project baru gunakan pola Tailwind v4.

CSS utama:

```css
@import "tailwindcss";
```

Jangan menggunakan pola lama sebagai default:

```css
/* Avoid for new Tailwind v4 projects */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Tailwind v4 menggunakan CSS-first configuration dan automatic source detection.

---

# 2. Prefer CSS-First Configuration

Jangan membuat `tailwind.config.js` hanya karena kebiasaan Tailwind v3.

Untuk project baru, design tokens didefinisikan melalui:

```css
@theme {
  --color-brand: oklch(0.58 0.23 29);
  --color-brand-dark: oklch(0.45 0.19 29);

  --font-display: "Inter", sans-serif;

  --radius-card: 1.25rem;

  --ease-cinematic: cubic-bezier(0.65, 0, 0.35, 1);
}
```

Kemudian gunakan:

```tsx
<div className="bg-brand font-display">
  ...
</div>
```

Gunakan `@theme` jika value tersebut memang bagian dari **design system** dan harus menghasilkan utility Tailwind.

Gunakan `:root` untuk CSS variable biasa yang tidak perlu menjadi utility Tailwind.

---

# 3. Design Tokens First

Jangan menyebarkan warna project secara manual:

```tsx
// Avoid

<div className="bg-[#e70011]" />

<button className="text-[#e70011]" />

<span className="border-[#e70011]" />
```

Jika warna digunakan berulang, jadikan token:

```css
@theme {
  --color-merdeka: #e70011;
  --color-merdeka-light: #ff2738;
  --color-surface: #050505;
}
```

Lalu:

```tsx
<div className="bg-surface text-white">
  <span className="text-merdeka">
    Merdeka
  </span>
</div>
```

Theme variables adalah API design token utama Tailwind v4.

---

# 4. Arbitrary Values Are for Exceptions

Arbitrary value boleh digunakan.

Contoh valid:

```tsx
<div className="top-[117px]" />
```

atau:

```tsx
<div className="grid-cols-[1fr_500px_2fr]" />
```

Tailwind mendukung arbitrary values, properties, dan variants secara native.

Tetapi gunakan dengan aturan:

```text
One-off value
→ arbitrary value is acceptable

Repeated value
→ create design token

Reusable behavior
→ create utility/component abstraction
```

### Good

```tsx
<div className="translate-y-[3px]" />
```

untuk penyesuaian visual satu kali.

### Bad

```tsx
<div className="text-[17px]" />
<div className="text-[17px]" />
<div className="text-[17px]" />
<div className="text-[17px]" />
```

Jika terus digunakan, buat token.

---

# 5. Never Construct Tailwind Classes Dynamically

Ini aturan penting.

## Never

```tsx
<div className={`bg-${color}-500`} />
```

atau:

```tsx
<div className={`text-${status}-600`} />
```

Tailwind membaca source file sebagai text dan tidak memahami string interpolation untuk membangun class.

Gunakan complete class mapping.

## Correct

```tsx
const variants = {
  red: "bg-red-500 text-white",
  blue: "bg-blue-500 text-white",
  white: "bg-white text-black",
};

return (
  <div className={variants[color]}>
    ...
  </div>
);
```

Semua class Tailwind harus muncul secara lengkap di source code.

---

# 6. Class Composition

Urutkan styling secara konsisten.

Jangan mencoba mengurutkan class secara manual dengan aturan buatan sendiri jika project menggunakan Prettier.

Gunakan:

```text
prettier-plugin-tailwindcss
```

Official Tailwind Prettier plugin dapat mengurutkan class mengikuti urutan utility yang direkomendasikan Tailwind.

Contoh:

```tsx
<button
  className="
    inline-flex
    items-center
    justify-center
    rounded-full
    bg-merdeka
    px-5
    py-3
    text-sm
    font-medium
    text-white
    transition-colors
    hover:bg-merdeka-light
  "
>
  Explore
</button>
```

Formatter boleh mengubah urutannya otomatis.

---

# 7. Do Not Manually Group Classes With Comments

Avoid:

```tsx
<div
  className={`
    // layout
    flex items-center

    // spacing
    px-6 py-4

    // colors
    bg-black text-white
  `}
>
```

Ini membuat class sulit diproses, diformat, dan dibaca.

Lebih baik:

```tsx
<div className="flex items-center bg-black px-6 py-4 text-white">
```

Jika class sudah terlalu kompleks, masalahnya biasanya bukan Tailwind-nya tetapi **component terlalu besar**.

---

# 8. Extract Components, Not CSS Classes

Jika UI yang sama digunakan berkali-kali:

### Avoid

```css
.hero-button {
  @apply rounded-full bg-red-600 px-6 py-3 font-medium text-white;
}
```

lalu:

```tsx
<button className="hero-button">
```

Untuk application code, lebih baik extract React component:

```tsx
function HeroButton({ children }) {
  return (
    <button className="rounded-full bg-merdeka px-6 py-3 font-medium text-white">
      {children}
    </button>
  );
}
```

Gunakan component abstraction untuk:

* Button
* Badge
* Card
* Navigation item
* Form control
* Repeated section structures

Bukan membuat semantic CSS class untuk setiap UI.

---

# 9. Use `@apply` Sparingly

`@apply` tetap tersedia di Tailwind v4.

Tetapi jangan menjadikannya default.

Gunakan terutama ketika:

```text
Styling third-party markup
Styling HTML yang tidak dapat dikontrol
CSS module tertentu
Integration dengan library eksternal
```

Contoh:

```css
.third-party-widget {
  @apply rounded-xl border border-white/10 bg-black;
}
```

Untuk React component biasa, prefer utility langsung di `className`.

---

# 10. Custom Utilities

Jika benar-benar ada behavior CSS reusable yang tidak tersedia sebagai utility, gunakan:

```css
@utility
```

Contoh:

```css
@utility text-balance-pretty {
  text-wrap: pretty;
}
```

Custom utility yang dibuat dengan `@utility` tetap dapat bekerja dengan variant seperti `hover:` atau breakpoint variants.

Jangan membuat custom utility jika Tailwind sudah memiliki utility equivalent.

---

# 11. Mobile-First Always

Tailwind responsive design adalah **mobile-first**.

Write:

```tsx
<section className="px-5 md:px-8 lg:px-12">
```

Artinya:

```text
Mobile
px-5

Tablet+
px-8

Desktop+
px-12
```

Jangan:

```tsx
<section className="lg:px-12 md:px-8 px-5">
```

Walaupun dapat bekerja, cara ini membuat intent lebih sulit dibaca.

Think:

```text
Base
→ sm
→ md
→ lg
→ xl
→ 2xl
```

---

# 12. Never Design Desktop First Then Patch Mobile

Avoid pattern:

```tsx
<div className="grid grid-cols-4 max-md:grid-cols-1">
```

Prefer:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
```

Start dengan layout terkecil.

Kemudian enhance.

```text
Mobile baseline
↓
Tablet enhancement
↓
Desktop enhancement
```

---

# 13. Avoid Excessive Breakpoints

Bad:

```tsx
<h1 className="
  text-3xl
  sm:text-[34px]
  md:text-[39px]
  lg:text-[46px]
  xl:text-[52px]
  2xl:text-[58px]
">
```

Biasanya terlalu banyak.

Prefer:

```tsx
<h1 className="text-4xl md:text-6xl xl:text-8xl">
```

Gunakan breakpoint hanya ketika layout memang membutuhkan perubahan.

---

# 14. Fluid Typography When Appropriate

Untuk hero cinematic, fluid typography sering lebih baik daripada banyak breakpoint.

Contoh:

```tsx
<h1 className="text-[clamp(4rem,18vw,14rem)] leading-none">
  81
</h1>
```

Cocok untuk:

* Hero title
* Giant typography
* Decorative typography

Tidak perlu untuk setiap body text.

---

# 15. Container Queries for Reusable Components

Jika component harus merespons **ukuran parent**, bukan viewport, gunakan container query.

Parent:

```tsx
<div className="@container">
```

Child:

```tsx
<div className="flex flex-col @md:flex-row">
```

Tailwind mendukung container queries secara native dan container variants juga bersifat mobile-first.

Gunakan untuk:

* reusable cards
* widgets
* side panels
* dashboard modules
* embeddable sections

---

# 16. Use `gap` for Layout Spacing

Prefer:

```tsx
<div className="flex gap-4">
```

daripada:

```tsx
<div>
  <div className="mr-4" />
  <div className="mr-4" />
  <div />
</div>
```

Untuk vertical stack:

```tsx
<div className="flex flex-col gap-6">
```

atau:

```tsx
<div className="grid gap-6">
```

Layout container harus sebisa mungkin mengontrol spacing antarchildren.

---

# 17. Avoid Random Spacing Values

Bad:

```tsx
<div className="mt-[13px] px-[19px] pb-[27px]">
```

Prefer design scale:

```tsx
<div className="mt-3 px-5 pb-7">
```

Arbitrary spacing hanya ketika memang diperlukan oleh design yang spesifik.

Consistency lebih penting daripada pixel obsession.

---

# 18. Prefer `size-*` When Width and Height Match

Instead of:

```tsx
<div className="h-10 w-10">
```

prefer:

```tsx
<div className="size-10">
```

Contoh:

```tsx
<Icon className="size-5" />
```

Lebih ringkas dan jelas.

---

# 19. Semantic Color Tokens

Untuk project besar jangan semua component mengetahui warna literal.

Instead of:

```css
@theme {
  --color-red-special: #e70011;
}
```

prefer token yang mencerminkan design system:

```css
@theme {
  --color-brand: #e70011;
  --color-surface: #050505;
  --color-foreground: #ffffff;
  --color-muted: #a1a1aa;
}
```

Untuk project **Ruang Merdeka**, boleh memiliki identity token:

```css
@theme {
  --color-merdeka: #e70011;
  --color-merdeka-glow: #ff2738;
}
```

Karena warna tersebut memang bagian dari visual identity project.

---

# 20. State Variants

Gunakan Tailwind variants daripada custom event styling.

```tsx
<button
  className="
    bg-white
    text-black
    transition
    hover:bg-zinc-200
    focus-visible:outline-2
    focus-visible:outline-offset-4
    focus-visible:outline-white
    active:scale-[0.98]
    disabled:pointer-events-none
    disabled:opacity-50
  "
>
```

State penting:

```text
hover:
focus:
focus-visible:
active:
disabled:
checked:
group-hover:
peer-checked:
data-*:
aria-*:
```

Jangan hanya mendesain default state.

---

# 21. Hover Must Never Contain Critical Information

Bad:

```text
Desktop hover
→ important information appears

Mobile
→ inaccessible
```

Hover hanya enhancement.

Critical content harus:

```text
Visible
or
Accessible by tap/focus
```

---

# 22. Use `group` for Parent-Child Interaction

Example:

```tsx
<a className="group flex items-center gap-2">
  Explore

  <ArrowRight
    className="
      size-4
      transition-transform
      group-hover:translate-x-1
    "
  />
</a>
```

Jangan membuat React state hanya untuk simple hover animation.

---

# 23. Use Data Attributes for Component States

Untuk stateful component:

```tsx
<div
  data-active={active}
  className="
    opacity-50
    data-active:opacity-100
  "
>
```

Tailwind v4 mendukung dynamic variants dan data attribute variants secara fleksibel.

Gunakan jika state sudah tersedia di DOM.

---

# 24. Dark Mode

Tailwind menyediakan `dark:` variant. Default-nya dapat mengikuti `prefers-color-scheme`.

Example:

```tsx
<div className="bg-white text-black dark:bg-black dark:text-white">
```

Jika project menggunakan manual theme selector:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

atau data attribute:

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

Tailwind v4 mendukung pola custom dark variant tersebut.

---

# 25. Avoid Excessive `dark:` Duplication

Bad:

```tsx
<div className="
  bg-white
  text-black
  border-gray-200
  dark:bg-black
  dark:text-white
  dark:border-gray-800
">
```

Jika hampir seluruh design system berubah berdasarkan theme, pertimbangkan semantic CSS variables.

Contoh:

```css
:root {
  --surface: white;
  --foreground: black;
}

.dark {
  --surface: black;
  --foreground: white;
}
```

Kemudian expose token sesuai kebutuhan design system.

---

# 26. Conditional Classes

Untuk simple condition:

```tsx
className={
  active
    ? "bg-white text-black"
    : "bg-transparent text-white/60"
}
```

Untuk component kompleks, gunakan project helper seperti:

```tsx
cn(
  "rounded-full px-4 py-2 transition",
  active && "bg-white text-black",
  disabled && "pointer-events-none opacity-50",
)
```

Tetapi jangan introduce abstraction hanya untuk:

```tsx
cn("flex")
```

Gunakan helper ketika memang ada:

* condition
* variant
* class merging
* external `className`

---

# 27. Component Class Structure

Recommended React pattern:

```tsx
function Button({
  variant = "primary",
  className,
  ...props
}) {
  const variants = {
    primary:
      "bg-merdeka text-white hover:bg-merdeka-glow",

    secondary:
      "border border-white/20 bg-white/5 text-white hover:bg-white/10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
```

Notice:

```text
Base style
+
Variant
+
External override
```

Jangan dynamically generate Tailwind class fragments.

---

# 28. Avoid Monster `className`

Jika menemukan:

```tsx
<div className="... 40–60 utilities ...">
```

jangan langsung pindahkan semuanya ke CSS.

Pertama evaluasi apakah component memiliki terlalu banyak responsibility.

Split:

```text
Hero
├── HeroBackground
├── HeroContent
├── HeroTitle
└── ScrollIndicator
```

bukan:

```text
One gigantic Hero component
```

---

# 29. Keep Layout Near the Element

Jangan memindahkan:

```text
display
position
spacing
responsive behavior
```

ke CSS file tanpa alasan.

Tailwind:

```tsx
<section className="relative flex min-h-svh items-center overflow-hidden px-5 md:px-10">
```

lebih mudah dipahami dibanding:

```tsx
<section className="hero">
```

yang memerlukan developer membuka file lain untuk memahami layout.

---

# 30. Prefer Modern Viewport Units

Untuk fullscreen mobile section:

Prefer:

```tsx
<section className="min-h-svh">
```

atau ketika benar-benar membutuhkan dynamic viewport:

```tsx
<section className="min-h-dvh">
```

daripada selalu:

```tsx
min-h-screen
```

terutama untuk immersive mobile experiences dengan browser chrome yang berubah ukuran.

---

# 31. Position Absolute Carefully

Decorative element:

```tsx
<div
  aria-hidden="true"
  className="
    pointer-events-none
    absolute
    inset-0
  "
/>
```

Elemen visual yang tidak interaktif sebaiknya:

```text
pointer-events-none
aria-hidden
```

agar tidak mengganggu interaction.

---

# 32. Z-Index System

Avoid:

```tsx
z-[999999]
```

Gunakan small predictable layering system:

```text
background
z-0

visual
z-10

content
z-20

navigation
z-40

overlay/modal
z-50
```

Arbitrary z-index hanya jika benar-benar diperlukan.

---

# 33. Animation Utilities

Untuk micro-interaction gunakan Tailwind:

```tsx
className="
  transition-transform
  duration-300
  ease-out
  hover:-translate-y-1
"
```

Untuk cinematic scroll animation, jangan mencoba memaksa semuanya melalui Tailwind.

Gunakan pembagian:

```text
Tailwind
→ visual state
→ responsive layout
→ basic transition
→ hover animation

GSAP
→ timeline
→ scroll progress
→ cinematic sequencing

Three.js / R3F
→ 3D animation
```

Tailwind menentukan state visual.

Animation engine menentukan timeline.

---

# 34. Avoid `transition-all`

Prefer:

```tsx
transition-colors
```

atau:

```tsx
transition-transform
```

daripada:

```tsx
transition-all
```

Gunakan `transition-all` hanya jika beberapa property memang harus dianimasikan dan property tersebut tidak dapat ditentukan lebih spesifik dengan mudah.

Explicit transitions lebih predictable.

---

# 35. Reduced Motion

Untuk motion-heavy UI:

```tsx
<div
  className="
    transition-transform
    motion-reduce:transform-none
    motion-reduce:transition-none
  "
>
```

Animation tidak boleh menjadi satu-satunya cara menyampaikan informasi.

---

# 36. Accessibility Is Part of Styling

Agent harus selalu mempertimbangkan:

```text
Contrast
Focus state
Touch target
Disabled state
Reduced motion
Readable typography
Semantic HTML
```

Button jangan hanya punya:

```tsx
hover:bg-red-500
```

Tambahkan keyboard state:

```tsx
focus-visible:outline
focus-visible:outline-2
focus-visible:outline-offset-2
```

---

# 37. Responsive Touch Targets

Interactive control sebaiknya tidak terlalu kecil.

Example:

```tsx
<button className="inline-flex min-h-11 items-center px-4">
```

Untuk icon button:

```tsx
<button className="inline-grid size-11 place-items-center">
  <Menu className="size-5" />
</button>
```

Visual icon boleh kecil.

Touch target tetap cukup besar.

---

# 38. Source Detection

Tailwind v4 melakukan source detection otomatis.

Jangan menambahkan konfigurasi source manual tanpa kebutuhan.

Gunakan:

```css
@source
```

hanya ketika Tailwind tidak dapat menemukan source tertentu, misalnya external UI package:

```css
@source "../node_modules/@company/ui";
```

Untuk monorepo, base source juga dapat ditentukan saat import.

---

# 39. File Organization

Recommended:

```text
src/
├── app/
│   └── globals.css
│
├── components/
│   ├── ui/
│   └── sections/
│
├── lib/
│   └── cn.ts
│
└── styles/
    ├── utilities.css
    └── animations.css
```

`globals.css`:

```css
@import "tailwindcss";

@theme {
  /* design tokens */
}
```

Jangan membuat:

```text
button.css
card.css
hero.css
navbar.css
footer.css
```

jika semuanya sebenarnya dapat ditulis dengan utility Tailwind.

---

# 40. Global CSS Responsibilities

`globals.css` sebaiknya berisi:

```text
Tailwind import
Theme tokens
Global document styles
Custom variants
True global utilities
Global animation primitives
Third-party overrides
```

Bukan:

```text
Every component's styling
```

---

# 41. Recommended Theme Structure

Example:

```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-merdeka: #e70011;
  --color-merdeka-glow: #ff2738;

  /* Surfaces */
  --color-surface: #050505;
  --color-surface-soft: #101010;

  /* Typography */
  --color-foreground: #ffffff;
  --color-muted: #a1a1aa;

  /* Typography */
  --font-display: var(--font-inter);

  /* Motion */
  --ease-cinematic: cubic-bezier(0.65, 0, 0.35, 1);

  /* Breakpoints — only if custom ones are truly needed */
}
```

Jangan membuat ratusan token tanpa kebutuhan nyata.

---

# 42. Breakpoint Customization

Jika memang membutuhkan custom breakpoint:

```css
@theme {
  --breakpoint-3xl: 120rem;
}
```

Gunakan unit yang konsisten.

Default Tailwind breakpoints menggunakan `rem`, dan dokumentasinya merekomendasikan menjaga unit breakpoint tetap konsisten agar sorting responsive utilities tidak menghasilkan behavior yang tidak diharapkan.

---

# 43. Prefer Standard Utilities

Before:

```tsx
<div className="w-[40px] h-[40px]">
```

Check whether:

```tsx
<div className="size-10">
```

sudah cukup.

Before:

```tsx
<div className="rounded-[12px]">
```

Check:

```tsx
rounded-xl
```

Before:

```tsx
<div className="opacity-[0.5]">
```

Prefer:

```tsx
opacity-50
```

Arbitrary values bukan pengganti pengetahuan tentang utility Tailwind.

---

# 44. UI Visual Consistency

Untuk satu project gunakan sistem yang konsisten.

Example spacing rhythm:

```text
4
6
8
12
16
24
```

Example radius:

```text
rounded-lg
rounded-xl
rounded-2xl
rounded-full
```

Jangan:

```text
Card A → rounded-lg
Card B → rounded-[13px]
Card C → rounded-[17px]
Card D → rounded-3xl
```

tanpa alasan design.

---

# 45. Avoid Decorative Overload

Tailwind membuat penambahan efek sangat mudah.

Jangan otomatis menambahkan:

```text
shadow
gradient
blur
border
glow
backdrop blur
opacity
```

ke semua element.

Contoh buruk:

```tsx
<div className="
  border
  border-white/20
  bg-gradient-to-br
  from-white/10
  to-white/5
  shadow-2xl
  shadow-red-500/20
  backdrop-blur-xl
">
```

Gunakan hanya bila mendukung visual hierarchy.

---

# 46. Prefer Hierarchy Over Decoration

UI bagus biasanya berasal dari:

```text
Typography
Whitespace
Alignment
Scale
Contrast
Motion
```

sebelum:

```text
Gradient
Glow
Shadow
Glass effect
```

Agent harus mencoba layout yang sederhana terlebih dahulu.

---

# 47. Scroll Project Specific Rules

Untuk website cinematic seperti Ruang Merdeka:

Tailwind bertanggung jawab terhadap:

```text
responsive positioning
viewport sizing
typography
layering
spacing
colors
static visual states
```

GSAP bertanggung jawab terhadap:

```text
scroll timeline
pinning
progress
sequencing
camera coordination
```

Three.js bertanggung jawab terhadap:

```text
3D scene
particle
shader
lighting
camera
```

Jangan mencampurkan responsibility.

---

# 48. Good Hero Example

```tsx
<section
  className="
    relative
    isolate
    min-h-svh
    overflow-hidden
    bg-surface
    text-foreground
  "
>
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-0"
  >
    <HeroScene />
  </div>

  <div
    className="
      relative
      z-10
      flex
      min-h-svh
      flex-col
      items-center
      justify-center
      px-5
      text-center
      md:px-10
    "
  >
    <span className="text-xs tracking-[0.3em] text-white/50">
      17.08.2026
    </span>

    <h1 className="text-[clamp(7rem,24vw,18rem)] font-bold leading-none tracking-tighter">
      81
    </h1>

    <p className="text-sm font-medium tracking-[0.2em] md:text-base">
      TAHUN MERDEKA
    </p>
  </div>
</section>
```

Notice:

```text
mobile-first
semantic HTML
responsive typography
limited arbitrary values
clear layering
decorative scene aria-hidden
no unnecessary custom CSS
```

---

# 49. Anti-Patterns

Agent MUST avoid:

```text
❌ Dynamic class fragments
❌ tailwind.config.js by default in new v4 projects
❌ Excessive arbitrary values
❌ @apply everywhere
❌ transition-all everywhere
❌ Desktop-first responsive styling
❌ Hover-only functionality
❌ Giant unstructured className
❌ Random z-[9999]
❌ Repeated hex colors
❌ Repeated magic numbers
❌ Custom CSS when an existing utility exists
❌ Creating CSS classes instead of reusable components
❌ Excessive breakpoints
❌ Styling everything with gradients/glows
❌ Missing focus-visible states
❌ Ignoring reduced motion
❌ Using JS state for simple CSS hover/focus behavior
```

---

# 50. Agent Decision Flow

Before writing CSS ask:

```text
Can Tailwind utility solve this?
│
├─ YES
│  └─ Use utility.
│
└─ NO
   │
   ├─ Is this a reusable design token?
   │  └─ Add @theme.
   │
   ├─ Is this a one-off value?
   │  └─ Use arbitrary value.
   │
   ├─ Is this reusable CSS behavior?
   │  └─ Consider @utility.
   │
   └─ Is this third-party/global CSS?
      └─ Write custom CSS / @apply if appropriate.
```

---

# 51. Agent Review Checklist

Before finishing a component:

* [ ] Uses Tailwind CSS v4 patterns.
* [ ] Uses `@import "tailwindcss"`.
* [ ] Uses CSS-first configuration where appropriate.
* [ ] Repeated design values use `@theme`.
* [ ] No dynamically constructed Tailwind class names.
* [ ] Mobile-first responsive design.
* [ ] No unnecessary breakpoints.
* [ ] No unnecessary arbitrary values.
* [ ] No excessive `@apply`.
* [ ] Repeated UI is extracted as components.
* [ ] Layout spacing primarily uses `gap`.
* [ ] Interactive elements have hover/focus/active states.
* [ ] Important interactions work without hover.
* [ ] Focus-visible state exists.
* [ ] Reduced-motion behavior considered.
* [ ] Class list can be sorted automatically.
* [ ] No random high z-index values.
* [ ] No unnecessary custom CSS.
* [ ] Component remains readable.
* [ ] 3D/GSAP logic is not mixed unnecessarily with Tailwind styling.
* [ ] Mobile layout is intentionally designed, not merely scaled desktop.

---

# Core Philosophy

```text
Utility First
+
Design Tokens
+
Mobile First
+
Component Reuse
+
Responsive Simplicity
+
Accessible States
=
Maintainable Tailwind UI
```

The agent should prefer:

```text
simple
predictable
consistent
responsive
readable
```

over:

```text
clever
over-abstracted
pixel-hacked
effect-heavy
```

Final rule:

> **Use Tailwind to express the design system directly in the component, not to recreate traditional CSS architecture inside Tailwind.**
