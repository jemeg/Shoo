// Add to Cart functionality
document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.parentElement;
        const productName = product.querySelector('h3').textContent;
        const productPrice = product.querySelector('.price').textContent;
        
        alert(`تم إضافة ${productName} إلى سلة التسوق`);
    });
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send this data to a server
        alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
        this.reset();
    });
}

// Update logo in all pages
document.addEventListener('DOMContentLoaded', function() {
    const logoImages = document.querySelectorAll('.logo img');
    logoImages.forEach(img => {
        img.src = "https://cdn.discordapp.com/attachments/1218265466573950989/1325218262023405570/101.png?ex=677afd2f&is=6779abaf&hm=a726ff9ff55a5da4f6fc83e5aca762ca9d55df02619f86258118fe8fd72bec92&";
    });
});
