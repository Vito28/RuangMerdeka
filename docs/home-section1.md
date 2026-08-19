Buat **Section 01 / Hero Opening** untuk homepage `/` website **Hari Kita**.

## Konsep Utama

Hero harus terasa seperti **sebuah meja/ruang cerita fisik yang hidup**, bukan landing page website biasa.

Visual direction:

**Bright Editorial × Tactile 3D × Modern Comic × Cultural Storytelling**

Background menggunakan warna **warm ivory / paper white** dengan tekstur kertas sangat halus. Jangan gunakan background flat polos.

Di atas background terdapat:

* garis tipis seperti sketsa/editorial line yang bergerak sangat pelan,
* beberapa garis membentuk jalur cerita,
* subtle paper grain,
* soft light/shadow,
* depth/parallax kecil mengikuti mouse.

Semua harus terasa premium, bersih, modern, dan tidak childish.

---

## Hero Composition

Hero minimal `100vh`.

### Navigation

Top navigation sangat minimal.

Kiri:

* logo icon **Hari Kita**
* teks `Hari Kita`

Kanan:

* `Cerita`
* `Kalender`
* `Arsip`
* `Tentang`

Typography navigation menggunakan sans-serif clean.

Navigation jangan berbentuk navbar SaaS biasa.

Biarkan seperti elemen editorial yang menyatu dengan canvas.

---

## Main Typography

Di tengah-kiri tampilkan headline besar:

**Setiap hari
punya cerita.**

Gunakan serif display elegan yang sejalan dengan identitas logo Hari Kita.

Ukuran sangat besar tetapi tetap punya banyak whitespace.

Di bawahnya:

> Perayaan, budaya, dan momen yang kita bagi bersama.

Kemudian CTA kecil:

`JELAJAHI HARI KITA  ↓`

CTA jangan berupa button rounded biasa.

Buat seperti text-link editorial dengan garis tipis yang bereaksi ketika hover.

---

# Hero Harus Terasa Seperti Physical Scene

Sekeliling headline terdapat beberapa benda visual seperti benar-benar berada di ruang nyata.

Jangan susun seperti card grid.

Buat benda-benda tampak **random tetapi art-directed**.

Contoh:

### Polaroid / Story Card

Sebuah foto/card kecil bertuliskan:

`17 · 08 · 2026`

dengan sedikit potongan visual merah-putih.

Card terlihat seperti ditempel menggunakan masking tape.

Card sedikit miring sekitar `-5deg`.

Ada realistic paper shadow.

Saat mouse bergerak:

* kartu bergerak sedikit,
* tape tetap terasa menempel,
* memberikan depth 3D.

---

### Hanging Memory

Di bagian kanan atas terdapat **tali tipis nyata** yang melintas sebagian viewport.

Pada tali tergantung 2–3 objek menggunakan penjepit kayu kecil:

* mini lampion merah,
* foto celebration,
* kartu kalender kecil,
* simbol bulan/bintang.

Objek jangan terlalu besar.

Mereka bergoyang sangat halus menggunakan physics/spring motion.

Tali ini nantinya menjadi **visual motif utama Hari Kita** dan dapat berlanjut ke section berikutnya.

---

### Cultural Objects

Tambahkan beberapa object kecil sebagai teaser berbagai cerita:

* lampion,
* bulan sabit,
* ketupat,
* pita merah putih,
* bunga kecil,
* kue bulan,
* star ornament.

Tetapi gunakan **stylized premium 3D/paper-cut object**, bukan emoji.

Jangan tampilkan semuanya sekaligus.

Sebagian hanya terlihat setengah dari tepi layar sehingga membuat canvas terasa lebih besar dari viewport.

---

# Comic / Editorial Detail

Masukkan elemen comic-style secara sangat subtle.

Contoh:

sebuah note kecil:

`AUG / 2026`

dengan border tinta tipis.

Di dekat sebuah objek:

`01 — CURRENT STORY`

Ada garis tangan / arrow tipis yang menunjuk ke kartu tertentu.

Boleh terdapat sobekan kertas kecil di sudut layout.

Namun hindari:

* speech bubble kartun,
* warna terlalu cerah,
* outline tebal,
* comic superhero style.

Targetnya adalah:

**modern editorial magazine yang mendapat sentuhan comic composition.**

---

# Signature Motion

Saat halaman pertama terbuka:

1. Background muncul terlebih dahulu.
2. Logo Hari Kita fade + slide sangat kecil.
3. Garis background mulai tergambar seperti `SVG path drawing`.
4. Headline muncul per-line dengan mask reveal.
5. Kartu/polaroid masuk seperti baru saja dilempar ke atas meja.
6. Tape muncul sepersekian detik setelah kartu.
7. Hanging objects turun sedikit dari atas lalu settle menggunakan spring physics.
8. Simbol-simbol kecil muncul dengan stagger lembut.

Total intro sekitar `1.8–2.5 detik`.

Jangan terasa seperti loading animation.

Harus terasa natural.

---

# Mouse Interaction

Desktop:

Gunakan pointer movement untuk membuat sedikit spatial depth.

Layer:

* background line → movement paling kecil
* typography → hampir diam
* paper/card → movement medium
* foreground ornament → movement sedikit lebih besar

Gunakan perspective lembut.

Jangan membuat efek tilt ekstrem.

---

# Scroll Transition ke Section 02

Bagian paling penting:

Saat user mulai scroll keluar dari hero, **jangan sekadar hero bergerak naik**.

Tali yang sebelumnya berada di kanan atas perlahan:

* memanjang,
* bergerak melintasi viewport,
* menjadi visual guide menuju section berikutnya.

Salah satu story card yang tadinya menggantung kemudian perlahan membesar.

Camera seolah bergerak mendekati card tersebut.

Headline Hero mulai tertutup oleh foreground paper layer.

Kemudian masuk ke Section 02.

Transition harus memberi kesan:

**user berjalan masuk lebih dalam ke koleksi Hari Kita.**

---

# Technology / Motion Direction

Boleh gunakan:

* **GSAP + ScrollTrigger** → timeline utama
* **Lenis** → smooth scrolling
* **Motion / Framer Motion** → UI micro-interaction
* **SplitType** → typography reveal
* **Matter.js atau spring physics** → subtle hanging object physics
* **Rive** → animated cultural symbols jika diperlukan
* **Three.js / React Three Fiber** hanya jika diperlukan untuk depth tertentu
* CSS `perspective`, `transform-style: preserve-3d`
* SVG path animation untuk garis perjalanan

Jangan menggunakan WebGL hanya supaya terlihat kompleks.

Utamakan kualitas visual dan performa.

---

# Color Direction

Gunakan base:

`#F5F0E7` — warm ivory
`#1D1C1A` — charcoal
`#C87952` — muted terracotta
`#D1A04E` — warm gold
`#A53F35` — restrained red

Warna cultural object boleh sedikit berbeda, tetapi keseluruhan hero harus tetap harmonis.

---

# Important Design Rules

JANGAN buat:

* SaaS hero
* card grid standar
* glassmorphism
* gradient ungu/biru tech
* rounded rectangle di mana-mana
* floating icons generik
* animation template
* layout simetris sempurna
* website corporate biasa

Hero Hari Kita harus terlihat seperti sebuah **interactive physical composition**.

User harus langsung merasa:

> ini bukan homepage biasa — saya sedang membuka sebuah koleksi cerita.

Tetap jaga whitespace, readability, dan premium visual hierarchy.

## Final Feeling

**Hangat. Ceria. Artistik. Sedikit nostalgic. Tactile. Modern. Hidup.**

Seolah-olah seseorang membuka sebuah meja penuh kenangan, kalender, potongan cerita, foto, dan benda kecil dari berbagai perayaan Indonesia — kemudian benda-benda tersebut mulai hidup ketika user menyentuh dan menggulir halaman.
