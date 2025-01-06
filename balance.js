// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Load user balance
function loadBalance() {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        document.getElementById('userBalance').textContent = `${userData.balance.toFixed(2)} د.ل`;
        
        // Update avatar in nav
        const avatars = document.querySelectorAll('.user-avatar');
        avatars.forEach(avatar => {
            avatar.src = userData.avatar;
        });
    }
}

// Simulated card database
const usedCards = new Set(JSON.parse(localStorage.getItem('usedCards') || '[]'));

// Simulated card values (in a real system, this would be on the server)
const cardValues = {
    // Madar cards (example format: 1234567890123456)
    'madar': {
        '1234567890123456': { value: 50, pin: '1234' },
        '9876543210987654': { value: 100, pin: '4321' }
    },
    // Libyana cards (example format: 12345678901234)
    'libyana': {
        '12345678901234': { value: 25, pin: '1234' },
        '98765432109876': { value: 75, pin: '4321' }
    }
};

// Validate card format
function validateCardFormat(cardNumber, type) {
    const patterns = {
        'madar': /^\d{16}$/,  // 16 digits for Madar
        'libyana': /^\d{14}$/  // 14 digits for Libyana
    };
    
    return patterns[type].test(cardNumber);
}

// Check if card has been used before
function isCardUsed(cardNumber) {
    return usedCards.has(cardNumber);
}

// Mark card as used
function markCardAsUsed(cardNumber) {
    usedCards.add(cardNumber);
    localStorage.setItem('usedCards', JSON.stringify([...usedCards]));
}

// Verify card details
function verifyCard(cardNumber, pin, type) {
    // Check if card exists in our database
    const cardDatabase = cardValues[type];
    const cardData = cardDatabase[cardNumber];
    
    if (!cardData) {
        return { valid: false, message: 'رقم البطاقة غير صالح' };
    }
    
    if (cardData.pin !== pin) {
        return { valid: false, message: 'رقم التعريف غير صحيح' };
    }
    
    return { valid: true, value: cardData.value };
}

// Handle payment selection
function selectPayment(method) {
    // Here you would typically show a payment form or redirect to payment gateway
    alert('جاري تحويلك إلى بوابة الدفع...');
}

// Handle Madar card form submission
document.getElementById('madarForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const cardNumber = this.querySelector('input[type="text"]').value;
    const pin = this.querySelector('input[type="password"]').value;
    
    // Validate card format
    if (!validateCardFormat(cardNumber, 'madar')) {
        alert('رقم البطاقة غير صحيح. يجب أن يتكون من 16 رقم');
        return;
    }
    
    // Check if card has been used before
    if (isCardUsed(cardNumber)) {
        alert('هذه البطاقة تم استخدامها من قبل');
        return;
    }
    
    // Verify card
    const verification = verifyCard(cardNumber, pin, 'madar');
    if (!verification.valid) {
        alert(verification.message);
        return;
    }
    
    // Process payment
    addBalance(verification.value);
    markCardAsUsed(cardNumber);
    alert(`تم شحن ${verification.value} د.ل بنجاح`);
    this.reset();
});

// Handle Libyana card form submission
document.getElementById('libyanaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const cardNumber = this.querySelector('input[type="text"]').value;
    const pin = this.querySelector('input[type="password"]').value;
    
    // Validate card format
    if (!validateCardFormat(cardNumber, 'libyana')) {
        alert('رقم البطاقة غير صحيح. يجب أن يتكون من 14 رقم');
        return;
    }
    
    // Check if card has been used before
    if (isCardUsed(cardNumber)) {
        alert('هذه البطاقة تم استخدامها من قبل');
        return;
    }
    
    // Verify card
    const verification = verifyCard(cardNumber, pin, 'libyana');
    if (!verification.valid) {
        alert(verification.message);
        return;
    }
    
    // Process payment
    addBalance(verification.value);
    markCardAsUsed(cardNumber);
    alert(`تم شحن ${verification.value} د.ل بنجاح`);
    this.reset();
});

// Add balance to user account
function addBalance(amount) {
    const userData = JSON.parse(localStorage.getItem('user'));
    userData.balance += amount;
    localStorage.setItem('user', JSON.stringify(userData));
    loadBalance();
    
    // Add transaction to history
    addTransaction({
        date: new Date(),
        amount: amount,
        type: 'شحن رصيد',
        status: 'مكتمل',
        cardNumber: '****' // Last 4 digits in production
    });
}

// Add transaction to history
function addTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadTransactions();
}

// Load transaction history
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const container = document.querySelector('.transactions');
    
    container.innerHTML = transactions.map(t => `
        <div class="transaction">
            <div class="transaction-date">${new Date(t.date).toLocaleDateString('ar-LY')}</div>
            <div class="transaction-type">${t.type}</div>
            <div class="transaction-amount">${t.amount.toFixed(2)} د.ل</div>
            <div class="transaction-status">${t.status}</div>
        </div>
    `).join('');
}

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
});

// Initialize page
checkAuth();
loadBalance();
loadTransactions();
