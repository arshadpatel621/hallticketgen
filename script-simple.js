// Simplified script.js without authentication

console.log('Simplified script loaded');

// Simple utility functions
function showSuccess(message) {
  console.log('Success:', message);
  // In a real implementation, you might show a toast notification
}

function showError(message) {
  console.error('Error:', message);
  // In a real implementation, you might show an error toast notification
}

// Navigation functions
function showDashboard() {
  hideAllSections();
  document.getElementById('dashboardSection').classList.remove('hidden');
  updateActiveNav('Dashboard');
}

function showBranches() {
  hideAllSections();
  document.getElementById('branchesSection').classList.remove('hidden');
  updateActiveNav('Branches');
}

function showClasses() {
  hideAllSections();
  document.getElementById('classesSection').classList.remove('hidden');
  updateActiveNav('Classes');
}

function showStudents() {
  hideAllSections();
  document.getElementById('studentsSection').classList.remove('hidden');
  updateActiveNav('Students');
}

function showHallTickets() {
  hideAllSections();
  document.getElementById('hallTicketsSection').classList.remove('hidden');
  updateActiveNav('Hall Tickets');
}

function showSettings() {
  alert('Settings would open here');
}

function hideAllSections() {
  document.querySelectorAll('.section-content').forEach(section => {
    section.classList.add('hidden');
  });
}

function updateActiveNav(activeText) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('bg-blue-50', 'text-blue-700');
    link.classList.add('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-50');
  });
  
  // Find and activate the correct nav link
  const activeLink = Array.from(document.querySelectorAll('.nav-link')).find(link => 
    link.textContent.trim() === activeText);
  if (activeLink) {
    activeLink.classList.remove('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-50');
    activeLink.classList.add('bg-blue-50', 'text-blue-700');
  }
}

// Mock data loading functions
function loadDashboardStats() {
  // In a real implementation, these would come from API calls
  document.getElementById('branchCount').textContent = '0';
  document.getElementById('classCount').textContent = '0';
  document.getElementById('studentCount').textContent = '0';
  document.getElementById('ticketCount').textContent = '0';
}

function loadBranches() {
  document.getElementById('branchesList').innerHTML = '<p class="text-gray-500 text-center py-8">Branch management interface would appear here</p>';
}

function loadClasses() {
  document.getElementById('classesList').innerHTML = '<p class="text-gray-500 text-center py-8">Class management interface would appear here</p>';
}

function loadStudents() {
  document.getElementById('studentsList').innerHTML = '<p class="text-gray-500 text-center py-8">Student management interface would appear here</p>';
}

function showAddBranchModal() {
  alert('Add branch modal would open here');
}

function showAddClassModal() {
  alert('Add class modal would open here');
}

function showAddStudentModal() {
  alert('Add student modal would open here');
}

function showImportStudentsModal() {
  alert('Import students modal would open here');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  console.log('App initialized without authentication');
  showDashboard();
  loadDashboardStats();
});