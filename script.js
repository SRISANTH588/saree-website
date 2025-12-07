let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: "Silk Saree - Red", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", originalPrice: 5000, discountedPrice: 3500, discount: 30 },
    { id: 2, name: "Cotton Saree - Blue", image: "https://images.unsplash.com/photo-1583391733981-5aff4a6e8a2c?w=400", originalPrice: 3000, discountedPrice: 2100, discount: 30 },
    { id: 3, name: "Designer Saree - Gold", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400", originalPrice: 8000, discountedPrice: 6400, discount: 20 },
    { id: 4, name: "Banarasi Saree - Green", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", originalPrice: 6000, discountedPrice: 4800, discount: 20 },
    { id: 5, name: "Kanjivaram Saree - Purple", image: "https://images.unsplash.com/photo-1583391733981-5aff4a6e8a2c?w=400", originalPrice: 7000, discountedPrice: 5600, discount: 20 },
    { id: 6, name: "Chiffon Saree - Pink", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400", originalPrice: 4000, discountedPrice: 3200, discount: 20 }
];

if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
}

const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discounted-price">₹${product.discountedPrice}</span>
                    <span class="discount-badge">${product.discount}% OFF</span>
                </div>
                <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function viewProduct(id) {
    localStorage.setItem('selectedProduct', id);
    window.location.href = 'product-detail.html';
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to cart!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

function checkLogin() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const loginLink = document.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = user.username;
            loginLink.href = user.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
        }
    }
    const websiteName = localStorage.getItem('websiteName') || 'Lakshmi Sarees';
    document.querySelectorAll('.logo').forEach(logo => logo.textContent = websiteName);
    
    const copyrightText = document.getElementById('copyright-text');
    if (copyrightText) {
        copyrightText.textContent = `© ${new Date().getFullYear()} ${websiteName}. All rights reserved.`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    checkLogin();
    
    const websiteName = localStorage.getItem('websiteName') || 'Lakshmi Sarees';
    document.querySelectorAll('.logo').forEach(logo => logo.textContent = websiteName);
    
    const welcomeTitle = localStorage.getItem('welcomeTitle') || 'Welcome to Lakshmi Sarees';
    const welcomeSubtitle = localStorage.getItem('welcomeSubtitle') || 'Discover the finest collection of traditional and designer sarees';
    
    if (document.getElementById('hero-title')) {
        document.getElementById('hero-title').textContent = welcomeTitle;
    }
    if (document.getElementById('hero-subtitle')) {
        document.getElementById('hero-subtitle').textContent = welcomeSubtitle;
    }
    
    const copyrightText = document.getElementById('copyright-text');
    if (copyrightText) {
        copyrightText.textContent = `© ${new Date().getFullYear()} ${websiteName}. All rights reserved.`;
    }
});
