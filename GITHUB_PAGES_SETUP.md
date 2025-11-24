# راهنمای تنظیم GitHub Pages

## مراحل تنظیم GitHub Pages:

### 1. فعال‌سازی GitHub Pages

1. به repository خود بروید: https://github.com/MrAbol777/AbolStoRe-insta
2. روی **Settings** کلیک کنید
3. در منوی سمت چپ، روی **Pages** کلیک کنید
4. در بخش **Source**:
   - **Branch** را روی `main` تنظیم کنید
   - **Folder** را روی `/frontend` تنظیم کنید
5. روی **Save** کلیک کنید

### 2. منتظر بمانید

- بعد از Save، GitHub Pages شروع به build می‌کند
- این فرآیند ممکن است 1-5 دقیقه طول بکشد
- می‌توانید وضعیت را در تب **Actions** مشاهده کنید

### 3. دسترسی به سایت

بعد از build موفق، سایت شما در آدرس زیر در دسترس خواهد بود:

```
https://mrabol777.github.io/AbolStoRe-insta/
```

### 4. اگر هنوز خطای 404 می‌بینید:

1. چند دقیقه صبر کنید (build ممکن است زمان ببرد)
2. صفحه را رفرش کنید (Ctrl+F5)
3. مطمئن شوید که:
   - Branch روی `main` است
   - Folder روی `/frontend` است
   - فایل `frontend/index.html` وجود دارد

### 5. بررسی وضعیت Build

1. به تب **Actions** در repository بروید
2. اگر build در حال اجرا است، منتظر بمانید
3. اگر build با خطا مواجه شد، روی آن کلیک کنید و خطا را بررسی کنید

## نکات مهم:

- ⚠️ اولین build ممکن است 5-10 دقیقه طول بکشد
- ✅ بعد از اولین build، تغییرات جدید سریع‌تر اعمال می‌شوند
- 🔄 بعد از هر push جدید، GitHub Pages به صورت خودکار rebuild می‌شود

## لینک‌های مفید:

- [مستندات GitHub Pages](https://docs.github.com/en/pages)
- [Repository شما](https://github.com/MrAbol777/AbolStoRe-insta)

