# راهنمای تنظیم Firebase برای همگام‌سازی محصولات

## چرا Firebase؟

Firebase Realtime Database به شما امکان همگام‌سازی Real-time بین تمام دستگاه‌ها را می‌دهد. وقتی محصولی را در لپ‌تاپ اضافه/حذف/ویرایش می‌کنید، بلافاصله روی گوشی و سایر دستگاه‌ها نمایش داده می‌شود.

## مراحل تنظیم:

### 1. ساخت پروژه Firebase

1. به [Firebase Console](https://console.firebase.google.com/) بروید
2. روی **Add project** کلیک کنید
3. نام پروژه را وارد کنید (مثلاً: `combo-shop`)
4. Google Analytics را فعال یا غیرفعال کنید (اختیاری)
5. روی **Create project** کلیک کنید

### 2. فعال‌سازی Realtime Database

1. در منوی سمت چپ، روی **Realtime Database** کلیک کنید
2. روی **Create Database** کلیک کنید
3. **Location** را انتخاب کنید (مثلاً: `us-central1`)
4. روی **Next** کلیک کنید
5. **Start in test mode** را انتخاب کنید (برای شروع)
6. روی **Enable** کلیک کنید

### 3. دریافت تنظیمات Firebase

1. در منوی سمت چپ، روی **Project Settings** (⚙️) کلیک کنید
2. به پایین اسکرول کنید تا بخش **Your apps** را ببینید
3. روی آیکون **Web** (`</>`) کلیک کنید
4. نام app را وارد کنید (مثلاً: `Combo Shop`)
5. روی **Register app** کلیک کنید
6. کد تنظیمات را کپی کنید

### 4. تنظیم فایل‌های پروژه

1. فایل `firebase-config.js` را باز کنید
2. مقادیر را با اطلاعات پروژه خود جایگزین کنید:

```javascript
const FIREBASE_CONFIG = {
    apiKey: "AIzaSy...",  // از Firebase Console
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### 5. اضافه کردن Firebase SDK

در فایل `index.html` و `admin/dashboard.html`، قبل از بستن تگ `</body>` این خط را اضافه کنید:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"></script>
<script src="firebase-config.js"></script>
<script src="firebase-service.js"></script>
```

### 6. تنظیم قوانین امنیتی (اختیاری اما توصیه می‌شود)

در Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": true
    },
    "orders": {
      ".read": true,
      ".write": true
    }
  }
}
```

**⚠️ توجه:** این قوانین برای شروع مناسب است اما برای production باید امنیت بیشتری اضافه کنید.

## استفاده در کد:

### در `app.js`:

```javascript
// به جای loadProducts() قدیمی:
async function loadProducts() {
    // اول از Firebase بخوان
    products = await firebaseService.loadProducts();
    
    // اگر خالی بود، از products.json بخوان
    if (products.length === 0) {
        const response = await fetch('products.json');
        if (response.ok) {
            products = await response.json();
            // ذخیره در Firebase
            await firebaseService.saveProducts(products);
        }
    }
    
    renderProducts();
    
    // گوش دادن به تغییرات Real-time
    firebaseService.onProductsChange((updatedProducts) => {
        products = updatedProducts;
        renderProducts();
    });
}
```

### در `admin/admin.js`:

```javascript
// به جای saveProducts() قدیمی:
async function saveProducts() {
    await firebaseService.saveProducts(products);
    renderProducts();
}
```

## مزایا:

✅ **همگام‌سازی Real-time**: تغییرات بلافاصله روی همه دستگاه‌ها نمایش داده می‌شود
✅ **بدون نیاز به Refresh**: کاربران نیازی به رفرش صفحه ندارند
✅ **رایگان**: برای استفاده‌های کوچک تا متوسط رایگان است
✅ **ساده**: بدون نیاز به backend پیچیده
✅ **Fallback**: اگر Firebase در دسترس نباشد، از localStorage استفاده می‌کند

## محدودیت‌های رایگان:

- 1 GB ذخیره‌سازی
- 10 GB انتقال داده در ماه
- 100 همزمانی

برای یک فروشگاه کوچک، این محدودیت‌ها کافی است.

## عیب‌یابی:

اگر همگام‌سازی کار نمی‌کند:

1. Console مرورگر را بررسی کنید (F12)
2. مطمئن شوید Firebase SDK لود شده
3. بررسی کنید که databaseURL درست است
4. قوانین امنیتی را بررسی کنید

## منابع:

- [مستندات Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Firebase Console](https://console.firebase.google.com/)

