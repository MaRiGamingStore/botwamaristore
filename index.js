const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// NOMOR PRIBADI LU buat nerima notifikasi
const ALERT_NUMBER = '6285156906427@c.us';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('SCAN QR CODE INI BUAT LOGIN BOT MARI:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('MARI-STORE-SYNC-2026 ONLINE! Status: Elit, Siap Melayani Chief!');
});

const userState = {};

client.on('message', async msg => {
    const sender = msg.from;
    const userMessage = msg.body.toLowerCase();
    
    // Abaikan pesan dari grup atau nomor alert biar gak looping
    if (msg.fromMe || msg.isGroupMsg || sender === ALERT_NUMBER) return;

    const contact = await msg.getContact();
    const pushname = contact.pushname || 'Chief';

    // TRIGGER MENU UTAMA
    if (userMessage === 'p' || userMessage === 'menu' || userMessage === 'start') {
        userState[sender] = 'MAIN_MENU';
        const menuMsg = `*MaRi GAMING STORE*\n` +
                        `_"MaRi Kita Joki, Akun Jadi Elit, Lu Tinggal Ngupi, MaRI Beresin Tanpa Keki"_\n\n` +
                        `Halo Chief! Ada yang bisa dibantu?\n` +
                        `1. 🏆 Joki Mobile Legends\n` +
                        `2. 🏙️ Joki Arknights: Endfield (Mulai Rp 5rb!)\n` +
                        `3. 📞 Hubungi Admin (Langsung Balas)\n\n` +
                        `Pilih angka aja ya Chief!`;
        await client.sendMessage(sender, menuMsg);
        return;
    }

    // LOGIKA MENU
    switch (userState[sender]) {
        case 'MAIN_MENU':
            if (userMessage === '1') {
                userState[sender] = 'ML_MENU';
                await client.sendMessage(sender, 
                    `*🏆 PRICE LIST MLBB (CHIEF)*\n` +
                    `• Master-GM: 5k/bintang\n` +
                    `• Epic: 7k/bintang\n` +
                    `• Legend: 9k/bintang\n` +
                    `• Mythic: 12k/bintang\n\n` +
                    `Ketik *A* buat ambil format order atau *Menu* buat balik.`);
            } 
            else if (userMessage === '2') {
                userState[sender] = 'ENDFIELD_MENU';
                await client.sendMessage(sender,
                    `*🏙️ JOKI ENDFIELD (CHIEF)*\n` +
                    `• Eceran/Material: Mulai 5rb\n` +
                    `• Story/Arsitek Base: Mulai 50rb\n\n` +
                    `Ketik *B* buat ambil format order atau *Menu* buat balik.`);
            }
            else if (userMessage === '3') {
                await client.sendMessage(ALERT_NUMBER, `*NOTIF ADMIN!* 📢\nChief *${pushname}* mau ngobrol langsung. Segera cek WA MaRi Store!`);
                await client.sendMessage(sender, `Siap Chief! Tunggu bentar ya, Admin lagi meluncur buat bales chat lu secara manual.`);
                delete userState[sender];
            }
            break;

        case 'ML_MENU':
            if (userMessage === 'a') {
                userState[sender] = 'WAITING_DATA';
                await client.sendMessage(sender, `*FORMAT ORDER MLBB (CHIEF)*\nNick:\nID(Server):\nOrder Rank:\nLogin Via:\n\nKirim datanya ke sini Chief!`);
            }
            break;

        case 'ENDFIELD_MENU':
            if (userMessage === 'b') {
                userState[sender] = 'WAITING_DATA';
                await client.sendMessage(sender, `*FORMAT ORDER ENDFIELD (CHIEF)*\nUID:\nLogin Via:\nRequest:\n\nKirim datanya ke sini Chief!`);
            }
            break;

        case 'WAITING_DATA':
            // Notif transaksi masuk ke nomor alert lu
            await client.sendMessage(ALERT_NUMBER, `*DATA ORDER MASUK!* 💰\nDari: ${pushname}\nData: ${msg.body}`);
            
            await client.sendMessage(sender, 
                `Data diterima Chief! Admin MaRi GAMING STORE bakal langsung proses.\n\n` +
                `*PENTING:* Kalo nanti jokinya udah kelar, jangan lupa kasih testimoni ya Chief! Rating lu berharga banget buat kita. 🙏`);
            delete userState[sender]; 
            break;
    }

    // FITUR MANUAL REQUEST TESTI (Lu ketik "tagih testi" buat kirim template ke buyer)
    if (userMessage === 'tagih testi') {
        const testiMsg = `*JOKI SELESAI!* 🏆\n\nHalo Chief! Akun lu udah beres dikerjain nih. Silahkan dicek dulu ya.\n\n` +
                         `Kalo puas sama layanan *MaRi GAMING STORE*, mohon bantuannya buat kasih testimoni ya Chief. Bisa berupa screenshot atau kata-kata biar yang lain tau kualitas kita.\n\n` +
                         `Terima kasih udah mempercayakan akun lu ke kita! MaRI Kita Joki, Lu Tinggal Ngupi!`;
        await client.sendMessage(sender, testiMsg);
    }
});

client.initialize();