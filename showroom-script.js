document.addEventListener('DOMContentLoaded', () => {
    const showroomInfo = JSON.parse(localStorage.getItem('showroomInfo')) || {
        name: 'Lakshmi Sarees - Main Showroom',
        address: '123 Saree Street, T Nagar, Chennai - 600017',
        timings: '10:00 AM - 7:00 PM (Monday to Saturday)',
        contact: '+91 1234567890'
    };
    
    // Update showroom page if elements exist
    const elements = document.querySelectorAll('p, h2');
    elements.forEach(el => {
        if (el.textContent.includes('Main Showroom')) {
            el.textContent = showroomInfo.name;
        }
        if (el.innerHTML && el.innerHTML.includes('Timings:')) {
            el.innerHTML = '<strong>Timings:</strong> ' + showroomInfo.timings;
        }
        if (el.innerHTML && el.innerHTML.includes('Contact:')) {
            el.innerHTML = '<strong>Contact:</strong> ' + showroomInfo.contact;
        }
        if (el.textContent.includes('123 Saree Street')) {
            el.textContent = showroomInfo.address;
        }
    });
});
