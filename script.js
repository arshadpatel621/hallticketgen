// Hall Ticket Generator - Main JavaScript

// Application state variables (must be declared before functions that use them)
let currentStudentType = ''; // 'engineering', 'general', or 'school'
let currentBranch = '';
let currentCourse = ''; // For general students
let customCourseData = null; // For customized course details
let currentSchoolLevel = ''; // For school students
let currentClass = ''; // For school students
let currentYear = '';
let studentData = [];
let classInformation = {};

// Navigation history for back button functionality
let navigationHistory = ['home'];
let currentSection = 'home';

// Student photos storage (key: USN, value: photo data URL)
let studentPhotos = {};

// Hall ticket customization settings
let ticketCustomization = {
  institutionName: 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI',
  examTitle: 'ADMISSION TICKET FOR B.E EXAMINATION JUNE / JULY 2025',
  primaryColor: '#3B82F6',
  secondaryColor: '#1F2937',
  fontSize: 'medium',
  fontFamily: 'helvetica',
  borderStyle: 'solid',
  borderWidth: '2',
  headerText: '',
  footerText: 'This is a computer-generated hall ticket and does not require signature',
  showPhoto: true,
  showSignatureArea: true,
  layoutStyle: 'standard',
  paperSize: 'a4'
};

// Default engineering branches data
const defaultEngineeringBranches = [
  { id: 'cse', name: 'Computer Science Engineering', icon: 'fas fa-laptop-code', students: 1250, color: 'blue' },
  { id: 'aiml', name: 'Artificial Intelligence & Machine Learning', icon: 'fas fa-brain', students: 850, color: 'purple' },
  { id: 'ece', name: 'Electronics & Communication', icon: 'fas fa-microchip', students: 890, color: 'green' },
  { id: 'mech', name: 'Mechanical Engineering', icon: 'fas fa-cog', students: 980, color: 'yellow' },
  { id: 'civil', name: 'Civil Engineering', icon: 'fas fa-building', students: 645, color: 'indigo' },
  { id: 'eee', name: 'Electrical & Electronics', icon: 'fas fa-bolt', students: 756, color: 'red' },
  { id: 'chem', name: 'Chemical Engineering', icon: 'fas fa-flask', students: 432, color: 'pink' },
  { id: 'aero', name: 'Aeronautical Engineering', icon: 'fas fa-plane', students: 298, color: 'cyan' },
  { id: 'auto', name: 'Automobile Engineering', icon: 'fas fa-car', students: 345, color: 'gray' },
  { id: 'it', name: 'Information Technology', icon: 'fas fa-server', students: 567, color: 'teal' },
  { id: 'ise', name: 'Information Science Engineering', icon: 'fas fa-database', students: 720, color: 'orange' },
  { id: 'biotech', name: 'Biotechnology Engineering', icon: 'fas fa-dna', students: 380, color: 'emerald' },
  { id: 'textile', name: 'Textile Engineering', icon: 'fas fa-tshirt', students: 250, color: 'rose' },
  { id: 'mining', name: 'Mining Engineering', icon: 'fas fa-mountain', students: 180, color: 'amber' },
  { id: 'industrial', name: 'Industrial Engineering', icon: 'fas fa-industry', students: 290, color: 'lime' }
];

// Dynamic engineering branches data (loaded from localStorage or defaults)
let engineeringBranches = [];

// Years data
const academicYears = [
  { id: '1', name: '1st Year', semesters: ['1st Semester', '2nd Semester'] },
  { id: '2', name: '2nd Year', semesters: ['3rd Semester', '4th Semester'] },
  { id: '3', name: '3rd Year', semesters: ['5th Semester', '6th Semester'] },
  { id: '4', name: '4th Year', semesters: ['7th Semester', '8th Semester'] }
];

// Variable to track delete mode state
let isDeleteMode = false;

// Essential functions that must be available immediately for HTML onclick handlers

// Global function to show sections
function showSection(sectionId, skipHistory = false) {
  console.log('Showing section:', sectionId);
  
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden');
  });
  
  // Show the requested section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    targetSection.classList.add('animate-fadeIn');
  }
  
  // Update navigation history
  if (!skipHistory) {
    if (currentSection !== sectionId) {
      if (navigationHistory[navigationHistory.length - 1] !== sectionId) {
        navigationHistory.push(sectionId);
      }
    }
  }
  
  currentSection = sectionId;
  
  // Update back button visibility
  updateBackButtonVisibility();
  
  // Special handling for specific sections
  if (sectionId === 'engineering') {
    populateEngineeringCards();
  } else if (sectionId === 'generator') {
    initializeHallTicketPreview();
  }
}

// Global function to select student type
function selectStudentType(type) {
  console.log('Selected student type:', type);
  currentStudentType = type;
  
  if (type === 'engineering') {
    showSection('engineering');
  } else if (type === 'general') {
    showSection('general');
  } else if (type === 'school') {
    setupSchoolStudentForm();
    showSection('classCustomization');
  }
}

// Global function to toggle mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBtn = document.getElementById('mobileMenuBtn');
  
  if (mobileMenu && menuBtn) {
    const icon = menuBtn.querySelector('i');
    
    if (mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('show');
      if (icon) icon.className = 'fas fa-times text-xl';
      document.body.style.overflow = 'hidden';
    } else {
      closeMobileMenu();
    }
  }
}

// Global function to close mobile menu
function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBtn = document.getElementById('mobileMenuBtn');
  
  if (mobileMenu && menuBtn) {
    const icon = menuBtn.querySelector('i');
    
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('show');
    if (icon) icon.className = 'fas fa-bars text-xl';
    document.body.style.overflow = '';
  }
}

// Global function to open learn more modal
function openLearnMore() {
  const modal = document.getElementById('learnMoreModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

// Global function to close learn more modal
function closeLearnMore() {
  const modal = document.getElementById('learnMoreModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// Make functions available globally
window.showSection = showSection;
window.selectStudentType = selectStudentType;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.openLearnMore = openLearnMore;
window.closeLearnMore = closeLearnMore;
window.openBranchPopup = openBranchPopup;
window.closeBranchPopup = closeBranchPopup;
window.selectBranchFromPopup = selectBranchFromPopup;
window.proceedToYearSelection = proceedToYearSelection;

// Helper functions that the main functions depend on
function updateBackButtonVisibility() {
  const backButton = document.getElementById('backButton');
  if (backButton) {
    if (currentSection === 'home' || navigationHistory.length <= 1) {
      backButton.classList.add('hidden');
    } else {
      backButton.classList.remove('hidden');
    }
  }
}

function populateEngineeringCards() {
  // This function will be called when engineering section is shown
  // The full implementation exists later in the file
  if (typeof openBranchPopup === 'function') {
    openBranchPopup();
  }
}

function initializeHallTicketPreview() {
  // Initialize hall ticket preview when generator section is shown
  if (typeof updatePreview === 'function') {
    updatePreview();
  }
}

function setupSchoolStudentForm() {
  // Setup school student form - implementation exists later in file
  console.log('Setting up school student form');
}

// Add back navigation function
function goBack() {
  if (navigationHistory.length > 1) {
    navigationHistory.pop();
    const previousSection = navigationHistory[navigationHistory.length - 1];
    showSection(previousSection, true);
  } else {
    showSection('home', true);
    navigationHistory = ['home'];
  }
}

// Make the goBack function global too
window.goBack = goBack;

// Define openBranchPopup function globally early for HTML onclick handlers
function openBranchPopup() {
  const popup = document.getElementById('branchPopup');
  const searchInput = document.getElementById('branchSearch');
  
  if (!popup || !searchInput) {
    console.error('Branch popup elements not found');
    return;
  }
  
  // Show popup
  popup.classList.remove('hidden');
  
  // Clear search and focus
  searchInput.value = '';
  searchInput.focus();
  
  // Populate branch grid if available
  if (typeof populateBranchGrid === 'function') {
    populateBranchGrid();
  }
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Add escape key listener
  if (typeof handlePopupEscape === 'function') {
    document.addEventListener('keydown', handlePopupEscape);
  }
}

// Define closeBranchPopup function globally early for HTML onclick handlers
function closeBranchPopup() {
  const popup = document.getElementById('branchPopup');
  
  if (!popup) {
    console.error('Branch popup element not found');
    return;
  }
  
  // Hide popup
  popup.classList.add('hidden');
  
  // Restore body scrolling
  document.body.style.overflow = '';
  
  // Remove escape key listener
  if (typeof handlePopupEscape === 'function') {
    document.removeEventListener('keydown', handlePopupEscape);
  }
}

// Define proceedToYearSelection function globally early
function proceedToYearSelection() {
  if (currentBranch) {
    if (typeof populateYearCards === 'function') {
      populateYearCards();
    }
    showSection('yearSelection');
  } else {
    console.warn('No branch selected for proceeding to year selection');
  }
}

// Define selectBranchFromPopup function globally early
function selectBranchFromPopup(branch) {
  if (typeof selectBranch === 'function') {
    selectBranch(branch);
  }
  closeBranchPopup();
  
  // Show selected branch display
  if (typeof showSelectedBranchDisplay === 'function') {
    showSelectedBranchDisplay(branch);
  }
}


// Handle escape key for popup
function handlePopupEscape(event) {
  if (event.key === 'Escape') {
    closeBranchPopup();
  }
}

// Populate branch grid in popup
function populateBranchGrid(filteredBranches = null) {
  const container = document.getElementById('branchGrid');
  const branches = filteredBranches || engineeringBranches;
  
  container.innerHTML = '';
  
  branches.forEach(branch => {
    const card = document.createElement('div');
    
    // Set different styles and behavior based on delete mode
    if (isDeleteMode) {
      card.className = `bg-red-50 rounded-xl p-4 cursor-pointer hover:bg-red-100 hover:border-red-200 border-2 border-red-200 transition-all duration-200 card-hover relative`;
      card.onclick = () => openDeleteBranchModal(branch.id, branch.name);
    } else {
      card.className = `bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all duration-200 card-hover relative`;
      card.onclick = () => selectBranchFromPopup(branch);
    }
    
    // Determine icon HTML (fontawesome class or uploaded file data URL)
    let iconHtml = '';
    if (branch.icon && branch.icon.startsWith && branch.icon.startsWith('file:')) {
      const dataUrl = branch.icon.replace(/^file:/, '');
      iconHtml = `<img src="${dataUrl}" alt="icon" class="w-6 h-6" />`;
    } else {
      iconHtml = `<i class="${branch.icon} text-xl text-${branch.color}-600"></i>`;
    }

    card.innerHTML = `
      <div class="flex items-center space-x-3 mb-3">
        <div class="bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-center" style="width:40px;height:40px;">
          ${iconHtml}
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-gray-800 text-sm leading-tight">${branch.name}</h4>
          <p class="text-xs text-gray-600 mt-1">${branch.students} Students</p>
        </div>
        ${isDeleteMode ? 
          `<div class="p-2 rounded-lg text-red-600 bg-red-100" title="Click to Delete">
            <i class="fas fa-trash-alt text-lg"></i>
          </div>` :
          ''
        }
      </div>
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>Active Programs: 2</span>
        ${isDeleteMode ? 
          '<i class="fas fa-trash text-red-500 opacity-75"></i>' :
          '<i class="fas fa-arrow-right opacity-50"></i>'
        }
      </div>
    `;
    
    // No individual delete buttons on hover - only use delete mode
    
    container.appendChild(card);
  });
}

// Filter branches based on search
function filterBranches() {
  const searchTerm = document.getElementById('branchSearch').value.toLowerCase();
  const noResults = document.getElementById('noResults');
  
  if (!searchTerm.trim()) {
    // Show all branches
    populateBranchGrid();
    noResults.classList.add('hidden');
    return;
  }
  
  const filteredBranches = engineeringBranches.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm) ||
    branch.id.toLowerCase().includes(searchTerm)
  );
  
  if (filteredBranches.length === 0) {
    // Show no results message
    document.getElementById('branchGrid').innerHTML = '';
    noResults.classList.remove('hidden');
  } else {
    // Show filtered results
    noResults.classList.add('hidden');
    populateBranchGrid(filteredBranches);
  }
}

// Select branch from popup
function selectBranchFromPopup(branch) {
  selectBranch(branch);
  closeBranchPopup();
  
  // Show selected branch display
  showSelectedBranchDisplay(branch);
}

// Show selected branch in the engineering section
function showSelectedBranchDisplay(branch) {
  const display = document.getElementById('selectedBranchDisplay');
  const icon = document.getElementById('selectedBranchIcon');
  const name = document.getElementById('selectedBranchName');
  const students = document.getElementById('selectedBranchStudents');
  
  // Update display elements
  // If branch.icon is an uploaded file (data URL prefixed with 'file:'), render an <img>
  if (branch.icon && branch.icon.startsWith && branch.icon.startsWith('file:')) {
    const dataUrl = branch.icon.replace(/^file:/, '');
    icon.outerHTML = `<img id="selectedBranchIcon" src="${dataUrl}" alt="icon" class="w-8 h-8 rounded" />`;
  } else {
    // Ensure we have an <i> element for font icons; replace if necessary
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
}

// Proceed to year selection from selected branch display
function proceedToYearSelection() {
  if (currentBranch) {
    populateYearCards();
    showSection('yearSelection');
  }
}

// Close popup when clicking outside
function closePopupOnOutsideClick(event) {
  const popup = document.getElementById('branchPopup');
  const popupContent = popup.querySelector('.bg-white');
  
  if (event.target === popup && !popupContent.contains(event.target)) {
    closeBranchPopup();
  }
}

// Populate engineering cards - open branch selection popup
function populateEngineeringCards() {
  // Ensure branches are loaded
  if (engineeringBranches.length === 0) {
    loadBranchesFromStorage();
  }
  
  // Automatically open the branch selection popup when entering engineering section
  openBranchPopup();
}

// Select branch
function selectBranch(branch) {
  currentBranch = branch;
  document.getElementById('selectedBranch').textContent = branch.name;
  populateYearCards();
  showSection('yearSelection');
}

// Populate year cards
function populateYearCards() {
  const container = document.getElementById('yearCards');
  container.innerHTML = '';
  
  academicYears.forEach(year => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg p-6 card-hover cursor-pointer text-center border-2 border-transparent hover:border-blue-500';
    card.onclick = () => selectYear(year);
    
    card.innerHTML = `
      <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-2xl font-bold text-blue-600">${year.id}</span>
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">${year.name}</h3>
      <p class="text-gray-600">2 Semesters</p>
      <div class="mt-4">
        <i class="fas fa-arrow-right text-blue-600"></i>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Select year
function selectYear(year) {
  currentYear = year;
  document.getElementById('selectedDetails').textContent = `${currentBranch.name} - ${year.name}`;
  document.getElementById('selectedClassDetails').textContent = `${currentBranch.name} - ${year.name}`;
  // Go directly to hall ticket customization after year selection
  showSection('generator');
}

// Initialize student table
function initializeStudentTable() {
  const tbody = document.getElementById('studentTableBody');
  tbody.innerHTML = '';
  
  // Set up table headers based on student type
  if (currentStudentType === 'school') {
    setupSchoolStudentTableHeaders();
  }

  // Ensure the table shows a minimum of 10 empty rows for easier data entry
  const minimumRows = 10;
  for (let i = 0; i < minimumRows; i++) {
    addRow();
  }

  // Attach Enter-key navigation once: pressing Enter moves focus to the next text input
  const table = document.getElementById('studentTable');
  if (table && !table.dataset.enterNavAttached) {
    table.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const target = e.target;
      if (!target || target.tagName !== 'INPUT' || target.type !== 'text') return;
      e.preventDefault();

      // Find all visible text inputs in DOM order
      const inputs = Array.from(table.querySelectorAll('input[type="text"]'));
      const idx = inputs.indexOf(target);
      if (idx >= 0 && idx < inputs.length - 1) {
        const next = inputs[idx + 1];
        next.focus();
        if (typeof next.select === 'function') next.select();
      } else {
        // At last input - add a new row and focus its first text input
        addRow();
        const lastRow = table.querySelector('tbody').lastElementChild;
        if (lastRow) {
          const firstInput = lastRow.querySelector('input[type="text"]');
          if (firstInput) {
            firstInput.focus();
            if (typeof firstInput.select === 'function') firstInput.select();
          }
        }
      }
    });
    table.dataset.enterNavAttached = '1';
  }
}

// Add table row with data
function addRowWithData(studentInfo) {
  const tbody = document.getElementById('studentTableBody');
  const table = document.getElementById('studentTable');
  const headerRow = table.querySelector('thead tr');
  const rowCount = tbody.children.length;
  
  // Get current number of subject pairs from headers
  const currentHeaders = headerRow.querySelectorAll('th');
  const fixedColumns = currentStudentType === 'school' ? 6 : 5; // School: S.No, Roll Number, Name, Father Name, Admission No, Photo | Others: S.No, USN, Name, Admission No, Photo
  const currentSubjectPairs = (currentHeaders.length - fixedColumns) / 2;
  
  // Build row HTML dynamically based on student type
  let rowHTML;
  if (currentStudentType === 'school') {
    rowHTML = `
      <td class="excel-cell">${rowCount + 1}</td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" value="${studentInfo.rollNumber || studentInfo.usn || ''}"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" value="${studentInfo.name || ''}"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" value="${studentInfo.fatherName || ''}" placeholder="Father Name"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" value="${studentInfo.admissionNo || ''}" placeholder="Admission No"></td>
      <td class="excel-cell photo-cell">
        <div class="flex items-center justify-center">
          <input type="file" accept="image/*" class="hidden photo-upload" id="photo-${rowCount + 1}" onchange="handleRowPhotoUpload(this, '${studentInfo.rollNumber || studentInfo.usn || ''}')">
          <button onclick="document.getElementById('photo-${rowCount + 1}').click()" class="btn btn-sm ${studentPhotos[studentInfo.rollNumber || studentInfo.usn || ''] ? 'btn-success' : 'btn-secondary'} px-2 py-1 text-xs">
            <i class="fas ${studentPhotos[studentInfo.rollNumber || studentInfo.usn || ''] ? 'fa-check' : 'fa-camera'}"></i>
          </button>
        </div>
      </td>
    `;
  } else {
    rowHTML = `
      <td class="excel-cell">${rowCount + 1}</td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" value="${studentInfo.usn || ''}"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" value="${studentInfo.name || ''}"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" value="${studentInfo.admissionNo || ''}" placeholder="Admission No"></td>
      <td class="excel-cell photo-cell">
        <div class="flex items-center justify-center">
          <input type="file" accept="image/*" class="hidden photo-upload" id="photo-${rowCount + 1}" onchange="handleRowPhotoUpload(this, '${studentInfo.usn || ''}')">
          <button onclick="document.getElementById('photo-${rowCount + 1}').click()" class="btn btn-sm ${studentPhotos[studentInfo.usn || ''] ? 'btn-success' : 'btn-secondary'} px-2 py-1 text-xs">
            <i class="fas ${studentPhotos[studentInfo.usn || ''] ? 'fa-check' : 'fa-camera'}"></i>
          </button>
        </div>
      </td>
    `;
  }
  
  // Add subject columns dynamically based on current table structure
  for (let i = 0; i < currentSubjectPairs; i++) {
    const subject = studentInfo.subjects[i] || { name: '', code: '' };
    rowHTML += `
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" value="${subject.name}" placeholder="Subject ${i + 1}"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" value="${subject.code}" placeholder="Code ${i + 1}"></td>
    `;
  }
  
  const row = document.createElement('tr');
  row.innerHTML = rowHTML;
  
  tbody.appendChild(row);
}

// Add table row
function addRow() {
  const tbody = document.getElementById('studentTableBody');
  const table = document.getElementById('studentTable');
  const headerRow = table.querySelector('thead tr');
  const rowCount = tbody.children.length;
  
  // Get current number of subject pairs from headers
  const currentHeaders = headerRow.querySelectorAll('th');
  const fixedColumns = currentStudentType === 'school' ? 6 : 5; // School: S.No, Roll Number, Name, Father Name, Admission No, Photo | Others: S.No, USN, Name, Admission No, Photo
  const currentSubjectPairs = (currentHeaders.length - fixedColumns) / 2;
  
  // Build row HTML dynamically based on student type
  let rowHTML;
  if (currentStudentType === 'school') {
    rowHTML = `
      <td class="excel-cell">${rowCount + 1}</td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" placeholder="Roll Number"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" placeholder="Student Name"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" placeholder="Father Name"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" placeholder="Admission No"></td>
      <td class="excel-cell photo-cell">
        <div class="flex items-center justify-center">
          <input type="file" accept="image/*" class="hidden photo-upload" id="photo-${rowCount + 1}" onchange="handleRowPhotoUpload(this, '')">
          <button onclick="document.getElementById('photo-${rowCount + 1}').click()" class="btn btn-sm btn-secondary px-2 py-1 text-xs">
            <i class="fas fa-camera"></i>
          </button>
        </div>
      </td>
    `;
  } else {
    rowHTML = `
      <td class="excel-cell">${rowCount + 1}</td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" placeholder="USN"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" placeholder="Student Name"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" placeholder="Admission No"></td>
      <td class="excel-cell photo-cell">
        <div class="flex items-center justify-center">
          <input type="file" accept="image/*" class="hidden photo-upload" id="photo-${rowCount + 1}" onchange="handleRowPhotoUpload(this, '')">
          <button onclick="document.getElementById('photo-${rowCount + 1}').click()" class="btn btn-sm btn-secondary px-2 py-1 text-xs">
            <i class="fas fa-camera"></i>
          </button>
        </div>
      </td>
    `;
  }
  
  // Add subject columns dynamically based on current table structure
  for (let i = 0; i < currentSubjectPairs; i++) {
    rowHTML += `
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" placeholder="Subject ${i + 1}"></td>
      <td class="excel-cell"><input type="text" class="w-full p-1 border-none outline-none" placeholder="Code ${i + 1}"></td>
    `;
  }
  
  const row = document.createElement('tr');
  row.innerHTML = rowHTML;
  
  tbody.appendChild(row);
}

// Remove table row
function removeRow() {
  const tbody = document.getElementById('studentTableBody');
  if (tbody.children.length > 1) {
    tbody.removeChild(tbody.lastElementChild);
    // Update row numbers
    Array.from(tbody.children).forEach((row, index) => {
      row.firstElementChild.textContent = index + 1;
    });
  }
}

// Add column (subject pair)
function addColumn() {
  const table = document.getElementById('studentTable');
  const headerRow = table.querySelector('thead tr');
  const tbody = table.querySelector('tbody');
  
  // Get current number of subject pairs
  const currentHeaders = headerRow.querySelectorAll('th');
  const fixedColumns = currentStudentType === 'school' ? 6 : 5; // School: S.No, Roll Number, Name, Father Name, Admission No, Photo | Others: S.No, USN, Name, Admission No, Photo
  const subjectPairs = (currentHeaders.length - fixedColumns) / 2;
  const newSubjectNumber = subjectPairs + 1;
  
  // Add headers
  const subjectHeader = document.createElement('th');
  subjectHeader.className = 'excel-cell';
  subjectHeader.textContent = `Subject ${newSubjectNumber}`;
  
  const codeHeader = document.createElement('th');
  codeHeader.className = 'excel-cell';
  codeHeader.textContent = `Code ${newSubjectNumber}`;
  
  headerRow.appendChild(subjectHeader);
  headerRow.appendChild(codeHeader);
  
  // Add cells to existing rows
  Array.from(tbody.children).forEach(row => {
    const subjectCell = document.createElement('td');
    subjectCell.className = 'excel-cell';
    subjectCell.innerHTML = `<input type="text" class="w-full p-1 border-none outline-none" placeholder="Subject ${newSubjectNumber}">`;
    
    const codeCell = document.createElement('td');
    codeCell.className = 'excel-cell';
    codeCell.innerHTML = `<input type="text" class="w-full p-1 border-none outline-none" placeholder="Code ${newSubjectNumber}">`;
    
    row.appendChild(subjectCell);
    row.appendChild(codeCell);
  });
  
  showSuccess(`Added Subject ${newSubjectNumber} column`);
}

// Remove column (subject pair)
function removeColumn() {
  const table = document.getElementById('studentTable');
  const headerRow = table.querySelector('thead tr');
  const tbody = table.querySelector('tbody');
  
  // Get current number of subject pairs
  const currentHeaders = headerRow.querySelectorAll('th');
  const fixedColumns = currentStudentType === 'school' ? 6 : 5; // School: S.No, Roll Number, Name, Father Name, Admission No, Photo | Others: S.No, USN, Name, Admission No, Photo
  const subjectPairs = (currentHeaders.length - fixedColumns) / 2;
  
  if (subjectPairs <= 1) {
    showError('Cannot remove column. At least one subject column must remain.');
    return;
  }
  
  // Remove last two headers (subject name and code)
  headerRow.removeChild(headerRow.lastElementChild); // Remove code header
  headerRow.removeChild(headerRow.lastElementChild); // Remove subject header
  
  // Remove last two cells from each row
  Array.from(tbody.children).forEach(row => {
    row.removeChild(row.lastElementChild); // Remove code cell
    row.removeChild(row.lastElementChild); // Remove subject cell
  });
  
  showSuccess(`Removed Subject ${subjectPairs} column`);
}

// Navigate from customization to class information
function proceedToClassInfo() {
  // Initialize class information based on current branch and year
  initializeClassInformation();
  showSection('classCustomization');
}

// Proceed to generation (simple generation page)
function proceedToGeneration() {
  collectStudentData();
  initializeGenerationPage();
  showSection('finalGeneration');
}

// Initialize simple generation page
function initializeGenerationPage() {
  updateStudentSelect();
  updatePhotoStudentSelect();
  updateFinalGenerationPage();
  // Populate the second student selector used for 2-per-page generation
  updateSecondStudentSelect();
}

// Update final generation page with student data
function updateFinalGenerationPage() {
  // Update individual student select
  const individualSelect = document.getElementById('individualStudentSelect');
  if (individualSelect) {
    individualSelect.innerHTML = '<option value="">Choose a student...</option>';
    
    studentData.forEach((student, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${student.usn} - ${student.name}`;
      individualSelect.appendChild(option);
    });
  }
  
  // Update total students count
  const totalStudentsCount = document.getElementById('totalStudentsCount');
  if (totalStudentsCount) {
    totalStudentsCount.textContent = studentData.length;
  }
  
  // Update details display
  const finalGenerationDetails = document.getElementById('finalGenerationDetails');
  if (finalGenerationDetails && currentBranch && currentYear) {
    finalGenerationDetails.textContent = `${currentBranch.name} - ${currentYear.name} (${studentData.length} students)`;
  }
  
  // Update preview in final generation section
  updateFinalHallTicketPreview();
}

// Populate second student select (used for two-per-page individual generation)
function updateSecondStudentSelect() {
  const select = document.getElementById('secondStudentSelect');
  if (!select) return;
  select.innerHTML = '<option value="">Choose a student...</option>';

  studentData.forEach((student, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${student.usn} - ${student.name}`;
    select.appendChild(option);
  });
}

// Generate PDF with two different students on one page (individual pair)
function generateTwoPerPageIndividual() {
  const s1 = document.getElementById('individualStudentSelect').value;
  const s2 = document.getElementById('secondStudentSelect').value;

  if (s1 === '' || s2 === '') {
    alert('Please select both students for 2-per-page generation.');
    return;
  }

  const idx1 = parseInt(s1, 10);
  const idx2 = parseInt(s2, 10);

  if (isNaN(idx1) || isNaN(idx2) || !studentData[idx1] || !studentData[idx2]) {
    alert('Selected students not found.');
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Place student idx1 on top half and idx2 on bottom half
    addVTUHallTicketToPDF(pdf, studentData[idx1], 0, document.getElementById('institutionName').value, document.getElementById('examTitle').value, 0);
    addVTUHallTicketToPDF(pdf, studentData[idx2], 0, document.getElementById('institutionName').value, document.getElementById('examTitle').value, 1);

    const filename = `two_per_page_${studentData[idx1].usn}_${studentData[idx2].usn}.pdf`;
    pdf.save(filename);
    alert(`Generated 2-per-page PDF for ${studentData[idx1].name} and ${studentData[idx2].name}`);
  } catch (error) {
    console.error('Two-per-page individual generation error:', error);
    alert('Error generating 2-per-page PDF: ' + error.message);
  }
}

// Generate PDF with two different students per page for all students in bulk
function generateTwoPerPageBulk() {
  if (studentData.length === 0) {
    alert('No student data available! Please add students first.');
    return;
  }

  const confirmed = confirm(`Generate hall tickets with two different students per A4 page for ${studentData.length} students?\n\nThis will pair students sequentially (1+2, 3+4, ...).`);
  if (!confirmed) return;

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    for (let i = 0; i < studentData.length; i += 2) {
      const s1 = studentData[i];
      const s2 = studentData[i + 1] || null;

      // For each pair, render both copies on the same page
      // If not the first page, add a new page
      if (i > 0) pdf.addPage();

      addVTUHallTicketToPDF(pdf, s1, 0, document.getElementById('institutionName').value, document.getElementById('examTitle').value, 0);

      if (s2) {
        addVTUHallTicketToPDF(pdf, s2, 0, document.getElementById('institutionName').value, document.getElementById('examTitle').value, 1);
      } else {
        // If odd number of students, leave bottom half blank or duplicate last student's office copy
        // We will leave it blank for manual filling
      }
    }

    const date = new Date().toISOString().split('T')[0];
    const filename = `two_per_page_bulk_${date}.pdf`;
    pdf.save(filename);
    alert(`Successfully generated 2-per-page bulk PDF (${filename})`);
  } catch (error) {
    console.error('Two-per-page bulk generation error:', error);
    alert('Error generating 2-per-page bulk PDF: ' + error.message);
  }
}

// Update final hall ticket preview
function updateFinalHallTicketPreview() {
  const preview = document.getElementById('finalHallTicketPreview');
  if (!preview) return;
  
  // Use the same preview content as the main generator
  const mainPreview = document.getElementById('hallTicketPreview');
  if (mainPreview && mainPreview.innerHTML) {
    preview.innerHTML = mainPreview.innerHTML;
  } else {
    // Generate preview if main preview is not available
    updatePreview();
    setTimeout(() => {
      const mainPreview = document.getElementById('hallTicketPreview');
      if (mainPreview && mainPreview.innerHTML) {
        preview.innerHTML = mainPreview.innerHTML;
      }
    }, 100);
  }
}

// Collect student data from table
function collectStudentData() {
  const tbody = document.getElementById('studentTableBody');
  studentData = [];
  
  Array.from(tbody.children).forEach((row, rowIndex) => {
    // Get only text inputs, excluding file inputs from photo cells
    const textInputs = row.querySelectorAll('input[type="text"]');
    
    if (textInputs.length < 3) {
      console.warn(`Row ${rowIndex + 1}: Not enough text inputs found (${textInputs.length})`);
      return;
    }
    
    let student, subjectStartIndex;
    
    if (currentStudentType === 'school') {
      student = {
        rollNumber: textInputs[0].value.trim(),
        usn: textInputs[0].value.trim(), // Keep USN for compatibility but use rollNumber
        name: textInputs[1].value.trim(),
        fatherName: textInputs[2].value.trim(),
        admissionNo: textInputs[3].value.trim(),
        subjects: []
      };
      subjectStartIndex = 4; // Subjects start from index 4 for school students
    } else {
      student = {
        usn: textInputs[0].value.trim(),
        name: textInputs[1].value.trim(),
        admissionNo: textInputs[2].value.trim(),
        subjects: []
      };
      subjectStartIndex = 3; // Subjects start from index 3 for engineering/general students
    }
    
    // Dynamic subject collection - starts from appropriate index based on student type
    for (let i = subjectStartIndex; i < textInputs.length; i += 2) {
      if (i + 1 < textInputs.length) {
        const subjectName = textInputs[i].value.trim();
        const subjectCode = textInputs[i + 1].value.trim();
        
        if (subjectName && subjectCode) {
          const subjectIndex = Math.floor((i - subjectStartIndex) / 2);
          
          // Get additional subject details from bulk subjects data if available
          let subjectDetails = {
            name: subjectName,
            code: subjectCode
          };
          
          // If we have bulk subjects data, merge the timing information
          if (bulkSubjectsData && bulkSubjectsData[subjectIndex]) {
            const bulkSubject = bulkSubjectsData[subjectIndex];
            subjectDetails = {
              name: subjectName,
              code: subjectCode,
              date: bulkSubject.date || '',
              startTime: bulkSubject.startTime || '',
              endTime: bulkSubject.endTime || '',
              duration: bulkSubject.duration || ''
            };
          }
          
          student.subjects.push(subjectDetails);
        }
      }
    }
    
    // Debug logging
    const identifier = currentStudentType === 'school' ? student.rollNumber : student.usn;
    console.log(`Processing student ${rowIndex + 1}: ${currentStudentType === 'school' ? 'Roll Number' : 'USN'}=${identifier}, Name=${student.name}, Subjects=${student.subjects.length}`);
    
    if (identifier && student.name) {
      studentData.push(student);
    } else {
      console.warn(`Skipping student ${rowIndex + 1}: Missing ${currentStudentType === 'school' ? 'Roll Number' : 'USN'} or Name`);
    }
  });
  
  console.log(`Total students collected: ${studentData.length}`);
}

// Initialize hall ticket preview
function initializeHallTicketPreview() {
  // Load last used institution name from localStorage, or use default
  const lastInstitutionName = localStorage.getItem('lastInstitutionName') || 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI';
  document.getElementById('institutionName').value = lastInstitutionName;
  
  document.getElementById('examTitle').value = 'ADMISSION TICKET FOR B.E EXAMINATION JUNE / JULY 2025';
  updatePreview();
  updateStudentSelect();
  updatePhotoStudentSelect();
  // Additional initialization if needed
  initializeAdditionalSettings();
  updatePreview();
  updateStudentSelect();
  updatePhotoStudentSelect();
}

// Update student select dropdown
function updateStudentSelect() {
  const select = document.getElementById('studentSelect');
  select.innerHTML = '<option value="">Select a student...</option>';
  
  studentData.forEach((student, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${student.usn} - ${student.name}`;
    select.appendChild(option);
  });
}

// Update preview
function updatePreview() {
  const preview = document.getElementById('hallTicketPreview');
  const institutionName = document.getElementById('institutionName').value || 'Institution Name';
  const examTitle = document.getElementById('examTitle').value || 'Examination';
  const primaryColor = document.getElementById('primaryColor').value;
  const secondaryColor = document.getElementById('secondaryColor').value;
  
  // Sample student for preview
  const sampleStudent = studentData[0] || {
    usn: 'SAMPLE123',
    name: 'Sample Student',
    phone: '+91 9876543210',
    subjects: [
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'Physics', code: 'PHY101' },
      { name: 'Chemistry', code: 'CHEM101' }
    ]
  };
  
  // Get current date and time
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const timeStr = currentDate.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  // Get class information if available
  const classInfo = classInformation || {};
  
  preview.innerHTML = `
    <div class="hall-ticket" style="border: 3px solid ${primaryColor}; font-family: 'Times New Roman', serif; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
      <!-- Header Section -->
      <div class="header text-center mb-4" style="background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); color: white; padding: 20px; margin: 0;">
        <h1 class="text-2xl font-bold mb-2">${institutionName}</h1>
        ${currentBranch ? `<h2 class="text-lg font-semibold mb-2 opacity-95">DEPARTMENT OF ${currentBranch.name.toUpperCase()}</h2>` : ''}
        <h2 class="text-lg font-semibold mb-1">HALL TICKET</h2>
        <p class="text-sm opacity-90">${examTitle}</p>
      </div>
      
      <!-- Class Information Section (General) -->
      ${Object.keys(classInfo).length > 0 ? `
        <div class="class-info mb-6 px-6 py-4 bg-blue-50 border-l-4 border-blue-500">
          <h3 class="font-bold mb-3 text-lg flex items-center" style="color: ${primaryColor};">
            <i class="fas fa-info-circle mr-2"></i>Class Information
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              ${classInfo.examType ? `
                <div class="flex">
                  <span class="font-medium text-gray-700 w-24">Exam Type:</span>
                  <span class="text-gray-800">${classInfo.examType.charAt(0).toUpperCase() + classInfo.examType.slice(1).replace('-', ' ')}</span>
                </div>` : ''}
              ${classInfo.semester ? `
                <div class="flex">
                  <span class="font-medium text-gray-700 w-24">Semester:</span>
                  <span class="text-gray-800">${classInfo.semester.charAt(0).toUpperCase() + classInfo.semester.slice(1)} Semester</span>
                </div>` : ''}
              ${classInfo.examTime ? `
                <div class="flex">
                  <span class="font-medium text-gray-700 w-24">Time:</span>
                  <span class="text-green-600 font-mono font-semibold">${classInfo.examTime}</span>
                </div>` : ''}
            </div>
            <div class="space-y-2">
              ${classInfo.centerCode ? `
                <div class="flex">
                  <span class="font-medium text-gray-700 w-24">Center:</span>
                  <span class="text-red-600 font-mono font-bold">${classInfo.centerCode}</span>
                </div>` : ''}
              ${classInfo.examDuration ? `
                <div class="flex">
                  <span class="font-medium text-gray-700 w-24">Duration:</span>
                  <span class="text-orange-600 font-semibold">${classInfo.examDuration}</span>
                </div>` : ''}
              ${classInfo.examMonthYear ? `
                <div class="flex">
                  <span class="font-medium text-gray-700 w-24">Session:</span>
                  <span class="text-purple-600 font-semibold">${classInfo.examMonthYear}</span>
                </div>` : ''}
            </div>
          </div>
        </div>` : ''
      }
      
      <!-- Student Information Section -->
      <div class="student-info mb-6 px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-3">
            <div class="flex flex-wrap">
              <span class="font-bold text-gray-700 w-20">USN:</span>
              <span class="font-mono bg-gray-100 px-2 py-1 rounded text-lg font-bold" style="color: ${primaryColor}">${sampleStudent.usn}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-bold text-gray-700 w-20">Name:</span>
              <span class="font-semibold">${sampleStudent.name}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-bold text-gray-700 w-20">Admission No:</span>
              <span class="font-mono text-blue-600">${sampleStudent.admissionNo || 'Not provided'}</span>
            </div>
          </div>
          
          <!-- Right Column -->
          <div class="space-y-3">
            <div class="flex flex-wrap">
              <span class="font-bold text-gray-700 w-20">Branch:</span>
              <span class="font-semibold">${currentBranch?.name || 'Not selected'}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-bold text-gray-700 w-20">Year:</span>
              <span class="font-semibold">${currentYear?.name || 'Not selected'}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-bold text-gray-700 w-20">Date:</span>
              <span class="font-mono text-green-600">${dateStr}</span>
            </div>
          </div>
        </div>
        
        <!-- Student Photo Section -->
        <div class="mt-4 flex justify-end">
          <div class="w-24 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-50">
            ${sampleStudent.usn && studentPhotos[sampleStudent.usn] ? 
              `<img src="${studentPhotos[sampleStudent.usn]}" alt="Student Photo" class="w-full h-full object-cover rounded" />` :
              '<div class="text-xs text-gray-500 text-center"><i class="fas fa-camera text-2xl mb-1"></i><br>Photo</div>'
            }
          </div>
        </div>
      </div>
      
      <!-- Subjects Section -->
      <div class="subjects mb-6 px-6">
        <h3 class="font-bold mb-3 text-lg flex items-center" style="color: ${primaryColor};">
          <i class="fas fa-book-open mr-2"></i>Subjects Registered:
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr style="background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15);">
                <th class="border border-gray-300 p-2 text-left font-bold text-xs">S.No</th>
                <th class="border border-gray-300 p-2 text-left font-bold text-xs">Subject Code</th>
                <th class="border border-gray-300 p-2 text-left font-bold text-xs">Subject Name</th>
                <th class="border border-gray-300 p-2 text-left font-bold text-xs">Exam Date</th>
                <th class="border border-gray-300 p-2 text-left font-bold text-xs">Time</th>
                <th class="border border-gray-300 p-2 text-left font-bold text-xs">Duration</th>
              </tr>
            </thead>
            <tbody>
              ${sampleStudent.subjects.length > 0 ? 
                sampleStudent.subjects.map((subject, index) => `
                  <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors">
                    <td class="border border-gray-300 p-2 text-center font-semibold text-sm">${index + 1}</td>
                    <td class="border border-gray-300 p-2 font-mono font-bold text-blue-600 text-sm">${subject.code}</td>
                    <td class="border border-gray-300 p-2 text-sm">${subject.name}</td>
                    <td class="border border-gray-300 p-2 text-sm text-center">${subject.date ? new Date(subject.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</td>
                    <td class="border border-gray-300 p-2 text-sm text-center">${subject.startTime && subject.endTime ? `${subject.startTime} - ${subject.endTime}` : '-'}</td>
                    <td class="border border-gray-300 p-2 text-sm text-center font-semibold text-orange-600">${subject.duration || '-'}</td>
                  </tr>
                `).join('') :
                '<tr><td colspan="6" class="border border-gray-300 p-4 text-center text-gray-500 italic">No subjects registered</td></tr>'
              }
            </tbody>
          </table>
        </div>
        
        <!-- Subject Count -->
        <div class="mt-2 text-sm text-gray-600 text-right">
          Total Subjects: <span class="font-bold" style="color: ${primaryColor}">${sampleStudent.subjects.length}</span>
        </div>
      </div>
      
      <!-- Instructions Section -->
      <div class="instructions mb-4 px-6">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
          <h4 class="font-bold text-yellow-800 mb-1">Important Instructions:</h4>
          <ul class="text-xs text-yellow-700 list-disc ml-4 space-y-1">
            <li>Bring this hall ticket to the examination center</li>
            <li>Carry a valid photo ID proof</li>
            <li>Report to the exam center 30 minutes before the exam</li>
            <li>Mobile phones are not allowed in the exam hall</li>
          </ul>
        </div>
      </div>
      
      <!-- Footer Section -->
      <div class="footer px-6 pb-4">
        <div class="border-t border-gray-300 pt-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="text-center">
              <div class="h-12 border-b border-gray-300 mb-2"></div>
              <p class="font-semibold">Student Signature</p>
            </div>
            <div class="text-center">
              <div class="h-12 border-b border-gray-300 mb-2"></div>
              <p class="font-semibold">Invigilator Signature</p>
            </div>
            <div class="text-center">
              <div class="h-12 border-b border-gray-300 mb-2"></div>
              <p class="font-semibold">Center Superintendent</p>
            </div>
          </div>
          
          <div class="mt-4 text-center text-xs" style="color: ${secondaryColor};">
            <p class="mb-1">This is a computer-generated hall ticket and does not require signature</p>
            <p>Generated on ${dateStr} at ${timeStr} | Hall Ticket Generator v2.0</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Generate all tickets
function generateAllTickets() {
  if (studentData.length === 0) {
    alert('No student data available! Please add students first.');
    return;
  }
  
  const confirmed = confirm(`Generate ${studentData.length} hall tickets?\n\nThis will create a VTU-style PDF with all student hall tickets.`);
  if (!confirmed) return;
  
  try {
    const date = new Date().toISOString().split('T')[0];
    generateVTUStylePDF(studentData, `all_hall_tickets_${date}.pdf`);
  } catch (error) {
    alert('Error generating all tickets: ' + error.message);
    console.error('All tickets generation error:', error);
  }
}

// Download PDF (single preview)
function downloadPDF() {
  const sampleStudent = studentData[0] || {
    usn: 'SAMPLE123',
    name: 'Sample Student',
    subjects: [
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'Physics', code: 'PHY101' },
      { name: 'Chemistry', code: 'CHEM101' }
    ]
  };
  
  try {
    generatePDFForStudent(sampleStudent, true);
  } catch (error) {
    alert('Error generating PDF: ' + error.message);
    console.error('PDF generation error:', error);
  }
}

// Generate PDF for all students
function generatePDFForAllStudents() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  
  studentData.forEach((student, index) => {
    if (index > 0) {
      pdf.addPage();
    }
    addHallTicketToPDF(pdf, student);
  });
  
  const date = new Date().toISOString().split('T')[0];
  const filename = `hall_tickets_${date}.pdf`;
  pdf.save(filename);
  
  alert(`Successfully generated ${studentData.length} hall tickets!\nDownloaded as: ${filename}`);
}

// Generate PDF for single student
function generatePDFForStudent(student, download = false) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  
  addHallTicketToPDF(pdf, student);
  
  if (download) {
    const filename = `hall_ticket_${student.usn || 'preview'}.pdf`;
    pdf.save(filename);
    alert(`Hall ticket generated for ${student.name}!\nDownloaded as: ${filename}`);
  }
  
  return pdf;
}

// Add hall ticket content to PDF
function addHallTicketToPDF(pdf, student) {
  const institutionName = document.getElementById('institutionName').value || 'University College of Engineering';
  const examTitle = document.getElementById('examTitle').value || 'Mid Term Examination - 2024';
  const primaryColor = document.getElementById('primaryColor').value;
  
  // Convert hex color to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 59, g: 130, b: 246 };
  };
  
  const primaryRgb = hexToRgb(primaryColor);
  
  // Header
  pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.rect(10, 10, 190, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(institutionName, 105, 25, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(examTitle, 105, 35, { align: 'center' });
  
  // Main content
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('HALL TICKET', 105, 55, { align: 'center' });
  
  // Student information
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const startY = 75;
  let currentY = startY;
  
  // Student details in two columns
  pdf.setFont('helvetica', 'bold');
  pdf.text('USN:', 20, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(student.usn, 60, currentY);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Name:', 120, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(student.name, 150, currentY);
  
  currentY += 15;
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Branch:', 20, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(currentBranch.name, 60, currentY);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Year:', 120, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(currentYear.name, 150, currentY);
  
  currentY += 25;
  
  // Subjects table
  pdf.setFont('helvetica', 'bold');
  pdf.text('Subjects:', 20, currentY);
  currentY += 10;
  // Table layout: include columns for Code, Name, Date, Time
  const tableX = 20;
  const tableWidth = 170; // content width
  // Column widths must sum to tableWidth
  const colWidths = {
    code: 30,
    name: 85,
    date: 30,
    time: 25
  };
  const colX = {
    code: tableX,
    name: tableX + colWidths.code,
    date: tableX + colWidths.code + colWidths.name,
    time: tableX + colWidths.code + colWidths.name + colWidths.date
  };

  // Header background
  pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b, 0.08);
  const headerHeight = 10;
  pdf.rect(tableX, currentY, tableWidth, headerHeight, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Code', colX.code + 3, currentY + 7);
  pdf.text('Subject Name', colX.name + 3, currentY + 7);
  pdf.text('Date', colX.date + 3, currentY + 7);
  pdf.text('Time', colX.time + 3, currentY + 7);

  currentY += headerHeight;

  // Table rows (support variable height when subject name wraps)
  pdf.setFont('helvetica', 'normal');
  const rowGap = 4; // padding inside cell
  let tableBodyHeight = 0;
  student.subjects.forEach((subject, index) => {
    // Prepare cell contents
    const codeText = subject.code || '';
    const nameText = subject.name || '';
    const dateText = subject.date || '-';
    // Prefer explicit start/end times, then a generic time field, otherwise show '-'
    let timeText = '-';
    if (subject.startTime && subject.endTime) {
      timeText = `${subject.startTime} - ${subject.endTime}`;
    } else if (subject.time) {
      timeText = subject.time;
    }

    // Compute name text wrapping
    const nameColWidth = colWidths.name - 6; // padding
    const nameLines = pdf.splitTextToSize(nameText || '-', nameColWidth);
    const lineHeight = 6;
    const neededHeight = Math.max(headerHeight, nameLines.length * lineHeight + rowGap);

    // Page break if needed (keep 30 mm bottom margin)
    if (currentY + neededHeight > 250) {
      // draw vertical/horizontal borders for rows drawn so far
      // add a new page and reset Y
      pdf.addPage();
      currentY = 30;
      // redraw header on new page
      pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b, 0.08);
      pdf.rect(tableX, currentY, tableWidth, headerHeight, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.text('Code', colX.code + 3, currentY + 7);
      pdf.text('Subject Name', colX.name + 3, currentY + 7);
      pdf.text('Date', colX.date + 3, currentY + 7);
      pdf.text('Time', colX.time + 3, currentY + 7);
      currentY += headerHeight;
    }

    // Alternating row fill for readability
    if (index % 2 === 0) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(tableX, currentY, tableWidth, neededHeight, 'F');
    }

    // Draw texts
    pdf.setTextColor(0, 0, 0);
    pdf.text(codeText, colX.code + 3, currentY + 7);
    pdf.text(nameLines, colX.name + 3, currentY + 7);
    pdf.text(dateText, colX.date + 3, currentY + 7);
    pdf.text(timeText, colX.time + 3, currentY + 7);

    // Draw cell borders for this row
    pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setLineWidth(0.3);
    // Horizontal top border
    pdf.line(tableX, currentY, tableX + tableWidth, currentY);
    // Horizontal bottom border
    pdf.line(tableX, currentY + neededHeight, tableX + tableWidth, currentY + neededHeight);
    // Vertical separators
    let vx = tableX;
    vx += colWidths.code; pdf.line(vx, currentY, vx, currentY + neededHeight);
    vx += colWidths.name; pdf.line(vx, currentY, vx, currentY + neededHeight);
    vx += colWidths.date; pdf.line(vx, currentY, vx, currentY + neededHeight);

    currentY += neededHeight;
    tableBodyHeight += neededHeight;
  });

  // Outer border around the whole table (header + body)
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.setLineWidth(1);
  const outerY = currentY - (tableBodyHeight + headerHeight);
  pdf.rect(tableX, outerY, tableWidth, headerHeight + tableBodyHeight);
  
  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('This is a computer-generated hall ticket and does not require signature', 105, 270, { align: 'center' });
  
  // Date
  const currentDate = new Date().toLocaleDateString();
  pdf.text(`Generated on: ${currentDate}`, 20, 280);
  
  // QR Code placeholder (if QR code is implemented)
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(170, 250, 20, 20);
  pdf.setFontSize(8);
  pdf.text('QR', 178, 262, { align: 'center' });
}

// Handle Excel/CSV file import
function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        alert('Excel file must have at least a header row and one data row.');
        return;
      }
      
      // Get headers and normalize them
      const headers = jsonData[0].map(h => String(h || '').trim().toLowerCase());
      
      // Find column indices by header names (flexible order)
      const columnMap = {};
      
      // Map known variations of column names
      headers.forEach((header, index) => {
        const normalized = String(header || '').toLowerCase().replace(/[\s\._-]/g, '');

        if (currentStudentType === 'school') {
          // For school students, look for Roll Number instead of USN
          if (normalized.includes('roll') || normalized.includes('rollnumber') || normalized.includes('rollno')) {
            columnMap.rollNumber = index;
          } else if (normalized.includes('name') && !normalized.includes('subject') && !normalized.includes('father')) {
            columnMap.name = index;
          } else if (normalized.includes('father') && normalized.includes('name')) {
            columnMap.fatherName = index;
          } else if (normalized.includes('admission') || normalized.includes('admissionno')) {
            columnMap.admissionNo = index;
          }
        } else {
          // For engineering/general students, use original logic
          if (normalized.includes('usn') || normalized.includes('universityno')) {
            columnMap.usn = index;
          } else if (normalized.includes('name') && !normalized.includes('subject')) {
            columnMap.name = index;
          } else if (normalized.includes('admission') || normalized.includes('admissionno')) {
            columnMap.admissionNo = index;
          }
        }
        
        if (/(subject|sub|code|date|time)/.test(normalized)) {
          // Treat these as subject-related columns. Detect specific type if possible.
          if (!columnMap.subjects) columnMap.subjects = [];
          if (normalized.includes('code')) {
            columnMap.subjects.push({ type: 'code', index });
          } else if (normalized.includes('date')) {
            columnMap.subjects.push({ type: 'date', index });
          } else if (normalized.includes('time')) {
            columnMap.subjects.push({ type: 'time', index });
          } else {
            // default to name when header looks like a subject name
            columnMap.subjects.push({ type: 'name', index });
          }
        }
      });
      
      // Validate required columns based on student type
      if (currentStudentType === 'school') {
        if (columnMap.rollNumber === undefined || columnMap.name === undefined) {
          alert('Excel file must contain Roll Number and Name columns for school students.\n\nSupported column names:\n- Roll Number, Roll No\n- Student Name, Name\n- Father Name (optional)\n- Admission No (optional)\n- Subject 1, Code 1, Subject 2, Code 2, etc.');
          return;
        }
      } else {
        if (columnMap.usn === undefined || columnMap.name === undefined) {
          alert('Excel file must contain USN and Name columns.\n\nSupported column names:\n- USN, University No\n- Name, Student Name\n- Admission No (optional)\n- Subject 1, Code 1, Subject 2, Code 2, etc.');
          return;
        }
      }
      
      // Sort subjects by index to maintain order
      if (columnMap.subjects) {
        columnMap.subjects.sort((a, b) => a.index - b.index);
      }
      
      // Clear existing table
      const tbody = document.getElementById('studentTableBody');
      tbody.innerHTML = '';
      
      // Determine maximum subjects needed
      let maxSubjects = 5; // Default minimum
      if (columnMap.subjects) {
        const subjectCount = Math.ceil(columnMap.subjects.length / 2);
        maxSubjects = Math.max(maxSubjects, subjectCount);
      }
      
      // Adjust table structure if needed
      adjustTableForSubjects(maxSubjects);
      
      let importedCount = 0;
      
      // Process data rows (skip header)
      jsonData.slice(1).forEach((row, index) => {
        let studentInfo;
        
        if (currentStudentType === 'school') {
          if (row.length === 0 || !row[columnMap.rollNumber] || !row[columnMap.name]) {
            return; // Skip empty rows
          }
          
          studentInfo = {
            rollNumber: String(row[columnMap.rollNumber] || '').trim(),
            usn: String(row[columnMap.rollNumber] || '').trim(), // Keep USN for compatibility
            name: String(row[columnMap.name] || '').trim(),
            fatherName: columnMap.fatherName !== undefined ? String(row[columnMap.fatherName] || '').trim() : '',
            admissionNo: columnMap.admissionNo !== undefined ? String(row[columnMap.admissionNo] || '').trim() : '',
            subjects: []
          };
        } else {
          if (row.length === 0 || !row[columnMap.usn] || !row[columnMap.name]) {
            return; // Skip empty rows
          }
          
          studentInfo = {
            usn: String(row[columnMap.usn] || '').trim(),
            name: String(row[columnMap.name] || '').trim(),
            admissionNo: columnMap.admissionNo !== undefined ? String(row[columnMap.admissionNo] || '').trim() : '',
            subjects: []
          };
        }
        
        // Extract subjects dynamically
        if (columnMap.subjects) {
          // Separate columns by type
          const nameColumns = columnMap.subjects.filter(s => s.type === 'name').sort((a, b) => a.index - b.index);
          const codeColumns = columnMap.subjects.filter(s => s.type === 'code').sort((a, b) => a.index - b.index);
          const dateColumns = columnMap.subjects.filter(s => s.type === 'date').sort((a, b) => a.index - b.index);
          const timeColumns = columnMap.subjects.filter(s => s.type === 'time').sort((a, b) => a.index - b.index);

          // Determine the number of subjects (use the maximum across detected columns)
          const maxSubjects = Math.max(nameColumns.length, codeColumns.length, dateColumns.length, timeColumns.length);

          // Extract each subject set
          for (let i = 0; i < maxSubjects; i++) {
            const nameCol = nameColumns[i];
            const codeCol = codeColumns[i];
            const dateCol = dateColumns[i];
            const timeCol = timeColumns[i];

            const subjectName = nameCol ? String(row[nameCol.index] || '').trim() : '';
            const subjectCode = codeCol ? String(row[codeCol.index] || '').trim() : '';
            const subjectDate = dateCol ? String(row[dateCol.index] || '').trim() : '';
            const subjectTime = timeCol ? String(row[timeCol.index] || '').trim() : '';

            // Only add if at least one field has data
            if (subjectName || subjectCode || subjectDate || subjectTime) {
              studentInfo.subjects.push({
                name: subjectName,
                code: subjectCode,
                date: subjectDate,
                time: subjectTime
              });
            }
          }
        }
        
        // Ensure we have enough subject slots (minimum 5, but can expand)
        while (studentInfo.subjects.length < Math.max(5, maxSubjects)) {
          studentInfo.subjects.push({ name: '', code: '' });
        }
        
        addRowWithData(studentInfo);
        importedCount++;
      });
      
      // Auto-renumber S.No after import
      renumberSNo();
      
      let successMessage;
      if (currentStudentType === 'school') {
        successMessage = `Successfully imported ${importedCount} students from ${file.name}\n\nColumns detected:\n- Roll Number: Column ${columnMap.rollNumber + 1}\n- Name: Column ${columnMap.name + 1}\n- Father Name: ${columnMap.fatherName !== undefined ? 'Column ' + (columnMap.fatherName + 1) : 'Not found'}\n- Admission No: ${columnMap.admissionNo !== undefined ? 'Column ' + (columnMap.admissionNo + 1) : 'Not found'}\n- Subjects: ${columnMap.subjects ? Math.ceil(columnMap.subjects.length / 2) : 0} pairs detected`;
      } else {
        successMessage = `Successfully imported ${importedCount} students from ${file.name}\n\nColumns detected:\n- USN: Column ${columnMap.usn + 1}\n- Name: Column ${columnMap.name + 1}\n- Admission No: ${columnMap.admissionNo !== undefined ? 'Column ' + (columnMap.admissionNo + 1) : 'Not found'}\n- Subjects: ${columnMap.subjects ? Math.ceil(columnMap.subjects.length / 2) : 0} pairs detected`;
      }
      alert(successMessage);
      
    } catch (error) {
      let errorMessage;
      if (currentStudentType === 'school') {
        errorMessage = 'Error reading file. Please make sure it\'s a valid Excel or CSV file.\n\nSupported format for school students:\nAny order: S.No, Roll Number, Student Name, Father Name, Admission No, Subject 1, Code 1, Subject 2, Code 2, etc.';
      } else {
        errorMessage = 'Error reading file. Please make sure it\'s a valid Excel or CSV file.\n\nSupported format:\nAny order: S.No, USN, Name, Admission No, Subject 1, Code 1, Subject 2, Code 2, etc.';
      }
      alert(errorMessage);
      console.error('Import error:', error);
    }
  };
  
  reader.readAsArrayBuffer(file);
}

// Auto-renumber S.No column
function renumberSNo() {
  const tbody = document.getElementById('studentTableBody');
  Array.from(tbody.children).forEach((row, index) => {
    row.firstElementChild.textContent = index + 1;
  });
}

// Adjust table structure for dynamic subjects
function adjustTableForSubjects(maxSubjects) {
  const table = document.getElementById('studentTable');
  const headerRow = table.querySelector('thead tr');
  const tbody = table.querySelector('tbody');
  
  // Get current number of subject pairs
  const currentHeaders = headerRow.querySelectorAll('th');
  const fixedColumns = currentStudentType === 'school' ? 6 : 5; // School: S.No, Roll Number, Name, Father Name, Admission No, Photo | Others: S.No, USN, Name, Admission No, Photo
  const currentSubjectPairs = (currentHeaders.length - fixedColumns) / 2;
  
  if (maxSubjects > currentSubjectPairs) {
    // Add more subject columns
    const columnsToAdd = maxSubjects - currentSubjectPairs;
    
    for (let i = 0; i < columnsToAdd; i++) {
      const newSubjectNumber = currentSubjectPairs + i + 1;
      
      // Add headers
      const subjectHeader = document.createElement('th');
      subjectHeader.className = 'excel-cell';
      subjectHeader.textContent = `Subject ${newSubjectNumber}`;
      
      const codeHeader = document.createElement('th');
      codeHeader.className = 'excel-cell';
      codeHeader.textContent = `Code ${newSubjectNumber}`;
      
      headerRow.appendChild(subjectHeader);
      headerRow.appendChild(codeHeader);
      
      // Add cells to existing rows
      Array.from(tbody.children).forEach(row => {
        const subjectCell = document.createElement('td');
        subjectCell.className = 'excel-cell';
        subjectCell.innerHTML = `<input type="text" class="w-full p-1 border-none outline-none" placeholder="Subject ${newSubjectNumber}">`;
        
        const codeCell = document.createElement('td');
        codeCell.className = 'excel-cell';
        codeCell.innerHTML = `<input type="text" class="w-full p-1 border-none outline-none" placeholder="Code ${newSubjectNumber}">`;
        
        row.appendChild(subjectCell);
        row.appendChild(codeCell);
      });
    }
  }
}

// Export table data to Excel
function exportToExcel() {
  const tbody = document.getElementById('studentTableBody');
  if (tbody.children.length === 0) {
    alert('No data to export!');
    return;
  }
  
  const data = [];
  
  // Get dynamic header row from table headers
  const table = document.getElementById('studentTable');
  const headerRow = table.querySelector('thead tr');
  const headers = [];
  
  headerRow.querySelectorAll('th').forEach(th => {
    headers.push(th.textContent.trim());
  });
  
  // Add header row to data
  data.push(headers);
  
  // Add data rows
  Array.from(tbody.children).forEach((row, index) => {
    const textInputs = row.querySelectorAll('input[type="text"]'); // Only text inputs, not file inputs
    const rowData = [index + 1]; // S.No
    
    textInputs.forEach(input => {
      rowData.push(input.value || '');
    });
    
    data.push(rowData);
  });
  
  // Create workbook and worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Student Data');
  
  // Generate filename with current date
  const date = new Date().toISOString().split('T')[0];
  const filename = `student_data_${date}.xlsx`;
  
  // Download file
  XLSX.writeFile(wb, filename);
  alert(`Data exported successfully as ${filename}`);
}

// Global variables to store logo image data
let collegeLogoData = null;
let universityLogoData = null;

// Handle file uploads
document.addEventListener('DOMContentLoaded', function() {
  // Load default logos if available
  loadDefaultLogos();
  
  // Logo upload handler
  document.getElementById('logoUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        collegeLogoData = e.target.result;
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Student photo upload handler
  document.getElementById('studentPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        // Handle student photo upload
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });
});

// Load default logo images
function loadDefaultLogos() {
  // Try to load college logo (guru.jpg)
  const collegeImg = new Image();
  collegeImg.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0);
    collegeLogoData = canvas.toDataURL();
    updatePreview();
  };
  collegeImg.onerror = function() {
    console.log('College logo (guru.jpg) not found');
  };
  collegeImg.src = 'guru.jpg';
  
  // Try to load university logo (VTU.png)
  const universityImg = new Image();
  universityImg.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0);
    universityLogoData = canvas.toDataURL();
    updatePreview();
  };
  universityImg.onerror = function() {
    console.log('University logo (VTU.png) not found');
  };
  universityImg.src = 'VTU.png';
}

// Generate individual ticket
function generateIndividualTicket() {
  // Try both possible select elements (from generator and finalGeneration sections)
  let select = document.getElementById('studentSelect');
  if (!select || !select.value) {
    select = document.getElementById('individualStudentSelect');
  }
  
  if (!select) {
    alert('Student selection element not found!');
    return;
  }
  
  const selectedIndex = select.value;
  
  if (!selectedIndex || selectedIndex === '') {
    alert('Please select a student first!');
    return;
  }
  
  const student = studentData[selectedIndex];
  if (!student) {
    alert('Selected student not found!');
    return;
  }
  
  try {
    generateVTUStylePDF([student], `hall_ticket_${student.usn}.pdf`);
  } catch (error) {
    alert('Error generating individual ticket: ' + error.message);
    console.error('Individual ticket generation error:', error);
  }
}

// Download preview as PDF
function downloadPreviewPDF() {
  const sampleStudent = studentData[0] || {
    usn: 'SAMPLE123',
    name: 'Sample Student',
    subjects: [
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'Physics', code: 'PHY101' },
      { name: 'Chemistry', code: 'CHEM101' }
    ]
  };
  
  try {
    generateVTUStylePDF([sampleStudent], `preview_hall_ticket.pdf`);
  } catch (error) {
    alert('Error generating preview PDF: ' + error.message);
    console.error('Preview PDF generation error:', error);
  }
}

// View preview in a new browser tab (no download)
function viewPreviewPDF() {
  const sampleStudent = studentData[0] || {
    usn: 'SAMPLE123',
    name: 'Sample Student',
    subjects: [
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'Physics', code: 'PHY101' },
      { name: 'Chemistry', code: 'CHEM101' }
    ]
  };

  try {
    const { jsPDF } = window.jspdf;
    const pdf = generateVTUStylePDF([sampleStudent]);
    // generateVTUStylePDF now returns a jsPDF when called without filename
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (error) {
    alert('Error creating preview: ' + error.message);
    console.error('Preview view error:', error);
  }
}

// Generate VTU-style PDF with two hall ticket copies per page
function generateVTUStylePDF(students, filename) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Get institution name based on student type
  let institutionName, examTitle;
  
  if (currentStudentType === 'school' && classInformation.schoolInfo && classInformation.schoolInfo.schoolName) {
    // Use school information for school students
    institutionName = classInformation.schoolInfo.schoolName.toUpperCase();
    examTitle = document.getElementById('examTitle').value || 'SCHOOL EXAMINATION HALL TICKET';
  } else {
    // Use form values or defaults for college/engineering students
    institutionName = document.getElementById('institutionName').value || 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI';
    examTitle = document.getElementById('examTitle').value || 'ADMISSION TICKET FOR B.E EXAMINATION JUNE / JULY 2025';
  }
  
  students.forEach((student, index) => {
    // Add new page for each student (two copies per page)
    if (index > 0) {
      pdf.addPage();
    }
    
    // Add the first copy (Student Copy) - top half
    addVTUHallTicketToPDF(pdf, student, 0, institutionName, examTitle, 0);
    
    // Add the second copy (Office Copy) - bottom half  
    addVTUHallTicketToPDF(pdf, student, 0, institutionName, examTitle, 1);
  });
  
  if (filename) {
    pdf.save(filename);
    alert(`Successfully generated ${students.length * 2} hall ticket copies!\nDownloaded as: ${filename}`);
  }

  return pdf;
}

// Add VTU-style hall ticket content to PDF (improved layout with two copies per page)
function addVTUHallTicketToPDF(pdf, student, yOffset, institutionName, examTitle, copyNumber) {
  // A4 dimensions: 210mm × 297mm
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  
  // Calculate dimensions for two copies per page with proper spacing
  const margin = 5; // 5mm margin
  const copyHeight = (pageHeight - (margin * 3)) / 2; // Two copies with margins
  const copyWidth = pageWidth - (margin * 2);
  
  const startX = margin;
  const startY = margin + (copyNumber * (copyHeight + margin));
  
  // Calculate available height for content (reserve space for signatures and notes)
  const reservedBottomSpace = 25; // Reserve space for signatures and notes
  const availableContentHeight = copyHeight - reservedBottomSpace;
  
  // Get class information
  const classInfo = classInformation || {};
  
  // Main border for hall ticket
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.rect(startX, startY, copyWidth, copyHeight);
  
  // Inner border
  pdf.setLineWidth(0.5);
  pdf.rect(startX + 2, startY + 2, copyWidth - 4, copyHeight - 4);
  
  // Header section with logos and institution name
  const headerHeight = 25;
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.rect(startX + 2, startY + 2, copyWidth - 4, headerHeight);
  
  // College logo (left side)
  const logoSize = 18;
  pdf.rect(startX + 5, startY + 5, logoSize, logoSize);
  
  // Add logo based on student type
  const logoToUse = currentStudentType === 'school' && classInformation.schoolInfo?.schoolLogo 
    ? classInformation.schoolInfo.schoolLogo 
    : collegeLogoData;
    
  const logoLabel = currentStudentType === 'school' ? 'SCHOOL' : 'COLLEGE';
  
  if (logoToUse) {
    try {
      pdf.addImage(logoToUse, 'JPEG', startX + 5, startY + 5, logoSize, logoSize);
    } catch (error) {
      pdf.setFontSize(6);
      pdf.setTextColor(100, 100, 100);
      pdf.text(logoLabel, startX + 5 + logoSize/2, startY + 12, { align: 'center' });
      pdf.text('LOGO', startX + 5 + logoSize/2, startY + 16, { align: 'center' });
    }
  } else {
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text(logoLabel, startX + 5 + logoSize/2, startY + 12, { align: 'center' });
    pdf.text('LOGO', startX + 5 + logoSize/2, startY + 16, { align: 'center' });
  }
  
  // University logo (right side)
  pdf.rect(startX + copyWidth - logoSize - 5, startY + 5, logoSize, logoSize);
  
  if (universityLogoData) {
    try {
      pdf.addImage(universityLogoData, 'PNG', startX + copyWidth - logoSize - 5, startY + 5, logoSize, logoSize);
    } catch (error) {
      pdf.setFontSize(6);
      pdf.setTextColor(100, 100, 100);
      pdf.text('GOVT', startX + copyWidth - logoSize/2 - 5, startY + 12, { align: 'center' });
      pdf.text('EMBLEM', startX + copyWidth - logoSize/2 - 5, startY + 16, { align: 'center' });
    }
  } else {
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text('GOVT', startX + copyWidth - logoSize/2 - 5, startY + 12, { align: 'center' });
    pdf.text('EMBLEM', startX + copyWidth - logoSize/2 - 5, startY + 16, { align: 'center' });
  }
  
  // Institution name and title (center)
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(institutionName.toUpperCase(), startX + copyWidth/2, startY + 8, { align: 'center' });
  
  // Department/Class information based on student type
  if (currentStudentType === 'school' && classInformation.schoolInfo) {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    let classText = '';
    if (classInformation.schoolClass && classInformation.schoolClass !== 'N/A') {
      classText = classInformation.schoolClass.toUpperCase();
    }
    if (classInformation.schoolInfo.schoolBoard) {
      classText += ` - ${classInformation.schoolInfo.schoolBoard.toUpperCase()}`;
    }
    if (classText) {
      pdf.text(classText, startX + copyWidth/2, startY + 14, { align: 'center' });
    }
  } else if (currentBranch) {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`DEPARTMENT OF ${currentBranch.name.toUpperCase()}`, startX + copyWidth/2, startY + 14, { align: 'center' });
  }
  
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text(examTitle, startX + copyWidth/2, startY + 23, { align: 'center' });
  
  // Current date
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  let currentY = startY + headerHeight + 5;
  
  // 1. University Seat Number, Admission Number and Date in one line
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('1. UNIVERSITY SEAT NO:', startX + 5, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(student.usn, startX + 60, currentY);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('ADMISSION NO:', startX + 100, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(student.admissionNo || 'Not provided', startX + 140, currentY);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Date:', startX + 165, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(dateStr, startX + 180, currentY);
  
  currentY += 8;
  
  // 2. Name of the candidate
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. NAME OF THE CANDIDATE:', startX + 5, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(student.name.toUpperCase(), startX + 70, currentY);
  
  // Student photo (right side)
  const photoSize = 30;
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.rect(startX + copyWidth - photoSize - 5, currentY - 5, photoSize, photoSize);
  
  // Add student photo if available
  console.log('Checking photo for USN:', student.usn);
  console.log('Available photos:', Object.keys(studentPhotos));
  console.log('Photo data exists:', !!studentPhotos[student.usn]);
  
  if (studentPhotos[student.usn]) {
    try {
      // Detect image format and use appropriate format parameter
      const imageData = studentPhotos[student.usn];
      let format = 'JPEG';
      
      console.log('Adding photo for:', student.usn, 'Format:', format);
      console.log('Image data length:', imageData.length);
      
      if (imageData.startsWith('data:image/png')) {
        format = 'PNG';
      } else if (imageData.startsWith('data:image/gif')) {
        format = 'GIF';
      } else if (imageData.startsWith('data:image/webp')) {
        format = 'WEBP';
      }
      
      pdf.addImage(imageData, format, startX + copyWidth - photoSize - 5, currentY - 5, photoSize, photoSize);
      console.log('Photo added successfully for:', student.usn);
    } catch (error) {
      console.error('Error adding student photo:', error);
      // Fallback to placeholder text
      pdf.setFontSize(6);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Photo Error', startX + copyWidth - photoSize/2 - 5, currentY + 8, { align: 'center' });
      pdf.text('Check Format', startX + copyWidth - photoSize/2 - 5, currentY + 12, { align: 'center' });
    }
  } else {
    console.log('No photo found for USN:', student.usn);
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Affix Recent', startX + copyWidth - photoSize/2 - 5, currentY + 8, { align: 'center' });
    pdf.text('Passport Photo', startX + copyWidth - photoSize/2 - 5, currentY + 12, { align: 'center' });
  }
  
  currentY += 12;
  
  // Examination details in a compact box
  if (Object.keys(classInfo).length > 0) {
    pdf.setFontSize(7);
    pdf.setTextColor(0, 0, 0);
    
    let detailsText = '';
    if (classInfo.examType) detailsText += `Type: ${classInfo.examType.replace('-', ' ')}  `;
    if (classInfo.semester) detailsText += `Sem: ${classInfo.semester}  `;
    if (classInfo.examMonthYear) detailsText += `Session: ${classInfo.examMonthYear}  `;
    if (classInfo.examTime) detailsText += `Time: ${classInfo.examTime}  `;
    if (classInfo.centerCode) detailsText += `Center: ${classInfo.centerCode}  `;
    if (classInfo.examDuration) detailsText += `Duration: ${classInfo.examDuration}`;
    
    pdf.text(detailsText, startX + 5, currentY);
    currentY += 6;
  }
  
  // 3. Subjects table
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('3. SUBJECTS APPLIED:', startX + 5, currentY);
  currentY += 8;
  
  // Filter out empty subjects
  const validSubjects = student.subjects.filter(subject => 
    subject.code && subject.name && 
    subject.code.trim() !== '' && 
    subject.name.trim() !== ''
  );
  
  if (validSubjects.length === 0) {
    // No valid subjects - show message
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('No subjects registered', startX + 5, currentY + 5);
    currentY += 15;
  } else {
    // Calculate dynamic row height and font size based on number of subjects
    let rowHeight = 8;
    let fontSize = 8;
    let headerFontSize = 8;
    
    // Adjust sizes based on number of subjects
    if (validSubjects.length > 6) {
      // More than 6 subjects - make text smaller
      rowHeight = 6;
      fontSize = 6;
      headerFontSize = 7;
    } else if (validSubjects.length > 5) {
      // 6 subjects - slightly smaller
      rowHeight = 7;
      fontSize = 7;
      headerFontSize = 7;
    }
    
    // Subject table formatted as: DATE | TIME | SUBJECT NAME | SUBJECT CODE | SIGN
    const tableStartY = currentY;
    const tableWidth = copyWidth - 50; // Increased width to accommodate signature column
    const headerHeight = rowHeight;
    const tableHeight = validSubjects.length * rowHeight + headerHeight;

    // Table border
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(startX + 5, tableStartY, tableWidth, tableHeight);

    // Compute column widths: Date, Time, Subject Name, Subject Code, Signature
    // Layout: DATE | TIME | SUBJECT NAME | SUBJECT CODE | SIGN
    const colDateWidth = Math.max(18, Math.floor(tableWidth * 0.10));
    const colTimeWidth = Math.max(30, Math.floor(tableWidth * 0.22));
    const colNameWidth = Math.max(50, Math.floor(tableWidth * 0.35));
    const colCodeWidth = Math.max(25, Math.floor(tableWidth * 0.20));
    const colSignWidth = Math.max(20, Math.floor(tableWidth * 0.13));

    const baseX = startX + 6;
    const dateX = baseX;
    const timeX = dateX + colDateWidth;
    const nameX = timeX + colTimeWidth;
    const codeX = nameX + colNameWidth;
    const signX = codeX + colCodeWidth;

    // Header background
    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX + 5, tableStartY, tableWidth, headerHeight, 'F');

    pdf.setFontSize(headerFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATE', dateX + 2, tableStartY + (headerHeight / 2) + 2);
    pdf.text('TIME', timeX + 2, tableStartY + (headerHeight / 2) + 2);
    pdf.text('SUBJECT NAME', nameX + 2, tableStartY + (headerHeight / 2) + 2);
    pdf.text('SUBJECT CODE', codeX + 2, tableStartY + (headerHeight / 2) + 2);
    pdf.text('SIGN', signX + 2, tableStartY + (headerHeight / 2) + 2);

    // Vertical lines for columns
    pdf.line(dateX - 4 + colDateWidth, tableStartY, dateX - 4 + colDateWidth, tableStartY + tableHeight);
    pdf.line(timeX - 4 + colTimeWidth, tableStartY, timeX - 4 + colTimeWidth, tableStartY + tableHeight);
    pdf.line(nameX - 4 + colNameWidth, tableStartY, nameX - 4 + colNameWidth, tableStartY + tableHeight);
    pdf.line(codeX - 4 + colCodeWidth, tableStartY, codeX - 4 + colCodeWidth, tableStartY + tableHeight);

    // Table rows
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(fontSize);

    validSubjects.forEach((subject, index) => {
      const rowY = tableStartY + headerHeight + (index * rowHeight);

      // Horizontal separator
      pdf.line(startX + 5, rowY, startX + 5 + tableWidth, rowY);

      // Date column - format date if present
      if (subject.date) {
        const examDate = new Date(subject.date);
        const dateStr = examDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' });
        pdf.text(dateStr, dateX + 2, rowY + (rowHeight / 2) + 1);
      } else {
        pdf.text('-', dateX + 2, rowY + (rowHeight / 2) + 1);
      }

      // Time column - prefer start/end then fallback to subject.time
      let timeDisplay = '-';
      if (subject.startTime && subject.endTime) {
        timeDisplay = `${subject.startTime.substring(0,5)} - ${subject.endTime.substring(0,5)}`;
      } else if (subject.time) {
        timeDisplay = subject.time;
      }
      pdf.text(timeDisplay, timeX + 2, rowY + (rowHeight / 2) + 1);

      // Subject name - truncate if too long
      const maxNameChars = fontSize === 6 ? 25 : fontSize === 7 ? 30 : 40;
      const nameText = subject.name ? (subject.name.length > maxNameChars ? subject.name.substring(0, maxNameChars - 1) + '.' : subject.name) : '-';
      pdf.text(nameText, nameX + 2, rowY + (rowHeight / 2) + 1);

      // Subject code
      const codeText = subject.code ? subject.code.toString() : '-';
      pdf.text(codeText, codeX + 2, rowY + (rowHeight / 2) + 1);
    });

    currentY = tableStartY + tableHeight + 5;
  }
  
  // Calculate the maximum Y position we can use without going into the reserved bottom space
  const maxContentY = startY + availableContentHeight;
  
  // If current content goes beyond available space, adjust
  if (currentY > maxContentY - 30) {
    currentY = maxContentY - 30; // Leave space for signatures
  }
  
  // Calculate fixed positions for signatures and notes (always at the bottom)
  const bottomY = startY + copyHeight; // Absolute bottom of the ticket
  const signatureY = bottomY - 22; // Position signatures 22mm from bottom (moved up)
  
  // Signature areas - positioned at fixed location near bottom
  const signatureBlockHeight = 12; // Reduced height to fit better

  // Calculate safe signature area - much more conservative to avoid border crossing
  const signatureAreaWidth = copyWidth - 40; // Much larger margin to ensure containment
  const signatureWidth = signatureAreaWidth / 3;
  const lineLength = signatureWidth - 20; // Make lines much shorter

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.2);

  // Candidate signature
  const candidateX = startX + 20;
  const candidateLineStart = candidateX + (signatureWidth - lineLength) / 2;
  pdf.line(candidateLineStart, signatureY + 2, candidateLineStart + lineLength, signatureY + 2);
  pdf.text('Signature of the Candidate', candidateX + signatureWidth/2, signatureY + 6, { align: 'center' });

  // HOD signature
  const hodX = candidateX + signatureWidth;
  const hodLineStart = hodX + (signatureWidth - lineLength) / 2;
  pdf.line(hodLineStart, signatureY + 2, hodLineStart + lineLength, signatureY + 2);
  pdf.text('Signature of HOD', hodX + signatureWidth/2, signatureY + 6, { align: 'center' });

  // Principal signature
  const principalX = hodX + signatureWidth;
  const principalLineStart = principalX + (signatureWidth - lineLength) / 2;
  pdf.line(principalLineStart, signatureY + 2, principalLineStart + lineLength, signatureY + 2);
  pdf.text('Signature of Principal', principalX + signatureWidth/2, signatureY + 6, { align: 'center' });

  // Important notes - positioned BELOW signatures but safely within borders
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Note: Please verify the eligibility of candidate before issuing the admission ticket.', startX + 5, signatureY + 11);
  pdf.text('This is Electronically Generated Admission Ticket', startX + 5, signatureY + 16);
  
  // Footer note - positioned at the very bottom with safe margin
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Note: This hall ticket must be preserved until the end of the examination', startX + copyWidth/2, bottomY - 3, { align: 'center' });
}

// Mobile menu functions
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBtn = document.getElementById('mobileMenuBtn');
  const icon = menuBtn.querySelector('i');
  
  if (mobileMenu.classList.contains('hidden')) {
    // Show menu
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('show');
    icon.className = 'fas fa-times text-xl';
    menuBtn.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    // Add click outside to close
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);
  } else {
    // Hide menu
    closeMobileMenu();
  }
}

// Learn More modal controls
function openLearnMore() {
  const modal = document.getElementById('learnMoreModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeLearnMore() {
  const modal = document.getElementById('learnMoreModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBtn = document.getElementById('mobileMenuBtn');
  const icon = menuBtn.querySelector('i');
  
  mobileMenu.classList.add('hidden');
  mobileMenu.classList.remove('show');
  icon.className = 'fas fa-bars text-xl';
  menuBtn.setAttribute('aria-expanded', 'false');
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside);
}

// Handle click outside menu to close
function handleClickOutside(event) {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBtn = document.getElementById('mobileMenuBtn');
  
  if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
    closeMobileMenu();
  }
}

// Handle escape key to close menu
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu.classList.contains('hidden')) {
      closeMobileMenu();
    }
  }
}

// Handle window resize
function handleWindowResize() {
  const mobileMenu = document.getElementById('mobileMenu');
  
  // Close mobile menu on desktop
  if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
    closeMobileMenu();
  }
  
  // Update preview scaling on resize
  updatePreviewScaling();
}

// Update hall ticket preview scaling
function updatePreviewScaling() {
  const preview = document.getElementById('hallTicketPreview');
  if (!preview) return;
  
  const container = preview.parentElement;
  const containerWidth = container.offsetWidth;
  const previewWidth = 400; // Base width for hall ticket
  
  let scale = 1;
  if (containerWidth < previewWidth) {
    scale = (containerWidth - 40) / previewWidth; // 40px for padding
  }
  
  preview.style.transform = `scale(${scale})`;
  preview.style.transformOrigin = 'top left';
  preview.style.width = `${100 / scale}%`;
}

// ============ BRANCH STORAGE FUNCTIONS ============

// Load branches from localStorage or use defaults
function loadBranchesFromStorage() {
  try {
    const storedBranches = localStorage.getItem('hall_ticket_branches');
    if (storedBranches) {
      engineeringBranches = JSON.parse(storedBranches);
      console.log(`Loaded ${engineeringBranches.length} branches from localStorage`);
    } else {
      // First time load - use default branches
      engineeringBranches = [...defaultEngineeringBranches];
      console.log(`Using default branches (${engineeringBranches.length} branches)`);
      saveBranchesToStorage(); // Save defaults to localStorage
    }
  } catch (error) {
    console.error('Error loading branches from localStorage:', error);
    // Fallback to default branches
    engineeringBranches = [...defaultEngineeringBranches];
    saveBranchesToStorage();
  }
}

// Save branches to localStorage
function saveBranchesToStorage() {
  try {
    localStorage.setItem('hall_ticket_branches', JSON.stringify(engineeringBranches));
    console.log(`Saved ${engineeringBranches.length} branches to localStorage`);
  } catch (error) {
    console.error('Error saving branches to localStorage:', error);
    showError('Failed to save branch changes. Changes may be lost on refresh.');
  }
}

// Reset branches to defaults
function resetBranchesToDefaults() {
  const confirmed = confirm(
    'Are you sure you want to reset all branches to defaults?\n\n' +
    'This will remove all custom branches and restore the original branch list. ' +
    'This action cannot be undone.'
  );
  
  if (!confirmed) return;
  
  try {
    engineeringBranches = [...defaultEngineeringBranches];
    saveBranchesToStorage();
    
    // Clear any current selection if it's a custom branch
    const currentBranchExists = engineeringBranches.find(branch => 
      currentBranch && branch.id === currentBranch.id
    );
    
    if (!currentBranchExists) {
      currentBranch = null;
      const selectedBranchDisplay = document.getElementById('selectedBranchDisplay');
      if (selectedBranchDisplay) {
        selectedBranchDisplay.classList.add('hidden');
      }
    }
    
    // Refresh the UI
    populateBranchGrid();
    document.getElementById('branchSearch').value = '';
    document.getElementById('noResults').classList.add('hidden');
    
    // Exit delete mode if active
    if (isDeleteMode) {
      toggleDeleteMode();
    }
    
    showSuccess(`Branches reset to defaults! ${defaultEngineeringBranches.length} branches restored.`);
  } catch (error) {
    console.error('Error resetting branches:', error);
    showError('Failed to reset branches. Please refresh the page.');
  }
}

// Export branches data as JSON
function exportBranchesData() {
  try {
    const branchData = {
      branches: engineeringBranches,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(branchData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hall_ticket_branches_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showSuccess(`Branch data exported! ${engineeringBranches.length} branches saved.`);
  } catch (error) {
    console.error('Error exporting branches:', error);
    showError('Failed to export branch data.');
  }
}

// Import branches data from JSON
function importBranchesData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        
        if (!data.branches || !Array.isArray(data.branches)) {
          throw new Error('Invalid branch data format');
        }
        
        // Validate each branch has required fields
        const validBranches = data.branches.filter(branch => 
          branch.id && branch.name && branch.icon && branch.color && 
          typeof branch.students === 'number'
        );
        
        if (validBranches.length === 0) {
          throw new Error('No valid branches found in the file');
        }
        
        const confirmed = confirm(
          `Import ${validBranches.length} branches from ${file.name}?\n\n` +
          `This will replace all current branches (${engineeringBranches.length} branches). ` +
          `This action cannot be undone.`
        );
        
        if (!confirmed) return;
        
        engineeringBranches = validBranches;
        saveBranchesToStorage();
        
        // Clear current selection if it doesn't exist in new data
        const currentBranchExists = engineeringBranches.find(branch => 
          currentBranch && branch.id === currentBranch.id
        );
        
        if (!currentBranchExists) {
          currentBranch = null;
          const selectedBranchDisplay = document.getElementById('selectedBranchDisplay');
          if (selectedBranchDisplay) {
            selectedBranchDisplay.classList.add('hidden');
          }
        }
        
        // Refresh UI
        populateBranchGrid();
        document.getElementById('branchSearch').value = '';
        document.getElementById('noResults').classList.add('hidden');
        
        // Exit delete mode if active
        if (isDeleteMode) {
          toggleDeleteMode();
        }
        
        showSuccess(`Successfully imported ${validBranches.length} branches!`);
        
      } catch (error) {
        console.error('Import error:', error);
        showError(`Failed to import branches: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load branches from storage first
  loadBranchesFromStorage();
  
  showSection('home');
  
  // Add event listeners for responsive functionality
  window.addEventListener('resize', handleWindowResize);
  document.addEventListener('keydown', handleEscapeKey);
  
  // Add popup outside click handler
  const branchPopup = document.getElementById('branchPopup');
  if (branchPopup) {
    branchPopup.addEventListener('click', closePopupOnOutsideClick);
  }
  
  // Initialize preview scaling after a brief delay
  setTimeout(() => {
    updatePreviewScaling();
  }, 500);
  
  // Add touch event handling for mobile
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }
  
  // Handle preview updates on input changes
  const inputs = ['institutionName', 'examTitle', 'primaryColor', 'secondaryColor'];
  inputs.forEach(inputId => {
    const element = document.getElementById(inputId);
    if (element) {
      element.addEventListener('input', debounce(updatePreview, 300));
      
      // Save institution name to localStorage when it changes
      if (inputId === 'institutionName') {
        element.addEventListener('input', debounce(() => {
          localStorage.setItem('lastInstitutionName', element.value);
        }, 1000)); // Save after 1 second of no typing
      }
    }
  });
  
  // Photo management event handlers
  const individualPhotoInput = document.getElementById('individualPhotoUpload');
  if (individualPhotoInput) {
    individualPhotoInput.addEventListener('change', handleIndividualPhotoUpload);
  }
  
  const bulkPhotoInput = document.getElementById('bulkPhotoUpload');
  if (bulkPhotoInput) {
    bulkPhotoInput.addEventListener('change', handleBulkPhotoUpload);
  }
  
  // Customization event handlers
  const customizationInputs = [
    'fontFamily', 'fontSize', 'layoutStyle', 'borderStyle', 'borderWidth',
    'headerText', 'footerText', 'showPhoto', 'showSignatureArea', 'showQRCode',
    'paperSize'
  ];
  
  customizationInputs.forEach(inputId => {
    const element = document.getElementById(inputId);
    if (element) {
      if (element.type === 'checkbox') {
        element.addEventListener('change', () => {
          updateCustomizationFromForm();
          updatePreview();
        });
      } else {
        element.addEventListener('input', debounce(() => {
          updateCustomizationFromForm();
          updatePreview();
        }, 300));
      }
    }
  });
});

// Debounce function to limit rapid function calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle orientation change on mobile devices
window.addEventListener('orientationchange', function() {
  setTimeout(() => {
    updatePreviewScaling();
    handleWindowResize();
  }, 500);
});

// Add loading state management
function showLoading(element) {
  if (element) {
    element.classList.add('loading');
    const spinner = element.querySelector('.spinner');
    if (!spinner) {
      const spinnerDiv = document.createElement('div');
      spinnerDiv.className = 'spinner';
      element.appendChild(spinnerDiv);
    }
  }
}

function hideLoading(element) {
  if (element) {
    element.classList.remove('loading');
    const spinner = element.querySelector('.spinner');
    if (spinner) {
      spinner.remove();
    }
  }
}

// Enhanced error handling for better UX
function showError(message, duration = 5000) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
  errorDiv.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, duration);
}

// Debug function to check photos
function debugPhotos() {
  console.log('=== PHOTO DEBUG INFO ===');
  console.log('studentPhotos object:', studentPhotos);
  console.log('Number of photos stored:', Object.keys(studentPhotos).length);
  console.log('Photo keys:', Object.keys(studentPhotos));
  Object.keys(studentPhotos).forEach(usn => {
    console.log(`Photo for ${usn}:`, studentPhotos[usn] ? 'EXISTS (length: ' + studentPhotos[usn].length + ')' : 'NOT FOUND');
  });
  console.log('studentData:', studentData.map(s => s.usn));
  console.log('========================');
  return studentPhotos;
}

// Test function to check PDF generation with debug logging
function testPhotoInPDF() {
  console.log('=== TESTING PDF GENERATION WITH PHOTO DEBUG ===');
  
  // First check if we have student data
  if (!studentData || studentData.length === 0) {
    console.error('No student data available. Please make sure students are loaded.');
    alert('No student data available. Please make sure students are loaded first.');
    return;
  }
  
  // Use first student for testing
  const testStudent = studentData[0];
  console.log('Testing with student:', testStudent.usn, '-', testStudent.name);
  
  // Check if photo exists for this student
  const hasPhoto = studentPhotos[testStudent.usn];
  console.log('Photo exists for', testStudent.usn + ':', hasPhoto ? 'YES' : 'NO');
  
  if (hasPhoto) {
    console.log('Photo data length:', studentPhotos[testStudent.usn].length);
    console.log('Photo format:', studentPhotos[testStudent.usn].substring(0, 30) + '...');
  }
  
  console.log('Now generating PDF - watch for debug logs from addVTUHallTicketToPDF...');
  
  try {
    // Generate PDF for this student only
    generateVTUStylePDF([testStudent], `test_photo_debug_${testStudent.usn}.pdf`);
  } catch (error) {
    console.error('Error during test PDF generation:', error);
    alert('Error during test: ' + error.message);
  }
  
  console.log('=== TEST COMPLETED - CHECK ABOVE FOR PHOTO DEBUG LOGS ===');
}

// Enhanced success messages
function showSuccess(message, duration = 3000) {
  const successDiv = document.createElement('div');
  successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
  successDiv.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    if (successDiv.parentElement) {
      successDiv.remove();
    }
  }, duration);
}

// ============ PHOTO MANAGEMENT FUNCTIONS ============

// Handle photo upload for individual table rows
function handleRowPhotoUpload(input, usn) {
  const file = input.files[0];
  
  if (!file) return;
  
  // Enhanced image format checking - allow more formats including WhatsApp images
  const validImageTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
    'image/bmp', 'image/tiff', 'image/svg+xml'
  ];
  
  const isValidImage = validImageTypes.includes(file.type.toLowerCase()) || 
                      file.type.startsWith('image/') ||
                      /\.(jpe?g|png|gif|webp|bmp|tiff?|svg)$/i.test(file.name);
  
  if (!isValidImage) {
    showError('Please select a valid image file! Supported formats: JPG, PNG, GIF, WebP, BMP, TIFF, SVG');
    return;
  }
  
  // Determine final USN key: prefer passed usn, otherwise try to read from the same table row
  let keyUSN = (usn || '').toString().trim();
  if (!keyUSN) {
    // Try to find the USN input in the same row
    const row = input.closest('tr');
    if (row) {
      const textInputs = row.querySelectorAll('input[type="text"]');
      if (textInputs && textInputs.length > 0) {
        // In our table structure the first text input is the USN
        keyUSN = textInputs[0].value.trim();
      }
    }
  }

  if (!keyUSN) {
    showError('Please enter the student USN in the table before uploading the photo.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    studentPhotos[keyUSN] = e.target.result;

    // Update button appearance (input and button are siblings in the cell)
    const button = input.nextElementSibling;
    if (button) {
      button.classList.remove('btn-secondary');
      button.classList.add('btn-success');
      const icon = button.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-camera');
        icon.classList.add('fa-check');
      }
    }

    showSuccess(`Photo uploaded for ${keyUSN}`);
    updatePreview();
  };
  reader.readAsDataURL(file);
}

// Individual photo upload handler
function handleIndividualPhotoUpload(event) {
  const file = event.target.files[0];
  const studentSelect = document.getElementById('photoStudentSelect');
  const selectedUSN = studentSelect.value;
  
  if (!selectedUSN) {
    showError('Please select a student first!');
    return;
  }
  
  if (!file) return;
  
  // Enhanced image format checking - allow more formats including WhatsApp images
  const validImageTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
    'image/bmp', 'image/tiff', 'image/svg+xml'
  ];
  
  const isValidImage = validImageTypes.includes(file.type.toLowerCase()) || 
                      file.type.startsWith('image/') ||
                      /\.(jpe?g|png|gif|webp|bmp|tiff?|svg)$/i.test(file.name);
  
  if (!isValidImage) {
    showError('Please select a valid image file! Supported formats: JPG, PNG, GIF, WebP, BMP, TIFF, SVG');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    studentPhotos[selectedUSN] = e.target.result;
    showSuccess(`Photo uploaded for ${selectedUSN}`);
    updatePreview();
  };
  reader.readAsDataURL(file);
}

// Bulk photo upload handler
function handleBulkPhotoUpload(event) {
  const files = event.target.files;
  if (!files.length) return;
  
  let successCount = 0;
  let errorCount = 0;
  
  Array.from(files).forEach(file => {
    // Enhanced image format checking - allow more formats including WhatsApp images
    const validImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
      'image/bmp', 'image/tiff', 'image/svg+xml'
    ];
    
    const isValidImage = validImageTypes.includes(file.type.toLowerCase()) || 
                        file.type.startsWith('image/') ||
                        /\.(jpe?g|png|gif|webp|bmp|tiff?|svg)$/i.test(file.name);
    
    if (!isValidImage) {
      errorCount++;
      return;
    }
    
    // Extract USN from filename (e.g., "1RV21CS001.jpg" -> "1RV21CS001")
    const filename = file.name;
    const usn = filename.split('.')[0].toUpperCase();
    
    // Check if this USN exists in student data
    const studentExists = studentData.some(student => student.usn === usn);
    
    if (studentExists) {
      const reader = new FileReader();
      reader.onload = function(e) {
        studentPhotos[usn] = e.target.result;
        successCount++;
        
        // Update UI after all files are processed
        if (successCount + errorCount === files.length) {
          showSuccess(`Successfully uploaded ${successCount} photos`);
          if (errorCount > 0) {
            showError(`Failed to upload ${errorCount} files`);
          }
          updatePreview();
        }
      };
      reader.readAsDataURL(file);
    } else {
      errorCount++;
    }
  });
}

// Update photo student select dropdown
function updatePhotoStudentSelect() {
  const select = document.getElementById('photoStudentSelect');
  if (!select) return;
  
  select.innerHTML = '<option value="">Select student...</option>';
  
  studentData.forEach(student => {
    const option = document.createElement('option');
    option.value = student.usn;
    option.textContent = `${student.usn} - ${student.name}`;
    
    // Mark if photo exists
    if (studentPhotos[student.usn]) {
      option.textContent += ' ✓';
    }
    
    select.appendChild(option);
  });
}

// ============ CUSTOMIZATION FUNCTIONS ============

// Update customization settings from form
function updateCustomizationFromForm() {
  ticketCustomization.institutionName = document.getElementById('institutionName').value || ticketCustomization.institutionName;
  ticketCustomization.examTitle = document.getElementById('examTitle').value || ticketCustomization.examTitle;
  ticketCustomization.headerText = document.getElementById('headerText')?.value || ticketCustomization.headerText;
  ticketCustomization.footerText = document.getElementById('footerText')?.value || ticketCustomization.footerText;
  ticketCustomization.primaryColor = document.getElementById('primaryColor').value;
  ticketCustomization.secondaryColor = document.getElementById('secondaryColor').value;
  ticketCustomization.fontFamily = document.getElementById('fontFamily')?.value || ticketCustomization.fontFamily;
  ticketCustomization.fontSize = document.getElementById('fontSize')?.value || ticketCustomization.fontSize;
  ticketCustomization.layoutStyle = document.getElementById('layoutStyle')?.value || ticketCustomization.layoutStyle;
  ticketCustomization.borderStyle = document.getElementById('borderStyle')?.value || ticketCustomization.borderStyle;
  ticketCustomization.borderWidth = document.getElementById('borderWidth')?.value || ticketCustomization.borderWidth;
  ticketCustomization.showPhoto = document.getElementById('showPhoto')?.checked || ticketCustomization.showPhoto;
  ticketCustomization.showSignatureArea = document.getElementById('showSignatureArea')?.checked || ticketCustomization.showSignatureArea;
  ticketCustomization.showQRCode = document.getElementById('showQRCode')?.checked || false;
  ticketCustomization.paperSize = document.getElementById('paperSize')?.value || ticketCustomization.paperSize;
}

// Apply template presets
function applyTemplate(templateName) {
  const templates = {
    vtu: {
      institutionName: 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI',
      examTitle: 'ADMISSION TICKET FOR B.E EXAMINATION JUNE / JULY 2025',
      primaryColor: '#1e40af',
      secondaryColor: '#1f2937',
      fontFamily: 'helvetica',
      fontSize: 'medium',
      layoutStyle: 'standard',
      borderStyle: 'solid',
      borderWidth: '2',
      showPhoto: true,
      showSignatureArea: true,
      footerText: 'This is a computer-generated hall ticket and does not require signature'
    },
    modern: {
      institutionName: 'Modern University',
      examTitle: 'DIGITAL EXAMINATION HALL TICKET 2025',
      primaryColor: '#7c3aed',
      secondaryColor: '#374151',
      fontFamily: 'helvetica',
      fontSize: 'medium',
      layoutStyle: 'compact',
      borderStyle: 'solid',
      borderWidth: '1',
      showPhoto: true,
      showSignatureArea: false,
      footerText: 'Generated digitally • No signature required'
    },
    classic: {
      institutionName: 'Classic Education Institute',
      examTitle: 'TRADITIONAL EXAMINATION HALL TICKET',
      primaryColor: '#059669',
      secondaryColor: '#1f2937',
      fontFamily: 'times',
      fontSize: 'large',
      layoutStyle: 'detailed',
      borderStyle: 'double',
      borderWidth: '3',
      showPhoto: true,
      showSignatureArea: true,
      footerText: 'This hall ticket is valid for the specified examination only'
    }
  };
  
  const template = templates[templateName];
  if (!template) return;
  
  // Apply template settings
  Object.assign(ticketCustomization, template);
  
  // Update form fields
  document.getElementById('institutionName').value = template.institutionName;
  document.getElementById('examTitle').value = template.examTitle;
  document.getElementById('primaryColor').value = template.primaryColor;
  document.getElementById('secondaryColor').value = template.secondaryColor;
  
  if (document.getElementById('fontFamily')) document.getElementById('fontFamily').value = template.fontFamily;
  if (document.getElementById('fontSize')) document.getElementById('fontSize').value = template.fontSize;
  if (document.getElementById('layoutStyle')) document.getElementById('layoutStyle').value = template.layoutStyle;
  if (document.getElementById('borderStyle')) document.getElementById('borderStyle').value = template.borderStyle;
  if (document.getElementById('borderWidth')) document.getElementById('borderWidth').value = template.borderWidth;
  if (document.getElementById('showPhoto')) document.getElementById('showPhoto').checked = template.showPhoto;
  if (document.getElementById('showSignatureArea')) document.getElementById('showSignatureArea').checked = template.showSignatureArea;
  if (document.getElementById('footerText')) document.getElementById('footerText').value = template.footerText;
  
  showSuccess(`Applied ${templateName.charAt(0).toUpperCase() + templateName.slice(1)} template`);
  updatePreview();
}

// Save customization template
function saveCustomization() {
  updateCustomizationFromForm();
  
  const customizationData = {
    settings: ticketCustomization,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(customizationData, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hall_ticket_template_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showSuccess('Template saved successfully!');
}

// Load customization template
function loadCustomization() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (data.settings) {
          Object.assign(ticketCustomization, data.settings);
          
          // Update form fields
          document.getElementById('institutionName').value = data.settings.institutionName || '';
          document.getElementById('examTitle').value = data.settings.examTitle || '';
          document.getElementById('primaryColor').value = data.settings.primaryColor || '#3B82F6';
          document.getElementById('secondaryColor').value = data.settings.secondaryColor || '#1F2937';
          
          if (document.getElementById('headerText')) document.getElementById('headerText').value = data.settings.headerText || '';
          if (document.getElementById('footerText')) document.getElementById('footerText').value = data.settings.footerText || '';
          if (document.getElementById('fontFamily')) document.getElementById('fontFamily').value = data.settings.fontFamily || 'helvetica';
          if (document.getElementById('fontSize')) document.getElementById('fontSize').value = data.settings.fontSize || 'medium';
          if (document.getElementById('layoutStyle')) document.getElementById('layoutStyle').value = data.settings.layoutStyle || 'standard';
          if (document.getElementById('borderStyle')) document.getElementById('borderStyle').value = data.settings.borderStyle || 'solid';
          if (document.getElementById('borderWidth')) document.getElementById('borderWidth').value = data.settings.borderWidth || '2';
          if (document.getElementById('showPhoto')) document.getElementById('showPhoto').checked = data.settings.showPhoto !== false;
          if (document.getElementById('showSignatureArea')) document.getElementById('showSignatureArea').checked = data.settings.showSignatureArea !== false;
          if (document.getElementById('showQRCode')) document.getElementById('showQRCode').checked = data.settings.showQRCode || false;
          if (document.getElementById('paperSize')) document.getElementById('paperSize').value = data.settings.paperSize || 'a4';
          
          showSuccess('Template loaded successfully!');
          updatePreview();
        }
      } catch (error) {
        showError('Invalid template file!');
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

// Enhanced preview with student photos
function getStudentPhotoForPreview(usn) {
  return studentPhotos[usn] || null;
}

// Enhanced font size mapping
function getFontSizeValue(size) {
  const sizes = {
    small: { title: 16, header: 14, body: 10, small: 8 },
    medium: { title: 20, header: 16, body: 12, small: 10 },
    large: { title: 24, header: 18, body: 14, small: 12 }
  };
  return sizes[size] || sizes.medium;
}

// ============ LOGO PREVIEW FUNCTIONS ============

// Preview uploaded college logo
function previewLogo(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showError('Please select a valid image file!');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const logoPreview = document.getElementById('logoPreview');
    const logoPreviewImg = document.getElementById('logoPreviewImg');
    
    // Set the image source
    logoPreviewImg.src = e.target.result;
    
    // Show the preview container
    logoPreview.classList.remove('hidden');
    
    // Store the logo data for PDF generation
    collegeLogoData = e.target.result;
    
    // Update the hall ticket preview
    updatePreview();
    
    showSuccess('College logo uploaded successfully!');
  };
  
  reader.readAsDataURL(file);
}

// Preview uploaded university logo
function previewUniversityLogo(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showError('Please select a valid image file!');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const logoPreview = document.getElementById('universityLogoPreview');
    const logoPreviewImg = document.getElementById('universityLogoPreviewImg');
    
    // Set the image source
    logoPreviewImg.src = e.target.result;
    
    // Show the preview container
    logoPreview.classList.remove('hidden');
    
    // Store the university logo data for PDF generation
    universityLogoData = e.target.result;
    
    // Update the hall ticket preview
    updatePreview();
    
    showSuccess('University logo uploaded successfully!');
  };
  
  reader.readAsDataURL(file);
}

// Remove uploaded college logo
function removeLogo() {
  const logoPreview = document.getElementById('logoPreview');
  const logoPreviewImg = document.getElementById('logoPreviewImg');
  const logoUpload = document.getElementById('logoUpload');
  
  // Clear the preview
  logoPreviewImg.src = '';
  logoPreview.classList.add('hidden');
  
  // Clear the file input
  logoUpload.value = '';
  
  // Clear stored logo data
  collegeLogoData = null;
  
  // Update the hall ticket preview
  updatePreview();
  
  showSuccess('College logo removed successfully!');
}

// Remove uploaded university logo
function removeUniversityLogo() {
  const logoPreview = document.getElementById('universityLogoPreview');
  const logoPreviewImg = document.getElementById('universityLogoPreviewImg');
  const logoUpload = document.getElementById('universityLogoUpload');
  
  // Clear the preview
  logoPreviewImg.src = '';
  logoPreview.classList.add('hidden');
  
  // Clear the file input
  logoUpload.value = '';
  
  // Clear stored university logo data
  universityLogoData = null;
  
  // Update the hall ticket preview
  updatePreview();
  
  showSuccess('University logo removed successfully!');
}

// ============ ADD NEW BRANCH FUNCTIONS ============

// Open add branch modal
function openAddBranchModal() {
  const modal = document.getElementById('addBranchModal');
  
  // Reset form
  document.getElementById('addBranchForm').reset();
  document.getElementById('newBranchId').value = '';
  document.getElementById('selectedIcon').value = 'fas fa-graduation-cap';
  document.getElementById('selectedColor').value = 'blue';
  document.getElementById('newBranchStudents').value = '100';
  
  // Reset icon and color selection
  resetIconSelection();
  resetColorSelection();
  
  // Reset branch name label to default
  const nameLabel = document.querySelector('label[for="newBranchName"]');
  if (nameLabel) {
    nameLabel.textContent = 'Branch Name';
  }
  
  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Focus on name input
  document.getElementById('newBranchName').focus();
}

// Close add branch modal
function closeAddBranchModal() {
  const modal = document.getElementById('addBranchModal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Generate branch ID from name and update display
function generateBranchId() {
  const name = document.getElementById('newBranchName').value;
  const idInput = document.getElementById('newBranchId');
  const branchCodeDisplay = document.getElementById('branchCodeDisplay');
  const nameLabel = document.querySelector('label[for="newBranchName"]');
  
  if (name.trim()) {
    // Generate ID by taking first letters of each word
    let id = name
      .toLowerCase()
      .replace(/[^a-z\s]/g, '') // Remove non-alphabetic characters except spaces
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0])
      .join('');
    
    // If ID is too short, use first few characters of first word
    if (id.length < 2 && name.length > 0) {
      id = name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 4);
    }
    
    // Ensure uniqueness
    let finalId = id;
    let counter = 1;
    while (engineeringBranches.some(branch => branch.id === finalId)) {
      finalId = id + counter;
      counter++;
    }
    
    idInput.value = finalId;
    
    // Update the display to show branch code after name
    if (branchCodeDisplay) {
      branchCodeDisplay.textContent = `(${finalId.toUpperCase()})`;
      branchCodeDisplay.classList.remove('hidden');
    }
    
    // Update label to show the generated code
    if (nameLabel) {
      nameLabel.innerHTML = `Branch Name <span class="text-blue-600 font-mono text-sm">${finalId.toUpperCase()}</span>`;
    }
  } else {
    idInput.value = '';
    
    // Hide branch code display
    if (branchCodeDisplay) {
      branchCodeDisplay.classList.add('hidden');
    }
    
    // Reset label
    if (nameLabel) {
      nameLabel.textContent = 'Branch Name';
    }
  }
}

// Select icon
function selectIcon(button, iconClass) {
  // Remove previous selection
  document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.classList.remove('border-blue-500', 'bg-blue-50');
    btn.classList.add('border-gray-300');
  });
  
  // Add selection to clicked button
  button.classList.remove('border-gray-300');
  button.classList.add('border-blue-500', 'bg-blue-50');
  
  // Update hidden input
  document.getElementById('selectedIcon').value = iconClass;
  // If user selected a browser icon, clear any uploaded icon preview
  const preview = document.getElementById('iconFilePreview');
  if (preview) preview.classList.add('hidden');
  const iconFileInput = document.getElementById('iconFileInput');
  if (iconFileInput) iconFileInput.value = '';
}

// Switch between browser icons and file upload
function setIconSource(source) {
  const grid = document.getElementById('iconGridContainer');
  const uploadControls = document.getElementById('iconUploadControls');
  const preview = document.getElementById('iconFilePreview');
  if (source === 'file') {
    if (grid) grid.classList.add('hidden');
    if (uploadControls) uploadControls.classList.remove('hidden');
  } else {
    if (grid) grid.classList.remove('hidden');
    if (uploadControls) uploadControls.classList.add('hidden');
    if (preview) preview.classList.add('hidden');
  }
}

// Handle uploaded icon file and store as data URL
function handleIconFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    // Store selectedIcon as file:dataurl so we can detect it later
    document.getElementById('selectedIcon').value = 'file:' + dataUrl;
    const preview = document.getElementById('iconFilePreview');
    const img = document.getElementById('iconPreviewImg');
    if (img) img.src = dataUrl;
    if (preview) preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

// Select color
function selectColor(button, colorName) {
  // Remove previous selection
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.classList.remove('selected', 'border-gray-800');
  });
  
  // Add selection to clicked button
  button.classList.add('selected', 'border-gray-800');
  
  // Update hidden input
  document.getElementById('selectedColor').value = colorName;
}

// Reset icon selection to default
function resetIconSelection() {
  document.querySelectorAll('.icon-btn').forEach((btn, index) => {
    btn.classList.remove('border-blue-500', 'bg-blue-50');
    btn.classList.add('border-gray-300');
    
    // Select first icon as default
    if (index === 0) {
      btn.classList.remove('border-gray-300');
      btn.classList.add('border-blue-500', 'bg-blue-50');
    }
  });
}

// Reset color selection to default
function resetColorSelection() {
  document.querySelectorAll('.color-btn').forEach((btn, index) => {
    btn.classList.remove('selected', 'border-gray-800');
    
    // Select first color (blue) as default
    if (index === 0) {
      btn.classList.add('selected', 'border-gray-800');
    }
  });
}

// Add new branch
function addNewBranch(event) {
  event.preventDefault();
  
  const name = document.getElementById('newBranchName').value.trim();
  const id = document.getElementById('newBranchId').value.trim();
  const icon = document.getElementById('selectedIcon').value;
  const color = document.getElementById('selectedColor').value;
  const students = parseInt(document.getElementById('newBranchStudents').value) || 100;
  
  // Validation
  if (!name) {
    showError('Please enter a branch name!');
    return;
  }
  
  if (!id) {
    showError('Branch ID could not be generated!');
    return;
  }
  
  // Check for duplicate name or ID
  const duplicateName = engineeringBranches.find(branch => 
    branch.name.toLowerCase() === name.toLowerCase()
  );
  const duplicateId = engineeringBranches.find(branch => branch.id === id);
  
  if (duplicateName) {
    showError('A branch with this name already exists!');
    return;
  }
  
  if (duplicateId) {
    showError('Branch ID already exists! Please modify the name.');
    return;
  }
  
  // Create new branch object
  const newBranch = {
    id: id,
    name: name,
    icon: icon,
    students: students,
    color: color
  };
  
  // Add to branches array
  engineeringBranches.push(newBranch);
  
  // Save to localStorage
  saveBranchesToStorage();
  
  // Close modal
  closeAddBranchModal();
  
  // Refresh branch grid
  populateBranchGrid();
  
  // Show success message
  showSuccess(`"${name}" branch added successfully!`);
  
  // Clear search to show all branches including the new one
  document.getElementById('branchSearch').value = '';
  document.getElementById('noResults').classList.add('hidden');
}

// Handle escape key for add branch modal
function handleAddBranchEscape(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('addBranchModal');
    if (!modal.classList.contains('hidden')) {
      closeAddBranchModal();
    }
  }
}

// ============ BRANCH DELETE FUNCTIONS ============

// Variable to store the branch being deleted
let branchToDelete = null;

// Open delete branch modal
function openDeleteBranchModal(branchId, branchName) {
  // Store the branch to be deleted
  branchToDelete = branchId;
  
  // Update modal content with branch name
  const deleteBranchName = document.getElementById('deleteBranchName');
  deleteBranchName.textContent = branchName;
  
  // Show modal
  const modal = document.getElementById('deleteBranchModal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Add escape key listener for delete modal
  document.addEventListener('keydown', handleDeleteBranchEscape);
}

// Close delete branch modal
function closeDeleteBranchModal() {
  const modal = document.getElementById('deleteBranchModal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  
  // Reset the branch to delete
  branchToDelete = null;
  
  // Remove escape key listener
  document.removeEventListener('keydown', handleDeleteBranchEscape);
}

// Handle escape key for delete branch modal
function handleDeleteBranchEscape(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('deleteBranchModal');
    if (!modal.classList.contains('hidden')) {
      closeDeleteBranchModal();
    }
  }
}

// Confirm and delete branch
function confirmDeleteBranch() {
  if (!branchToDelete) {
    showError('No branch selected for deletion!');
    return;
  }
  
  // Find the branch in the array
  const branchIndex = engineeringBranches.findIndex(branch => branch.id === branchToDelete);
  
  if (branchIndex === -1) {
    showError('Branch not found!');
    closeDeleteBranchModal();
    return;
  }
  
  // Get branch name for success message
  const branchName = engineeringBranches[branchIndex].name;
  
  // Check if this branch is currently selected
  const isCurrentlySelected = currentBranch && currentBranch.id === branchToDelete;
  
  // Remove branch from array
  engineeringBranches.splice(branchIndex, 1);
  
  // Save updated branches to localStorage
  saveBranchesToStorage();
  
  // If the deleted branch was currently selected, clear the selection
  if (isCurrentlySelected) {
    currentBranch = null;
    const selectedBranchDisplay = document.getElementById('selectedBranchDisplay');
    if (selectedBranchDisplay) {
      selectedBranchDisplay.classList.add('hidden');
    }
  }
  
  // Close modal
  closeDeleteBranchModal();
  
  // Refresh branch grid to reflect changes
  const searchTerm = document.getElementById('branchSearch').value.toLowerCase();
  if (searchTerm.trim()) {
    // If search is active, filter the updated list
    filterBranches();
  } else {
    // Otherwise refresh the full grid
    populateBranchGrid();
  }
  
  // Check if no branches remain after deletion
  if (engineeringBranches.length === 0) {
    showNoBranchesMessage();
  }
  
  // Show success message
  showSuccess(`"${branchName}" branch deleted successfully!`);
}

// Toggle delete mode functionality
function toggleDeleteMode() {
  isDeleteMode = !isDeleteMode;
  
  const toggleButton = document.getElementById('deleteModeToggle');
  const toggleText = document.getElementById('deleteModeText');
  const instructions = document.getElementById('deleteModeInstructions');
  
  if (isDeleteMode) {
    // Enable delete mode
    toggleButton.classList.remove('bg-gradient-to-r', 'from-red-600', 'to-red-700', 'hover:from-red-700', 'hover:to-red-800');
    toggleButton.classList.add('bg-gradient-to-r', 'from-orange-600', 'to-orange-700', 'hover:from-orange-700', 'hover:to-orange-800');
    toggleText.textContent = 'Exit Delete Mode';
    instructions.classList.remove('hidden');
    
    showSuccess('Delete mode activated! Click on any branch card to delete it.');
  } else {
    // Disable delete mode
    toggleButton.classList.remove('bg-gradient-to-r', 'from-orange-600', 'to-orange-700', 'hover:from-orange-700', 'hover:to-orange-800');
    toggleButton.classList.add('bg-gradient-to-r', 'from-red-600', 'to-red-700', 'hover:from-red-700', 'hover:to-red-800');
    toggleText.textContent = 'Delete Branches';
    instructions.classList.add('hidden');
    
    showSuccess('Delete mode deactivated. Branch selection is now active.');
  }
  
  // Refresh the branch grid to update the interaction behavior
  populateBranchGrid();
}

// Show message when no branches are available
function showNoBranchesMessage() {
  const container = document.getElementById('branchGrid');
  container.innerHTML = `
    <div class="col-span-full text-center py-12">
      <i class="fas fa-graduation-cap text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No Branches Available</h3>
      <p class="text-gray-500 mb-6">All branches have been deleted. Add a new branch to get started.</p>
      <button onclick="openAddBranchModal()" class="btn btn-primary">
        <i class="fas fa-plus mr-2"></i>Add Your First Branch
      </button>
    </div>
  `;
}

// ============ BULK SUBJECTS APPLY-ALL FUNCTIONS ============

// Storage for bulk subjects data
let bulkSubjectsData = [];

// Initialize bulk subjects section with minimum 5 default rows
function initializeBulkSubjectsSection() {
  const container = document.getElementById('bulkSubjectsRows');
  if (!container) return;
  
  // Clear any existing rows
  container.innerHTML = '';
  
  // Ensure at least 5 rows are present by default
  for (let i = 0; i < 5; i++) {
    addBulkSubjectRow();
  }

  // Attach Enter-key navigation for bulk subject rows once
  if (!container.dataset.enterNavAttached) {
    container.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const target = e.target;
      if (!target || target.tagName !== 'INPUT') return;
      const row = target.closest('[id^="bulkSubjectRow-"]');
      if (!row) return;
      e.preventDefault();

      // Define the intended tab order within a bulk row
      const orderFields = ['subject', 'code', 'date', 'startTime', 'endTime', 'duration'];
      const currentField = target.dataset.field;
      const idx = orderFields.indexOf(currentField);

      if (idx >= 0 && idx < orderFields.length - 1) {
        // focus next field in same row
        const nextSelector = `input[data-field="${orderFields[idx + 1]}"]`;
        const next = row.querySelector(nextSelector);
        if (next) {
          next.focus();
          if (typeof next.select === 'function') next.select();
          return;
        }
      }

      // If no next field or at the last field, move to next row's subject input (or add new row)
      const nextRow = row.nextElementSibling;
      if (nextRow) {
        const nextSubject = nextRow.querySelector('input[data-field="subject"]');
        if (nextSubject) {
          nextSubject.focus();
          if (typeof nextSubject.select === 'function') nextSubject.select();
          return;
        }
      }

      // Add a new row and focus its subject
      addBulkSubjectRow();
    });
    container.dataset.enterNavAttached = '1';
  }
}

// Add a new bulk subject row
function addBulkSubjectRow() {
  const container = document.getElementById('bulkSubjectsRows');
  if (!container) return;
  
  const rowCount = container.children.length;
  const rowDiv = document.createElement('div');
  rowDiv.className = 'bg-white border-2 border-gray-200 rounded-xl p-6 mb-4 shadow-lg hover:shadow-xl transition-all duration-200';
  rowDiv.id = `bulkSubjectRow-${rowCount + 1}`;
  
  rowDiv.innerHTML = `
    <!-- Row Header -->
    <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
          ${rowCount + 1}
        </div>
        <span class="font-semibold text-gray-700 text-lg">Subject ${rowCount + 1}</span>
      </div>
    </div>
    
    <!-- Subject Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <!-- Subject Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-book text-blue-500 mr-2"></i>Subject Name
        </label>
        <input type="text" placeholder="Enter subject name" 
               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" 
               data-field="subject">
      </div>
      
      <!-- Subject Code -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-code text-green-500 mr-2"></i>Subject Code
        </label>
        <input type="text" placeholder="Enter subject code" 
               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" 
               data-field="code">
      </div>
      
      <!-- Exam Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-calendar-day text-purple-500 mr-2"></i>Exam Date
        </label>
        <input type="date" 
               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" 
               data-field="date">
      </div>
    </div>
    
    <!-- Time Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Start Time -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-clock text-indigo-500 mr-2"></i>Start Time
        </label>
        <input type="time" 
               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" 
               data-field="startTime" onchange="calculateDurationForRow(this)">
      </div>
      
      <!-- End Time -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-clock text-indigo-500 mr-2"></i>End Time
        </label>
        <input type="time" 
               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" 
               data-field="endTime" onchange="calculateDurationForRow(this)">
      </div>
      
      <!-- Duration -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-stopwatch text-orange-500 mr-2"></i>Duration
        </label>
        <div class="relative">
          <input type="text" placeholder="Auto calculated" 
                 class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600 text-base" 
                 data-field="duration" readonly>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <i class="fas fa-calculator text-gray-400 text-sm"></i>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(rowDiv);
  
  // Focus on the subject input of the new row
  const subjectInput = rowDiv.querySelector('input[data-field="subject"]');
  if (subjectInput) {
    subjectInput.focus();
  }
  
  showSuccess('New subject row added');
}

// Remove the last bulk subject row
function removeBulkSubjectRow() {
  const container = document.getElementById('bulkSubjectsRows');
  if (!container) return;
  
  const rows = container.children;
  // Enforce a minimum of 5 subject rows
  if (rows.length <= 5) {
    showError('At least 5 subject rows must remain');
    return;
  }
  
  // Remove the last row
  container.removeChild(rows[rows.length - 1]);
  showSuccess('Subject row removed');
}

// Apply bulk subjects to all students
function applyBulkSubjectsToAll() {
  const container = document.getElementById('bulkSubjectsRows');
  if (!container) {
    showError('Bulk subjects section not found');
    return;
  }
  
  // Collect bulk subjects data
  const bulkSubjects = [];
  const rows = container.children;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const subjectInput = row.querySelector('input[data-field="subject"]');
    const codeInput = row.querySelector('input[data-field="code"]');
    const dateInput = row.querySelector('input[data-field="date"]');
    const startTimeInput = row.querySelector('input[data-field="startTime"]');
    const endTimeInput = row.querySelector('input[data-field="endTime"]');
    const durationInput = row.querySelector('input[data-field="duration"]');
    
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const code = codeInput ? codeInput.value.trim() : '';
    const date = dateInput ? dateInput.value : '';
    const startTime = startTimeInput ? startTimeInput.value : '';
    const endTime = endTimeInput ? endTimeInput.value : '';
    const duration = durationInput ? durationInput.value : '';
    
    // Only add if both subject and code have values
    if (subject && code) {
      bulkSubjects.push({
        name: subject,
        code: code,
        date: date,
        startTime: startTime,
        endTime: endTime,
        duration: duration
      });
    }
  }
  
  if (bulkSubjects.length === 0) {
    showError('Please enter at least one subject with both name and code');
    return;
  }
  
  // Get the student table
  const table = document.getElementById('studentTable');
  const tbody = document.getElementById('studentTableBody');
  
  if (!table || !tbody) {
    showError('Student table not found');
    return;
  }
  
  // Calculate how many subject columns we need
  const requiredSubjects = bulkSubjects.length;
  
  // Get current number of subject pairs from headers
  const headerRow = table.querySelector('thead tr');
  const currentHeaders = headerRow.querySelectorAll('th');
  const fixedColumns = currentStudentType === 'school' ? 6 : 5; // School: S.No, Roll Number, Name, Father Name, Admission No, Photo | Others: S.No, USN, Name, Admission No, Photo
  const currentSubjectPairs = (currentHeaders.length - fixedColumns) / 2;
  
  // Add more columns if needed
  if (requiredSubjects > currentSubjectPairs) {
    const columnsToAdd = requiredSubjects - currentSubjectPairs;
    for (let i = 0; i < columnsToAdd; i++) {
      addColumn();
    }
  }
  
  // Apply bulk subjects to all student rows
  const studentRows = tbody.querySelectorAll('tr');
  let updatedStudents = 0;
  
  studentRows.forEach(row => {
    // Get all text inputs in this row (excluding file inputs)
    const textInputs = row.querySelectorAll('input[type="text"]');
    
    const minRequiredFields = currentStudentType === 'school' ? 4 : 3; // School needs Roll Number, Name, Father Name, Admission No | Others need USN, Name, Admission No
    if (textInputs.length >= minRequiredFields) {
      // Apply subjects starting from appropriate index based on student type
      const subjectStartIndex = currentStudentType === 'school' ? 4 : 3; // School: after Roll Number, Name, Father Name, Admission No | Others: after USN, Name, Admission No
      
      for (let i = 0; i < bulkSubjects.length; i++) {
        const subjectIndex = subjectStartIndex + (i * 2); // Subject name index
        const codeIndex = subjectStartIndex + (i * 2) + 1; // Subject code index
        
        if (subjectIndex < textInputs.length && codeIndex < textInputs.length) {
          textInputs[subjectIndex].value = bulkSubjects[i].name;
          textInputs[codeIndex].value = bulkSubjects[i].code;
        }
      }
      updatedStudents++;
    }
  });
  
  // Store the bulk subjects data for future reference
  bulkSubjectsData = bulkSubjects;
  
  showSuccess(`Successfully applied ${bulkSubjects.length} subjects to ${updatedStudents} students`);
  
  console.log('Bulk subjects applied:', {
    subjects: bulkSubjects,
    studentsUpdated: updatedStudents
  });
}

// Get bulk subjects data (for use in other functions)
function getBulkSubjectsData() {
  return bulkSubjectsData;
}

// Clear bulk subjects data
function clearBulkSubjectsData() {
  bulkSubjectsData = [];
  const container = document.getElementById('bulkSubjectsRows');
  if (container) {
    container.innerHTML = '';
    // Add 5 default rows to maintain minimum
    for (let i = 0; i < 5; i++) {
      addBulkSubjectRow();
    }
  }
}

// Calculate duration for bulk subject row based on start and end time
function calculateDurationForRow(changedInput) {
  const row = changedInput.closest('.grid');
  if (!row) return;
  
  const startTimeInput = row.querySelector('input[data-field="startTime"]');
  const endTimeInput = row.querySelector('input[data-field="endTime"]');
  const durationInput = row.querySelector('input[data-field="duration"]');
  
  if (!startTimeInput || !endTimeInput || !durationInput) return;
  
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;
  
  // Only calculate if both times are provided
  if (startTime && endTime) {
    // Parse times
    const start = new Date('1970-01-01T' + startTime + ':00');
    const end = new Date('1970-01-01T' + endTime + ':00');
    
    // Handle case where end time is on next day (like 11:00 PM to 2:00 AM)
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    // Calculate difference in milliseconds
    const diffMs = end - start;
    
    if (diffMs > 0) {
      // Convert to hours and minutes
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      // Format duration
      let duration = '';
      if (diffHours > 0) {
        duration += diffHours + 'h';
      }
      if (diffMinutes > 0) {
        if (duration) duration += ' ';
        duration += diffMinutes + 'm';
      }
      
      if (!duration) {
        duration = '0m';
      }
      
      durationInput.value = duration;
    } else {
      durationInput.value = '';
    }
  } else {
    // Clear duration if either time is missing
    durationInput.value = '';
  }
}

// ============ CLASS INFORMATION FUNCTIONS ============

// Initialize class information
function initializeClassInformation() {
  // Set default values based on selected branch and year
  const semester = getSemesterFromYear(currentYear.id);
  
  document.getElementById('semester').value = semester;
  document.getElementById('centerName').value = 'Guru Nanak Dev Engineering College';
  
  // Update semester dropdown to match the selected year
  updateSemesterOptions();
  
  // Initialize preview
  updateClassPreview();
  // Initialize exam type controls
  initializeExamTypeControls();
}

// Setup exam type control behavior
function initializeExamTypeControls() {
  const examTypeSelect = document.getElementById('examType');
  if (!examTypeSelect) return;

  // Show/hide custom input row when 'other' selected
  examTypeSelect.addEventListener('change', () => {
    const customRow = document.getElementById('customExamTypeRow');
    if (!customRow) return;
    const deleteBtn = document.getElementById('deleteExamTypeBtn');
    if (examTypeSelect.value === 'other') {
      customRow.classList.remove('hidden');
      if (deleteBtn) deleteBtn.classList.add('hidden');
    } else {
      customRow.classList.add('hidden');
      // show delete button only for custom types (not built-in)
      const isCustom = !['mid-term','end-term','practical','internal','viva','project','other'].includes(examTypeSelect.value);
      if (deleteBtn) {
        if (isCustom) deleteBtn.classList.remove('hidden');
        else deleteBtn.classList.add('hidden');
      }
    }
  });

  // Delete button handler (inline delete)
  const deleteBtn = document.getElementById('deleteExamTypeBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const select = document.getElementById('examType');
      const val = select.value;
      if (!val) return;
      // Confirm deletion
      if (!confirm('Delete this custom exam type?')) return;
      deleteCustomExamType(val);
    });
  }

  // Load persisted custom types
  loadCustomExamTypes();
}

function addCustomExamType() {
  const input = document.getElementById('customExamTypeInput');
  if (!input) return;
  const val = (input.value || '').trim();
  if (!val) return;

  const select = document.getElementById('examType');
  if (!select) return;

  // create safe value
  const safeValue = val.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const option = document.createElement('option');
  option.value = safeValue;
  option.textContent = val;

  // insert before 'other' option
  const otherOpt = Array.from(select.options).find(o => o.value === 'other');
  if (otherOpt) select.insertBefore(option, otherOpt);
  else select.appendChild(option);

  select.value = safeValue;
  const row = document.getElementById('customExamTypeRow');
  if (row) row.classList.add('hidden');
  input.value = '';
  // persist
  saveCustomExamType({ value: safeValue, label: val });
}

function saveCustomExamType(opt) {
  const key = 'educonnect_custom_exam_types';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.push(opt);
  localStorage.setItem(key, JSON.stringify(arr));
  renderCustomExamList();
}

function loadCustomExamTypes() {
  const key = 'educonnect_custom_exam_types';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  if (!arr || !arr.length) return;
  const select = document.getElementById('examType');
  const otherOpt = Array.from(select.options).find(o => o.value === 'other');
  arr.forEach(item => {
    // avoid duplicates
    if (!Array.from(select.options).some(o => o.value === item.value)) {
      const opt = document.createElement('option');
      opt.value = item.value;
      opt.textContent = item.label;
      if (otherOpt) select.insertBefore(opt, otherOpt);
      else select.appendChild(opt);
    }
  });
  renderCustomExamList();
}

function renderCustomExamList() {
  const key = 'educonnect_custom_exam_types';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  const container = document.getElementById('manageCustomExamTypes');
  const list = document.getElementById('customExamList');
  if (!container || !list) return;
  if (!arr.length) {
    container.classList.add('hidden');
    list.innerHTML = '';
    return;
  }
  container.classList.remove('hidden');
  list.innerHTML = '';
  arr.forEach(item => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between bg-gray-50 p-2 rounded';

    const span = document.createElement('span');
    span.textContent = item.label;

    const btn = document.createElement('button');
    btn.className = 'btn btn-danger btn-sm';
    btn.type = 'button';
    btn.textContent = 'Delete';
    btn.addEventListener('click', () => deleteCustomExamType(item.value));

    row.appendChild(span);
    row.appendChild(btn);
    list.appendChild(row);
  });
}

function deleteCustomExamType(value) {
  const key = 'educonnect_custom_exam_types';
  let arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr = arr.filter(i => i.value !== value);
  localStorage.setItem(key, JSON.stringify(arr));
  // remove option from select
  const select = document.getElementById('examType');
  if (select) {
    const opt = Array.from(select.options).find(o => o.value === value);
    if (opt) opt.remove();
  }
  renderCustomExamList();
  // hide inline delete button after removal
  const deleteBtn = document.getElementById('deleteExamTypeBtn');
  if (deleteBtn) deleteBtn.classList.add('hidden');
}

// Get semester based on year
function getSemesterFromYear(yearId) {
  const semesterMap = {
    '1': '1st',
    '2': '3rd', 
    '3': '5th',
    '4': '7th'
  };
  return semesterMap[yearId] || '1st';
}

// Update semester options based on selected year
function updateSemesterOptions() {
  const semester = document.getElementById('semester');
  const yearId = currentYear.id;
  
  // Clear existing options
  semester.innerHTML = '';
  
  // Add appropriate semester options
  const semesterOptions = {
    '1': ['1st Semester', '2nd Semester'],
    '2': ['3rd Semester', '4th Semester'],
    '3': ['5th Semester', '6th Semester'],
    '4': ['7th Semester', '8th Semester']
  };
  
  const options = semesterOptions[yearId] || ['1st Semester', '2nd Semester'];
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.split(' ')[0].toLowerCase();
    opt.textContent = option;
    semester.appendChild(opt);
  });
}

// Save class information
function saveClassInfo() {
  const examType = document.getElementById('examType').value;
  const academicSession = document.getElementById('academicSession').value;
  const semester = document.getElementById('semester').value;
  const examMonthYear = document.getElementById('examMonthYear').value;
  const centerCode = document.getElementById('centerCode').value;
  const centerName = document.getElementById('centerName').value;
  const examTime = document.getElementById('examTime').value;
  const examDuration = document.getElementById('examDuration').value;
  const specialInstructions = document.getElementById('specialInstructions').value;
  
  // Get school information if school student
  let schoolClass = 'N/A';
  let schoolInfo = {};
  
  if (currentStudentType === 'school') {
    const schoolClassSelect = document.getElementById('schoolClassSelect');
    const customClassInput = document.getElementById('customClassInput');
    
    if (schoolClassSelect && schoolClassSelect.value) {
      if (schoolClassSelect.value === 'other' && customClassInput && customClassInput.value.trim()) {
        // Use custom class name
        schoolClass = customClassInput.value.trim();
        currentClass = {
          number: 'custom',
          name: schoolClass,
          level: 'Custom Class'
        };
      } else if (schoolClassSelect.value !== 'other') {
        // Use predefined class
        schoolClass = `Class ${schoolClassSelect.value}`;
        currentClass = {
          number: schoolClassSelect.value,
          name: schoolClass,
          level: getSchoolLevelFromClass(schoolClassSelect.value)
        };
      }
    }
    
    // Collect school information
    schoolInfo = {
      schoolName: document.getElementById('schoolName')?.value || '',
      schoolCode: document.getElementById('schoolCode')?.value || '',
      schoolBoard: document.getElementById('schoolBoard')?.value || '',
      schoolLogo: window.schoolLogoData || null
    };
  }
  
  classInformation = {
    examType,
    academicSession,
    semester,
    examMonthYear,
    centerCode,
    centerName,
    examTime,
    examDuration,
    specialInstructions,
    studentType: currentStudentType,
    branch: currentBranch?.name || 'N/A',
    course: currentCourse?.name || 'N/A',
    schoolLevel: currentSchoolLevel || 'N/A',
    schoolClass: schoolClass,
    schoolInfo: schoolInfo,
    year: currentYear?.name || 'N/A',
    timestamp: new Date().toISOString()
  };
  
  showSuccess('Class information saved successfully!');
  updateClassPreview();
}

// Get school level from class number
function getSchoolLevelFromClass(classNum) {
  const num = parseInt(classNum);
  if (num >= 1 && num <= 5) return 'Primary School';
  if (num >= 6 && num <= 8) return 'Middle School';
  if (num >= 9 && num <= 10) return 'Secondary School';
  if (num >= 11 && num <= 12) return 'Senior Secondary';
  return 'School';
}

// Proceed to data entry from class customization
function proceedToDataEntry() {
  // Validate school class information if school student
  if (currentStudentType === 'school') {
    const schoolClassSelect = document.getElementById('schoolClassSelect');
    const customClassInput = document.getElementById('customClassInput');
    
    if (!schoolClassSelect || !schoolClassSelect.value) {
      alert('Please select a class before proceeding.');
      return;
    }
    
    if (schoolClassSelect.value === 'other') {
      if (!customClassInput || !customClassInput.value.trim()) {
        alert('Please enter a custom class name.');
        customClassInput?.focus();
        return;
      }
    }
    
    // Validate required school information
    const schoolName = document.getElementById('schoolName');
    if (!schoolName || !schoolName.value.trim()) {
      alert('Please enter the school name.');
      schoolName?.focus();
      return;
    }
  }
  
  // Save current class information
  saveClassInfo();
  
  // Initialize student table with class information context
  initializeStudentTable();
  
  // Initialize bulk subjects section
  initializeBulkSubjectsSection();
  
  // Navigate to data entry
  showSection('dataEntry');
}

// Initialize additional settings and configurations
function initializeAdditionalSettings() {
  // Initialize any additional settings that need to be set up when the page loads
  // This function can be expanded to include more initialization logic as needed
  
  // Initialize class information if not already set
  if (!classInformation || Object.keys(classInformation).length === 0) {
    classInformation = {
      examType: 'mid-term',
      academicSession: '2024-2025',
      semester: '1st',
      examMonthYear: 'June/July 2025',
      centerCode: 'GN001',
      centerName: 'Guru Nanak Dev Engineering College',
      examTime: '10:00 AM - 1:00 PM',
      examDuration: '3 Hours',
      specialInstructions: ''
    };
  }
  
  // Initialize bulk subjects if not already set
  if (!bulkSubjectsData || bulkSubjectsData.length === 0) {
    bulkSubjectsData = [];
  }
  
  // Initialize student photos object if not already set
  if (!studentPhotos) {
    studentPhotos = {};
  }
  
  // Load any saved customization settings from localStorage
  try {
    const savedCustomization = localStorage.getItem('hallTicketCustomization');
    if (savedCustomization) {
      const parsed = JSON.parse(savedCustomization);
      Object.assign(ticketCustomization, parsed);
    }
  } catch (error) {
    console.log('Could not load saved customization settings:', error);
  }
  
  console.log('Additional settings initialized successfully');
}

// ============ STUDENT TYPE SELECTION FUNCTIONS ============

// Handle student type selection
function selectStudentType(type) {
  currentStudentType = type;
  
  if (type === 'engineering') {
    // Go to engineering branch selection
    showSection('engineering');
  } else if (type === 'general') {
    // Go to general course selection
    showSection('general');
  } else if (type === 'school') {
    // Go directly to class information form for school students
    setupSchoolStudentForm();
    showSection('classCustomization');
  }
}

// Handle general course selection
function handleGeneralCourseSelection() {
  const select = document.getElementById('generalCourseSelect');
  const selectedCourse = select.value;
  
  if (selectedCourse) {
    // Set current course
    currentCourse = {
      id: selectedCourse,
      name: select.options[select.selectedIndex].text
    };
    
    // Show selected course display
    showSelectedCourseDisplay(currentCourse);
    
    // Show year cards for general students
    populateGeneralYearCards();
  }
}

// Show selected course in the general section
function showSelectedCourseDisplay(course) {
  const display = document.getElementById('selectedCourseDisplay');
  const icon = document.getElementById('selectedCourseIcon');
  const name = document.getElementById('selectedCourseName');
  const description = document.getElementById('selectedCourseDescription');
  
  // Update display elements
  name.textContent = course.name;
  description.textContent = 'General Academic Program';
  
  // Show the display
  display.classList.remove('hidden');
}

// Proceed to general year selection
function proceedToGeneralYearSelection() {
  if (currentCourse) {
    populateGeneralYearCards();
    document.getElementById('generalYearCards').classList.remove('hidden');
  }
}

// Populate year cards for general students
function populateGeneralYearCards() {
  const container = document.getElementById('generalYearCards');
  container.innerHTML = '';
  
  // Define general academic years (fewer than engineering)
  const generalYears = [
    { id: '1', name: '1st Year' },
    { id: '2', name: '2nd Year' },
    { id: '3', name: '3rd Year' }
  ];
  
  // Add Master's years if it's a master's program
  if (currentCourse && (currentCourse.id.startsWith('m') || currentCourse.id === 'mba')) {
    generalYears.splice(2, 1); // Remove 3rd year
    generalYears.push({ id: '4', name: 'Final Year' });
  }
  
  generalYears.forEach(year => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg p-6 card-hover cursor-pointer text-center border-2 border-transparent hover:border-green-500';
    card.onclick = () => selectGeneralYear(year);
    
    card.innerHTML = `
      <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-2xl font-bold text-green-600">${year.id}</span>
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">${year.name}</h3>
      <p class="text-gray-600">General Subjects</p>
      <div class="mt-4">
        <i class="fas fa-arrow-right text-green-600"></i>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Select year for general students
function selectGeneralYear(year) {
  currentYear = year;
  
  // Set up general class information
  setupGeneralClassInfo();
  
  // Go directly to hall ticket customization for general students
  showSection('generator');
}

// Setup class information for general students
function setupGeneralClassInfo() {
  // Set class details for general students
  const selectedDetails = document.getElementById('selectedDetails');
  const selectedClassDetails = document.getElementById('selectedClassDetails');
  
  if (selectedDetails) {
    selectedDetails.textContent = `${currentCourse.name} - ${currentYear.name}`;
  }
  if (selectedClassDetails) {
    selectedClassDetails.textContent = `${currentCourse.name} - ${currentYear.name}`;
  }
  
  // Update hall ticket customization for general students
  updateGeneralHallTicketSettings();
}

// Update hall ticket settings for general students
function updateGeneralHallTicketSettings() {
  // Use customized institution name if available
  let institutionName = 'ACADEMIC INSTITUTION';
  if (customCourseData && customCourseData.institutionName) {
    institutionName = customCourseData.institutionName.toUpperCase();
  } else if (customCourseData && customCourseData.university) {
    institutionName = customCourseData.university.toUpperCase();
  }
  
  // Use customized course name for exam title
  let courseName = currentCourse.name;
  if (customCourseData && customCourseData.courseName) {
    courseName = customCourseData.courseName;
    
    // Add stream/specialization info
    if (customCourseData.specialization) {
      courseName += ` (${customCourseData.specialization})`;
    }
  }
  
  ticketCustomization.institutionName = institutionName;
  ticketCustomization.examTitle = `ADMISSION TICKET FOR ${courseName.toUpperCase()} EXAMINATION`;
  
  // Update form fields if they exist
  const institutionInput = document.getElementById('institutionName');
  const examTitleInput = document.getElementById('examTitle');
  
  if (institutionInput && !institutionInput.value) {
    institutionInput.value = ticketCustomization.institutionName;
  }
  if (examTitleInput && !examTitleInput.value) {
    examTitleInput.value = ticketCustomization.examTitle;
  }
}

// ============ COURSE CUSTOMIZATION FUNCTIONS ============

// Open course customization modal
function openCourseCustomizationModal() {
  const modal = document.getElementById('courseCustomizationModal');
  
  // Pre-fill form with current course data
  if (currentCourse) {
    document.getElementById('customCourseName').value = currentCourse.name || '';
    
    // Extract course code from the course ID
    const courseCodeMap = {
      'ba': 'BA',
      'bsc': 'BSc', 
      'bcom': 'BCom',
      'bca': 'BCA',
      'bba': 'BBA',
      'ma': 'MA',
      'msc': 'MSc',
      'mcom': 'MCom',
      'mca': 'MCA',
      'mba': 'MBA'
    };
    document.getElementById('customCourseCode').value = courseCodeMap[currentCourse.id] || '';
  }
  
  // Clear previous custom data if any
  if (customCourseData) {
    populateCustomizationForm(customCourseData);
  }
  
  // Show modal
  modal.classList.remove('hidden');
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Focus on first input
  setTimeout(() => {
    document.getElementById('customCourseName').focus();
  }, 100);
}

// Close course customization modal
function closeCourseCustomizationModal() {
  const modal = document.getElementById('courseCustomizationModal');
  
  // Hide modal
  modal.classList.add('hidden');
  
  // Restore body scrolling
  document.body.style.overflow = '';
}

// Populate customization form with existing data
function populateCustomizationForm(data) {
  document.getElementById('customCourseName').value = data.courseName || '';
  document.getElementById('customCourseCode').value = data.courseCode || '';
  document.getElementById('customStream').value = data.stream || '';
  document.getElementById('customSpecialization').value = data.specialization || '';
  document.getElementById('customInstitutionName').value = data.institutionName || '';
  document.getElementById('customUniversity').value = data.university || '';
  document.getElementById('customDuration').value = data.duration || '';
  document.getElementById('isHonours').checked = data.isHonours || false;
  document.getElementById('isDistance').checked = data.isDistance || false;
  document.getElementById('isPartTime').checked = data.isPartTime || false;
}

// Save course customization
function saveCourseCustomization(event) {
  event.preventDefault();
  
  // Collect form data
  const formData = {
    courseName: document.getElementById('customCourseName').value.trim(),
    courseCode: document.getElementById('customCourseCode').value.trim(),
    stream: document.getElementById('customStream').value,
    specialization: document.getElementById('customSpecialization').value.trim(),
    institutionName: document.getElementById('customInstitutionName').value.trim(),
    university: document.getElementById('customUniversity').value.trim(),
    duration: document.getElementById('customDuration').value,
    isHonours: document.getElementById('isHonours').checked,
    isDistance: document.getElementById('isDistance').checked,
    isPartTime: document.getElementById('isPartTime').checked,
    customized: true,
    timestamp: new Date().toISOString()
  };
  
  // Validate required fields
  if (!formData.courseName) {
    alert('Course Name is required!');
    return;
  }
  
  // Save customization data
  customCourseData = formData;
  
  // Update current course with customized data
  currentCourse = {
    id: currentCourse.id,
    name: buildCustomCourseName(formData),
    originalName: currentCourse.name,
    customData: formData
  };
  
  // Update the display
  updateSelectedCourseDisplayWithCustomization();
  
  // Close modal
  closeCourseCustomizationModal();
  
  // Show success message
  showSuccess('Course customization saved successfully!');
}

// Build custom course name from form data
function buildCustomCourseName(data) {
  let courseName = data.courseName;
  
  // Add specialization if provided
  if (data.specialization) {
    courseName += ` (${data.specialization})`;
  }
  
  // Add course type indicators
  const indicators = [];
  if (data.isHonours) indicators.push('Honours');
  if (data.isDistance) indicators.push('Distance Learning');
  if (data.isPartTime) indicators.push('Part-time');
  
  if (indicators.length > 0) {
    courseName += ` - ${indicators.join(', ')}`;
  }
  
  return courseName;
}

// Update selected course display with customization
function updateSelectedCourseDisplayWithCustomization() {
  const name = document.getElementById('selectedCourseName');
  const description = document.getElementById('selectedCourseDescription');
  
  if (name) {
    name.textContent = currentCourse.name;
  }
  
  if (description && customCourseData) {
    let descriptionText = 'Customized Course';
    if (customCourseData.stream) {
      descriptionText += ` - ${getStreamDisplayName(customCourseData.stream)}`;
    }
    if (customCourseData.duration) {
      descriptionText += ` (${customCourseData.duration.replace('-', ' ')})`;
    }
    description.textContent = descriptionText;
  }
  
  // Add customization indicator
  addCustomizationIndicator();
}

// Add visual indicator for customization
function addCustomizationIndicator() {
  const display = document.getElementById('selectedCourseDisplay');
  
  // Remove existing indicator if any
  const existingIndicator = display.querySelector('.customization-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Add new customization indicator
  const indicator = document.createElement('div');
  indicator.className = 'customization-indicator mt-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block';
  indicator.innerHTML = '<i class="fas fa-cog mr-1"></i>Customized';
  
  const firstDiv = display.querySelector('div');
  if (firstDiv) {
    firstDiv.appendChild(indicator);
  }
}

// Get display name for stream
function getStreamDisplayName(stream) {
  const streamNames = {
    'arts': 'Arts/Humanities',
    'science': 'Science',
    'commerce': 'Commerce',
    'computer-applications': 'Computer Applications',
    'business-administration': 'Business Administration',
    'management': 'Management',
    'other': 'Other'
  };
  return streamNames[stream] || stream;
}

// Show success message
function showSuccess(message) {
  // Create temporary success notification
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
  notification.innerHTML = `<i class="fas fa-check mr-2"></i>${message}`;
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Setup school student form
function setupSchoolStudentForm() {
  // Set up the class customization section for school students
  const selectedClassDetails = document.getElementById('selectedClassDetails');
  if (selectedClassDetails) {
    selectedClassDetails.textContent = 'School Student - Class Information Setup';
  }
  
  // Show school-specific fields in the class customization form
  setupSchoolClassCustomization();
}

// Setup class customization for school students
function setupSchoolClassCustomization() {
  // Add school information section at the top of the form
  addSchoolInformationSection();
  
  // Add class selection dropdown to the examination details section
  const examTypeSelect = document.getElementById('examType');
  const semesterSelect = document.getElementById('semester');
  
  // Add class selection before exam type
  if (examTypeSelect && !document.getElementById('schoolClassSelect')) {
    const classSelectDiv = document.createElement('div');
    classSelectDiv.innerHTML = `
      <label class="block text-sm font-medium text-gray-700 mb-2">Class *</label>
      <select id="schoolClassSelect" class="form-select" required onchange="handleSchoolClassSelection()">
        <option value="">Select Class...</option>
        <option value="1">Class 1st</option>
        <option value="2">Class 2nd</option>
        <option value="3">Class 3rd</option>
        <option value="4">Class 4th</option>
        <option value="5">Class 5th</option>
        <option value="6">Class 6th</option>
        <option value="7">Class 7th</option>
        <option value="8">Class 8th</option>
        <option value="9">Class 9th</option>
        <option value="10">Class 10th</option>
        <option value="11">Class 11th</option>
        <option value="12">Class 12th</option>
        <option value="other">Other (Customize)</option>
      </select>
      
      <!-- Custom class input - initially hidden -->
      <div id="customClassDiv" class="mt-3 hidden">
        <label class="block text-sm font-medium text-gray-700 mb-2">Custom Class Name *</label>
        <input type="text" id="customClassInput" class="form-input" placeholder="Enter custom class name (e.g., Nursery, KG-1, Pre-School, etc.)" maxlength="50">
        <p class="text-xs text-gray-500 mt-1">Enter any class name that suits your school system</p>
      </div>
    `;
    
    examTypeSelect.parentElement.parentElement.insertBefore(classSelectDiv, examTypeSelect.parentElement);
  }
  
  // Update exam types for school students
  if (examTypeSelect) {
    examTypeSelect.innerHTML = `
      <option value="unit-test">Unit Test</option>
      <option value="monthly-test">Monthly Test</option>
      <option value="quarterly">Quarterly Examination</option>
      <option value="half-yearly">Half Yearly Examination</option>
      <option value="annual">Annual Examination</option>
      <option value="board-exam">Board Examination</option>
      <option value="practical">Practical Examination</option>
      <option value="other">Other</option>
    `;
  }
  
  // Update semester options for school students
  if (semesterSelect) {
    semesterSelect.innerHTML = `
      <option value="first-term">First Term</option>
      <option value="second-term">Second Term</option>
      <option value="annual">Annual</option>
    `;
  }
  
  // Update Center Code label and placeholder for school students
  updateCenterCodeForSchoolStudents();
  
  // Update default values for school
  const centerName = document.getElementById('centerName');
  if (centerName && !centerName.value) {
    centerName.value = 'School Examination Center';
  }
  
  const examTime = document.getElementById('examTime');
  if (examTime && !examTime.value) {
    examTime.value = '10:00 AM - 1:00 PM';
  }
  
  const examDuration = document.getElementById('examDuration');
  if (examDuration && !examDuration.value) {
    examDuration.value = '3 Hours';
  }
  
  const specialInstructions = document.getElementById('specialInstructions');
  if (specialInstructions && !specialInstructions.value) {
    specialInstructions.value = `• Report to examination center 30 minutes before exam time
• Carry valid school ID card along with this hall ticket
• Bring required stationery items
• Mobile phones are strictly prohibited`;
  }
}

// Update Center Code field to School Address only for school students
function updateCenterCodeForSchoolStudents() {
  // Only apply this change if current student type is school
  if (currentStudentType !== 'school') {
    return;
  }
  
  // Find and update the "Exam Center Code" label
  const labels = document.querySelectorAll('label');
  
  for (let label of labels) {
    if (label.textContent.includes('Exam Center Code')) {
      label.textContent = 'School Address';
      break;
    }
  }
  
  // Update the input field
  const centerCodeInput = document.getElementById('centerCode');
  if (centerCodeInput) {
    centerCodeInput.placeholder = 'Enter school address';
    if (centerCodeInput.value === 'GN001') {
      centerCodeInput.value = ''; // Clear default value for school
    }
  }
}

// Add school information section to the form
function addSchoolInformationSection() {
  // Check if school information section already exists
  if (document.getElementById('schoolInformationSection')) {
    return;
  }
  
  const formContainer = document.querySelector('#classCustomization .space-y-6');
  if (formContainer) {
    // Create school information section
    const schoolInfoSection = document.createElement('div');
    schoolInfoSection.id = 'schoolInformationSection';
    schoolInfoSection.className = 'border-b border-gray-200 pb-6';
    schoolInfoSection.innerHTML = `
      <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <i class="fas fa-school mr-2 text-orange-600"></i>School Information
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
          <input type="text" id="schoolName" class="form-input" placeholder="Enter school name" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">School Code/ID</label>
          <input type="text" id="schoolCode" class="form-input" placeholder="e.g., UDISE Code, School ID">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Board/Affiliation</label>
          <select id="schoolBoard" class="form-select">
            <option value="">Select Board...</option>
            <option value="cbse">CBSE (Central Board of Secondary Education)</option>
            <option value="icse">ICSE (Indian Certificate of Secondary Education)</option>
            <option value="state-board">State Board</option>
            <option value="igcse">IGCSE (International General Certificate)</option>
            <option value="ib">IB (International Baccalaureate)</option>
            <option value="nios">NIOS (National Institute of Open Schooling)</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-image mr-1 text-orange-600"></i>School Logo <span class="text-xs text-gray-500">(Optional)</span>
          </label>
          <input type="file" id="schoolLogoUpload" accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.svg" class="form-input" onchange="previewSchoolLogo(event)">
          <p class="text-xs text-gray-500 mt-1">Appears on hall ticket • Recommended: 200x200px, PNG/JPG format</p>
          
          <!-- School Logo Preview -->
          <div id="schoolLogoPreview" class="mt-3 hidden">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">School Logo Preview:</span>
              <button type="button" onclick="removeSchoolLogo()" class="text-red-600 hover:text-red-800 text-sm">
                <i class="fas fa-times mr-1"></i>Remove
              </button>
            </div>
            <div class="border-2 border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center justify-center">
              <img id="schoolLogoPreviewImg" src="" alt="School Logo" class="max-h-20 max-w-32 object-contain">
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Insert at the beginning of the form
    formContainer.insertBefore(schoolInfoSection, formContainer.firstChild);
    
    // Update the header to show it's for school students
    const header = document.querySelector('#classCustomization h3');
    if (header) {
      header.innerHTML = '<i class="fas fa-school mr-3 text-orange-600"></i>School Class Information';
    }
  }
}

// Preview uploaded school logo
function previewSchoolLogo(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file!');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const logoPreview = document.getElementById('schoolLogoPreview');
    const logoPreviewImg = document.getElementById('schoolLogoPreviewImg');
    
    // Set the image source
    logoPreviewImg.src = e.target.result;
    
    // Show the preview container
    logoPreview.classList.remove('hidden');
    
    // Store the logo data for PDF generation
    if (typeof schoolLogoData !== 'undefined') {
      schoolLogoData = e.target.result;
    } else {
      window.schoolLogoData = e.target.result;
    }
    
    showSuccess('School logo uploaded successfully!');
  };
  
  reader.readAsDataURL(file);
}

// Remove school logo
function removeSchoolLogo() {
  const logoPreview = document.getElementById('schoolLogoPreview');
  const logoUpload = document.getElementById('schoolLogoUpload');
  const logoPreviewImg = document.getElementById('schoolLogoPreviewImg');
  
  // Clear the file input
  logoUpload.value = '';
  
  // Clear the preview image
  logoPreviewImg.src = '';
  
  // Hide the preview container
  logoPreview.classList.add('hidden');
  
  // Clear the stored logo data
  if (typeof schoolLogoData !== 'undefined') {
    schoolLogoData = null;
  } else if (window.schoolLogoData) {
    window.schoolLogoData = null;
  }
  
  showSuccess('School logo removed!');
}

// Setup table headers specifically for school students
function setupSchoolStudentTableHeaders() {
  const table = document.getElementById('studentTable');
  const headerRow = table.querySelector('thead tr');
  
  if (!headerRow) return;
  
  // Replace headers for school students: S.No, Roll Number, Student Name, Father Name, Admission No, Photo, Subjects...
  headerRow.innerHTML = `
    <th class="excel-cell">S.No</th>
    <th class="excel-cell">Roll Number</th>
    <th class="excel-cell">Student Name</th>
    <th class="excel-cell">Father Name</th>
    <th class="excel-cell">Admission No</th>
    <th class="excel-cell">Photo</th>
    <th class="excel-cell">Subject 1</th>
    <th class="excel-cell">Code 1</th>
    <th class="excel-cell">Subject 2</th>
    <th class="excel-cell">Code 2</th>
    <th class="excel-cell">Subject 3</th>
    <th class="excel-cell">Code 3</th>
    <th class="excel-cell">Subject 4</th>
    <th class="excel-cell">Code 4</th>
    <th class="excel-cell">Subject 5</th>
    <th class="excel-cell">Code 5</th>
  `;
}

// Handle school class selection
function handleSchoolClassSelection() {
  const classSelect = document.getElementById('schoolClassSelect');
  const customClassDiv = document.getElementById('customClassDiv');
  const customClassInput = document.getElementById('customClassInput');
  
  if (!classSelect || !customClassDiv || !customClassInput) return;
  
  if (classSelect.value === 'other') {
    // Show custom class input
    customClassDiv.classList.remove('hidden');
    customClassInput.required = true;
    customClassInput.focus();
    
    // Clear any previous custom input
    customClassInput.value = '';
  } else {
    // Hide custom class input
    customClassDiv.classList.add('hidden');
    customClassInput.required = false;
    customClassInput.value = '';
  }
}

// ============ SCHOOL STUDENTS FUNCTIONS ============

// School levels configuration
const schoolLevels = {
  primary: {
    name: 'Primary School',
    classes: [1, 2, 3, 4, 5],
    icon: 'fas fa-child',
    color: 'pink'
  },
  middle: {
    name: 'Middle School', 
    classes: [6, 7, 8],
    icon: 'fas fa-user-graduate',
    color: 'cyan'
  },
  secondary: {
    name: 'Secondary School',
    classes: [9, 10],
    icon: 'fas fa-book',
    color: 'indigo'
  },
  senior: {
    name: 'Senior Secondary',
    classes: [11, 12],
    icon: 'fas fa-certificate', 
    color: 'emerald'
  }
};

// Handle school level selection
function selectSchoolLevel(level) {
  currentSchoolLevel = level;
  const levelData = schoolLevels[level];
  
  // Show selected level display
  showSelectedSchoolLevelDisplay(levelData);
  
  // Show class selection for this level
  populateSchoolClassCards(levelData);
  
  // Show the class selection section
  document.getElementById('schoolClassSelection').classList.remove('hidden');
}

// Show selected school level display
function showSelectedSchoolLevelDisplay(levelData) {
  const display = document.getElementById('selectedSchoolLevelDisplay');
  const icon = document.getElementById('selectedSchoolIcon');
  const name = document.getElementById('selectedSchoolLevelName');
  const description = document.getElementById('selectedSchoolDescription');
  
  // Update display elements
  icon.className = `${levelData.icon} text-2xl text-${levelData.color}-600 flex-shrink-0`;
  name.textContent = levelData.name;
  description.textContent = `Classes ${levelData.classes[0]} to ${levelData.classes[levelData.classes.length - 1]}`;
  
  // Show the display
  display.classList.remove('hidden');
}

// Populate class cards for selected school level
function populateSchoolClassCards(levelData) {
  const container = document.getElementById('schoolClassCards');
  container.innerHTML = '';
  
  levelData.classes.forEach(classNum => {
    const card = document.createElement('div');
    card.className = `bg-white rounded-xl shadow-lg p-4 card-hover cursor-pointer text-center border-2 border-transparent hover:border-${levelData.color}-500`;
    card.onclick = () => selectSchoolClass(classNum, levelData);
    
    // Add different styling for different levels
    let bgColorClass, textColorClass;
    switch(levelData.color) {
      case 'pink':
        bgColorClass = 'bg-pink-100';
        textColorClass = 'text-pink-600';
        break;
      case 'cyan':
        bgColorClass = 'bg-cyan-100';
        textColorClass = 'text-cyan-600';
        break;
      case 'indigo':
        bgColorClass = 'bg-indigo-100';
        textColorClass = 'text-indigo-600';
        break;
      case 'emerald':
        bgColorClass = 'bg-emerald-100';
        textColorClass = 'text-emerald-600';
        break;
      default:
        bgColorClass = 'bg-gray-100';
        textColorClass = 'text-gray-600';
    }
    
    card.innerHTML = `
      <div class="${bgColorClass} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
        <span class="text-lg font-bold ${textColorClass}">${classNum}</span>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">Class ${classNum}</h3>
      <p class="text-gray-600 text-sm">${getClassDescription(classNum)}</p>
      <div class="mt-3">
        <i class="fas fa-arrow-right ${textColorClass}"></i>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Get class description based on class number
function getClassDescription(classNum) {
  if (classNum <= 5) {
    return 'Basic Education';
  } else if (classNum <= 8) {
    return 'Middle Education';
  } else if (classNum <= 10) {
    return 'Board Preparation';
  } else {
    return 'Higher Secondary';
  }
}

// Select school class
function selectSchoolClass(classNum, levelData) {
  currentClass = {
    number: classNum,
    level: currentSchoolLevel,
    name: `Class ${classNum}`,
    levelName: levelData.name
  };
  
  // Set up school class information
  setupSchoolClassInfo();
  
  // Go directly to hall ticket customization for school students
  showSection('generator');
}

// Setup class information for school students
function setupSchoolClassInfo() {
  // Set class details for school students
  const selectedDetails = document.getElementById('selectedDetails');
  const selectedClassDetails = document.getElementById('selectedClassDetails');
  
  if (selectedDetails) {
    selectedDetails.textContent = `${currentClass.levelName} - ${currentClass.name}`;
  }
  if (selectedClassDetails) {
    selectedClassDetails.textContent = `${currentClass.levelName} - ${currentClass.name}`;
  }
  
  // Update hall ticket customization for school students
  updateSchoolHallTicketSettings();
}

// Update hall ticket settings for school students
function updateSchoolHallTicketSettings() {
  // Use school name if available
  let institutionName = 'SCHOOL EDUCATION BOARD';
  const schoolNameInput = document.getElementById('schoolName');
  if (schoolNameInput && schoolNameInput.value) {
    institutionName = schoolNameInput.value.toUpperCase();
  }
  
  let examTitle = 'SCHOOL EXAMINATION HALL TICKET';
  if (currentClass && currentClass.name) {
    examTitle = `ADMISSION TICKET FOR ${currentClass.name.toUpperCase()} EXAMINATION`;
  }
  
  ticketCustomization.institutionName = institutionName;
  ticketCustomization.examTitle = examTitle;
  
  // Update form fields if they exist
  const institutionInput = document.getElementById('institutionName');
  const examTitleInput = document.getElementById('examTitle');
  
  if (institutionInput && !institutionInput.value) {
    institutionInput.value = ticketCustomization.institutionName;
  }
  if (examTitleInput && !examTitleInput.value) {
    examTitleInput.value = ticketCustomization.examTitle;
  }
}

// Update class information preview
function updateClassPreview() {
  const preview = document.getElementById('classInfoPreview');
  
  const examType = document.getElementById('examType')?.value || 'Mid Term Examination';
  const academicSession = document.getElementById('academicSession')?.value || '2024-2025';
  const semester = document.getElementById('semester')?.value || '1st';
  const examMonthYear = document.getElementById('examMonthYear')?.value || 'June/July 2025';
  const centerCode = document.getElementById('centerCode')?.value || 'GN001';
  const centerName = document.getElementById('centerName')?.value || 'Guru Nanak Dev Engineering College';
  const examTime = document.getElementById('examTime')?.value || '10:00 AM - 1:00 PM';
  const examDuration = document.getElementById('examDuration')?.value || '3 Hours';
  const specialInstructions = document.getElementById('specialInstructions')?.value || '';
  
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  preview.innerHTML = `
    <div class="class-info-preview p-6 bg-white border-2 border-blue-200 rounded-lg">
      <!-- Header -->
      <div class="text-center mb-6 pb-4 border-b-2 border-gray-200">
        <h2 class="text-xl font-bold text-blue-800 mb-2">CLASS INFORMATION PREVIEW</h2>
        <p class="text-gray-600">${
          currentStudentType === 'general' ? (currentCourse?.name || 'Course') :
          currentStudentType === 'school' ? (currentClass?.level || 'School Level') :
          (currentBranch?.name || 'Branch')
        } - ${currentStudentType === 'school' ? (currentClass?.name || 'Class') : (currentYear?.name || 'Year')}</p>
        <p class="text-sm text-gray-500">This information will appear on all hall tickets for this class</p>
      </div>
      
      <!-- Exam Details -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fas fa-calendar-alt mr-2 text-green-600"></i>Examination Details
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div class="flex flex-col">
            <span class="font-medium text-gray-700">Examination Type:</span>
            <span class="text-blue-600 font-semibold">${examType.charAt(0).toUpperCase() + examType.slice(1).replace('-', ' ')}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-700">Academic Session:</span>
            <span class="text-blue-600 font-semibold">${academicSession}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-700">Semester:</span>
            <span class="text-blue-600 font-semibold">${semester.charAt(0).toUpperCase() + semester.slice(1)} Semester</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-700">Exam Month/Year:</span>
            <span class="text-blue-600 font-semibold">${examMonthYear}</span>
          </div>
        </div>
      </div>
      
      <!-- Center & Timing -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fas fa-map-marker-alt mr-2 text-red-600"></i>Center & Timing
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div class="flex flex-col">
            <span class="font-medium text-gray-700">Exam Center Code:</span>
            <span class="text-red-600 font-bold font-mono">${centerCode}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-700">Center Name:</span>
            <span class="text-gray-800 font-semibold">${centerName}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-700">Exam Time:</span>
            <span class="text-green-600 font-semibold font-mono">${examTime}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-700">Duration:</span>
            <span class="text-orange-600 font-semibold">${examDuration}</span>
          </div>
        </div>
      </div>
      
      <!-- School Information for School Students -->
      ${currentStudentType === 'school' && classInformation.schoolInfo ? `
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <i class="fas fa-school mr-2 text-orange-600"></i>School Information
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            ${classInformation.schoolInfo.schoolName ? `
              <div class="flex flex-col">
                <span class="font-medium text-gray-700">School Name:</span>
                <span class="text-orange-600 font-semibold">${classInformation.schoolInfo.schoolName}</span>
              </div>
            ` : ''}
            ${classInformation.schoolInfo.schoolBoard ? `
              <div class="flex flex-col">
                <span class="font-medium text-gray-700">Board/Affiliation:</span>
                <span class="text-orange-600 font-semibold">${classInformation.schoolInfo.schoolBoard.toUpperCase()}</span>
              </div>
            ` : ''}
            ${classInformation.schoolInfo.schoolCode ? `
              <div class="flex flex-col">
                <span class="font-medium text-gray-700">School Code:</span>
                <span class="text-orange-600 font-mono font-bold">${classInformation.schoolInfo.schoolCode}</span>
              </div>
            ` : ''}
            ${classInformation.schoolInfo.schoolLogo ? `
              <div class="flex flex-col">
                <span class="font-medium text-gray-700">School Logo:</span>
                <span class="text-green-600 font-semibold"><i class="fas fa-check mr-1"></i>Uploaded</span>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}
      
      <!-- Instructions -->
      ${specialInstructions ? `
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <i class="fas fa-exclamation-triangle mr-2 text-orange-600"></i>Special Instructions
          </h3>
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
            <div class="text-sm text-yellow-800 whitespace-pre-line">${specialInstructions}</div>
          </div>
        </div>
      ` : ''}
      
      <!-- Footer -->
      <div class="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
        Preview generated on ${dateStr} • This information will appear on all hall tickets
      </div>
    </div>
  `;
}

// Complete the missing JavaScript functions that are called by HTML buttons

// These functions are called by HTML button onclick handlers but were missing

// Initialize the application when DOM is loaded
function initializeApp() {
  console.log('Initializing EduConnect Hall Ticket Generator');
  
  // Load engineering branches from storage or defaults
  loadBranchesFromStorage();
  
  // Initialize the current section
  showSection('home');
  
  // Initialize hall ticket preview if we're in generator section
  if (document.getElementById('hallTicketPreview')) {
    updatePreview();
  }
}

// Make sure all critical functions exist and work
// Some functions might have been cut off or missing from the truncated file

// Ensure showSection function works properly
if (typeof showSection === 'undefined') {
  function showSection(sectionId, skipHistory = false) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      targetSection.classList.add('animate-fadeIn');
    }
    
    // Update navigation history if not skipping
    if (!skipHistory) {
      if (currentSection !== sectionId) {
        if (navigationHistory[navigationHistory.length - 1] !== sectionId) {
          navigationHistory.push(sectionId);
        }
      }
    }
    
    currentSection = sectionId;
    
    // Update back button visibility
    updateBackButtonVisibility();
    
    // Special handling for specific sections
    if (sectionId === 'engineering') {
      populateEngineeringCards();
    } else if (sectionId === 'generator') {
      initializeHallTicketPreview();
    }
  }
}

// Ensure selectStudentType function exists
if (typeof selectStudentType === 'undefined') {
  function selectStudentType(type) {
    console.log('Selected student type:', type);
    currentStudentType = type;
    
    if (type === 'engineering') {
      showSection('engineering');
    } else if (type === 'general') {
      showSection('general');
    } else if (type === 'school') {
      setupSchoolStudentForm();
      showSection('classCustomization');
    }
  }
}

// Ensure updatePreview function exists
if (typeof updatePreview === 'undefined') {
  function updatePreview() {
    console.log('Updating hall ticket preview');
    
    const preview = document.getElementById('hallTicketPreview');
    if (!preview) return;
    
    const institutionName = document.getElementById('institutionName')?.value || 'Institution Name';
    const examTitle = document.getElementById('examTitle')?.value || 'Examination';
    
    // Simple preview update
    preview.innerHTML = `
      <div class="hall-ticket p-6 border-2 border-gray-300 rounded-lg bg-white">
        <div class="text-center mb-4">
          <h1 class="text-xl font-bold text-blue-600">${institutionName}</h1>
          <h2 class="text-lg font-semibold mt-2">HALL TICKET</h2>
          <p class="text-sm mt-1">${examTitle}</p>
        </div>
        <div class="mt-4 p-4 bg-gray-50 rounded">
          <p class="text-sm text-gray-600">Preview - Customize your hall ticket template using the options on the left</p>
        </div>
      </div>
    `;
  }
}

// Ensure mobile menu functions exist
if (typeof toggleMobileMenu === 'undefined') {
  function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenu && menuBtn) {
      const icon = menuBtn.querySelector('i');
      
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('show');
        if (icon) icon.className = 'fas fa-times text-xl';
        document.body.style.overflow = 'hidden';
      } else {
        closeMobileMenu();
      }
    }
  }
}

if (typeof closeMobileMenu === 'undefined') {
  function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenu && menuBtn) {
      const icon = menuBtn.querySelector('i');
      
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('show');
      if (icon) icon.className = 'fas fa-bars text-xl';
      document.body.style.overflow = '';
    }
  }
}

// Ensure error handling functions exist
if (typeof showError === 'undefined') {
  function showError(message, duration = 5000) {
    console.error(message);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    errorDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fas fa-exclamation-circle"></i>
        <span class="text-sm">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, duration);
  }
}

if (typeof showSuccess === 'undefined') {
  function showSuccess(message, duration = 3000) {
    console.log('Success:', message);
    
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    successDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fas fa-check-circle"></i>
        <span class="text-sm">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      if (successDiv.parentElement) {
        successDiv.remove();
      }
    }, duration);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already loaded
  initializeApp();
}

console.log('EduConnect Hall Ticket Generator JavaScript loaded successfully');
