function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartContent = document.getElementById('cart-content');

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <a href="index.html" class="btn-continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">
                    <div style="margin-bottom:5px;">
                        <span style="text-decoration:line-through;color:#999;">₹${item.originalPrice}</span>
                        <span style="color:#8b0000;font-weight:bold;font-size:1.2rem;margin-left:10px;">₹${item.discountedPrice}</span>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>Qty: ${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i> Remove</button>
            </div>
        </div>
    `).join('');

    calculateCartTotal();
}

function calculateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const originalTotal = cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);

    document.getElementById('cart-original').textContent = originalTotal;
    document.getElementById('cart-subtotal').textContent = subtotal;
    document.getElementById('cart-total').textContent = subtotal;
}

function updateQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === id);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
});
