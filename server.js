
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'db.json');

const initializeDB = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      settings: {
        logoUrl: 'assets/asr_alhamour_logo_text.png',
        heroBgUrl: 'assets/island_skull_sunset.png',
        siteBgColor: '#0f0a05',
        primaryColor: '#10b981',
        secondaryColor: '#b45309',
        siteTitle: 'عصر الهامور',
        androidUrl: '#',
        iosUrl: '#',
        isMaintenanceMode: false,
        maintenanceMessage: 'الأسطول في مهمة صيانة سريعة، سنعود قريباً!',
        showcaseImages: {
          map: 'assets/old_map_texture.png',
          rank: 'assets/swords_crossed.png',
          tasks: 'assets/scroll_paper.png',
          chat: 'assets/chat_bubble.png',
          store: 'assets/fish_market_isometric.png',
          warehouse: 'assets/house_isometric.png',
        },
        translations: {
           en: { navHome: 'Home', navNews: 'News', navShowcase: 'Features', navDownloads: 'Downloads', navSupport: 'Support', heroHeadline: 'Rule the Seas', heroSubheadline: 'Your adventure starts here.', heroBtnDownload: 'Get App', heroBtnLogs: 'Logs', newsTitle: 'News', newsSub: 'Latest', newsBtnRead: 'Read', showcaseTitle: 'Showcase', showcaseSub: 'Game', featMap: 'Map', featMapDesc: 'Explore', featRank: 'Rank', featRankDesc: 'Compete', featTasks: 'Tasks', featTasksDesc: 'Quests', featChat: 'Chat', featChatDesc: 'Connect', featStore: 'Store', featStoreDesc: 'Trade', featWarehouse: 'Safe', featWarehouseDesc: 'Secure', downloadTitle: 'Download', downloadSub: 'Now', downloadQuickDeploy: 'QR', downloadQuickDeploySub: 'Scan', supportTitle: 'Support', supportSub: 'Contact', supportBtnSend: 'Send', footerDesc: 'Asr Al Hamour', storeAppStore: 'App Store', storeGooglePlay: 'Google Play', storeBadge: 'Official' },
           ar: { navHome: 'الرئيسية', navNews: 'الأخبار', navShowcase: 'المميزات', navDownloads: 'التحميل', navSupport: 'الدعم', heroHeadline: 'سيطر على البحار', heroSubheadline: 'مغامرتك تبدأ من هنا.', heroBtnDownload: 'تحميل', heroBtnLogs: 'السجلات', newsTitle: 'الأخبار', newsSub: 'الأحدث', newsBtnRead: 'اقرأ', showcaseTitle: 'العرض', showcaseSub: 'اللعبة', featMap: 'خريطة', featMapDesc: 'استكشف', featRank: 'ترتيب', featRankDesc: 'نافس', featTasks: 'مهام', featTasksDesc: 'يومية', featChat: 'دردشة', featChatDesc: 'تواصل', featStore: 'متجر', featStoreDesc: 'تاجر', featWarehouse: 'خزنة', featWarehouseDesc: 'أمّن', downloadTitle: 'تحميل', downloadSub: 'الآن', downloadQuickDeploy: 'QR', downloadQuickDeploySub: 'امسح', supportTitle: 'الدعم', supportSub: 'اتصل', supportBtnSend: 'إرسال', footerDesc: 'عصر الهامور', storeAppStore: 'App Store', storeGooglePlay: 'Google Play', storeBadge: 'رسمي' }
        },
        socialLinks: {
          showSocials: true,
          whatsapp: '',
          whatsappGroup: '',
          telegram: '',
          discord: '',
          instagram: '',
          twitter: '',
          youtube: '',
          facebook: '',
          tiktok: '',
          snapchat: '',
          activeLinks: {
            whatsapp: true,
            whatsappGroup: true,
            telegram: true,
            discord: true,
            instagram: true,
            twitter: true,
            youtube: true,
            facebook: true,
            tiktok: true,
            snapchat: true
          }
        }
      },
      news: [],
      tickets: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
};

initializeDB();

const getDB = () => JSON.parse(fs.readFileSync(DATA_FILE));
const saveDB = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

app.get('/api/settings', (req, res) => res.json(getDB().settings));
app.post('/api/settings', (req, res) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json(db.settings);
});

app.get('/api/tickets', (req, res) => res.json(getDB().tickets));
app.post('/api/tickets', (req, res) => {
  const db = getDB();
  const newTicket = { ...req.body, id: Date.now(), createdAt: Date.now() };
  db.tickets.unshift(newTicket);
  saveDB(db);
  res.json(newTicket);
});
app.delete('/api/tickets/:id', (req, res) => {
  const db = getDB();
  db.tickets = db.tickets.filter(t => t.id !== parseInt(req.params.id));
  saveDB(db);
  res.json({ success: true });
});

app.get('/api/news', (req, res) => res.json(getDB().news));
app.post('/api/news', (req, res) => {
  const db = getDB();
  const newNews = { ...req.body, id: Date.now().toString(), date: new Date().toLocaleDateString('ar-EG') };
  db.news.unshift(newNews);
  saveDB(db);
  res.json(newNews);
});
app.delete('/api/news/:id', (req, res) => {
  const db = getDB();
  db.news = db.news.filter(n => n.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
