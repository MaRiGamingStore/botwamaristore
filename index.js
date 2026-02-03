const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// KONFIGURASI NOMOR ELIT RIDWAN
const MY_NUMBER = '6285156906427@c.us'; 

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- 1. BOOSTER: KEEP ALIVE & DASHBOARD ---
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#0a0a0a;color:#00ff00;text-align:center;padding:50px;font-family:sans-serif;">
            <div style="border:2px solid #00ff00;display:inline-block;padding:20px;border-radius:15px;">
                <h1>MaRi Gaming Store 🎮</h1>
                <p>"MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki"</p>
                <p>STATUS: <span style="color:#fff">FAST RESPONSE ACTIVE</span></p>
            </div>
        </body>
    `);
});

// Pemanasan Mesin tiap 5 menit biar gak lelet
setInterval(() => {
    console.log("MaRI Booster: Jaga mesin tetep panas biar fast response...");
}, 300000);

// --- 2. SETTING MESIN BOT (EXTRA BOOSTER RAM) ---
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
            '--disable-software-rasterizer',
            '--js-flags="--max-old-space-size=450"' // Alokasi RAM biar gak lemot
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
    }
});

client.on('qr', (qr) => {
    console.log('CHIEF RIDWAN, SCAN QR INI SECEPATNYA:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ MaRI Gaming Store Bot SIAP TERIMA ORDERAN ELIT!');
});

// --- 3. LOGIKA BOT INTERAKTIF (HARGA JANGAN DIUBAH) ---
client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const body = msg.body.toLowerCase();

    // Auto-read biar buyer seneng dapet centang biru cepet
    await chat.sendSeen();

    // Menu Utama + Slogan Sakti
    if (body === 'p' || body === 'menu' || body === 'halo' || body === 'start') {
        await msg.reply(`*MaRi Gaming Store, MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki* ☕🎮

Selamat datang Chief! Pilih menu buat cek layanan elit kami:
1️⃣. List Joki MLBB (Anti Lose Streak)
2️⃣. List Joki Arknights: Endfield (Deskripsi Detail)
3️⃣. Format Order Manual (Pembayaran)
4️⃣. Hubungi Admin);
    }

    // --- HARGA MLBB (TETAP SAMA) ---
    else if (body === '1') {
        await msg.reply(`🎮 *LIST JOKI MLBB ELIT (PER BINTANG)*
        
• Master: 3k | Grandmaster: 4k | Epic: 5k
• Legend: 8k | Mythic (0-25): 12k
• Mythic Honor (25-50): 15k
• Mythic Glory (50-100): 22k
• Mythic Immortal (100+): 35k++

Ketik *3* buat dapet format ordernya, Chief!`);
    }

    // --- HARGA ENDFIELD (DESKRIPSI DETAIL TETAP) ---
    else if (body === '2') {
        await msg.reply(`🏗️ *JOKI ARKNIGHTS: ENDFIELD (BASE & PROGRESS)*
⚠️ _WAJIB BACA DESKRIPSI BIAR GAK SALAH PAHAM!_

*-- BASE SETUP (LOGISTIK) --*
🟢 *Tier 1 (Rafinasi)*: 10k /Pabrik (Pkt 5: 40k)
_D: Setting 1 jenis produksi awal. Bukan 1 base utuh!_

🟡 *Tier 2 (Conveyor)*: 15k /Jalur (Pkt 5: 60k)
_D: Jalur otomatis sederhana per jenis material dasar._

🟠 *Tier 3 (Optimization)*: 45k
_D: Re-layout total jalur produksi yang berantakan/stuck._

🔴 *Tier 4 (Professional)*: 85k
_D: Pemasangan jalur logistik otomatis skala menengah._

⭐ *Tier End (God Tier)*: 175k
_D: Setting 6 Jalur Logistik Vertikal/Horizontal maksimal. Efisiensi 100%._

*-- STORY & FARMING --*
• Per Chapter (Story): 20k | Paket Story (Ch 1-3): 55k
• Full Exploration Map: 125k | Resource Farm: 20k
• Daily Farm (7 Hari): 75k | Monthly VIP (30 Hari): 300k

*-- PAKET SULTAN --*
• Akun Elit (End-Game): 750k | The Hub Map: 1.250k

Ketik *3* buat format order & payment!`);
    }

    // --- FORMAT ORDER ---
    else if (body === '3') {
        await msg.reply(`📝 *FORMAT ORDER JOKI MaRI STORE*
        
Game:
Layanan/Tier:
Login Via:
Email/ID:
Pass:
Metode Pembayaran: (Dana / Gopay / QRIS)

*Kirim format ini dan tunggu Admin konfirmasi ya!*
_MaRi Beresin Tanpa Keki!_`);
    }

    // --- ADMIN ---
    else if (body === '4' || body === 'admin') {
        await msg.reply('Siapp Chief! Admin Ridwan udah dikasih tau, tunggu bentar ya.');
        await client.sendMessage(MY_NUMBER, `🚨 *CHIEF!* Ada buyer butuh bantuan.\nNomor: ${msg.from}`);
    }
});

// --- 4. ENDPOINT API (INVOICE) ---
app.post('/api/order', async (req, res) => {
    const d = req.body;
    let msg = `🔔 *ORDERAN BARU (INVOICE)*\n\n📌 TRK: ${d.trkId}\n🎮 Game: ${d.game}\n💰 Total: Rp ${d.price.toLocaleString()}\n🔑 Akun: ${d.id} / ${d.pass}\n*MaRI Beresin Tanpa Keki!*`;
    try {
        await client.sendMessage(MY_NUMBER, msg);
        res.status(200).send({ status: 'SUCCESS' });
    } catch (err) {
        res.status(500).send({ status: 'FAILED' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));

client.initialize();
