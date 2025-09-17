// Mobile and Tablet Sidebar Functionality
// Global variables for mobile sidebar
let isMobileSidebarOpen = false;

// Mobile sidebar toggle functionality
window.toggleSidebar = function() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    isMobileSidebarOpen = !isMobileSidebarOpen;
    
    if (sidebar && overlay) {
        if (isMobileSidebarOpen) {
            // Open sidebar
            sidebar.classList.add('active');
            overlay.classList.add('active');
            if (sidebarToggle) {
                sidebarToggle.classList.add('active');
            }
            
            // Sidebar will be positioned by CSS
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Touch device specific behavior
            if (typeof isTouchDevice !== 'undefined' && isTouchDevice) {
                // Add haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
            
            console.log('Mobile sidebar opened');
        } else {
            // Close sidebar
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            if (sidebarToggle) {
                sidebarToggle.classList.remove('active');
            }
            
            // Sidebar will be positioned by CSS
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Touch device specific behavior
            if (typeof isTouchDevice !== 'undefined' && isTouchDevice && navigator.vibrate) {
                navigator.vibrate(25);
            }
            
            console.log('Mobile sidebar closed');
        }
    }
}

// Close sidebar when clicking outside
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('mobileSidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    // Close sidebar if clicking outside and it's open
    if (isMobileSidebarOpen && sidebar && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        toggleSidebar();
    }
});

// Close sidebar on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMobileSidebarOpen) {
        toggleSidebar();
    }
});

// Handle window resize - close sidebar on desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 1400 && isMobileSidebarOpen) {
        toggleSidebar();
    }
});

// Initialize mobile sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to close button
    const closeButton = document.getElementById('sidebarClose');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (isMobileSidebarOpen) {
                toggleSidebar();
            }
        });
    }
    
    // Add event listeners to sidebar links to close sidebar when clicked
    const sidebarLinks = document.querySelectorAll('.sidebar-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to allow the click action to complete
            setTimeout(() => {
                if (isMobileSidebarOpen) {
                    toggleSidebar();
                }
            }, 100);
        });
    });
    
    console.log('Mobile sidebar functionality initialized');
});

// Toggle submenu function
window.toggleSubmenu = function(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close all other submenus
    document.querySelectorAll('.menu-items .item').forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
        }
    });
    
    // Toggle current submenu
    if (isActive) {
        item.classList.remove('active');
    } else {
        item.classList.add('active');
    }
}
