// Register Modal Functionality
let isRegisterModalOpen = false;

// Open register modal
function openRegisterModal() {
    const modalOverlay = document.getElementById('registerModalOverlay');
    const modal = document.getElementById('registerModal');
    
    if (modalOverlay && modal) {
        isRegisterModalOpen = true;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const firstNameInput = document.getElementById('firstName');
            if (firstNameInput) {
                firstNameInput.focus();
            }
        }, 300);
        
        console.log('Register modal opened');
    }
}

// Close register modal
function closeRegisterModal() {
    const modalOverlay = document.getElementById('registerModalOverlay');
    const modal = document.getElementById('registerModal');
    
    if (modalOverlay && modal) {
        isRegisterModalOpen = false;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form
        const form = document.getElementById('registerForm');
        if (form) {
            form.reset();
            clearPasswordRequirements();
            hidePasswordMatch();
        }
        
        console.log('Register modal closed');
    }
}

// Password validation functions
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return requirements;
}

function updatePasswordRequirements(password) {
    const requirements = validatePassword(password);
    const requirementElements = document.querySelectorAll('.requirement');
    
    requirementElements.forEach(element => {
        const requirementType = element.getAttribute('data-requirement');
        const isValid = requirements[requirementType];
        
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    });
    
    return Object.values(requirements).every(Boolean);
}

function clearPasswordRequirements() {
    const requirementElements = document.querySelectorAll('.requirement');
    requirementElements.forEach(element => {
        element.classList.remove('valid');
    });
}

function checkPasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchIndicator = document.getElementById('passwordMatch');
    
    if (confirmPassword.length > 0) {
        if (password === confirmPassword) {
            matchIndicator.classList.add('show', 'valid');
            matchIndicator.querySelector('span').textContent = 'Passwords match';
            return true;
        } else {
            matchIndicator.classList.add('show');
            matchIndicator.classList.remove('valid');
            matchIndicator.querySelector('span').textContent = 'Passwords do not match';
            return false;
        }
    } else {
        hidePasswordMatch();
        return false;
    }
}

function hidePasswordMatch() {
    const matchIndicator = document.getElementById('passwordMatch');
    matchIndicator.classList.remove('show', 'valid');
}

// Toggle password visibility for register form
function toggleRegisterPasswordVisibility(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleId);
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
function handleRegisterFormSubmit(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!agreeTerms) {
        showError('Please agree to the Terms of Service and Privacy Policy');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Password validation
    const passwordValid = updatePasswordRequirements(password);
    if (!passwordValid) {
        showError('Password does not meet all requirements');
        return;
    }
    
    // Password match validation
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    // Simulate registration process
    const submitBtn = document.querySelector('.register-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showRegistrationSuccess(email);
        
        // Close register modal
        closeRegisterModal();
        
        // Open OTP modal
        openOtpModal(email);
        
    }, 2000);
}

// Handle social registration
function handleSocialRegister(provider) {
    console.log(`Social registration with ${provider}`);
    showInfo(`Redirecting to ${provider} registration...`, 'Social Registration');
    
    // Here you would typically redirect to OAuth provider
    // window.location.href = `/auth/${provider}`;
}

// Initialize register modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal close button
    const closeButton = document.getElementById('registerModalClose');
    if (closeButton) {
        closeButton.addEventListener('click', closeRegisterModal);
    }
    
    // Close modal when clicking overlay
    const modalOverlay = document.getElementById('registerModalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeRegisterModal();
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isRegisterModalOpen) {
            closeRegisterModal();
        }
    });
    
    // Password toggle buttons
    const registerPasswordToggle = document.getElementById('registerPasswordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    
    if (registerPasswordToggle) {
        registerPasswordToggle.addEventListener('click', () => 
            toggleRegisterPasswordVisibility('registerPassword', 'registerPasswordToggle'));
    }
    
    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', () => 
            toggleRegisterPasswordVisibility('confirmPassword', 'confirmPasswordToggle'));
    }
    
    // Password validation on input
    const registerPasswordInput = document.getElementById('registerPassword');
    if (registerPasswordInput) {
        registerPasswordInput.addEventListener('input', function() {
            updatePasswordRequirements(this.value);
        });
    }
    
    // Password match validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }
    
    // Form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterFormSubmit);
    }
    
    // Social registration button
    const googleRegisterBtn = document.querySelector('#registerModalOverlay .gsi-material-button');
    if (googleRegisterBtn) {
        googleRegisterBtn.addEventListener('click', () => handleSocialRegister('Google'));
    }
    
    // Make functions globally available
    window.openRegisterModal = openRegisterModal;
    window.closeRegisterModal = closeRegisterModal;
    
    console.log('Register modal functionality initialized');
});
