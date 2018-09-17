/**
 * client-side Javascript file - this initilises the objects which and the methods to manipulate them
 *
 * @author tmep
 * @date Aug 2018
 * @module static/creatingObjects
 */

// -----------------------------------------------------------------------------------------------------------------------
// Global objects
// -----------------------------------------------------------------------------------------------------------------------

const csCoursesImport = JSON.parse(compSciCourses);
const csCourseTitlesImport = JSON.parse(dissertionOptionTitles);


// Import from JSON files
var facultyStaffImport;
var studentImport;
// Used for validation of CSV input
var csvSupervisorHeaders = ["Engagement no", "Staff ID", "Username", "Title", "Given names", "Family name", "Email"]
var csvStudentHeaders = ["Engagement no", "Student ID", "Username", "Title", "Given names", "Family name", "Email", "Date of birth", "Full/part time", "Registration status", "Qualification awarded", "Class awarded", "Faculty", "Student type", "Programme name", "Degree intention", "Degree intention (code)", "Last School"]

// 4 different objects which will be used throughout the programme
var students = [];
var facultyStaff = [];
var projectAllocation = [];
var courseCatalogue = [];

// Dictionaries
var studentUsernameDictionary = [];
var supervisorUsernameDictionary = [];

// -----------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------


/**
 * @function createUserNameDictionary - Makes a dictionary of all the usernames for  students and staff
 * @param {array} studentArray - array to extract all usernames from for students
 * @param {array} staffArray - array to extract all usernames from for staff
 */
function createUserNameDictionary(studentArray, staffArray) {
  for (student in studentArray)
    studentUsernameDictionary.push(studentArray[student]["Username"]);
  for (staff in staffArray)
    supervisorUsernameDictionary.push(staffArray[staff]["Username"]);
}


// Create 4 objects using a key as a foreign jey alognsdie methods that will return specfic arrays
// -----------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------

/**
 * @function createStaffObject - Makes an object showing all the staff members in CS with the keys being usernames
 */
function createStaffObject() {
  let availableModules = returnUniqueDissModules()

  for (var i = 0; i < supervisorUsernameDictionary.length; i++) {
    // Default labels
    facultyStaff[supervisorUsernameDictionary[i]] = {
      username: facultyStaffImport[i]['Username'],
      firstName: facultyStaffImport[i]['Given names'],
      lastName: facultyStaffImport[i]['Family name'],
      fullName: facultyStaffImport[i]['Given names'] + " " + facultyStaffImport[i]['Family name'],
    }

    // Dynamic labels - changes depending on the number of modules available
    for (var j = 0; j < availableModules.length; j++) {
      facultyStaff[supervisorUsernameDictionary[i]][availableModules[j]] = ""
    }

    // Default labels
    facultyStaff[supervisorUsernameDictionary[i]]["sh_load"] = "";
    facultyStaff[supervisorUsernameDictionary[i]]["total"] = "";
    facultyStaff[supervisorUsernameDictionary[i]]["notes"] = "";
  }
}

/**
 * @function createModuleObject - Makes an object showing all the available modules in the CS faculty. the title of the module is the key
 */
function createModuleObject() {
  for (var i = 0; i < csCoursesImport.length; i++) {
    // Import Extra fields
    courseCatalogue[csCoursesImport[i]["title"]] = csCoursesImport[i];
  }
}



/**
 * @function createStudentObject - Makes an object showing all the students in CS with the keys being usernames
 */

function createStudentObject() {
  for (var i = 0; i < studentUsernameDictionary.length; i++) {
    // Import Extra fields
    students[studentUsernameDictionary[i]] = {
      username: studentImport[i]['Username'],
      id: studentImport[i]['Student ID'],
      firstName: studentImport[i]['Given names'],
      lastName: studentImport[i]['Family name'],
      degreeIntention: studentImport[i]['Degree intention'],
      dissCode: "",
      projectTitle: "",
      supervisor: "",
      secondSupervisor: "",
      secondMarker: "",
      notes: ""
    }
  }
}


/**
 * @function createProjectAllocationObject - Makes an object with the keys being usernames
 */
function createProjectAllocationObject() {
  for (var i = 0; i < studentUsernameDictionary.length; i++) {
    // Import Extra fields
    projectAllocation[studentUsernameDictionary[i]] = {
      username: studentImport[i]['Username'],
      id: studentImport[i]['Student ID'],
      firstName: studentImport[i]['Given names'],
      lastName: studentImport[i]['Family name'],
      degreeIntention: studentImport[i]['Degree intention'],
      dissCode: "",
      projectTitle: "",
      supervisor: "",
      secondSupervisor: "",
      secondMarker: "",
      notes: ""
    };
  }
}

// -----------------------------------------------------------------------------------------------------------------------
// Methods interacting with these objects
// -----------------------------------------------------------------------------------------------------------------------

/**
 * @function assignCourseCodes - Allocate first possible dissertation code. The json file is set up that the most likely dissertation topic for that student is first i.e AI would be CS5099
 */
function assignCourseCodes() {

  for (var key in projectAllocation) {
    let obj = projectAllocation[key];
    let course = obj.degreeIntention;
    let code = courseCatalogue[course]["dissOptions"][0];
    projectAllocation[key]["dissCode"] = code;
  }
}


/**
 * @function returnUniqueDissModules -Reutrn all possible dissertation codes
 * @return {array} all avaible dissertation topics
 */
function returnUniqueDissModules() {
  var dissertationModules = [];
  Object.entries(courseCatalogue).forEach(
    ([key, value]) => dissertationModules.push(value)
  );

  let unique = [];
  for (var i = 0; i < dissertationModules.length; i++) {
    let options = dissertationModules[i].dissOptions;
    for (var j = 0; j < dissertationModules[i].dissOptions.length; j++) {
      let option = dissertationModules[i].dissOptions[j];
      if (!unique.includes(option)) {
        unique.push(option);
      }
    }
  }
  return unique
}


/**
 * @function arrayOfKeys - access the usernames which are used as keys
 * @param {object} object Either staff or project allocation table
 * @returns {array} All the keys of the object
 */

function arrayOfKeys(object) {
  keys = [];
  for (var key in object) {
    var obj = object[key];
    for (var property in obj) {
      if (!keys.includes(property)) {
        keys.push(property);
      }
    }
  }
  return keys
}


/**
 * @function returnFullStaffName - Returns a list of all names for supervisors for auto complete section. Will be useful for displaying supervisor page
 * @returns {array} - list of all full names
 */

function returnFullStaffName() {
  let result = [];
  for (var supervisor in facultyStaff) {
    result.push(
      facultyStaff[supervisor]["firstName"] + " " + facultyStaff[supervisor]['lastName']
    )
  }
  return result
}

/**
 * @function countProjectsPerSupervisor - count number of projects per supervisor in project allocation and then assign them to the facultyStaff object. Then build the supervior table
 */
function countProjectsPerSupervisor() {


  for (var staffKey in facultyStaff) {
    let staffObj = facultyStaff[staffKey]

    /**
     * @function numberOfProjectPerSupervisor - count number of projects for a module for that staff member
     * @param {string} code Dissertation code student is studying
     *@return {number} count for staff member as a supervisor
     */
    function numberOfProjectPerSupervisor(code) {

      let count = 0;

      for (var projectKey in projectAllocation) {
        let projectObj = projectAllocation[projectKey];

        let superviorText = projectObj["supervisor"]
        let dissCodeText = projectObj["dissCode"]
        let fullName = staffObj["firstName"] + " " + staffObj['lastName'];
        if (fullName == superviorText && code == dissCodeText) {
          count++
        }
      }
      return parseInt(count)
    }

    // Cycle through each available module a staff member could be a supoerviosr in
    let availableModules = returnUniqueDissModules();
    let sum = 0;
    for (var i = 0; i < availableModules.length; i++) {
      facultyStaff[staffKey][availableModules[i]] = numberOfProjectPerSupervisor(availableModules[i]);
      sum += staffObj[availableModules[i]]
    }
    staffObj["total"] = sum;
  }
  // Update table
  refreshTable(facultyStaff, "staffTotalsTable")
  createFilterDropdown();

}


/**
 * @function checkMissingRows - Compare CSV file to project Allocation object
 * @param {string} objectName Object name to check
 * @param {object}  object Object to check
 * @param {string}  newStudentData Data set to check
 */

function checkMissingRows(objectName, object, newStudentData) {
  /**
   * @function addRow - add new entry to project allocation
   * @param {string}
   */
  function addRow(object, rowData) {
    let availableModules = returnUniqueDissModules()
    if (objectName == "projectAllocation") {
      object[rowData['Username']] = {
        username: rowData['Username'],
        id: rowData['Student ID'],
        firstName: rowData['Given names'],
        lastName: rowData['Family name'],
        degreeIntention: rowData['Degree intention'],
        dissCode: "",
        projectTitle: "",
        supervisor: "",
        secondSupervisor: "",
        secondMarker: "",
        notes: ""
      }
      assignCourseCodes()
    } else if (objectName == "facultyStaff") {
      // Default labels
      object[rowData['Username']] = {
        username: rowData['Username'],
        firstName: rowData['Given names'],
        lastName: rowData['Family name'],
        fullName: rowData['Given names'] + " " + rowData['Family name'],
      }

      // Dynamic labels - changes depending on the number of modules available
      for (var j = 0; j < availableModules.length; j++) {
        object[rowData['Username']][availableModules[j]] = ""
      }
      // Default labels
      object[rowData['Username']]["sh_load"] = "";
      object[rowData['Username']]["total"] = "";
      object[rowData['Username']]["notes"] = "";
    }
  }


  /**
   * @function deleteRow - delete  entry in project allocation
   * @param {string}
   */
  function deleteRow(object, username) {
    let tableRow = $('#' + username).remove();
    delete object[username]
  }

  // check if thier is a new name
  var nameAdded = [];
  for (var i = 0; i < newStudentData.length; i++) {
    var needToAdd = true;
    let incomingCSVUsername = newStudentData[i]['Username']
    for (var key in object) {
      if (key == incomingCSVUsername) {
        needToAdd = false;
      }
    }
    if (needToAdd === true) {
      nameAdded.push(incomingCSVUsername)
      addRow(object, newStudentData[i]);
    }
  }

  // Check if name is no longer required
  var nameDeleted = [];
  for (var key in object) {
    var needToDeleteRow = true;
    for (var i = 0; i < newStudentData.length; i++) {
      let incomingCSVUsername = newStudentData[i]['Username']
      if (key == incomingCSVUsername) {
        needToDeleteRow = false;
      }
    }
    if (needToDeleteRow === true) {
      nameDeleted.push(key)
      deleteRow(object, key)
    }
  }
  // Alert message
  if (nameAdded.length > 0 || nameDeleted.length > 0) {
    alert("Usernames added: " + nameAdded.toString() + "\nDeleted Username: " + nameDeleted.toString())
    refreshTable(projectAllocation, "allocationTable")
    countProjectsPerSupervisor();
    formatCheckAllSupervisors();
    createFilterDropdown();
  } else {
    alert("There were no new entries to add")
  }
}
