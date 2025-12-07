function checkUserAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please login first');
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

function loadUserOrders() {
    const user = checkUserAuth();
    if (!user) return;
    
    document.getElementById('welcome-user').textContent = `Welcome, ${user.username}!`;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === (user.email || user.username));
    const exchanges = JSON.parse(localStorage.getItem('exchanges')) || [];
    
    const container = document.getElementById('orders-container');
    
    if (userOrders.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:40px;">No orders yet</p>';
        return;
    }
    
    container.innerHTML = userOrders.map(order => {
        const exchange = exchanges.find(ex => ex.orderId === order.id);
        const canRequestExchange = !exchange || exchange.status === 'Rejected';
        return `
        <div style="background:white;padding:25px;margin:20px 0;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:2px solid #8b0000;padding-bottom:15px;">
                <div>
                    <h3 style="color:#8b0000;margin:0;">Order #${order.id}</h3>
                    <p style="color:#666;margin:5px 0;">Date: ${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div style="text-align:right;">
                    <span style="padding:8px 15px;background:${order.status === 'Delivered' ? '#28a745' : order.status === 'Pending' ? '#ffc107' : '#dc3545'};color:white;border-radius:20px;font-weight:600;">${order.status}</span>
                </div>
            </div>
            
            <div style="margin:15px 0;">
                <h4 style="color:#333;margin-bottom:10px;">Items:</h4>
                ${order.items.map(item => `
                    <div style="display:flex;gap:15px;padding:10px;background:#f9f9f9;border-radius:8px;margin:10px 0;">
                        <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:5px;">
                        <div style="flex:1;">
                            <p style="font-weight:600;margin:0;">${item.name}</p>
                            <p style="color:#8b0000;margin:5px 0;">₹${item.discountedPrice} x ${item.quantity}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="background:#f9f9f9;padding:15px;border-radius:8px;margin:15px 0;">
                <h4 style="color:#333;margin-bottom:10px;">Shipping Address:</h4>
                <p style="margin:5px 0;color:#666;">${order.customerName}</p>
                <p style="margin:5px 0;color:#666;">${order.customerAddress}</p>
                <p style="margin:5px 0;color:#666;">${order.customerCity}, ${order.customerState} - ${order.customerPincode}</p>
                <p style="margin:5px 0;color:#666;">Phone: ${order.customerPhone}</p>
            </div>
            
            <div style="text-align:right;font-size:1.3rem;font-weight:bold;color:#8b0000;margin:15px 0;">
                Total: ₹${order.total}
            </div>
            
            <div style="display:flex;gap:10px;margin-top:15px;flex-wrap:wrap;">
                ${canEditAddress(order.date) && order.status !== 'Delivered' ? `<button class="btn-edit" onclick="window.location.href='edit-address.html?orderId=${order.id}'">Edit Address</button>` : ''}
                ${order.status !== 'Delivered' ? `<button class="btn-edit" onclick="window.location.href='track-order.html?orderId=${order.id}'">Track Order</button>` : ''}
                ${order.status === 'Delivered' && (!exchange || exchange.status === 'Rejected') ? `<button class="btn-edit" onclick="window.location.href='request-exchange.html?orderId=${order.id}'">Request Exchange</button>` : ''}
                ${order.status === 'Delivered' ? `<button class="btn-edit" onclick="window.location.href='contact-support.html?orderId=${order.id}'">Product Issue</button>` : ''}
            </div>
        </div>
        `;
    }).join('');
}

function canEditAddress(orderDate) {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return (currentTime - orderTime) < oneDayInMs;
}

function showUserTab(tab) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(section => section.style.display = 'none');
    
    event.target.classList.add('active');
    document.getElementById('tab-' + tab).style.display = 'block';
    
    if (tab === 'exchanges') loadUserExchanges();
    if (tab === 'support') loadUserSupport();
}

function loadUserExchanges() {
    const user = checkUserAuth();
    if (!user) return;
    
    const exchanges = JSON.parse(localStorage.getItem('exchanges')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(o => o.userId === (user.email || user.username));
    const userOrderIds = userOrders.map(o => o.id);
    const userExchanges = exchanges.filter(ex => userOrderIds.includes(ex.orderId));
    
    const container = document.getElementById('exchanges-container');
    
    if (userExchanges.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:40px;">No exchange requests</p>';
        return;
    }
    
    container.innerHTML = userExchanges.map(exchange => `
        <div style="background:white;padding:20px;margin:20px 0;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);border-left:5px solid ${exchange.status === 'Approved' ? '#28a745' : exchange.status === 'Rejected' ? '#dc3545' : '#ffc107'};">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:15px;">
                <div>
                    <h3 style="color:#8b0000;margin:0;">Order #${exchange.orderId}</h3>
                    <p style="color:#666;margin:5px 0;">Requested: ${new Date(exchange.date).toLocaleDateString()}</p>
                </div>
                <span style="padding:8px 15px;background:${exchange.status === 'Approved' ? '#28a745' : exchange.status === 'Rejected' ? '#dc3545' : '#ffc107'};color:white;border-radius:20px;font-weight:600;">${exchange.status}</span>
            </div>
            <div style="background:#f9f9f9;padding:15px;border-radius:8px;margin:10px 0;">
                <p style="margin:5px 0;"><strong>Reason:</strong> ${exchange.reason}</p>
                ${exchange.details ? `<p style="margin:5px 0;"><strong>Details:</strong> ${exchange.details}</p>` : ''}
            </div>
            ${exchange.status === 'Approved' ? '<p style="color:#28a745;font-weight:600;margin:10px 0;">✅ Approved! Our team will contact you for pickup.</p>' : ''}
            ${exchange.status === 'Rejected' ? '<p style="color:#dc3545;font-weight:600;margin:10px 0;">❌ Rejected. You can request exchange again if needed.</p>' : ''}
            ${exchange.status === 'Pending' ? '<p style="color:#856404;font-weight:600;margin:10px 0;">⏳ Pending review by admin.</p>' : ''}
            ${exchange.status === 'Pending' ? `<button class="btn-edit" onclick="window.location.href='request-exchange.html?orderId=${exchange.orderId}'">Edit Request</button>` : ''}
        </div>
    `).join('');
}

function loadUserSupport() {
    const user = checkUserAuth();
    if (!user) return;
    
    const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    const userTickets = tickets.filter(t => t.userId === (user.email || user.username));
    
    const container = document.getElementById('support-container');
    
    if (userTickets.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:40px;">No support tickets</p>';
        return;
    }
    
    container.innerHTML = userTickets.map(ticket => `
        <div style="background:white;padding:20px;margin:20px 0;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);border-left:5px solid ${ticket.status === 'Resolved' ? '#28a745' : '#ffc107'};">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:15px;">
                <div>
                    <h3 style="color:#8b0000;margin:0;">${ticket.ticketType || 'Support Request'}</h3>
                    ${ticket.orderId ? `<p style="color:#666;margin:5px 0;">Order #${ticket.orderId}</p>` : ''}
                    <p style="color:#666;margin:5px 0;">Submitted: ${new Date(ticket.date).toLocaleDateString()}</p>
                </div>
                <span style="padding:8px 15px;background:${ticket.status === 'Resolved' ? '#28a745' : '#ffc107'};color:white;border-radius:20px;font-weight:600;">${ticket.status}</span>
            </div>
            <div style="background:#f9f9f9;padding:15px;border-radius:8px;margin:10px 0;">
                <p style="margin:5px 0;"><strong>Category:</strong> ${ticket.category}</p>
                <p style="margin:5px 0;"><strong>Issue:</strong> ${ticket.issue}</p>
            </div>
            ${ticket.status === 'Resolved' ? '<p style="color:#28a745;font-weight:600;margin:10px 0;">✅ Resolved</p>' : '<p style="color:#856404;font-weight:600;margin:10px 0;">⏳ Our team is working on your request.</p>'}
        </div>
    `).join('');
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

window.onload = function() {
    const websiteName = localStorage.getItem('websiteName') || 'Lakshmi Sarees';
    document.querySelectorAll('.logo').forEach(logo => logo.textContent = websiteName);
    document.title = 'My Orders - ' + websiteName;
    loadUserOrders();
};
