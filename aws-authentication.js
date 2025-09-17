// AWS Authentication API Functions
// Frontend API calls to AWS API Gateway

const AWS_API_BASE_URL = 'https://fo6c74qovg.execute-api.af-south-1.amazonaws.com';

// Utility function to make API calls
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

        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Register user
async function registerUser(userData) {
    try {
        const response = await makeApiCall('/register', 'POST', userData);
        return response;
    } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
    }
}

// Login user
async function loginUser(credentials) {
    try {
        const response = await makeApiCall('/login', 'POST', credentials);
        return response;
    } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
    }
}

// Logout user
async function logoutUser() {
    try {
        const response = await makeApiCall('/logout', 'POST');
        return response;
    } catch (error) {
        throw new Error(`Logout failed: ${error.message}`);
    }
}

// Forgot password
async function forgotPassword(email) {
    try {
        const response = await makeApiCall('/forgot-password', 'POST', { email });
        return response;
    } catch (error) {
        throw new Error(`Forgot password failed: ${error.message}`);
    }
}

// Reset password
async function resetPassword(email, confirmationCode, newPassword) {
    try {
        const resetData = {
            email: email,
            confirmationCode: confirmationCode,
            newPassword: newPassword
        };
        const response = await makeApiCall('/reset-password', 'POST', resetData);
        return response;
    } catch (error) {
        throw new Error(`Reset password failed: ${error.message}`);
    }
}

// Verify email
async function verifyEmail(email, confirmationCode) {
    try {
        const verificationData = {
            email: email,
            confirmationCode: confirmationCode
        };
        const response = await makeApiCall('/verify-email', 'POST', verificationData);
        return response;
    } catch (error) {
        throw new Error(`Email verification failed: ${error.message}`);
    }
}

// Resend verification
async function resendVerification(email) {
    try {
        const response = await makeApiCall('/resend-verification', 'POST', { email });
        return response;
    } catch (error) {
        throw new Error(`Resend verification failed: ${error.message}`);
    }
}

// Resend password reset code
async function resendCodePassword(email) {
    try {
        const response = await makeApiCall('/resend-code-password', 'POST', { email });
        return response;
    } catch (error) {
        throw new Error(`Resend password code failed: ${error.message}`);
    }
}

// Google authentication
async function googleAuth(googleData) {
    try {
        const response = await makeApiCall('/google-auth', 'POST', googleData);
        return response;
    } catch (error) {
        throw new Error(`Google authentication failed: ${error.message}`);
    }
}

// Get user info
async function getUserInfo(email) {
    try {
        const response = await makeApiCall('/get-user-info', 'POST', { email });
        return response;
    } catch (error) {
        throw new Error(`Get user info failed: ${error.message}`);
    }
}

// Update user info
async function updateUserInfo(userData) {
    try {
        const response = await makeApiCall('/update-user-info', 'POST', userData);
        return response;
    } catch (error) {
        throw new Error(`Update user info failed: ${error.message}`);
    }
}

// Export functions for use in other files
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

