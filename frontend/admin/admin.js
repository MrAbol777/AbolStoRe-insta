// ============================================
// پنل مدیریت - فایل JavaScript
// ============================================

// کلیدهای localStorage
const PRODUCTS_STORAGE_KEY = 'combo_shop_products';
const ORDERS_STORAGE_KEY = 'combo_shop_orders';
const ADMIN_SESSION_KEY = 'combo_admin_session';

// متغیرهای سراسری
let products = [];
let orders = [];
let currentDeleteId = null;
let currentDeleteType = null; // 'product' or 'order'

// ============================================
// بررسی دسترسی
// ============================================

function checkAuth() {
    if (localStorage.getItem(ADMIN_SESSION_KEY) !== 'true') {
        window.location.href = 'index.html';
    }
}

// ============================================
// بارگذاری داده‌ها
// ============================================

async function loadProducts() {
    // اول از JSONBin بخوان (اگر فعال باشد) - ساده‌تر از Firebase
    if (typeof jsonbinService !== 'undefined' && jsonbinService.isActive()) {
        products = await jsonbinService.loadProducts();
        
        // اگر خالی بود، از products.json بخوان
        if (products.length === 0) {
            try {
                const response = await fetch('../products.json');
                if (response.ok) {
                    products = await response.json();
                    await jsonbinService.saveProducts(products);
                }
            } catch (error) {
                console.error('خطا در بارگذاری محصولات:', error);
            }
        }
        
        renderProducts();
        return;
    }
    
    // دوم از Firebase بخوان (اگر فعال باشد)
    if (typeof firebaseService !== 'undefined') {
        products = await firebaseService.loadProducts();
        
        // اگر خالی بود، از products.json بخوان
        if (products.length === 0) {
            try {
                const response = await fetch('../products.json');
                if (response.ok) {
                    products = await response.json();
                    // ذخیره در Firebase
                    await firebaseService.saveProducts(products);
                }
            } catch (error) {
                console.error('خطا در بارگذاری محصولات:', error);
            }
        }
        
        renderProducts();
        
        // گوش دادن به تغییرات Real-time
        firebaseService.onProductsChange((updatedProducts) => {
            products = updatedProducts;
            renderProducts();
        });
        
        return;
    }
    
    // Fallback: از localStorage بخوان
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // اگر نبود، از فایل JSON بخوان
        try {
            const response = await fetch('../products.json');
            if (response.ok) {
                products = await response.json();
                saveProducts();
            }
        } catch (error) {
            console.error('خطا در بارگذاری محصولات:', error);
        }
    }
    renderProducts();
}

async function loadOrders() {
    // اول از Firebase بخوان (اگر فعال باشد)
    if (typeof firebaseService !== 'undefined') {
        orders = await firebaseService.loadOrders();
        renderOrders();
        return;
    }
    
    // Fallback: از localStorage بخوان
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        orders = [];
    }
    renderOrders();
}

async function saveProducts() {
    // اول JSONBin را امتحان کن (ساده‌تر)
    if (typeof jsonbinService !== 'undefined' && jsonbinService.isActive()) {
        await jsonbinService.saveProducts(products);
        return;
    }
    
    // دوم Firebase را امتحان کن
    if (typeof firebaseService !== 'undefined') {
        await firebaseService.saveProducts(products);
    } else {
        // Fallback: localStorage
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
}

function saveOrders() {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

// ============================================
// رندر کردن محصولات
// ============================================

function renderProducts() {
    const productsList = document.getElementById('productsList');
    
    if (products.length === 0) {
        productsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <p>هیچ محصولی وجود ندارد</p>
            </div>
        `;
        return;
    }

    productsList.innerHTML = products.map(product => `
        <div class="product-card-admin">
            <div class="product-card-header">
                <h3 class="product-card-title">${product.title}</h3>
                <div class="product-card-actions">
                    <button class="btn btn-primary" style="padding: 8px 15px; flex: 0;" 
                            onclick="editProduct(${product.id})">✏️ ویرایش</button>
                    <button class="btn btn-danger" style="padding: 8px 15px; flex: 0;" 
                            onclick="deleteProduct(${product.id})">🗑️ حذف</button>
                </div>
            </div>
            <p class="product-card-info">${product.shortDescription}</p>
            <div class="product-card-price">${formatPrice(product.price)} تومان</div>
            <ul class="product-card-items">
                ${product.items.slice(0, 3).map(item => `<li>${item}</li>`).join('')}
                ${product.items.length > 3 ? '<li>...</li>' : ''}
            </ul>
        </div>
    `).join('');
}

// ============================================
// رندر کردن سفارش‌ها
// ============================================

function renderOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>هیچ سفارشی وجود ندارد</p>
            </div>
        `;
        return;
    }

    // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
    const sortedOrders = [...orders].sort((a, b) => b.id - a.id);

    ordersList.innerHTML = sortedOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">شناسه سفارش: ${order.id}</div>
                    <div class="order-date">${order.date}</div>
                </div>
                <button class="btn btn-danger" style="padding: 8px 15px; flex: 0;" 
                        onclick="deleteOrder(${order.id})">🗑️ حذف</button>
            </div>
            <div class="order-info">
                <div class="info-item">
                    <span class="info-label">نام مشتری:</span>
                    <span class="info-value">${order.fullName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">شماره تماس:</span>
                    <span class="info-value">${order.phone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">تلگرام:</span>
                    <span class="info-value">${order.telegram}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">یادداشت:</span>
                    <span class="info-value">${order.notes}</span>
                </div>
            </div>
            <div class="order-items">
                <div class="order-items-title">محصولات:</div>
                ${order.cart.map(item => `
                    <div class="order-item">
                        <span>${item.title} (${item.quantity} عدد)</span>
                        <span>${formatPrice(item.price * item.quantity)} تومان</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <span class="order-total-label">جمع کل:</span>
                <span class="order-total-value">${formatPrice(order.total)} تومان</span>
            </div>
            <div class="order-footer">
                <div class="order-status">
                    <span class="info-label">وضعیت:</span>
                    <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                        <option value="در انتظار" ${order.status === 'در انتظار' ? 'selected' : ''}>در انتظار</option>
                        <option value="تکمیل شده" ${order.status === 'تکمیل شده' ? 'selected' : ''}>تکمیل شده</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// مدیریت محصولات
// ============================================

function addProduct() {
    console.log('addProduct called'); // Debug
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const form = document.getElementById('productForm');
    const productId = document.getElementById('productId');
    
    if (!modal || !title || !form || !productId) {
        console.error('Modal elements not found!', { modal, title, form, productId });
        alert('خطا: المان‌های modal پیدا نشدند. لطفاً صفحه را refresh کنید.');
        return;
    }
    
    title.textContent = 'افزودن محصول جدید';
    form.reset();
    productId.value = '';
    modal.classList.add('active');
    console.log('Modal opened'); // Debug
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = 'ویرایش محصول';
    document.getElementById('productId').value = product.id;
    document.getElementById('productTitle').value = product.title;
    document.getElementById('productShortDesc').value = product.shortDescription;
    document.getElementById('productDesc').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productItems').value = product.items.join('\n');
    
    document.getElementById('productModal').classList.add('active');
}

function deleteProduct(id) {
    currentDeleteId = id;
    currentDeleteType = 'product';
    document.getElementById('deleteModal').classList.add('active');
}

function confirmDelete() {
    if (currentDeleteType === 'product') {
        products = products.filter(p => p.id !== currentDeleteId);
        saveProducts();
        renderProducts();
    } else if (currentDeleteType === 'order') {
        orders = orders.filter(o => o.id !== currentDeleteId);
        saveOrders();
        renderOrders();
    }
    
    closeModal('deleteModal');
    currentDeleteId = null;
    currentDeleteType = null;
}

async function saveProduct(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const id = parseInt(formData.get('id')) || Date.now();
        const title = formData.get('title');
        const shortDescription = formData.get('shortDescription');
        const description = formData.get('description');
        const price = parseInt(formData.get('price'));
        const image = formData.get('image');
        const items = formData.get('items').split('\n').filter(item => item.trim() !== '');

        if (!title || !shortDescription || !description || !price || !image || items.length === 0) {
            alert('لطفاً تمام فیلدها را پر کنید.');
            return;
        }

        const product = {
            id: id,
            title: title,
            shortDescription: shortDescription,
            description: description,
            price: price,
            image: image,
            items: items
        };

        const existingIndex = products.findIndex(p => p.id === id);
        if (existingIndex >= 0) {
            products[existingIndex] = product;
        } else {
            products.push(product);
        }

        // ذخیره در JSONBin یا Firebase
        await saveProducts();
        renderProducts();
        closeModal('productModal');
        event.target.reset();
        
        // نمایش پیام موفقیت
        alert('محصول با موفقیت ذخیره شد!');
    } catch (error) {
        console.error('خطا در ذخیره محصول:', error);
        alert('خطا در ذخیره محصول. لطفاً دوباره تلاش کنید.');
    }
}

// ============================================
// مدیریت سفارش‌ها
// ============================================

function deleteOrder(id) {
    currentDeleteId = id;
    currentDeleteType = 'order';
    document.getElementById('deleteModal').classList.add('active');
}

async function updateOrderStatus(id, status) {
    try {
        // به‌روزرسانی در Firebase (اگر فعال باشد)
        if (typeof firebaseService !== 'undefined') {
            await firebaseService.updateOrderStatus(id, status);
        }
        
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = status;
            saveOrders();
            renderOrders();
        }
    } catch (error) {
        console.error('خطا در به‌روزرسانی وضعیت:', error);
        // Fallback: فقط localStorage
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = status;
            saveOrders();
            renderOrders();
        }
    }
}

// ============================================
// مدیریت صفحات
// ============================================

async function switchPage(page) {
    try {
        // مخفی کردن همه صفحات
        document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        // نمایش صفحه انتخاب شده
        if (page === 'products') {
            document.getElementById('productsPage').classList.add('active');
            const productsLink = document.querySelector('[data-page="products"]');
            if (productsLink) productsLink.classList.add('active');
            await loadProducts();
        } else if (page === 'orders') {
            document.getElementById('ordersPage').classList.add('active');
            const ordersLink = document.querySelector('[data-page="orders"]');
            if (ordersLink) ordersLink.classList.add('active');
            await loadOrders();
        }
    } catch (error) {
        console.error('خطا در switchPage:', error);
    }
}

// ============================================
// تابع‌های کمکی
// ============================================

function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function logout() {
    if (confirm('آیا می‌خواهید خارج شوید؟')) {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.href = 'index.html';
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            switchPage(page);
        });
    });

    // دکمه افزودن محصول
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add product button clicked'); // Debug
            addProduct();
        });
        console.log('Add product button listener attached'); // Debug
    } else {
        console.error('Add product button not found!');
    }

    // فرم محصول
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', saveProduct);
    } else {
        console.error('Product form not found!');
    }

    // بستن Modal‌ها
    const closeProductModal = document.getElementById('closeProductModal');
    if (closeProductModal) {
        closeProductModal.addEventListener('click', () => closeModal('productModal'));
    }
    
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', () => closeModal('productModal'));
    }
    
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => closeModal('deleteModal'));
    }

    // بستن Modal با کلیک روی پس‌زمینه
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    } else {
        console.error('Logout button not found!');
    }
}

// ============================================
// راه‌اندازی اولیه
// ============================================

async function init() {
    try {
        console.log('Admin init started'); // Debug
        checkAuth();
        
        // کمی تاخیر برای اطمینان از لود شدن DOM
        setTimeout(async () => {
            try {
                setupEventListeners();
                await switchPage('products');
                console.log('Admin init completed'); // Debug
            } catch (error) {
                console.error('خطا در init:', error);
                alert('خطا در بارگذاری پنل. لطفاً صفحه را refresh کنید.');
            }
        }, 100);
    } catch (error) {
        console.error('خطا در init:', error);
        alert('خطا در بارگذاری پنل. لطفاً صفحه را refresh کنید.');
    }
}

// اجرای تابع init هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', init);

