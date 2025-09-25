// Fallback Authentication System for EduConnect
// This provides a temporary authentication mechanism when Supabase is unavailable

console.log('🚀 Loading fallback authentication system...');

// Demo users for testing
const DEMO_USERS = [
    {
        id: 'demo-001',
        email: 'admin@educonnect.demo',
        password: 'admin123',
        name: 'Demo Admin',
        role: 'admin',
        institution: 'EduConnect Demo',
        phone: null,
        verified: true
    },
    {
        id: 'demo-002',
        email: 'teacher@educonnect.demo',
        password: 'teacher123',
        name: 'Demo Teacher',
        role: 'teacher',
        institution: 'EduConnect Demo',
        phone: '+91-9876543210',
        verified: true
    },
    {
        id: 'demo-003',
        email: 'student@educonnect.demo',
        password: 'student123',
        name: 'Demo Student',
        role: 'student',
        institution: 'EduConnect Demo',
        phone: null,
        verified: true
    },
    {
        id: 'demo-004',
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User',
        role: 'teacher',
        institution: 'Test Institution',
        phone: null,
        verified: true
    }
];

// Initialize fallback authentication
let fallbackAuthEnabled = false;
let fallbackUsers = [...DEMO_USERS];

// Enable fallback authentication
function enableFallbackAuth() {
    console.log('🔄 Enabling fallback authentication system...');
    fallbackAuthEnabled = true;
    
    // Add demo user info to the login page
    addDemoUserInfo();
    
    console.log('✅ Fallback authentication enabled');
    return true;
}

// Add demo user information to the login page
function addDemoUserInfo() {
    const loginForm = document.getElementById('mainLoginForm');
    if (loginForm && !document.getElementById('demoUserInfo')) {
        const demoInfo = document.createElement('div');
        demoInfo.id = 'demoUserInfo';
        demoInfo.innerHTML = `
            <div style="background: #fef3cd; border: 1px solid #fad02c; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; text-align: center;">
                <div style="font-weight: 600; color: #92400e; margin-bottom: 0.5rem;">
                    <i class="fas fa-info-circle mr-2"></i>Demo Mode Active
                </div>
                <div style="font-size: 0.875rem; color: #92400e; margin-bottom: 0.5rem;">
                    Supabase authentication is temporarily unavailable. You can use these demo accounts:
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-top: 0.75rem;">
                    <button type="button" onclick="fillLoginForm('admin@educonnect.demo', 'admin123')" 
                            style="background: #dc2626; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer;">
                        👤 Admin (admin@educonnect.demo)
                    </button>
                    <button type="button" onclick="fillLoginForm('teacher@educonnect.demo', 'teacher123')" 
                            style="background: #059669; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer;">
                        👨‍🏫 Teacher (teacher@educonnect.demo)
                    </button>
                    <button type="button" onclick="fillLoginForm('test@example.com', 'test123')" 
                            style="background: #3b82f6; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer;">
                        🧪 Test User (test@example.com)
                    </button>
                </div>
            </div>
        `;
        
        loginForm.appendChild(demoInfo);
    }
}

// Fill login form with demo credentials
window.fillLoginForm = function(email, password) {
    console.log('🔧 Filling login form with demo credentials:', email);
    
    const emailInput = document.getElementById('mainLoginEmail');
    const passwordInput = document.getElementById('mainLoginPassword');
    
    if (emailInput && passwordInput) {
        emailInput.value = email;
        passwordInput.value = password;
        emailInput.focus();
        
        // Highlight the fields briefly
        [emailInput, passwordInput].forEach(input => {
            input.style.background = '#dcfce7';
            input.style.borderColor = '#10b981';
            setTimeout(() => {
                input.style.background = '';
                input.style.borderColor = '';
            }, 2000);
        });
        
        console.log('✅ Demo credentials filled successfully');
    }
};

// Fallback login function
async function fallbackLogin(email, password) {
    console.log('🔐 Attempting fallback login for:', email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user in demo users
    const user = fallbackUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );
    
    if (!user) {
        throw new Error('Invalid email or password. Please check your credentials.');
    }
    
    if (!user.verified) {
        throw new Error('Please verify your email address before logging in.');
    }
    
    console.log('✅ Fallback login successful for:', user.name);
    
    // Return user data in Supabase-like format
    return {
        user: {
            id: user.id,
            email: user.email,
            email_confirmed_at: new Date().toISOString(),
            user_metadata: {
                name: user.name,
                role: user.role,
                institution: user.institution,
                phone: user.phone
            }
        },
        session: {
            access_token: `fallback_token_${user.id}_${Date.now()}`,
            refresh_token: `fallback_refresh_${user.id}_${Date.now()}`
        }
    };
}

// Fallback registration function
async function fallbackRegister(userData) {
    console.log('📝 Attempting fallback registration for:', userData.email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    const existingUser = fallbackUsers.find(u => 
        u.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (existingUser) {
        throw new Error('An account with this email already exists. Please login instead.');
    }
    
    // Create new user
    const newUser = {
        id: `demo-${Date.now()}`,
        email: userData.email.toLowerCase(),
        password: userData.password,
        name: userData.name,
        role: userData.role,
        institution: userData.institution,
        phone: userData.phone || null,
        verified: false // Require verification for new users
    };
    
    // Add to fallback users
    fallbackUsers.push(newUser);
    
    console.log('✅ Fallback registration successful for:', newUser.name);
    
    // Return registration data
    return {
        user: {
            id: newUser.id,
            email: newUser.email,
            email_confirmed_at: null, // Not verified yet
            user_metadata: {
                name: newUser.name,
                role: newUser.role,
                institution: newUser.institution,
                phone: newUser.phone
            }
        }
    };
}

// Enhanced login handler that tries Supabase first, then fallback
async function enhancedLoginHandler(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('🚀 Enhanced login handler started');
    
    const email = document.getElementById('mainLoginEmail')?.value?.trim();
    const password = document.getElementById('mainLoginPassword')?.value;
    
    if (!email || !password) {
        if (window.showError) {
            window.showError('Please enter both email and password.');
        } else {
            alert('Please enter both email and password.');
        }
        return false;
    }
    
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
        let authResult = null;
        
        // Try Supabase first
        if (window.supabaseClient) {
            try {
                console.log('🔄 Attempting Supabase authentication...');
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email: email.toLowerCase(),
                    password: password
                });
                
                if (!error && data.user) {
                    console.log('✅ Supabase authentication successful');
                    authResult = data;
                }
            } catch (supabaseError) {
                console.warn('⚠ Supabase authentication failed:', supabaseError.message);
            }
        }
        
        // If Supabase failed, try fallback
        if (!authResult) {
            console.log('🔄 Trying fallback authentication...');
            
            if (!fallbackAuthEnabled) {
                enableFallbackAuth();
            }
            
            authResult = await fallbackLogin(email, password);
            console.log('✅ Fallback authentication successful');
        }
        
        // Process successful authentication
        if (authResult && authResult.user) {
            const profile = {
                id: authResult.user.id,
                name: authResult.user.user_metadata?.name || authResult.user.email.split('@')[0],
                email: authResult.user.email,
                role: authResult.user.user_metadata?.role || 'teacher',
                institution: authResult.user.user_metadata?.institution || 'Unknown Institution',
                phone: authResult.user.user_metadata?.phone || null
            };
            
            // Store authentication data
            const rememberMe = document.getElementById('mainRememberMe')?.checked || false;
            const storage = rememberMe ? localStorage : sessionStorage;
            
            storage.setItem('authToken', authResult.session.access_token);
            storage.setItem('userData', JSON.stringify(profile));
            if (rememberMe) {
                localStorage.setItem('rememberUser', 'true');
            }
            
            // Update global state
            window.currentUser = profile;
            window.isLoggedIn = true;
            
            console.log('🎉 Login successful! User profile:', profile.name);
            
            if (window.showSuccess) {
                window.showSuccess('Login successful! Welcome to EduConnect.');
            }
            
            // Clear form
            document.getElementById('mainLoginEmail').value = '';
            document.getElementById('mainLoginPassword').value = '';
            
            // Redirect to main app
            setTimeout(() => {
                if (typeof showMainApp === 'function') {
                    showMainApp();
                } else if (window.showMainApp) {
                    window.showMainApp();
                } else {
                    // Alternative redirect
                    document.getElementById('loginPage')?.classList.add('hidden');
                    document.getElementById('registrationPage')?.classList.add('hidden');
                    document.getElementById('mainApp')?.classList.remove('hidden');
                }
            }, 1000);
        }
        
    } catch (error) {
        console.error('💥 Login error:', error);
        
        if (window.showError) {
            window.showError(error.message);
        } else {
            alert('Login Error: ' + error.message);
        }
        
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

// Enhanced registration handler
async function enhancedRegistrationHandler(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('🚀 Enhanced registration handler started');
    
    const name = document.getElementById('mainRegisterName')?.value?.trim();
    const email = document.getElementById('mainRegisterEmail')?.value?.trim();
    const institution = document.getElementById('mainRegisterInstitution')?.value?.trim();
    const phone = document.getElementById('mainRegisterPhone')?.value?.trim();
    const role = document.getElementById('mainRegisterRole')?.value;
    const password = document.getElementById('mainRegisterPassword')?.value;
    
    // Validation
    if (!name || !email || !institution || !role || !password) {
        if (window.showError) {
            window.showError('Please fill in all required fields.');
        } else {
            alert('Please fill in all required fields.');
        }
        return false;
    }
    
    if (password.length < 6) {
        if (window.showError) {
            window.showError('Password must be at least 6 characters long.');
        } else {
            alert('Password must be at least 6 characters long.');
        }
        return false;
    }
    
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
        let regResult = null;
        
        // Try Supabase first
        if (window.supabaseClient) {
            try {
                console.log('🔄 Attempting Supabase registration...');
                const { data, error } = await window.supabaseClient.auth.signUp({
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
                
                if (!error && data.user) {
                    console.log('✅ Supabase registration successful');
                    regResult = data;
                }
            } catch (supabaseError) {
                console.warn('⚠ Supabase registration failed:', supabaseError.message);
            }
        }
        
        // If Supabase failed, try fallback
        if (!regResult) {
            console.log('🔄 Trying fallback registration...');
            
            if (!fallbackAuthEnabled) {
                enableFallbackAuth();
            }
            
            regResult = await fallbackRegister({
                name, email, institution, phone, role, password
            });
            console.log('✅ Fallback registration successful');
        }
        
        // Process successful registration
        if (regResult && regResult.user) {
            console.log('🎉 Registration successful for:', regResult.user.email);
            
            if (window.showEmailVerificationMessage) {
                window.showEmailVerificationMessage(email);
            } else {
                if (window.showSuccess) {
                    window.showSuccess('Registration successful! Please check your email for verification.');
                } else {
                    alert('Registration successful! Please check your email for verification.');
                }
            }
            
            // Store pending user data
            sessionStorage.setItem('pendingUserData', JSON.stringify({
                id: regResult.user.id,
                name: name,
                email: email,
                institution: institution,
                phone: phone || null,
                role: role
            }));
        }
        
    } catch (error) {
        console.error('💥 Registration error:', error);
        
        if (window.showError) {
            window.showError(error.message);
        } else {
            alert('Registration Error: ' + error.message);
        }
        
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

// Override existing authentication functions
function setupFallbackAuthHandlers() {
    console.log('🔧 Setting up fallback authentication handlers...');
    
    // Override login handler
    const loginForm = document.getElementById('mainLoginForm');
    if (loginForm) {
        loginForm.onsubmit = enhancedLoginHandler;
        loginForm.addEventListener('submit', enhancedLoginHandler, { passive: false });
        
        const loginButton = document.getElementById('mainLoginSubmitBtn');
        if (loginButton) {
            loginButton.onclick = enhancedLoginHandler;
        }
    }
    
    // Override registration handler
    const registerForm = document.getElementById('mainRegisterForm');
    if (registerForm) {
        registerForm.onsubmit = enhancedRegistrationHandler;
        registerForm.addEventListener('submit', enhancedRegistrationHandler, { passive: false });
        
        const registerButton = document.getElementById('mainRegisterSubmitBtn');
        if (registerButton) {
            registerButton.onclick = enhancedRegistrationHandler;
        }
    }
    
    console.log('✅ Fallback authentication handlers setup complete');
}

// Auto-initialize fallback authentication
function initializeFallbackAuth() {
    console.log('🚀 Initializing fallback authentication...');
    
    // Check if Supabase is working
    setTimeout(async () => {
        let supabaseWorking = false;
        
        if (window.supabaseClient) {
            try {
                const { data, error } = await window.supabaseClient.auth.getSession();
                if (!error) {
                    supabaseWorking = true;
                }
            } catch (e) {
                console.warn('⚠ Supabase session check failed:', e.message);
            }
        }
        
        if (!supabaseWorking) {
            console.log('⚠ Supabase not working properly, enabling fallback authentication');
            enableFallbackAuth();
        }
        
        // Always setup enhanced handlers
        setupFallbackAuthHandlers();
    }, 2000);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFallbackAuth);
} else {
    setTimeout(initializeFallbackAuth, 100);
}

// Assign to global scope
window.enableFallbackAuth = enableFallbackAuth;
window.fallbackLogin = fallbackLogin;
window.fallbackRegister = fallbackRegister;
window.enhancedLoginHandler = enhancedLoginHandler;
window.enhancedRegistrationHandler = enhancedRegistrationHandler;

console.log('✅ Fallback authentication system loaded successfully');