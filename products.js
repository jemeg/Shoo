// Product details
const products = {
    'basic': {
        name: 'Totolink X5000R',
        description: 'WiFi Router | WiFi6 AX1800 Dual Band, 5x RJ45 1000Mb/s',
        price: 37.11,
        brand: 'Totolink',
        code: 'X5000R',
        category: 'Accessories'
    },
    'pro': {
        name: 'Ubiquiti AF-5G30-S45',
        description: 'Directional antenna | airFiber Dish, 5GHz, 30dBi',
        price: 120.75,
        brand: 'Ubiquiti',
        code: 'AF-5G30-S45',
        category: 'UISP/Antennas'
    },
    'ultimate': {
        name: 'Ubiquiti AG-HP-5G27',
        description: 'CPE | airGrid, 2,4GHz, 5GHz, 1x RJ45 100Mb/s, 27dBi',
        price: 72.45,
        brand: 'Ubiquiti',
        code: 'AG-HP-5G27',
        category: 'UISP/Antennas'
    }
};

// Check if user is logged in
function checkAuth() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Get user balance
function getUserBalance() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    return userData.balance || 0;
}

// Handle product purchase button click
function handlePurchaseClick(productId) {
    if (!checkAuth()) {
        showMessage('يرجى تسجيل الدخول أولاً', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Redirect to checkout page
    window.location.href = `checkout.html?product=${productId}`;
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

// Initialize purchase buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all purchase buttons
    const purchaseButtons = document.querySelectorAll('[data-package]');
    purchaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-package');
            handlePurchaseClick(productId);
        });
    });
});
