/**
 * Client-side Javascript file - this file are the fucntions used to create the tables and also the fucntions to interact with the tables.
 *
 * @author tmep
 * @date Aug 2018
 * @module static/table
 */

/**
 * @function createHeaders - create title row and filters just for supervisor project
 *@param {string} tableID table to add headers to
 */

function createHeaders(tableID) {
  let table = document.getElementById(tableID);

  let addRow = function(rowID) {
    let tr = document.createElement("tr");
    let addHeaders = function(text, columnNumber) {
      let th = document.createElement("th");
      $(th).addClass("secondaryHeaders");
      $(th).attr("onclick", "sortTable('staffTotalsTable'," + columnNumber + ")");
      let txt = document.createTextNode(text);
      th.appendChild(txt);
      tr.appendChild(th);
    }

    let addFilters = function(id, columnNumber) {
      let th = document.createElement("th");
      let select = document.createElement("SELECT");
      $(select).addClass("filtersT2");
      $(select).attr("id", "staff-" + id);
      $(select).attr("onchange", "filterTable('staffTotalsTable', 'staff-" + id + "'," + columnNumber + ",'.filtersT2')");

      th.appendChild(select);
      tr.appendChild(th);
    }
    let modules = returnUniqueDissModules();
    if (rowID == 0) {

      //Create Headers
      addHeaders("Username", 0);
      addHeaders("First Name", 1);
      addHeaders("Last Name", 2);
      let j = 2;
      // dynmaically add title depending on the number of available modules
      for (var i = 0; i < modules.length; i++) {
        addHeaders(modules[i], i + 3);
        j++
      }
      addHeaders("SH Load", j + 1);
      addHeaders("Total", j + 2);
      addHeaders("Notes", j + 3);
      $('#' + tableID).append(tr);
    } else if (rowID == 1) {
      // CreateFilters
      addFilters("username", 0);
      addFilters("firstName", 1);
      addFilters("lastName", 2);
      let k = 2;
      // dynmaically add filters depending on the number of available modules
      for (var i = 0; i < modules.length; i++) {
        addFilters(modules[i], i);
        k++
      }
      addFilters("sh_load", k + 1);
      addFilters("total", k + 2);
      addFilters("notes", k + 3);
      $('#' + tableID).append(tr);
    }
  }
  // Add title row
  addRow(0);
  // Add filter row
  addRow(1);
}



/**
 * Creating a table using the object. Inspiration taken from David Morrison:https://studres.cs.st-andrews.ac.uk/CS5002/Examples/ExampleSolutionsAssignment3/albums.html
 * @function refreshTable - Updates the forum. Makes a request to the server to get the latest posts
 * @param {object} object - object to display in a table
 * @param {string} tableID - table to refresh
 */

function refreshTable(object, tableID) {

  let table = document.getElementById(tableID);


  // Refresh table, by deleting all rows - this is for the search function
  let rowCount = table.rows.length;
  while (rowCount >= 3) {
    table.deleteRow(-1);
    rowCount--
  }

  let rowID = 0
  let addRow = function(element) {
    let tr = document.createElement("tr");
    $(tr).attr('id', element.username)
    rowID++

    let addCell = function(text, col, tableID) {
      let td = document.createElement("td");
      let txt = document.createTextNode(text);
      td.appendChild(txt);
      tr.appendChild(td);
      $(td).attr("id", "T" + tableID + "C" + rowID + "-" + col);
    };


    /**
     * @function addEditableCell -so user can input data into cell
     * @param {string} text - text if user has already inputted data for this cell
     */
    let addEditableCell = function(text, col, tableID) {
      let td = document.createElement("td");
      let txt = document.createTextNode(text);
      td.appendChild(txt);
      tr.appendChild(td);
      $(td).addClass("editable-" + col);
      $(td).prop('contenteditable', true);
      $(td).attr("id", "T" + tableID + "C" + rowID + "-" + col);

    };

    /**
     * @function addAutocompleteCell -so user can input data into cell with autocomplete functionality
     * @param {string} text - text if user has already inputted data for this cell
     * @param {number} col - which column is it
     * @param {number} tableID - which table is it
     * @param {string} dataSource - which data source to use for autocomplete
     */
    let addAutocompleteCell = function(text, col, tableID, dataSource) {
      let td = document.createElement("td");
      let txt = document.createTextNode(text);
      td.appendChild(txt);
      tr.appendChild(td);
      $(td).addClass("editable-" + col);
      $(td).prop('id', "autocomplete")
      $(td).attr("id", "T" + tableID + "C" + rowID + "-" + col);
      $(td).prop('contenteditable', true);
      // Define a source
      if (dataSource == "supervisors") {
        $(td).autocomplete({
          source: returnFullStaffName()
        })
      } else {
        // dynmaically offers a list of availalble modules
        $(td).autocomplete({
          source: courseCatalogue[dataSource]["dissOptions"]
        })
      }
    };

    if (tableID == "allocationTable") {
      addCell(element.username, "username", 1);
      addCell(element.id, "id", 1);
      addCell(element.firstName, "firstName", 1);
      addCell(element.lastName, "lastName", 1);
      addCell(element.degreeIntention, "degreeIntention", 1);

      // For disscode - the user should be able to change the code if the student is allowed to change module.
      // the user should not be able to change it though if the student can not choose another module

      // find number of availble options for that course
      let degree = element.degreeIntention
      let noDissOptions = courseCatalogue[element.degreeIntention]["dissOptions"].length;
      // If only one option they can not change the dissertation code
      if (noDissOptions == 1) {
        addCell(element.dissCode, "dissCode", 1);
        // If more they can change the course
      } else {
        addAutocompleteCell(element.dissCode, "dissCode", 1, degree);
      }

      addEditableCell(element.projectTitle, "projectTitle", 1);
      addAutocompleteCell(element.supervisor, "supervisor", 1, "supervisors");
      addAutocompleteCell(element.secondSupervisor, "secondSupervisor", 1, "supervisors");
      addAutocompleteCell(element.secondMarker, "secondMarker", 1, "supervisors");
      addEditableCell(element.notes, "notes", 1);
    } else if (tableID == "staffTotalsTable") {
      let modules = returnUniqueDissModules();

      addCell(element.username, "username", 2);
      addCell(element.firstName, "firstName", 2);
      addCell(element.lastName, "lastName", 2);

      let count = 2;
      for (var i = 0; i < modules.length; i++) {
        addCell(element[modules[i]], i + 3, 2);
        count++
      }
      addEditableCell(element['sh_load'], 'sh_load', 2);
      addCell(element['total'], 9, 2);
      addEditableCell(element['notes'], 'notes', 2);
    }
    $('#' + tableID).append(tr);
  };

  /**
   * @function addTotalRows -add Total row at bottom of the respective table
   * @param {number} tableID - which table is it
   */

  function addTotalRows(tableID) {
    let table = document.getElementById(tableID);

    let addRow = function(tableID) {
      let tr = document.createElement("tr");
      let addElement = function(tableID, id, text) {
        let th = document.createElement("th");
        $(th).attr("id", "total-" + tableID + "-" + id);
        let txt = document.createTextNode(text);
        th.appendChild(txt);
        tr.appendChild(th);
        $('#' + tableID).append(tr);
      }
      addElement(tableID, "header", "Total")
      addElement(tableID, "count", table.rows.length)
    }
    addRow(tableID)
  }

  // object.forEach(element => addRow(element));
  Object.entries(object).forEach(
    ([key, value]) => addRow(value)
  );
  addTotalRows(tableID)
  attatchEditEventListening()
  // Update visulisation
  createVisulisation()
}




/**
 * @function arrayOfFilterIDS -  returns an array of the heading ids of all the filters. This is used for dynamically finding the number of headings and is used to adapt the filters
 * @param {array} filterClass The filters to update
 * @returns {array} All the filter ids
 */

function arrayOfFilterIDS(filterClass) {
  let filterIDS = []
  var ids = $(filterClass).map(function() {
    filterIDS.push($(this).attr('id'));
  });
  return filterIDS
}


/**
 * @function addOption - filters table depending on which column one wants to filter. Dynamically adds options to filter.This is taken from https://studres.cs.st-andrews.ac.uk/CS5002/Examples/ExampleSolutionsAssignment3/albums.js
 Next setp - tr and conver to pure JQuery - https://stackoverflow.com/questions/268490/jquery-document-createelement-equivalent
 * @param {string} select - DOM element
 * @param {array} value - array of elements to assign to filter
 * @param {string} text - text to assign to each filter option
 */

function addOption(filterID, value, text) {
  var select = $('#' + filterID)[0]
  let option = document.createElement("option");
  option.value = value;
  option.text = text;
  select.add(option);

}

/**
 * @function removeOptions - remove all filter options for a filter
 * @param {string} filterID - filter to remove all children from
 */

function removeOptions(filterID) {
  let options = $(filterID)
  $(options).children('option').remove();
}

/**
 * @function availableOptions - creates an array of all the available options in a filter
 * @param {object} object - which object to explore
 * @param {string} filterId - DOM element
 */

let availableOptions = function(object, filterId) {
  let dropdownOptions = [];
  // Remove filter id string before dash
  let objectKey = filterId.split('-')[1];

  for (var key in object) {

    var obj = object[key];
    var text = obj[objectKey]

    var naAllocated = false;
    // If entry is blank, say in filter that it is not allocated. Then insert at the end so as to avoid sorting
    if (text === "") {
      text = "Not Allocated"
      naAllocated = true;
    } else {
      // Make text is not already in the filter list
      if (!dropdownOptions.includes(text)) {
        dropdownOptions.push(text);
      }
      // https://www.sitepoint.com/sophisticated-sorting-in-javascript/
      dropdownOptions.sort(function(a, b) {
        var x = a
        y = b

        return x < y ? -1 : x > y ? 1 : 0;
      });
    }
  }
  // Insert at the end to avoid sorting
  if (naAllocated == true) {
    dropdownOptions.unshift("Not Allocated");
  }
  dropdownOptions.unshift("All");
  for (let dropdownOption of dropdownOptions) {
    addOption(filterId, dropdownOption, dropdownOption);
  }
}

/**
 * @function createFilterDropdown -  This is done to break down the procedure of building filters.
 */

function createFilterDropdown() {
  let headersText = arrayOfKeys(projectAllocation);
  let filterIDS = arrayOfFilterIDS(".filtersT1");
  for (var i = 0; i < filterIDS.length; i++) {
    removeOptions("#" + filterIDS[i])
    availableOptions(projectAllocation, filterIDS[i])
  }

  let supervisorHeadersText = arrayOfKeys(facultyStaff);
  let filterIDST2 = arrayOfFilterIDS(".filtersT2");
  for (var i = 0; i < filterIDST2.length; i++) {
    removeOptions("#" + filterIDST2[i])
    availableOptions(facultyStaff, filterIDST2[i], ".filtersT2")
  }
}

// -----------------------------------------------------------------------------------------------------------------------
// Interact with table
// -----------------------------------------------------------------------------------------------------------------------

/**
 * @function sortTable -  Sorting a table by clicking on the headers
 * @param {string} tableID The table to sort
 *  @param {number} column column to sort
 * Future enhancements - add image to click on link an arrow
 */

function sortTable(tableID, column) {

  var table, rows, tableCell, switching, i, x, y, shouldSwitch, direction, switchcount = 0;
  table = document.getElementById(tableID);
  switching = true;
  //Auto setting is ascening
  direction = "asc";
  //Loop until no more switching can take place
  while (switching) {
    switching = false;
    rows = table.rows;
    console.log(rows.length);
    tableCell = $('td');
    // Loop thorugh all rows expcet the headers row
    for (var i = 2; i < rows.length-2; i++) {
      shouldSwitch = false;
      // Compare the two first cells in the chosen column
      x = rows[i].getElementsByTagName("td")[column];
      y = rows[i + 1].getElementsByTagName("td")[column];


      if (direction == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (direction == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      // If switch then swap items and then record that a swtich has been made
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && direction == "asc") {
        direction = "desc";
        switching = true;
      }
    }
  }
}

/**
 * @function searchTable -  Will filter by looking at everthing in the table not just one column.
 * @param {string} tableID The table to search
 * @param {string} filterType Filter class to expplore
 * Inspiration taken from w3 schools - https://www.w3schools.com/howto/howto_js_filter_table.asp
 */

function searchTable(tableID, filterType, searchID) {
  // Declare variables
  var filter, rows, td, i, j;

  let table = document.getElementById(tableID);

  filter = $("#" + searchID).val().toUpperCase();
  rows = table.rows
  headers = $(filterType)

  //Loop through all table rows (avoiding the header & filter row), and hide those who don't match the search query
  for (i = 2; i < rows.length - 1; i++) {
    for (j = 0; j < headers.length; j++) {
      td = rows[i].getElementsByTagName("td")[j];
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        rows[i].style.display = "";
        break
      } else {
        rows[i].style.display = "none";
      }
    }
  }
  updateTotalCount(tableID)
}

/**
 * @function updateTotalCount - Count visible rows
 * @param {string} tableID - table to search
 */

function updateTotalCount(tableID) {
  let table = document.getElementById(tableID);
  let rows = table.rows
  let count = 0;
  for (i = 2; i < rows.length - 1; i++) {
    if (rows[i].style.display != "none") {
      count++
    }
  }
  $('#total-'+tableID+'-count').html(count)
}

/**
 * @function filterTable - filters table depending on which column one wants to filter.
 * @param {string} tableID - table to filter
 * @param {string} filterId - id of the filter being used
 * @param {number} number - column in table
 * @param {string} filterClass - filter class of table
 */

function filterTable(tableID, filterId, number, filterClass) {

  // find all the header ids
  let filterIDS = arrayOfFilterIDS(filterClass)

  // Establish what each  filter has selected
  let filterNumber = []
  for (let i = 0; i < filterIDS.length; ++i) {
    filterNumber[i] = $('#' + filterIDS[i]).val();


    if (filterNumber[i] == "Not Allocated") {
      filterNumber[i] = "";
    }

    let table = document.getElementById(tableID);
    let rows = table.rows

    //Loop through all table rows (avoiding the header & filter row), and hide those who don't match the search query
    for (j = 2; j < rows.length - 1; j++) {
      td = rows[j].getElementsByTagName("td")[i];
      var deleteTrial = rows[j].getElementsByTagName("td")[1]
      // If the row is already displayed and a new filter is added - does it still show the infromation?
      if (rows[j].style.display == "") {
        if (filterNumber[i] === "All") {
          rows[j].style.display = "";
        } else if (td.innerHTML == filterNumber[i]) {
          rows[j].style.display = "";
        } else {
          rows[j].style.display = "none";
        }
        // If the selected row has hidden rows, you can still filter them
      } else if (i == number) {
        if (filterNumber[i] === "All") {
          rows[j].style.display = "";
        } else if (td.innerHTML == filterNumber[i]) {
          rows[j].style.display = "";
        } else {
          rows[j].style.display = "none";
        }
      }
    }
    // Reset all other filters
    updateNotSelectedFilters(filterId, filterClass)
  }
  updateTotalCount(tableID)
}



/**
 * @function updateFilters - dynamically update filter to inputted data in a column
 * @param {string} filterID - this is the filter(s) that has been changed and should display all the options availble
 * @param {string} filterClass - class of filters to update
 */

function updateFilters(filterID, filterClass) {
  var options = $("#" + filterID + " option")
  removeOptions("#" + filterID)

  let filterIDS = arrayOfFilterIDS(filterClass)
  let columnChosen = filterIDS.indexOf(filterID)
  if (filterClass == ".filtersT1") {
    availableOptions(projectAllocation, filterID);
  } else {
    availableOptions(facultyStaff, filterID);
  }
}

/**
 * @function updateNotSelectedFilters - This is for complementary filters - dynamically update the other filters (that have not been altered) to only show the avaible options for that columns
 * @param {array} idNotSelected - this is the filter(s) that has been changed and should display all the options availble
 * @param {array} filterClass - filterclass to update
 */

function updateNotSelectedFilters(idNotSelected, filterClass) {
  // Find filter IDS
  let filterIDs = arrayOfFilterIDS(filterClass)
  // Update all ids that were not selected
  for (filter of filterIDs) {
    if (filter != idNotSelected) {
      updateFilters(filter, filterClass)
    }
  }
}


/**
 * @function insertNewText -  Update projectAllocation or faculy staff Object
 * @param {string} cellID - cellID that needs changing
 * @param {string} col -  which column needs changing
 * @param {string} filterID - cellID that needs changing
 * @param {string} filterClass -  which filter class is it in
 */
function insertNewText(cellID, col, filterID, filterClass) {
  var table = cellID.charAt(1)
  var row = cellID.substring(
    cellID.indexOf("C") + 1,
    cellID.lastIndexOf("-")
  );
  var cell = cellID.substring(
    cellID.lastIndexOf("-") + 1,
  );

  // Change projectAllocation variable to reflect change
  if (table == 1) {
    projectAllocation[$('#T' + table + 'C' + row + "-username").text()][col] = $('#T' + table + 'C' + row + "-" + cell).text();
  } else if (table == 2) {
    facultyStaff[$('#T' + table + 'C' + row + "-username").text()][col] = $('#T' + table + 'C' + row + "-" + cell).text();
  }
  updateFilters(filterID, filterClass)
  createVisulisation();
}

/**
 * @function formatChecking - This is for complementary filters - dynamically update the other filters (that have not been altered) to only show the avaible options for that columns
 * @param {string} cellID - cell ID to examine
 */

function formatChecking(cellID) {
  var table = cellID.charAt(1)
  var row = cellID.substring(
    cellID.indexOf("C") + 1,
    cellID.lastIndexOf("-")
  );
  var cell = cellID.substring(
    cellID.lastIndexOf("-") + 1,
  );

  let staffNames = returnFullStaffName();
  let dissModules = returnUniqueDissModules();

  let input = $('#' + cellID).text();
  let degreeIntention = $('#T' + table + 'C' + row + "-degreeIntention").text();
  let dissOptions = courseCatalogue[degreeIntention]["dissOptions"]

  if (cell == "dissCode") {

    if (dissOptions.includes(input)) {
      $('#' + cellID).css('color', 'black')
    } else {
      $('#' + cellID).css('color', 'red')
    }
  } else {
    if (staffNames.includes(input)) {
      $('#' + cellID).css('color', 'black')
    } else {
      $('#' + cellID).css('color', 'red')
    }
  }
}

/**
 * @function formatCheckAllSupervisors - Check names are valid faculty staff names
 */

function formatCheckAllSupervisors() {
  let table = 1
  let row
  let col = ["supervisor", "secondSupervisor", "secondMarker"];
  let staffNames = returnFullStaffName();
  for (var i = 0; i < col.length; i++) {
    let colName = col[i]
    count = 1;
    for (var projectKey in projectAllocation) {
      let projectObj = projectAllocation[projectKey];
      let name = projectObj[colName]
      let cellID = 'T1C' + count + "-" + colName;
      if (staffNames.includes(name)) {
        $('#' + cellID).css('color', 'black')
      } else {
        $('#' + cellID).css('color', 'red')
      }
      count++
    }
  }
}


/**
 * @function attatchEditEventListening - aware if any text is entered
 */

function attatchEditEventListening() {
  $('.ui-autocomplete-input').focusout(function() {
    formatChecking(this.id)
  });

  $('.editable-dissCode').focusout(function() {
    insertNewText(this.id, "dissCode", "allocation-dissCode", ".filtersT1")
  });

  $('.editable-projectTitle').focusout(function() {
    insertNewText(this.id, "projectTitle", "allocation-projectTitle", ".filtersT1")
  });


  $('.editable-supervisor').focusout(function() {
    insertNewText(this.id, "supervisor", "allocation-supervisor", ".filtersT1")
  });


  $('.editable-secondSupervisor').focusout(function() {
    insertNewText(this.id, "secondSupervisor", "allocation-secondSupervisor", ".filtersT1")
  });

  $('.editable-secondMarker').focusout(function() {
    insertNewText(this.id, "secondMarker", "allocation-secondMarker", ".filtersT1")
  });

  $('.editable-notes').focusout(function() {
    insertNewText(this.id, "notes", "allocation-notes", ".filtersT1")
  });

  $('.editable-sh_load').focusout(function() {
    insertNewText(this.id, "sh_load", "staff-sh_load", ".filtersT2")
  });

  $('.editable-notes').focusout(function() {
    insertNewText(this.id, "notes", "staff-notes", ".filtersT2")
  });
}
