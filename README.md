# Media Editor

**Media Editor** adalah aplikasi berbasis web untuk memproses berbagai jenis media. Aplikasi ini memungkinkan pengguna untuk:

- **Mengubah format gambar** menjadi PNG.
- **Mengonversi gambar PNG ke teks** menggunakan teknologi OCR (Optical Character Recognition).
- **Memotong video** dengan memilih waktu mulai dan selesai.

## Fitur

### 1. **Image Processing** (Ubah Gambar Menjadi PNG)
   - Aplikasi ini memungkinkan pengguna untuk mengunggah gambar dalam format apapun (JPG, JPEG, GIF, BMP, dll) dan mengonversinya ke format PNG.

### 2. **PNG to Text (OCR)**
   - Setelah gambar diubah menjadi PNG, aplikasi ini dapat menggunakan OCR untuk mengekstrak teks dari gambar PNG.

### 2. **Video Cutting**
   - Pengguna dapat mengunggah file video dan memilih bagian tertentu dari video untuk dipotong berdasarkan waktu mulai dan waktu selesai.

## Teknologi yang Digunakan

- **Next.js**: Framework React untuk aplikasi server-side rendering dan statis.
- **Tesseract.js**: Library JavaScript untuk melakukan OCR (Optical Character Recognition) pada gambar.
- **FFmpeg**: Perangkat lunak untuk memproses video, digunakan untuk memotong video.

## Instalasi

### Prasyarat

- **Node.js** (versi 16 atau lebih baru)
- **npm** atau **yarn** untuk manajemen paket
- **FFmpeg** (untuk pemrosesan video)

### Langkah-langkah Instalasi

1. **Clone repositori ini ke komputer Anda**:

   ```bash
   git clone https://github.com/username/media-editor.git
   cd media-editor
