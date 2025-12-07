function loadProductDetail() {
    const productId = parseInt(localStorage.getItem('selectedProduct'));
    const products = JSON.parse(localStorage.getItem('products')) || [
        { id: 1, name: "Silk Saree - Red", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800", originalPrice: 5000, discountedPrice: 3500, discount: 30 },
        { id: 2, name: "Cotton Saree - Blue", image: "https://images.unsplash.com/photo-1583391733981-5aff4a6e8a2c?w=800", originalPrice: 3000, discountedPrice: 2100, discount: 30 },
        { id: 3, name: "Designer Saree - Gold", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800", originalPrice: 8000, discountedPrice: 6400, discount: 20 },
        { id: 4, name: "Banarasi Saree - Green", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800", originalPrice: 6000, discountedPrice: 4800, discount: 20 },
        { id: 5, name: "Kanjivaram Saree - Purple", image: "https://images.unsplash.com/photo-1583391733981-5aff4a6e8a2c?w=800", originalPrice: 7000, discountedPrice: 5600, discount: 20 },
        { id: 6, name: "Chiffon Saree - Pink", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800", originalPrice: 4000, discountedPrice: 3200, discount: 20 }
    ];
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check if product has individual details
    const productDetails = JSON.parse(localStorage.getItem('productDetails')) || {};
    const individualDetails = productDetails[product.id];
    
    // Use individual details if available, otherwise use global settings
    let description, features;
    if (individualDetails) {
        description = individualDetails.description;
        features = individualDetails.features;
    } else {
        const productPageSettings = JSON.parse(localStorage.getItem('productPageSettings')) || {
            description: 'Experience the elegance and tradition with our premium saree collection. This exquisite piece is crafted with the finest materials and attention to detail, perfect for any special occasion or celebration.',
            features: ['Premium quality fabric', 'Traditional craftsmanship', 'Perfect for weddings and special occasions', 'Easy to drape and comfortable to wear', 'Comes with matching blouse piece']
        };
        description = productPageSettings.description;
        features = productPageSettings.features;
    }
    
    const featuresHTML = features.map(f => `<li>${f}</li>`).join('');
    
    document.getElementById('product-detail').innerHTML = `
        <div class="product-detail">
            <img src="${product.image}" alt="${product.name}" class="product-detail-image">
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                
                <div class="price-section">
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discounted-price">₹${product.discountedPrice}</span>
                    <span class="discount-badge">${product.discount}% OFF</span>
                </div>

                <div class="product-description">
                    <p>${description}</p>
                </div>

                <div class="product-features">
                    <h3>Product Features:</h3>
                    <ul>
                        ${featuresHTML}
                    </ul>
                </div>

                <div class="action-buttons">
                    <button class="btn-add-to-cart" onclick="addToCartFromDetail(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-buy-now" onclick="buyNow(${product.id})">
                        <i class="fas fa-bolt"></i> Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

function addToCartFromDetail(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to cart!');
}

function buyNow(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    
    const existingItem = cart.find(item => item.id === id);
    
    if (!existingItem) {
        cart.push({ ...product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetail();
    updateCartCount();
});
