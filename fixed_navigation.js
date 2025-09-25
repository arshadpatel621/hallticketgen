// Fixed Navigation Functions for EduConnect
// This file fixes the "Create Account" click issue and improves page navigation

console.log('🚀 Loading fixed navigation functions...');

// Enhanced showMainRegister function with multiple fallback methods
function showMainRegister() {
    console.log('🔄 showMainRegister called - Enhanced version');
    
    try {
        // Method 1: Direct element manipulation
        const loginPage = document.getElementById('loginPage');
        const registrationPage = document.getElementById('registrationPage');
        const mainApp = document.getElementById('mainApp');
        
        if (loginPage && registrationPage) {
            // Hide login page
            loginPage.classList.add('hidden');
            loginPage.style.display = 'none';
            
            // Hide main app
            if (mainApp) {
                mainApp.classList.add('hidden');
                mainApp.style.display = 'none';
            }
            
            // Show registration page
            registrationPage.classList.remove('hidden');
            registrationPage.style.display = 'flex';
            
            console.log('✅ Successfully navigated to registration page');
            
            // Focus on first input field
            setTimeout(() => {
                const nameInput = document.getElementById('mainRegisterName');
                if (nameInput) nameInput.focus();
            }, 100);
            
            return true;
        } else {
            console.error('❌ Required page elements not found');
            return false;
        }
    } catch (error) {
        console.error('❌ Error in showMainRegister:', error);
        return false;
    }
}

// Enhanced showMainLogin function
function showMainLogin() {
    console.log('🔄 showMainLogin called - Enhanced version');
    
    try {
        const loginPage = document.getElementById('loginPage');
        const registrationPage = document.getElementById('registrationPage');
        const mainApp = document.getElementById('mainApp');
        
        if (loginPage && registrationPage) {
            // Hide registration page
            registrationPage.classList.add('hidden');
            registrationPage.style.display = 'none';
            
            // Hide main app
            if (mainApp) {
                mainApp.classList.add('hidden');
                mainApp.style.display = 'none';
            }
            
            // Show login page
            loginPage.classList.remove('hidden');
            loginPage.style.display = 'flex';
            
            console.log('✅ Successfully navigated to login page');
            
            // Focus on email input field
            setTimeout(() => {
                const emailInput = document.getElementById('mainLoginEmail');
                if (emailInput) emailInput.focus();
            }, 100);
            
            return true;
        } else {
            console.error('❌ Required page elements not found');
            return false;
        }
    } catch (error) {
        console.error('❌ Error in showMainLogin:', error);
        return false;
    }
}

// Function to setup enhanced create account links
function setupCreateAccountLinks() {
    console.log('🔧 Setting up enhanced Create Account links...');
    
    // Find all create account links
    const createAccountLinks = document.querySelectorAll('a[onclick*="showMainRegister"], a[href="#register"], .create-account-link');
    
    createAccountLinks.forEach((link, index) => {
        console.log(`✅ Found create account link ${index + 1}:`, link.textContent.trim());
        
        // Remove existing onclick
        link.removeAttribute('onclick');
        
        // Add enhanced click handler
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚀 Create Account link clicked - Enhanced handler');
            showMainRegister();
            return false;
        });
        
        // Also set onclick as backup
        link.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚀 Create Account link clicked - Backup onclick handler');
            showMainRegister();
            return false;
        };
    });
    
    // Global click interceptor for create account links
    document.addEventListener('click', function(e) {
        const target = e.target;
        const text = target.textContent.toLowerCase();
        
        if (target.tagName === 'A' && (
            text.includes('create account') || 
            text.includes('register') || 
            text.includes('sign up') ||
            target.getAttribute('onclick')?.includes('showMainRegister')
        )) {
            console.log('🚨 Global interceptor: Create Account link clicked');
            e.preventDefault();
            e.stopPropagation();
            showMainRegister();
            return false;
        }
    }, true);
    
    console.log('✅ Create Account links setup completed');
}

// Function to setup back to login links
function setupBackToLoginLinks() {
    console.log('🔧 Setting up back to login links...');
    
    // Find all back to login links
    const backToLoginLinks = document.querySelectorAll('a[onclick*="showMainLogin"], .back-to-login-link');
    
    backToLoginLinks.forEach((link, index) => {
        console.log(`✅ Found back to login link ${index + 1}:`, link.textContent.trim());
        
        // Remove existing onclick
        link.removeAttribute('onclick');
        
        // Add enhanced click handler
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚀 Back to Login link clicked - Enhanced handler');
            showMainLogin();
            return false;
        });
        
        // Also set onclick as backup
        link.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚀 Back to Login link clicked - Backup onclick handler');
            showMainLogin();
            return false;
        };
    });
    
    console.log('✅ Back to Login links setup completed');
}

// Enhanced role selection function
function selectRole(role) {
    console.log('🎯 Role selected:', role);
    
    // Remove active class from all role buttons
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
        btn.classList.remove('bg-blue-50', 'border-blue-300');
        btn.classList.add('border-gray-300');
    });
    
    // Add active class to selected role
    const selectedButton = document.getElementById(`role${role.charAt(0).toUpperCase() + role.slice(1)}`);
    if (selectedButton) {
        selectedButton.classList.add('bg-blue-50', 'border-blue-300');
        selectedButton.classList.remove('border-gray-300');
    }
    
    // Update hidden input
    const roleInput = document.getElementById('mainRegisterRole');
    if (roleInput) {
        roleInput.value = role;
    }
    
    console.log('✅ Role selection updated');
}

// Password visibility toggle functions
function toggleMainPasswordVisibility() {
    togglePasswordVisibility('mainLoginPassword', 'mainPasswordIcon');
}

function toggleMainRegisterPasswordVisibility() {
    togglePasswordVisibility('mainRegisterPassword', 'mainRegisterPasswordIcon');
}

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Initialize enhanced navigation
function initializeEnhancedNavigation() {
    console.log('🚀 Initializing enhanced navigation...');
    
    // Setup links after DOM is fully loaded
    setTimeout(() => {
        setupCreateAccountLinks();
        setupBackToLoginLinks();
        
        // Setup role selection buttons
        const roleButtons = document.querySelectorAll('.role-btn');
        roleButtons.forEach(btn => {
            const role = btn.id.replace('role', '').toLowerCase();
            btn.onclick = () => selectRole(role);
        });
        
        console.log('✅ Enhanced navigation initialized successfully');
    }, 500);
    
    // Additional setup after longer delay to catch dynamically loaded content
    setTimeout(() => {
        setupCreateAccountLinks();
        setupBackToLoginLinks();
        console.log('🔄 Enhanced navigation re-initialized for dynamic content');
    }, 2000);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedNavigation);
} else {
    // DOM is already loaded
    setTimeout(initializeEnhancedNavigation, 100);
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    setTimeout(initializeEnhancedNavigation, 300);
});

// Assign functions to global scope for compatibility
window.showMainRegister = showMainRegister;
window.showMainLogin = showMainLogin;
window.selectRole = selectRole;
window.toggleMainPasswordVisibility = toggleMainPasswordVisibility;
window.toggleMainRegisterPasswordVisibility = toggleMainRegisterPasswordVisibility;
window.togglePasswordVisibility = togglePasswordVisibility;

console.log('✅ Fixed navigation functions loaded successfully');