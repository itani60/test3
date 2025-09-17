// Forgot Password Modal Functionality
let isForgotModalOpen = false;
let isResetModalOpen = false;
let resetCountdownTimer = null;
let resetCountdownSeconds = 60;
let resetUserEmail = '';

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
function handleForgotFormSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    // Basic validation
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate sending verification code
    const submitBtn = document.querySelector('.send-code-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Code...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showPasswordResetSent(email);
        
        // Close forgot modal
        closeForgotModal();
        
        // Open reset modal
        openResetModal(email);
        
    }, 2000);
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
function handleResendResetOtp() {
    const resendLink = document.getElementById('resetResendLink');
    
    if (resendLink && !resendLink.classList.contains('disabled')) {
        // Simulate resending OTP
        console.log('Resending reset OTP to:', resetUserEmail);
        
        // Show loading state
        resendLink.textContent = 'Sending...';
        resendLink.classList.add('disabled');
        
        // Simulate API call
        setTimeout(() => {
            resendLink.textContent = 'Resend';
            startResetCountdown();
            showPasswordResetSent(resetUserEmail);
        }, 1500);
    }
}

// Handle reset form submission
function handleResetFormSubmit(e) {
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
        alert('Please fill in all password fields');
        return;
    }
    
    // Password validation
    const passwordValid = updateResetPasswordRequirements(newPassword);
    if (!passwordValid) {
        alert('Password does not meet all requirements');
        return;
    }
    
    // Password match validation
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Simulate password reset process
    const submitBtn = document.querySelector('.reset-password-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting Password...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Simulate verification (for demo, accept any 6-digit code)
        if (otpValue === '123456' || otpValue.length === 6) {
            // Success
            showPasswordResetSuccess();
            closeResetModal();
            
            // Open login modal
            openLoginModal();
        } else {
            // Error
            showResetOtpError();
            showError('Invalid verification code. Please try again.');
        }
    }, 2000);
}

// Initialize forgot password modal functionality
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isForgotModalOpen) {
                closeForgotModal();
            } else if (isResetModalOpen) {
                closeResetModal();
            }
        }
    });
    
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
    
    // Make functions globally available
    window.openForgotModal = openForgotModal;
    window.closeForgotModal = closeForgotModal;
    window.openResetModal = openResetModal;
    window.closeResetModal = closeResetModal;
    
    console.log('Forgot password modal functionality initialized');
});
