const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');

// KONFIGURASI NOMOR ELIT RIDWAN
const MY_NUMBER = '6285156906427@c.us'; 

const app = express();
app.use(bodyParser.json());

// DASHBOARD HEMAT RAM
app.get('/', (req, res) => {
    res.send('<h1>MaRi Store Fast Mode Active</h1>');
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

// LOGIKA CHAT (REVISI MENU NO 4)
client.on('message', async (msg) => {
    const body = msg.body.toLowerCase();
    
    if (msg.from.includes('@g.us')) return;

    if (body === 'p' || body === 'menu' || body === 'halo' || body === 'start') {
        await msg.reply(`*MaRi Gaming Store, MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki* ☕🎮

Pilih menu (Ketik Angkanya):
1️⃣. List Joki MLBB
2️⃣. List Joki Arknights: Endfield (Detail)
3️⃣. Format Order Manual
4️⃣. Hubungi Admin`);
    }

    // --- HARGA MLBB ---
    else if (body === '1') {
        await msg.reply(`🎮 *LIST JOKI MLBB ELIT (PER BINTANG)*
• Master: 3k | Grandmaster: 4k | Epic: 5k
• Legend: 8k | Mythic (0-25): 12k
• Mythic Honor (25-50): 15k
• Mythic Glory (50-100): 22k
• Mythic Immortal (100+): 35k++

Ketik *3* buat format order!`);
    }

    // --- HARGA ENDFIELD (DESKRIPSI DETAIL WAJIB) ---
    else if (body === '2') {
        await msg.reply(`🏗️ *JOKI ARKNIGHTS: ENDFIELD (BASE & PROGRESS)*

🟢 *Tier 1 (Rafinasi)*: 10k /Pabrik (Pkt 5: 40k)
_D: Setting 1 jenis produksi awal. Bukan 1 base utuh!_

🟡 *Tier 2 (Conveyor)*: 15k /Jalur (Pkt 5: 60k)
_D: Jalur otomatis sederhana per jenis material._

🟠 *Tier 3 (Optimization)*: 45k
_D: Re-layout total jalur produksi yang berantakan._

🔴 *Tier 4 (Professional)*: 85k
_D: Logistik skala menengah, integrasi 2-3 area._

⭐ *Tier End (God Tier)*: 175k
_D: 6 Jalur Logistik Maksimal. Efisiensi 100%._

*-- STORY & FARMING --*
• Per Ch: 20k | Paket Ch 1-3: 55k
• Full Map Exploration: 125k
• Daily Farm (7 Hari): 75k
• Monthly VIP (30 Hari): 300k

Ketik *3* buat format order!`);
    }

    // --- FORMAT ORDER ---
    else if (body === '3') {
        await msg.reply(`📝 *FORMAT ORDER MaRI STORE*
        
Game:
Layanan/Tier:
Login Via:
Email/ID:
Pass:
Metode Pembayaran: (Dana / Gopay / QRIS)`);
    }

    // --- HUBUNGI ADMIN (MENU NO 4 REVISI) ---
    else if (body === '4') {
        await client.sendMessage(MY_NUMBER, `🚨 *CHIEF RIDWAN!* Ada buyer butuh admin.\nNomor: ${msg.from}`);
        await msg.reply('Siapp Chief! Admin Ridwan udah dikasih tau, tunggu bentar ya.');
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server melek di port ${PORT}`));

client.initialize();
