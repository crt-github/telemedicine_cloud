const API_URL = 'http://localhost:5000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMsg.style.display = 'none';
            errorMsg.textContent = '';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Login Success
                    // Store token
                    localStorage.setItem('telemed_token', data.token);
                    localStorage.setItem('telemed_user', JSON.stringify({
                        name: data.name,
                        email: data.email,
                        role: data.role
                    }));

                    if (rememberMe) {
                        localStorage.setItem('telemed_remember_email', email);
                    } else {
                        localStorage.removeItem('telemed_remember_email');
                    }

                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    // Login Failed
                    throw new Error(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login Error:', error);
                errorMsg.textContent = error.message;
                errorMsg.style.display = 'block';

                // Shake animation for visual feedback
                const card = document.querySelector('.auth-card');
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 500);
            }
        });
    }

    // Check for saved email
    const savedEmail = localStorage.getItem('telemed_remember_email');
    if (savedEmail) {
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.value = savedEmail;
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
