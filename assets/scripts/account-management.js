/**
 * Account Management Script
 * Handles user profile updates (names only, email is readonly)
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Account Management script loaded');
    
    // Initialize the page
    initializeAccountManagement();
});

/**
 * Initialize account management functionality
 */
function initializeAccountManagement() {
    // Load current user data
    loadCurrentUserData();
    
    // Set up form submission
    setupFormSubmission();
    
    // Set up edit buttons
    setupEditButtons();
}

/**
 * Load current user data and populate the form
 */
async function loadCurrentUserData() {
    try {
        console.log('Loading current user data...');
        
        // Get current user email from localStorage
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            console.error('No user email found in localStorage');
            showError('Please log in to access account management');
            return;
        }
        
        // Fetch user data from API
        const userData = await awsAuth.getUserInfo(userEmail);
        
        if (userData && userData.success) {
            populateForm(userData.user);
        } else {
            console.error('Failed to load user data:', userData);
            showError('Failed to load user data');
        }
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showError('Error loading user data');
    }
}

/**
 * Populate the form with user data
 */
function populateForm(user) {
    console.log('Populating form with user data:', user);
    
    // Populate form fields
    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const emailField = document.getElementById('email');
    
    if (firstNameField) {
        firstNameField.value = user.firstName || '';
    }
    
    if (lastNameField) {
        lastNameField.value = user.lastName || '';
    }
    
    if (emailField) {
        emailField.value = user.email || '';
    }
    
    // Update verification badge visibility
    updateVerificationBadge(user.verified || user.emailVerified);
}

/**
 * Update verification badge visibility
 */
function updateVerificationBadge(isVerified) {
    const badge = document.querySelector('.verified-badge');
    if (badge) {
        badge.style.display = isVerified ? 'flex' : 'none';
    }
}

/**
 * Set up form submission
 */
function setupFormSubmission() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    console.log('Form submitted');
    
    // Get form data
    const formData = new FormData(event.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    
    // Validate form data
    if (!firstName || !lastName) {
        showError('First name and last name are required');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    try {
        // Update user info (names only)
        const result = await awsAuth.updateUserInfo(email, {
            firstName: firstName,
            lastName: lastName
        });
        
        if (result && result.success) {
            showSuccess('Profile updated successfully!');
            
            // Update localStorage if needed
            localStorage.setItem('userFirstName', firstName);
            localStorage.setItem('userLastName', lastName);
            
        } else {
            console.error('Update failed:', result);
            showError(result?.error || 'Failed to update profile');
        }
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showError('Error updating profile');
    } finally {
        hideLoadingState();
    }
}

/**
 * Set up edit buttons
 */
function setupEditButtons() {
    // First name edit button
    const editFirstNameBtn = document.getElementById('editFirstNameBtn');
    if (editFirstNameBtn) {
        editFirstNameBtn.addEventListener('click', () => toggleEditMode('firstName'));
    }
    
    // Last name edit button
    const editLastNameBtn = document.getElementById('editLastNameBtn');
    if (editLastNameBtn) {
        editLastNameBtn.addEventListener('click', () => toggleEditMode('lastName'));
    }
}

/**
 * Toggle edit mode for a field
 */
function toggleEditMode(fieldName) {
    const field = document.getElementById(fieldName);
    const editBtn = document.getElementById(`edit${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}Btn`);
    
    if (field && editBtn) {
        if (field.readOnly) {
            // Enable editing
            field.readOnly = false;
            field.focus();
            editBtn.textContent = 'Cancel';
            editBtn.classList.add('cancel-mode');
        } else {
            // Disable editing
            field.readOnly = true;
            editBtn.textContent = 'Edit';
            editBtn.classList.remove('cancel-mode');
        }
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        submitBtn.classList.add('loading');
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
        submitBtn.classList.remove('loading');
    }
}

/**
 * Show success message
 */
function showSuccess(message) {
    // You can implement a toast notification or alert
    if (typeof showNotification === 'function') {
        showNotification(message, 'success');
    } else {
        alert(message);
    }
}

/**
 * Show error message
 */
function showError(message) {
    // You can implement a toast notification or alert
    if (typeof showNotification === 'function') {
        showNotification(message, 'error');
    } else {
        alert(message);
    }
}

// Export functions for global access
window.accountManagement = {
    loadCurrentUserData,
    populateForm,
    updateVerificationBadge,
    handleFormSubmit,
    toggleEditMode,
    showSuccess,
    showError
};
