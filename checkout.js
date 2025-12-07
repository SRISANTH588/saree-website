const coupons = JSON.parse(localStorage.getItem('coupons')) || [
    { code: 'WELCOME5', discount: 5 },
    { code: 'SAVE10', discount: 10 },
    { code: 'SAVE20', discount: 20 },
    { code: 'FIRST50', discount: 50 }
];

if (!localStorage.getItem('coupons')) {
    localStorage.setItem('coupons', JSON.stringify([
        { code: 'WELCOME5', discount: 5 },
        { code: 'SAVE10', discount: 10 },
        { code: 'SAVE20', discount: 20 },
        { code: 'FIRST50', discount: 50 }
    ]));
}

let appliedDiscount = 0;

function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    // Pre-fill user details if logged in
    if (user) {
        if (user.name) document.getElementById('customer-name').value = user.name;
        if (user.email) document.getElementById('customer-email').value = user.email;
        if (user.phone) document.getElementById('customer-phone').value = user.phone;
    }
    
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item-row">
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">₹${item.discountedPrice} x ${item.quantity}</div>
            </div>
        </div>
    `).join('');
    
    calculateTotal();
}

function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const originalTotal = cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const discount = (subtotal * appliedDiscount) / 100;
    const total = subtotal - discount;
    
    document.getElementById('original-total').textContent = Math.round(originalTotal);
    document.getElementById('subtotal').textContent = Math.round(subtotal);
    document.getElementById('discount').textContent = Math.round(discount);
    document.getElementById('total').textContent = Math.round(total);
}

function applyCoupon() {
    const code = document.getElementById('coupon-code').value.trim().toUpperCase();
    const message = document.getElementById('coupon-message');
    
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    const coupon = coupons.find(c => c.code === code);
    
    if (coupon) {
        appliedDiscount = coupon.discount;
        message.style.color = 'green';
        message.textContent = `Coupon applied! ${coupon.discount}% discount`;
        calculateTotal();
    } else {
        message.style.color = 'red';
        message.textContent = 'Invalid coupon code';
    }
}

function showReviewOrder() {
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    document.getElementById('review-details').innerHTML = `
        <h3 style="color:#8b0000;margin-bottom:15px;">Shipping Details</h3>
        <p><strong>Name:</strong> ${document.getElementById('customer-name').value}</p>
        <p><strong>Email:</strong> ${document.getElementById('customer-email').value}</p>
        <p><strong>Phone:</strong> ${document.getElementById('customer-phone').value}</p>
        <p><strong>Address:</strong> ${document.getElementById('customer-address').value}</p>
        <p><strong>City:</strong> ${document.getElementById('customer-city').value}</p>
        <p><strong>State:</strong> ${document.getElementById('customer-state').value}</p>
        <p><strong>Pincode:</strong> ${document.getElementById('customer-pincode').value}</p>
        
        <h3 style="color:#8b0000;margin:20px 0 15px 0;">Order Items</h3>
        ${cart.map(item => `
            <div style="display:flex;gap:15px;padding:10px;background:white;border-radius:8px;margin:10px 0;">
                <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:5px;">
                <div>
                    <p style="margin:0;font-weight:600;">${item.name}</p>
                    <p style="margin:5px 0;color:#8b0000;">₹${item.discountedPrice} x ${item.quantity}</p>
                </div>
            </div>
        `).join('')}
        
        <div style="background:white;padding:15px;border-radius:8px;margin-top:20px;">
            <p style="display:flex;justify-content:space-between;margin:5px 0;"><span>Original Price:</span><span style="text-decoration:line-through;">₹${document.getElementById('original-total').textContent}</span></p>
            <p style="display:flex;justify-content:space-between;margin:5px 0;"><span>Offer Price:</span><span>₹${document.getElementById('subtotal').textContent}</span></p>
            <p style="display:flex;justify-content:space-between;margin:5px 0;color:green;"><span>Discount:</span><span>-₹${document.getElementById('discount').textContent}</span></p>
            <p style="display:flex;justify-content:space-between;margin:15px 0 5px 0;font-size:1.3rem;font-weight:bold;color:#8b0000;border-top:2px solid #8b0000;padding-top:15px;"><span>Total:</span><span>₹${document.getElementById('total').textContent}</span></p>
        </div>
    `;
    
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('review-section').style.display = 'block';
    document.querySelectorAll('.step')[1].classList.add('active');
}

function backToShipping() {
    document.getElementById('checkout-form').style.display = 'block';
    document.getElementById('review-section').style.display = 'none';
    document.querySelectorAll('.step')[1].classList.remove('active');
}

function showPaymentOptions() {
    document.getElementById('review-section').style.display = 'none';
    document.getElementById('payment-section').style.display = 'block';
    document.querySelectorAll('.step')[2].classList.add('active');
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = document.getElementById('total').textContent;
    
    const reachedPayment = {
        userId: user.email || user.username,
        customerName: document.getElementById('customer-name').value,
        customerEmail: document.getElementById('customer-email').value,
        customerPhone: document.getElementById('customer-phone').value,
        amount: total,
        items: cart,
        date: new Date().toISOString(),
        status: 'Reached Payment'
    };
    
    localStorage.setItem('currentPaymentAttempt', JSON.stringify(reachedPayment));
    
    const onlineDiscount = Math.round(total * 0.05);
    const onlineTotal = total - onlineDiscount;
    
    document.getElementById('online-discount-amount').textContent = onlineDiscount;
    document.getElementById('online-final-amount').textContent = onlineTotal;
    document.getElementById('cod-advance-amount').textContent = 199;
    document.getElementById('cod-remaining-amount').textContent = Math.round(total - 199);
    document.getElementById('online-discount-info').style.display = 'none';
    document.getElementById('cod-advance-info').style.display = 'none';
}

window.addEventListener('beforeunload', function() {
    const paymentAttempt = localStorage.getItem('currentPaymentAttempt');
    if (paymentAttempt) {
        const attempt = JSON.parse(paymentAttempt);
        const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        adminNotifications.push({
            type: 'Payment Abandoned',
            customerName: attempt.customerName,
            customerEmail: attempt.customerEmail,
            customerPhone: attempt.customerPhone,
            amount: attempt.amount,
            message: `${attempt.customerName} left payment page without completing - ₹${attempt.amount}`,
            date: new Date().toISOString(),
            read: false
        });
        localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
    }
});

function backToReview() {
    document.getElementById('payment-section').style.display = 'none';
    document.getElementById('review-section').style.display = 'block';
    document.querySelectorAll('.step')[2].classList.remove('active');
}

function selectPayment(method) {
    document.getElementById(method).checked = true;
    document.getElementById('payment-gateway').style.display = 'none';
    document.getElementById('cod-button').style.display = 'none';
    
    if (method === 'cod') {
        document.getElementById('online-discount-info').style.display = 'none';
        document.getElementById('cod-advance-info').style.display = 'block';
        document.getElementById('cod-button').style.display = 'inline-block';
    } else {
        document.getElementById('cod-advance-info').style.display = 'none';
        document.getElementById('online-discount-info').style.display = 'block';
        document.getElementById('payment-gateway').style.display = 'block';
        setTimeout(() => processPayment(method), 1000);
    }
}

function processPayment(method) {
    const total = parseFloat(document.getElementById('total').textContent);
    const paymentAmount = method === 'cod' ? 199 : Math.round(total * 0.95);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const adminSettings = JSON.parse(localStorage.getItem('adminSettings')) || {};
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const abandonedPayment = {
        userId: user.email || user.username,
        customerName: document.getElementById('customer-name').value,
        customerEmail: document.getElementById('customer-email').value,
        customerPhone: document.getElementById('customer-phone').value,
        paymentMethod: method,
        amount: paymentAmount,
        items: cart,
        date: new Date().toISOString(),
        status: 'Attempted'
    };
    
    const options = {
        key: adminSettings.razorpayKey || 'rzp_test_1234567890',
        amount: paymentAmount * 100,
        currency: 'INR',
        name: 'Lakshmi Sarees',
        description: method === 'cod' ? 'COD Advance Payment (₹199)' : 'Order Payment',
        image: 'https://via.placeholder.com/100',
        prefill: {
            name: document.getElementById('customer-name').value,
            email: document.getElementById('customer-email').value,
            contact: document.getElementById('customer-phone').value
        },
        theme: {
            color: '#8b0000'
        },
        handler: function(response) {
            const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
            adminNotifications.push({
                type: 'New Order - Payment Received',
                message: 'New order with payment completed',
                date: new Date().toISOString(),
                read: false
            });
            localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
            document.getElementById('payment-gateway').style.display = 'none';
            placeOrder(true, response.razorpay_payment_id, paymentAmount);
        },
        modal: {
            ondismiss: function() {
                const abandonedPayments = JSON.parse(localStorage.getItem('abandonedPayments')) || [];
                abandonedPayments.push(abandonedPayment);
                localStorage.setItem('abandonedPayments', JSON.stringify(abandonedPayments));
                
                const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
                adminNotifications.push({
                    type: 'Payment Failed',
                    customerName: abandonedPayment.customerName,
                    customerEmail: abandonedPayment.customerEmail,
                    customerPhone: abandonedPayment.customerPhone,
                    amount: abandonedPayment.amount,
                    paymentMethod: method,
                    message: `Payment not completed by ${abandonedPayment.customerName} - ₹${abandonedPayment.amount}`,
                    date: new Date().toISOString(),
                    read: false
                });
                localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
                
                alert('Payment cancelled');
                document.getElementById('payment-gateway').style.display = 'none';
            }
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
}

function placeOrder(isPaid = false, transactionId = null, paidAmount = null) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please login to place order');
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    localStorage.removeItem('currentPaymentAttempt');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderStatus = 'Confirmed';
    const orderTotal = parseFloat(document.getElementById('total').textContent);
    const finalAmount = paidAmount || orderTotal;
    
    const order = {
        id: Date.now(),
        items: cart,
        originalTotal: document.getElementById('original-total').textContent,
        offerTotal: document.getElementById('subtotal').textContent,
        discount: document.getElementById('discount').textContent,
        total: orderTotal,
        paidAmount: finalAmount,
        remainingAmount: paymentMethod.value === 'cod' ? Math.round(orderTotal - 199) : 0,
        status: orderStatus,
        date: new Date().toISOString(),
        customerName: document.getElementById('customer-name').value,
        customerEmail: document.getElementById('customer-email').value,
        customerPhone: document.getElementById('customer-phone').value,
        customerAddress: document.getElementById('customer-address').value,
        customerCity: document.getElementById('customer-city').value,
        customerState: document.getElementById('customer-state').value,
        customerPincode: document.getElementById('customer-pincode').value,
        paymentMethod: paymentMethod.value,
        paymentStatus: isPaid ? 'Paid' : 'COD',
        transactionId: transactionId || 'N/A',
        userId: user.email || user.username
    };
    
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
    const notification = {
        type: paymentMethod.value === 'cod' ? 'New Order - COD' : 'New Order - Payment Received',
        orderId: order.id,
        customerName: order.customerName,
        total: order.total,
        message: `New order from ${order.customerName} - ₹${order.total}`,
        date: new Date().toISOString(),
        read: false
    };
    adminNotifications.push(notification);
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    localStorage.removeItem('cart');
    
    document.querySelector('.checkout-container').style.display = 'none';
    showOrderConfirmationPopup(order, isPaid);
}



document.getElementById('customer-pincode').addEventListener('input', async function(e) {
    const pincode = e.target.value;
    if (pincode.length === 6) {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            if (data[0].Status === 'Success' && data[0].PostOffice) {
                const postOffice = data[0].PostOffice[0];
                document.getElementById('customer-city').value = postOffice.District;
                document.getElementById('customer-state').value = postOffice.State;
            }
        } catch (error) {
            console.log('Could not fetch pincode data');
        }
    }
});





function showOrderConfirmationPopup(order, isPaid) {
    const popup = document.createElement('div');
    popup.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:999999;display:flex;align-items:center;justify-content:center;';
    popup.innerHTML = `
        <style>
            @keyframes scaleIn { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes checkmark { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        </style>
        <div style="background:white;padding:40px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.3);max-width:500px;width:90%;animation:scaleIn 0.4s;text-align:center;">
            <svg width="80" height="80" viewBox="0 0 52 52" style="margin:0 auto 20px;">
                <circle cx="26" cy="26" r="25" fill="#28a745"/>
                <path fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M14 27l7.5 7.5L38 18" style="stroke-dasharray:100;stroke-dashoffset:100;animation:checkmark 0.6s 0.3s forwards;"/>
            </svg>
            <h2 style="color:#28a745;font-size:28px;margin:0 0 10px 0;font-weight:800;">Order Placed Successfully!</h2>
            <p style="color:#666;font-size:16px;margin:0 0 25px 0;">Thank you for your purchase</p>
            <div style="background:#f8f9fa;padding:20px;border-radius:12px;margin:20px 0;">
                <div style="display:flex;justify-content:space-between;margin:8px 0;">
                    <span style="color:#666;font-weight:600;">Order ID:</span>
                    <span style="color:#333;font-weight:700;">#${order.id}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin:8px 0;">
                    <span style="color:#666;font-weight:600;">Total Amount:</span>
                    <span style="color:#8b0000;font-weight:700;font-size:20px;">₹${order.total}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin:8px 0;">
                    <span style="color:#666;font-weight:600;">Payment Status:</span>
                    <span style="color:#28a745;font-weight:700;">${isPaid ? '✅ Paid' : '💵 COD'}</span>
                </div>
            </div>
            <div style="background:#e7f5ff;padding:15px;border-radius:10px;margin:20px 0;border-left:4px solid #17a2b8;">
                <p style="margin:0;color:#0c5460;font-size:14px;font-weight:600;">📦 Your order will be delivered in 5-7 business days</p>
            </div>
            <div style="display:flex;gap:12px;margin-top:25px;">
                <button onclick="window.location.href='user-dashboard.html'" style="flex:1;background:#6c757d;color:white;border:none;padding:14px;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;">Track Order</button>
                <button onclick="window.location.href='index.html'" style="flex:1;background:#8b0000;color:white;border:none;padding:14px;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;">Go to Home</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

document.addEventListener('DOMContentLoaded', loadCheckout);
