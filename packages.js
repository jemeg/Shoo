// Package prices and details
const packages = {
    'basic': {
        name: 'باقة السرعة القصوى',
        speed: '1 Gbps',
        price: 100,
        features: ['إنترنت لا محدود', 'تركيب مجاني', 'دعم فني 24/7']
    },
    'pro': {
        name: 'الباقة الاحترافية',
        speed: '5 Gbps',
        price: 250,
        features: ['إنترنت لا محدود', 'تركيب مجاني', 'دعم فني 24/7', 'أولوية الدعم الفني']
    },
    'ultimate': {
        name: 'الباقة الأقصى',
        speed: '10 Gbps',
        price: 500,
        features: ['إنترنت لا محدود', 'تركيب مجاني', 'دعم فني 24/7', 'أولوية الدعم الفني', 'IP ثابت']
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

// Handle package purchase button click
function handlePurchaseClick(packageId) {
    if (!checkAuth()) {
        showMessage('يرجى تسجيل الدخول أولاً', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    const selectedPackage = packages[packageId];
    showConfirmationModal(packageId, selectedPackage);
}

// Show confirmation modal
function showConfirmationModal(packageId, packageDetails) {
    const modalHTML = `
        <div class="modal" id="confirmationModal">
            <div class="modal-content">
                <h3>تأكيد شراء الباقة</h3>
                <div class="package-details">
                    <h4>${packageDetails.name}</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="label">السرعة:</span>
                            <span class="value">${packageDetails.speed}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">السعر:</span>
                            <span class="value">${packageDetails.price} د.ل/شهر</span>
                        </div>
                    </div>
                    <div class="features-list">
                        <h5>المميزات:</h5>
                        <ul>
                            ${packageDetails.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button onclick="confirmPurchase('${packageId}')" class="btn">تأكيد الشراء</button>
                    <button onclick="closeConfirmationModal()" class="btn btn-secondary">إلغاء</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close confirmation modal
function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.remove();
    }
}

// Confirm purchase
function confirmPurchase(packageId) {
    const selectedPackage = packages[packageId];
    const userBalance = getUserBalance();

    if (userBalance < selectedPackage.price) {
        closeConfirmationModal();
        const remaining = selectedPackage.price - userBalance;
        showMessage(`رصيدك غير كافٍ. المبلغ الناقص: ${remaining} د.ل`, 'error');
        showRechargeModal(remaining);
        return;
    }

    // Process purchase
    const userData = JSON.parse(localStorage.getItem('user'));
    userData.balance -= selectedPackage.price;
    userData.currentPackage = {
        name: selectedPackage.name,
        speed: selectedPackage.speed,
        purchaseDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    localStorage.setItem('user', JSON.stringify(userData));

    // Add transaction record
    addTransaction({
        type: 'شراء باقة',
        packageName: selectedPackage.name,
        amount: selectedPackage.price,
        date: new Date(),
        status: 'مكتمل'
    });

    closeConfirmationModal();
    showMessage('تم شراء الباقة بنجاح!', 'success');
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

// Show recharge modal
function showRechargeModal(amount) {
    const modalHTML = `
        <div class="modal" id="rechargeModal">
            <div class="modal-content">
                <h3>رصيد غير كافٍ</h3>
                <p>المبلغ الناقص: ${amount} د.ل</p>
                <div class="modal-buttons">
                    <button onclick="window.location.href='balance.html'" class="btn">شحن الرصيد</button>
                    <button onclick="closeRechargeModal()" class="btn btn-secondary">إلغاء</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close recharge modal
function closeRechargeModal() {
    const modal = document.getElementById('rechargeModal');
    if (modal) {
        modal.remove();
    }
}

// Initialize purchase buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all purchase buttons
    const purchaseButtons = document.querySelectorAll('[data-package]');
    purchaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageId = this.getAttribute('data-package');
            handlePurchaseClick(packageId);
        });
    });
});
