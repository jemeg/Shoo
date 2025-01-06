// Update user avatar and tooltip on all pages
function updateUserInterface() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    const userMenus = document.querySelectorAll('.user-menu');
    
    userMenus.forEach(menu => {
        if (isLoggedIn && userData) {
            menu.style.display = 'block';
            const avatar = menu.querySelector('.user-avatar');
            if (avatar) {
                avatar.src = userData.avatar || 'images/default-avatar.png';
                avatar.title = userData.name || 'المستخدم';
            }
        } else {
            menu.style.display = 'none';
        }
    });
}

// Handle logout
function handleLogout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateUserInterface();
    
    // Add logout handler to all logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
});
