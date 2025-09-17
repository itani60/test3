/**
 * My Profile JavaScript
 * Handles user profile display and data fetching
 */

// Global variables
let currentUser = null;
let userProfileData = null;

/**
 * Initialize profile page
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('My Profile page loaded');
    
    // Check if user is logged in
    checkUserLoginStatus();
    
    // Load user profile data
    loadUserProfile();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Check if user is logged in
 */
function checkUserLoginStatus() {
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    
    if (!userEmail) {
        // User not logged in, redirect to home page
        console.log('User not logged in, redirecting to home page');
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = {
        email: userEmail
    };
    
    console.log('User logged in:', currentUser.email);
}

/**
 * Load user profile data
 */
async function loadUserProfile() {
    if (!currentUser) {
        console.error('No current user found');
        return;
    }
    
    try {
        console.log('Loading user profile for:', currentUser.email);
        
        // Show loading state
        showLoadingState();
        
        // Fetch user data from API
        const userData = await awsAuth.getUserInfo(currentUser.email);
        
        console.log('User profile data received:', userData);
        console.log('User data structure:', JSON.stringify(userData, null, 2));
        
        // Update profile display
        updateProfileDisplay(userData);
        
        // Store user data globally
        userProfileData = userData;
        
    } catch (error) {
        console.error('Error loading user profile:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        
        // Even if API fails, try to update with available data
        console.log('Attempting fallback profile update with current user data');
        updateProfileDisplay(null); // This will use currentUser.email as fallback
        
        showErrorState(`Failed to load profile data: ${error.message}`);
    }
}

/**
 * Update profile display with real user data
 */
function updateProfileDisplay(userData) {
    try {
        console.log('Updating profile display with data:', userData);
        
        // If no userData, use current user email as fallback
        if (!userData && currentUser && currentUser.email) {
            userData = { email: currentUser.email };
        }
        
        // Update profile name
        const profileName = document.querySelector('.profile-name');
        if (profileName) {
            if (userData && userData.firstName && userData.lastName) {
                profileName.textContent = `${userData.firstName} ${userData.lastName}`;
            } else if (userData && userData.name) {
                profileName.textContent = userData.name;
            } else if (userData && userData.email) {
                // Extract name from email if no name is available
                const emailName = userData.email.split('@')[0];
                profileName.textContent = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            } else if (currentUser && currentUser.email) {
                // Fallback to current user email
                const emailName = currentUser.email.split('@')[0];
                profileName.textContent = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            } else {
                profileName.textContent = 'User';
            }
        }
        
        // Update profile email
        const profileEmail = document.querySelector('.profile-email');
        if (profileEmail) {
            profileEmail.innerHTML = `<i class="fas fa-envelope"></i> ${userData.email || currentUser.email}`;
        }
        
        // Update member since date
        const memberSince = document.querySelector('.member-since');
        if (memberSince && userData.createdAt) {
            const joinDate = new Date(userData.createdAt);
            const monthYear = joinDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
            memberSince.innerHTML = `<i class="fas fa-calendar-alt"></i> Member since ${monthYear}`;
        } else if (memberSince) {
            memberSince.innerHTML = `<i class="fas fa-calendar-alt"></i> Member since ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
        }
        
        // Update profile picture if available
        if (userData.picture) {
            updateProfilePicture(userData.picture);
        }
        
        // Update avatar initials
        updateAvatarInitials(userData);
        
        // Update additional profile information
        updateAdditionalProfileInfo(userData);
        
        console.log('Profile display updated successfully');
        
    } catch (error) {
        console.error('Error updating profile display:', error);
    }
}

/**
 * Update profile picture
 */
function updateProfilePicture(pictureUrl) {
    const profileAvatar = document.querySelector('.profile-avatar img');
    if (profileAvatar && pictureUrl) {
        profileAvatar.src = pictureUrl;
        profileAvatar.alt = 'Profile Picture';
    }
}

/**
 * Update avatar initials
 */
function updateAvatarInitials(userData) {
    const avatarInitials = document.querySelector('.profile-initials');
    if (avatarInitials) {
        let initials = 'U'; // Default
        
        if (userData && userData.firstName && userData.lastName) {
            initials = (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase();
        } else if (userData && userData.name) {
            const nameParts = userData.name.split(' ');
            if (nameParts.length >= 2) {
                initials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
            } else {
                initials = nameParts[0].charAt(0).toUpperCase();
            }
        } else if (userData && userData.email) {
            const emailName = userData.email.split('@')[0];
            initials = emailName.charAt(0).toUpperCase();
        } else if (currentUser && currentUser.email) {
            // Fallback to current user email
            const emailName = currentUser.email.split('@')[0];
            initials = emailName.charAt(0).toUpperCase();
        }
        
        avatarInitials.textContent = initials;
        console.log('Avatar initials updated to:', initials);
    }
}

/**
 * Update additional profile information
 */
function updateAdditionalProfileInfo(userData) {
    // Update any additional profile fields if they exist
    const profileStatus = document.querySelector('.profile-status');
    if (profileStatus) {
        profileStatus.textContent = userData.status || 'Active';
    }
    
    // Update provider information
    const providerInfo = document.querySelector('.provider-info');
    if (providerInfo && userData.provider) {
        providerInfo.innerHTML = `<i class="fas fa-sign-in-alt"></i> Signed in with ${userData.provider.charAt(0).toUpperCase() + userData.provider.slice(1)}`;
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    const memberSince = document.querySelector('.member-since');
    
    if (profileName) profileName.textContent = 'Loading...';
    if (profileEmail) profileEmail.innerHTML = '<i class="fas fa-envelope"></i> Loading...';
    if (memberSince) memberSince.innerHTML = '<i class="fas fa-calendar-alt"></i> Loading...';
}

/**
 * Show error state
 */
function showErrorState(message) {
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    const memberSince = document.querySelector('.member-since');
    
    if (profileName) profileName.textContent = 'Error';
    if (profileEmail) profileEmail.innerHTML = '<i class="fas fa-envelope"></i> Failed to load';
    if (memberSince) memberSince.innerHTML = '<i class="fas fa-calendar-alt"></i> Error';
    
    // Show error notification
    if (typeof showError === 'function') {
        showError(message);
    } else {
        alert(message);
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', handleEditProfile);
    }
    
    // Sign out button
    const signOutBtn = document.querySelector('.sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
    }
    
    // Avatar upload button
    const avatarUploadBtn = document.querySelector('.avatar-upload-btn');
    if (avatarUploadBtn) {
        avatarUploadBtn.addEventListener('click', handleAvatarUpload);
    }
}

/**
 * Handle edit profile
 */
function handleEditProfile() {
    console.log('Edit profile clicked');
    // TODO: Implement edit profile functionality
    if (typeof showInfo === 'function') {
        showInfo('Edit profile functionality coming soon!', 'Feature Coming Soon');
    } else {
        alert('Edit profile functionality coming soon!');
    }
}

/**
 * Handle sign out
 */
async function handleSignOut() {
    try {
        console.log('Signing out user');
        
        // Call AWS logout
        await awsAuth.logout();
        
        // Clear local storage
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('userEmail');
        
        // Redirect to home page
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Error signing out:', error);
        // Still redirect even if logout fails
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    }
}

/**
 * Handle avatar upload
 */
function handleAvatarUpload() {
    console.log('Avatar upload clicked');
    // TODO: Implement avatar upload functionality
    if (typeof showInfo === 'function') {
        showInfo('Avatar upload functionality coming soon!', 'Feature Coming Soon');
    } else {
        alert('Avatar upload functionality coming soon!');
    }
}

/**
 * Refresh profile data
 */
async function refreshProfile() {
    console.log('Refreshing profile data');
    await loadUserProfile();
}

/**
 * Get current user data
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Get user profile data
 */
function getUserProfileData() {
    return userProfileData;
}

// Test function to debug profile loading
async function testProfileLoading() {
    console.log('=== Testing Profile Loading ===');
    console.log('Current user:', currentUser);
    console.log('User email from storage:', localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail'));
    
    try {
        console.log('Testing API call...');
        const result = await awsAuth.getUserInfo(currentUser.email);
        console.log('API result:', result);
    } catch (error) {
        console.error('API error:', error);
    }
    
    console.log('=== End Test ===');
}

// Export functions for global access
window.myProfile = {
    refreshProfile,
    getCurrentUser,
    getUserProfileData,
    handleSignOut,
    testProfileLoading
};
