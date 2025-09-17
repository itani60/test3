// Login Modal Functionality
let isLoginModalOpen = false;

// Toggle login state
function toggleLoginState() {
    const mobileLoginBtn = document.querySelector('.login-btn');
    const desktopLoginBtn = document.querySelector('.header-link[onclick*="toggleLoginState"]');
    
    // Check if any login button is in logged-in state
    const isLoggedIn = (mobileLoginBtn && mobileLoginBtn.classList.contains('logged-in')) || 
                      (desktopLoginBtn && desktopLoginBtn.classList.contains('logged-in'));
    
    if (isLoggedIn) {
        // Currently logged in, show logout option
        if (confirm('Are you sure you want to logout?')) {
            updateLoginState(false);
            showInfo('You have been logged out successfully!', 'Logged Out');
        }
    } else {
        // Not logged in, open modal
        openLoginModal();
    }
}

// Open login modal
function openLoginModal() {
    const modalOverlay = document.getElementById('loginModalOverlay');
    const modal = document.getElementById('loginModal');
    
    if (modalOverlay && modal) {
        isLoginModalOpen = true;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 300);
        
        console.log('Login modal opened');
    }
}

// Close login modal
function closeLoginModal() {
    const modalOverlay = document.getElementById('loginModalOverlay');
    const modal = document.getElementById('loginModal');
    
    if (modalOverlay && modal) {
        isLoginModalOpen = false;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
        }
        
        console.log('Login modal closed');
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('passwordToggle');
    const icon = toggleButton.querySelector('i');
    
    if (passwordInput && toggleButton && icon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Handle form submission
function handleLoginFormSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Simulate login process
    const submitBtn = document.querySelector('.login-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showLoginSuccess(email);
        
        // Close modal
        closeLoginModal();
        
        // Update UI to show logged in state
        updateLoginState(true, email);
        
    }, 2000);
}

// Update login state in UI
function updateLoginState(isLoggedIn, userEmail = '') {
    const mobileLoginBtn = document.querySelector('.login-btn');
    const desktopLoginBtn = document.querySelector('.header-link[onclick*="toggleLoginState"]');
    
    // Update mobile login button
    if (mobileLoginBtn) {
        if (isLoggedIn) {
            mobileLoginBtn.innerHTML = '<i class="fas fa-user"></i> My Account';
            mobileLoginBtn.classList.add('logged-in');
            mobileLoginBtn.href = '#account';
        } else {
            mobileLoginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i>Login';
            mobileLoginBtn.classList.remove('logged-in');
            mobileLoginBtn.href = '#';
        }
    }
    
    // Update desktop login button
    if (desktopLoginBtn) {
        if (isLoggedIn) {
            desktopLoginBtn.textContent = 'My Account';
            desktopLoginBtn.classList.add('logged-in');
        } else {
            desktopLoginBtn.textContent = 'Login';
            desktopLoginBtn.classList.remove('logged-in');
        }
    }
}

// Handle social login
function handleSocialLogin(provider) {
    console.log(`Social login with ${provider}`);
    showInfo(`Redirecting to ${provider} login...`, 'Social Login');
    
    // Here you would typically redirect to OAuth provider
    // window.location.href = `/auth/${provider}`;
}

// Initialize login modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal close button
    const closeButton = document.getElementById('modalClose');
    if (closeButton) {
        closeButton.addEventListener('click', closeLoginModal);
    }
    
    // Close modal when clicking overlay
    const modalOverlay = document.getElementById('loginModalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeLoginModal();
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isLoginModalOpen) {
            closeLoginModal();
        }
    });
    
    // Password toggle
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
    }
    
    // Form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.gsi-material-button');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleSocialLogin('Google'));
    }
    
    // Make functions globally available
    window.openLoginModal = openLoginModal;
    window.closeLoginModal = closeLoginModal;
    window.toggleLoginState = toggleLoginState;
    
    console.log('Login modal functionality initialized');
});
