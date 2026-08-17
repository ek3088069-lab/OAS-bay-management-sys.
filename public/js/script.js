function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal && window.bootstrap) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

function openSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal && window.bootstrap) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

window.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);

    if (params.get('signup') === 'true') {
        openSignupModal();
    } else if (params.get('login') === 'true') {
        openLoginModal();
    } else if (params.get('signup') === 'success') {
        openLoginModal();
    }
});

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('loginRole').value.trim();

        if (!username || !password || !role) {
            alert('Please enter your username, password, and role.');
            return;
        }

        loginForm.submit();
    });
}

const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('signupUsername').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const identifier = document.getElementById('identifier').value.trim();
        const role = document.getElementById('role').value;

        if (!username || !password || !identifier || !role) {
            alert('Please fill in all required fields.');
            return;
        }

        signupForm.submit();
    });
}