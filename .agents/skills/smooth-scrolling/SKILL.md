---
name: smooth-scrolling
description: Best practices for lightweight smooth scrolling with Lenis in React and Next.js. Use when configuring Lenis, integrating it with GSAP ScrollTrigger, handling anchors or nested scrolling, optimizing mobile scroll behavior, or preventing unnecessary scroll complexity.
---

# Lenis Smooth Scrolling — Best Practices

## Purpose

Skill ini menjadi guideline agent saat mengimplementasikan **smooth scrolling dengan Lenis**.

Prioritas:

```text
Natural scrolling
→ User control
→ Performance
→ Mobile stability
→ GSAP synchronization
→ Simplicity
```

Lenis hanya bertugas untuk membuat scrolling terasa lebih halus.

Jangan menggunakan Lenis sebagai tempat:

```text
animation logic
scene management
React state management
parallax engine
section transition engine
```

Gunakan pembagian responsibility:

```text
Lenis
→ Smooth scrolling

GSAP + ScrollTrigger
→ Scroll animation

React Three Fiber / Three.js
→ 3D scene

Tailwind CSS
→ Layout & responsive styling
```

---

# 1. Keep Lenis Simple

Untuk project cinematic, gunakan **satu global Lenis instance**.

Jangan membuat:

```text
Lenis instance untuk Hero
Lenis instance untuk Section 2
Lenis instance untuk Section 3
Lenis instance untuk modal
```

Gunakan:

```text
Application
└── One Lenis instance
    ├── Hero
    ├── Section 02
    ├── Section 03
    ├── Section 04
    └── Footer
```

Nested scroll hanya digunakan jika memang ada elemen yang harus memiliki scroll sendiri.

---

# 2. Installation

```bash
npm install lenis
```

atau:

```bash
pnpm add lenis
```

Untuk React / Next.js gunakan package yang sama dan import adapter React dari:

```ts
import { ReactLenis } from "lenis/react";
```

Lenis menyediakan adapter React resmi melalui `lenis/react`.

Import recommended stylesheet:

```ts
import "lenis/dist/lenis.css";
```

---

# 3. Recommended Architecture

Untuk Next.js:

```text
src/
├── app/
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   └── providers/
│       └── SmoothScrollProvider.tsx
│
└── lib/
    └── motion/
        └── scroll.ts
```

Jangan initialise Lenis di setiap page atau section.

Gunakan satu:

```tsx
<SmoothScrollProvider>
  {children}
</SmoothScrollProvider>
```

di root application.

---

# 4. Recommended Setup for This Project

Karena project menggunakan:

```text
GSAP
+
ScrollTrigger
+
Lenis
```

jangan gunakan RAF loop terpisah.

Gunakan **GSAP ticker sebagai animation loop utama**.

Official Lenis integration juga menggunakan `lenis.raf()` dari GSAP ticker sehingga Lenis dan GSAP berjalan melalui timeline yang sama.

Recommended:

```tsx
"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.1,
        anchors: true,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

Official React integration menggunakan `autoRaf: false` ketika RAF dikontrol dari GSAP ticker.

---

# 5. Do Not Run Two RAF Loops

Avoid:

```tsx
const lenis = new Lenis({
  autoRaf: true,
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
```

Ini berarti:

```text
Lenis RAF
+
GSAP RAF
```

mengontrol instance yang sama.

Untuk project dengan GSAP:

```text
Lenis autoRaf
→ false

GSAP ticker
→ drives Lenis
```

Untuk website sederhana tanpa GSAP:

```ts
const lenis = new Lenis({
  autoRaf: true,
});
```

Lenis menyediakan `autoRaf` untuk menjalankan RAF secara otomatis, sedangkan custom RAF dapat digunakan ketika ingin berbagi loop dengan animation engine lain.

---

# 6. Recommended Scroll Feel

Smooth scroll jangan terasa seperti user menyeret halaman yang berat.

Untuk project ini mulai dari:

```ts
{
  lerp: 0.1,
  smoothWheel: true,
}
```

Recommended tuning range:

```text
0.08 – 0.12
```

### Too low

```text
lerp: 0.03
```

akan terasa:

```text
slow
floaty
delayed
heavy
```

### Too high

```text
lerp: 0.4
```

akan terasa hampir seperti native scroll.

Goal:

> Smooth enough to feel cinematic, responsive enough to feel native.

Default Lenis untuk `lerp` saat ini adalah `0.1`.

---

# 7. Choose Lerp or Duration

Jangan mencoba men-tune:

```ts
lerp
+
duration
+
easing
```

bersamaan tanpa alasan.

Jika `lerp` digunakan, Lenis mengabaikan `duration` dan `easing` untuk smoothing tersebut.

Untuk project ini:

```ts
lerp: 0.1
```

sudah cukup.

Avoid unnecessary configuration:

```ts
{
  lerp: 0.1,
  duration: 1.5,
  easing: customEase,
}
```

Prefer:

```ts
{
  lerp: 0.1,
}
```

Minimal configuration lebih mudah dipelihara.

---

# 8. Mobile Must Feel Native

Ini sangat penting.

Jangan memaksa touch scrolling menjadi terlalu smooth.

Recommended:

```ts
{
  smoothWheel: true,
  syncTouch: false,
}
```

`smoothWheel` memproses wheel scrolling, sementara `syncTouch` adalah mode terpisah untuk meniru smooth scrolling pada touch input dan default-nya `false`.

Untuk project ini:

```text
Desktop mouse wheel
→ Lenis smoothing

Laptop trackpad
→ Lenis smoothing

Mobile touch
→ mostly native feeling
```

Jangan mengaktifkan:

```ts
syncTouch: true
```

hanya agar mobile terasa lebih cinematic.

Mobile harus tetap terasa cepat dan natural.

---

# 9. Do Not Increase Scroll Multipliers Randomly

Avoid:

```ts
{
  wheelMultiplier: 2,
  touchMultiplier: 2,
}
```

Default kedua multiplier adalah `1`.

Untuk project cinematic:

```text
wheelMultiplier: 1
touchMultiplier: 1
```

biasanya cukup.

Jangan mempercepat atau memperlambat input user tanpa alasan UX yang jelas.

---

# 10. Lenis Should Not Create Cinematic Timing

Bad:

```text
User scrolls
↓
Lenis artificially slows everything
↓
Website feels cinematic
```

Correct:

```text
User scrolls naturally
↓
Lenis smooths input
↓
GSAP controls cinematic progression
```

Cinematic feeling harus datang dari:

```text
GSAP timeline
camera movement
typography
scene transition
```

bukan dari scrolling yang sengaja dibuat lambat.

---

# 11. GSAP ScrollTrigger Integration

Jika menggunakan ScrollTrigger, update ScrollTrigger saat Lenis scroll berubah.

Core integration:

```ts
lenis.on("scroll", ScrollTrigger.update);
```

dan gunakan:

```ts
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
```

Official Lenis documentation menggunakan pola tersebut untuk sinkronisasi dengan ScrollTrigger.

Dengan React wrapper, pertahankan prinsip yang sama:

```text
One GSAP ticker
→ Lenis RAF
→ ScrollTrigger
→ 3D animations
```

Bukan banyak independent animation loops.

---

# 12. One Animation Loop Principle

Untuk project ini gunakan:

```text
GSAP Ticker
│
├── Lenis
│
├── ScrollTrigger
│
└── scroll-driven DOM animation
```

R3F tetap memiliki render loop WebGL sendiri jika dibutuhkan.

Tetapi jangan membuat tambahan:

```text
requestAnimationFrame A
requestAnimationFrame B
requestAnimationFrame C
setInterval animation
scroll listener animation
```

tanpa alasan.

Complexity budget:

```text
1 smooth-scroll loop
1 WebGL render loop
```

sebisa mungkin.

---

# 13. Avoid Heavy Scroll Listeners

Bad:

```ts
lenis.on("scroll", () => {
  calculateEverything();
  updateReactState();
  queryDOM();
  generateParticles();
  updateDatabase();
});
```

Scroll event bisa berjalan sangat sering.

Gunakan scroll listener hanya untuk operasi ringan.

Good:

```ts
lenis.on("scroll", ScrollTrigger.update);
```

Jika membutuhkan progress:

```ts
const progress = lenis.progress;
```

Gunakan refs atau animation library.

Jangan melakukan:

```ts
setScrollY(...)
```

setiap frame jika hanya digunakan untuk animation.

---

# 14. Avoid React Re-Renders During Scroll

Never:

```tsx
const [scrollY, setScrollY] = useState(0);

useLenis((lenis) => {
  setScrollY(lenis.scroll);
});
```

untuk animasi per-frame.

Ini dapat menyebabkan React render berulang.

Prefer:

```text
GSAP refs
Three.js refs
CSS variables
motion values
shader uniforms
```

React state hanya untuk state UI yang memang perlu rerender.

Example:

```text
current section changed
menu state
modal state
```

bukan setiap pixel scroll.

---

# 15. Avoid Excessive Scroll Observers

Jangan membuat setiap component:

```tsx
useLenis(...)
useLenis(...)
useLenis(...)
useLenis(...)
```

hanya untuk mengetahui progress.

Prefer:

```text
Lenis
↓
ScrollTrigger timeline per major section
```

Biarkan section memiliki animation timeline sendiri.

Lenis cukup menjadi global scroll source.

---

# 16. Nested Scroll

Contoh nested scroll:

```text
Modal
Scrollable gallery
Code editor
Dropdown long content
```

Lenis menyediakan `allowNestedScroll`, tetapi dokumentasinya memperingatkan bahwa opsi tersebut dapat menambah biaya karena DOM tree perlu diperiksa pada setiap scroll event. Untuk kasus performa-sensitive, Lenis menyarankan `data-lenis-prevent` atau `prevent`.

Untuk project ini jangan default:

```ts
allowNestedScroll: true
```

Lebih baik gunakan:

```tsx
<div
  data-lenis-prevent
  className="overflow-y-auto"
>
  ...
</div>
```

hanya pada component yang memang membutuhkan native nested scrolling.

---

# 17. Modal Scrolling

Untuk modal dengan isi panjang:

```tsx
<div
  data-lenis-prevent
  className="max-h-[80svh] overflow-y-auto"
>
  ...
</div>
```

Dengan begitu:

```text
Page
→ Lenis

Modal content
→ native scrolling
```

Jangan membuat second Lenis instance hanya untuk modal.

---

# 18. Anchor Links

Jika website memiliki navigation:

```text
Intro
Makna Merdeka
Indonesia Bergerak
Harapan
Finale
```

aktifkan:

```ts
anchors: true
```

Lenis secara default tidak mengaktifkan smooth handling untuk anchor links; `anchors: true` mengaktifkannya dan juga dapat menerima `scrollTo` options seperti offset.

Contoh:

```tsx
<a href="#harapan">
  Harapan
</a>
```

Jika ada navbar fixed:

```ts
anchors: {
  offset: -80,
}
```

atau sesuaikan dengan tinggi navigation.

---

# 19. Reduced Motion

Jangan disable accessibility hanya demi cinematic experience.

Gunakan default:

```ts
respectReducedMotion: true
```

Lenis saat ini menghormati `prefers-reduced-motion`; smoothing dan programmatic scroll animation akan dikurangi ketika preference tersebut aktif.

Jangan:

```ts
respectReducedMotion: false
```

kecuali ada alasan khusus.

Scroll harus tetap usable tanpa smooth animation.

---

# 20. Page Navigation

Saat user berpindah route:

```text
/2026
→ /
→ /2027
```

hindari inertia lama terbawa ke route baru.

Jika dibutuhkan:

```ts
stopInertiaOnNavigate: true
```

Lenis menyediakan opsi ini untuk menghentikan inertia ketika internal link diklik.

Untuk single-page 2026 ini belum terlalu penting, tetapi berguna ketika archive tahunan mulai dibuat.

---

# 21. Auto Resize

Default:

```ts
autoResize: true
```

Lenis menggunakan resize tracking secara otomatis; jika dimatikan, `.resize()` harus dipanggil manual.

Untuk project ini:

```text
Keep autoResize enabled.
```

Jangan membuat custom resize observer hanya untuk Lenis kecuali ada kebutuhan khusus.

---

# 22. Avoid `naiveDimensions`

Jangan gunakan:

```ts
naiveDimensions: true
```

sebagai default.

Lenis secara eksplisit memperingatkan bahwa mode tersebut dapat memiliki performance impact.

Recommended:

```ts
naiveDimensions: false
```

atau cukup jangan tentukan karena itu default.

---

# 23. Avoid Infinite Scroll Unless Required

Website Ruang Merdeka tidak membutuhkan:

```ts
infinite: true
```

Infinite scrolling menambah complexity yang tidak memberikan value pada storytelling linear.

Gunakan normal document flow:

```text
Section 01
↓
Section 02
↓
Section 03
↓
Section 04
↓
Section 05
```

---

# 24. Scroll Performance Budget

Smooth scrolling bukan berarti semua section harus memiliki animation.

Gunakan aturan:

```text
Major cinematic section
→ GSAP + ScrollTrigger

Normal content section
→ native layout

Tiny interaction
→ CSS/Tailwind

3D interaction
→ R3F
```

Jangan:

```text
Lenis
+
ScrollTrigger
+
Framer Motion
+
CSS scroll animation
+
IntersectionObserver
```

semuanya mengontrol element yang sama.

---

# 25. Avoid Too Many Pinned Sections

Lenis tidak membuat pinned scrolling menjadi gratis.

Jika terlalu banyak:

```text
Hero pinned
Section 2 pinned
Section 3 pinned
Section 4 pinned
Finale pinned
```

mobile experience akan terasa berat.

Untuk project ini prefer:

```text
Section 01
→ strong pinned experience

Section 02
→ selective pin / sticky

Section 03
→ light scroll animation

Section 04
→ normal interaction

Section 05
→ short cinematic finale
```

Smooth scrolling tetap terasa premium tanpa setiap section menjadi complex.

---

# 26. Mobile Complexity Rules

Desktop dapat menggunakan:

```text
Lenis
GSAP
ScrollTrigger
R3F
Particles
Camera animation
```

Mobile:

```text
Lenis wheel logic mostly irrelevant
Native touch feel
Reduced particle
Shorter animation timeline
Less pinned content
```

Jangan mencoba mengkompensasi mobile animation dengan membuat Lenis lebih lambat.

Mobile harus terasa:

```text
responsive
natural
stable
```

lebih penting daripada:

```text
super smooth
cinematic
floaty
```

---

# 27. Low-End Device Strategy

Jika device menunjukkan performance rendah:

Jangan mengubah Lenis lebih dulu.

Kurangi:

```text
particle count
post-processing
shader complexity
blur
large backdrop-filter
heavy DOM animation
```

Lenis sendiri sebaiknya tetap sederhana.

Recommended degradation:

```text
Full
↓
Reduce WebGL quality
↓
Reduce particles
↓
Remove post processing
↓
Simplify GSAP animation
↓
Keep scrolling usable
```

Smooth scrolling bukan fitur yang boleh merusak usability.

---

# 28. No Scroll Hijacking

Never:

```text
1 wheel input
=
force next section
```

kecuali experience memang dirancang seperti slide presentation.

Untuk website ini user harus tetap bebas:

```text
scroll sedikit
scroll cepat
scroll kembali ke atas
stop kapan saja
```

Lenis harus meningkatkan native scroll, bukan mengambil alih kontrol user.

---

# 29. Do Not Lock Scroll During Normal Animation

Avoid:

```text
User reaches hero
↓
scroll disabled
↓
animation finishes
↓
scroll enabled
```

Untuk storytelling berbasis scroll, animation harus mengikuti input user.

Gunakan:

```text
scrub
pin
progress
```

bukan scroll lock.

Scroll locking hanya cocok untuk:

```text
modal
dialog
critical transition tertentu
```

---

# 30. Recommended Configuration

Default project configuration:

```ts
const lenisOptions = {
  autoRaf: false,
  smoothWheel: true,
  syncTouch: false,
  lerp: 0.1,
  anchors: true,
  respectReducedMotion: true,
};
```

Ini sengaja kecil.

Jangan membuat configuration seperti:

```ts
{
  lerp,
  duration,
  easing,
  wheelMultiplier,
  touchMultiplier,
  syncTouch,
  syncTouchLerp,
  touchInertiaExponent,
  infinite,
  overscroll,
  autoToggle,
  allowNestedScroll,
  naiveDimensions,
  virtualScroll,
  ...
}
```

kecuali fitur tersebut memang dibutuhkan.

Principle:

> Do not configure what you do not need.

---

# 31. Recommended Provider

```tsx
"use client";

import gsap from "gsap";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

Keep provider boring.

Animation complexity belongs somewhere else.

---

# 32. Component Responsibility

```text
SmoothScrollProvider.tsx
```

should handle:

```text
Lenis initialization
RAF integration
global options
cleanup
```

It SHOULD NOT contain:

```text
Hero animation
particle logic
section detection
navigation state
camera movement
analytics
responsive layout
```

---

# 33. Cleanup Is Required

Any subscription or ticker callback must be removed.

Example:

```tsx
useEffect(() => {
  gsap.ticker.add(update);

  return () => {
    gsap.ticker.remove(update);
  };
}, []);
```

Jangan meninggalkan animation callback ketika component unmount.

Ini penting terutama selama development dengan React/Next.js.

---

# 34. Development Debug Rule

Jika scrolling terasa aneh:

Pertama disable Lenis.

```text
Does native scroll work?
│
├── NO
│   └── Layout/CSS problem.
│
└── YES
    └── Check Lenis integration.
```

Official Lenis troubleshooting juga menyarankan menguji halaman tanpa Lenis untuk memastikan source problem bukan layout scroll dasarnya.

Kemudian cek:

```text
duplicate Lenis instance
duplicate RAF loop
ScrollTrigger integration
nested scroll
overflow CSS
fixed elements
```

---

# 35. Complexity Budget

Untuk project ini agent harus mengikuti:

```text
1
Global Lenis instance

1
GSAP ticker integration

0
Extra RAF for Lenis

0
React state updates per scroll frame

0
Nested Lenis instances by default

0
syncTouch by default
```

Setiap tambahan complexity harus memiliki alasan yang jelas.

---

# 36. Agent MUST

Agent MUST:

* Keep a single global Lenis instance.
* Use `lenis/react` in React/Next.js projects.
* Prefer one shared RAF loop with GSAP.
* Keep `autoRaf: false` when GSAP drives Lenis.
* Keep `syncTouch: false` by default.
* Preserve native-feeling mobile scrolling.
* Respect reduced motion.
* Keep scroll callbacks lightweight.
* Prevent unnecessary React rerenders.
* Configure nested scroll explicitly.
* Clean up GSAP ticker listeners.
* Reduce visual complexity before altering scroll behavior.

---

# 37. Agent SHOULD

Agent SHOULD:

* Start around `lerp: 0.1`.
* Use smooth scrolling primarily for wheel/trackpad.
* Let GSAP create cinematic pacing.
* Use anchor support for single-page navigation.
* Keep configuration minimal.
* Test desktop mouse.
* Test trackpad.
* Test Android touch.
* Test iOS touch.
* Test low-power devices.
* Test with reduced motion enabled.

---

# 38. Agent MUST AVOID

```text
❌ Multiple Lenis instances
❌ Multiple RAF loops
❌ Very low lerp values
❌ Scroll intentionally delayed
❌ syncTouch enabled without reason
❌ Scroll hijacking
❌ React setState every scroll frame
❌ Expensive calculations in scroll callbacks
❌ allowNestedScroll everywhere
❌ naiveDimensions without reason
❌ Infinite scroll for normal storytelling
❌ Every section pinned
❌ Lenis controlling animation sequencing
❌ Using Lenis to compensate for bad animation performance
```

---

# 39. Final Architecture

```text
User Input
   │
   ▼
 LENIS
smooth input
   │
   ▼
GSAP TICKER
   │
   ├─────────────┐
   ▼             ▼
ScrollTrigger   Lenis RAF
   │
   ▼
Section Timeline
   │
   ├── Typography
   ├── DOM Motion
   └── 3D Progress
```

Lenis remains a small layer in the architecture.

---

# Core Philosophy

```text
Native Feel
+
Subtle Smoothing
+
Single Animation Loop
+
Lightweight Scroll Logic
+
Reduced Mobile Complexity
=
Premium Smooth Scrolling
```

Final rule:

> **Lenis should make scrolling feel better without making the user notice Lenis is there.**

If the scrolling itself becomes the most noticeable effect on the website, the smoothing is probably too aggressive.
