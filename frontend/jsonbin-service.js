// ============================================
// سرویس JSONBin.io برای همگام‌سازی محصولات
// ============================================

// TODO: این مقادیر را با اطلاعات JSONBin خود جایگزین کنید
// برای ساخت Bin: https://jsonbin.io/ → Create Bin

const JSONBIN_API_KEY = 'YOUR_JSONBIN_API_KEY';
const JSONBIN_BIN_ID = 'YOUR_JSONBIN_BIN_ID';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

class JSONBinService {
    constructor() {
        this.isConfigured = JSONBIN_API_KEY !== 'YOUR_JSONBIN_API_KEY' && 
                           JSONBIN_BIN_ID !== 'YOUR_JSONBIN_BIN_ID';
    }

    /**
     * بارگذاری محصولات از JSONBin
     */
    async loadProducts() {
        if (!this.isConfigured) {
            console.warn('JSONBin تنظیم نشده است. از localStorage استفاده می‌شود.');
            return this.loadProductsFromLocalStorage();
        }

        try {
            const response = await fetch(JSONBIN_URL + '/latest', {
                headers: {
                    'X-Master-Key': JSONBIN_API_KEY
                }
            });

            if (!response.ok) {
                throw new Error('خطا در بارگذاری از JSONBin');
            }

            const data = await response.json();
            const products = data.record?.products || [];

            if (products.length > 0) {
                // همگام‌سازی با localStorage
                localStorage.setItem('combo_shop_products', JSON.stringify(products));
                return products;
            } else {
                return this.loadProductsFromLocalStorage();
            }
        } catch (error) {
            console.error('خطا در بارگذاری از JSONBin:', error);
            return this.loadProductsFromLocalStorage();
        }
    }

    /**
     * ذخیره محصولات در JSONBin
     */
    async saveProducts(products) {
        if (!this.isConfigured) {
            // Fallback به localStorage
            localStorage.setItem('combo_shop_products', JSON.stringify(products));
            return true;
        }

        try {
            const response = await fetch(JSONBIN_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify({ products })
            });

            if (response.ok) {
                // همگام‌سازی با localStorage
                localStorage.setItem('combo_shop_products', JSON.stringify(products));
                return true;
            } else {
                throw new Error('خطا در ذخیره در JSONBin');
            }
        } catch (error) {
            console.error('خطا در ذخیره در JSONBin:', error);
            // Fallback به localStorage
            localStorage.setItem('combo_shop_products', JSON.stringify(products));
            return false;
        }
    }

    /**
     * بارگذاری از localStorage
     */
    loadProductsFromLocalStorage() {
        const saved = localStorage.getItem('combo_shop_products');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }

    /**
     * بررسی اینکه آیا سرویس فعال است یا نه
     */
    isActive() {
        return this.isConfigured;
    }
}

// ایجاد instance سراسری
const jsonbinService = new JSONBinService();

