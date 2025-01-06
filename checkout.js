// Product details
const products = {
    'basic': {
        name: 'Totolink X5000R',
        description: 'WiFi Router | WiFi6 AX1800 Dual Band, 5x RJ45 1000Mb/s',
        price: 37.11,
        brand: 'Totolink',
        code: 'X5000R',
        category: 'Accessories',
        image: 'https://giga.ly/ltd/wp-content/uploads/2024/06/329832_1.webp'
    },
    'pro': {
        name: 'Ubiquiti AF-5G30-S45',
        description: 'Directional antenna | airFiber Dish, 5GHz, 30dBi',
        price: 120.75,
        brand: 'Ubiquiti',
        code: 'AF-5G30-S45',
        category: 'UISP/Antennas',
        image: 'https://giga.ly/ltd/wp-content/uploads/2024/06/af-5g30-s45.jpg'
    },
    'ultimate': {
        name: 'Ubiquiti AG-HP-5G27',
        description: 'CPE | airGrid, 2,4GHz, 5GHz, 1x RJ45 100Mb/s, 27dBi',
        price: 72.45,
        brand: 'Ubiquiti',
        code: 'AG-HP-5G27',
        category: 'UISP/Antennas',
        image: 'https://giga.ly/ltd/wp-content/uploads/2024/06/gigavv-01-1000x938.webp'
    }
};

// Exchange rate
const USD_TO_LYD = 5;

// Check if user is logged in
function checkAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Get product ID from URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('product');
}

// Get user balance
function getUserBalance() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    return userData.balance || 0;
}

// Initialize checkout page
function initCheckout() {
    if (!checkAuth()) return;

    const productId = getProductIdFromUrl();
    if (!productId || !products[productId]) {
        window.location.href = 'index.html';
        return;
    }

    const product = products[productId];
    const priceInDinar = product.price * USD_TO_LYD;
    const userBalance = getUserBalance();
    const remaining = priceInDinar - userBalance;

    // Update product details
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productCode').textContent = `كود المنتج: ${product.code}`;
    document.getElementById('productBrand').textContent = `الماركة: ${product.brand}`;
    document.getElementById('productCategory').textContent = `الفئة: ${product.category}`;
    document.getElementById('productPrice').textContent = `$ ${product.price}`;
    document.getElementById('priceInDinar').textContent = `${priceInDinar.toFixed(2)} د.ل`;
    document.getElementById('currentBalance').textContent = `${userBalance.toFixed(2)} د.ل`;
    document.getElementById('requiredAmount').textContent = `${priceInDinar.toFixed(2)} د.ل`;
    document.getElementById('remainingAmount').textContent = `${Math.max(0, remaining).toFixed(2)} د.ل`;

    // Show/hide elements based on balance
    const insufficientBalance = document.getElementById('insufficientBalance');
    const confirmPurchaseBtn = document.getElementById('confirmPurchaseBtn');
    const remainingRow = document.getElementById('remainingRow');

    if (remaining > 0) {
        insufficientBalance.style.display = 'block';
        confirmPurchaseBtn.style.display = 'none';
        remainingRow.classList.add('negative');
    } else {
        insufficientBalance.style.display = 'none';
        confirmPurchaseBtn.style.display = 'block';
        remainingRow.classList.remove('negative');
    }

    // Add event listeners
    confirmPurchaseBtn.addEventListener('click', () => confirmPurchase(productId, product, priceInDinar));
    document.getElementById('cancelPurchaseBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Confirm purchase
function confirmPurchase(productId, product, priceInDinar) {
    const userData = JSON.parse(localStorage.getItem('user'));
    userData.balance -= priceInDinar;
    
    // Add to purchases
    if (!userData.purchases) {
        userData.purchases = [];
    }
    userData.purchases.unshift({
        productName: product.name,
        productCode: product.code,
        price: priceInDinar,
        purchaseDate: new Date().toISOString()
    });

    localStorage.setItem('user', JSON.stringify(userData));

    // Add transaction record
    addTransaction({
        type: 'شراء منتج',
        productName: product.name,
        productCode: product.code,
        amount: priceInDinar,
        date: new Date(),
        status: 'مكتمل'
    });

    showMessage('تم شراء المنتج بنجاح!', 'success');
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
}

// Add transaction to history
function addTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Show message to user
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Remove any existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', initCheckout);
