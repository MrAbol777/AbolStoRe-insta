# راه‌حل‌های جایگزین برای همگام‌سازی

## راه‌حل 1: JSONBin.io (ساده‌ترین)

JSONBin.io یک سرویس رایگان برای ذخیره JSON است. بدون نیاز به تنظیمات پیچیده.

### مزایا:
- ✅ رایگان (تا 1000 request در ماه)
- ✅ بدون نیاز به ثبت‌نام پیچیده
- ✅ API ساده
- ✅ بدون نیاز به backend

### مراحل:

1. به [JSONBin.io](https://jsonbin.io/) بروید و ثبت‌نام کنید
2. یک Bin جدید بسازید
3. API Key را کپی کنید
4. Bin ID را کپی کنید

### کد مثال:

```javascript
// jsonbin-service.js
const JSONBIN_API_KEY = 'YOUR_API_KEY';
const JSONBIN_BIN_ID = 'YOUR_BIN_ID';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

async function loadProductsFromJSONBin() {
    try {
        const response = await fetch(JSONBIN_URL + '/latest', {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        const data = await response.json();
        return data.record.products || [];
    } catch (error) {
        console.error('خطا:', error);
        return [];
    }
}

async function saveProductsToJSONBin(products) {
    try {
        const response = await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify({ products })
        });
        return response.ok;
    } catch (error) {
        console.error('خطا:', error);
        return false;
    }
}
```

## راه‌حل 2: Supabase (قدرتمندتر)

Supabase یک جایگزین open-source برای Firebase است.

### مزایا:
- ✅ رایگان (تا 500 MB دیتابیس)
- ✅ Real-time sync
- ✅ API RESTful
- ✅ امنیت بهتر

### مراحل:

1. به [Supabase](https://supabase.com/) بروید و ثبت‌نام کنید
2. یک پروژه جدید بسازید
3. یک Table بسازید: `products` با ستون‌های: `id`, `title`, `price`, `description`, etc.
4. API Key و URL را کپی کنید

### کد مثال:

```javascript
// supabase-service.js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_KEY';

async function loadProductsFromSupabase() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('خطا:', error);
        return [];
    }
}

async function saveProductToSupabase(product) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify(product)
        });
        return response.ok;
    } catch (error) {
        console.error('خطا:', error);
        return false;
    }
}
```

## راه‌حل 3: GitHub API (بدون Backend)

استفاده از GitHub API برای به‌روزرسانی فایل `products.json` در repository.

### مزایا:
- ✅ رایگان
- ✅ بدون نیاز به سرویس خارجی
- ✅ داده‌ها در repository شما هستند

### معایب:
- ⚠️ نیاز به GitHub Token
- ⚠️ کمی پیچیده‌تر
- ⚠️ Real-time نیست (نیاز به refresh)

### کد مثال:

```javascript
// github-service.js
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';
const GITHUB_REPO = 'MrAbol777/AbolStoRe-insta';
const GITHUB_FILE = 'frontend/products.json';

async function loadProductsFromGitHub() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`
                }
            }
        );
        const data = await response.json();
        const content = atob(data.content); // decode base64
        return JSON.parse(content);
    } catch (error) {
        console.error('خطا:', error);
        return [];
    }
}

async function saveProductsToGitHub(products) {
    try {
        // اول فایل فعلی را بخوان
        const getResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`
                }
            }
        );
        const fileData = await getResponse.json();
        
        // فایل جدید را آپلود کن
        const content = btoa(JSON.stringify(products, null, 2)); // encode base64
        const putResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update products',
                    content: content,
                    sha: fileData.sha // برای به‌روزرسانی فایل موجود
                })
            }
        );
        return putResponse.ok;
    } catch (error) {
        console.error('خطا:', error);
        return false;
    }
}
```

## مقایسه راه‌حل‌ها:

| ویژگی | Firebase | JSONBin | Supabase | GitHub API |
|-------|----------|---------|----------|------------|
| رایگان | ✅ | ✅ | ✅ | ✅ |
| Real-time | ✅ | ❌ | ✅ | ❌ |
| سادگی | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| امنیت | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| سرعت | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## توصیه:

- **برای شروع سریع**: JSONBin.io
- **برای Real-time sync**: Firebase یا Supabase
- **برای کنترل کامل**: GitHub API

## نکته مهم:

همه این راه‌حل‌ها باید با localStorage به عنوان fallback استفاده شوند تا در صورت عدم دسترسی به اینترنت، سایت همچنان کار کند.

