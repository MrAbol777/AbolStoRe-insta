// ============================================
// فروشگاه کمبو گیمینگ - فایل JavaScript اصلی
// ============================================

// متغیرهای سراسری
let products = [];
let cart = [];

// کلیدهای localStorage
const CART_STORAGE_KEY = 'combo_shop_cart';
const ORDERS_STORAGE_KEY = 'combo_shop_orders';
const PRODUCTS_STORAGE_KEY = 'combo_shop_products';

// تنظیمات پرداخت (قابل تغییر)
const PAYMENT_CONFIG = {
    cardNumber: '6037-9981-9893-7616',
    cardName: 'ابولفضل دوست گل'
};

// ============================================
// تابع‌های کمکی
// ============================================

/**
 * فرمت کردن قیمت به صورت تومان
 */
function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price);
}

/**
 * بارگذاری محصولات از فایل JSON یا localStorage
 */
async function loadProducts() {
    try {
        // اول سعی می‌کنیم از localStorage بخوانیم (اگر ادمین تغییر داده باشد)
        const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            renderProducts();
            return;
        }

        // اگر در localStorage نبود، از فایل JSON می‌خوانیم
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

/**
 * بارگذاری سبد خرید از localStorage
 */
function loadCart() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

/**
 * ذخیره سبد خرید در localStorage
 */
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
}

/**
 * به‌روزرسانی UI سبد خرید
 */
function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

// ============================================
// رندر کردن محصولات
// ============================================

/**
 * رندر کردن لیست محصولات
 */
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="loading">محصولی یافت نشد.</div>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image">
                📦
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.shortDescription}</p>
                <ul class="product-items">
                    ${product.items.slice(0, 3).map(item => `<li>${item}</li>`).join('')}
                    ${product.items.length > 3 ? '<li>...</li>' : ''}
                </ul>
                <div class="product-price">${formatPrice(product.price)} تومان</div>
                <div class="product-actions">
                    <button class="btn btn-primary gaming-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        افزودن به سبد
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Modal محصول
// ============================================

/**
 * باز کردن modal جزئیات محصول
 */
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="product-details">
            <div class="product-details-image">📦</div>
            <h2 class="product-details-title">${product.title}</h2>
            <p class="product-details-description">${product.description}</p>
            <div class="product-details-items">
                <h3>محتوای کمبو:</h3>
                <ul>
                    ${product.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="product-details-price">${formatPrice(product.price)} تومان</div>
            <button class="btn btn-primary gaming-btn" style="width: 100%; margin-top: 20px;" 
                    onclick="addToCart(${product.id}); closeModal('productModal')">
                افزودن به سبد خرید
            </button>
        </div>
    `;

    modal.classList.add('active');
}

/**
 * بستن modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// ============================================
// مدیریت سبد خرید
// ============================================

/**
 * افزودن محصول به سبد خرید
 */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    showNotification('محصول به سبد خرید اضافه شد!');
}

/**
 * نمایش notification
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #00ff88, #00d4ff);
        color: #0a0a0f;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

/**
 * باز کردن modal سبد خرید
 */
function openCartModal() {
    const modal = document.getElementById('cartModal');
    renderCart();
    modal.classList.add('active');
}

/**
 * رندر کردن محتوای سبد خرید
 */
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>سبد خرید شما خالی است</p>
            </div>
        `;
        cartTotal.textContent = '0';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${formatPrice(item.price)} تومان</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                    <div class="cart-item-total">${formatPrice(itemTotal)} تومان</div>
                    <button class="btn btn-danger" style="padding: 8px 15px; flex: 0;" 
                            onclick="removeFromCart(${item.id})">حذف</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.textContent = formatPrice(total);
}

/**
 * افزایش تعداد آیتم در سبد
 */
function increaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += 1;
        saveCart();
        renderCart();
    }
}

/**
 * کاهش تعداد آیتم در سبد
 */
function decreaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
        saveCart();
        renderCart();
    }
}

/**
 * حذف آیتم از سبد
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

// ============================================
// فرم سفارش
// ============================================

/**
 * باز کردن فرم سفارش
 */
function openOrderForm() {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است!');
        return;
    }

    closeModal('cartModal');
    const cartData = document.getElementById('cartData');
    cartData.value = JSON.stringify(cart);
    const modal = document.getElementById('orderModal');
    modal.classList.add('active');
}

/**
 * ارسال فرم سفارش
 */
async function submitOrder(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // اعتبارسنجی
    const fullName = formData.get('fullName');
    const phone = formData.get('phone');
    const telegram = formData.get('telegram');

    if (!fullName || !phone || !telegram) {
        alert('لطفاً تمام فیلدهای ضروری را پر کنید.');
        return;
    }

    if (phone.length < 7) {
        alert('شماره تماس باید حداقل 7 رقم باشد.');
        return;
    }

    // ساخت داده‌های سفارش
    const orderData = {
        id: Date.now(),
        fullName: fullName,
        phone: phone,
        telegram: telegram,
        notes: formData.get('notes') || 'ندارد',
        cart: JSON.parse(formData.get('cartData')),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'در انتظار',
        date: new Date().toLocaleString('fa-IR')
    };

    // نمایش modal پرداخت
    showPaymentModal(orderData);
}

/**
 * نمایش modal پرداخت
 */
function showPaymentModal(orderData) {
    closeModal('orderModal');

    // نمایش اطلاعات کارت
    document.getElementById('cardNumber').textContent = PAYMENT_CONFIG.cardNumber;
    document.getElementById('cardName').textContent = PAYMENT_CONFIG.cardName;

    // ذخیره orderData در یک متغیر موقت برای استفاده در confirmPayment
    window.pendingOrder = orderData;

    const modal = document.getElementById('paymentModal');
    modal.classList.add('active');
}

/**
 * تأیید پرداخت و ثبت نهایی سفارش
 */
async function confirmPayment() {
    if (!window.pendingOrder) return;

    const orderData = window.pendingOrder;

    // ذخیره در localStorage
    const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    orders.push(orderData);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

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

/**
 * ساخت متن سفارش
 */
function createOrderText(orderData) {
    let text = `سفارش جدید از فروشگاه کمبو گیمینگ\n\n`;
    text += `شناسه سفارش: ${orderData.id}\n`;
    text += `تاریخ: ${orderData.date}\n\n`;
    text += `اطلاعات مشتری:\n`;
    text += `نام: ${orderData.fullName}\n`;
    text += `شماره تماس: ${orderData.phone}\n`;
    text += `تلگرام: ${orderData.telegram}\n`;
    text += `یادداشت: ${orderData.notes}\n\n`;
    text += `محصولات:\n`;
    orderData.cart.forEach(item => {
        text += `- ${item.title} (${item.quantity} عدد) - ${formatPrice(item.price * item.quantity)} تومان\n`;
    });
    text += `\nجمع کل: ${formatPrice(orderData.total)} تومان\n`;
    text += `وضعیت: ${orderData.status}`;
    return text;
}

/**
 * ارسال به Formspree
 */
async function sendToFormspree(orderData, orderText) {
    // توجه: باید آدرس Formspree خود را جایگزین کنید
    // برای دریافت آدرس: https://formspree.io → ساخت فرم جدید → کپی کردن endpoint
    const formspreeUrl = 'https://formspree.io/f/XXXXX'; // TODO: جایگزین کنید با آدرس Formspree خود
    
    try {
        const response = await fetch(formspreeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _subject: `سفارش جدید از ${orderData.fullName} - ${orderData.id}`,
                message: orderText,
                _replyto: orderData.telegram
            })
        });

        if (!response.ok) {
            throw new Error('خطا در ارسال');
        }
    } catch (error) {
        console.error('خطا در ارسال به Formspree:', error);
        // در صورت خطا، فقط در console لاگ می‌شود
        // سفارش در localStorage ذخیره شده است
    }
}

/**
 * نمایش موفقیت سفارش
 */
function showOrderSuccess(orderData) {
    const summary = document.getElementById('orderSummary');
    summary.innerHTML = `
        <h3>خلاصه سفارش:</h3>
        <div class="order-summary-item">
            <span>شناسه سفارش:</span>
            <span>${orderData.id}</span>
        </div>
        <div class="order-summary-item">
            <span>نام:</span>
            <span>${orderData.fullName}</span>
        </div>
        <div class="order-summary-item">
            <span>شماره تماس:</span>
            <span>${orderData.phone}</span>
        </div>
        <div class="order-summary-item">
            <span>تلگرام:</span>
            <span>${orderData.telegram}</span>
        </div>
        ${orderData.cart.map(item => `
            <div class="order-summary-item">
                <span>${item.title} (${item.quantity} عدد)</span>
                <span>${formatPrice(item.price * item.quantity)} تومان</span>
            </div>
        `).join('')}
        <div class="order-summary-item">
            <span>جمع کل:</span>
            <span>${formatPrice(orderData.total)} تومان</span>
        </div>
    `;

    const successModal = document.getElementById('successModal');
    successModal.classList.add('active');
}

// ============================================
// Event Listeners
// ============================================

/**
 * راه‌اندازی Event Listeners
 */
function setupEventListeners() {
    // دکمه سبد خرید
    document.getElementById('cartBtn').addEventListener('click', openCartModal);

    // بستن Modal‌ها
    document.getElementById('closeModal').addEventListener('click', () => closeModal('productModal'));
    document.getElementById('closeCartModal').addEventListener('click', () => closeModal('cartModal'));
    document.getElementById('closeOrderModal').addEventListener('click', () => closeModal('orderModal'));
    document.getElementById('closePaymentModal').addEventListener('click', () => closeModal('paymentModal'));
    document.getElementById('closeSuccessModal').addEventListener('click', () => closeModal('successModal'));
    document.getElementById('closeSuccessBtn').addEventListener('click', () => closeModal('successModal'));
    document.getElementById('cancelOrderBtn').addEventListener('click', () => closeModal('orderModal'));

    // بستن Modal با کلیک روی پس‌زمینه
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // فرم سفارش
    document.getElementById('orderForm').addEventListener('submit', submitOrder);

    // دکمه ثبت سفارش در سبد
    document.getElementById('checkoutBtn').addEventListener('click', openOrderForm);

    // دکمه تأیید پرداخت
    document.getElementById('confirmPaymentBtn').addEventListener('click', confirmPayment);
}

// ============================================
// راه‌اندازی اولیه
// ============================================

/**
 * تابع اصلی راه‌اندازی
 */
async function init() {
    await loadProducts();
    loadCart();
    setupEventListeners();
}

// اجرای تابع init هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', init);
