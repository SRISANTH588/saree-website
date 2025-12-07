function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        alert('Access denied!');
        window.location.href = 'login.html';
    }
}

function loadDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('delivered-orders').textContent = deliveredOrders;

    loadOrders();
    loadCoupons();
    loadProducts();
    loadUsers();
    loadExchanges();
    loadSupportTickets();
    loadAdmins();
    loadAbandonedPayments();
    loadNotifications();
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productsList = document.getElementById('products-list');
    const productDetails = JSON.parse(localStorage.getItem('productDetails')) || {};
    
    productsList.innerHTML = products.map(product => {
        const details = productDetails[product.id] || {
            description: 'No custom description',
            features: ['No custom features']
        };
        
        return `
        <div class="product-item" style="display:block;padding:20px;margin-bottom:20px;background:#f9f9f9;border-radius:10px;">
            <div style="display:flex;gap:15px;margin-bottom:15px;">
                <img src="${product.image}" style="width:100px;height:100px;object-fit:cover;border-radius:8px;">
                <div style="flex:1;">
                    <p style="font-size:1.2rem;font-weight:bold;">${product.name}</p>
                    <p style="color:#8b0000;">₹${product.originalPrice} → ₹${product.discountedPrice} (${product.discount}% OFF)</p>
                </div>
            </div>
            <div style="background:white;padding:15px;border-radius:8px;margin-bottom:15px;">
                <p style="font-weight:600;color:#8b0000;">Description:</p>
                <p style="color:#666;">${details.description}</p>
                <p style="font-weight:600;color:#8b0000;margin-top:10px;">Features:</p>
                <ul style="color:#666;">${details.features.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button class="btn-edit" onclick="editProduct(${product.id})">Edit Price</button>
                <button class="btn-edit" onclick="editProductDescription(${product.id})">Edit Description</button>
                <button class="btn-edit" onclick="editProductFeatures(${product.id})">Edit Features</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
        `;
    }).join('');
}

function editProductDescription(id) {
    const productDetails = JSON.parse(localStorage.getItem('productDetails')) || {};
    const details = productDetails[id] || { description: 'Experience the elegance and tradition with our premium saree collection.', features: ['Premium quality fabric'] };
    
    const description = prompt('Product Description:', details.description);
    if (description === null) return;
    
    productDetails[id] = { ...details, description: description };
    localStorage.setItem('productDetails', JSON.stringify(productDetails));
    alert('Description updated!');
    loadProducts();
}

function editProductFeatures(id) {
    const productDetails = JSON.parse(localStorage.getItem('productDetails')) || {};
    const details = productDetails[id] || { description: 'Experience the elegance and tradition with our premium saree collection.', features: ['Premium quality fabric'] };
    
    let html = '<div id="features-editor" style="background:white;padding:20px;border-radius:10px;margin:20px 0;border:2px solid #8b0000;">';
    html += '<h3>Edit Features</h3>';
    details.features.forEach((feature, index) => {
        html += `<div style="margin:10px 0;display:flex;gap:10px;align-items:center;"><input type="text" id="feature-${index}" value="${feature}" style="flex:1;padding:10px;border:2px solid #ddd;border-radius:5px;"> <button onclick="removeFeature(${index})" class="btn-delete" style="padding:10px 15px;">Remove</button></div>`;
    });
    html += '<button onclick="addNewFeature()" class="btn-add" style="margin:10px 0;">Add Feature</button><br>';
    html += `<button onclick="saveFeaturesEdit(${id})" class="btn-submit" style="margin:10px 5px 0 0;">Save</button>`;
    html += '<button onclick="cancelFeaturesEdit()" class="btn-delete" style="margin:10px 0 0 5px;">Cancel</button></div>';
    
    const productsList = document.getElementById('products-list');
    productsList.insertAdjacentHTML('afterbegin', html);
    document.getElementById('features-editor').scrollIntoView({ behavior: 'smooth' });
}

function removeFeature(index) {
    const input = document.getElementById(`feature-${index}`);
    if (input) input.parentElement.remove();
}

function addNewFeature() {
    const editor = document.getElementById('features-editor');
    const lastButton = editor.querySelector('button[onclick^="addNewFeature"]');
    const newIndex = Date.now();
    const newFeature = document.createElement('div');
    newFeature.style.cssText = 'margin:10px 0;display:flex;gap:10px;align-items:center;';
    newFeature.innerHTML = `<input type="text" id="feature-${newIndex}" placeholder="New feature" style="flex:1;padding:10px;border:2px solid #ddd;border-radius:5px;"> <button onclick="removeFeature(${newIndex})" class="btn-delete" style="padding:10px 15px;">Remove</button>`;
    lastButton.parentElement.insertBefore(newFeature, lastButton);
}

function saveFeaturesEdit(id) {
    const inputs = document.querySelectorAll('#features-editor input[type="text"]');
    const features = Array.from(inputs).map(input => input.value.trim()).filter(f => f !== '');
    
    if (features.length === 0) {
        alert('Please add at least one feature');
        return;
    }
    
    const productDetails = JSON.parse(localStorage.getItem('productDetails')) || {};
    const details = productDetails[id] || { description: 'Experience the elegance and tradition with our premium saree collection.', features: [] };
    productDetails[id] = { ...details, features: features };
    localStorage.setItem('productDetails', JSON.stringify(productDetails));
    
    cancelFeaturesEdit();
    alert('Features updated!');
    loadProducts();
}

function cancelFeaturesEdit() {
    const editor = document.getElementById('features-editor');
    if (editor) editor.remove();
}

function loadCoupons() {
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    const couponsList = document.getElementById('coupons-list');
    
    if (coupons.length === 0) {
        couponsList.innerHTML = '<p style="color:#666;">No coupons available</p>';
        return;
    }
    
    couponsList.innerHTML = coupons.map(coupon => `
        <div style="background:#f9f9f9;padding:20px;margin:10px 0;border-radius:10px;">
            <p style="font-size:1.2rem;font-weight:bold;color:#8b0000;">${coupon.code}</p>
            <p style="color:#666;">Discount: ${coupon.discount}%</p>
            <button class="btn-delete" onclick="deleteCoupon('${coupon.code}')">Delete</button>
        </div>
    `).join('');
}

function addCoupon() {
    const code = prompt('Coupon Code:');
    if (!code) return;
    
    const discount = prompt('Discount %:');
    if (!discount) return;
    
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    coupons.push({ code: code.toUpperCase(), discount: parseFloat(discount) });
    localStorage.setItem('coupons', JSON.stringify(coupons));
    alert('Coupon added!');
    loadCoupons();
}

function deleteCoupon(code) {
    if (!confirm('Delete this coupon?')) return;
    
    let coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    coupons = coupons.filter(c => c.code !== code);
    localStorage.setItem('coupons', JSON.stringify(coupons));
    alert('Coupon deleted!');
    loadCoupons();
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersList = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="color:#666;">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map((order, index) => `
        <div style="background:#f9f9f9;padding:20px;margin:10px 0;border-radius:10px;border-left:5px solid ${order.status === 'Delivered' ? '#28a745' : '#ffc107'};">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">
                <div>
                    <p style="margin:0;"><strong>Order #${order.id}</strong></p>
                    <p style="margin:5px 0;color:#666;">Date: ${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span style="padding:5px 15px;background:${order.status === 'Delivered' ? '#28a745' : '#ffc107'};color:white;border-radius:20px;font-size:0.9rem;font-weight:600;">${order.status}</span>
            </div>
            <p style="margin:5px 0;">Customer: ${order.customerName}</p>
            <p style="margin:5px 0;">Phone: ${order.customerPhone}</p>
            <p style="margin:5px 0;font-weight:600;color:#8b0000;">Total: ₹${order.total}</p>
            <div style="display:flex;gap:10px;margin-top:15px;flex-wrap:wrap;">
                ${order.status === 'Pending' || order.status === 'Confirmed' ? `
                    <button class="btn-submit" onclick="updateOrderStatus(${index}, 'Accepted')">✅ Accept Order</button>
                ` : ''}
                ${order.status === 'Accepted' ? `
                    <button class="btn-submit" onclick="updateOrderStatus(${index}, 'Packaged')">📦 Mark as Packaged</button>
                    <button class="btn-edit" onclick="updateOrderStatus(${index}, 'Confirmed')">↩️ Revert to Confirmed</button>
                ` : ''}
                ${order.status === 'Packaged' ? `
                    <button class="btn-submit" onclick="updateOrderStatus(${index}, 'Picked by Courier')">🚚 Picked by Courier</button>
                    <button class="btn-edit" onclick="updateOrderStatus(${index}, 'Accepted')">↩️ Revert to Accepted</button>
                ` : ''}
                ${order.status === 'Picked by Courier' ? `
                    <button class="btn-submit" onclick="updateOrderStatus(${index}, 'Delivered')">🎉 Mark as Delivered</button>
                    <button class="btn-edit" onclick="updateOrderStatus(${index}, 'Packaged')">↩️ Revert to Packaged</button>
                ` : ''}
                ${order.status === 'Delivered' ? `
                    <button class="btn-edit" onclick="updateOrderStatus(${index}, 'Picked by Courier')">↩️ Revert to Picked</button>
                ` : ''}
                <button class="btn-delete" onclick="deleteOrder(${index})">❌ Reject Order</button>
            </div>
        </div>
    `).join('');
}

function updateOrderStatus(index, status) {
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
    loadOrders();
    loadDashboard();
}

function deleteOrder(index) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
    loadDashboard();
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usersList = document.getElementById('users-list');
    
    if (users.length === 0) {
        usersList.innerHTML = '<p style="color:#666;">No users registered</p>';
        return;
    }
    
    usersList.innerHTML = users.map(user => `
        <div style="background:#f9f9f9;padding:20px;margin:10px 0;border-radius:10px;">
            <p><strong>${user.username}</strong></p>
            <p>Email: ${user.email || 'N/A'}</p>
        </div>
    `).join('');
}

function loadAdmins() {
    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    const adminsList = document.getElementById('admins-list');
    
    if (admins.length === 0) {
        adminsList.innerHTML = '<p style="color:#666;">No admins</p>';
        return;
    }
    
    adminsList.innerHTML = admins.map(admin => `
        <div style="background:#f9f9f9;padding:20px;margin:10px 0;border-radius:10px;">
            <p><strong>${admin.username}</strong></p>
            <p>Email: ${admin.email || 'N/A'}</p>
        </div>
    `).join('');
}

function showAddAdminForm() {
    document.getElementById('add-admin-form').style.display = 'block';
}

function hideAddAdminForm() {
    document.getElementById('add-admin-form').style.display = 'none';
}

function saveNewAdmin() {
    const username = document.getElementById('new-admin-username').value;
    const email = document.getElementById('new-admin-email').value;
    const password = document.getElementById('new-admin-password').value;
    
    if (!username || !password) {
        alert('Username and password are required');
        return;
    }
    
    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    admins.push({ username, email, password, role: 'admin' });
    localStorage.setItem('admins', JSON.stringify(admins));
    alert('Admin added!');
    hideAddAdminForm();
    loadAdmins();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function updateWebsiteName() {
    const name = document.getElementById('website-name').value;
    localStorage.setItem('websiteName', name);
    alert('Website name updated! Refresh the page to see changes.');
    location.reload();
}

function updateWelcomeTitle() {
    const title = document.getElementById('welcome-title').value;
    localStorage.setItem('welcomeTitle', title);
    alert('Welcome title updated! Refresh the page to see changes.');
}

function updateWelcomeSubtitle() {
    const subtitle = document.getElementById('welcome-subtitle').value;
    localStorage.setItem('welcomeSubtitle', subtitle);
    alert('Welcome subtitle updated! Refresh the page to see changes.');
}

function updateContactInfo() {
    const contactInfo = {
        phone1: document.getElementById('contact-phone1').value,
        phone2: document.getElementById('contact-phone2').value,
        email: document.getElementById('contact-email').value,
        address: document.getElementById('contact-address').value,
        hours: document.getElementById('contact-hours').value
    };
    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    alert('Contact info updated!');
}

function updateProductPageSettings() {
    const productDescription = document.getElementById('product-description').value;
    const productFeatures = document.getElementById('product-features').value;
    localStorage.setItem('productDescription', productDescription);
    localStorage.setItem('productFeatures', productFeatures);
    alert('Product page settings updated!');
}

function updatePopupSettings() {
    const popupSettings = {
        title: document.getElementById('popup-title').value,
        message: document.getElementById('popup-message').value,
        coupon: document.getElementById('popup-coupon').value,
        discount: document.getElementById('popup-discount').value,
        image: ''
    };
    
    const imageFile = document.getElementById('popup-image').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            popupSettings.image = e.target.result;
            localStorage.setItem('popupSettings', JSON.stringify(popupSettings));
            alert('Popup settings updated!');
        };
        reader.readAsDataURL(imageFile);
    } else {
        localStorage.setItem('popupSettings', JSON.stringify(popupSettings));
        alert('Popup settings updated!');
    }
}

function updatePaymentSettings() {
    const razorpayKey = document.getElementById('razorpay-key').value.trim();
    if (!razorpayKey) {
        alert('Please enter Razorpay API key');
        return;
    }
    
    const adminSettings = JSON.parse(localStorage.getItem('adminSettings')) || {};
    adminSettings.razorpayKey = razorpayKey;
    localStorage.setItem('adminSettings', JSON.stringify(adminSettings));
    alert('Payment settings updated!');
}

function editWebsiteNameQuick() {
    const name = prompt('Website Name:', localStorage.getItem('websiteName') || 'Lakshmi Sarees');
    if (name) {
        localStorage.setItem('websiteName', name);
        location.reload();
    }
}

function loadExchanges() {
    const exchanges = JSON.parse(localStorage.getItem('exchanges')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const exchangesList = document.getElementById('exchanges-list');
    
    if (exchanges.length === 0) {
        exchangesList.innerHTML = '<p style="color:#666;">No exchange requests</p>';
        return;
    }
    
    exchangesList.innerHTML = exchanges.map((exchange, index) => {
        const order = orders.find(o => o.id === exchange.orderId);
        return `
        <div style="background:#f9f9f9;padding:20px;margin:10px 0;border-radius:10px;">
            <p><strong>Order #${exchange.orderId}</strong></p>
            <p>Customer: ${exchange.customerName || (order ? order.customerName : 'N/A')}</p>
            <p>Phone: ${exchange.customerPhone || (order ? order.customerPhone : 'N/A')}</p>
            <p>Reason: ${exchange.reason}</p>
            ${exchange.details ? `<p>Details: ${exchange.details}</p>` : ''}
            ${exchange.bankDetails ? `
                <div style="background:white;padding:15px;border-radius:8px;margin:10px 0;border-left:4px solid #007bff;">
                    <p style="margin:5px 0;font-weight:600;color:#007bff;">Refund Details:</p>
                    <p style="margin:5px 0;">Bank Name: ${exchange.bankDetails.bankName}</p>
                    <p style="margin:5px 0;">Account Holder Name: ${exchange.bankDetails.accountName}</p>
                    <p style="margin:5px 0;">Account Number: ${exchange.bankDetails.accountNumber}</p>
                    <p style="margin:5px 0;">IFSC Code: ${exchange.bankDetails.ifscCode}</p>
                    <p style="margin:5px 0;">UPI ID: ${exchange.bankDetails.upiId}</p>
                </div>
            ` : ''}
            <p>Date: ${new Date(exchange.date).toLocaleDateString()}</p>
            <p>Status: <span style="color:${exchange.status === 'Approved' ? 'green' : exchange.status === 'Rejected' ? 'red' : 'orange'};font-weight:600;">${exchange.status}</span></p>
            ${exchange.status === 'Pending' ? `
                <button class="btn-submit" onclick="updateExchangeStatus(${index}, 'Approved')">Approve</button>
                <button class="btn-delete" onclick="updateExchangeStatus(${index}, 'Rejected')">Reject</button>
            ` : ''}
            <button class="btn-delete" onclick="deleteExchange(${index})">🗑️ Delete</button>
        </div>
        `;
    }).join('');
}

function updateExchangeStatus(index, status) {
    const exchanges = JSON.parse(localStorage.getItem('exchanges')) || [];
    exchanges[index].status = status;
    localStorage.setItem('exchanges', JSON.stringify(exchanges));
    alert(`Exchange request ${status.toLowerCase()}!`);
    loadExchanges();
}

function deleteExchange(index) {
    let exchanges = JSON.parse(localStorage.getItem('exchanges')) || [];
    exchanges.splice(index, 1);
    localStorage.setItem('exchanges', JSON.stringify(exchanges));
    loadExchanges();
}

function loadSupportTickets() {
    const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const supportList = document.getElementById('support-list');
    
    if (tickets.length === 0) {
        supportList.innerHTML = '<p style="color:#666;">No support tickets</p>';
        return;
    }
    
    supportList.innerHTML = tickets.map((ticket, index) => {
        const order = orders.find(o => o.id === ticket.orderId);
        return `
        <div style="background:#f9f9f9;padding:20px;margin:10px 0;border-radius:10px;">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:15px;">
                <div>
                    <p style="margin:5px 0;"><strong>Order #${ticket.orderId}</strong></p>
                    <p style="margin:5px 0;color:#666;">Date: ${new Date(ticket.date).toLocaleDateString()} ${new Date(ticket.date).toLocaleTimeString()}</p>
                </div>
                <span style="padding:5px 15px;background:${ticket.status === 'Resolved' ? '#28a745' : '#ffc107'};color:white;border-radius:20px;font-weight:600;font-size:0.9rem;">${ticket.status}</span>
            </div>
            <div style="background:white;padding:15px;border-radius:8px;margin:10px 0;">
                <p style="margin:5px 0;"><strong>Customer Details:</strong></p>
                <p style="margin:5px 0;color:#666;">Name: ${order ? order.customerName : 'N/A'}</p>
                <p style="margin:5px 0;color:#666;">Phone: <a href="tel:${order ? order.customerPhone : ''}" style="color:#8b0000;text-decoration:none;">${order ? order.customerPhone : 'N/A'}</a></p>
                <p style="margin:5px 0;color:#666;">Email: <a href="mailto:${order ? order.customerEmail : ''}" style="color:#8b0000;text-decoration:none;">${order ? order.customerEmail : 'N/A'}</a></p>
                <p style="margin:5px 0;color:#666;">Preferred Contact: ${ticket.contactMethod || 'N/A'}</p>
                <p style="margin:5px 0;color:#666;">Address: ${order ? order.customerAddress + ', ' + order.customerCity + ', ' + order.customerState + ' - ' + order.customerPincode : 'N/A'}</p>
            </div>
            <div style="background:#fff5f5;padding:15px;border-radius:8px;margin:10px 0;border-left:4px solid #8b0000;">
                <p style="margin:0;"><strong>Type:</strong> ${ticket.ticketType || 'Support Request'}</p>
                ${ticket.productName ? `<p style="margin:5px 0;"><strong>Product:</strong> ${ticket.productName}</p>` : ''}
                <p style="margin:5px 0;"><strong>Category:</strong> ${ticket.category || 'N/A'}</p>
                <p style="margin:10px 0 0 0;"><strong>Issue:</strong></p>
                <p style="margin:10px 0;color:#333;">${ticket.issue}</p>
            </div>
            ${order ? `
            <div style="background:white;padding:15px;border-radius:8px;margin:10px 0;">
                <p style="margin:5px 0;"><strong>Order Items:</strong></p>
                ${order.items.map(item => `<p style="margin:5px 0;color:#666;">• ${item.name} (Qty: ${item.quantity})</p>`).join('')}
                <p style="margin:10px 0 5px 0;color:#8b0000;font-weight:600;">Total: ₹${order.total}</p>
            </div>
            ` : ''}
            <div style="display:flex;gap:10px;margin-top:15px;">
                ${ticket.status === 'Open' ? `
                    <button class="btn-submit" onclick="resolveTicket(${index})">Mark as Resolved</button>
                    <a href="tel:${order ? order.customerPhone : ''}" class="btn-edit" style="display:inline-block;text-decoration:none;padding:10px 20px;">📞 Call</a>
                    <a href="mailto:${order ? order.customerEmail : ''}" class="btn-edit" style="display:inline-block;text-decoration:none;padding:10px 20px;">✉️ Email</a>
                    <button class="btn-edit" onclick="addNoteToTicket(${index})">Add Note</button>
                ` : ''}
                <button class="btn-delete" onclick="deleteTicket(${index})">🗑️ Delete</button>
            </div>
            ${ticket.notes ? `
            <div style="background:#f0f0f0;padding:10px;border-radius:5px;margin-top:10px;">
                <p style="margin:0;font-size:0.9rem;color:#666;"><strong>Admin Notes:</strong> ${ticket.notes}</p>
            </div>
            ` : ''}
        </div>
        `;
    }).join('');
}

function addNoteToTicket(index) {
    const note = prompt('Add admin note:');
    if (!note) return;
    
    const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    tickets[index].notes = (tickets[index].notes || '') + '\n[' + new Date().toLocaleString() + '] ' + note;
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    alert('Note added!');
    loadSupportTickets();
}

function resolveTicket(index) {
    if (!confirm('Mark this ticket as resolved?')) return;
    const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    tickets[index].status = 'Resolved';
    tickets[index].resolvedDate = new Date().toISOString();
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    alert('Ticket marked as resolved!');
    loadSupportTickets();
}

function deleteTicket(index) {
    let tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    tickets.splice(index, 1);
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    loadSupportTickets();
}

function loadAbandonedPayments() {
    const abandoned = JSON.parse(localStorage.getItem('abandonedPayments')) || [];
    const current = JSON.parse(localStorage.getItem('currentPaymentAttempt'));
    const abandonedList = document.getElementById('abandoned-list');
    
    const allAbandoned = [...abandoned];
    if (current) allAbandoned.push(current);
    
    if (allAbandoned.length === 0) {
        abandonedList.innerHTML = '<p style="color:#666;">No abandoned payments</p>';
        return;
    }
    
    abandonedList.innerHTML = allAbandoned.reverse().map((payment, index) => `
        <div style="background:#fff3cd;padding:20px;margin:10px 0;border-radius:10px;border-left:5px solid #ffc107;">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">
                <div>
                    <p style="margin:0;"><strong>${payment.customerName}</strong></p>
                    <p style="margin:5px 0;color:#666;">Date: ${new Date(payment.date).toLocaleString()}</p>
                </div>
                <span style="padding:5px 15px;background:#ffc107;color:#000;border-radius:20px;font-size:0.9rem;font-weight:600;">${payment.status}</span>
            </div>
            <p style="margin:5px 0;">Phone: <a href="tel:${payment.customerPhone}" style="color:#8b0000;">${payment.customerPhone}</a></p>
            <p style="margin:5px 0;">Email: <a href="mailto:${payment.customerEmail}" style="color:#8b0000;">${payment.customerEmail}</a></p>
            <p style="margin:5px 0;">Payment Method: ${payment.paymentMethod === 'upi' ? 'UPI' : 'Card'}</p>
            <p style="margin:5px 0;font-weight:600;color:#8b0000;">Amount: ₹${payment.amount}</p>
            <div style="background:white;padding:10px;border-radius:5px;margin-top:10px;">
                <p style="margin:5px 0;font-weight:600;">Items:</p>
                ${payment.items.map(item => `<p style="margin:5px 0;color:#666;">• ${item.name} (Qty: ${item.quantity})</p>`).join('')}
            </div>
        </div>
    `).join('');
}

function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (unreadCount > 0) {
        document.getElementById('notifications-badge').style.display = 'block';
        document.getElementById('notification-count').textContent = unreadCount;
    } else {
        document.getElementById('notifications-badge').style.display = 'none';
    }
    
    const notificationsList = document.getElementById('notifications-list');
    if (notifications.length === 0) {
        notificationsList.innerHTML = '<p style="color:#666;">No notifications</p>';
        return;
    }
    
    notificationsList.innerHTML = notifications.reverse().map((notif, index) => `
        <div style="background:${notif.read ? '#f9f9f9' : '#fff3cd'};padding:20px;margin:10px 0;border-radius:10px;border-left:5px solid ${notif.read ? '#ddd' : '#ffc107'};">
            <div style="display:flex;justify-content:space-between;align-items:start;">
                <div style="flex:1;">
                    <p style="margin:0;font-weight:bold;color:#8b0000;">${notif.type}</p>
                    <p style="margin:5px 0;color:#666;">${notif.message}</p>
                    ${notif.orderId ? `<p style="margin:5px 0;">Order ID: #${notif.orderId}</p>` : ''}
                    ${notif.customerName ? `<p style="margin:5px 0;">Customer: ${notif.customerName}</p>` : ''}
                    ${notif.total ? `<p style="margin:5px 0;font-weight:600;color:#8b0000;">Amount: ₹${notif.total}</p>` : ''}
                    <p style="margin:5px 0;font-size:0.9rem;color:#999;">${new Date(notif.date).toLocaleString()}</p>
                </div>
                ${!notif.read ? `<button class="btn-submit" onclick="markAsRead(${notifications.length - 1 - index})" style="padding:8px 15px;">Mark Read</button>` : ''}
            </div>
        </div>
    `).join('');
}

function showNotifications() {
    showTab('notifications');
}

function markAsRead(index) {
    const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
    notifications[index].read = true;
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    loadNotifications();
}

function clearAllNotifications() {
    if (!confirm('Clear all notifications?')) return;
    localStorage.setItem('adminNotifications', JSON.stringify([]));
    loadNotifications();
}

window.onload = function() {
    checkAdminAuth();
    loadDashboard();
    
    const adminSettings = JSON.parse(localStorage.getItem('adminSettings')) || {};
    if (adminSettings.razorpayKey) {
        document.getElementById('razorpay-key').value = adminSettings.razorpayKey;
    }
    
    const websiteName = localStorage.getItem('websiteName') || 'Lakshmi Sarees';
    document.getElementById('website-name').value = websiteName;
    
    const welcomeTitle = localStorage.getItem('welcomeTitle') || 'Welcome to Lakshmi Sarees';
    document.getElementById('welcome-title').value = welcomeTitle;
    
    const welcomeSubtitle = localStorage.getItem('welcomeSubtitle') || 'Discover the finest collection of traditional and designer sarees';
    document.getElementById('welcome-subtitle').value = welcomeSubtitle;
    
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo')) || {};
    if (contactInfo.phone1) document.getElementById('contact-phone1').value = contactInfo.phone1;
    if (contactInfo.phone2) document.getElementById('contact-phone2').value = contactInfo.phone2;
    if (contactInfo.email) document.getElementById('contact-email').value = contactInfo.email;
    if (contactInfo.address) document.getElementById('contact-address').value = contactInfo.address;
    if (contactInfo.hours) document.getElementById('contact-hours').value = contactInfo.hours;
    
    const productDescription = localStorage.getItem('productDescription');
    if (productDescription) document.getElementById('product-description').value = productDescription;
    
    const productFeatures = localStorage.getItem('productFeatures');
    if (productFeatures) document.getElementById('product-features').value = productFeatures;
    
    const popupSettings = JSON.parse(localStorage.getItem('popupSettings')) || {};
    if (popupSettings.title) document.getElementById('popup-title').value = popupSettings.title;
    if (popupSettings.message) document.getElementById('popup-message').value = popupSettings.message;
    if (popupSettings.coupon) document.getElementById('popup-coupon').value = popupSettings.coupon;
    if (popupSettings.discount) document.getElementById('popup-discount').value = popupSettings.discount;
};

function showAddProductForm() {
    document.getElementById('add-product-form').style.display = 'block';
}

function hideAddProductForm() {
    document.getElementById('add-product-form').style.display = 'none';
    document.getElementById('new-product-name').value = '';
    document.getElementById('new-product-image').value = '';
    document.getElementById('new-product-original-price').value = '';
    document.getElementById('new-product-discounted-price').value = '';
    document.getElementById('new-product-discount').value = '';
    document.getElementById('new-product-description').value = '';
    document.getElementById('new-product-features').value = '';
}

function saveNewProduct() {
    const name = document.getElementById('new-product-name').value;
    const imageFile = document.getElementById('new-product-image').files[0];
    const originalPrice = document.getElementById('new-product-original-price').value;
    const discountedPrice = document.getElementById('new-product-discounted-price').value;
    const discount = document.getElementById('new-product-discount').value;
    const description = document.getElementById('new-product-description').value;
    const features = document.getElementById('new-product-features').value;

    if (!name || !imageFile || !originalPrice || !discountedPrice || !discount) {
        alert('Please fill in all required fields (name, image, prices, discount)');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        const newProduct = {
            id: newId,
            name: name,
            image: e.target.result,
            originalPrice: parseFloat(originalPrice),
            discountedPrice: parseFloat(discountedPrice),
            discount: parseFloat(discount)
        };
        
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        
        if (description || features) {
            const productDetails = JSON.parse(localStorage.getItem('productDetails')) || {};
            productDetails[newId] = {
                description: description || 'Experience the elegance and tradition with our premium saree collection.',
                features: features ? features.split('\n').filter(f => f.trim() !== '') : ['Premium quality fabric', 'Traditional craftsmanship']
            };
            localStorage.setItem('productDetails', JSON.stringify(productDetails));
        }
        
        alert('Product added successfully!');
        hideAddProductForm();
        loadProducts();
    };
    reader.readAsDataURL(imageFile);
}

function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    if (!product) return;

    const originalPrice = prompt('Original Price:', product.originalPrice);
    if (!originalPrice) return;
    
    const discountedPrice = prompt('Discounted Price:', product.discountedPrice);
    if (!discountedPrice) return;
    
    const discount = prompt('Discount %:', product.discount);
    if (!discount) return;

    product.originalPrice = parseFloat(originalPrice);
    product.discountedPrice = parseFloat(discountedPrice);
    product.discount = parseFloat(discount);

    localStorage.setItem('products', JSON.stringify(products));
    alert('Product updated!');
    loadProducts();
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    
    const productDetails = JSON.parse(localStorage.getItem('productDetails')) || {};
    delete productDetails[id];
    localStorage.setItem('productDetails', JSON.stringify(productDetails));
    
    alert('Product deleted!');
    loadProducts();
}
