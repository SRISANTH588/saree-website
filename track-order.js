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
    
    const statusSteps = [
        { name: 'Pending', icon: '📋', desc: 'Order received', color: '#ffc107' },
        { name: 'Accepted', icon: '✅', desc: 'Order confirmed', color: '#17a2b8' },
        { name: 'Packaged', icon: '📦', desc: 'Order packed', color: '#007bff' },
        { name: 'Picked by Courier', icon: '🚚', desc: 'Out for delivery', color: '#fd7e14' },
        { name: 'Delivered', icon: '🎉', desc: 'Order delivered', color: '#28a745' }
    ];
    const currentIndex = statusSteps.findIndex(s => s.name === order.status);
    const progressPercent = ((currentIndex + 1) / statusSteps.length) * 100;
    
    const orderDate = new Date(order.date);
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
    const daysRemaining = Math.ceil((estimatedDelivery - new Date()) / (1000 * 60 * 60 * 24));
    
    document.getElementById('order-info').innerHTML = `
        <style>
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes spin { to { transform: rotate(360deg); } }
        </style>
        
        <div style="background:linear-gradient(135deg, #8b0000, #c41e3a);padding:25px;border-radius:15px;color:white;margin-bottom:25px;box-shadow:0 5px 20px rgba(139,0,0,0.3);">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:15px;">
                <div>
                    <h3 style="margin:0;color:white;font-size:1.5rem;">Order #${order.id}</h3>
                    <p style="margin:5px 0;opacity:0.9;font-size:0.95rem;">Placed: ${new Date(order.date).toLocaleDateString()} at ${new Date(order.date).toLocaleTimeString()}</p>
                </div>
                <div style="text-align:right;">
                    <p style="margin:0;font-size:0.9rem;opacity:0.9;">${order.status === 'Delivered' ? 'Delivered' : 'Est. Delivery'}</p>
                    <p style="margin:5px 0;font-size:1.1rem;font-weight:bold;">${order.status === 'Delivered' ? new Date(order.deliveredDate).toLocaleDateString() : estimatedDelivery.toLocaleDateString()}</p>
                    ${order.status !== 'Delivered' && daysRemaining > 0 ? `<p style="margin:0;font-size:0.85rem;opacity:0.9;">${daysRemaining} days remaining</p>` : ''}
                </div>
            </div>
            <div style="background:rgba(255,255,255,0.2);border-radius:10px;padding:15px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                    <span style="font-weight:600;">Current Status: ${order.status}</span>
                    <span style="font-weight:600;">${Math.round(progressPercent)}%</span>
                </div>
                <div style="background:rgba(255,255,255,0.3);height:12px;border-radius:10px;overflow:hidden;">
                    <div style="background:linear-gradient(90deg, #fff, #90EE90);height:100%;width:${progressPercent}%;transition:width 1s ease;border-radius:10px;"></div>
                </div>
            </div>
        </div>
        
        <div style="background:white;padding:30px;border-radius:15px;box-shadow:0 5px 20px rgba(0,0,0,0.1);margin-bottom:25px;">
            <h4 style="color:#8b0000;margin-bottom:25px;font-size:1.4rem;display:flex;align-items:center;gap:10px;">
                <span style="font-size:1.8rem;">📍</span> Track Your Order Journey
            </h4>
            <div style="position:relative;padding:10px 0;">
                ${statusSteps.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const statusInfo = order.statusHistory && order.statusHistory.find(h => h.status === step.name);
                    return `
                        <div style="display:flex;align-items:start;margin-bottom:${index < statusSteps.length - 1 ? '35px' : '0'};position:relative;animation:${isCompleted ? 'fadeIn 0.5s ease' : 'none'};">
                            ${index < statusSteps.length - 1 ? `<div style="position:absolute;left:27px;top:55px;width:4px;height:35px;background:${isCompleted ? `linear-gradient(180deg, ${step.color}, ${statusSteps[index + 1].color})` : '#e0e0e0'};border-radius:2px;transition:all 0.5s ease;"></div>` : ''}
                            <div style="width:55px;height:55px;border-radius:50%;background:${isCompleted ? `linear-gradient(135deg, ${step.color}, ${step.color}dd)` : '#f5f5f5'};color:${isCompleted ? 'white' : '#ccc'};display:flex;align-items:center;justify-content:center;font-size:1.8rem;box-shadow:${isCurrent ? `0 0 0 5px ${step.color}33, 0 5px 15px ${step.color}44` : isCompleted ? '0 3px 10px rgba(0,0,0,0.2)' : 'none'};z-index:1;position:relative;transition:all 0.3s ease;transform:${isCurrent ? 'scale(1.1)' : 'scale(1)'};border:${isCompleted ? '3px solid white' : '3px solid #e0e0e0'};">
                                ${isCompleted ? step.icon : `<span style="font-size:1.2rem;font-weight:bold;">${index + 1}</span>`}
                            </div>
                            <div style="flex:1;margin-left:25px;background:${isCurrent ? `${step.color}11` : 'transparent'};padding:${isCurrent ? '15px' : '10px'};border-radius:10px;transition:all 0.3s ease;border-left:${isCurrent ? `4px solid ${step.color}` : 'none'};">
                                <div style="display:flex;justify-content:space-between;align-items:start;">
                                    <div>
                                        <p style="margin:0;font-weight:${isCurrent ? 'bold' : '600'};color:${isCompleted ? step.color : '#999'};font-size:1.15rem;">${step.name}</p>
                                        <p style="margin:5px 0;font-size:0.95rem;color:#666;">${step.desc}</p>
                                    </div>
                                    ${isCompleted ? `<span style="background:${step.color};color:white;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:600;">✓ Done</span>` : ''}
                                </div>
                                ${statusInfo ? `
                                    <div style="margin-top:10px;background:white;padding:10px;border-radius:8px;border:1px solid ${step.color}33;">
                                        <p style="margin:0;font-size:0.9rem;color:#666;display:flex;align-items:center;gap:8px;">
                                            <span style="font-size:1.1rem;">🕒</span>
                                            <span><strong>${new Date(statusInfo.date).toLocaleDateString()}</strong> at ${new Date(statusInfo.date).toLocaleTimeString()}</span>
                                        </p>
                                    </div>
                                ` : ''}
                                ${isCurrent && order.status !== 'Delivered' ? `
                                    <div style="margin-top:10px;display:flex;align-items:center;gap:10px;">
                                        <div style="width:20px;height:20px;border:3px solid ${step.color};border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div>
                                        <p style="margin:0;font-size:0.9rem;color:${step.color};font-weight:600;">Processing...</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div style="background:linear-gradient(135deg, #f8f9fa, #e9ecef);padding:25px;border-radius:15px;margin-bottom:25px;border:2px solid #dee2e6;">
            <h4 style="color:#8b0000;margin-bottom:20px;font-size:1.2rem;display:flex;align-items:center;gap:10px;">
                <span style="font-size:1.5rem;">📍</span> Delivery Address
            </h4>
            <div style="background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <p style="margin:8px 0;color:#333;font-weight:600;font-size:1.05rem;">👤 ${order.customerName}</p>
                <p style="margin:8px 0;color:#666;">🏠 ${order.customerAddress}</p>
                <p style="margin:8px 0;color:#666;">🌆 ${order.customerCity}, ${order.customerState} - ${order.customerPincode}</p>
                <p style="margin:8px 0;color:#666;">📞 ${order.customerPhone}</p>
            </div>
        </div>
        
        <div style="background:white;padding:25px;border-radius:15px;box-shadow:0 5px 20px rgba(0,0,0,0.1);">
            <h4 style="color:#8b0000;margin-bottom:20px;font-size:1.3rem;display:flex;align-items:center;gap:10px;">
                <span style="font-size:1.6rem;">🛍️</span> Order Items
            </h4>
            ${order.items.map((item, idx) => `
                <div style="display:flex;gap:20px;margin:20px 0;padding:20px;background:linear-gradient(135deg, #f8f9fa, #ffffff);border-radius:12px;align-items:center;border:2px solid #e9ecef;transition:all 0.3s ease;">
                    <div style="position:relative;">
                        <img src="${item.image}" style="width:80px;height:80px;object-fit:cover;border-radius:10px;box-shadow:0 3px 10px rgba(0,0,0,0.15);">
                        <span style="position:absolute;top:-8px;right:-8px;background:#8b0000;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.2);">${item.quantity}</span>
                    </div>
                    <div style="flex:1;">
                        <p style="margin:0;font-weight:600;font-size:1.1rem;color:#333;">${item.name}</p>
                        <p style="margin:8px 0;color:#8b0000;font-weight:600;font-size:1.05rem;">₹${item.discountedPrice} x ${item.quantity} = ₹${item.discountedPrice * item.quantity}</p>
                    </div>
                </div>
            `).join('')}
            <div style="background:linear-gradient(135deg, #8b0000, #c41e3a);margin-top:20px;padding:20px;border-radius:10px;text-align:right;color:white;">
                <p style="margin:0;font-size:0.9rem;opacity:0.9;">Order Total</p>
                <p style="margin:5px 0;font-size:1.8rem;font-weight:bold;">₹${order.total}</p>
            </div>
        </div>
    `;
}



window.onload = function() {
    const websiteName = localStorage.getItem('websiteName') || 'Lakshmi Sarees';
    document.querySelectorAll('.logo').forEach(logo => logo.textContent = websiteName);
    document.title = 'Track Order - ' + websiteName;
    loadOrderInfo();
};
