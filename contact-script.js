document.addEventListener('DOMContentLoaded', () => {
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo')) || {
        phone1: '+91 1234567890',
        phone2: '+91 0987654321',
        email: 'info@lakshmisarees.com',
        address: '123 Saree Street, T Nagar, Chennai, Tamil Nadu - 600017',
        hours: 'Monday to Saturday, 10:00 AM - 7:00 PM'
    };
    
    // Update contact page if elements exist
    const phoneElements = document.querySelectorAll('p');
    phoneElements.forEach(el => {
        if (el.innerHTML.includes('Phone:')) {
            el.innerHTML = '<strong>Phone:</strong> ' + contactInfo.phone1 + (contactInfo.phone2 ? '<br><strong>Phone 2:</strong> ' + contactInfo.phone2 : '');
        }
        if (el.innerHTML.includes('Email:')) {
            el.innerHTML = '<strong>Email:</strong> ' + contactInfo.email;
        }
        if (el.innerHTML.includes('Address:')) {
            el.innerHTML = '<strong>Address:</strong> ' + contactInfo.address;
        }
        if (el.innerHTML.includes('Working Hours:')) {
            el.innerHTML = '<strong>Working Hours:</strong> ' + contactInfo.hours;
        }
    });
});
