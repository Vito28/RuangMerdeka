---
name: scrolling-animation
description: Best practices for cinematic scroll-driven animation using GSAP and ScrollTrigger. Use when implementing pinned sections, scrubbed timelines, scroll storytelling, text reveals, parallax, section transitions, or coordinating scroll progress with Three.js.
---

# Scrolling Animation Skill

## Purpose

Skill ini menjadi guideline untuk membuat **scroll-driven cinematic website** yang modern, smooth, responsive, dan tetap nyaman digunakan.

Cocok untuk project seperti:

* Interactive landing page
* Digital exhibition
* Storytelling website
* Portfolio cinematic
* 3D web experience
* Product showcase

Recommended stack:

```text
Next.js
TypeScript
Tailwind CSS
GSAP
GSAP ScrollTrigger
Lenis
Framer Motion
React Three Fiber
Three.js
Drei
```

---

# 1. Core Design Principles

Scroll animation harus membantu storytelling, bukan sekadar menunjukkan kemampuan animasi.

Gunakan prinsip:

```text
Content
↓
Story
↓
Motion
↓
Decoration
```

Jangan:

```text
Animation
↓
Content dipaksakan mengikuti animation
```

Setiap animasi harus memiliki tujuan.

Contoh:

```text
Fade In
→ memperkenalkan informasi

Scale
→ meningkatkan fokus

Parallax
→ memberikan depth

Pinned Section
→ mempertahankan perhatian dalam satu chapter

Camera Movement
→ membawa user berpindah ruang

Particle Transition
→ menghubungkan dua scene
```

---

# 2. Scroll Storytelling Structure

Jangan membuat setiap `100vh` menjadi section terpisah.

Untuk cinematic storytelling, satu section dapat memiliki beberapa **scroll phases**.

Contoh:

```text
SECTION
height: 180vh

Scroll Progress
0.00 ───────────────────── 1.00

0.00 – 0.20
Intro

0.20 – 0.45
Visual transformation

0.45 – 0.70
Main message

0.70 – 0.90
Transition

0.90 – 1.00
Next section preparation
```

Gunakan normalized progress:

```ts
progress = 0 → 1
```

Semua animation state sebaiknya mengikuti progress yang sama.

---

# 3. Pinned Section Best Practices

Pinned section cocok untuk storytelling seperti:

```text
81 Tahun Merdeka
↓
Satu Bangsa
↓
Ribuan Pulau
↓
Jutaan Cerita
↓
Merdeka
```

Gunakan:

```text
Desktop:
150vh – 220vh

Tablet:
130vh – 180vh

Mobile:
120vh – 150vh
```

Hindari section:

```text
400vh
500vh
700vh
```

kecuali memang memiliki konten yang sangat banyak.

User harus selalu merasa bahwa scroll mereka menghasilkan perubahan.

Rule:

> Setiap ±15–25% scroll harus terjadi perubahan visual yang terasa.

---

# 4. Scroll Animation Hierarchy

Dalam satu viewport jangan semua elemen bergerak sekaligus.

Gunakan hierarchy:

### Primary Motion

Animasi utama yang menjadi fokus.

Contoh:

```text
3D Indonesia zoom
```

### Secondary Motion

Mendukung animasi utama.

```text
Typography fade
Particle movement
Background shift
```

### Ambient Motion

Gerakan sangat kecil.

```text
Floating particle
Noise
Glow
Light movement
```

Ideal:

```text
1 Primary
1–2 Secondary
1–3 Ambient
```

Jangan memiliki 5 animasi besar berjalan bersamaan.

---

# 5. Typography Animation

Typography adalah bagian terpenting setelah visual utama.

Gunakan animasi seperti:

### Reveal

```text
opacity: 0 → 1
y: 40 → 0
```

### Mask Reveal

```text
overflow: hidden

Text:
y: 100% → 0%
```

### Word Reveal

```text
SATU
BANGSA
```

muncul sedikit bertahap.

### Character Animation

Gunakan hanya pada:

* Hero
* Main title
* Special moment

Jangan untuk semua paragraph.

---

## Recommended Timing

Heading:

```text
0.6 – 1.0s
```

Body:

```text
0.4 – 0.7s
```

Stagger:

```text
0.03 – 0.08s
```

Hindari animation terlalu lambat.

User tidak boleh menunggu text selesai sebelum dapat membaca.

---

# 6. Scroll-Based Typography

Untuk cinematic section:

```text
Scroll
↓
SATU BANGSA

Scroll
↓
RIBUAN PULAU

Scroll
↓
JUTAAN CERITA
```

Jangan menumpuk semua text di DOM visual secara bersamaan.

Gunakan:

```text
opacity
scale
blur
```

untuk memperjelas fokus.

Contoh:

```text
Current text:
opacity: 1
blur: 0

Previous text:
opacity: 0
blur: 8px
```

---

# 7. Parallax

Parallax harus subtle.

Recommended:

```text
Foreground:
translateY ±20px

Midground:
translateY ±10px

Background:
translateY ±5px
```

Jangan:

```text
Foreground: 200px
Background: -150px
```

karena akan membuat website terasa tidak stabil.

Gunakan depth:

```text
Foreground Typography
Middle Visual
Background Decoration
```

---

# 8. 3D Scroll Animation

Untuk React Three Fiber / Three.js:

Scroll sebaiknya memengaruhi:

```text
Camera Position
Camera Rotation
Object Rotation
Object Scale
Shader Uniform
Particle Position
Light Intensity
```

Hindari membuat state React update setiap frame.

Jangan:

```ts
setState(scrollProgress)
```

pada setiap scroll.

Gunakan:

```text
refs
GSAP
useFrame
shader uniforms
```

---

## Camera Movement

Camera movement harus lembut.

Contoh:

```text
camera.position.z

8
↓
6
↓
4
```

Jangan berpindah mendadak:

```text
8
↓
2
```

Gunakan easing.

Recommended:

```text
power2.out
power3.inOut
sine.inOut
```

Untuk cinematic transition:

```text
power3.inOut
```

---

# 9. ScrollTrigger Best Practices

Gunakan satu timeline untuk satu major section.

Recommended:

```ts
gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: "+=180%",
    scrub: 1,
    pin: true,
  },
});
```

Gunakan `scrub` untuk animasi yang benar-benar mengikuti scroll.

Recommended:

```text
scrub: 0.5 – 1.5
```

Jangan semua animation menggunakan scrub.

Gunakan normal timeline untuk:

* initial page load
* button interaction
* hover
* modal
* notification

---

# 10. Lenis Best Practices

Lenis digunakan untuk memberikan smooth scrolling.

Gunakan secara subtle.

Jangan membuat scrolling terasa berat atau terlambat.

User tetap harus merasa memiliki kontrol.

Recommended feel:

```text
smooth
responsive
natural
```

Bukan:

```text
slow
floaty
delayed
```

Integrasikan Lenis dengan GSAP ticker daripada menjalankan animation loop terpisah yang tidak perlu.

---

# 11. Section Transition

Setiap section harus terasa terhubung.

Hindari:

```text
Section 01 ends
BLACK CUT
Section 02 appears
```

Gunakan **shared visual transition**.

Contoh:

```text
Indonesia particle
↓
Particles mulai terlepas
↓
Particles memenuhi layar
↓
Particles berubah menjadi visual Section 02
```

atau:

```text
MERDEKA
↓
Typography scale 100%
↓
Huruf memenuhi layar
↓
Background berubah
↓
Section berikutnya muncul
```

Transition terbaik biasanya memakai satu elemen yang muncul di dua section.

---

# 12. Scroll Direction

Website harus tetap bekerja saat user scroll balik ke atas.

Semua scroll-driven animation harus reversible.

Pastikan:

```text
Scroll Down
→ animation forward

Scroll Up
→ animation backward
```

Jangan membuat pengalaman yang hanya benar ketika scrolling ke bawah.

---

# 13. Mobile UX

Mobile bukan desktop yang dikecilkan.

Gunakan prinsip:

> Same narrative, lighter animation.

Desktop:

```text
Full 3D
Particle
Camera movement
Mouse parallax
Long pinned scene
```

Mobile:

```text
Reduced 3D
Reduced particles
Typography-driven
Shorter timeline
Simple scale/fade
No hover
```

---

## Mobile Scroll Length

Desktop:

```text
180vh
```

Mobile:

```text
130–150vh
```

Hindari pinned section terlalu panjang pada mobile.

---

# 14. Avoid Horizontal Scroll Bugs

Selalu pastikan:

```css
html,
body {
  overflow-x: hidden;
}
```

Tetapi jangan menggunakan `overflow: hidden` secara sembarangan pada parent ScrollTrigger karena dapat mengganggu sticky/pinned behavior.

Decorative elements yang keluar viewport:

```css
pointer-events: none;
```

---

# 15. Touch Interaction

Jangan memiliki feature yang hanya tersedia lewat hover.

Jangan:

```text
Hover → informasi penting muncul
```

Gunakan:

```text
Tap
Scroll
Visible by default
```

Hover hanya enhancement desktop.

---

# 16. Motion Intensity

Gunakan rule:

```text
Small UI
→ Small motion

Large visual
→ Medium motion

Scene transition
→ Large motion
```

Contoh button:

```text
scale: 1 → 1.03
```

Bukan:

```text
scale: 1 → 1.3
```

---

# 17. Avoid Animation Overload

Jangan menggunakan sekaligus:

```text
Blur
+ Scale
+ Rotate
+ Parallax
+ Glow
+ Particle
+ Text scramble
```

untuk satu elemen.

Biasanya cukup:

```text
Opacity
+
Translate
```

atau:

```text
Opacity
+
Scale
+
Blur
```

Maximum sekitar 2–3 perubahan visual utama per element.

---

# 18. Easing System

Gunakan easing secara konsisten.

Recommended:

### UI

```text
power2.out
```

### Typography

```text
power3.out
```

### Cinematic Scene

```text
power3.inOut
```

### Ambient Motion

```text
sine.inOut
```

Jangan menggunakan easing random di setiap animation.

---

# 19. Performance

Scroll animation harus mempertahankan frame rate yang stabil.

Target:

```text
Desktop:
~60 FPS

Mobile:
30–60 FPS stable
```

Animasi terbaik menggunakan:

```text
transform
opacity
```

Hindari menganimasikan:

```text
width
height
top
left
margin
```

karena dapat menyebabkan layout recalculation.

Gunakan:

```text
translate
scale
rotate
opacity
```

---

# 20. GPU Usage

Gunakan GPU-friendly properties.

```css
will-change: transform;
```

tetapi hanya pada elemen yang benar-benar dianimasikan.

Jangan memberikan:

```css
will-change: transform;
```

ke seluruh halaman.

---

# 21. 3D Performance

Desktop:

```text
Particles:
5,000–15,000
```

Mobile:

```text
Particles:
1,000–3,000
```

Jumlah harus disesuaikan lewat testing.

Gunakan:

```text
BufferGeometry
Points
Instancing
Compressed textures
Adaptive DPR
```

Hindari ribuan individual mesh.

---

# 22. Adaptive Quality

Buat minimal tiga quality levels:

```text
HIGH
MEDIUM
LOW
```

### HIGH

```text
Full particles
Post processing
Higher DPR
More shadows
```

### MEDIUM

```text
Reduced particles
Minimal post processing
DPR max 1.5
```

### LOW

```text
Light particles
No post processing
No expensive shadows
DPR 1
```

Mobile sebaiknya default ke MEDIUM atau LOW.

---

# 23. Reduced Motion

Wajib support:

```css
@media (prefers-reduced-motion: reduce)
```

Jika aktif:

```text
Disable long pinned animation
Disable large camera motion
Disable strong parallax
Reduce particle movement
Replace complex transition with fade
```

Informasi tetap harus dapat diakses tanpa animation.

---

# 24. Responsive Breakpoints

Jangan hanya mengubah ukuran.

Ubah juga complexity.

Contoh:

```text
>= 1280px
Full cinematic experience

768px – 1279px
Medium complexity

< 768px
Mobile lightweight experience
```

Gunakan component behavior berdasarkan capability daripada hanya screen width jika memungkinkan.

---

# 25. Loading Experience

Jangan membuat user melihat loading screen panjang hanya karena WebGL.

Prioritas render:

```text
Page Background
↓
Typography
↓
Basic Layout
↓
3D Canvas
↓
Particle
↓
Extra Effects
```

Hero text harus dapat muncul meskipun 3D belum selesai.

---

# 26. Accessibility

Animated website tetap harus accessible.

Gunakan semantic HTML:

```html
<section>
<h1>
<h2>
<p>
<button>
```

Jangan membuat semua text sebagai Canvas.

Main copy harus tetap berupa DOM text agar:

* selectable
* readable screen reader
* SEO friendly
* responsive

Canvas digunakan untuk visual.

---

# 27. Animation Component Architecture

Recommended:

```text
animations/
├── scroll/
│   ├── createScrollTimeline.ts
│   ├── scrollConfig.ts
│   └── scrollProgress.ts
│
├── motion/
│   ├── reveal.ts
│   ├── fade.ts
│   └── parallax.ts
│
└── three/
    ├── cameraMotion.ts
    ├── particleMotion.ts
    └── sceneTransition.ts
```

Jangan menulis seluruh GSAP timeline langsung di satu page component.

---

# 28. Animation Tokens

Buat animation system.

Contoh:

```ts
export const motion = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1,
    cinematic: 1.5,
  },

  ease: {
    ui: "power2.out",
    reveal: "power3.out",
    cinematic: "power3.inOut",
    ambient: "sine.inOut",
  },
};
```

Tujuannya supaya animation seluruh website konsisten.

---

# 29. Scroll Progress Utility

Gunakan normalized progress.

Contoh:

```text
0 ───────────────────────────── 1

Intro
0 – 0.2

Formation
0.2 – 0.4

Story
0.4 – 0.7

Main Moment
0.7 – 0.9

Transition
0.9 – 1
```

Hindari magic numbers tersebar di component.

Buat constants seperti:

```ts
const PHASES = {
  INTRO_END: 0.2,
  FORMATION_END: 0.4,
  STORY_END: 0.7,
  FINALE_END: 0.9,
};
```

---

# 30. UI/UX Quality Checklist

Sebelum animation dianggap selesai, cek:

* [ ] User langsung memahami arah scroll.
* [ ] Tidak ada animation yang menghalangi membaca.
* [ ] Scroll terasa responsif.
* [ ] Tidak ada section pinned terlalu lama.
* [ ] Animation dapat berjalan mundur saat scroll up.
* [ ] Mobile tidak menggunakan hover dependency.
* [ ] Text penting tetap HTML/DOM.
* [ ] Tidak ada horizontal overflow.
* [ ] FPS mobile stabil.
* [ ] 3D memiliki adaptive quality.
* [ ] Reduced motion tersedia.
* [ ] Tidak semua elemen bergerak bersamaan.
* [ ] Setiap animation memiliki alasan UX.
* [ ] Transition antarsection terasa seamless.
* [ ] User tidak perlu menunggu animation untuk melanjutkan.
* [ ] Typography tetap menjadi fokus utama.
* [ ] 3D mendukung story, bukan mengalahkan story.

---

# 31. Design Philosophy

Gunakan formula:

```text
Minimal UI
+
Strong Typography
+
Purposeful Motion
+
Selective 3D
+
Smooth Storytelling
=
Premium Interactive Experience
```

Hindari:

```text
Too Many Effects
+
Long Scroll
+
Heavy 3D
+
Random Motion
=
Annoying Experience
```

Prinsip akhir:

> **The user should remember the story, not the animation library.**

Animasi terbaik adalah animasi yang terasa natural sehingga user menikmati perjalanan halaman tanpa merasa sedang melihat kumpulan efek.
