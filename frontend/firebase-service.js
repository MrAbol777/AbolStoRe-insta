// ============================================
// سرویس Firebase برای همگام‌سازی محصولات
// ============================================

class FirebaseService {
    constructor() {
        this.db = null;
        this.productsRef = null;
        this.ordersRef = null;
        
        // بررسی اینکه Firebase لود شده یا نه
        if (typeof firebase !== 'undefined' && firebase.database) {
            this.db = firebase.database();
            this.productsRef = this.db.ref('products');
            this.ordersRef = this.db.ref('orders');
        } else {
            console.warn('Firebase SDK لود نشده است. از localStorage استفاده می‌شود.');
        }
    }

    // ============================================
    // مدیریت محصولات
    // ============================================

    /**
     * بارگذاری محصولات از Firebase
     */
    async loadProducts() {
        if (!this.productsRef) {
            // Fallback به localStorage
            return this.loadProductsFromLocalStorage();
        }

        try {
            const snapshot = await this.productsRef.once('value');
            const products = snapshot.val();
            
            if (products) {
                // تبدیل object به array
                const productsArray = Object.values(products);
                // همگام‌سازی با localStorage
                localStorage.setItem('combo_shop_products', JSON.stringify(productsArray));
                return productsArray;
            } else {
                // اگر در Firebase نبود، از localStorage بخوان
                return this.loadProductsFromLocalStorage();
            }
        } catch (error) {
            console.error('خطا در بارگذاری از Firebase:', error);
            return this.loadProductsFromLocalStorage();
        }
    }

    /**
     * ذخیره محصولات در Firebase
     */
    async saveProducts(products) {
        if (!this.productsRef) {
            // Fallback به localStorage
            localStorage.setItem('combo_shop_products', JSON.stringify(products));
            return true;
        }

        try {
            // تبدیل array به object با key = id
            const productsObject = {};
            products.forEach(product => {
                productsObject[product.id] = product;
            });

            await this.productsRef.set(productsObject);
            
            // همگام‌سازی با localStorage
            localStorage.setItem('combo_shop_products', JSON.stringify(products));
            
            return true;
        } catch (error) {
            console.error('خطا در ذخیره در Firebase:', error);
            // Fallback به localStorage
            localStorage.setItem('combo_shop_products', JSON.stringify(products));
            return false;
        }
    }

    /**
     * گوش دادن به تغییرات Real-time
     */
    onProductsChange(callback) {
        if (!this.productsRef) {
            return;
        }

        this.productsRef.on('value', (snapshot) => {
            const products = snapshot.val();
            if (products) {
                const productsArray = Object.values(products);
                localStorage.setItem('combo_shop_products', JSON.stringify(productsArray));
                callback(productsArray);
            }
        });
    }

    /**
     * قطع کردن گوش دادن به تغییرات
     */
    offProductsChange() {
        if (this.productsRef) {
            this.productsRef.off();
        }
    }

    // ============================================
    // مدیریت سفارش‌ها
    // ============================================

    /**
     * بارگذاری سفارش‌ها از Firebase
     */
    async loadOrders() {
        if (!this.ordersRef) {
            return this.loadOrdersFromLocalStorage();
        }

        try {
            const snapshot = await this.ordersRef.once('value');
            const orders = snapshot.val();
            
            if (orders) {
                const ordersArray = Object.values(orders);
                localStorage.setItem('combo_shop_orders', JSON.stringify(ordersArray));
                return ordersArray;
            } else {
                return this.loadOrdersFromLocalStorage();
            }
        } catch (error) {
            console.error('خطا در بارگذاری سفارش‌ها:', error);
            return this.loadOrdersFromLocalStorage();
        }
    }

    /**
     * ذخیره سفارش در Firebase
     */
    async saveOrder(order) {
        if (!this.ordersRef) {
            const orders = this.loadOrdersFromLocalStorage();
            orders.push(order);
            localStorage.setItem('combo_shop_orders', JSON.stringify(orders));
            return true;
        }

        try {
            await this.ordersRef.child(order.id).set(order);
            
            const orders = this.loadOrdersFromLocalStorage();
            orders.push(order);
            localStorage.setItem('combo_shop_orders', JSON.stringify(orders));
            
            return true;
        } catch (error) {
            console.error('خطا در ذخیره سفارش:', error);
            const orders = this.loadOrdersFromLocalStorage();
            orders.push(order);
            localStorage.setItem('combo_shop_orders', JSON.stringify(orders));
            return false;
        }
    }

    /**
     * به‌روزرسانی وضعیت سفارش
     */
    async updateOrderStatus(orderId, status) {
        if (!this.ordersRef) {
            const orders = this.loadOrdersFromLocalStorage();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.status = status;
                localStorage.setItem('combo_shop_orders', JSON.stringify(orders));
            }
            return true;
        }

        try {
            await this.ordersRef.child(orderId).update({ status });
            
            const orders = this.loadOrdersFromLocalStorage();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.status = status;
                localStorage.setItem('combo_shop_orders', JSON.stringify(orders));
            }
            
            return true;
        } catch (error) {
            console.error('خطا در به‌روزرسانی سفارش:', error);
            return false;
        }
    }

    // ============================================
    // Helper Functions
    // ============================================

    loadProductsFromLocalStorage() {
        const saved = localStorage.getItem('combo_shop_products');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }

    loadOrdersFromLocalStorage() {
        const saved = localStorage.getItem('combo_shop_orders');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }
}

// ایجاد instance سراسری
const firebaseService = new FirebaseService();

