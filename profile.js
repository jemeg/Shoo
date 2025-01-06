// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Load user data
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('fullName').value = userData.name;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phone || '';
        document.getElementById('currentBalance').textContent = `${userData.balance.toFixed(2)} د.ل`;
    }
}

// Update user interface
function updateUserInterface() {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        // Update all avatar images
        const avatars = document.querySelectorAll('.user-avatar, #profileImage');
        avatars.forEach(avatar => {
            avatar.src = userData.avatar || 'images/default-avatar.png';
        });
    }
}

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem('user'));
    
    userData.name = document.getElementById('fullName').value;
    userData.email = document.getElementById('email').value;
    userData.phone = document.getElementById('phone').value;
    
    localStorage.setItem('user', JSON.stringify(userData));
    alert('تم حفظ التغييرات بنجاح');
});

// Image Upload Modal Functions
function openImageOptions() {
    document.getElementById('imageModal').style.display = 'block';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
    stopCamera();
}

// Handle file upload
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updateProfileImage(e.target.result);
            closeImageModal();
        };
        reader.readAsDataURL(file);
    }
});

// Camera Functions
let stream = null;

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.style.display = 'block';
        document.getElementById('cameraPreview').style.display = 'block';
    } catch (err) {
        alert('لا يمكن الوصول إلى الكاميرا');
        console.error('Error accessing camera:', err);
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    document.getElementById('video').style.display = 'none';
    document.getElementById('cameraPreview').style.display = 'none';
}

function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL
    const imageData = canvas.toDataURL('image/jpeg');
    
    // Update profile image
    updateProfileImage(imageData);
    
    // Stop camera and close modal
    stopCamera();
    closeImageModal();
}

function updateProfileImage(imageData) {
    // Update user data in localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    userData.avatar = imageData;
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update all avatar images on the page
    updateUserInterface();
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', handleLogout);

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeImageModal();
    }
}

// Initialize page
checkAuth();
loadUserData();
updateUserInterface();
