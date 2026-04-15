"use strict";
// MOCK AUTHENTICATION FOR LOCAL TESTING (File Protocol)
// const API_URL = 'http://localhost:5000/api/auth'; // Disabled for mock
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');
    if (loginForm && errorMsg) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMsg.style.display = 'none';
            errorMsg.textContent = '';
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const rememberMeInput = document.getElementById('rememberMe');
            if (!emailInput || !passwordInput || !rememberMeInput)
                return;
            const email = emailInput.value;
            const password = passwordInput.value;
            const rememberMe = rememberMeInput.checked;
            // --- MOCK LOGIN LOGIC START ---
            console.log("Attempting mock login...", email);
            // Simulate network delay
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
                setTimeout(() => {
                    // HARDCODED CREDENTIALS CHECK
                    if (email === 'doctor@hospital.com' && password === 'password123') {
                        // SUCCESS
                        console.log("Mock login successful");
                        const mockData = {
                            token: "mock_jwt_token_xyz_123",
                            name: "Dr. T. Cori",
                            email: "doctor@hospital.com",
                            role: "doctor"
                        };
                        localStorage.setItem('telemed_token', mockData.token);
                        localStorage.setItem('telemed_user', JSON.stringify({
                            name: mockData.name,
                            email: mockData.email,
                            role: mockData.role
                        }));
                        if (rememberMe) {
                            localStorage.setItem('telemed_remember_email', email);
                        }
                        else {
                            localStorage.removeItem('telemed_remember_email');
                        }
                        // Redirect
                        window.location.href = 'dashboard.html';
                    }
                    else {
                        // FAILURE
                        console.log("Mock login failed");
                        errorMsg.textContent = "Invalid credentials (Mock: use doctor@hospital.com / password123)";
                        errorMsg.style.display = 'block';
                        // Shake animation
                        const card = document.querySelector('.auth-card');
                        if (card) {
                            card.classList.add('shake');
                            setTimeout(() => card.classList.remove('shake'), 500);
                        }
                        // Reset button
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                }, 800); // 800ms delay
            }
            // --- MOCK LOGIN LOGIC END ---
        });
    }
    // Check for saved email
    const savedEmail = localStorage.getItem('telemed_remember_email');
    if (savedEmail) {
        const emailInput = document.getElementById('email');
        if (emailInput)
            emailInput.value = savedEmail;
    }
});
// Add shake animation style dynamically
const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
`;
document.head.appendChild(style);
