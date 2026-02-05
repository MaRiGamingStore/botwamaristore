const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const MY_NUMBER = '6285156906427@c.us'; // Nomor pribadi Ridwan 

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('CHIEF RIDWAN, SCAN QR INI DI TAB LOGS KOYEB:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('MaRI Gaming Store Bot SIAP TEMPUR DI KOYEB!');
});

// DATA DESKRIPSI LENGKAP PENGERJAAN (Dagingnya MaRi Store Chief!) 
const serviceDescriptions = {
    'mlbb': {
        'Joki Master': 'Pengerjaan cepat rank Master. Winrate aman Chief. Hero meta pool luas.',
        'Joki Grandmaster': 'Beresin rank GM tanpa keki. Cocok buat naik ke Epic dengan winrate manis.',
        'Joki Epic': 'Layanan joki tier badak. Pengerjaan secepat kilat oleh joki professional.',
        'Joki Legend': 'Otw Mythic lancar jaya. Hero pool luas menyesuaikan meta terbaru.',
        'Joki Mythic': 'Rank kasta tinggi. Target Mythical Glory aman dengan pengerjaan paling elit.'
    },
    'endfield': {
        'Tier 1 (Basic Setup)': 'Khusus setting 1 jenis produksi material awal (Rafinasi). Contoh: Bijih Ametis jadi Serat Ametis. Bukan 1 base utuh Chief.',
        'Tier 2 (Mid-Route)': 'Pembuatan jalur conveyor belt otomatis sederhana untuk 1 jenis material dasar produksi.',
        'Tier 3 (Optimization)': 'Re-layout total jalur produksi yang sudah berantakan. Workflow produksi lancar tanpa stuck.',
        'Tier 4 (Professional)': 'Pemasangan jalur logistik otomatis skala menengah. Mengintegrasikan 2-3 area produksi sekaligus.',
        'Tier End (God Tier)': 'Setting 6 Jalur Logistik Vertikal/Horizontal maksimal. Produksi super cepat & efisiensi 100%.',
        'Per Chapter (Story)': 'Clear misi utama per chapter pilihan Chief. Harga menyesuaikan tingkat kesulitan misi.',
        'Paket Story (Ch 1-3)': 'Akselerasi story awal sampai tamat Chapter 3. Progres cepat tanpa keki.',
        'Eksplorasi Map': 'Unlock Kabut, Beacon, & Teleport di area yang tersedia agar akses Chief lancar.',
        'Resource Farm': 'Satu kali sesi menghabiskan seluruh Stamina/Energy Chief untuk mencari material spesifik.',
        'Daily Farm (1 Minggu)': 'Jasa harian selama 7 hari (Login, Clear Daily Mission, dan kuras habis Stamina rutin).',
        'Monthly Farming (VIP)': 'VIP Service 30 hari. Full maintenance, event terbatas dikerjain admin, resource dijagain elit.',
        'Starter Siap Tempur': 'Story Ch 1-3 Tamat + Full Map Dasar Terbuka + Base Tier 2. Chief tinggal main elit.',
        'Pro-Farmer Setup': 'Story Ch 1-5 Tamat + Full Map Exploration + Base Tier 4. Setup pabrik kompleks siap tempur.',
        'Akun Elit (End-Game)': 'Full Story & Map + Setup Tower 6 Jalur + Bonus Maintenance Gratis 1 bulan. Kasta tertinggi.',
        'The Hub Map (Sultan)': 'Full Service eksplorasi map The Hub secara menyeluruh skala internasional. Clear 100%.',
        'Valley IV (Sultan)': 'Full Progress khusus area Valley IV dengan standar pengerjaan tinggi sampai tuntas tervalidasi.',
        'End-Game Integration': 'Setup base end-game paling kompleks Sultan. Integrasi seluruh sistem produksi otomatis total.'
    }
};

// FITUR PILIHAN MENU OTOMATIS
const menuPilihan = `🎮 *MENU LAYANAN MA-RI GAMING STORE* 🎮

*ARKNIGHTS: ENDFIELD*
1. Tier 1 (Basic Setup)
2. Tier 2 (Mid-Route)
... (dan seterusnya sampai 17 layanan Chief)

*MOBILE LEGENDS*
A. Joki Master
B. Joki Grandmaster
... (dan seterusnya)

*Bales "Menu" buat liat list ini lagi Chief!*
"MaRi Gaming Store, MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi"`;

client.on('message', async msg => {
    const chat = msg.body.toLowerCase();
    if (chat.includes('menu') || chat.includes('pilih')) {
        await msg.reply(menuPilihan);
    }
});

// ENDPOINT TERIMA DATA DARI WEB
app.post('/api/order', async (req, res) => {
    const d = req.body;
    const desc = serviceDescriptions[d.game]?.[d.pkg] || 'Deskripsi tidak ditemukan Chief.';

    let msg = `🔔 *ORDERAN BARU MASUK (INVOICE)*\n\n` +
              `📌 TRK: ${d.trkId}\n` +
              `🎮 Game: ${d.game.toUpperCase()}\n` +
              `📦 Paket: ${d.pkg}\n` +
              `💰 Total: Rp ${d.price.toLocaleString()}\n` +
              `💳 Metode: ${d.pay}\n` +
              `📱 WA Buyer: ${d.wa}\n\n` +
              `📝 *DESKRIPSI PENGERJAAN:*\n` +
              `> ${desc}\n\n` +
              `🔓 *DATA LOGIN:*\n` +
              `🆔 Login Via: ${d.loginVia || '-'}\n` +
              `🆔 Akun/Email: ${d.id}\n` +
              `🔑 Password: ${d.pass}\n`;

    if (d.game === 'endfield') {
        msg += `\n🏗️ *DATA BASE & LEVEL ROMAWI:*\n` +
               `🏠 Nama Base: ${d.base || '-'}\n` +
               `🗺️ Lvl Explo: ${d.lvlExplo || '-'}\n` +
               `🎖️ Lvl Otoritas: ${d.lvlOto || '-'}\n` +
               `⚡ Lvl AIC: ${d.lvlAIC || '-'}\n` +
               `🚌 Lvl Bus Depot: ${d.lvlBus || '-'}\n`;
    }

    msg += `\n*MaRI Beresin Tanpa Keki!*]`;

    try {
        await client.sendMessage(MY_NUMBER, msg);
        res.status(200).send({ status: 'SUCCESS' });
    } catch (err) {
        res.status(500).send({ status: 'FAILED' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => { console.log(`Bot aktif di port ${PORT}`); });
client.initialize();
