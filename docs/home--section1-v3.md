Tolong **improve Section 01 / Hero homepage `/` Hari Kita** berdasarkan implementasi yang sudah ada sekarang.

**Penting:**

* **Jangan redesign total dari nol.**
* Pertahankan fondasi layout, tone, dan arah visual yang sekarang karena sudah bagus.
* **Karakter biru / karakter Codex biarkan saja**, jangan dihapus.
* Fokus pekerjaan ini adalah **refinement, hierarchy, realism, continuity, dan responsive redesign**.
* Hasil akhir harus terasa **lebih hidup, lebih rapi, lebih premium, lebih nyatu, dan lebih memorable**.

---

# Tujuan Revisi

Section 01 harus terasa seperti:

**interactive physical storytelling canvas**
bukan hero website biasa.

Vibes utama:

**warm editorial × tactile 3D × cultural storytelling × playful but premium**

Saat user membuka halaman, mereka harus merasa melihat sebuah **scene fisik yang hidup**: ada tali, kartu, foto, simbol perayaan, tape, shadow, dan benang visual yang terasa nyata.

---

# Yang Harus Dipertahankan

Pertahankan elemen-elemen berikut sebagai fondasi:

* background warm ivory / paper tone,
* headline besar:
  **Setiap hari**
  **punya cerita.**
* navigation di bagian atas,
* konsep tali / hanging objects,
* konsep physical card / polaroid / kalender,
* konsep teaser card `Kemerdekaan` di kanan bawah,
* karakter Codex tetap ada sebagai elemen khas.

Namun semuanya perlu **dirapikan dan dinaikkan kualitasnya**.

---

# Revisi Utama yang Wajib Diterapkan

## 1. Kurangi simbol acak, ganti menjadi 4 simbol hari besar yang jelas dan cantik

Jangan terlalu banyak simbol random.

Gunakan **hanya 4 simbol utama** yang benar-benar mewakili momen besar dan terasa penting secara visual.

### Gunakan 4 keluarga simbol berikut:

#### A. Natal

Tambahkan nuansa Natal yang cantik dan elegan:

* pohon natal kecil di area bawah section,
* beberapa kado kecil di dekatnya,
* salju halus turun sangat pelan di area tertentu,
* ornamen bintang atau lonceng kecil,
* bila cocok, bisa ada **Santa Claus kecil** melintas dari atas ke bawah secara subtle / whimsical, **bukan kartun norak**.

#### B. Lunar / Imlek

Gunakan nuansa lunar yang premium:

* lampion merah,
* bulan / elemen lunar,
* **naga terbang** kecil atau siluet naga melintas dengan gerakan elegan,
* jangan berlebihan, tetap halus dan artistik.

#### C. Lebaran

Gunakan simbol:

* ketupat,
* ornamen islami kecil,
* bulan sabit atau bintang,
* tetap clean dan menyatu dengan komposisi.

#### D. Kue Bulan / Mid-Autumn / festival budaya

Gunakan:

* mooncake / kue bulan,
* bentuk bulan,
* elemen floral atau pattern halus,
* jangan terlalu literal.

### Catatan:

* Semua simbol harus terasa **satu dunia**.
* Jangan seperti tempelan clipart.
* Pakai gaya visual yang sama: premium, tactile, sedikit 3D / paper object.
* Sebagian objek boleh setengah keluar dari frame agar terasa seperti scene nyata.

---

## 2. Tingkatkan realism benda fisik

Naikkan kualitas realism dari:

* tali,
* penjepit kayu,
* card,
* tape,
* kalender,
* polaroid,
* object gantung.

### Wajib:

* tali melengkung alami karena beban benda,
* card punya thickness tipis,
* shadow tiap benda berbeda sesuai jarak dari background,
* tape agak translusen dan realistis,
* benda yang lebih dekat ke viewer memiliki shadow sedikit lebih dalam,
* beberapa benda punya sedikit imperfect rotation,
* foreground object boleh punya blur sangat halus saat depth dibutuhkan,
* animasi gantung menggunakan spring/physics lembut.

Hero harus terasa seperti **objek nyata di atas canvas**, bukan elemen 2D biasa.

---

## 3. Rapikan hierarchy CTA

Sekarang CTA harus diposisikan ulang.

### Perbaikan:

* CTA `Jelajahi Hari Kita` harus dipindahkan **lebih dekat ke subtitle / body copy kiri**.
* Buat hierarchy yang jelas:

**Headline → description → CTA**

Jangan biarkan CTA terasa nyasar di tengah area kosong.

### Gaya CTA:

* editorial text-link,
* underline tipis atau garis reaktif,
* hover elegan,
* arrow kecil atau motion cue halus,
* bukan tombol rounded biasa.

---

## 4. Perbaiki teaser card Kemerdekaan

Card `Kemerdekaan` di kanan bawah tetap dipertahankan, tetapi:

* sedikit kecilkan,
* jangan terlalu cepat menjadi fokus kedua,
* biarkan sebagian card sedikit keluar dari viewport jika perlu,
* buat card ini terasa seperti teaser yang sengaja “disimpan” untuk kejutan scroll berikutnya.

### Scroll behavior:

Saat user mulai scroll:

* card ini perlahan menjadi lebih aktif,
* membesar sedikit,
* bergerak masuk ke experience berikutnya,
* menjadi penghubung alami ke Section 02.

Jadi card ini bukan sekadar dekorasi, tetapi **bibit transition**.

---

## 5. Background line harus punya makna

Garis-garis background sekarang jangan hanya dekorasi.

Harus ada **1 garis / 1 benang utama** yang menjadi perjalanan visual.

### Fungsi benang utama:

* mulai dari area logo atau dekat hero,
* mengitari headline,
* berubah menjadi tali,
* menghubungkan objek-objek gantung,
* mengarah ke teaser card,
* lalu melanjutkan ke Section 02.

Jadi ada rasa bahwa seluruh hero disatukan oleh **satu jalur cerita**.

Gunakan:

* thin line,
* kurva halus,
* nodes kecil jika perlu,
* animation drawing yang sangat subtle.

---

## 6. Typography tuning

Pertahankan headline utama, tetapi rapikan scale:

* `Setiap hari` tetap sangat kuat.
* `punya cerita.` boleh sedikit lebih lembut / sedikit lebih kecil agar tidak sama-sama terlalu dominan.
* body text perlu sedikit lebih gelap agar readability lebih baik.
* nav tetap clean dan ringan.

Jika ada serif display, pastikan tetap elegan dan tidak terlalu berat.

---

# Komposisi Desktop yang Diharapkan

Untuk desktop, hero harus terasa kaya tetapi tetap breathable.

### Komposisi utama:

* kiri: headline, body, CTA
* atas: tali utama dengan benda gantung
* kanan / kanan bawah: teaser card dan beberapa object perayaan
* bawah kiri / bawah tengah: simbol besar tertentu sebagai anchor visual
* Codex tetap ada sebagai elemen khas, tetapi posisikan agar tidak merusak hierarchy utama

### Nuansa:

* ada movement,
* ada benda fisik,
* ada depth,
* ada surprise,
* tapi tetap rapi dan premium.

---

# Motion Direction Desktop

Gunakan motion yang cerdas, bukan ramai.

### Saat load:

1. Background fade in.
2. Line path ter-draw pelan.
3. Logo dan nav masuk lembut.
4. Headline reveal per-line.
5. Tali turun / settle.
6. Hanging objects muncul dengan physics lembut.
7. Snow halus atau ornamen kecil mulai hidup.
8. Teaser card `Kemerdekaan` muncul terakhir.

### Interaksi:

* mouse movement memberi parallax spatial depth,
* hanging objects sway halus,
* snow turun pelan di area natal,
* naga lunar atau santa hanya muncul sebagai subtle delightful motion,
* card dan tape punya micro response.

---

# Mobile View — Buat Konsep Baru

**Penting:** untuk mobile, jangan hanya menumpuk versi desktop.

Masalah saat ini: halaman terasa kosong.

Maka buat **konsep mobile yang baru**, lebih padat, lebih intimate, dan lebih hidup.

## Tujuan mobile:

* lebih penuh,
* lebih immersive,
* tidak ada ruang kosong besar yang mati,
* tetap ringan dan rapi,
* semua elemen penting tetap terbaca.

## Arah layout mobile:

* gunakan komposisi **stacked layered collage**,
* heading tetap dominan di atas,
* body text dan CTA langsung dekat headline,
* area visual perayaan ditempatkan lebih dekat ke hero text,
* hanging objects dibuat lebih sedikit tetapi lebih dekat ke layar,
* teaser `Kemerdekaan` diletakkan lebih cepat masuk ke viewport,
* gunakan vertical storytelling, bukan layout melebar kosong.

## Konsep mobile yang disarankan:

### Mobile hero structure:

1. Top bar lebih ringkas.
2. Headline besar memenuhi area atas.
3. Body + CTA langsung di bawah headline.
4. Di bawahnya ada **cluster visual**:

   * tali pendek,
   * 2–3 hanging objects,
   * card kecil / polaroid,
   * satu object seasonal besar,
   * teaser `Kemerdekaan`.
5. Tambahkan 1 jalur line/benang yang turun vertikal-diagonal agar layar terasa terisi dan mengarahkan scroll.

### Mobile festive composition:

* natal cluster di bagian bawah atau sisi,
* lampion / lunar object di atas atau samping,
* ketupat bisa menjadi anchor kecil dekat bawah,
* mooncake / bulan bisa jadi accent dekat CTA atau cluster visual,
* Codex bisa jadi companion kecil di area sisi bawah/tengah.

### Mobile motion:

* parallax lebih ringan,
* no overly complex physics,
* focus on clarity,
* teaser card lebih cepat engage saat scroll,
* salju natal boleh tetap ada tapi halus.

## Mobile feel:

**compact, rich, tactile, intentional.**

Bukan long empty hero.

---

# Tablet View — Konsep Khusus

Tablet tidak boleh sekadar versi tengah antara desktop dan mobile.

Buat komposisi yang lebih editorial.

## Tablet layout:

* headline masih besar tetapi tidak selebar desktop,
* visual objects mengelilingi headline,
* teaser card lebih jelas terlihat,
* tali utama tetap horizontal tetapi lebih pendek,
* cluster simbol lebih terorganisir,
* whitespace tetap ada tetapi tidak terlalu kosong.

### Tablet bisa memakai:

* 2 zona utama:

  * teks di kiri atas,
  * scene visual di kanan / bawah,
* atau semi-split layout yang lebih rapat daripada desktop.

---

# Responsive Rules

## Desktop

* cinematic spacious
* broad composition
* banyak depth dan layer

## Tablet

* editorial compact
* lebih rapat
* fokus tetap seimbang antara teks dan visual

## Mobile

* stacked tactile collage
* no dead space
* CTA cepat ditemukan
* visual cluster lebih intim

Semua breakpoint harus terasa **satu desain yang dirancang**, bukan adaptasi seadanya.

---

# Technical Direction

Boleh gunakan:

* GSAP + ScrollTrigger
* Lenis
* Framer Motion / Motion
* CSS 3D transforms
* SVG path animation
* spring physics ringan untuk objek gantung
* responsive repositioning per breakpoint
* reduced motion fallback

Utamakan:

* smoothness
* responsiveness
* clarity
* performance

---

# Hal yang Harus Dihindari

Jangan:

* menambah terlalu banyak simbol lagi,
* membuat semua benda saling berebut fokus,
* menjadikan Christmas / Lunar / Lebaran terlalu literal atau terlalu penuh,
* membuat scene jadi seperti toko dekorasi,
* membuat mobile hanya jadi desktop yang diperkecil,
* membiarkan CTA terpisah dari body text,
* membiarkan garis hanya jadi dekorasi tanpa fungsi.

---

# Hasil Akhir yang Diinginkan

Section 01 harus terasa:

* lebih hidup,
* lebih cantik,
* lebih tactile,
* lebih rapi,
* lebih punya “benang cerita”,
* lebih responsif di semua device,
* dan lebih kuat sebagai pembuka **Hari Kita**.

User harus merasa:

> ini bukan hero biasa.
> ini seperti ruang kenangan/perayaan yang hidup, dan setiap benda di dalamnya punya cerita.

Silakan refine implementasi sekarang dengan arah ini, bukan menggantinya total.
