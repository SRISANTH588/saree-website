const urlParams = new URLSearchParams(window.location.search);
const orderId = parseInt(urlParams.get('orderId'));

function loadOrderAddress() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Order not found');
        window.location.href = 'user-dashboard.html';
        return;
    }
    
    const orderTime = new Date(order.date).getTime();
    const currentTime = new Date().getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    if ((currentTime - orderTime) >= oneDayInMs) {
        alert('Address can only be edited within 24 hours of order placement');
        window.location.href = 'user-dashboard.html';
        return;
    }
    
    document.getElementById('address').value = order.customerAddress;
    document.getElementById('pincode').value = order.customerPincode;
    document.getElementById('city').value = order.customerCity;
    document.getElementById('state').value = order.customerState;
}

document.getElementById('pincode').addEventListener('input', async function(e) {
    const pincode = e.target.value;
    if (pincode.length === 6) {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            if (data[0].Status === 'Success' && data[0].PostOffice) {
                const postOffice = data[0].PostOffice[0];
                document.getElementById('city').value = postOffice.District;
                document.getElementById('state').value = postOffice.State;
            }
        } catch (error) {
            console.log('Could not fetch pincode data');
        }
    }
});

document.getElementById('edit-address-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Order not found');
        return;
    }
    
    order.customerAddress = document.getElementById('address').value;
    order.customerPincode = document.getElementById('pincode').value;
    order.customerCity = document.getElementById('city').value;
    order.customerState = document.getElementById('state').value;
    
    localStorage.setItem('orders', JSON.stringify(orders));
    alert('Address updated successfully!');
    window.location.href = 'user-dashboard.html';
});

window.onload = function() {
    const websiteName = localStorage.getItem('websiteName') || 'Lakshmi Sarees';
    document.querySelectorAll('.logo').forEach(logo => logo.textContent = websiteName);
    document.title = 'Edit Address - ' + websiteName;
    loadOrderAddress();
};
