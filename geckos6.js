/*******************************************
********************************************
**  AUTHOR:  Team Geckos-6
** PROJECT:  Chingu Voyage 3
**    DATE:  Dec 2017-Jan 2018
** VERSION:  1.10
********************************************
*******************************************/

const geckos6AppModule = (function() {

  const cacheDom = {
    shift1: document.getElementsByClassName('shift1'),
    shift2: document.getElementsByClassName('shift2'),
    shift3: document.getElementsByClassName('shift3'),
    shift4: document.getElementsByClassName('shift4'),
    shift5: document.getElementsByClassName('shift5'),
    shift6: document.getElementsByClassName('shift6'),
    shift7: document.getElementsByClassName('shift7'),
    line: document.getElementsByClassName('line'),
    schedule: document.getElementById('schedule'),
    main: document.getElementsByTagName('main')[0],
    settings: document.getElementById('settings'),
    settingsInput: document.getElementById('settings-input'),
    aside: document.getElementsByTagName('aside')[0],
    showMenu: document.getElementById('show-menu'),
    hideMenu: document.getElementById('hide-menu'),
    settingsButtons: document.querySelectorAll('#settings > button'),
    employeeObject: document.getElementById('employee-object'),
    timeTableObject: document.getElementById('timetable-object'),
    assignedShiftsObject: document.getElementById('assigned-shifts-object'),
    scroll: document.getElementsByClassName('scroll-texts'),
    effect1: document.getElementById('effect1'),
    shiftAll: document.querySelectorAll('[class*="shift"]'),
    emplName: document.getElementById('employee-name'),
    availDays: document.getElementById('avail-days'),
    maxHours: document.getElementById('max-hours'),
    addEmployee: document.getElementById('add-employee'),
    businessDay: document.getElementById('business-day'),
    open: document.getElementById('open'),
    close: document.getElementById('close'),
    paragraph1: document.getElementById('paragraph1'),
    paragraph2: document.getElementById('paragraph2'),
    paragraph3: document.getElementById('paragraph3'),
    demo: document.getElementById('demo'),
    createSchedule: document.getElementById('create-schedule'),
    saveAll: document.getElementById('save-all'),
    clearAll: document.getElementById('clear-all'),
    numShifts: document.getElementById('num-shifts'),
    addBusinessDay: document.getElementById('add-business-day')
  };


  /*****************************************
   Schedule Maker algorithm:
  *****************************************/

  // variables setup:
  var employeeArr1 = [];
  var employeeArr2 = [];
  var employeeArr3 = [];
  var shiftsArr1 = [];
  var shiftsArr2 = [];
  var assignedShiftsObj1 = {};
  var assignedShiftsObj2 = {};

  // Sample employees object in external file named 'demoObjects.js'

  // create initial array of employee names with a repeat for every number of possible shifts:
  // identifier: 00-00-00-0-name-[avail]
  // first pair of digits: index
  // second pair of digits: iteration position of names
  // third pair of digits: max # of shifts employee can work
  // single digit after 3 pairs: # of weekdays available
  const employeeArr1Maker = function() {
    let empl = Object.keys(employees);
    let shiftLength = 4; // hours
    empl.forEach(function(name, index) {
      // console.log(x, employees[x].maxHours);
      let a = index.toString().padStart(2, '0');
      let numShiftsAvail = employees[name].maxHours / shiftLength;
      let b = numShiftsAvail.toString().padStart(2, '0');
      let numDaysAvail = employees[name].avail.length;
      let daysAvail = employees[name].avail.join('-');
      for (let i = 0; i < numShiftsAvail; i++) {
        let identifier;
        let c = i.toString().padStart(2, '0');
        identifier = `${a}-${c}-${b}-${numDaysAvail}-`;
        employeeArr1.push(identifier + name + '-' + daysAvail);
      }
    });
  };

  // Sort array of employee names so that they rotate:
  // 1st sort: second pair of digits: iteration position of names (index 3,4)
  // 2nd sort: single digit after 3 pairs: # of weekdays available (index 9)
  // 3rd sort: third pair of digits: max # of shifts employee can work (index 6,7)
  const employeeArr2Maker = function() {
    employeeArr2 = [...employeeArr1];
    employeeArr2.sort(function(a, b) {
      let alpha, bravo;
      if ( a.substr(3, 2) === b.substr(3, 2) ) {
        if ( a.substr(9, 1) === b.substr(9, 1) ) {
          alpha = a.substr(6, 2);
          bravo = b.substr(6, 2);
          return alpha - bravo;
        }
        else {
          alpha = a.substr(9, 1);
          bravo = b.substr(9, 1);
          return alpha - bravo;
        }
      }
      else {
        alpha = a.substr(3, 2);
        bravo = b.substr(3, 2);
        return alpha - bravo;
      }
    });
  };

  // cleanup array of employee names (removes sorting data):
  const employeeArr3Maker = function() {
    employeeArr3 = employeeArr2.map(function(x) {
      y = x.slice(11, x.length);
      return y;
    });
  };

  // create initial array of shift slots (creates sub-arrays):
  const shiftsArr1Maker = function(nameNum) {
    let weekdays = Object.keys(timetable);
    // console.log(weekdays);
    weekdays.forEach(function(weekday, index) {
      // console.log(x, 'open: ', timetable[x].open, 'close: ', timetable[x].close);
      // let weekday = timetable[x];
      let day = weekday;
      nameNum === 'num' ? day = index + 1 : null;
      let open = timetable[weekday].open;
      let close = timetable[weekday].close;
      let staffRequired = timetable[weekday].staffRequired;
      // console.log(staffRequired);
      let dayLength = close - open;
      let start = open;
      let timeSlots = [];
      var timeSlot1, timeSlot2, timeSlot3, timeSlot4;
      if ( dayLength < 8 ) {
        timeSlot1 = `${index + 1}-${day} ${start} to ${close}`;
        for ( let i = 0; i < staffRequired; i++ ) {
          timeSlots.push(timeSlot1);
        }
      }
      else if ( dayLength >=8 && dayLength < 12 ) {
        timeSlot1 = `${index + 1}-${day} ${start} to ${start+4}`;
        timeSlot2 = `${index + 1}-${day} ${start+4} to ${close}`;
        for ( let i = 0; i < staffRequired; i++ ) {
          timeSlots.push(timeSlot1, timeSlot2);
        }
      }
      else if ( dayLength >=12 && dayLength < 16 ) {
        timeSlot1 = `${index + 1}-${day} ${start} to ${start+4}`;
        timeSlot2 = `${index + 1}-${day} ${start+4} to ${start+8}`;
        timeSlot3 = `${index + 1}-${day} ${start+8} to ${close}`;
        for ( let i = 0; i < staffRequired; i++ ) {
          timeSlots.push(timeSlot1, timeSlot2, timeSlot3);
        }
      }
      else if ( dayLength >=16 && dayLength < 20 ) {
        timeSlot1 = `${index + 1}-${day} ${start} to ${start+4}`;
        timeSlot2 = `${index + 1}-${day} ${start+4} to ${start+8}`;
        timeSlot3 = `${index + 1}-${day} ${start+8} to ${start+12}`;
        timeSlot4 = `${index + 1}-${day} ${start+12} to ${close}`;
        for ( let i = 0; i < staffRequired; i++ ) {
          timeSlots.push(timeSlot1, timeSlot2, timeSlot3, timeSlot4);
        }
      }
      shiftsArr1.push(timeSlots);
    });
  };

  // cleanup array of shift slots (remove sub-arrays):
  const shiftsArr2Maker = function() {
    let lgt1 = shiftsArr1.length;
    for ( let i = 0; i < lgt1; i++ ) {
      let lgt2 = shiftsArr1[i].length;
      for ( let j = 0; j < lgt2; j++ ) {
        shiftsArr2.push(shiftsArr1[i][j]);
      }
    }
  };

  // assign employee names for every shift slot
  // stops when it runs out of shifts or names, whichever comes first:
  const assignedShiftsObj1Maker = function() {
    let lgt;
    if ( employeeArr3.length > shiftsArr2.length ) {
      lgt = shiftsArr2.length;
    }
    else {
      lgt = employeeArr3.length;
    }
    for ( let i = 0; i < lgt; i++ ) {
      assignedShiftsObj1[i + '. ' + shiftsArr2[i]] = employeeArr3[i];
    }
  };

  // Final Shift Assigner function:
  const assignedShiftsObj2Maker = function(edit) {
    let lgt;
    if ( employeeArr3.length > shiftsArr2.length ) {
      lgt = shiftsArr2.length;
    }
    else {
      lgt = employeeArr3.length;
    }
    // console.log('employeeArr3 before: ', employeeArr3);
    // console.log('employeeArr3 length before: ', employeeArr3.length);
    for ( let i = 0; i < lgt; i++ ) {
      let num = shiftsArr2[i].charAt(0);
      // console.log(num, typeof num);
      let search = new RegExp(num);
      // employee match function:
      let rule = function(element, index) {
        if ( element.match(search) ) {
          return element;
        }
      }
      let remove1;
      let shift = shiftsArr2[i];
      let empl = employeeArr3.find(function(element, index) {
        remove1 = index;
        // console.log(remove1, i);
        return element.match(search);
      });
      let j = (i + 1).toString().padStart(2, '0');
      if ( edit === 'edit' ) {
        empl = empl.match(/[A-Za-z]+/g).join(' ');
        shift = shift.substring(2, shift.length);
      }
      assignedShiftsObj2[j + ' ' + shift] = empl;
      let remove2 = employeeArr3.indexOf(empl);
      employeeArr3.splice(remove1, 1);
    }
  };


  /*****************************************
   Create Objects from menu settings:
  *****************************************/

  // functions for pulling data from settings menu:
  const createEmployees = function(name, maxHours, avail) {
      let employeeName = name;
      employees[employeeName] = { maxHours, avail };
  };

  const createTimetable = function(day, open, close, staffRequired) {
    timetable[day] = {};
    timetable[day].open = Number(open);
    timetable[day].close = Number(close);
    timetable[day].staffRequired = Number(staffRequired);
    console.log(timetable);
    cacheDom.createSchedule.removeAttribute('disabled');
  };

  // create array of employee's available days: //ZZ
  function getAvailDays() {
    let weekdays = cacheDom.availDays.childNodes;
    let checkboxes = [];
    weekdays.forEach(function(node) {
      // console.log(node);
      if ( node.type === 'checkbox' ) {
        if ( node.checked ) {
          checkboxes.push(Number(node.value));
        }
      }
    });
    console.log('checkboxes: ', checkboxes);
    return checkboxes;
  }


  /*****************************************
   run all scheduling functions:
  *****************************************/

  const createAll = function() {
    employeeArr1Maker();
    employeeArr2Maker();
    employeeArr3Maker();
    shiftsArr1Maker('num');
    shiftsArr2Maker();
    assignedShiftsObj1Maker();
    assignedShiftsObj2Maker('edit'); // cleanup result
  };

  const clearAll = function() {
    employees = {};
    timetable = {};
    employeeArr1 = [];
    employeeArr2 = [];
    employeeArr3 = [];
    shiftsArr1 = [];
    shiftsArr2 = [];
    assignedShiftsObj1 = {};
    assignedShiftsObj2 = {};
    displayEmplObj();
    displayTimetableObj();
    displayAssignedShiftsObj();
    eraseShiftBars();
    hideEmptyShiftBars();
    cacheDom.demo.removeAttribute('disabled');
    cacheDom.clearAll.setAttribute('disabled', true);
    cacheDom.paragraph1.innerHTML = "";
    cacheDom.paragraph2.innerHTML = "";
    };


  /*****************************************
   Display employee object to menu page:
  *****************************************/

  const displayEmplObj = function() {
    let text = '';
    Object.keys(employees).forEach(function(name) {
      let maxHours = employees[name].maxHours;
      let avail = employees[name].avail;
      text += `<ins>${name}</ins>: &nbsp&nbsp max hours: ${maxHours} / avail: ${avail}</br>`;
    });
    cacheDom.paragraph1.innerHTML = text;
  };


  /*****************************************
   Display timetable object to menu page:
  *****************************************/

  const displayTimetableObj = function() {
    let text = '';
    Object.keys(timetable).forEach(function(day) {
      let open = timetable[day].open;
      let close = timetable[day].close;
      let staffRequired = timetable[day].staffRequired;
      text += `<ins>${day}</ins>: &nbsp&nbsp open: ${open} / close: ${close} / staff required per shift: ${staffRequired}</br>`;
    });
    cacheDom.paragraph2.innerHTML = text;
  };



  /*****************************************
   Display assigned shifts object to menu page:
  *****************************************/

  const displayAssignedShiftsObj = function() {
    let text = '';
    for ( var shift in assignedShiftsObj2 ) {
      let name = assignedShiftsObj2[shift];
      text += `<ins>${shift}</ins>: &nbsp&nbsp ${name}</br>`;
    };
    cacheDom.paragraph3.innerHTML = text;
  };


  /*****************************************
   Distribute shifts on schedule grid
   by manipulating shift bars from
   info extracted from assignedShiftsObj2:
  *****************************************/

  // Create schedule grid bars for all shifts:
  function positionShiftBar(element, start, end) {
    let hour = 100 / 15;
    let shiftLength = end - start;
    let barLeft = hour * (start - 7);
    let barWidth = hour * shiftLength;
    element.style.left = `${barLeft}%`;
    element.style.width = `${barWidth}%`;
  }

  function nameShiftBar(element, employee, start, end) {
    start < 12 ? start+= 'am' :
    start === 12 ? start = 'noon' :
    start > 12 ? start = start - 12 + 'pm':
    null;
    end < 12 ? end+= 'am' :
    end === 12 ? end = 'noon' :
    end > 12 ? end = end - 12 + 'pm':
    null;
    element.innerHTML = `${employee}:  &nbsp &nbsp ${start} to ${end}`;
  }

  function createShiftBars() {
    let obj = assignedShiftsObj2;
    let dayIndex = 1;
    let shiftIndex = 1;
    // let newDay = false;
    for ( var shift in obj ) {
      let employee = obj[shift];
      // console.log(employee);
      // console.log(obj);
      let start = shift.split(' ')[2];
      let end = shift.split(' ')[4];
      let day = shift.split(' ')[1];
      if ( day > dayIndex ) {
        shiftIndex = 1;
        dayIndex++
      }
      // console.log(day);
      let id = `#day${day}`;
      let shiftBar = `.shift${shiftIndex}`;
      // console.log(div.childNodes[1]);
      let element = document.querySelector(id).querySelector(shiftBar);
      // console.log(element);
      positionShiftBar(element, start, end);
      nameShiftBar(element, employee, start, end);
      shiftIndex++;
    }
  }

  // Remove shift bars if unused:
  function hideEmptyShiftBars(reset) {
    cacheDom.shiftAll.forEach(function(node) {
      if ( reset === 'yes' ) {
        if ( node.nodeType === 1 ) {
          node.style.visibility = 'visible';
        }
      }
      else {
        if ( node.nodeType === 1 ) {
          if ( !node.style.width ) {
            node.style.visibility = 'hidden';
          }
        }
      }
    });
  };

  hideEmptyShiftBars(); // run it once at start

  function eraseShiftBars() {
    cacheDom.shiftAll.forEach(function(element) {
      if ( element.nodeType === 1 ) {
        element.style.left = null;
        // element.style.width = '100%';
        element.style.width = null;
        element.innerHTML = "";
      }
    });
  }


  /*****************************************
   Navigation functions & event listeners:
  *****************************************/

  const hideMenu = function() {
    cacheDom.aside.classList.add('hide');
    cacheDom.aside.classList.add('hide2');
  }

  const showMenu = function() {
    cacheDom.aside.classList.remove('hide');
    cacheDom.aside.classList.remove('hide2');
  }

  cacheDom.showMenu.addEventListener('click', showMenu, false);
  cacheDom.hideMenu.addEventListener('click', hideMenu, false);

  cacheDom.addEmployee.addEventListener('click', function() {
    let name = cacheDom.emplName.value;
    let avail = getAvailDays();
    let maxHours = cacheDom.maxHours.value;
    createEmployees(name, maxHours, avail);
    displayEmplObj();
  }, false);

  cacheDom.addBusinessDay.addEventListener('click', function() {
    let day = cacheDom.businessDay.value;
    console.log('cacheDom.businessDay: ', cacheDom.businessDay.value);
    console.log('day: ', day);
    let open = cacheDom.open.value.substr(0,2);
    console.log('open: ', open);
    let close = cacheDom.close.value.substr(0,2);;
    console.log('close: ', close);
    let staffRequired = cacheDom.numShifts.value;
    createTimetable(day, open, close, staffRequired);
    displayTimetableObj();
  }, false);

  function createDemo() {
    hideEmptyShiftBars('yes');
    createDemoObj();
    createAll();
    displayEmplObj();
    displayTimetableObj();
    displayAssignedShiftsObj();
    createShiftBars();
    hideEmptyShiftBars();
    cacheDom.demo.setAttribute('disabled', true);
    cacheDom.clearAll.removeAttribute('disabled');
  }

  function createSchedule() {
    hideEmptyShiftBars('yes');
    createAll();
    displayEmplObj();
    displayTimetableObj();
    displayAssignedShiftsObj();
    createShiftBars();
    hideEmptyShiftBars();
    // cacheDom.createSchedule.setAttribute('disabled', true);
    cacheDom.clearAll.removeAttribute('disabled');
  }

  cacheDom.demo.addEventListener('click', createDemo, false);

  cacheDom.createSchedule.addEventListener('click', createSchedule, false);

  cacheDom.clearAll.addEventListener('click', function() {
    var clearOnlyIfConfirmed = window.confirm('Ok to clear All? Beware, this will clear all your entries. It also clears the demo data');
    if ( clearOnlyIfConfirmed ) {
      clearAll();
    }
  }, false);


  // Remove text fade-out effect when scrolled to bottom:
  cacheDom.scroll[2].addEventListener('scroll', function(event) {
    var element = event.target;
    if ( element.scrollHeight - element.scrollTop === element.clientHeight )
    {
      cacheDom.effect1.classList.remove('fade-out-text');
      // console.log('scrolled');
    }
    else { cacheDom.effect1.classList.add('fade-out-text');
    }
  }, false);


  // Prevent scrolling of menu page when cursor inside scrollable objects:
  function hideOverflow() {
    document.body.style.overflowY = "hidden";
  }

  function showOverflow() {
    document.body.style.overflowY = "unset";
  }

  cacheDom.employeeObject.addEventListener('mouseover', hideOverflow, false);

  cacheDom.timeTableObject.addEventListener('mouseover', hideOverflow, false);

  cacheDom.assignedShiftsObject.addEventListener('mouseover', hideOverflow, false);

  cacheDom.employeeObject.addEventListener('mouseout', showOverflow, false);

  cacheDom.timeTableObject.addEventListener('mouseout', showOverflow, false);

  cacheDom.assignedShiftsObject.addEventListener('mouseout', showOverflow, false);


})();

/*******************************************
********************************************
**  AUTHOR:  Team Geckos-6
** PROJECT:  Chingu Voyage 3
**    DATE:  Dec 2017-Jan 2018
** VERSION:  1.18
********************************************
*******************************************/
