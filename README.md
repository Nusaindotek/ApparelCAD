# ApparelCAD
# ApparelCAD 🏭

**Versi:** 1.0.0 (MVP)  
**Fokus Utama:** Sistem *Drafting* & *Grading* Pola Garmen Otomatis untuk Produksi Massal.

---

## 📜 Core Manifesto (Batasan Proyek)

ApparelCAD dibangun dengan satu filosofi utama: **Kecepatan dan Skalabilitas Industri**. 
Perangkat lunak ini BUKAN untuk penjahit *haute couture*, desainer busana kustom (*bespoke*), atau pembuatan pakaian dengan kerumitan tinggi. Jika sebuah fitur tidak melayani kebutuhan produksi massal pabrik garmen atau konveksi (UMKM), maka fitur tersebut **TIDAK AKAN** dimasukkan.

### Aturan Emas Pengembangan (TIDAK BOLEH DILANGGAR):
1. **Tidak Ada Overengineering:** Jaga matematika tetap sederhana. Gunakan titik ukur (*Key Points of Measure*) seminimal mungkin yang sudah menjadi standar industri *flat-measurement*.
2. **Fokus pada "The Big Four":** Mesin ini secara eksklusif dikembangkan untuk 4 produk dengan volume produksi tertinggi:
   - ✅ Kaos Oblong (Basic T-Shirt) -> *Target MVP V1.0*
   - ⏳ Polo Shirt
   - ⏳ Hoodie / Sweater
   - ⏳ Kemeja Dasar (Basic Shirt)
3. **Standar Ekspor Mesin:** File harus bisa diekspor ke PDF (untuk cetak manual/UMKM) dan **DXF/AAMA** (untuk mesin *plotter/cutter* pabrik).
4. **Grading Otomatis adalah Raja:** Fitur utama bukanlah menggambar satu pola, melainkan keandalan sistem dalam membesarkan/mengecilkan pola (S, M, L, XL) secara otomatis dan presisi.

---

## 🎯 Target Pasar
* **Primary (B2B):** Pabrik Garmen, Konveksi Massal, Vendor *Merchandise* & Seragam.
* **Secondary (B2C/Marketing):** Penjahit rumahan, UMKM fesyen, dan penghobi (menggunakan versi antarmuka yang sangat disederhanakan).

---

## 🛠 Ruang Lingkup MVP (Minimum Viable Product) - V1.0
Untuk merilis versi pertama, kita HANYA akan menyelesaikan batasan berikut:
- **Produk:** Kaos Oblong (T-Shirt) Lengan Pendek.
- **Kepingan Pola:** Badan Depan, Badan Belakang, Lengan, Rib Leher.
- **Tabel Ukuran:** Standar S, M, L, XL (Patokan dasar: M).
- **Parameter Ukuran:** Panjang Baju, Lebar Dada, Lebar Bahu, Panjang Lengan, Lebar Leher, Kerung Lengan.
- **Output:** Geometri pola dasar dengan tambahan *Seam Allowance* (Kampuh).

---

> *"Lebih baik memiliki satu mesin sederhana yang menghasilkan jutaan kaos dengan sempurna, daripada mesin rumit yang gagal membuat satu gaun malam."*
