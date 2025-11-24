# راهنمای یکپارچه‌سازی Firebase

## مراحل یکپارچه‌سازی:

### 1. اضافه کردن Firebase SDK به HTML

#### در `index.html`:

قبل از بستن تگ `</body>`، این خطوط را اضافه کنید:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"></script>

<!-- Firebase Config & Service -->
<script src="firebase-config.js"></script>
<script src="firebase-service.js"></script>

<!-- App JS (بعد از Firebase) -->
<script src="app.js"></script>
```

#### در `admin/dashboard.html`:

قبل از بستن تگ `</body>`، این خطوط را اضافه کنید:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"></script>

<!-- Firebase Config & Service -->
<script src="../firebase-config.js"></script>
<script src="../firebase-service.js"></script>

<!-- Admin JS (بعد از Firebase) -->
<script src="admin.js"></script>
```

### 2. به‌روزرسانی `app.js`

تابع `loadProducts()` را با نسخه Firebase جایگزین کنید (از `app-firebase.js` کپی کنید).

### 3. به‌روزرسانی `admin/admin.js`

تابع‌های `loadProducts()`, `saveProducts()`, `saveProduct()` را با نسخه Firebase جایگزین کنید (از `admin-firebase.js` کپی کنید).

### 4. تست

1. Firebase را تنظیم کنید (طبق `FIREBASE_SETUP.md`)
2. یک محصول در پنل ادمین اضافه کنید
3. صفحه فروشگاه را در دستگاه دیگر باز کنید
4. باید محصول جدید بلافاصله نمایش داده شود (بدون refresh)

## مزایا:

✅ **همگام‌سازی Real-time**: تغییرات بلافاصله روی همه دستگاه‌ها نمایش داده می‌شود
✅ **بدون نیاز به Refresh**: کاربران نیازی به رفرش صفحه ندارند
✅ **Fallback**: اگر Firebase در دسترس نباشد، از localStorage استفاده می‌کند
✅ **ساده**: بدون نیاز به backend پیچیده

## عیب‌یابی:

- اگر همگام‌سازی کار نمی‌کند، Console مرورگر را بررسی کنید (F12)
- مطمئن شوید Firebase SDK لود شده
- بررسی کنید که `firebase-config.js` درست تنظیم شده

