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
    
    const exchanges = JSON.parse(localStorage.getItem('exchanges')) || [];
    const existingExchange = exchanges.find(ex => ex.orderId === orderId);
    
    if (existingExchange && existingExchange.status !== 'Rejected') {
        alert('You already have an exchange request for this order.\n\nStatus: ' + existingExchange.status + '\n\nPlease check the Exchange Requests tab in My Orders.');
        window.location.href = 'user-dashboard.html';
        return;
    }
    
    document.getElementById('order-info').innerHTML = `
        <h3>Order #${order.id}</h3>
        <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
        <p>Status: ${order.status}</p>
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

document.getElementById('ifsc-code').addEventListener('input', function(e) {
    const ifscCode = e.target.value.toUpperCase();
    const bankSelect = document.getElementById('bank-name');
    const selectedOption = bankSelect.options[bankSelect.selectedIndex];
    const bankCode = selectedOption.getAttribute('data-code');
    const errorMsg = document.getElementById('ifsc-error');
    
    if (ifscCode.length >= 4 && bankCode) {
        if (!ifscCode.startsWith(bankCode)) {
            errorMsg.textContent = `IFSC code must start with ${bankCode} for ${selectedOption.text}`;
            errorMsg.style.display = 'block';
        } else {
            errorMsg.style.display = 'none';
        }
    }
});

document.getElementById('upi-id').addEventListener('input', function(e) {
    const upiId = e.target.value;
    const errorMsg = document.getElementById('upi-error');
    const upiPattern = /^[a-zA-Z0-9]+@[a-zA-Z]+$/;
    
    if (upiId && !upiPattern.test(upiId)) {
        errorMsg.textContent = 'Invalid UPI ID format (e.g., username@ybl or 9876543210@paytm)';
        errorMsg.style.display = 'block';
    } else {
        errorMsg.style.display = 'none';
    }
});

document.getElementById('exchange-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bankSelect = document.getElementById('bank-name');
    const selectedOption = bankSelect.options[bankSelect.selectedIndex];
    const bankCode = selectedOption.getAttribute('data-code');
    const ifscCode = document.getElementById('ifsc-code').value.toUpperCase();
    const upiId = document.getElementById('upi-id').value;
    
    if (!ifscCode.startsWith(bankCode)) {
        alert('IFSC code does not match the selected bank!');
        return;
    }
    
    const upiPattern = /^[a-zA-Z0-9]+@[a-zA-Z]+$/;
    if (!upiPattern.test(upiId)) {
        alert('Invalid UPI ID format!');
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const exchanges = JSON.parse(localStorage.getItem('exchanges')) || [];
    exchanges.push({
        orderId: orderId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        reason: document.getElementById('reason').value,
        details: document.getElementById('details').value,
        bankDetails: {
            bankName: bankSelect.options[bankSelect.selectedIndex].text,
            accountName: document.getElementById('account-name').value,
            accountNumber: document.getElementById('account-number').value,
            ifscCode: ifscCode,
            upiId: upiId
        },
        date: new Date().toISOString(),
        status: 'Pending'
    });
    
    localStorage.setItem('exchanges', JSON.stringify(exchanges));
    alert('✅ Exchange Request Received!\n\nThank you for your request.\n\nYour exchange request has been submitted successfully.\n\nOur customer care team will contact you soon to process your exchange.\n\nRequest ID: #' + exchanges.length);
    window.location.href = 'user-dashboard.html';
});

window.onload = function() {
    const websiteName = localStorage.getItem('websiteName') || 'Lakshmi Sarees';
    document.querySelectorAll('.logo').forEach(logo => logo.textContent = websiteName);
    const noteElement = document.getElementById('website-name-note');
    if (noteElement) noteElement.textContent = websiteName;
    document.title = 'Request Exchange - ' + websiteName;
    loadOrderInfo();
};
