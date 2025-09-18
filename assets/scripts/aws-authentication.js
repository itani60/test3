/**
 * AWS Authentication Script
 * Handles all API calls to AWS API Gateway endpoints
 */

// AWS API Gateway base URL
const AWS_API_BASE_URL = 'https://fo6c74qovg.execute-api.af-south-1.amazonaws.com';

/**
 * Make API call to AWS endpoints
 */
async function makeApiCall(endpoint, method = 'POST', data = null) {
    try {
        const url = `${AWS_API_BASE_URL}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        console.log(`Making API call to: ${url}`, data);
        const response = await fetch(url, options);
        const result = await response.json();
        
        console.log(`API response from ${endpoint}:`, result);
        return result;
    } catch (error) {
        console.error(`API call error for ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Register a new user
 */
async function registerUser(userData) {
    return await makeApiCall('/register', 'POST', userData);
}

/**
 * Login user
 */
async function loginUser(email, password) {
    return await makeApiCall('/login', 'POST', { email, password });
}

/**
 * Logout user
 */
async function logoutUser() {
    return await makeApiCall('/logout', 'POST');
}

/**
 * Forgot password
 */
async function forgotPassword(email) {
    return await makeApiCall('/forgot-password', 'POST', { email });
}

/**
 * Reset password
 */
async function resetPassword(email, confirmationCode, newPassword) {
    return await makeApiCall('/reset-password', 'POST', { 
        email, 
        confirmationCode, 
        newPassword 
    });
}

/**
 * Verify email
 */
async function verifyEmail(email, confirmationCode) {
    return await makeApiCall('/verify-email', 'POST', { 
        email, 
        confirmationCode 
    });
}

/**
 * Resend verification code
 */
async function resendVerification(email) {
    return await makeApiCall('/resend-verification', 'POST', { email });
}

/**
 * Resend password reset code
 */
async function resendCodePassword(email) {
    return await makeApiCall('/resend-code-password', 'POST', { email });
}

/**
 * Google authentication
 */
async function googleAuth(googleToken) {
    return await makeApiCall('/google-auth', 'POST', { token: googleToken });
}

/**
 * Get user information
 */
async function getUserInfo(email) {
    return await makeApiCall('/get-user-info', 'POST', { email });
}

/**
 * Update user information
 */
async function updateUserInfo(email, userData) {
    return await makeApiCall('/update-user-info', 'POST', { 
        email, 
        ...userData 
    });
}

// Export all functions globally
window.awsAuth = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    resendCodePassword,
    googleAuth,
    getUserInfo,
    updateUserInfo
};

console.log('AWS Authentication script loaded successfully');
