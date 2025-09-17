// OTP Modal Functionality
let isOtpModalOpen = false;
let countdownTimer = null;
let countdownSeconds = 60;
let currentUserEmail = '';

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
    const inputs = document.querySelectorAll('.otp-input');
    const values = Array.from(inputs).map(input => input.value);
    const isComplete = values.every(value => value !== '');
    
    const verifyBtn = document.querySelector('.verify-btn');
    if (verifyBtn) {
        verifyBtn.disabled = !isComplete;
    }
    
    return isComplete;
}

// Get OTP value
function getOtpValue() {
    const inputs = document.querySelectorAll('.otp-input');
    return Array.from(inputs).map(input => input.value).join('');
}

// Show OTP error
function showOtpError() {
    const inputs = document.querySelectorAll('.otp-input');
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
function handleResendOtp() {
    const resendLink = document.getElementById('resendLink');
    
    if (resendLink && !resendLink.classList.contains('disabled')) {
        // Simulate resending OTP
        console.log('Resending OTP to:', currentUserEmail);
        
        // Show loading state
        resendLink.textContent = 'Sending...';
        resendLink.classList.add('disabled');
        
        // Simulate API call
        setTimeout(() => {
            resendLink.textContent = 'Resend';
            startCountdown();
            showVerificationCode(currentUserEmail);
        }, 1500);
    }
}

// Handle OTP form submission
function handleOtpFormSubmit(e) {
    e.preventDefault();
    
    const otpValue = getOtpValue();
    const verifyBtn = document.querySelector('.verify-btn');
    
    if (otpValue.length !== 6) {
        showOtpError();
        return;
    }
    
    // Show loading state
    const originalText = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyBtn.disabled = true;
    
    // Simulate OTP verification
    setTimeout(() => {
        // Reset button
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;
        
        // Simulate verification (for demo, accept any 6-digit code)
        if (otpValue === '123456' || otpValue.length === 6) {
            // Success
            showLoginSuccess(currentUserEmail);
            closeOtpModal();
            
            // Update UI to show logged in state
            updateLoginState(true, currentUserEmail);
        } else {
            // Error
            showOtpError();
            showError('Invalid verification code. Please try again.');
        }
    }, 2000);
}

// Initialize OTP modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal close button
    const closeButton = document.getElementById('otpModalClose');
    if (closeButton) {
        closeButton.addEventListener('click', closeOtpModal);
    }
    
    // Close modal when clicking overlay
    const modalOverlay = document.getElementById('otpModalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeOtpModal();
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOtpModalOpen) {
            closeOtpModal();
        }
    });
    
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
    
    // Make functions globally available
    window.openOtpModal = openOtpModal;
    window.closeOtpModal = closeOtpModal;
    
    console.log('OTP modal functionality initialized');
});
