function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        alert('Access denied!');
        window.location.href = 'login.html';
    }
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('tracking-container');
    
    if (orders.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:40px;">No orders yet</p>';
        return;
    }
    
    container.innerHTML = orders.map((order, index) => {
        const statusSteps = ['Pending', 'Accepted', 'Packaged', 'Picked by Courier', 'Delivered'];
        const currentIndex = statusSteps.indexOf(order.status);
        
        return `
        <div style="background:white;padding:25px;margin:20px 0;border-radius:15px;box-shadow:0 5px 20px rgba(0,0,0,0.1);border-left:5px solid ${order.status === 'Delivered' ? '#28a745' : '#ffc107'};">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;border-bottom:2px solid #8b0000;padding-bottom:15px;">
                <div>
                    <h3 style="color:#8b0000;margin:0;">Order #${order.id}</h3>
                    <p style="color:#666;margin:5px 0;">Customer: ${order.customerName}</p>
                    <p style="color:#666;margin:5px 0;">Phone: ${order.customerPhone}</p>
                    <p style="color:#666;margin:5px 0;">Date: ${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div style="text-align:right;">
                    <span style="padding:10px 20px;background:${order.status === 'Delivered' ? '#28a745' : '#ffc107'};color:white;border-radius:25px;font-weight:600;font-size:1rem;">${order.status}</span>
                    <p style="margin:10px 0;font-weight:600;color:#8b0000;">₹${order.total}</p>
                </div>
            </div>
            
            <div style="background:#f8f9fa;padding:20px;border-radius:10px;margin:20px 0;">
                <h4 style="color:#8b0000;margin:0 0 15px 0;">Order Items:</h4>
                ${order.items.map(item => `
                    <div style="display:flex;gap:15px;margin:10px 0;padding:10px;background:white;border-radius:8px;">
                        <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:5px;">
                        <div>
                            <p style="margin:0;font-weight:600;">${item.name}</p>
                            <p style="margin:5px 0;color:#8b0000;">₹${item.discountedPrice} x ${item.quantity}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="background:#f0f8ff;padding:20px;border-radius:10px;margin:20px 0;">
                <h4 style="color:#007bff;margin:0 0 15px 0;">📍 Delivery Address</h4>
                <p style="margin:5px 0;color:#666;">${order.customerAddress}</p>
                <p style="margin:5px 0;color:#666;">${order.customerCity}, ${order.customerState} - ${order.customerPincode}</p>
            </div>
            
            <div style="background:#fff5f5;padding:20px;border-radius:10px;margin:20px 0;">
                <h4 style="color:#8b0000;margin:0 0 15px 0;">Update Order Status</h4>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    ${statusSteps.map((status, idx) => {
                        const isCompleted = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;
                        const isNext = idx === currentIndex + 1;
                        return `
                            <button 
                                class="${isNext ? 'btn-submit' : isCompleted ? 'btn-edit' : 'btn-delete'}" 
                                onclick="updateOrderStatus(${index}, '${status}')"
                                ${!isNext ? 'disabled' : ''}
                                style="opacity:${isNext ? '1' : '0.5'};cursor:${isNext ? 'pointer' : 'not-allowed'};">
                                ${isCompleted ? '✓' : ''} ${status}
                            </button>
                        `;
                    }).join('')}
                </div>
                <p style="margin:15px 0 0 0;color:#666;font-size:0.9rem;">Click the next status to update the order</p>
            </div>
            
            ${order.statusHistory && order.statusHistory.length > 0 ? `
            <div style="background:#f9f9f9;padding:20px;border-radius:10px;">
                <h4 style="color:#8b0000;margin:0 0 15px 0;">📋 Status History</h4>
                ${order.statusHistory.map(history => `
                    <p style="margin:8px 0;color:#666;">
                        <strong>${history.status}</strong> - ${new Date(history.date).toLocaleString()}
                    </p>
                `).join('')}
            </div>
            ` : ''}
        </div>
        `;
    }).join('');
}

function updateOrderStatus(index, status) {
    if (!confirm(`Update order status to: ${status}?`)) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders[index].status = status;
    orders[index].statusHistory = orders[index].statusHistory || [];
    orders[index].statusHistory.push({
        status: status,
        date: new Date().toISOString()
    });
    
    if (status === 'Delivered') {
        orders[index].deliveredDate = new Date().toISOString();
    }
    
    localStorage.setItem('orders', JSON.stringify(orders));
    alert(`Order status updated to: ${status}`);
    loadOrders();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

window.onload = function() {
    checkAdminAuth();
    loadOrders();
};
