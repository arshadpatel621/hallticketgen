// Post-Login Navigation Fix for EduConnect
// This script fixes the "Get Started" button functionality after login

console.log('🔧 Loading post-login navigation fix...');

// Enhanced showMainApp function with comprehensive initialization
function enhancedShowMainApp() {
  console.log('🎯 Enhanced showMainApp called');
  
  // Hide login/registration pages
  const loginPage = document.getElementById('loginPage');
  const registrationPage = document.getElementById('registrationPage');
  const mainApp = document.getElementById('mainApp');
  
  if (loginPage) {
    loginPage.classList.add('hidden');
    loginPage.style.display = 'none';
  }
  
  if (registrationPage) {
    registrationPage.classList.add('hidden'); 
    registrationPage.style.display = 'none';
  }
  
  if (mainApp) {
    mainApp.classList.remove('hidden');
    mainApp.style.display = 'block';
    console.log('✅ Main app is now visible');
  } else {
    console.error('❌ Main app element not found!');
    return false;
  }
  
  // Initialize components that need to be ready after login
  try {
    // 1. Initialize engineering branches
    if (typeof initializeEngineeringBranches === 'function') {
      initializeEngineeringBranches();
      console.log('✅ Engineering branches initialized');
    }
    
    // 2. Initialize navigation components
    if (typeof initializeComponents === 'function') {
      initializeComponents();
      console.log('✅ Components initialized');
    }
    
    // 3. Initialize file uploads
    if (typeof initializeFileUploads === 'function') {
      initializeFileUploads();
      console.log('✅ File uploads initialized');
    }
    
    // 4. Set up navigation event listeners
    setupNavigationListeners();
    
    // 5. Show home section by default
    enhancedShowSection('home');
    
    console.log('🎉 Enhanced main app initialization completed');
    return true;
    
  } catch (error) {
    console.error('❌ Error during main app initialization:', error);
    return false;
  }
}

// Enhanced showSection function with better error handling
function enhancedShowSection(sectionId, skipHistory = false) {
  console.log(`🔄 Enhanced showSection called: ${sectionId}`);
  
  try {
    // Check if the section exists
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
      console.error(`❌ Section '${sectionId}' not found in DOM`);
      return false;
    }
    
    // Update navigation history
    if (!skipHistory) {
      if (typeof currentSection !== 'undefined' && currentSection !== sectionId) {
        if (typeof navigationHistory !== 'undefined') {
          if (navigationHistory[navigationHistory.length - 1] !== sectionId) {
            navigationHistory.push(sectionId);
          }
        } else {
          // Initialize navigation history if it doesn't exist
          window.navigationHistory = ['home', sectionId];
        }
      }
    }
    
    // Set current section
    window.currentSection = sectionId;
    
    // Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
      section.classList.add('hidden');
    });
    
    // Show target section
    targetSection.classList.remove('hidden');
    targetSection.classList.add('animate-fadeIn');
    
    console.log(`✅ Section '${sectionId}' is now visible`);
    
    // Update back button visibility
    if (typeof updateBackButtonVisibility === 'function') {
      updateBackButtonVisibility();
    }
    
    // Special initialization for specific sections
    if (sectionId === 'engineering') {
      console.log('🔧 Initializing engineering section...');
      
      // Make sure engineering branches are loaded
      if (typeof engineeringBranches === 'undefined' || !engineeringBranches.length) {
        initializeEngineeringBranchesData();
      }
      
      // Set up branch popup functionality
      setupBranchPopupFunctionality();
      
      console.log('✅ Engineering section initialized');
      
    } else if (sectionId === 'generator') {
      console.log('🔧 Initializing generator section...');
      
      // Initialize student table if needed
      if (typeof initializeStudentTable === 'function') {
        initializeStudentTable();
      }
      
      console.log('✅ Generator section initialized');
    }
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error showing section '${sectionId}':`, error);
    return false;
  }
}

// Initialize engineering branches data if missing
function initializeEngineeringBranchesData() {
  console.log('🔧 Initializing engineering branches data...');
  
  const defaultBranches = [
    { id: 'cse', name: 'Computer Science Engineering', icon: 'fas fa-laptop-code', students: 1250, color: 'blue' },
    { id: 'aiml', name: 'Artificial Intelligence & Machine Learning', icon: 'fas fa-brain', students: 850, color: 'purple' },
    { id: 'ece', name: 'Electronics & Communication', icon: 'fas fa-microchip', students: 890, color: 'green' },
    { id: 'mech', name: 'Mechanical Engineering', icon: 'fas fa-cog', students: 980, color: 'yellow' },
    { id: 'civil', name: 'Civil Engineering', icon: 'fas fa-building', students: 645, color: 'indigo' },
    { id: 'eee', name: 'Electrical & Electronics', icon: 'fas fa-bolt', students: 756, color: 'red' },
    { id: 'it', name: 'Information Technology', icon: 'fas fa-server', students: 567, color: 'teal' }
  ];
  
  // Check localStorage first
  const savedBranches = localStorage.getItem('engineeringBranches');
  if (savedBranches) {
    try {
      window.engineeringBranches = JSON.parse(savedBranches);
      console.log('✅ Loaded saved engineering branches from localStorage');
    } catch (error) {
      console.warn('⚠️ Error loading saved branches, using defaults');
      window.engineeringBranches = defaultBranches;
    }
  } else {
    window.engineeringBranches = defaultBranches;
    console.log('✅ Using default engineering branches');
  }
}

// Setup branch popup functionality
function setupBranchPopupFunctionality() {
  console.log('🔧 Setting up branch popup functionality...');
  
  // Create openBranchPopup function if it doesn't exist
  if (typeof window.openBranchPopup !== 'function') {
    window.openBranchPopup = function() {
      console.log('🔄 Opening branch popup...');
      
      const popup = document.getElementById('branchPopup');
      if (!popup) {
        console.error('❌ Branch popup not found in DOM');
        showError('Branch selection popup is not available. Please refresh the page.');
        return;
      }
      
      // Show popup
      popup.classList.remove('hidden');
      
      // Setup search functionality
      const searchInput = document.getElementById('branchSearch');
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      
      // Populate branch grid
      populateBranchGridFixed();
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
      
      console.log('✅ Branch popup opened successfully');
    };
  }
  
  // Create closeBranchPopup function if it doesn't exist
  if (typeof window.closeBranchPopup !== 'function') {
    window.closeBranchPopup = function() {
      const popup = document.getElementById('branchPopup');
      if (popup) {
        popup.classList.add('hidden');
        document.body.style.overflow = '';
      }
    };
  }
  
  // Create selectBranchFromPopup function if it doesn't exist
  if (typeof window.selectBranchFromPopup !== 'function') {
    window.selectBranchFromPopup = function(branch) {
      console.log('🎯 Branch selected:', branch.name);
      
      // Set current branch
      window.currentBranch = branch;
      
      // Close popup
      closeBranchPopup();
      
      // Show selected branch display
      showSelectedBranchDisplayFixed(branch);
      
      // Show success message
      showSuccess(`Selected: ${branch.name}`);
    };
  }
}

// Fixed populate branch grid function
function populateBranchGridFixed() {
  console.log('🔧 Populating branch grid...');
  
  const container = document.getElementById('branchGrid');
  if (!container) {
    console.error('❌ Branch grid container not found');
    return;
  }
  
  const branches = window.engineeringBranches || [];
  if (branches.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No branches available</p>';
    return;
  }
  
  container.innerHTML = '';
  
  branches.forEach(branch => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500';
    
    // Handle icon display
    let iconHTML = '';
    if (branch.icon && branch.icon.startsWith && branch.icon.startsWith('file:')) {
      const dataUrl = branch.icon.replace(/^file:/, '');
      iconHTML = `<img src="${dataUrl}" alt="icon" class="w-12 h-12 mx-auto mb-3 rounded" />`;
    } else {
      iconHTML = `<i class="${branch.icon} text-4xl text-${branch.color}-600 mb-3"></i>`;
    }
    
    card.innerHTML = `
      <div class="text-center">
        ${iconHTML}
        <h3 class="font-bold text-gray-800 text-sm mb-2">${branch.name}</h3>
        <p class="text-xs text-gray-500">${branch.students} Students</p>
      </div>
    `;
    
    card.onclick = () => selectBranchFromPopup(branch);
    container.appendChild(card);
  });
  
  console.log(`✅ Branch grid populated with ${branches.length} branches`);
}

// Fixed show selected branch display
function showSelectedBranchDisplayFixed(branch) {
  console.log('🔧 Showing selected branch display...');
  
  const display = document.getElementById('selectedBranchDisplay');
  const icon = document.getElementById('selectedBranchIcon');
  const name = document.getElementById('selectedBranchName');
  const students = document.getElementById('selectedBranchStudents');
  
  if (!display || !icon || !name || !students) {
    console.error('❌ Selected branch display elements not found');
    return;
  }
  
  // Update display elements
  if (branch.icon && branch.icon.startsWith && branch.icon.startsWith('file:')) {
    const dataUrl = branch.icon.replace(/^file:/, '');
    icon.outerHTML = `<img id="selectedBranchIcon" src="${dataUrl}" alt="icon" class="w-8 h-8 rounded" />`;
  } else {
    if (icon.tagName && icon.tagName.toLowerCase() !== 'i') {
      icon.outerHTML = `<i id="selectedBranchIcon" class="${branch.icon} text-2xl text-${branch.color}-600 flex-shrink-0"></i>`;
    } else {
      icon.className = `${branch.icon} text-2xl text-${branch.color}-600`;
    }
  }
  
  name.textContent = branch.name;
  students.textContent = `${branch.students} Students`;
  
  // Show the display
  display.classList.remove('hidden');
  
  console.log('✅ Selected branch display updated');
}

// Setup navigation event listeners
function setupNavigationListeners() {
  console.log('🔧 Setting up navigation event listeners...');
  
  // Find all navigation links and ensure they work
  const navLinks = document.querySelectorAll('a[onclick*="showSection"]');
  navLinks.forEach(link => {
    // Extract section name from onclick
    const onclick = link.getAttribute('onclick');
    if (onclick) {
      const match = onclick.match(/showSection\(['"](\w+)['"]\)/);
      if (match) {
        const sectionName = match[1];
        
        // Replace onclick with enhanced version
        link.removeAttribute('onclick');
        link.addEventListener('click', function(e) {
          e.preventDefault();
          console.log(`🔗 Navigation link clicked: ${sectionName}`);
          enhancedShowSection(sectionName);
        });
      }
    }
  });
  
  // Setup Get Started buttons specifically
  const getStartedButtons = document.querySelectorAll('button[onclick*="showSection"], button[onclick*="engineering"]');
  getStartedButtons.forEach(button => {
    button.removeAttribute('onclick');
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('🚀 Get Started button clicked');
      enhancedShowSection('engineering');
    });
  });
  
  // Setup mobile menu functionality
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn && mobileMenu) {
    window.toggleMobileMenu = function() {
      mobileMenu.classList.toggle('hidden');
    };
    
    window.closeMobileMenu = function() {
      mobileMenu.classList.add('hidden');
    };
  }
  
  console.log('✅ Navigation event listeners setup completed');
}

// Enhanced initialization function
function initializePostLoginFix() {
  console.log('🚀 Initializing post-login fix...');
  
  // Replace original functions with enhanced versions
  window.showMainApp = enhancedShowMainApp;
  window.showSection = enhancedShowSection;
  
  // Initialize data if not already done
  if (typeof window.engineeringBranches === 'undefined') {
    initializeEngineeringBranchesData();
  }
  
  // Setup year selection if missing
  if (typeof window.proceedToYearSelection !== 'function') {
    window.proceedToYearSelection = function() {
      console.log('🎯 Proceeding to year selection...');
      if (window.currentBranch) {
        populateYearCardsFixed();
        enhancedShowSection('yearSelection');
      } else {
        showError('Please select a branch first.');
      }
    };
  }
  
  // Setup year cards population
  if (typeof window.populateYearCards !== 'function') {
    window.populateYearCards = populateYearCardsFixed;
  }
  
  console.log('✅ Post-login fix initialization completed');
}

// Fixed populate year cards function
function populateYearCardsFixed() {
  console.log('🔧 Populating year cards...');
  
  const container = document.getElementById('yearCards');
  if (!container) {
    console.error('❌ Year cards container not found');
    return;
  }
  
  const academicYears = [
    { id: '1', name: '1st Year', semesters: ['1st Semester', '2nd Semester'] },
    { id: '2', name: '2nd Year', semesters: ['3rd Semester', '4th Semester'] },
    { id: '3', name: '3rd Year', semesters: ['5th Semester', '6th Semester'] },
    { id: '4', name: '4th Year', semesters: ['7th Semester', '8th Semester'] }
  ];
  
  container.innerHTML = '';
  
  academicYears.forEach(year => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg p-6 cursor-pointer text-center border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all duration-200';
    
    card.innerHTML = `
      <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-2xl font-bold text-blue-600">${year.id}</span>
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">${year.name}</h3>
      <p class="text-gray-600">${year.semesters.length} Semesters</p>
      <div class="mt-4">
        <i class="fas fa-arrow-right text-blue-600"></i>
      </div>
    `;
    
    card.onclick = () => selectYearFixed(year);
    container.appendChild(card);
  });
  
  console.log(`✅ Year cards populated with ${academicYears.length} years`);
}

// Fixed select year function
function selectYearFixed(year) {
  console.log('🎯 Year selected:', year.name);
  
  window.currentYear = year;
  
  // Update display elements
  const selectedDetails = document.getElementById('selectedDetails');
  const selectedClassDetails = document.getElementById('selectedClassDetails');
  
  if (selectedDetails && window.currentBranch) {
    selectedDetails.textContent = `${window.currentBranch.name} - ${year.name}`;
  }
  
  if (selectedClassDetails && window.currentBranch) {
    selectedClassDetails.textContent = `${window.currentBranch.name} - ${year.name}`;
  }
  
  // Proceed to generator section
  enhancedShowSection('generator');
  
  showSuccess(`Selected: ${year.name}`);
}

// Helper function to show success messages
function showSuccess(message) {
  if (typeof createNotification === 'function') {
    createNotification(message, 'success');
  } else {
    console.log('✅ SUCCESS:', message);
  }
}

// Helper function to show error messages  
function showError(message) {
  if (typeof createNotification === 'function') {
    createNotification(message, 'error');
  } else {
    console.error('❌ ERROR:', message);
    alert(message);
  }
}

// Auto-initialize when the script loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('📋 DOM loaded - checking for post-login fix initialization');
  
  // Wait a moment for other scripts to load
  setTimeout(initializePostLoginFix, 500);
});

// Also initialize when window loads (as backup)
window.addEventListener('load', function() {
  console.log('🌐 Window loaded - ensuring post-login fix is ready');
  
  setTimeout(initializePostLoginFix, 1000);
});

// Export functions for manual testing
window.postLoginFix = {
  initializePostLoginFix,
  enhancedShowMainApp,
  enhancedShowSection,
  setupBranchPopupFunctionality,
  populateBranchGridFixed,
  populateYearCardsFixed
};

console.log('🎉 Post-login navigation fix loaded successfully!');
console.log('💡 Available test functions: window.postLoginFix.*');