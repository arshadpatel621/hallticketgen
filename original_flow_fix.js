// Original Flow Fix - Preserves the exact same behavior as before authentication system
// This script ensures "Get Started" button works exactly like before

console.log('🔧 Loading original flow fix...');

// Override the post-login fix to preserve original behavior
function preserveOriginalFlow() {
  console.log('🎯 Preserving original Get Started button behavior...');
  
  // Find all "Get Started" buttons and redirect them to the original simple generator
  const getStartedButtons = document.querySelectorAll('button');
  let buttonsFixed = 0;
  
  getStartedButtons.forEach(button => {
    if (button.textContent.includes('Get Started')) {
      console.log('🔧 Found Get Started button:', button.textContent);
      
      // Remove any existing onclick handlers
      button.removeAttribute('onclick');
      
      // Add new handler that goes directly to the original generator
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🚀 Get Started clicked - going directly to original generator');
        
        // Go directly to the original simple generator (not the complex one)
        showOriginalGenerator();
      });
      
      buttonsFixed++;
    }
  });
  
  // Also fix any navigation links that might be affected
  const engineeringLinks = document.querySelectorAll('a[onclick*="showSection(\'engineering\')"]');
  engineeringLinks.forEach(link => {
    if (link.textContent.includes('Engineering') || link.textContent.includes('View All Branches')) {
      // Keep these as they are - they should go to engineering section
      console.log('✅ Keeping engineering link as is:', link.textContent);
    }
  });
  
  console.log(`✅ Fixed ${buttonsFixed} Get Started buttons to preserve original flow`);
}

// Show the original, simple generator (not the complex branch/year selection flow)
function showOriginalGenerator() {
  console.log('🎯 Showing original generator...');
  
  try {
    // Hide all sections first
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
      section.classList.add('hidden');
    });
    
    // Find the original, simple generator section
    // Look for the section with basic customization (Institution Name, Exam Title, Colors)
    const generatorSections = document.querySelectorAll('section[id="generator"]');
    let originalGenerator = null;
    
    generatorSections.forEach(section => {
      // Check if this section has the simple customization interface
      const institutionInput = section.querySelector('input#institutionName[placeholder="Your Institution Name"]');
      const examTitleInput = section.querySelector('input#examTitle[placeholder="Examination Title"]');
      
      if (institutionInput && examTitleInput) {
        originalGenerator = section;
        console.log('✅ Found original simple generator section');
      }
    });
    
    if (originalGenerator) {
      // Show the original generator
      originalGenerator.classList.remove('hidden');
      
      // Initialize the original customization settings
      initializeOriginalCustomization();
      
      // Update preview if the function exists
      if (typeof updatePreview === 'function') {
        setTimeout(updatePreview, 100);
      }
      
      console.log('🎉 Original generator is now visible');
      
      // Show success message
      if (typeof showSuccess === 'function') {
        showSuccess('Welcome! Ready to create hall tickets with the original interface.');
      }
      
      return true;
    } else {
      console.error('❌ Original generator section not found');
      
      // Fallback: show any generator section
      const anyGenerator = document.getElementById('generator');
      if (anyGenerator) {
        anyGenerator.classList.remove('hidden');
        console.log('⚠️ Showing fallback generator section');
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error showing original generator:', error);
    return false;
  }
}

// Initialize original customization settings with the same defaults as before authentication
function initializeOriginalCustomization() {
  console.log('🔧 Initializing original customization...');
  
  try {
    // Set default values exactly as they were before
    const institutionNameInput = document.querySelector('input#institutionName[placeholder="Your Institution Name"]');
    const examTitleInput = document.querySelector('input#examTitle[placeholder="Examination Title"]');
    const primaryColorInput = document.querySelector('input#primaryColor');
    const secondaryColorInput = document.querySelector('input#secondaryColor');
    
    if (institutionNameInput) {
      institutionNameInput.value = institutionNameInput.value || '';
    }
    
    if (examTitleInput) {
      examTitleInput.value = examTitleInput.value || '';
    }
    
    if (primaryColorInput) {
      primaryColorInput.value = primaryColorInput.value || '#3B82F6';
    }
    
    if (secondaryColorInput) {
      secondaryColorInput.value = secondaryColorInput.value || '#1F2937';
    }
    
    // Ensure the preview gets updated with default values
    if (typeof updatePreview === 'function') {
      setTimeout(updatePreview, 200);
    }
    
    console.log('✅ Original customization initialized');
    
  } catch (error) {
    console.error('❌ Error initializing customization:', error);
  }
}

// Override the enhanced showSection to preserve original behavior for specific cases
function createOriginalShowSection() {
  // Store the original showSection if it exists
  const originalShowSection = window.showSection;
  
  window.showSection = function(sectionId, skipHistory = false) {
    console.log(`🔄 showSection called with: ${sectionId}`);
    
    // If someone calls showSection('generator') directly, show the original generator
    if (sectionId === 'generator') {
      console.log('🎯 Direct generator request - showing original generator');
      return showOriginalGenerator();
    }
    
    // For all other sections, use the original or enhanced function
    if (typeof originalShowSection === 'function') {
      return originalShowSection(sectionId, skipHistory);
    } else {
      // Basic fallback implementation
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        document.querySelectorAll('.section').forEach(section => {
          section.classList.add('hidden');
        });
        targetSection.classList.remove('hidden');
        return true;
      }
      return false;
    }
  };
}

// Ensure all PDF generation functions work with original data structure
function ensurePDFCompatibility() {
  console.log('🔧 Ensuring PDF compatibility with original format...');
  
  // Make sure generateBulkPDF and generateIndividualPDF functions exist and work properly
  if (typeof window.generateBulkPDF !== 'function') {
    window.generateBulkPDF = function() {
      console.log('🚀 generateBulkPDF called - using original format');
      
      // Check if the original PDF generation function exists
      if (typeof generatePDF === 'function') {
        return generatePDF('bulk');
      } else if (typeof generateAllHallTickets === 'function') {
        return generateAllHallTickets();
      } else {
        console.error('❌ PDF generation function not found');
        if (typeof showError === 'function') {
          showError('PDF generation function is not available. Please refresh the page.');
        } else {
          alert('PDF generation function is not available. Please refresh the page.');
        }
      }
    };
  }
  
  if (typeof window.generateIndividualPDF !== 'function') {
    window.generateIndividualPDF = function() {
      console.log('🚀 generateIndividualPDF called - using original format');
      
      // Check if the original PDF generation function exists
      if (typeof generatePDF === 'function') {
        return generatePDF('individual');
      } else if (typeof generateSingleHallTicket === 'function') {
        return generateSingleHallTicket();
      } else {
        console.error('❌ PDF generation function not found');
        if (typeof showError === 'function') {
          showError('PDF generation function is not available. Please refresh the page.');
        } else {
          alert('PDF generation function is not available. Please refresh the page.');
        }
      }
    };
  }
  
  console.log('✅ PDF compatibility ensured');
}

// Override the post-login initialization to preserve original flow
function initializeOriginalFlowFix() {
  console.log('🚀 Initializing original flow fix...');
  
  try {
    // Create the original showSection function
    createOriginalShowSection();
    
    // Preserve original Get Started button behavior
    preserveOriginalFlow();
    
    // Ensure PDF functions work with original format
    ensurePDFCompatibility();
    
    // Set up a MutationObserver to fix any dynamically added buttons
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) { // Element node
                const buttons = node.querySelectorAll ? node.querySelectorAll('button') : [];
                buttons.forEach(button => {
                  if (button.textContent && button.textContent.includes('Get Started')) {
                    preserveOriginalFlow();
                  }
                });
              }
            });
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('✅ Dynamic button observer set up');
    }
    
    console.log('🎉 Original flow fix initialization completed');
    return true;
    
  } catch (error) {
    console.error('❌ Error initializing original flow fix:', error);
    return false;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('📋 DOM loaded - initializing original flow fix');
  
  // Wait for other scripts to load first
  setTimeout(initializeOriginalFlowFix, 800);
});

// Also initialize when window loads (as backup)
window.addEventListener('load', function() {
  console.log('🌐 Window loaded - ensuring original flow fix is active');
  
  setTimeout(initializeOriginalFlowFix, 1200);
});

// Make functions available for manual testing
window.originalFlowFix = {
  initializeOriginalFlowFix,
  showOriginalGenerator,
  preserveOriginalFlow,
  ensurePDFCompatibility
};

console.log('🎉 Original flow fix loaded successfully!');
console.log('💡 The "Get Started" button will now work exactly like before authentication system');
console.log('🔧 Available functions: window.originalFlowFix.*');