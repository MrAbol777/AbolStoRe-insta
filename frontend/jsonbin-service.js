// ============================================
// سرویس JSONBin.io برای همگام‌سازی محصولات
// ============================================

// TODO: این مقادیر را با اطلاعات JSONBin خود جایگزین کنید
// برای ساخت Bin: https://jsonbin.io/ → Create Bin

const JSONBIN_API_KEY = '$2a$10$gYsMP3xTRxsvHKNQA9Iuu.XvEwqs3n4BkuQ3kUKYlMC6WcZhv/OeK';
const JSONBIN_BIN_ID = '692437cad0ea881f40fcc13d';
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
     * بارگذاری سفارش‌ها از JSONBin
     */
    async loadOrders() {
        if (!this.isConfigured) {
            console.warn('JSONBin تنظیم نشده است. از localStorage استفاده می‌شود.');
            return this.loadOrdersFromLocalStorage();
        }

        try {
            const response = await fetch(JSONBIN_URL + '/latest', {
                headers: {
                    'X-Master-Key': JSONBIN_API_KEY
                }
            });

            if (!response.ok) {
                console.warn('خطا در بارگذاری از JSONBin، از localStorage استفاده می‌شود');
                return this.loadOrdersFromLocalStorage();
            }

            const data = await response.json();
            console.log('JSONBin data received:', data); // Debug
            
            // بررسی ساختار داده
            let orders = [];
            if (data.record) {
                if (Array.isArray(data.record.orders)) {
                    orders = data.record.orders;
                } else if (Array.isArray(data.record)) {
                    // اگر record خودش یک array است
                    orders = data.record;
                }
            }
            
            console.log('Orders from JSONBin:', orders.length); // Debug

            // همیشه localStorage را هم چک کن و merge کن
            const localOrders = this.loadOrdersFromLocalStorage();
            console.log('Orders from localStorage:', localOrders.length); // Debug
            
            // ترکیب سفارش‌ها (حذف duplicate بر اساس id)
            const allOrders = [...orders];
            localOrders.forEach(localOrder => {
                if (!allOrders.find(o => o.id === localOrder.id)) {
                    allOrders.push(localOrder);
                }
            });
            
            console.log('Total orders after merge:', allOrders.length); // Debug

            // ذخیره در localStorage برای sync
            if (allOrders.length > 0) {
                localStorage.setItem('combo_shop_orders', JSON.stringify(allOrders));
            }
            
            return allOrders;
        } catch (error) {
            console.error('خطا در بارگذاری سفارش‌ها از JSONBin:', error);
            return this.loadOrdersFromLocalStorage();
        }
    }

    /**
     * ذخیره سفارش‌ها در JSONBin
     */
    async saveOrders(orders) {
        if (!this.isConfigured) {
            // Fallback به localStorage
            localStorage.setItem('combo_shop_orders', JSON.stringify(orders));
            return true;
        }

        try {
            // ابتدا داده‌های فعلی را بخوان
            const currentData = await fetch(JSONBIN_URL + '/latest', {
                headers: {
                    'X-Master-Key': JSONBIN_API_KEY
                }
            }).then(res => res.ok ? res.json() : { record: {} });

            // محصولات را حفظ کن و فقط orders را به‌روزرسانی کن
            const products = currentData.record?.products || [];
            
            const response = await fetch(JSONBIN_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify({ 
                    products: products,
                    orders: orders 
                })
            });

            if (response.ok) {
                // همگام‌سازی با localStorage
                localStorage.setItem('combo_shop_orders', JSON.stringify(orders));
                return true;
            } else {
                throw new Error('خطا در ذخیره در JSONBin');
            }
        } catch (error) {
            console.error('خطا در ذخیره سفارش‌ها در JSONBin:', error);
            // Fallback به localStorage
            localStorage.setItem('combo_shop_orders', JSON.stringify(orders));
            return false;
        }
    }

    /**
     * بارگذاری سفارش‌ها از localStorage
     */
    loadOrdersFromLocalStorage() {
        const saved = localStorage.getItem('combo_shop_orders');
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

