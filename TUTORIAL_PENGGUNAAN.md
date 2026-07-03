# Tutorial Penggunaan Aplikasi Hotel Management

Selamat datang di panduan penggunaan aplikasi **Hotel Management** (berbasis Odoo). Modul ini dirancang khusus untuk mempermudah operasional reservasi kamar, manajemen fasilitas, dan pencatatan riwayat tamu. Panduan ini disusun untuk staf hotel (Resepsionis/Frontdesk, Manajer Hotel, dan Administrator).

---

## Daftar Isi
1. [Konfigurasi Awal (Master Data)](#1-konfigurasi-awal-master-data)
2. [Manajemen Reservasi (Folio)](#2-manajemen-reservasi-folio)
3. [Menggunakan Frontdesk (Timeline)](#3-menggunakan-frontdesk-timeline)
4. [Laporan & Cetak PDF](#4-laporan--cetak-pdf)

---

## 1. Konfigurasi Awal (Master Data)

Sebelum mulai menerima tamu, Anda wajib mengatur Master Data hotel Anda. Semua pengaturan ini dapat diakses melalui menu **Hotel Management** -> **Configuration**.

### A. Mengatur Tipe Kamar (Room Types)
1. Buka menu **Configuration** -> **Room** -> **Room Types**.
2. Klik tombol **New** (Baru).
3. Masukkan nama kategori kamar (misal: *Standard, Deluxe, VIP*).
4. Klik **Save**.

### B. Mengatur Daftar Kamar (Rooms)
1. Buka menu **Configuration** -> **Room** -> **Rooms**.
2. Klik **New**.
3. Isi informasi kamar:
   - **Name**: Nomor atau Nama kamar (misal: *101, VIP-01*).
   - **Room Category**: Pilih tipe kamar yang dibuat sebelumnya.
   - **Max Adult / Max Child**: Atur kapasitas maksimal tamu dewasa dan anak-anak.
   - **Floor No**: Pilih lokasi lantai (jika ada).
4. Klik **Save**.

### C. Mengatur Fasilitas & Layanan (Amenities & Services)
Anda dapat mendaftarkan fasilitas kamar tambahan (seperti *Extra Bed*, Sarapan, dsb) di bawah menu **Configuration** -> **Amenity** atau **Services**.

---

## 2. Manajemen Reservasi (Folio)

Setiap tamu yang menginap, pesanan dan tagihannya dicatat dalam dokumen bernama **Folio**.

### Membuat Folio (Pesanan) Baru
1. Buka menu utama **Hotel Management** -> **Folio** -> **Generate Folio**.
2. Klik tombol **New**.
3. Di bagian **Guest**, pilih nama tamu (atau ketik nama tamu baru lalu tekan Enter untuk membuat data kontak baru).
4. (Opsional) Sesuaikan opsi *Invoice* atau *Policy* sesuai kebijakan pembayaran.
5. Di tab **Room Lines** bagian bawah, klik **Add a line**.
6. Pilih **Kamar** yang akan disewa.
7. Sesuaikan tanggal **Check In** dan **Check Out** tamu.
8. Klik **Save**.

Status folio awalnya adalah **Draft** (Reservasi). Jika pesanan sudah disetujui atau tamu melakukan Check-in, Anda bisa mengubah status pesanan hingga menjadi **Done** (Selesai).

---

## 3. Menggunakan Frontdesk (Timeline)

Menu **Frontdesk** adalah pusat kendali interaktif (Papan Visual) untuk para resepsionis. Menu ini menampilkan kalender *timeline* kamar yang terisi dan kosong secara visual.

### Cara Membaca Papan Frontdesk
1. Buka menu **Hotel Management** -> **Frontdesk**.
2. Anda akan melihat tabel yang berisi:
   - **Sumbu Kiri (Y)**: Menampilkan Tipe Kamar (Warna Tua) dan Nama Kamar spesifik di bawahnya.
   - **Sumbu Atas (X)**: Menampilkan Tanggal.
3. Kotak-kotak berwarna yang muncul di dalam kalender merupakan reservasi tamu (Folio).
   - Arahkan kursor (*Hover*) ke atas kotak untuk melihat detail ringkas tamu, waktu Check-in, dan Check-out.

### Mengubah Jadwal / Pindah Kamar (Flexible Edit)
1. Di layar Frontdesk, klik salah satu kotak warna reservasi tamu.
2. Sebuah *Pop-up* (**Change Reservation**) akan muncul.
3. Pada jendela popup tersebut, kolom kiri menampilkan detail asli (*Old Details*).
4. Pada kolom kanan (*New Details*), Anda bisa mengubah **Kamar Baru**, **Tanggal Check-In Baru**, atau **Tanggal Check-Out Baru**.
5. Klik **Save Changes**. Jadwal tamu akan otomatis berpindah secara presisi!

### Navigasi Waktu
Di bagian atas layar Frontdesk, Anda bisa menggunakan tombol:
- **Today**, **Kiri (<)**, dan **Kanan (>)** untuk menggeser kalender ke minggu/bulan lalu dan berikutnya.
- Tombol **Week** (Pekan) dan **Month** (Bulan) untuk mengatur rentang pandangan kalender yang lebih luas.

---

## 4. Laporan & Cetak PDF

Bila Anda membutuhkan laporan transaksi untuk manajemen:
1. Akses menu **Hotel Management** -> **Pdf Reports** -> **Hotel Folio Report**.
2. Masukkan filter tanggal Check-in dan Check-out yang Anda inginkan (jika tersedia opsi filter).
3. Klik tombol cetak (Print). Dokumen PDF akan terunduh dan merangkum seluruh catatan menginap (Folio) beserta rincian biaya yang terjadi.

---

