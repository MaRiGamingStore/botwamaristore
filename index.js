const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const MY_NUMBER = '6285156906427@c.us';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-zygote'
        ]
    }
});

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

const menuPilihan = `🎮 *MENU LAYANAN MA-RI GAMING STORE* 🎮

*ARKNIGHTS: ENDFIELD*
1. Tier 1 (Basic Setup) - Rp 5.000
2. Tier 2 (Mid-Route) - Rp 10.000
3. Tier 3 (Optimization) - Rp 35.000
4. Tier 4 (Professional) - Rp 50.000
5. Tier End (God Tier) - Rp 100.000
6. Per Chapter (Story) - Rp 20.000
7. Paket Story (Ch 1-3) - Rp 120.000
8. Eksplorasi Map - Rp 125.000
9. Resource Farm - Rp 25.000
10. Daily Farm (1 Minggu) - Rp 80.000
11. Monthly Farming (VIP) - Rp 250.000
12. Starter Siap Tempur - Rp 300.000
13. Pro-Farmer Setup - Rp 500.000
14. Akun Elit (End-Game) - Rp 850.000
15. The Hub Map (Sultan) - Rp 1.377.000
16. Valley IV (Sultan) - Rp 1.836.000
17. End-Game Integration - Rp 2.500.000

*MOBILE LEGENDS*
A. Joki Master
B. Joki Grandmaster
C. Joki Epic
D. Joki Legend
E. Joki Mythic

*Bales dengan Angka (1-17) atau Huruf (A-E) buat pilih layanan Chief!*
"MaRi Gaming Store, MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi"`;

client.on('qr', (qr) => {
    console.log('CHIEF SCAN QR INI DI TAB LOGS KOYEB:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('BOT MA-RI STORE STATUS: AKTIF & SIAP TEMPUR!');
});

// LOGIKA PILIH LAYANAN OTOMATIS
client.on('message', async msg => {
    const chat = msg.body.toUpperCase();
    
    if (chat === 'MENU' || chat === 'P' || chat === 'HALO') {
        await msg.reply(menuPilihan);
    } 
    
    // Contoh Logika Respon Pilihan (Bisa lu kembangin terus Chief)
    if (chat === '1') {
        await msg.reply(`*Pilihan: Tier 1 (Basic Setup)*\n\nDeskripsi: ${serviceDescriptions.endfield['Tier 1 (Basic Setup)']}\n\nHarga: Rp 5.000 (Wajib QRIS)\n\nSilakan lanjut order via web atau kirim format data joki ke Admin Chief!`);
    }
});

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

    msg += `\nMaRi Gaming Store, MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki`;

    try {
        await client.sendMessage(MY_NUMBER, msg);
        res.status(200).send({ status: 'SUCCESS' });
    } catch (err) {
        console.error('Bot Error:', err);
        res.status(500).send({ status: 'FAILED' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server API Bot jalan di port ${PORT}`);
});

client.initialize();
