// Fixed authentication functions for EduConnect

// Improved login function with better error handling
async function handleMainLogin(event) {
  event.preventDefault();
  
  console.log('🔑 LOGIN ATTEMPT STARTED');
  
  const submitBtn = document.getElementById('mainLoginSubmitBtn');
  const buttonText = document.getElementById('mainLoginButtonText');
  const originalText = buttonText.textContent;
  
  // Show loading state
  submitBtn.disabled = true;
  buttonText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
  
  try {
    // Get form data directly from elements
    const email = document.getElementById('mainLoginEmail').value;
    const password = document.getElementById('mainLoginPassword').value;
    const rememberMe = document.getElementById('mainRememberMe').checked;
    
    console.log('📋 Form data collected:');
    console.log('- Email:', email);
    console.log('- Password length:', password ? password.length : 0);
    console.log('- Remember me:', rememberMe);
    
    // Basic validation
    if (!email || !password) {
      throw new Error('Please fill in all required fields.');
    }
    
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    
    // Check if Supabase client is available
    if (!supabaseClient) {
      console.error('❌ Supabase client not available');
      throw new Error('Authentication service is not available. Please refresh the page and try again.');
    }
    
    console.log('✅ Supabase client is available');
    console.log('🔗 Attempting authentication...');
    
    // Use Supabase authentication
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    console.log('📊 Supabase auth response:');
    console.log('- Data:', data);
    console.log('- Error:', error);
    
    if (error) {
      console.error('🚨 Authentication error:', error.message);
      throw new Error(error.message);
    }
    
    if (data.user) {
      console.log('👤 User authenticated:', data.user.email);
      console.log('📧 Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
      
      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        console.warn('⚠ Email not verified');
        throw new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
      }
      
      // Simple profile creation without database calls for faster login
      const profile = {
        id: data.user.id,
        name: data.user.user_metadata?.name || email.split('@')[0],
        email: data.user.email,
        role: data.user.user_metadata?.role || 'student',
        institution: data.user.user_metadata?.institution || 'Unknown Institution',
        phone: data.user.user_metadata?.phone || null
      };
      
      // Store authentication data
      const userData = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        institution: profile.institution,
        phone: profile.phone
      };
      
      console.log('💾 Storing user data:', userData);
      
      if (rememberMe) {
        localStorage.setItem('authToken', data.session.access_token);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('rememberUser', 'true');
        console.log('💾 Data stored in localStorage');
      } else {
        sessionStorage.setItem('authToken', data.session.access_token);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        console.log('💾 Data stored in sessionStorage');
      }
      
      currentUser = userData;
      isLoggedIn = true;
      
      // Show success message
      console.log('🎉 Login successful!');
      showSuccess('Login successful! Welcome to EduConnect.');
      
      // Delay to show success message
      setTimeout(() => {
        showMainApp();
      }, 1000);
    }
    
  } catch (error) {
    console.error('💥 Login error:', error);
    let errorMessage = error.message;
    
    // Handle common Supabase auth errors
    if (errorMessage.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password. Please check your credentials.';
    } else if (errorMessage.includes('Email not confirmed')) {
      errorMessage = 'Please verify your email address before logging in. Check your inbox for the verification link.';
    } else if (errorMessage.includes('service unavailable')) {
      errorMessage = 'Authentication service is temporarily unavailable. Please try again in a few minutes.';
    }
    
    console.error('🚨 Showing error to user:', errorMessage);
    showError(errorMessage);
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    buttonText.textContent = originalText;
    console.log('🔄 Login form reset to original state');
  }
}

// Simplified registration function
async function handleMainRegister(event) {
  event.preventDefault();
  
  console.log('Registration form submitted');
  
  const submitBtn = document.getElementById('mainRegisterSubmitBtn');
  const buttonText = document.getElementById('mainRegisterButtonText');
  const originalText = buttonText.textContent;
  
  // Show loading state
  submitBtn.disabled = true;
  buttonText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating account...';
  
  try {
    // Get form data from form elements directly
    const name = document.getElementById('mainRegisterName').value;
    const email = document.getElementById('mainRegisterEmail').value;
    const institution = document.getElementById('mainRegisterInstitution').value;
    const phone = document.getElementById('mainRegisterPhone').value;
    const role = document.getElementById('mainRegisterRole').value;
    const password = document.getElementById('mainRegisterPassword').value;
    
    console.log('Form data collected:', { name, email, institution, role });
    
    // Basic validation
    if (!name || !email || !institution || !role || !password) {
      throw new Error('Please fill in all required fields.');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    
    // Check if Supabase client is available
    if (!supabaseClient) {
      throw new Error('Authentication service is not available. Please refresh the page and try again.');
    }
    
    console.log('Attempting to register user with Supabase...');
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: window.location.origin + '?verified=true',
        data: {
          name: name,
          institution: institution,
          role: role
        }
      }
    });
    
    console.log('Supabase auth response:', { authData, authError });
    
    if (authError) {
      console.error('Supabase auth error:', authError);
      throw new Error(authError.message);
    }
    
    if (authData.user) {
      // Always show email verification message
      showEmailVerificationMessage(email);
      
      // Store user data temporarily
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
    console.error('Registration error:', error);
    let errorMessage = error.message;
    
    // Handle common Supabase auth errors
    if (errorMessage.includes('User already registered')) {
      errorMessage = 'An account with this email already exists. Please login instead.';
    } else if (errorMessage.includes('Password should be at least')) {
      errorMessage = 'Password must be at least 6 characters long.';
    } else if (errorMessage.includes('Invalid email')) {
      errorMessage = 'Please enter a valid email address.';
    } else if (errorMessage.includes('service unavailable')) {
      errorMessage = 'Authentication service is temporarily unavailable. Please try again in a few minutes.';
    }
    
    showError(errorMessage);
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    buttonText.textContent = originalText;
  }
}

// Show email verification message
function showEmailVerificationMessage(email) {
  console.log('📧 Showing email verification message for:', email);
  
  // Create a simple verification message
  const verificationDiv = document.createElement('div');
  verificationDiv.id = 'emailVerificationMessage';
  verificationDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  `;
  
  verificationDiv.innerHTML = `
    <div style="max-width: 28rem; width: 90%; background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); padding: 2rem; text-align: center;">
      <div style="width: 4rem; height: 4rem; background: linear-gradient(to right, #10b981, #3b82f6); border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
        <i class="fas fa-envelope" style="color: white; font-size: 1.5rem;"></i>
      </div>
      <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #1f2937;">Check Your Email</h2>
      <p style="color: #6b7280; margin-bottom: 1rem;">We've sent a verification link to:</p>
      <p style="font-weight: 600; color: #3b82f6; background: #eff6ff; padding: 0.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">${email}</p>
      <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem;">Click the link in the email to verify your account. You will be automatically logged in to EduConnect after verification.</p>
      <button id="backToLoginBtn" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500;">
        Back to Login
      </button>
    </div>
  `;
  
  document.body.appendChild(verificationDiv);
  
  // Add event listener to the back button
  document.getElementById('backToLoginBtn').addEventListener('click', function() {
    verificationDiv.remove();
    showMainLogin();
  });
  
  // Hide other pages
  const pagesToHide = ['loginPage', 'registrationPage', 'mainApp'];
  pagesToHide.forEach(pageId => {
    const page = document.getElementById(pageId);
    if (page) {
      page.classList.add('hidden');
    }
  });
}

// Function to show error messages
function showError(message) {
  // Remove any existing error messages
  const existingError = document.getElementById('errorMessage');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error message element
  const errorDiv = document.createElement('div');
  errorDiv.id = 'errorMessage';
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fee2e2;
    color: #991b1b;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 99999;
    max-width: 300px;
  `;
  
  errorDiv.innerHTML = `
    <div style="display: flex; align-items: flex-start;">
      <i class="fas fa-exclamation-circle" style="margin-right: 0.5rem; margin-top: 0.25rem;"></i>
      <div>${message}</div>
      <button id="closeErrorBtn" style="margin-left: 0.5rem; background: none; border: none; color: #991b1b; cursor: pointer;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(errorDiv);
  
  // Add event listener to close button
  document.getElementById('closeErrorBtn').addEventListener('click', function() {
    errorDiv.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

// Function to show success messages
function showSuccess(message) {
  // Remove any existing success messages
  const existingSuccess = document.getElementById('successMessage');
  if (existingSuccess) {
    existingSuccess.remove();
  }
  
  // Create success message element
  const successDiv = document.createElement('div');
  successDiv.id = 'successMessage';
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dcfce7;
    color: #166534;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 99999;
    max-width: 300px;
  `;
  
  successDiv.innerHTML = `
    <div style="display: flex; align-items: flex-start;">
      <i class="fas fa-check-circle" style="margin-right: 0.5rem; margin-top: 0.25rem;"></i>
      <div>${message}</div>
      <button id="closeSuccessBtn" style="margin-left: 0.5rem; background: none; border: none; color: #166534; cursor: pointer;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  // Add event listener to close button
  document.getElementById('closeSuccessBtn').addEventListener('click', function() {
    successDiv.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.remove();
    }
  }, 5000);
}