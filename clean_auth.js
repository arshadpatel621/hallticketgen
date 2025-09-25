// Clean Authentication System for EduConnect
// No demo modes - Only real Supabase authentication with email verification

console.log('🚀 Loading clean authentication system...');

// Initialize Supabase client
let supabaseClient = null;

// Supabase configuration
const SUPABASE_URL = 'https://rhvvqpiazcnsmknsowrx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodnZxcGlhemNuc21rbnNvd3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTUwMDAsImV4cCI6MjA3MzQzMTAwMH0.tVVwDY42PuYVlMlgixMC4mbQ11_CMVKCTKjsVRW2YeA';

// Initialize Supabase client
function initializeSupabase() {
    try {
        if (typeof supabase !== 'undefined' && supabase.createClient) {
            const { createClient } = supabase;
            supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true,
                    redirectTo: window.location.origin
                }
            });
            console.log('✅ Supabase client initialized successfully');
            return true;
        } else {
            console.error('❌ Supabase library not loaded');
            return false;
        }
    } catch (error) {
        console.error('❌ Error initializing Supabase client:', error);
        return false;
    }
}

// Registration handler - Clean version
async function handleRegistration(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('📝 Starting registration process...');
    
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
        
        console.log('📋 Registration data collected:', { name, email, institution, role });
        
        // Validation
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
        if (!supabaseClient) {
            throw new Error('Authentication service is not available. Please refresh the page and try again.');
        }
        
        console.log('✅ Validation passed, attempting Supabase registration...');
        
        // Register user with Supabase Auth
        const { data, error } = await supabaseClient.auth.signUp({
            email: email.toLowerCase(),
            password: password,
            options: {
                emailRedirectTo: `${window.location.origin}?verified=true`,
                data: {
                    name: name,
                    institution: institution,
                    role: role,
                    phone: phone || null,
                    created_at: new Date().toISOString()
                }
            }
        });
        
        console.log('📊 Supabase registration response:', { data: data?.user?.id, error: error?.message });
        
        if (error) {
            console.error('🚨 Registration error:', error);
            
            // Handle specific errors
            if (error.message.includes('User already registered')) {
                throw new Error('An account with this email already exists. Please login instead.');
            } else if (error.message.includes('Password should be at least')) {
                throw new Error('Password must be at least 6 characters long.');
            } else if (error.message.includes('Invalid email')) {
                throw new Error('Please enter a valid email address.');
            }
            
            throw new Error(error.message);
        }
        
        if (data.user) {
            console.log('✅ Registration successful:', data.user.email);
            
            // Store temporary registration data for later database insertion
            sessionStorage.setItem('pendingRegistration', JSON.stringify({
                userId: data.user.id,
                name: name,
                email: email,
                institution: institution,
                phone: phone || null,
                role: role,
                registrationTime: new Date().toISOString()
            }));
            
            // Show email verification message
            showEmailVerificationDialog(email);
        }
        
    } catch (error) {
        console.error('💥 Registration error:', error);
        showErrorMessage(error.message);
        
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

// Login handler - Clean version
async function handleLogin(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('🔑 Starting login process...');
    
    const submitBtn = document.getElementById('mainLoginSubmitBtn');
    const buttonText = document.getElementById('mainLoginButtonText');
    const originalText = buttonText ? buttonText.textContent : 'Sign In';
    
    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    }
    if (buttonText) {
        buttonText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
    }
    
    try {
        // Get form data
        const email = document.getElementById('mainLoginEmail')?.value?.trim();
        const password = document.getElementById('mainLoginPassword')?.value;
        const rememberMe = document.getElementById('mainRememberMe')?.checked || false;
        
        console.log('📋 Login data collected:', { email, rememberMe });
        
        // Validation
        if (!email) throw new Error('Please enter your email address.');
        if (!password) throw new Error('Please enter your password.');
        
        if (!email.includes('@')) {
            throw new Error('Please enter a valid email address.');
        }
        
        // Check Supabase availability
        if (!supabaseClient) {
            throw new Error('Authentication service is not available. Please refresh the page and try again.');
        }
        
        console.log('✅ Validation passed, attempting Supabase login...');
        
        // Authenticate with Supabase
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: password
        });
        
        console.log('📊 Supabase login response:', { user: data?.user?.email, error: error?.message });
        
        if (error) {
            console.error('🚨 Login error:', error);
            
            // Handle specific errors
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('Invalid email or password. Please check your credentials.');
            } else if (error.message.includes('Email not confirmed')) {
                throw new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
            }
            
            throw new Error(error.message);
        }
        
        if (!data.user) {
            throw new Error('Login failed - no user data received.');
        }
        
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
            console.warn('⚠ Email not verified');
            throw new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
        }
        
        console.log('👤 User authenticated successfully:', data.user.email);
        
        // Create user profile from metadata
        const userProfile = {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email.split('@')[0],
            email: data.user.email,
            role: data.user.user_metadata?.role || 'teacher',
            institution: data.user.user_metadata?.institution || 'Unknown Institution',
            phone: data.user.user_metadata?.phone || null,
            email_verified: true,
            last_login: new Date().toISOString()
        };
        
        // Store authentication data
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', data.session.access_token);
        storage.setItem('userData', JSON.stringify(userProfile));
        
        if (rememberMe) {
            localStorage.setItem('rememberUser', 'true');
        }
        
        // Update global state
        window.currentUser = userProfile;
        window.isLoggedIn = true;
        
        console.log('🎉 Login successful! User profile:', userProfile.name);
        
        // Ensure user is in database (will be created if not exists after email verification)
        await ensureUserInDatabase(userProfile);
        
        // Show success message
        showSuccessMessage('Login successful! Welcome to EduConnect.');
        
        // Clear form
        if (document.getElementById('mainLoginEmail')) document.getElementById('mainLoginEmail').value = '';
        if (document.getElementById('mainLoginPassword')) document.getElementById('mainLoginPassword').value = '';
        
        // Redirect to main app
        setTimeout(() => {
            showMainApplication();
        }, 1000);
        
    } catch (error) {
        console.error('💥 Login error:', error);
        showErrorMessage(error.message);
        
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
        }
        if (buttonText) {
            buttonText.textContent = originalText;
        }
    }
}

// Ensure user is stored in database after email verification
async function ensureUserInDatabase(userProfile) {
    try {
        console.log('🗃 Ensuring user is in database...');
        
        // Check if user already exists in database
        const { data: existingUser, error: fetchError } = await supabaseClient
            .from('users')
            .select('id')
            .eq('id', userProfile.id)
            .single();
        
        if (existingUser) {
            console.log('✅ User already exists in database');
            return true;
        }
        
        // User doesn't exist, create new record
        const { data: newUser, error: insertError } = await supabaseClient
            .from('users')
            .insert([{
                id: userProfile.id,
                name: userProfile.name,
                email: userProfile.email,
                role: userProfile.role,
                institution: userProfile.institution,
                phone: userProfile.phone,
                is_active: true,
                email_verified: true,
                last_login: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (insertError) {
            console.error('❌ Failed to create user in database:', insertError);
            // Don't throw error - login can still proceed
            return false;
        }
        
        console.log('✅ User created in database successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Error ensuring user in database:', error);
        return false;
    }
}

// Handle email verification redirect
async function handleEmailVerification() {
    console.log('📧 Handling email verification...');
    
    try {
        // Check if this is a verification redirect
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const type = urlParams.get('type');
        
        if (type === 'signup' && accessToken) {
            console.log('✅ Email verification detected');
            
            // Set the session
            const { data, error } = await supabaseClient.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            });
            
            if (error) {
                console.error('❌ Failed to set session:', error);
                throw new Error('Email verification failed. Please try again.');
            }
            
            if (data.user) {
                console.log('✅ Email verified successfully:', data.user.email);
                
                // Get pending registration data
                const pendingData = sessionStorage.getItem('pendingRegistration');
                let userData = null;
                
                if (pendingData) {
                    userData = JSON.parse(pendingData);
                    sessionStorage.removeItem('pendingRegistration');
                } else {
                    // Fallback to user metadata
                    userData = {
                        userId: data.user.id,
                        name: data.user.user_metadata?.name || data.user.email.split('@')[0],
                        email: data.user.email,
                        institution: data.user.user_metadata?.institution || 'Unknown',
                        phone: data.user.user_metadata?.phone || null,
                        role: data.user.user_metadata?.role || 'teacher'
                    };
                }
                
                // Now create user in database
                await createUserInDatabase(userData);
                
                // Clear URL parameters
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Show success message and redirect to login
                showEmailVerifiedMessage(data.user.email);
            }
        }
    } catch (error) {
        console.error('💥 Email verification error:', error);
        showErrorMessage(error.message);
        
        // Redirect to login page anyway
        setTimeout(() => {
            showLoginPage();
        }, 3000);
    }
}

// Create user in database after email verification
async function createUserInDatabase(userData) {
    try {
        console.log('🗃 Creating user in database after email verification...');
        
        const { data: newUser, error } = await supabaseClient
            .from('users')
            .insert([{
                id: userData.userId,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                institution: userData.institution,
                phone: userData.phone,
                is_active: true,
                email_verified: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) {
            console.error('❌ Failed to create user in database:', error);
            // Don't throw - user can still login
        } else {
            console.log('✅ User created in database successfully:', newUser.email);
        }
        
    } catch (error) {
        console.error('❌ Error creating user in database:', error);
    }
}

// Show email verification dialog
function showEmailVerificationDialog(email) {
    console.log('📧 Showing email verification dialog for:', email);
    
    // Remove any existing dialogs
    const existing = document.getElementById('emailVerificationDialog');
    if (existing) existing.remove();
    
    const dialog = document.createElement('div');
    dialog.id = 'emailVerificationDialog';
    dialog.style.cssText = `
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
    
    dialog.innerHTML = `
        <div style="max-width: 28rem; width: 90%; background: white; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); padding: 2rem; text-align: center;">
            <div style="width: 4rem; height: 4rem; background: linear-gradient(135deg, #10b981, #3b82f6); border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                <i class="fas fa-envelope" style="color: white; font-size: 1.5rem;"></i>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #1f2937;">Check Your Email</h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">We've sent a verification link to:</p>
            <div style="font-weight: 600; color: #3b82f6; background: #eff6ff; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1.5rem; word-break: break-word;">${email}</div>
            <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6;">
                Click the link in the email to verify your account. After verification, you'll be able to login with your password.
            </p>
            <button id="backToLoginFromVerification" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600; margin-right: 0.5rem;">
                <i class="fas fa-arrow-left mr-2"></i>Back to Login
            </button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Add event listener
    document.getElementById('backToLoginFromVerification').onclick = () => {
        dialog.remove();
        showLoginPage();
    };
    
    // Hide other pages
    ['loginPage', 'registrationPage', 'mainApp'].forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) page.classList.add('hidden');
    });
}

// Show email verified success message
function showEmailVerifiedMessage(email) {
    console.log('✅ Showing email verified message for:', email);
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
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
    
    dialog.innerHTML = `
        <div style="max-width: 28rem; width: 90%; background: white; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); padding: 2rem; text-align: center;">
            <div style="width: 4rem; height: 4rem; background: linear-gradient(135deg, #10b981, #059669); border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                <i class="fas fa-check-circle" style="color: white; font-size: 1.5rem;"></i>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #1f2937;">Email Verified!</h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">Your account has been successfully verified:</p>
            <div style="font-weight: 600; color: #059669; background: #d1fae5; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1.5rem; word-break: break-word;">${email}</div>
            <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6;">
                You can now login to EduConnect with your email and password.
            </p>
            <button id="goToLoginAfterVerification" style="background: #059669; color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
                <i class="fas fa-sign-in-alt mr-2"></i>Go to Login
            </button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Add event listener
    document.getElementById('goToLoginAfterVerification').onclick = () => {
        dialog.remove();
        showLoginPage();
    };
}

// Page navigation functions
function showMainApplication() {
    document.getElementById('loginPage')?.classList.add('hidden');
    document.getElementById('registrationPage')?.classList.add('hidden');
    document.getElementById('mainApp')?.classList.remove('hidden');
    console.log('✅ Navigated to main application');
}

function showLoginPage() {
    document.getElementById('loginPage')?.classList.remove('hidden');
    document.getElementById('registrationPage')?.classList.add('hidden');
    document.getElementById('mainApp')?.classList.add('hidden');
    console.log('✅ Navigated to login page');
}

function showRegistrationPage() {
    document.getElementById('loginPage')?.classList.add('hidden');
    document.getElementById('registrationPage')?.classList.remove('hidden');
    document.getElementById('mainApp')?.classList.add('hidden');
    console.log('✅ Navigated to registration page');
}

// Message display functions
function showErrorMessage(message) {
    const existing = document.getElementById('errorMessage');
    if (existing) existing.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        color: #991b1b;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 99999;
        max-width: 300px;
        border: 1px solid #fca5a5;
    `;
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start;">
            <i class="fas fa-exclamation-circle" style="margin-right: 0.5rem; margin-top: 0.25rem;"></i>
            <div style="flex: 1;">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #991b1b; cursor: pointer; margin-left: 0.5rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) errorDiv.remove();
    }, 7000);
}

function showSuccessMessage(message) {
    const existing = document.getElementById('successMessage');
    if (existing) existing.remove();
    
    const successDiv = document.createElement('div');
    successDiv.id = 'successMessage';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dcfce7;
        color: #166534;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 99999;
        max-width: 300px;
        border: 1px solid #86efac;
    `;
    
    successDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start;">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem; margin-top: 0.25rem;"></i>
            <div style="flex: 1;">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #166534; cursor: pointer; margin-left: 0.5rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) successDiv.remove();
    }, 5000);
}

// Initialize the clean authentication system
function initializeCleanAuth() {
    console.log('🚀 Initializing clean authentication system...');
    
    // Initialize Supabase
    if (!initializeSupabase()) {
        console.error('❌ Failed to initialize Supabase');
        return;
    }
    
    // Check for email verification in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('access_token') || urlParams.get('verified') === 'true') {
        handleEmailVerification();
        return;
    }
    
    // Setup form handlers
    setTimeout(() => {
        // Registration form
        const registerForm = document.getElementById('mainRegisterForm');
        if (registerForm) {
            registerForm.onsubmit = handleRegistration;
            console.log('✅ Registration form handler attached');
        }
        
        // Login form
        const loginForm = document.getElementById('mainLoginForm');
        if (loginForm) {
            loginForm.onsubmit = handleLogin;
            console.log('✅ Login form handler attached');
        }
        
        // Navigation links
        const createAccountLinks = document.querySelectorAll('a[onclick*="showMainRegister"]');
        createAccountLinks.forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                showRegistrationPage();
                return false;
            };
        });
        
        const backToLoginLinks = document.querySelectorAll('a[onclick*="showMainLogin"]');
        backToLoginLinks.forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                showLoginPage();
                return false;
            };
        });
        
    }, 500);
    
    // Check if user is already logged in
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            if (user.email_verified) {
                window.currentUser = user;
                window.isLoggedIn = true;
                showMainApplication();
                console.log('✅ User already logged in:', user.email);
                return;
            }
        } catch (error) {
            console.error('❌ Failed to parse stored user data:', error);
        }
    }
    
    // Show login page by default
    showLoginPage();
    
    console.log('✅ Clean authentication system initialized');
}

// Global function assignments
window.handleRegistration = handleRegistration;
window.handleLogin = handleLogin;
window.showMainRegister = showRegistrationPage;
window.showMainLogin = showLoginPage;
window.showMainApp = showMainApplication;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCleanAuth);
} else {
    setTimeout(initializeCleanAuth, 100);
}

console.log('✅ Clean authentication module loaded successfully');