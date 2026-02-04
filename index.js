const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');

// KONFIGURASI NOMOR ELIT RIDWAN
const MY_NUMBER = '6285156906427@c.us'; 

const app = express();
app.use(bodyParser.json());

// --- TAMPILAN WEB ELIT TAPI RINGAN ---
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>MaRi Gaming Store | Dashboard</title>
            <style>
                body { background-color: #0a0a0a; color: #00ff00; font-family: 'Courier New', monospace; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .card { border: 2px solid #00ff00; padding: 30px; border-radius: 15px; box-shadow: 0 0 20px #00ff00; text-align: center; max-width: 400px; }
                h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
                p { color: #ffffff; margin-top: 15px; font-size: 14px; line-height: 1.6; }
                .status { display: inline-block; margin-top: 20px; padding: 5px 15px; background: #00ff00; color: #000; font-weight: bold; border-radius: 5px; text-transform: uppercase; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>MaRi Gaming Store 🎮</h1>
                <p>"MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki"</p>
                <div class="status">MaRi Store Fast Mode Active</div>
            </div>
        </body>
        </html>
    `);
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

// --- LOGIKA CHAT TETAP SAMA (DETAIL TIDAK BERUBAH) ---
client.on('message', async (msg) => {
    const body = msg.body.toLowerCase();
    if (msg.from.includes('@g.us')) return;

    if (body === 'p' || body === 'menu' || body === 'halo' || body === 'start') {
        await msg.reply(`*MaRi Gaming Store, MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki* ☕🎮\n\nPilih menu (Ketik Angkanya):\n1️⃣. List Joki MLBB\n2️⃣. List Joki Arknights: Endfield (Detail)\n3️⃣. Format Order Manual\n4️⃣. Hubungi Admin`);
    }
    else if (body === '1') {
        await msg.reply(`🎮 *LIST JOKI MLBB ELIT (PER BINTANG)*\n• Master: 3k | GM: 4k | Epic: 5k\n• Legend: 8k | Mythic (0-25): 12k\n• Mythic Honor (25-50): 15k\n• Mythic Glory (50-100): 22k\n• Mythic Immortal (100+): 35k++`);
    }
    else if (body === '2') {
        await msg.reply(`🏗️ *JOKI ARKNIGHTS: ENDFIELD (BASE & PROGRESS)*\n\n🟢 *Tier 1 (Rafinasi)*: 10k /Pabrik (Pkt 5: 40k)\n🟡 *Tier 2 (Conveyor)*: 15k /Jalur (Pkt 5: 60k)\n🟠 *Tier 3 (Optimization)*: 45k\n🔴 *Tier 4 (Professional)*: 85k\n⭐ *Tier End (God Tier)*: 175k\n\n*-- STORY & FARMING --*\n• Per Ch: 20k | Paket Ch 1-3: 55k\n• Full Map: 125k | Monthly: 300k`);
    }
    else if (body === '3') {
        await msg.reply(`📝 *FORMAT ORDER MaRI STORE*\nGame:\nLayanan/Tier:\nLogin Via:\nEmail/ID:\nPass:\nPayment: (Dana / Gopay / QRIS)`);
    }
    else if (body === '4') {
        await client.sendMessage(MY_NUMBER, `🚨 *CHIEF RIDWAN!* Ada buyer butuh admin.\nNomor: ${msg.from}`);
        await msg.reply('Siapp Chief! Admin Ridwan udah dikasih tau, tunggu bentar ya.');
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server melek di port ${PORT}`));

client.initialize();
