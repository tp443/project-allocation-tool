/**
 * client-side Javascript file - this initilises the page
 *
 * @author tmep
 * @date Apr 2018
 * @module static/client
 */

// -----------------------------------------------------------------------------------------------------------------------
// Navigation Bar Hyperlinks
// -----------------------------------------------------------------------------------------------------------------------

/**
 * @function showImportPage - reveal the import Page and hide other pages
 */

function showImportPage() {
  $('.active').removeClass("active")
  $('#importDataNav').addClass("active")
  $('#importPage').show();
  $('#visulisationPage').hide();
  $('#projectAllocationPage').hide();
  $('#facultyStaffPage').hide();
  $('#searchAllocation').hide();
  $('#searchSupervisors').hide();
}

/**
 * @function showVisulisationPage - reveal the visulisation Page and hide other pages
 */

function showVisulisationPage() {
  let table = document.getElementById("allocationTable");
  let rows = table.rows.length
  // Hide filters if empty table
  if (rows < 3) {
    $('#visulisations').hide();
  } else {
    $('#visulisations').show();
  }
  $('.active').removeClass("active")
  $('#visulisationNav').addClass("active")
  $('#importPage').hide();
  $('#visulisationPage').show();
  $('#projectAllocationPage').hide();
  $('#facultyStaffPage').hide();
  $('#searchAllocation').hide();
  $('#searchSupervisors').hide();
}

/**
 * @function showProjectAllocationPage - reveal the Project Allocation Page and hide other pages
 */

function showProjectAllocationPage() {
  let table = document.getElementById("allocationTable");
  let rows = table.rows.length
  // Hide filters if empty table
  if (rows < 3) {
    $('#allocationTable').hide();
  } else {
    $('#allocationTable').show();
  }
  $('.active').removeClass("active")
  $('#allocationNav').addClass("active")
  $('#importPage').hide();
  $('#visulisationPage').hide();
  $('#projectAllocationPage').show();
  $('#facultyStaffPage').hide();
  $('#searchAllocation').show();
  $('#searchSupervisors').hide();
}

/**
 * @function showFacultyStaffPage - reveal the Faculty Staff totals Page and hide other pages
 */

function showFacultyStaffPage() {
  let table = document.getElementById("allocationTable");
  let rows = table.rows.length
  // Only count projects if their is information in allocation table
  if (rows < 3) {} else {
    countProjectsPerSupervisor();
  }
  $('.active').removeClass("active")
  $('#staffNav').addClass("active")
  $('#importPage').hide();
  $('#visulisationPage').hide();
  $('#projectAllocationPage').hide();
  $('#searchAllocation').hide();
  $('#searchSupervisors').show();
  $('#facultyStaffPage').show();
}

/**
 * @function initialisationObjects - Create object. See creatingObjects.js file
 */

function initialisationObjects() {
  createUserNameDictionary(studentImport, facultyStaffImport)
  // Create objects
  createStaffObject()
  createStudentObject()
  createModuleObject()
  createProjectAllocationObject()
  assignCourseCodes()
}

/**
 * @function initialisationTable - Refresh Table
 */

function initialisationTable() {
  // Create tables
  createHeaders("staffTotalsTable")
  refreshTable(projectAllocation, "allocationTable")
  // Counts and build supervisor table
  countProjectsPerSupervisor();
  createFilterDropdown();
}



$(document).ready(function() {
  // Hide validation emssages
  $('.successOrNot').hide();
  $('.alert-success').hide();

  // Hide search bars
  $('#searchAllocation').hide();
  $('#searchSupervisors').hide();

  // Hide other pages
  $('#importPage').show();
  // Hide Add rows
  $('#addRows').hide()

  $('#facultyStaffPage').hide();
  $('#visulisationPage').hide();
  $('#projectAllocationPage').hide();
});
