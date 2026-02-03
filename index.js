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

// --- 1. TAMPILAN WEB TOKO (DASHBOARD ELIT) ---
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MaRi Gaming Store | Dashboard</title>
            <style>
                body { background: #0f0f0f; color: #00ff00; font-family: 'Courier New', monospace; text-align: center; padding: 50px; }
                .container { border: 2px solid #00ff00; display: inline-block; padding: 30px; border-radius: 20px; box-shadow: 0 0 20px #00ff00; }
                h1 { text-transform: uppercase; letter-spacing: 5px; }
                .slogan { font-style: italic; color: white; margin-bottom: 20px; }
                .status { background: #00ff00; color: black; padding: 5px 10px; font-weight: bold; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>MaRi Gaming Store 🎮</h1>
                <p class="slogan">"MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki"</p>
                <p>Status System: <span class="status">ONLINE & ELIT</span></p>
                <hr border="1" color="#00ff00">
                <p>Layanan Aktif: MLBB & Arknights: Endfield</p>
                <p>Silakan chat ke WhatsApp untuk transaksi otomatis.</p>
            </div>
        </body>
        </html>
    `);
});

// --- 2. SETTING MESIN WHATSAPP ---
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-zygote',
            '--disable-gpu'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
    }
});

client.on('qr', (qr) => {
    console.log('CHIEF RIDWAN, SCAN QR INI DI LOGS KOYEB:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('MaRI Gaming Store Bot SIAP TERIMA ORDERAN ELIT!');
});

// --- 3. LOGIKA BOT INTERAKTIF (PRICELIST DETAIL) ---
client.on('message', async (msg) => {
    const body = msg.body.toLowerCase();

    if (body === 'p' || body === 'menu' || body === 'halo' || body === 'start') {
        await msg.reply(`*MaRi Gaming Store, MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki* ☕🎮

Pilih menu (Ketik Angkanya):
1️⃣. List Joki MLBB
2️⃣. List Joki Arknights: Endfield (Detail)
3️⃣. Format Order & Payment
4️⃣. Hubungi Owner (Admin)`);
    }

    else if (body === '1') {
        await msg.reply(`🎮 *LIST JOKI MLBB ELIT*
• Master: 3k | GM: 4k | Epic: 5k
• Legend: 8k | Mythic (0-25): 12k
• Mythic Honor: 15k | Mythic Glory: 22k
• Mythic Immortal: 35k++`);
    }

    else if (body === '2') {
        await msg.reply(`🏗️ *JOKI ARKNIGHTS: ENDFIELD*
⚠️ _BACA DESKRIPSI BIAR GAK KEKIE!_

*-- BASE SETUP --*
🟢 *Tier 1 (Rafinasi)*: 10k /Pabrik (Paket 5: 40k)
_D: Setting 1 jenis produksi awal. Bukan 1 base utuh!_

🟡 *Tier 2 (Conveyor)*: 15k /Jalur (Paket 5: 60k)
_D: Jalur otomatis per jenis material dasar._

🟠 *Tier 3 (Optimization)*: 45k
_D: Re-layout total jalur stuck. Workflow lancar._

🔴 *Tier 4 (Professional)*: 85k
_D: Logistik skala menengah, integrasi 2-3 area._

⭐ *Tier End (God Tier)*: 175k
_D: 6 Jalur Logistik Maksimal. Efisiensi 100%._

*-- STORY & FARMING --*
• Per Chapter: 20k | Paket Ch 1-3: 55k
• Full Map: 125k | Resource Farm: 20k
• Daily (7 Hari): 75k | Monthly (30 Hari): 300k`);
    }

    else if (body === '3') {
        await msg.reply(`📝 *FORMAT ORDER MaRI STORE*
Game:
Layanan/Tier:
Login Via:
Email/ID:
Pass:
Payment: (Dana/Gopay/QRIS)`);
    }

    else if (body === '4' || body === 'admin') {
        await msg.reply('Siapp Chief! Admin Ridwan udah dikasih tau.');
        await client.sendMessage(MY_NUMBER, `🚨 Ada buyer nyariin lu Chief!\nNomor: ${msg.from}`);
    }
});

// --- 4. ENDPOINT API (INVOICE DARI WEB) ---
app.post('/api/order', async (req, res) => {
    const d = req.body;
    let msg = `🔔 *ORDERAN BARU (INVOICE)*\n\n📌 TRK: ${d.trkId}\n🎮 Game: ${d.game}\n💰 Total: Rp ${d.price}\n📱 WA Buyer: ${d.wa}\n🔑 Akun: ${d.id} / ${d.pass}`;
    try {
        await client.sendMessage(MY_NUMBER, msg);
        res.status(200).send({ status: 'SUCCESS' });
    } catch (err) {
        res.status(500).send({ status: 'FAILED' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server Dashboard MaRi Store jalan di port ${PORT}`);
});

client.initialize();
