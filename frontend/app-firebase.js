// ============================================
// نسخه به‌روزرسانی شده app.js با Firebase
// ============================================

// این فایل را به app.js کپی کنید یا مستقیماً app.js را ویرایش کنید

/**
 * بارگذاری محصولات از Firebase یا fallback
 */
async function loadProducts() {
    try {
        // اول از Firebase بخوان (اگر فعال باشد)
        if (typeof firebaseService !== 'undefined') {
            products = await firebaseService.loadProducts();
            
            // اگر محصولی در Firebase نبود، از products.json بخوان
            if (products.length === 0) {
                const response = await fetch('products.json');
                if (response.ok) {
                    products = await response.json();
                    // ذخیره در Firebase برای دفعات بعد
                    await firebaseService.saveProducts(products);
                }
            }
            
            renderProducts();
            
            // گوش دادن به تغییرات Real-time
            firebaseService.onProductsChange((updatedProducts) => {
                products = updatedProducts;
                renderProducts();
                showNotification('🔄 محصولات به‌روزرسانی شدند!');
            });
            
            return;
        }
        
        // Fallback: از localStorage بخوان
        const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            renderProducts();
            return;
        }

        // Fallback: از فایل JSON بخوان
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('خطا در بارگذاری محصولات');
        }
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('خطا:', error);
        document.getElementById('productsGrid').innerHTML = 
            '<div class="loading" style="color: #ff0066;">خطا در بارگذاری محصولات. لطفاً صفحه را رفرش کنید.</div>';
    }
}

// ============================================
// به‌روزرسانی تابع submitOrder برای ذخیره در Firebase
// ============================================

async function confirmPayment() {
    if (!window.pendingOrder) return;

    const orderData = window.pendingOrder;

    // ذخیره در Firebase (اگر فعال باشد)
    if (typeof firebaseService !== 'undefined') {
        await firebaseService.saveOrder(orderData);
    } else {
        // Fallback: localStorage
        const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
        orders.push(orderData);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }

    // ساخت متن سفارش برای ارسال به Formspree
    const orderText = createOrderText(orderData);

    // ارسال به Formspree
    await sendToFormspree(orderData, orderText);

    // پاک کردن سبد خرید
    cart = [];
    saveCart();

    // نمایش موفقیت
    showOrderSuccess(orderData);

    // بستن modal پرداخت
    closeModal('paymentModal');
    window.pendingOrder = null;
}

