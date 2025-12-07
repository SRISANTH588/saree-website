const urlParams = new URLSearchParams(window.location.search);
const orderId = parseInt(urlParams.get('orderId'));

function loadOrderInfo() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Order not found');
        window.location.href = 'user-dashboard.html';
        return;
    }
    
    document.getElementById('order-info').innerHTML = `
        <h3>Order #${order.id}</h3>
        <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
        <p>Status: <span style="color:${order.status === 'Delivered' ? 'green' : order.status === 'Approved' ? 'blue' : 'orange'};font-weight:600;">${order.status}</span></p>
        <div style="margin-top:10px;">
            ${order.items.map(item => `
                <div style="display:flex;gap:10px;margin:10px 0;align-items:center;">
                    <img src="${item.image}" style="width:50px;height:50px;object-fit:cover;border-radius:5px;">
                    <div>
                        <p style="margin:0;font-weight:600;">${item.name}</p>
                        <p style="margin:0;color:#8b0000;">₹${item.discountedPrice} x ${item.quantity}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

document.getElementById('support-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const supportTickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    supportTickets.push({
        orderId: orderId,
        userId: user.email || user.username,
        category: document.getElementById('category').value,
        issue: document.getElementById('issue').value,
        contactMethod: document.getElementById('contact-method').value,
        ticketType: 'Product Issue',
        date: new Date().toISOString(),
        status: 'Open'
    });
    
    localStorage.setItem('supportTickets', JSON.stringify(supportTickets));
    
    alert('Thank you for contacting us!\n\nYour product issue has been submitted successfully.\n\nOur customer support team will contact you soon via your preferred method.\n\nTicket ID: #' + supportTickets.length);
    window.location.href = 'user-dashboard.html';
});

window.onload = function() {
    const websiteName = localStorage.getItem('websiteName') || 'Lakshmi Sarees';
    document.querySelectorAll('.logo').forEach(logo => logo.textContent = websiteName);
    document.title = 'Contact Support - ' + websiteName;
    loadOrderInfo();
};
