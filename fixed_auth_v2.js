// Enhanced Fixed Authentication Functions for EduConnect
// This file provides improved authentication with better error handling and debugging

console.log('🚀 Loading enhanced authentication module...');

// Global variables
let isAuthInitialized = false;
let authRetryCount = 0;
const MAX_AUTH_RETRIES = 3;

// Initialize authentication system
function initializeAuthentication() {
    console.log('🔧 Initializing authentication system...');
    
    // Ensure Supabase is available
    if (!window.supabaseClient) {
        console.error('❌ Supabase client not found in window object');
        return false;
    }
    
    // Setup form handlers with multiple methods
    setupLoginFormHandlers();
    setupRegistrationFormHandlers();
    setupPasswordVisibilityToggles();
    
    isAuthInitialized = true;
    console.log('✅ Authentication system initialized successfully');
    return true;
}

// Enhanced form handler setup
function setupLoginFormHandlers() {
    console.log('🔧 Setting up login form handlers...');
    
    const loginForm = document.getElementById('mainLoginForm');
    if (loginForm) {
        // Remove existing handlers
        loginForm.onsubmit = null;
        
        // Add new handlers with multiple methods
        const handleLoginSubmit = (event) => {
            event.preventDefault();
            console.log('🔑 Login form submitted via handler');
            handleMainLogin(event);
            return false;
        };
        
        // Method 1: Standard event listener
        loginForm.addEventListener('submit', handleLoginSubmit, { passive: false });
        
        // Method 2: Direct assignment
        loginForm.onsubmit = handleLoginSubmit;
        
        // Method 3: Button click handler as backup
        const submitButton = document.getElementById('mainLoginSubmitBtn');
        if (submitButton) {
            submitButton.onclick = (event) => {
                event.preventDefault();
                console.log('🔑 Login button clicked directly');
                handleMainLogin(event);
                return false;
            };
        }
        
        console.log('✅ Login form handlers attached successfully');
    } else {
        console.warn('⚠ Login form not found, will retry...');
        setTimeout(() => setupLoginFormHandlers(), 1000);
    }
}

// Enhanced registration form handler setup
function setupRegistrationFormHandlers() {
    console.log('🔧 Setting up registration form handlers...');
    
    const registerForm = document.getElementById('mainRegisterForm');
    if (registerForm) {
        // Remove existing handlers
        registerForm.onsubmit = null;
        
        // Add new handlers
        const handleRegisterSubmit = (event) => {
            event.preventDefault();
            console.log('📝 Registration form submitted via handler');
            handleMainRegister(event);
            return false;
        };
        
        // Multiple handler methods
        registerForm.addEventListener('submit', handleRegisterSubmit, { passive: false });
        registerForm.onsubmit = handleRegisterSubmit;
        
        // Button click handler
        const submitButton = document.getElementById('mainRegisterSubmitBtn');
        if (submitButton) {
            submitButton.onclick = (event) => {
                event.preventDefault();
                console.log('📝 Registration button clicked directly');
                handleMainRegister(event);
                return false;
            };
        }
        
        console.log('✅ Registration form handlers attached successfully');
    } else {
        console.warn('⚠ Registration form not found, will retry...');
        setTimeout(() => setupRegistrationFormHandlers(), 1000);
    }
}

// Enhanced login handler with better error handling
async function handleMainLogin(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('🔑 LOGIN ATTEMPT STARTED - Enhanced Version');
    
    const submitBtn = document.getElementById('mainLoginSubmitBtn');
    const buttonText = document.getElementById('mainLoginButtonText');
    const originalText = buttonText ? buttonText.textContent : 'Sign In';
    
    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'wait';
    }
    if (buttonText) {
        buttonText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
    }
    
    try {
        // Get form data with validation
        const email = document.getElementById('mainLoginEmail')?.value?.trim();
        const password = document.getElementById('mainLoginPassword')?.value;
        const rememberMe = document.getElementById('mainRememberMe')?.checked || false;
        
        console.log('📋 Form data validation:');
        console.log('- Email:', email ? 'Provided' : 'MISSING');
        console.log('- Password:', password ? 'Provided' : 'MISSING');
        console.log('- Remember me:', rememberMe);
        
        // Enhanced validation
        if (!email) {
            throw new Error('Please enter your email address.');
        }
        
        if (!password) {
            throw new Error('Please enter your password.');
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            throw new Error('Please enter a valid email address.');
        }
        
        if (password.length < 3) {
            throw new Error('Password is too short.');
        }
        
        // Check Supabase availability with retry
        if (!window.supabaseClient) {
            console.error('❌ Supabase client not available, attempting to reinitialize...');
            const initResult = await reinitializeSupabase();
            if (!initResult) {
                throw new Error('Authentication service is currently unavailable. Please refresh the page and try again.');
            }
        }
        
        console.log('✅ Pre-flight checks passed, attempting authentication...');
        
        // Perform authentication
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: password
        });
        
        console.log('📊 Authentication response received');
        
        if (error) {
            console.error('🚨 Authentication error:', error);
            throw new Error(formatAuthError(error.message));
        }
        
        if (!data.user) {
            throw new Error('Authentication failed - no user data received.');
        }
        
        console.log('👤 User authenticated successfully:', data.user.email);
        
        // Check email verification
        if (!data.user.email_confirmed_at) {
            console.warn('⚠ Email not verified');
            throw new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
        }
        
        // Create user profile
        const profile = {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email.split('@')[0],
            email: data.user.email,
            role: data.user.user_metadata?.role || 'teacher',
            institution: data.user.user_metadata?.institution || 'Unknown Institution',
            phone: data.user.user_metadata?.phone || null
        };
        
        // Store authentication data
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', data.session.access_token);
        storage.setItem('userData', JSON.stringify(profile));
        if (rememberMe) {
            localStorage.setItem('rememberUser', 'true');
        }
        
        // Update global state
        window.currentUser = profile;
        window.isLoggedIn = true;
        
        console.log('🎉 Login successful! Redirecting to main app...');
        showSuccess('Login successful! Welcome to EduConnect.');
        
        // Clear form
        document.getElementById('mainLoginEmail').value = '';
        document.getElementById('mainLoginPassword').value = '';
        
        // Redirect after success message
        setTimeout(() => {
            if (typeof showMainApp === 'function') {
                showMainApp();
            } else {
                console.warn('⚠ showMainApp function not found, trying alternative redirect...');
                redirectToMainApp();
            }
        }, 1000);
        
    } catch (error) {
        console.error('💥 Login error:', error);
        showError(error.message);
        
        // Focus back to form
        setTimeout(() => {
            const emailField = document.getElementById('mainLoginEmail');
            if (emailField) emailField.focus();
        }, 100);
        
    } finally {
        // Reset button state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
        if (buttonText) {
            buttonText.textContent = originalText;
        }
        console.log('🔄 Login form reset to original state');
    }
}

// Enhanced registration handler
async function handleMainRegister(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('📝 REGISTRATION ATTEMPT STARTED - Enhanced Version');
    
    const submitBtn = document.getElementById('mainRegisterSubmitBtn');
    const buttonText = document.getElementById('mainRegisterButtonText');
    const originalText = buttonText ? buttonText.textContent : 'Create Account';
    
    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    }
    if (buttonText) {
        buttonText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating account...';
    }
    
    try {
        // Get form data
        const name = document.getElementById('mainRegisterName')?.value?.trim();
        const email = document.getElementById('mainRegisterEmail')?.value?.trim();
        const institution = document.getElementById('mainRegisterInstitution')?.value?.trim();
        const phone = document.getElementById('mainRegisterPhone')?.value?.trim();
        const role = document.getElementById('mainRegisterRole')?.value;
        const password = document.getElementById('mainRegisterPassword')?.value;
        
        console.log('📋 Registration data validation:');
        console.log('- Name:', name ? 'Provided' : 'MISSING');
        console.log('- Email:', email ? 'Provided' : 'MISSING');
        console.log('- Institution:', institution ? 'Provided' : 'MISSING');
        console.log('- Role:', role || 'MISSING');
        
        // Enhanced validation
        if (!name) throw new Error('Please enter your full name.');
        if (!email) throw new Error('Please enter your email address.');
        if (!institution) throw new Error('Please enter your institution name.');
        if (!role) throw new Error('Please select your role.');
        if (!password) throw new Error('Please enter a password.');
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            throw new Error('Please enter a valid email address.');
        }
        
        // Check Supabase availability
        if (!window.supabaseClient) {
            const initResult = await reinitializeSupabase();
            if (!initResult) {
                throw new Error('Authentication service is currently unavailable. Please refresh the page and try again.');
            }
        }
        
        console.log('✅ Registration validation passed, creating account...');
        
        // Create user account
        const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
            email: email.toLowerCase(),
            password: password,
            options: {
                emailRedirectTo: window.location.origin + '?verified=true',
                data: {
                    name: name,
                    institution: institution,
                    role: role,
                    phone: phone || null
                }
            }
        });
        
        if (authError) {
            console.error('🚨 Registration error:', authError);
            throw new Error(formatAuthError(authError.message));
        }
        
        if (authData.user) {
            console.log('✅ Registration successful:', authData.user.email);
            
            // Show verification message
            showEmailVerificationMessage(email);
            
            // Store pending user data
            sessionStorage.setItem('pendingUserData', JSON.stringify({
                id: authData.user.id,
                name: name,
                email: email,
                institution: institution,
                phone: phone || null,
                role: role
            }));
        }
        
    } catch (error) {
        console.error('💥 Registration error:', error);
        showError(error.message);
        
    } finally {
        // Reset button state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
        if (buttonText) {
            buttonText.textContent = originalText;
        }
    }
}

// Utility function to format auth errors
function formatAuthError(message) {
    const errorMap = {
        'Invalid login credentials': 'Invalid email or password. Please check your credentials and try again.',
        'Email not confirmed': 'Please verify your email address before logging in. Check your inbox for the verification link.',
        'User already registered': 'An account with this email already exists. Please login instead or use the password reset option.',
        'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
        'Invalid email': 'Please enter a valid email address.',
        'service unavailable': 'Authentication service is temporarily unavailable. Please try again in a few minutes.',
        'Network error': 'Network connection error. Please check your internet connection and try again.',
        'rate_limit_exceeded': 'Too many attempts. Please wait a few minutes before trying again.'
    };
    
    for (const [key, value] of Object.entries(errorMap)) {
        if (message.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }
    
    return message || 'An unexpected error occurred. Please try again.';
}

// Reinitialize Supabase client
async function reinitializeSupabase() {
    console.log('🔄 Attempting to reinitialize Supabase client...');
    
    try {
        if (typeof supabase !== 'undefined' && supabase.createClient) {
            const { createClient } = supabase;
            window.supabaseClient = createClient(
                window.SUPABASE_URL || 'https://rhvvqpiazcnsmknsowrx.supabase.co',
                window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodnZxcGlhemNuc21rbnNvd3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTUwMDAsImV4cCI6MjA3MzQzMTAwMH0.tVVwDY42PuYVlMlgixMC4mbQ11_CMVKCTKjsVRW2YeA',
                {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: false
                    }
                }
            );
            
            console.log('✅ Supabase client reinitialized successfully');
            return true;
        } else {
            console.error('❌ Supabase library not available');
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to reinitialize Supabase client:', error);
        return false;
    }
}

// Redirect to main app
function redirectToMainApp() {
    console.log('🔄 Attempting alternative main app redirect...');
    
    // Hide login/registration pages
    const pagesToHide = ['loginPage', 'registrationPage'];
    pagesToHide.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('hidden');
            page.style.display = 'none';
        }
    });
    
    // Show main app
    const mainApp = document.getElementById('mainApp');
    if (mainApp) {
        mainApp.classList.remove('hidden');
        mainApp.style.display = 'block';
        console.log('✅ Main app shown via alternative method');
    } else {
        console.error('❌ Main app element not found');
        // Reload page as last resort
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

// Setup password visibility toggles
function setupPasswordVisibilityToggles() {
    // Login password toggle
    const loginToggle = document.querySelector('[onclick="toggleMainPasswordVisibility()"]');
    if (loginToggle) {
        loginToggle.onclick = () => togglePasswordVisibility('mainLoginPassword', 'mainPasswordIcon');
    }
    
    // Registration password toggle
    const registerToggle = document.querySelector('[onclick="toggleMainRegisterPasswordVisibility()"]');
    if (registerToggle) {
        registerToggle.onclick = () => togglePasswordVisibility('mainRegisterPassword', 'mainRegisterPasswordIcon');
    }
}

// Enhanced password visibility toggle
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

// Enhanced error display function
function showError(message) {
    // Remove existing error
    const existing = document.getElementById('errorMessage');
    if (existing) existing.remove();
    
    // Create new error
    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #fee2e2, #fecaca);
        color: #991b1b;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 99999;
        max-width: 350px;
        border: 1px solid #fca5a5;
        animation: slideIn 0.3s ease-out;
    `;
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <i class="fas fa-exclamation-circle" style="color: #dc2626; margin-top: 0.25rem; font-size: 1.1rem;"></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Error</div>
                <div style="font-size: 0.9rem; line-height: 1.4;">${message}</div>
            </div>
            <button id="closeErrorBtn" style="background: none; border: none; color: #991b1b; cursor: pointer; padding: 0.25rem; border-radius: 0.25rem; hover:background: rgba(0,0,0,0.1);">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Add close handler
    document.getElementById('closeErrorBtn').onclick = () => errorDiv.remove();
    
    // Auto-remove after 7 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) errorDiv.remove();
    }, 7000);
    
    // Add animation styles
    if (!document.getElementById('errorAnimationStyles')) {
        const styles = document.createElement('style');
        styles.id = 'errorAnimationStyles';
        styles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Enhanced success display function
function showSuccess(message) {
    // Remove existing success
    const existing = document.getElementById('successMessage');
    if (existing) existing.remove();
    
    // Create new success
    const successDiv = document.createElement('div');
    successDiv.id = 'successMessage';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #dcfce7, #bbf7d0);
        color: #166534;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 99999;
        max-width: 350px;
        border: 1px solid #86efac;
        animation: slideIn 0.3s ease-out;
    `;
    
    successDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <i class="fas fa-check-circle" style="color: #059669; margin-top: 0.25rem; font-size: 1.1rem;"></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Success</div>
                <div style="font-size: 0.9rem; line-height: 1.4;">${message}</div>
            </div>
            <button id="closeSuccessBtn" style="background: none; border: none; color: #166534; cursor: pointer; padding: 0.25rem; border-radius: 0.25rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Add close handler
    document.getElementById('closeSuccessBtn').onclick = () => successDiv.remove();
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) successDiv.remove();
    }, 5000);
}

// Enhanced email verification message
function showEmailVerificationMessage(email) {
    console.log('📧 Showing enhanced email verification message for:', email);
    
    // Remove any existing verification messages
    const existing = document.getElementById('emailVerificationMessage');
    if (existing) existing.remove();
    
    const verificationDiv = document.createElement('div');
    verificationDiv.id = 'emailVerificationMessage';
    verificationDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        backdrop-filter: blur(4px);
    `;
    
    verificationDiv.innerHTML = `
        <div style="max-width: 32rem; width: 90%; background: white; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); padding: 2.5rem; text-align: center; animation: modalSlideIn 0.4s ease-out;">
            <div style="width: 5rem; height: 5rem; background: linear-gradient(135deg, #10b981, #3b82f6); border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; animation: pulse 2s infinite;">
                <i class="fas fa-envelope" style="color: white; font-size: 2rem;"></i>
            </div>
            <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: #1f2937; line-height: 1.2;">Check Your Email</h2>
            <p style="color: #6b7280; margin-bottom: 1.5rem; font-size: 1.1rem;">We've sent a verification link to:</p>
            <div style="font-weight: 600; color: #3b82f6; background: #eff6ff; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem; border: 1px solid #dbeafe; word-break: break-word;">${email}</div>
            <p style="font-size: 1rem; color: #6b7280; margin-bottom: 2rem; line-height: 1.6;">Click the link in the email to verify your account. You will be automatically logged in to EduConnect after verification.</p>
            <div style="display: flex; gap: 1rem; flex-direction: column; sm:flex-direction: row;">
                <button id="backToLoginBtn" style="flex: 1; background: #3b82f6; color: white; border: none; padding: 1rem 2rem; border-radius: 0.75rem; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.2s; hover:background: #2563eb;">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Login
                </button>
                <button id="resendEmailBtn" style="flex: 1; background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; padding: 1rem 2rem; border-radius: 0.75rem; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.2s;">
                    <i class="fas fa-redo mr-2"></i>Resend Email
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(verificationDiv);
    
    // Add event listeners
    document.getElementById('backToLoginBtn').onclick = () => {
        verificationDiv.remove();
        if (typeof showMainLogin === 'function') {
            showMainLogin();
        }
    };
    
    document.getElementById('resendEmailBtn').onclick = async () => {
        const btn = document.getElementById('resendEmailBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        btn.disabled = true;
        
        try {
            // Attempt to resend email
            if (window.supabaseClient) {
                await window.supabaseClient.auth.resend({
                    type: 'signup',
                    email: email
                });
                showSuccess('Verification email resent successfully!');
            }
        } catch (error) {
            showError('Failed to resend email. Please try again later.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    };
    
    // Hide other pages
    ['loginPage', 'registrationPage', 'mainApp'].forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) page.classList.add('hidden');
    });
    
    // Add animation styles if not already present
    if (!document.getElementById('modalAnimationStyles')) {
        const styles = document.createElement('style');
        styles.id = 'modalAnimationStyles';
        styles.textContent = `
            @keyframes modalSlideIn {
                from {
                    transform: translateY(-50px) scale(0.9);
                    opacity: 0;
                }
                to {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Global function assignments for compatibility
window.toggleMainPasswordVisibility = () => togglePasswordVisibility('mainLoginPassword', 'mainPasswordIcon');
window.toggleMainRegisterPasswordVisibility = () => togglePasswordVisibility('mainRegisterPassword', 'mainRegisterPasswordIcon');
window.handleMainLogin = handleMainLogin;
window.handleMainRegister = handleMainRegister;
window.showError = showError;
window.showSuccess = showSuccess;
window.showEmailVerificationMessage = showEmailVerificationMessage;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuthentication);
} else {
    // DOM is already loaded
    setTimeout(initializeAuthentication, 100);
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (!isAuthInitialized) {
        console.log('🔄 Backup initialization triggered');
        setTimeout(initializeAuthentication, 500);
    }
});

console.log('✅ Enhanced authentication module loaded successfully');