---
name: threejs
description: Best practices for performant Three.js and React Three Fiber experiences. Use when creating WebGL scenes, particles, shaders, cameras, lighting, GLTF assets, scroll-driven 3D animation, responsive 3D experiences, or optimizing GPU performance.
---

# Three.js / React Three Fiber — Best Practices

## Purpose

Skill ini menjadi guideline utama agent saat membuat atau memodifikasi **3D web experience menggunakan Three.js dan React Three Fiber**.

Prioritas:

```text
Visual Quality
→ Stable Performance
→ Mobile Compatibility
→ Maintainability
→ Progressive Enhancement
→ Accessibility
```

Target utama bukan membuat scene paling kompleks.

Target utama:

> **Create the simplest 3D scene that delivers the intended visual experience.**

Untuk project cinematic seperti **Ruang Merdeka**, 3D harus mendukung storytelling.

Bukan menjadi alasan website terasa berat.

---

# 1. Responsibility Separation

Gunakan pembagian responsibility berikut:

```text
Three.js / React Three Fiber
→ 3D scene
→ geometry
→ material
→ lighting
→ particle
→ camera
→ shader

GSAP
→ scroll timeline
→ sequencing
→ camera animation progress
→ cinematic transition

Lenis
→ smooth scrolling

Tailwind CSS
→ DOM layout
→ typography
→ responsive design
→ layering
```

Jangan membuat Three.js mengontrol seluruh halaman.

DOM tetap menjadi tempat untuk:

```text
headings
paragraphs
buttons
navigation
forms
SEO content
accessible content
```

Canvas hanya untuk visual 3D.

---

# 2. Prefer React Three Fiber in React Projects

Untuk Next.js / React:

Prefer:

```tsx
import { Canvas } from "@react-three/fiber";
```

daripada membuat renderer manual:

```tsx
new THREE.WebGLRenderer(...)
```

di dalam React component.

R3F membantu mengelola lifecycle object Three.js melalui React.

Gunakan raw Three.js ketika:

```text
custom shader logic
geometry manipulation
math utilities
special renderer behavior
advanced GPU work
```

---

# 3. One Main Canvas

Untuk cinematic single-page website, prefer:

```text
Page
└── Canvas
    ├── Scene 01
    ├── Scene 02
    ├── Scene 03
    └── Finale
```

daripada:

```text
Hero Canvas
Section 02 Canvas
Section 03 Canvas
Section 04 Canvas
Footer Canvas
```

Setiap WebGL context memiliki resource dan lifecycle sendiri.

Untuk project ini gunakan **satu main Canvas** sebisa mungkin.

Scene dapat berubah berdasarkan scroll progress.

---

# 4. Do Not Put Everything in Canvas

Bad:

```text
Canvas
├── Main heading
├── Paragraph
├── CTA
├── Navigation
├── Form
└── 3D
```

Prefer:

```text
DOM
├── Heading
├── Paragraph
├── CTA
├── Navigation
└── Form

Canvas
└── 3D Visual
```

Manfaat:

```text
better accessibility
better SEO
better text rendering
easier responsive design
lighter GPU workload
```

---

# 5. Scene Architecture

Recommended:

```text
three/
├── SceneCanvas.tsx
│
├── scenes/
│   ├── HeroScene.tsx
│   ├── SovereignScene.tsx
│   ├── MovingIndonesiaScene.tsx
│   └── FinaleScene.tsx
│
├── objects/
│   ├── IndonesiaParticles.tsx
│   ├── Flag.tsx
│   └── AmbientParticles.tsx
│
├── camera/
│   └── SceneCamera.tsx
│
├── lighting/
│   └── SceneLighting.tsx
│
├── materials/
│   └── materials.ts
│
├── shaders/
│   ├── flag.vert
│   └── flag.frag
│
└── utils/
    ├── quality.ts
    └── math.ts
```

Jangan membuat:

```text
HeroScene.tsx
= 1,500 lines
```

Pisahkan berdasarkan responsibility.

---

# 6. Scene Complexity Budget

Sebelum menambahkan object baru, tanyakan:

```text
Does this improve the story?
│
├─ YES
│  └─ Add if performance allows.
│
└─ NO
   └─ Do not add.
```

Untuk setiap major scene prefer:

```text
1 Primary visual
1–3 Supporting objects
1 Ambient system
```

Contoh:

```text
Primary
→ Indonesia particle map

Supporting
→ glow
→ light
→ floating particles

Ambient
→ subtle background particle
```

Jangan membuat puluhan animated systems sekaligus.

---

# 7. Reuse Geometry

Bad:

```ts
for (...) {
  const geometry = new THREE.SphereGeometry();
}
```

Prefer:

```ts
const geometry = new THREE.SphereGeometry();

for (...) {
  const mesh = new THREE.Mesh(geometry, material);
}
```

Jika beberapa object menggunakan bentuk yang sama:

```text
reuse geometry
reuse material
change transform
```

Jangan membuat resource GPU baru tanpa kebutuhan.

---

# 8. Reuse Materials

Bad:

```ts
items.map(() => {
  return new THREE.MeshStandardMaterial({
    color: "red",
  });
});
```

jika semua material identik.

Prefer satu shared material:

```ts
const material = new THREE.MeshStandardMaterial({
  color: "red",
});
```

Kemudian gunakan kembali.

---

# 9. Use Instancing for Repeated Objects

Jika terdapat banyak object dengan:

```text
same geometry
+
same material
+
different transforms
```

gunakan:

```ts
THREE.InstancedMesh
```

`InstancedMesh` memang dibuat untuk mengurangi draw calls ketika banyak object memakai geometry dan material yang sama.

Contoh penggunaan:

```text
100 stars
500 dots
1,000 markers
repeated vegetation
repeated symbols
```

Prefer:

```text
1 InstancedMesh
```

daripada:

```text
1,000 Mesh
```

---

# 10. Particle Systems

Untuk particle dalam jumlah besar prefer:

```text
THREE.Points
+
BufferGeometry
+
PointsMaterial
```

atau custom shader.

Untuk project Indonesia:

```text
Indonesia point cloud
→ Points / BufferGeometry

Ambient particles
→ Points

Repeated geometric objects
→ InstancedMesh
```

Jangan membuat:

```text
5,000 individual React <mesh>
```

---

# 11. Particle Count Is Not a Design Goal

Jangan berpikir:

```text
More particles
=
better visual
```

Mulai kecil.

Suggested starting point:

```text
Desktop
2,000 – 8,000

Tablet
1,000 – 4,000

Mobile
500 – 2,000
```

Kemudian naikkan hanya jika memang terlihat perlu.

Visual composition lebih penting daripada jumlah particle.

---

# 12. BufferGeometry First

Untuk custom particle atau geometry besar prefer:

```ts
THREE.BufferGeometry
```

Gunakan typed arrays:

```ts
Float32Array
```

Contoh:

```ts
const positions = new Float32Array(count * 3);

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3),
);
```

Jangan membuat ribuan object JavaScript jika data dapat disimpan dalam buffer GPU.

---

# 13. Avoid Recreating Geometry Every Frame

Never:

```tsx
useFrame(() => {
  const geometry = new THREE.BufferGeometry();
});
```

atau:

```tsx
useFrame(() => {
  const material = new THREE.MeshStandardMaterial();
});
```

Object GPU yang stabil harus dibuat sekali.

Gunakan:

```text
module scope
useMemo
loader cache
component mount
```

tergantung lifecycle.

---

# 14. Never Use React State for Per-Frame Animation

Bad:

```tsx
const [rotation, setRotation] = useState(0);

useFrame(() => {
  setRotation((value) => value + 0.01);
});
```

R3F merekomendasikan melakukan fast updates lewat render loop menggunakan refs/mutation daripada `setState`, karena update melalui React scheduler menambah overhead yang tidak diperlukan.

Correct:

```tsx
const meshRef = useRef<THREE.Mesh>(null);

useFrame((_, delta) => {
  if (!meshRef.current) return;

  meshRef.current.rotation.y += delta * 0.2;
});
```

---

# 15. Use Delta Time

Bad:

```tsx
useFrame(() => {
  mesh.rotation.y += 0.01;
});
```

Kecepatan akan tergantung refresh rate.

Prefer:

```tsx
useFrame((state, delta) => {
  mesh.rotation.y += delta * speed;
});
```

Gunakan `delta` untuk animation yang harus time-based.

---

# 16. Scroll Animation ≠ useFrame State

Untuk project scroll cinematic:

```text
Lenis
↓
ScrollTrigger
↓
normalized scroll progress
↓
3D refs
```

Jangan melakukan:

```text
scroll event
↓
React state
↓
rerender
↓
Three.js
```

60 kali per detik.

Prefer:

```text
scroll progress
→ ref
→ useFrame / GSAP
→ transform
```

---

# 17. Prefer Normalized Progress

Untuk scroll-driven scene gunakan:

```text
0.0 ───────────────────── 1.0
```

Example:

```ts
progressRef.current = 0.65;
```

Kemudian:

```ts
camera.position.z = THREE.MathUtils.lerp(
  8,
  4,
  progressRef.current,
);
```

Ini lebih mudah dipelihara daripada logic:

```text
if scrollY > 734
if scrollY > 891
if scrollY > 1273
```

---

# 18. Camera Should Be Simple

Default cinematic camera:

```tsx
<PerspectiveCamera
  makeDefault
  position={[0, 0, 8]}
  fov={45}
/>
```

Jangan sering mengganti camera type.

Untuk sebagian besar cinematic storytelling:

```text
one PerspectiveCamera
+
camera animation
```

sudah cukup.

---

# 19. Avoid Excessive Camera Motion

Camera movement dapat cepat menyebabkan motion sickness.

Prefer:

```text
small translation
small rotation
slow dolly
controlled zoom
```

Avoid:

```text
fast spin
large roll
rapid FOV changes
aggressive shake
```

Camera harus membawa user ke scene.

Bukan menunjukkan bahwa camera dapat bergerak.

---

# 20. Camera Near / Far

Jangan menggunakan:

```ts
near={0.0001}
far={1000000}
```

tanpa alasan.

Gunakan range sekecil yang scene perlukan.

Example:

```tsx
<PerspectiveCamera
  near={0.1}
  far={100}
/>
```

Scene scale harus konsisten.

---

# 21. Responsive Camera

3D layout tidak boleh hanya:

```text
desktop scene
↓
canvas shrink
```

Mobile dapat membutuhkan:

```text
different camera position
different FOV
different object scale
different composition
```

Example:

```text
Desktop:
Indonesia fills 60% viewport

Mobile:
Indonesia fills 35–45% viewport
```

Typography DOM tetap menjadi prioritas.

---

# 22. Renderer Resolution

High DPI dapat menambah jumlah pixel yang harus dirender secara drastis. Three.js sendiri memperingatkan bahwa full device pixel ratio pada aplikasi 3D berat dapat menyebabkan GPU load dan frame rate buruk, terutama pada layar beresolusi tinggi.

Untuk R3F, cap DPR.

Recommended starting point:

```tsx
<Canvas dpr={[1, 1.5]}>
```

atau:

```text
Desktop high:
max 1.5–2

Tablet:
max 1.5

Mobile:
1–1.5
```

Jangan otomatis:

```tsx
dpr={window.devicePixelRatio}
```

untuk scene berat.

---

# 23. Mobile Quality First

Jangan menunggu scene lag baru membuat mobile fallback.

Buat quality tier sejak awal.

```ts
type Quality = "high" | "medium" | "low";
```

Example:

```text
HIGH
particles 8000
shadows yes
post FX selected
DPR 1.5

MEDIUM
particles 3500
one shadow
minimal FX
DPR 1.25

LOW
particles 1200
no dynamic shadow
no post processing
DPR 1
```

---

# 24. Quality Should Change Complexity

Quality level jangan hanya:

```text
HIGH = prettier
LOW = slightly blurry
```

Quality harus benar-benar mengurangi GPU work.

Reduce:

```text
particle count
texture dimensions
shadow resolution
post processing
geometry detail
shader complexity
draw calls
DPR
```

---

# 25. Texture Dimensions Matter

Texture file kecil belum tentu ringan di GPU.

Three.js manual menjelaskan bahwa texture pada GPU secara kasar memerlukan:

```text
width × height × 4 × 1.33
```

bytes, dan sebuah image yang kecil sebagai file download masih dapat memakai puluhan MB setelah dibuka di GPU.

Karena itu:

```text
optimize dimensions
not only file size
```

---

# 26. Texture Size Rules

Jangan langsung menggunakan:

```text
4096 × 4096
```

untuk semua texture.

Mulai dari:

```text
512
1024
2048
```

berdasarkan kebutuhan visual.

Gunakan 4K hanya jika perbedaannya benar-benar terlihat pada target display.

Untuk mobile, sering kali texture lebih kecil sudah cukup.

---

# 27. Correct Color Space

Untuk color/albedo texture:

```ts
texture.colorSpace = THREE.SRGBColorSpace;
```

Three.js manual menggunakan `SRGBColorSpace` untuk color textures.

Jangan menerapkan color-space setting yang sama secara membabi buta pada data maps seperti normal maps.

---

# 28. Prefer glTF / GLB for Models

Untuk web models prefer:

```text
.glb
.gltf
```

`GLTFLoader` mendukung glTF 2.0 serta compression extensions seperti Draco, Meshopt, dan KTX2/Basis texture workflows.

Jangan default ke:

```text
OBJ
FBX
```

untuk web delivery baru jika asset pipeline dapat menggunakan glTF.

---

# 29. Compression Is a Trade-Off

DRACO dapat mengurangi ukuran geometry download, tetapi decoding juga memiliki cost di client. Three.js menyebut Draco dapat membuat geometry jauh lebih kecil dengan trade-off berupa waktu decoding tambahan.

Gunakan compression ketika asset cukup besar untuk mendapatkan benefit.

Jangan:

```text
compress everything
because compression exists
```

---

# 30. Reuse Loaders

Jika menggunakan Draco:

```text
create one DRACOLoader
reuse it
```

Three.js secara eksplisit merekomendasikan reuse satu `DRACOLoader` daripada membuat banyak decoder instances.

Jangan:

```tsx
<ComponentA>
  new DRACOLoader()
</ComponentA>

<ComponentB>
  new DRACOLoader()
</ComponentB>
```

---

# 31. Compressed Textures

Untuk project besar, pertimbangkan:

```text
KTX2 / Basis
```

Three.js `KTX2Loader` dapat mentranscode texture ke GPU compressed format yang didukung device.

Gunakan jika texture memory / bandwidth memang menjadi bottleneck.

Jangan menambah pipeline KTX2 hanya karena terlihat advanced.

---

# 32. Loading Strategy

Jangan block seluruh website sampai seluruh 3D asset selesai.

Recommended:

```text
HTML / Typography
↓
Hero base visual
↓
Critical 3D asset
↓
Supporting assets
↓
Decorative assets
```

Three.js loaders bekerja asynchronous, dan `LoadingManager` tersedia bila memang perlu mengkoordinasikan beberapa asset atau progress loading.

---

# 33. Avoid Long Loading Screens

Bad:

```text
Loading 3D...
87%
```

selama beberapa detik sebelum user dapat membaca apa pun.

Prefer:

```text
DOM hero already visible
+
3D progressively appears
```

Loading screen hanya gunakan jika experience benar-benar tidak dapat dimulai tanpa asset tersebut.

---

# 34. Use Suspense Carefully

Dalam R3F:

```tsx
<Suspense fallback={null}>
  <Scene />
</Suspense>
```

boleh digunakan untuk asset loading.

Tetapi jangan membuat seluruh homepage blank karena satu decorative GLB belum selesai.

Critical DOM content harus independent dari Canvas loading.

---

# 35. Lighting Should Be Intentional

Jangan:

```text
AmbientLight
DirectionalLight
SpotLight
PointLight
PointLight
RectAreaLight
HemisphereLight
```

semua dipasang karena scene terlihat kurang terang.

Mulai dari:

```text
Environment / ambient contribution
+
one key light
```

Kemudian tambah hanya jika perlu.

---

# 36. Shadows Are Expensive

Three.js menggunakan shadow maps, yang berarti scene perlu dirender dari sudut pandang light untuk menghasilkan shadow. Banyak shadow-casting lights dapat menyebabkan scene dirender berulang kali; point-light shadow bahkan membutuhkan enam arah render.

Untuk project ini:

```text
0–1 main shadow-casting light
```

adalah starting point.

---

# 37. Do Not Enable Shadow Everywhere

Bad:

```tsx
<mesh castShadow receiveShadow />
```

untuk semua object.

Tentukan secara selektif:

```text
Hero centerpiece
→ cast shadow

background particles
→ no shadow

small decorations
→ no shadow

ground
→ receive only
```

---

# 38. Keep Shadow Map Reasonable

Shadow map besar:

```text
better detail
+
more GPU/memory cost
```

Three.js menyarankan menggunakan shadow-map resolution dan shadow-camera area sekecil mungkin selama masih memenuhi kebutuhan visual.

Jangan default:

```text
4096 × 4096 shadow map
```

Mulai rendah dan naikkan jika terlihat perlu.

---

# 39. Fake Shadows Are Valid

Tidak semua visual membutuhkan real-time shadow.

Untuk small objects dapat menggunakan:

```text
blurred plane
radial gradient
texture shadow
ambient grounding
```

Three.js manual juga menunjukkan fake textured shadows sebagai alternatif yang jauh lebih murah daripada shadow maps.

---

# 40. Material Complexity

Gunakan material paling sederhana yang memenuhi kebutuhan.

```text
Unlit object
→ MeshBasicMaterial

Simple stylized object
→ lightweight material

Realistic PBR
→ MeshStandardMaterial

Advanced physical effects
→ MeshPhysicalMaterial

Custom visual
→ ShaderMaterial
```

Jangan menggunakan material paling mahal hanya karena tersedia.

---

# 41. Shader Complexity Budget

Shader harus tetap sederhana terutama pada mobile.

Avoid fragment shader dengan:

```text
many loops
many texture samples
complex noise stacked repeatedly
heavy branching
multiple procedural effects
```

Mulai dengan shader sederhana.

Tambah complexity satu per satu.

---

# 42. Prefer Vertex Work When Possible

Jika efek dapat dilakukan pada vertex daripada setiap screen pixel, pertimbangkan vertex shader.

Contoh:

```text
flag waving
particle displacement
simple surface deformation
```

sering cocok dilakukan melalui vertex shader.

Fragment shader gunakan untuk:

```text
color
lighting
mask
glow
surface appearance
```

sesuai kebutuhan.

---

# 43. Avoid Updating Shader Uniforms Through React State

Bad:

```tsx
setTime(clock.elapsedTime);
```

Prefer:

```tsx
useFrame(({ clock }) => {
  materialRef.current.uniforms.uTime.value =
    clock.elapsedTime;
});
```

Fast-changing shader values tidak perlu masuk React state.

---

# 44. Post Processing Must Be Limited

Post-processing bukan default requirement.

Gunakan hanya efek yang menghasilkan perbedaan visual nyata.

Untuk project ini mungkin:

```text
subtle bloom
+
very light vignette/noise
```

cukup.

Avoid:

```text
Bloom
+
SSAO
+
Depth of Field
+
Chromatic Aberration
+
Film
+
Motion Blur
+
God Rays
```

semuanya sekaligus.

---

# 45. Mobile Post Processing

Default mobile:

```text
none
or
one lightweight effect
```

Desktop dapat memiliki beberapa effect jika performance masih stabil.

Jika FPS turun:

```text
first disable post processing
```

sebelum mengorbankan interaction.

---

# 46. Render Only When Needed

Untuk scene statis, continuous rendering membuang daya dan baterai. Three.js manual merekomendasikan render-on-demand ketika scene hanya berubah akibat input, loading, atau event tertentu.

Dalam R3F untuk scene non-continuous dapat mempertimbangkan:

```tsx
<Canvas frameloop="demand">
```

Tetapi project cinematic scrolling biasanya memiliki animation aktif.

Gunakan berdasarkan scene behavior.

---

# 47. Do Not Force Demand Rendering on Animated Scenes

Jika scene memiliki:

```text
continuous particles
flag shader
camera motion
ambient animation
```

continuous frame loop mungkin memang diperlukan.

Jangan membuat optimization yang malah membuat architecture lebih rumit.

Rule:

```text
Static scene
→ demand

Continuous cinematic scene
→ always

Hybrid
→ evaluate
```

---

# 48. Pause Invisible Work

Jika Canvas / scene tidak terlihat:

```text
pause expensive animation
```

bila architecture memungkinkan.

Jangan membuat:

```text
hidden section
+
full particle simulation
+
shader updates
```

terus berjalan tanpa manfaat visual.

---

# 49. Avoid Heavy Calculations in useFrame

Bad:

```tsx
useFrame(() => {
  generate10000Particles();
  parseJSON();
  filterHugeArray();
});
```

`useFrame` sebaiknya:

```text
read values
interpolate
mutate transforms
update uniforms
```

Heavy calculation harus dilakukan:

```text
once
on asset load
in useMemo
in worker
offline preprocessing
```

sesuai kebutuhan.

---

# 50. Avoid Allocations Inside useFrame

Bad:

```tsx
useFrame(() => {
  const vector = new THREE.Vector3();
});
```

setiap frame.

Prefer:

```tsx
const temp = new THREE.Vector3();

useFrame(() => {
  temp.set(...);
});
```

Reuse temporary objects.

Contoh reusable:

```text
Vector2
Vector3
Quaternion
Matrix4
Color
```

---

# 51. Dispose GPU Resources

Three.js tidak dapat otomatis membersihkan semua GPU resources seperti geometry, texture, dan material; ketika resource tidak lagi digunakan, `dispose()` perlu dipanggil.

Raw Three.js:

```ts
geometry.dispose();
material.dispose();
texture.dispose();
```

R3F dapat mengurus banyak lifecycle declarative, tetapi custom/manual resource tetap harus dipahami ownership-nya.

---

# 52. Resource Ownership

Sebelum dispose tanyakan:

```text
Who owns this resource?
```

Jika material digunakan bersama:

```text
Object A
Object B
Object C
```

jangan dispose ketika hanya Object A dihapus.

Shared resource harus memiliki lifecycle yang jelas.

---

# 53. Avoid Memory Leaks During Scene Changes

Untuk annual/cinematic route:

```text
Scene A
↓
Scene B
↓
Scene C
```

cek:

```text
textures released?
geometry released?
material released?
event listeners removed?
GSAP timelines killed?
loaders reused?
references cleared?
```

Gunakan profiler selama development.

---

# 54. Resize Properly

Canvas display size dan drawing buffer adalah dua hal berbeda.

Three.js manual merekomendasikan membiarkan CSS menentukan ukuran canvas dan memperbarui renderer/camera ketika display size berubah.

Dalam R3F sebagian besar resize management sudah ditangani Canvas.

Jangan membuat duplicate manual resize listener tanpa alasan.

---

# 55. DOM Overlay and Canvas

Recommended structure:

```tsx
<section className="relative min-h-svh">
  <div className="absolute inset-0">
    <SceneCanvas />
  </div>

  <div className="relative z-10">
    <HeroContent />
  </div>
</section>
```

Canvas:

```text
visual layer
```

DOM:

```text
content layer
```

Pastikan decorative canvas:

```css
pointer-events: none;
```

jika memang tidak membutuhkan pointer interaction.

---

# 56. Pointer Interaction

Jangan pasang:

```text
raycasting
hover
pointermove
```

ke ratusan object tanpa kebutuhan.

Untuk particle decorative:

```text
pointer-events unnecessary
```

Untuk interactive objects:

```text
limit raycast targets
```

Jangan raycast seluruh scene hanya untuk satu button 3D.

---

# 57. Mouse Parallax

Gunakan subtle.

Example target:

```text
X: -1 → 1
Y: -1 → 1
```

Kemudian:

```ts
targetRotationY = pointer.x * 0.03;
targetRotationX = pointer.y * 0.02;
```

Gunakan damping / interpolation.

Jangan map pointer langsung ke large rotation.

---

# 58. Mobile Has No Hover

Scene tidak boleh membutuhkan:

```text
hover
cursor position
mouse wheel
```

untuk memahami content.

Mobile visual dapat menggunakan:

```text
scroll
tap
automatic ambient motion
```

Desktop pointer interaction hanya enhancement.

---

# 59. Reduced Motion

Jika:

```css
prefers-reduced-motion: reduce
```

kurangi:

```text
camera travel
particle movement
parallax
shader deformation
continuous rotation
```

Content utama harus tetap dapat dipahami tanpa 3D animation kompleks.

---

# 60. 3D Must Never Block Content

Jika WebGL gagal:

```text
website must still work
```

Minimum fallback:

```text
background color
+
DOM typography
+
static visual if needed
```

3D adalah progressive enhancement.

Bukan dependency untuk membaca website.

---

# 61. Do Not Create 3D Text for Main Content

Avoid:

```text
main title rendered as TextGeometry
```

untuk heading utama.

Prefer DOM:

```html
<h1>81</h1>
```

Three.js text gunakan hanya untuk:

```text
decorative spatial text
3D labels
special visual elements
```

---

# 62. Scene Scale Convention

Pilih convention lalu konsisten.

Example:

```text
Main object size:
1–10 units

Camera:
5–15 units away

Near:
0.1

Far:
100
```

Jangan memiliki:

```text
Object A = 0.0001

Object B = 500000
```

dalam scene yang sama tanpa alasan.

---

# 63. Asset Optimization Happens Before Code

Jika GLB berat:

Jangan berharap coding optimization menyelesaikan semuanya.

Periksa asset:

```text
polygon count
unused geometry
hidden objects
duplicate materials
texture resolution
animation tracks
unused bones
```

Optimalkan asset pipeline.

Runtime optimization bukan pengganti asset optimization.

---

# 64. Avoid Excessive Draw Calls

Performance bukan hanya polygon count.

Perhatikan:

```text
draw calls
materials
lights
shadows
post-processing
transparent objects
DPR
```

Untuk repeated visuals gunakan:

```text
instancing
shared materials
shared geometry
texture atlas
```

Texture atlas juga dapat mengurangi kebutuhan banyak material/texture untuk geometry tertentu.

---

# 65. Transparency Carefully

Transparent materials dapat meningkatkan complexity sorting/rendering.

Jangan membuat semua particle:

```text
transparent
depthWrite false
double sided
additive
```

tanpa memahami kebutuhan visual.

Gunakan transparency hanya ketika efek memang membutuhkan.

---

# 66. Avoid `DoubleSide` by Default

Bad:

```tsx
<meshStandardMaterial side={THREE.DoubleSide} />
```

untuk semua object.

Gunakan default front-side rendering bila geometry dibuat dengan orientasi yang benar.

`DoubleSide` gunakan hanya ketika kedua sisi memang harus terlihat.

---

# 67. Helpers Development Only

Gunakan saat development:

```text
AxesHelper
GridHelper
CameraHelper
DirectionalLightHelper
PointLightHelper
```

Tetapi jangan ship helpers ke production scene.

---

# 68. Debug Scene Visually

Ketika object tidak terlihat, cek:

```text
1. Position
2. Scale
3. Camera
4. Near/Far
5. Material
6. Lighting
7. Visibility
8. Clipping
9. Z-order/depth
```

Jangan langsung menambah light atau mengubah random properties.

---

# 69. Performance Debug Order

Jika FPS buruk:

```text
1. Check DPR
↓
2. Disable post processing
↓
3. Disable shadows
↓
4. Reduce particles
↓
5. Check draw calls
↓
6. Reduce textures
↓
7. Simplify geometry
↓
8. Simplify shaders
```

Jangan langsung rewrite seluruh scene.

---

# 70. Development Performance Indicator

Selama development monitor minimal:

```text
FPS
frame time
draw calls
triangles
geometry count
texture count
```

Optimization harus berdasarkan measurement.

Bukan feeling.

---

# 71. Project-Specific Hero Rules

Untuk **Ruang Merdeka — Section 01**:

```text
Canvas
└── HeroScene
    ├── IndonesiaPoints
    ├── AmbientParticles
    ├── CameraRig
    └── MinimalLighting
```

Tidak perlu:

```text
realistic terrain
multiple GLB islands
complex physical ocean
multiple shadow lights
heavy environment
```

Indonesia dapat dibuat sebagai:

```text
point cloud
+
subtle depth
+
red-white color distribution
```

yang jauh lebih sesuai dengan visual direction sekaligus lebih ringan.

---

# 72. Indonesia Particle Strategy

Recommended:

```text
Indonesia coordinates
↓
preprocess once
↓
Float32Array
↓
BufferGeometry
↓
THREE.Points
```

Jangan menghitung ulang bentuk Indonesia setiap frame.

Scroll hanya memengaruhi:

```text
point displacement
opacity
scale
rotation
camera
```

---

# 73. Scroll + Three.js Architecture

Recommended:

```text
Lenis
  │
  ▼
GSAP ScrollTrigger
  │
  ▼
scrollProgressRef
  │
  ▼
useFrame
  │
  ├── camera
  ├── particle
  ├── shader uniforms
  └── scene transitions
```

Jangan:

```text
scroll
→ setState
→ React rerender
→ rebuild Canvas
```

---

# 74. Final Recommended Canvas

```tsx
<Canvas
  dpr={[1, 1.5]}
  camera={{
    position: [0, 0, 8],
    fov: 45,
    near: 0.1,
    far: 100,
  }}
  gl={{
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  }}
>
  <HeroScene />
</Canvas>
```

Keep renderer configuration minimal.

Jangan mengaktifkan features yang tidak digunakan.

---

# 75. Agent MUST

Agent MUST:

```text
Use one main Canvas when practical.
Keep main content outside Canvas.
Reuse geometry and materials.
Use InstancedMesh for repeated meshes.
Use BufferGeometry / Points for large particle systems.
Avoid React state inside useFrame.
Use delta time for time-based animation.
Cap DPR.
Provide mobile quality reduction.
Keep shadows selective.
Optimize texture dimensions.
Prefer GLTF/GLB for web models.
Dispose manually owned GPU resources.
Keep per-frame calculations minimal.
Provide reduced-motion behavior.
Provide non-WebGL content fallback.
```

---

# 76. Agent SHOULD

Agent SHOULD:

```text
Start with a simple scene.
Measure before optimizing.
Use progressive asset loading.
Reuse loaders.
Use compressed assets only when worthwhile.
Use shader effects selectively.
Prefer one key visual per section.
Keep camera movement subtle.
Pause invisible expensive work.
Separate animation progress from React state.
```

---

# 77. Agent MUST AVOID

```text
❌ Thousands of React mesh components
❌ New geometry every frame
❌ New material every frame
❌ setState inside useFrame
❌ Unlimited devicePixelRatio
❌ Multiple heavy Canvas instances
❌ Shadow on every light
❌ Shadow on every object
❌ 4K textures everywhere
❌ Heavy post-processing stack
❌ Complex shaders without visual benefit
❌ Hover-dependent mobile experience
❌ Main content rendered only in WebGL
❌ Loading screen blocking simple DOM content
❌ Unnecessary asset compression complexity
❌ Giant monolithic scene components
❌ Heavy calculations inside useFrame
❌ Repeated object allocations per frame
❌ Ignoring dispose/lifecycle
```

---

# 78. Performance Budget

Starting guideline for this project:

```text
DESKTOP

DPR
≤ 1.5–2

Particles
2k–8k typical

Shadow lights
0–1

Post processing
0–2 lightweight effects

Canvas
1 main canvas
```

```text
MOBILE

DPR
1–1.5

Particles
500–2k typical

Shadow lights
0–1

Post processing
prefer none

Camera motion
reduced

Canvas
1
```

These are starting budgets.

Adjust based on profiling.

---

# 79. Decision Flow

Before adding a 3D feature:

```text
Does this need to be 3D?
│
├─ NO
│  └─ Use DOM/CSS.
│
└─ YES
   │
   ▼
Can existing geometry/material be reused?
│
├─ YES
│  └─ Reuse it.
│
└─ NO
   │
   ▼
Are many identical objects required?
│
├─ YES
│  └─ Instancing / Points.
│
└─ NO
   │
   ▼
Does it need real-time animation?
│
├─ NO
│  └─ Consider render-on-demand.
│
└─ YES
   │
   ▼
Implement the simplest GPU-friendly version.
```

---

# 80. Review Checklist

Before considering a scene complete:

* [ ] Main content remains DOM-based.
* [ ] Only necessary elements are rendered in WebGL.
* [ ] Geometry is reused where possible.
* [ ] Materials are reused where possible.
* [ ] Repeated objects use instancing or Points.
* [ ] No React state updates happen every frame.
* [ ] No unnecessary allocations happen inside `useFrame`.
* [ ] Animation uses `delta` where appropriate.
* [ ] DPR is capped.
* [ ] Mobile complexity is intentionally reduced.
* [ ] Texture dimensions are optimized.
* [ ] GLB assets are optimized.
* [ ] Shadows are selective.
* [ ] Post-processing is limited.
* [ ] Pointer/raycast interaction is limited.
* [ ] Reduced motion works.
* [ ] Scene still communicates correctly if WebGL fails.
* [ ] GPU resources have clear ownership.
* [ ] Removed resources are disposed correctly.
* [ ] Scroll-up animation still works.
* [ ] Scene is tested on mobile.
* [ ] Performance has been measured, not guessed.

---

# Core Philosophy

```text
Simple Geometry
+
Shared Resources
+
Low Draw Calls
+
Controlled Resolution
+
Selective Lighting
+
Purposeful Motion
+
Adaptive Quality
=
Premium 3D Web Experience
```

Final rule:

> **Do not use the GPU simply because it is available. Use it only where 3D creates an experience that DOM and CSS cannot deliver as effectively.**

And for cinematic websites:

> **The best Three.js scene is not the scene with the most objects — it is the scene that creates the strongest visual moment with the least complexity.**
