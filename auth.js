// Toggle between login and register forms
function toggleAuth(type) {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    
    if (type === 'register') {
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    } else {
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful login
    const userData = {
        name: 'مستخدم قيقا',
        email: email,
        avatar: 'images/default-avatar.png',
        balance: 0
    };
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to profile page
    window.location.href = 'profile.html';
});

// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('كلمات المرور غير متطابقة');
        return;
    }
    
    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful registration
    const userData = {
        name: name,
        email: email,
        phone: phone,
        avatar: 'images/default-avatar.png',
        balance: 0
    };
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to profile page
    window.location.href = 'profile.html';
});
