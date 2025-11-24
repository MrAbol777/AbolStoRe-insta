// ============================================
// نسخه به‌روزرسانی شده admin.js با Firebase
// ============================================

// این فایل را به admin.js کپی کنید یا مستقیماً admin.js را ویرایش کنید

/**
 * بارگذاری محصولات از Firebase
 */
async function loadProducts() {
    // اول از Firebase بخوان (اگر فعال باشد)
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

/**
 * ذخیره محصولات در Firebase
 */
async function saveProducts() {
    // ذخیره در Firebase (اگر فعال باشد)
    if (typeof firebaseService !== 'undefined') {
        await firebaseService.saveProducts(products);
    } else {
        // Fallback: localStorage
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
}

/**
 * بارگذاری سفارش‌ها از Firebase
 */
function loadOrders() {
    // اول از Firebase بخوان (اگر فعال باشد)
    if (typeof firebaseService !== 'undefined') {
        firebaseService.loadOrders().then(ordersData => {
            orders = ordersData;
            renderOrders();
        });
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

/**
 * ذخیره محصول در Firebase
 */
async function saveProduct(event) {
    event.preventDefault();
    
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

    // ذخیره در Firebase
    await saveProducts();
    renderProducts();
    closeModal('productModal');
    event.target.reset();
}

/**
 * به‌روزرسانی وضعیت سفارش در Firebase
 */
async function updateOrderStatus(id, status) {
    // به‌روزرسانی در Firebase (اگر فعال باشد)
    if (typeof firebaseService !== 'undefined') {
        await firebaseService.updateOrderStatus(id, status);
    } else {
        // Fallback: localStorage
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = status;
            saveOrders();
        }
    }
    
    renderOrders();
}

