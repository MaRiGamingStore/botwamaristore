const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// KONFIGURASI NOMOR ELIT RIDWAN
const MY_NUMBER = '6285156906427@c.us'; 
const app = express();

// Database sementara buat simpen tahap chat buyer
const userState = {};

app.get('/', (req, res) => {
    res.send('<h1>MaRI Store Bot Engine: ACTIVE</h1>');
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-zygote',
            '--disable-gpu',
            '--single-process'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
    }
});

client.on('qr', (qr) => {
    console.log('SCAN QR NYA CHIEF:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ MaRI Gaming Store Bot ONLINE!');
});

client.on('message', async (msg) => {
    const from = msg.from;
    const body = msg.body.trim();
    const bodyLow = body.toLowerCase();

    if (from.includes('@g.us')) return;

    // --- FITUR CANCEL / BATAL ---
    if (bodyLow === 'cancel' || bodyLow === 'batal') {
        delete userState[from];
        return await msg.reply('❌ *Pesanan dibatalkan.*\nKetik *Menu* untuk kembali ke layanan elit kami.');
    }

    // --- MENU UTAMA ---
    if (bodyLow === 'p' || bodyLow === 'menu' || bodyLow === 'halo' || bodyLow === 'start') {
        userState[from] = { step: 'main_menu' };
        return await msg.reply(`*MaRi Gaming Store, MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki* ☕🎮\n\nPilih layanan (Ketik Angkanya):\n1️⃣. List Joki MLBB\n2️⃣. List Joki Arknights: Endfield (Detail)\n3️⃣. Hubungi Admin\n\n_Ketik *Cancel* kapan saja untuk membatalkan._`);
    }

    const state = userState[from]?.step;

    // --- STEP 1: PILIH GAME ---
    if (state === 'main_menu') {
        if (body === '1') {
            userState[from] = { step: 'select_tier', game: 'MLBB' };
            await msg.reply(`🎮 *LIST JOKI MLBB ELIT (PER BINTANG)*\n\n1. Master: 3k\n2. Grandmaster: 4k\n3. Epic: 5k\n4. Legend: 8k\n5. Mythic (0-25): 12k\n6. Mythic Honor (15k)\n7. Mythic Glory (22k)\n8. Mythic Immortal (35k++)\n\n*Ketik nomor layanan yang mau lu ambil:*`);
        } 
        else if (body === '2') {
            userState[from] = { step: 'select_tier', game: 'Endfield' };
            await msg.reply(`🏗️ *JOKI ARKNIGHTS: ENDFIELD (DETAIL LENGKAP)*

*-- BASE SETUP (LOGISTIK) --*
1. *Tier 1 (Rafinasi)*: 10k /Pabrik (Pkt 5: 40k)
_D: Setting 1 jenis produksi awal. Bukan 1 base utuh!_

2. *Tier 2 (Conveyor)*: 15k /Jalur (Pkt 5: 60k)
_D: Jalur otomatis sederhana per jenis material dasar._

3. *Tier 3 (Optimization)*: 45k
_D: Re-layout total jalur produksi yang berantakan/stuck._

4. *Tier 4 (Professional)*: 85k
_D: Pemasangan jalur logistik otomatis skala menengah (2-3 area)._

5. *Tier End (God Tier)*: 175k
_D: Setting 6 Jalur Logistik Maksimal. Efisiensi 100%._

*-- STORY & FARMING --*
6. Per Chapter: 20k
7. Paket Story (Ch 1-3): 55k
8. Full Exploration Map: 125k
9. Daily Farm (7 Hari): 75k
10. Monthly VIP (30 Hari): 300k

*Ketik nomor layanan yang mau lu ambil:*`);
        }
        else if (body === '3') {
            delete userState[from];
            await client.sendMessage(MY_NUMBER, `🚨 *CHIEF RIDWAN!* Ada buyer butuh admin.\nNomor: ${from}`);
            await msg.reply('Siapp Chief! Admin Ridwan udah dikasih tau, tunggu ya.');
        }
    }

    // --- STEP 2: PILIH NOMOR -> MUNCUL FORM ---
    else if (state === 'select_tier') {
        userState[from].tier = body; 
        userState[from].step = 'waiting_format';
        
        await msg.reply(`✅ *Pilihan Layanan Nomor [${body}] Berhasil Dicatat!*\n\nSilahkan isi & kirim balik format order ini:\n\n*Game:* ${userState[from].game}\n*Layanan Nomor:* ${body}\n*Login Via:* \n*Email/ID:* \n*Pass:* \n*Metode Pembayaran:* (Dana/Gopay/QRIS)\n\n_Salin format di atas, isi dengan benar, lalu kirim balik ya Chief! Ketik *Cancel* jika ingin batal._`);
    }

    // --- STEP 3: TERIMA FORMAT & LAPOR KE LU ---
    else if (state === 'waiting_format') {
        const report = `🔔 *ORDERAN MASUK CHIEF RIDWAN!*\n\nDARI: ${from}\n\n*FORMAT BUYER:*\n${body}\n\n*MaRI Beresin Tanpa Keki!*`;
        await client.sendMessage(MY_NUMBER, report);

        await msg.reply(`✅ *Format Berhasil Dikirim!*\n\nAdmin Ridwan udah dapet notif pesanan lu. Mohon tunggu bentar buat konfirmasi ya. MaRi Kita Joki, Akun Jadi Elit!`);
        
        delete userState[from]; 
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Bot engine jalan di port ${PORT}`));

client.initialize();
