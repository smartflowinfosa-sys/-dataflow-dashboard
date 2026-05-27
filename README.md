# DataFlow Analytics — PWA

داشبورد تحليلات احترافي قابل للتثبيت كتطبيق على أي جهاز.

## التشغيل المحلي

```bash
# 1. تثبيت المتطلبات
npm install

# 2. تشغيل بيئة التطوير
npm run dev
```

افتح المتصفح على: http://localhost:5173

## البناء للنشر

```bash
npm run build
```

الملفات الجاهزة ستكون في مجلد `dist/`

## النشر على Vercel

### الطريقة الأولى — عبر GitHub (موصى بها)
1. ارفع المشروع على GitHub
2. اذهب إلى vercel.com وسجّل دخولك
3. اضغط "New Project" واختر المستودع
4. Vercel سيكتشف Vite تلقائياً ويبدأ النشر

### الطريقة الثانية — عبر CLI
```bash
npm install -g vercel
vercel
```

## التثبيت كـ PWA

بعد النشر على Vercel:
- **Chrome/Edge**: ستظهر أيقونة تثبيت في شريط العنوان
- **iOS Safari**: اضغط Share → Add to Home Screen
- **Android Chrome**: ستظهر نافذة "Add to Home Screen" تلقائياً

## هيكل المشروع

```
dataflow-pwa/
├── src/
│   ├── App.jsx          ← الداشبورد الرئيسي
│   ├── main.jsx         ← نقطة البداية + تسجيل PWA
│   └── index.css        ← الأنماط العامة
├── public/
│   ├── favicon.svg      ← أيقونة المتصفح
│   └── icons/           ← أيقونات PWA
├── index.html           ← HTML الرئيسي
├── vite.config.js       ← إعدادات Vite + PWA
├── vercel.json          ← إعدادات الاستضافة
└── package.json
```

## الميزات

- ✅ 5 ثيمات (Ocean, Violet, Emerald, Amber, Light)
- ✅ رسوم بيانية تفاعلية (Area, Bar, Pie)
- ✅ استيراد Excel, Google Sheets, PDF, Word
- ✅ تكامل مع Zapier, Make, Salesforce, HubSpot
- ✅ يعمل على الجوال والديسكتوب
- ✅ قابل للتثبيت كتطبيق بدون App Store
- ✅ يعمل offline بعد التثبيت
