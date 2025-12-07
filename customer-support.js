function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productSelect = document.getElementById('product');
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });
}

document.getElementById('support-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const selectedProductId = parseInt(document.getElementById('product').value);
    const selectedProduct = products.find(p => p.id === selectedProductId);
    
    const supportTickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    supportTickets.push({
        orderId: null,
        userId: user ? (user.email || user.username) : 'Guest',
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        productId: selectedProductId,
        productName: selectedProduct ? selectedProduct.name : 'N/A',
        category: document.getElementById('issue-type').value,
        issue: document.getElementById('description').value,
        contactMethod: document.getElementById('contact-method').value,
        ticketType: 'Product Support',
        date: new Date().toISOString(),
        status: 'Open'
    });
    
    localStorage.setItem('supportTickets', JSON.stringify(supportTickets));
    
    alert('Thank you for contacting us!\n\nYour support request has been submitted successfully.\n\nOur customer support team will contact you soon via your preferred method.\n\nTicket ID: #' + supportTickets.length);
    window.location.href = 'index.html';
});

window.onload = function() {
    const websiteName = localStorage.getItem('websiteName') || 'Lakshmi Sarees';
    document.querySelectorAll('.logo').forEach(logo => logo.textContent = websiteName);
    document.title = 'Customer Support - ' + websiteName;
    
    loadProducts();
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        if (user.name) document.getElementById('name').value = user.name;
        if (user.email) document.getElementById('email').value = user.email;
        if (user.phone) document.getElementById('phone').value = user.phone;
    }
};
