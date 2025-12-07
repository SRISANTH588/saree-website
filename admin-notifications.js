let currentFilter = 'all';

function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
    const listContainer = document.getElementById('notifications-list');
    
    let filteredNotifications = notifications;
    
    if (currentFilter === 'unread') {
        filteredNotifications = notifications.filter(n => !n.read);
    } else if (currentFilter === 'orders') {
        filteredNotifications = notifications.filter(n => n.type.includes('Order'));
    } else if (currentFilter === 'failed') {
        filteredNotifications = notifications.filter(n => n.type === 'Payment Failed');
    }
    
    if (filteredNotifications.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔔</div>
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = filteredNotifications.reverse().map((notif, index) => {
        const actualIndex = notifications.length - 1 - index;
        const isUnread = !notif.read;
        const isFailed = notif.type === 'Payment Failed';
        const cardClass = isFailed ? 'failed' : (isUnread ? 'unread' : '');
        
        return `
            <div class="notification-card ${cardClass}">
                <div class="notification-header">
                    <div class="notification-type">
                        ${notif.type === 'Payment Failed' ? '❌' : '🔔'} ${notif.type}
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span class="notification-date">${new Date(notif.date).toLocaleString()}</span>
                        ${isUnread ? `<button class="mark-read-btn" onclick="markAsRead(${actualIndex})">Mark Read</button>` : ''}
                    </div>
                </div>
                <div class="notification-message">${notif.message}</div>
                ${notif.customerName ? `
                    <div class="notification-details">
                        <div class="notification-detail"><strong>Customer:</strong> ${notif.customerName}</div>
                        ${notif.customerEmail ? `<div class="notification-detail"><strong>Email:</strong> ${notif.customerEmail}</div>` : ''}
                        ${notif.customerPhone ? `<div class="notification-detail"><strong>Phone:</strong> ${notif.customerPhone}</div>` : ''}
                        ${notif.amount ? `<div class="notification-detail"><strong>Amount:</strong> ₹${notif.amount}</div>` : ''}
                        ${notif.orderId ? `<div class="notification-detail"><strong>Order ID:</strong> #${notif.orderId}</div>` : ''}
                        ${notif.paymentMethod ? `<div class="notification-detail"><strong>Payment:</strong> ${notif.paymentMethod.toUpperCase()}</div>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function markAsRead(index) {
    const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
    notifications[index].read = true;
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    loadNotifications();
}

function clearAllNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        localStorage.setItem('adminNotifications', JSON.stringify([]));
        loadNotifications();
    }
}

function filterNotifications(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    loadNotifications();
}

document.addEventListener('DOMContentLoaded', loadNotifications);
