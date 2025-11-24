# راهنمای سریع تنظیم JSONBin.io

## چرا JSONBin؟

JSONBin ساده‌ترین راه‌حل برای همگام‌سازی است. بدون نیاز به تنظیمات پیچیده Firebase.

## مراحل تنظیم (5 دقیقه):

### 1. ساخت Bin در JSONBin

1. به [JSONBin.io](https://jsonbin.io/) بروید
2. روی **Sign Up** کلیک کنید (یا Sign In)
3. بعد از ورود، روی **Create Bin** کلیک کنید
4. محتوای اولیه را وارد کنید:

```json
{
  "products": []
}
```

5. روی **Create** کلیک کنید
6. **Bin ID** را کپی کنید (مثلاً: `65a1b2c3d4e5f6g7h8i9j0k`)
7. به **Account Settings** → **API Keys** بروید
8. **Master Key** را کپی کنید

### 2. تنظیم فایل

فایل `jsonbin-service.js` را باز کنید و این خطوط را ویرایش کنید:

```javascript
const JSONBIN_API_KEY = 'YOUR_MASTER_KEY_HERE';  // Master Key را اینجا بگذارید
const JSONBIN_BIN_ID = 'YOUR_BIN_ID_HERE';        // Bin ID را اینجا بگذارید
```

### 3. اضافه کردن به HTML

در `index.html` و `admin/dashboard.html`، قبل از `app.js` یا `admin.js`:

```html
<script src="jsonbin-service.js"></script>
```

### 4. به‌روزرسانی کد

در `app.js` و `admin/admin.js`، تابع `loadProducts()` را به این صورت تغییر دهید:

```javascript
async function loadProducts() {
    // اول از JSONBin بخوان (اگر فعال باشد)
    if (typeof jsonbinService !== 'undefined' && jsonbinService.isActive()) {
        products = await jsonbinService.loadProducts();
        
        // اگر خالی بود، از products.json بخوان
        if (products.length === 0) {
            const response = await fetch('products.json');
            if (response.ok) {
                products = await response.json();
                await jsonbinService.saveProducts(products);
            }
        }
        
        renderProducts();
        return;
    }
    
    // Fallback: از localStorage بخوان
    // ... کد قبلی
}
```

و تابع `saveProducts()`:

```javascript
async function saveProducts() {
    if (typeof jsonbinService !== 'undefined' && jsonbinService.isActive()) {
        await jsonbinService.saveProducts(products);
    } else {
        localStorage.setItem('combo_shop_products', JSON.stringify(products));
    }
}
```

## مزایا:

✅ **ساده**: فقط 2 خط کد نیاز دارد
✅ **سریع**: بدون نیاز به تنظیمات پیچیده
✅ **رایگان**: تا 1000 request در ماه
✅ **بدون Real-time**: اما با refresh کار می‌کند

## محدودیت‌ها:

⚠️ **بدون Real-time**: نیاز به refresh صفحه دارد
⚠️ **محدودیت Request**: 1000 request در ماه (برای استفاده کوچک کافی است)

## تست:

1. یک محصول در پنل ادمین اضافه کنید
2. صفحه را refresh کنید
3. در موبایل، صفحه را refresh کنید
4. باید محصول جدید نمایش داده شود

## عیب‌یابی:

- اگر کار نمی‌کند، Console مرورگر را بررسی کنید (F12)
- مطمئن شوید API Key و Bin ID درست هستند
- بررسی کنید که Bin در JSONBin.io وجود دارد

