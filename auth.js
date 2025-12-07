function showTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab-btn');
    const authTabs = document.querySelector('.auth-tabs');

    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
        authTabs.classList.remove('register-active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
        authTabs.classList.add('register-active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    // Check if admin
    if (username === 'lakshmi' && password === 'sasi123') {
        localStorage.setItem('currentUser', JSON.stringify({ username: 'lakshmi', role: 'admin', email: 'admin@lakshmisarees.com' }));
        alert('Admin login successful!');
        window.location.href = 'admin-dashboard.html';
        return;
    }

    // Check other admins
    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    const admin = admins.find(a => (a.username === username || a.email === username) && a.password === password);

    if (admin) {
        localStorage.setItem('currentUser', JSON.stringify({ ...admin, role: 'admin' }));
        alert('Admin login successful!');
        window.location.href = 'admin-dashboard.html';
        return;
    }

    // Check regular users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ ...user, role: 'user' }));
        
        // Add welcome coupon for first-time login
        if (!user.hasReceivedWelcomeCoupon) {
            user.hasReceivedWelcomeCoupon = true;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === user.email);
            if (userIndex !== -1) {
                users[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(users));
            }
            alert('Login successful! 🎉\n\nWelcome Gift: Use coupon code WELCOME5 for 5% discount on your first order!');
        } else {
            alert('Login successful!');
        }
        
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password!');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email || u.phone === phone)) {
        alert('Email or phone number already exists!');
        return;
    }

    users.push({ name, phone, email, password, username: email, registeredDate: new Date().toISOString() });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! Please login.');
    showTab('login');
}

function resetPassword() {
    window.location.href = 'reset-password.html';
}
