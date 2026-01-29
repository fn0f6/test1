
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// إعدادات CORS للسماح لـ Vite بالاتصال بالخادم
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// توفير الملفات الثابتة (مثل الصور في مجلد assets)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const DATA_FILE = path.join(__dirname, 'db.json');

const initializeDB = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      settings: {
        logoUrl: 'assets/asr_alhamour_logo_text.png',
        heroBgUrl: 'assets/island_skull_sunset.png',
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
           en: { navHome: 'Home', navNews: 'News', navShowcase: 'Features', navDownloads: 'Downloads', navSupport: 'Support', heroHeadline: 'Rule the Seas', heroSubheadline: 'Your adventure starts here.' },
           ar: { navHome: 'الرئيسية', navNews: 'الأخبار', navShowcase: 'المميزات', navDownloads: 'التحميل', navSupport: 'الدعم', heroHeadline: 'سيطر على البحار', heroSubheadline: 'مغامرتك تبدأ من هنا.' }
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

// مسارات الـ API
app.get('/api/settings', (req, res) => res.json(getDB().settings));
app.post('/api/settings', (req, res) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json(db.settings);
});

app.get('/api/news', (req, res) => res.json(getDB().news));
app.get('/api/tickets', (req, res) => res.json(getDB().tickets));

app.listen(PORT, () => {
  console.log(`
  ⚓ الأسطول جاهز للإبحار!
  🔗 الخادم يعمل على: http://localhost:${PORT}
  🚀 لتشغيل الواجهة، افتح Terminal جديد واكتب: npm run dev
  `);
});
