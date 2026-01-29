document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('telemed_token');

    if (!token) {
        // No token found, redirect to login
        window.location.href = 'login.html';
    } else {
        // Optional: Verify token expiry locally to avoid unneeded calls
        // For production, you might want to call an endpoint to validate token validity

        // Update UI with user info
        const userStr = localStorage.getItem('telemed_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            const userDisplay = document.querySelector('.user-name-display'); // You'll need to add this class to dashboard
            if (userDisplay) {
                userDisplay.textContent = `Welcome back, ${user.name}`;
            }
        }
    }

    // Handle Logout
    const logoutLinks = document.querySelectorAll('a[href="login.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('telemed_token');
            localStorage.removeItem('telemed_user');
            window.location.href = 'login.html';
        });
    });
});
