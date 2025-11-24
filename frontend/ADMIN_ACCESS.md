# دسترسی به پنل مدیریت

## در GitHub Pages:

بعد از تنظیم GitHub Pages، می‌توانید از طریق این آدرس به پنل مدیریت دسترسی پیدا کنید:

```
https://mrabol777.github.io/AbolStoRe-insta/admin
```

یا:

```
https://mrabol777.github.io/AbolStoRe-insta/admin/
```

## رمز ورود پیش‌فرض:

```
admin123
```

## نکات مهم:

1. **مطمئن شوید GitHub Pages فعال است:**
   - به Settings → Pages بروید
   - Source را روی `main` و `/frontend` تنظیم کنید

2. **اگر خطای 404 می‌بینید:**
   - چند دقیقه صبر کنید (build ممکن است زمان ببرد)
   - صفحه را رفرش کنید (Ctrl+F5)
   - تب Actions را بررسی کنید تا ببینید build موفق بوده یا نه

3. **تغییر رمز ورود:**
   - فایل `frontend/admin/index.html` را باز کنید
   - خط 79 را پیدا کنید: `const ADMIN_PASSWORD = 'admin123';`
   - رمز را تغییر دهید

## ساختار پنل:

- `/admin` یا `/admin/` → صفحه ورود
- `/admin/dashboard.html` → صفحه اصلی پنل (بعد از ورود)

