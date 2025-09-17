// ========================================
// AUTHENTICATION MODAL FUNCTIONALITY
// Combined script for all authentication modals
// ========================================

// Global state variables
let isLoginModalOpen = false;
let isRegisterModalOpen = false;
let isOtpModalOpen = false;
let isForgotModalOpen = false;
let isResetModalOpen = false;

// Timer variables
let countdownTimer = null;
let countdownSeconds = 60;
let resetCountdownTimer = null;
let resetCountdownSeconds = 60;

// User data variables
let currentUserEmail = '';
let resetUserEmail = '';

// ========================================
// LOGIN MODAL FUNCTIONALITY
// ========================================

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

// Toggle password visibility for login
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

// Handle login form submission
async function handleLoginFormSubmit(e) {
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
    
    const submitBtn = document.querySelector('.login-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;
        
        // Call AWS login API
        const credentials = {
            email: email,
            password: password
        };
        
        const response = await awsAuth.loginUser(credentials);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showLoginSuccess(email);
        
        // Close modal
        closeLoginModal();
        
        // Update UI to show logged in state
        updateLoginState(true, email);
        
    } catch (error) {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show error message
        showError(error.message || 'Login failed. Please check your credentials and try again.');
    }
}

// ========================================
// REGISTER MODAL FUNCTIONALITY
// ========================================

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

// Handle register form submission
async function handleRegisterFormSubmit(e) {
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
    
    const submitBtn = document.querySelector('.register-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        // Call AWS register API
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };
        
        console.log('Calling register API with data:', userData);
        const response = await awsAuth.registerUser(userData);
        console.log('Register API response:', response);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showRegistrationSuccess(email);
        
        // Close register modal
        closeRegisterModal();
        
        // Open OTP modal
        openOtpModal(email);
        
    } catch (error) {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show error message
        showError(error.message || 'Registration failed. Please try again.');
    }
}

// ========================================
// OTP MODAL FUNCTIONALITY
// ========================================

// Open OTP modal
function openOtpModal(userEmail) {
    const modalOverlay = document.getElementById('otpModalOverlay');
    const modal = document.getElementById('otpModal');
    const emailElement = document.getElementById('userEmail');
    
    if (modalOverlay && modal && emailElement) {
        isOtpModalOpen = true;
        currentUserEmail = userEmail;
        emailElement.textContent = userEmail;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first OTP input
        setTimeout(() => {
            const firstInput = document.querySelector('.otp-input[data-index="0"]');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
        
        // Start countdown
        startCountdown();
        
        console.log('OTP modal opened for:', userEmail);
    }
}

// Close OTP modal
function closeOtpModal() {
    const modalOverlay = document.getElementById('otpModalOverlay');
    const modal = document.getElementById('otpModal');
    
    if (modalOverlay && modal) {
        isOtpModalOpen = false;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear OTP inputs
        clearOtpInputs();
        
        // Stop countdown
        stopCountdown();
        
        console.log('OTP modal closed');
    }
}

// Clear OTP inputs
function clearOtpInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error');
    });
}

// Handle OTP input navigation
function handleOtpInput(e) {
    const input = e.target;
    const index = parseInt(input.getAttribute('data-index'));
    const value = input.value;
    
    // Remove error class when user starts typing
    input.classList.remove('error');
    
    // Only allow numbers
    if (!/^\d$/.test(value) && value !== '') {
        input.value = '';
        return;
    }
    
    // Add filled class if value exists
    if (value) {
        input.classList.add('filled');
        
        // Move to next input
        if (index < 5) {
            const nextInput = document.querySelector(`.otp-input[data-index="${index + 1}"]`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    } else {
        input.classList.remove('filled');
    }
    
    // Check if all inputs are filled
    checkOtpComplete();
}

// Handle backspace navigation
function handleOtpBackspace(e) {
    const input = e.target;
    const index = parseInt(input.getAttribute('data-index'));
    
    if (e.key === 'Backspace' && input.value === '' && index > 0) {
        const prevInput = document.querySelector(`.otp-input[data-index="${index - 1}"]`);
        if (prevInput) {
            prevInput.focus();
        }
    }
}

// Check if OTP is complete
function checkOtpComplete() {
    const inputs = document.querySelectorAll('#otpModalOverlay .otp-input');
    const values = Array.from(inputs).map(input => input.value);
    const isComplete = values.every(value => value !== '');
    
    console.log('OTP inputs found:', inputs.length);
    console.log('OTP values:', values);
    console.log('OTP complete:', isComplete);
    
    const verifyBtn = document.querySelector('#otpModalOverlay .verify-btn');
    if (verifyBtn) {
        verifyBtn.disabled = !isComplete;
        console.log('Verify button disabled:', verifyBtn.disabled);
    } else {
        console.error('Verify button not found!');
    }
    
    return isComplete;
}

// Get OTP value
function getOtpValue() {
    const inputs = document.querySelectorAll('#otpModalOverlay .otp-input');
    return Array.from(inputs).map(input => input.value).join('');
}

// Show OTP error
function showOtpError() {
    const inputs = document.querySelectorAll('#otpModalOverlay .otp-input');
    inputs.forEach(input => {
        input.classList.add('error');
    });
    
    // Clear inputs after error
    setTimeout(() => {
        clearOtpInputs();
        const firstInput = document.querySelector('.otp-input[data-index="0"]');
        if (firstInput) {
            firstInput.focus();
        }
    }, 1000);
}

// Start countdown timer
function startCountdown() {
    countdownSeconds = 60;
    const countdownElement = document.getElementById('countdownTimer');
    const resendLink = document.getElementById('resendLink');
    const countdown = document.getElementById('countdown');
    
    if (countdownElement && resendLink && countdown) {
        resendLink.classList.add('disabled');
        countdown.classList.remove('hidden');
        
        countdownTimer = setInterval(() => {
            countdownSeconds--;
            countdownElement.textContent = countdownSeconds;
            
            if (countdownSeconds <= 0) {
                stopCountdown();
                resendLink.classList.remove('disabled');
                countdown.classList.add('hidden');
            }
        }, 1000);
    }
}

// Stop countdown timer
function stopCountdown() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
}

// Handle resend OTP
async function handleResendOtp() {
    const resendLink = document.getElementById('resendLink');
    
    if (resendLink && !resendLink.classList.contains('disabled')) {
        console.log('Resending OTP to:', currentUserEmail);
        
        // Show loading state
        resendLink.textContent = 'Sending...';
        resendLink.classList.add('disabled');
        
        try {
            // Call AWS API to resend verification code
            await awsAuth.resendVerification(currentUserEmail);
            
            // Success - show message and start countdown
            showInfo('New verification code sent to your email!', 'Code Sent');
            resendLink.textContent = 'Resend';
            startCountdown();
        } catch (error) {
            // Error - show error message and re-enable button
            console.error('Resend verification failed:', error);
            showError(error.message || 'Failed to resend verification code. Please try again.');
            resendLink.textContent = 'Resend';
            resendLink.classList.remove('disabled');
        }
    }
}

// Handle OTP form submission
async function handleOtpFormSubmit(e) {
    e.preventDefault();
    
    const otpValue = getOtpValue();
    const verifyBtn = document.querySelector('.verify-btn');
    
    if (otpValue.length !== 6) {
        showOtpError();
        return;
    }
    
    try {
        // Show loading state
        const originalText = verifyBtn.innerHTML;
        verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        verifyBtn.disabled = true;
        
        // Call AWS verify email API
        const response = await awsAuth.verifyEmail(currentUserEmail, otpValue);
        
        // Reset button
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;
        
        // Success
        showLoginSuccess(currentUserEmail);
        closeOtpModal();
        
        // Update UI to show logged in state
        updateLoginState(true, currentUserEmail);
        
    } catch (error) {
        // Reset button
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;
        
        // Show error and highlight OTP inputs
        showOtpError();
        showError(error.message || 'Invalid verification code. Please try again.');
    }
}

// ========================================
// FORGOT PASSWORD MODAL FUNCTIONALITY
// ========================================

// Open forgot password modal
function openForgotModal() {
    const modalOverlay = document.getElementById('forgotModalOverlay');
    const modal = document.getElementById('forgotModal');
    
    if (modalOverlay && modal) {
        isForgotModalOpen = true;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on email input
        setTimeout(() => {
            const emailInput = document.getElementById('forgotEmail');
            if (emailInput) {
                emailInput.focus();
            }
        }, 300);
        
        console.log('Forgot password modal opened');
    }
}

// Close forgot password modal
function closeForgotModal() {
    const modalOverlay = document.getElementById('forgotModalOverlay');
    const modal = document.getElementById('forgotModal');
    
    if (modalOverlay && modal) {
        isForgotModalOpen = false;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form
        const form = document.getElementById('forgotForm');
        if (form) {
            form.reset();
        }
        
        console.log('Forgot password modal closed');
    }
}

// Open password reset modal
function openResetModal(userEmail) {
    const modalOverlay = document.getElementById('resetModalOverlay');
    const modal = document.getElementById('resetModal');
    const emailElement = document.getElementById('resetUserEmail');
    
    if (modalOverlay && modal && emailElement) {
        isResetModalOpen = true;
        resetUserEmail = userEmail;
        emailElement.textContent = userEmail;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first OTP input
        setTimeout(() => {
            const firstInput = document.querySelector('#resetModalOverlay .otp-input[data-index="0"]');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
        
        // Start countdown
        startResetCountdown();
        
        console.log('Password reset modal opened for:', userEmail);
    }
}

// Close password reset modal
function closeResetModal() {
    const modalOverlay = document.getElementById('resetModalOverlay');
    const modal = document.getElementById('resetModal');
    
    if (modalOverlay && modal) {
        isResetModalOpen = false;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form
        const form = document.getElementById('resetForm');
        if (form) {
            form.reset();
            clearResetPasswordRequirements();
            hideResetPasswordMatch();
        }
        
        // Clear OTP inputs
        clearResetOtpInputs();
        
        // Stop countdown
        stopResetCountdown();
        
        console.log('Password reset modal closed');
    }
}

// Clear reset OTP inputs
function clearResetOtpInputs() {
    const inputs = document.querySelectorAll('#resetModalOverlay .otp-input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error');
    });
}

// Handle forgot password form submission
async function handleForgotFormSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    // Basic validation
    if (!email) {
        showError('Please enter your email address');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    const submitBtn = document.querySelector('.send-code-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Code...';
        submitBtn.disabled = true;
        
        // Call AWS forgot password API
        const response = await awsAuth.forgotPassword(email);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showPasswordResetSent(email);
        
        // Close forgot modal
        closeForgotModal();
        
        // Open reset modal
        openResetModal(email);
        
    } catch (error) {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show error message
        showError(error.message || 'Failed to send reset code. Please try again.');
    }
}

// Handle reset OTP input navigation
function handleResetOtpInput(e) {
    const input = e.target;
    const index = parseInt(input.getAttribute('data-index'));
    const value = input.value;
    
    // Remove error class when user starts typing
    input.classList.remove('error');
    
    // Only allow numbers
    if (!/^\d$/.test(value) && value !== '') {
        input.value = '';
        return;
    }
    
    // Add filled class if value exists
    if (value) {
        input.classList.add('filled');
        
        // Move to next input
        if (index < 5) {
            const nextInput = document.querySelector(`#resetModalOverlay .otp-input[data-index="${index + 1}"]`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    } else {
        input.classList.remove('filled');
    }
    
    // Check if all inputs are filled
    checkResetOtpComplete();
}

// Handle reset OTP backspace navigation
function handleResetOtpBackspace(e) {
    const input = e.target;
    const index = parseInt(input.getAttribute('data-index'));
    
    if (e.key === 'Backspace' && input.value === '' && index > 0) {
        const prevInput = document.querySelector(`#resetModalOverlay .otp-input[data-index="${index - 1}"]`);
        if (prevInput) {
            prevInput.focus();
        }
    }
}

// Check if reset OTP is complete
function checkResetOtpComplete() {
    const inputs = document.querySelectorAll('#resetModalOverlay .otp-input');
    const values = Array.from(inputs).map(input => input.value);
    const isComplete = values.every(value => value !== '');
    
    return isComplete;
}

// Get reset OTP value
function getResetOtpValue() {
    const inputs = document.querySelectorAll('#resetModalOverlay .otp-input');
    return Array.from(inputs).map(input => input.value).join('');
}

// Show reset OTP error
function showResetOtpError() {
    const inputs = document.querySelectorAll('#resetModalOverlay .otp-input');
    inputs.forEach(input => {
        input.classList.add('error');
    });
    
    // Clear inputs after error
    setTimeout(() => {
        clearResetOtpInputs();
        const firstInput = document.querySelector('#resetModalOverlay .otp-input[data-index="0"]');
        if (firstInput) {
            firstInput.focus();
        }
    }, 1000);
}

// Password validation functions for reset
function validateResetPassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return requirements;
}

function updateResetPasswordRequirements(password) {
    const requirements = validateResetPassword(password);
    const requirementElements = document.querySelectorAll('#resetPasswordRequirements .requirement');
    
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

function clearResetPasswordRequirements() {
    const requirementElements = document.querySelectorAll('#resetPasswordRequirements .requirement');
    requirementElements.forEach(element => {
        element.classList.remove('valid');
    });
}

function checkResetPasswordMatch() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    const matchIndicator = document.getElementById('resetPasswordMatch');
    
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
        hideResetPasswordMatch();
        return false;
    }
}

function hideResetPasswordMatch() {
    const matchIndicator = document.getElementById('resetPasswordMatch');
    matchIndicator.classList.remove('show', 'valid');
}

// Toggle password visibility for reset form
function toggleResetPasswordVisibility(inputId, toggleId) {
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

// Start reset countdown timer
function startResetCountdown() {
    resetCountdownSeconds = 60;
    const countdownElement = document.getElementById('resetCountdownTimer');
    const resendLink = document.getElementById('resetResendLink');
    const countdown = document.getElementById('resetCountdown');
    
    if (countdownElement && resendLink && countdown) {
        resendLink.classList.add('disabled');
        countdown.classList.remove('hidden');
        
        resetCountdownTimer = setInterval(() => {
            resetCountdownSeconds--;
            countdownElement.textContent = resetCountdownSeconds;
            
            if (resetCountdownSeconds <= 0) {
                stopResetCountdown();
                resendLink.classList.remove('disabled');
                countdown.classList.add('hidden');
            }
        }, 1000);
    }
}

// Stop reset countdown timer
function stopResetCountdown() {
    if (resetCountdownTimer) {
        clearInterval(resetCountdownTimer);
        resetCountdownTimer = null;
    }
}

// Handle resend reset OTP
async function handleResendResetOtp() {
    const resendLink = document.getElementById('resetResendLink');
    
    if (resendLink && !resendLink.classList.contains('disabled')) {
        console.log('Resending reset OTP to:', resetUserEmail);
        
        // Show loading state
        resendLink.textContent = 'Sending...';
        resendLink.classList.add('disabled');
        
        try {
            // Call AWS API to resend password reset code
            await awsAuth.resendCodePassword(resetUserEmail);
            
            // Success - show message and start countdown
            showInfo('New password reset code sent to your email!', 'Code Sent');
            resendLink.textContent = 'Resend';
            startResetCountdown();
        } catch (error) {
            // Error - show error message and re-enable button
            console.error('Resend password code failed:', error);
            showError(error.message || 'Failed to resend password reset code. Please try again.');
            resendLink.textContent = 'Resend';
            resendLink.classList.remove('disabled');
        }
    }
}

// Handle reset form submission
async function handleResetFormSubmit(e) {
    e.preventDefault();
    
    const otpValue = getResetOtpValue();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    // Basic validation
    if (otpValue.length !== 6) {
        showResetOtpError();
        showError('Please enter the complete 6-digit verification code');
        return;
    }
    
    if (!newPassword || !confirmPassword) {
        showError('Please fill in all password fields');
        return;
    }
    
    // Password validation
    const passwordValid = updateResetPasswordRequirements(newPassword);
    if (!passwordValid) {
        showError('Password does not meet all requirements');
        return;
    }
    
    // Password match validation
    if (newPassword !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    const submitBtn = document.querySelector('.reset-password-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting Password...';
        submitBtn.disabled = true;
        
        // Call AWS reset password API
        const response = await awsAuth.resetPassword(resetUserEmail, otpValue, newPassword);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Success
        showPasswordResetSuccess();
        closeResetModal();
        
        // Open login modal
        openLoginModal();
        
    } catch (error) {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show error and highlight OTP inputs
        showResetOtpError();
        showError(error.message || 'Invalid verification code. Please try again.');
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Update login state in UI
function updateLoginState(isLoggedIn, userEmail = '') {
    const mobileLoginBtn = document.querySelector('.login-btn');
    const desktopLoginBtn = document.querySelector('.header-link[onclick*="toggleLoginState"]');
    
    // Store/clear user email in localStorage
    if (isLoggedIn && userEmail) {
        localStorage.setItem('userEmail', userEmail);
    } else {
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('userEmail');
    }
    
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
    
    // Update sidebar user display
    updateSidebarUserDisplay();
}

// Handle social login
async function handleSocialLogin(provider) {
    console.log(`Social login with ${provider}`);
    
    try {
        // Show loading message
        showInfo(`Connecting to ${provider}...`, 'Social Login');
        
        // Initialize Google Identity Services
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: '921064121179-1nco9up7a0b2p399sr2eo9m3lepncpb6.apps.googleusercontent.com', // Replace with your actual Client ID
                callback: handleGoogleResponse
            });
            
            // Trigger Google sign-in
            google.accounts.id.prompt();
        } else {
            throw new Error('Google Identity Services not loaded');
        }
        
    } catch (error) {
        console.error(`${provider} login failed:`, error);
        showError(error.message || `Failed to login with ${provider}. Please try again.`);
    }
}

// Handle Google authentication response
async function handleGoogleResponse(response) {
    try {
        console.log('Google response:', response);
        
        // Decode the JWT token to get user info
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        console.log('Google user info:', payload);
        
        // Prepare data for AWS authentication
        const googleData = {
            provider: 'google',
            idToken: response.credential,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };
        
        // Call AWS Google authentication
        const awsResponse = await awsAuth.googleAuth(googleData);
        
        // Success - close login modal and update UI
        closeLoginModal();
        updateLoginState(true, payload.email);
        showInfo(`Welcome! Successfully logged in with Google`, 'Login Successful');
        
    } catch (error) {
        console.error('Google authentication failed:', error);
        showError(error.message || 'Failed to authenticate with Google. Please try again.');
    }
}

// Handle social registration
async function handleSocialRegister(provider) {
    console.log(`Social registration with ${provider}`);
    
    try {
        // Show loading message
        showInfo(`Connecting to ${provider}...`, 'Social Registration');
        
        // Initialize Google Identity Services
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: '921064121179-1nco9up7a0b2p399sr2eo9m3lepncpb6.apps.googleusercontent.com', // Replace with your actual Client ID
                callback: handleGoogleRegistrationResponse
            });
            
            // Trigger Google sign-in
            google.accounts.id.prompt();
        } else {
            throw new Error('Google Identity Services not loaded');
        }
        
    } catch (error) {
        console.error(`${provider} registration failed:`, error);
        showError(error.message || `Failed to register with ${provider}. Please try again.`);
    }
}

// Handle Google registration response
async function handleGoogleRegistrationResponse(response) {
    try {
        console.log('Google registration response:', response);
        
        // Decode the JWT token to get user info
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        console.log('Google user info:', payload);
        
        // Prepare data for AWS authentication
        const googleData = {
            provider: 'google',
            idToken: response.credential,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };
        
        // Call AWS Google authentication
        const awsResponse = await awsAuth.googleAuth(googleData);
        
        // Success - close register modal and update UI
        closeRegisterModal();
        updateLoginState(true, payload.email);
        showInfo(`Welcome! Successfully registered with Google`, 'Registration Successful');
        
    } catch (error) {
        console.error('Google registration failed:', error);
        showError(error.message || 'Failed to register with Google. Please try again.');
    }
}

// ========================================
// MODAL NAVIGATION FUNCTIONS
// ========================================

// Function to switch from login to register modal
function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

// Function to switch from register to login modal
function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// Function to switch from login to forgot password modal
function switchToForgotPassword() {
    closeLoginModal();
    openForgotModal();
}

// Function to switch from forgot password back to login modal
function switchBackToLogin() {
    closeForgotModal();
    openLoginModal();
}

// Function to switch from forgot password to reset password modal
function switchToResetPassword() {
    closeForgotModal();
    openResetModal();
}

// Function to switch from register to OTP modal
function switchToOtpModal() {
    closeRegisterModal();
    openOtpModal();
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize all modal functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing authentication modals...');
    
    // ========================================
    // LOGIN MODAL EVENT LISTENERS
    // ========================================
    
    // Modal close button
    const loginCloseButton = document.getElementById('modalClose');
    if (loginCloseButton) {
        loginCloseButton.addEventListener('click', closeLoginModal);
    }
    
    // Close modal when clicking overlay
    const loginModalOverlay = document.getElementById('loginModalOverlay');
    if (loginModalOverlay) {
        loginModalOverlay.addEventListener('click', function(e) {
            if (e.target === loginModalOverlay) {
        closeLoginModal();
    }
        });
    }
    
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
    const googleBtn = document.querySelector('#loginModalOverlay .gsi-material-button');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleSocialLogin('Google'));
    }
    
    // ========================================
    // REGISTER MODAL EVENT LISTENERS
    // ========================================
    
    // Modal close button
    const registerCloseButton = document.getElementById('registerModalClose');
    if (registerCloseButton) {
        registerCloseButton.addEventListener('click', closeRegisterModal);
    }
    
    // Close modal when clicking overlay
    const registerModalOverlay = document.getElementById('registerModalOverlay');
    if (registerModalOverlay) {
        registerModalOverlay.addEventListener('click', function(e) {
            if (e.target === registerModalOverlay) {
        closeRegisterModal();
    }
        });
    }
    
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
    
    // ========================================
    // OTP MODAL EVENT LISTENERS
    // ========================================
    
    // Modal close button
    const otpCloseButton = document.getElementById('otpModalClose');
    if (otpCloseButton) {
        otpCloseButton.addEventListener('click', closeOtpModal);
    }
    
    // Close modal when clicking overlay
    const otpModalOverlay = document.getElementById('otpModalOverlay');
    if (otpModalOverlay) {
        otpModalOverlay.addEventListener('click', function(e) {
            if (e.target === otpModalOverlay) {
        closeOtpModal();
    }
        });
    }
    
    // OTP input event listeners
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        input.addEventListener('input', handleOtpInput);
        input.addEventListener('keydown', handleOtpBackspace);
        
        // Prevent pasting multiple characters
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const numbers = paste.replace(/\D/g, '').slice(0, 6);
            
            if (numbers.length > 0) {
                const inputs = document.querySelectorAll('.otp-input');
                inputs.forEach((input, index) => {
                    if (index < numbers.length) {
                        input.value = numbers[index];
                        input.classList.add('filled');
                    }
                });
                
                // Focus on next empty input or last input
                const nextIndex = Math.min(numbers.length, 5);
                const nextInput = document.querySelector(`.otp-input[data-index="${nextIndex}"]`);
                if (nextInput) {
                    nextInput.focus();
                }
                
                checkOtpComplete();
            }
        });
    });
    
    // Form submission
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', handleOtpFormSubmit);
    }
    
    // Resend link
    const resendLink = document.getElementById('resendLink');
    if (resendLink) {
        resendLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleResendOtp();
        });
    }
    
    // ========================================
    // FORGOT PASSWORD MODAL EVENT LISTENERS
    // ========================================
    
    // Forgot modal close button
    const forgotCloseButton = document.getElementById('forgotModalClose');
    if (forgotCloseButton) {
        forgotCloseButton.addEventListener('click', closeForgotModal);
    }
    
    // Reset modal close button
    const resetCloseButton = document.getElementById('resetModalClose');
    if (resetCloseButton) {
        resetCloseButton.addEventListener('click', closeResetModal);
    }
    
    // Close modals when clicking overlay
    const forgotModalOverlay = document.getElementById('forgotModalOverlay');
    const resetModalOverlay = document.getElementById('resetModalOverlay');
    
    if (forgotModalOverlay) {
        forgotModalOverlay.addEventListener('click', function(e) {
            if (e.target === forgotModalOverlay) {
                closeForgotModal();
            }
        });
    }
    
    if (resetModalOverlay) {
        resetModalOverlay.addEventListener('click', function(e) {
            if (e.target === resetModalOverlay) {
        closeResetModal();
    }
});
    }
    
    // Forgot form submission
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotFormSubmit);
    }
    
    // Reset OTP input event listeners
    const resetOtpInputs = document.querySelectorAll('#resetModalOverlay .otp-input');
    resetOtpInputs.forEach(input => {
        input.addEventListener('input', handleResetOtpInput);
        input.addEventListener('keydown', handleResetOtpBackspace);
        
        // Prevent pasting multiple characters
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const numbers = paste.replace(/\D/g, '').slice(0, 6);
            
            if (numbers.length > 0) {
                const inputs = document.querySelectorAll('#resetModalOverlay .otp-input');
                inputs.forEach((input, index) => {
                    if (index < numbers.length) {
                        input.value = numbers[index];
                        input.classList.add('filled');
                    }
                });
                
                // Focus on next empty input or last input
                const nextIndex = Math.min(numbers.length, 5);
                const nextInput = document.querySelector(`#resetModalOverlay .otp-input[data-index="${nextIndex}"]`);
                if (nextInput) {
                    nextInput.focus();
                }
                
                checkResetOtpComplete();
            }
        });
    });
    
    // Password toggle buttons for reset form
    const newPasswordToggle = document.getElementById('newPasswordToggle');
    const confirmNewPasswordToggle = document.getElementById('confirmNewPasswordToggle');
    
    if (newPasswordToggle) {
        newPasswordToggle.addEventListener('click', () => 
            toggleResetPasswordVisibility('newPassword', 'newPasswordToggle'));
    }
    
    if (confirmNewPasswordToggle) {
        confirmNewPasswordToggle.addEventListener('click', () => 
            toggleResetPasswordVisibility('confirmNewPassword', 'confirmNewPasswordToggle'));
    }
    
    // Password validation on input for reset form
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            updateResetPasswordRequirements(this.value);
        });
    }
    
    // Password match validation for reset form
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    if (confirmNewPasswordInput) {
        confirmNewPasswordInput.addEventListener('input', checkResetPasswordMatch);
    }
    
    // Reset form submission
    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetFormSubmit);
    }
    
    // Reset resend link
    const resetResendLink = document.getElementById('resetResendLink');
    if (resetResendLink) {
        resetResendLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleResendResetOtp();
        });
    }
    
    // ========================================
    // GLOBAL EVENT LISTENERS
    // ========================================
    
    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isLoginModalOpen) {
        closeLoginModal();
            } else if (isRegisterModalOpen) {
        closeRegisterModal();
            } else if (isOtpModalOpen) {
        closeOtpModal();
            } else if (isForgotModalOpen) {
        closeForgotModal();
            } else if (isResetModalOpen) {
        closeResetModal();
    }
        }
    });
    
    // ========================================
    // MAKE FUNCTIONS GLOBALLY AVAILABLE
    // ========================================
    
    window.toggleLoginState = toggleLoginState;
    window.openLoginModal = openLoginModal;
    window.closeLoginModal = closeLoginModal;
    window.openRegisterModal = openRegisterModal;
    window.closeRegisterModal = closeRegisterModal;
    window.openOtpModal = openOtpModal;
    window.closeOtpModal = closeOtpModal;
    window.openForgotModal = openForgotModal;
    window.closeForgotModal = closeForgotModal;
    window.openResetModal = openResetModal;
    window.closeResetModal = closeResetModal;
    window.switchToRegister = switchToRegister;
    window.switchToLogin = switchToLogin;
    window.switchToForgotPassword = switchToForgotPassword;
    window.switchBackToLogin = switchBackToLogin;
    window.switchToResetPassword = switchToResetPassword;
    window.switchToOtpModal = switchToOtpModal;
    
    // Initialize sidebar user display
    updateSidebarUserDisplay();
    
    console.log('Authentication modals initialized successfully');
});

// ========================================
// SIDEBAR USER DISPLAY FUNCTIONS
// ========================================

// Generate initials from email
function generateInitials(email) {
    if (!email) return 'U';
    
    // Extract name from email (part before @)
    const namePart = email.split('@')[0];
    
    // If it's a typical email format like "john.doe" or "johndoe"
    if (namePart.includes('.')) {
        const parts = namePart.split('.');
        return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (namePart.length >= 2) {
        // For single word emails, take first two characters
        return namePart.substring(0, 2).toUpperCase();
    } else {
        // Fallback to first character
        return namePart[0].toUpperCase();
    }
}

// Update sidebar user display based on login state
function updateSidebarUserDisplay() {
    const sidebarLogin = document.getElementById('sidebarLogin');
    const sidebarUser = document.getElementById('sidebarUser');
    const sidebarUserEmail = document.getElementById('sidebarUserEmail');
    const sidebarUserInitials = document.getElementById('sidebarUserInitials');
    
    if (sidebarLogin && sidebarUser && sidebarUserEmail && sidebarUserInitials) {
        // Check if user is logged in (you can modify this logic based on your auth state)
        const isLoggedIn = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
        
        if (isLoggedIn) {
            // Show logged in state
            sidebarLogin.style.display = 'none';
            sidebarUser.style.display = 'block';
            sidebarUserEmail.textContent = isLoggedIn;
            sidebarUserInitials.textContent = generateInitials(isLoggedIn);
        } else {
            // Show login button
            sidebarLogin.style.display = 'block';
            sidebarUser.style.display = 'none';
        }
    }
}

// Handle sign out from sidebar
function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear stored user data
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('userEmail');
        
        // Update sidebar display
        updateSidebarUserDisplay();
        
        // Update main header login state
        updateLoginState(false);
        
        // Show success message
        showInfo('You have been signed out successfully!', 'Signed Out');
        
        // Close sidebar if open
        const mobileSidebar = document.getElementById('mobileSidebar');
        if (mobileSidebar && mobileSidebar.classList.contains('active')) {
            mobileSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Make functions globally available
window.updateSidebarUserDisplay = updateSidebarUserDisplay;
window.handleSignOut = handleSignOut;

