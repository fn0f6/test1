
# دليل إعداد مشروع "عصر الهامور" (Supabase Edition)

هذا المشروع يستخدم **Supabase** كقاعدة بيانات ومخزن للملفات. اتبع الخطوات التالية للتشغيل:

## 1. إعداد قاعدة البيانات (SQL)
- اذهب إلى مشروعك في [Supabase Console](https://app.supabase.com/).
- افتح **SQL Editor**.
- انسخ محتوى ملف `supabase_setup.sql` والصقه هناك ثم اضغط **Run**.

## 2. إعداد المخزن (Storage)
- اذهب إلى قسم **Storage** في القائمة الجانبية.
- تأكد من وجود Bucket باسم `assets`.
- تأكد من أن الـ Bucket مضبوط كـ **Public**.

## 3. ربط التطبيق (Environment Variables)
قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع وأضف البيانات التالية:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## 4. التشغيل المحلي
```bash
npm install
npm run dev
```

## ملاحظات أمنية:
السياسات الحالية (RLS) في ملف الـ SQL مفتوحة لتسهيل التطوير. عند رفع الموقع للإنتاج، يفضل تقييد عمليات الـ (Update/Delete/Insert) للمستخدمين المسجلين فقط (Authenticated Users).
