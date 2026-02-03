# 🎮 MaRi Gaming Store - Bot WhatsApp (SYNC-2026)

> **"MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki"**

Bot WhatsApp otomatis berbasis **Node.js** untuk manajemen joki **Mobile Legends** dan **Arknights: Endfield**. Dibuat khusus untuk memberikan pelayanan cepat dan elit kepada para **Chief** (Buyer).

---

## 🚀 Fitur Utama
* **Automated Menu:** Navigasi layanan joki via chat.
* **Price List Update:** Daftar harga joki MLBB per-tier & Endfield mulai 5rb.
* **Admin Notification:** Bot otomatis kirim notif ke nomor pribadi Owner setiap ada pesanan masuk atau permintaan chat manual.
* **Testimonial Trigger:** Fitur `tagih testi` untuk menjaga reputasi store.
* **24/7 Online:** Siap dideploy di Koyeb menggunakan Docker.

---

## 🛠️ Tech Stack
* **Language:** JavaScript (Node.js)
* **Library:** [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
* **Server:** [Koyeb](https://www.koyeb.com/)
* **Container:** Docker

---

## 📁 Struktur File
* `index.js`: Otak dan logika bot.
* `package.json`: Daftar dependencies library Node.js.
* `Dockerfile`: Instruksi build untuk server Koyeb.
* `README.md`: Dokumentasi (file ini).

---

## ⚙️ Cara Deploy ke Koyeb
1.  **Fork/Upload** repository ini ke GitHub lu.
2.  Buka [Koyeb Dashboard](https://app.koyeb.com/) dan buat **New Service**.
3.  Pilih repository ini dan gunakan **Build Strategy: Docker**.
4.  Setelah status **Healthy**, buka **Runtime Logs** untuk scan QR Code login WhatsApp.

---

## 📞 Kontak Admin
Jika ada kendala sistem, silakan hubungi:
* **Owner:** Ridwan (MaRi Store)
* **WhatsApp Alert:** 0851-5690-6427

---
*© 2026 MaRi Gaming Store. All Rights Reserved.*
