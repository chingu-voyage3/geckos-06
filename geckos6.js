/*********************************
**********************************
**  AUTHOR:  Team Geckos-6
** PROJECT:  Chingu Voyage 3
**    DATE:  Dec 2017-Jan 2018
** VERSION:  1.10
**********************************
*********************************/

const geckos6AppModule = (function () {

  const cacheDom = {
    shift1: document.getElementsByClassName('shift1'),
    shift7: document.getElementsByClassName('shift7'),
    line: document.getElementsByClassName('line'),
    schedule: document.getElementById('schedule'),
    main: document.getElementsByTagName('main')[0],
    settings: document.getElementById('settings'),
    settingsInput: document.getElementById('settings-input'),
    aside: document.getElementsByTagName('aside')[0],
    showMenu: document.getElementById('show-menu'),
    hideMenu: document.getElementById('hide-menu'),
    settingsButtons: document.querySelectorAll('#settings > button')
  };

  // set width of shift7 bar (for testing only):
  cacheDom.shift7[0].style.left = '25%';
  cacheDom.shift7[0].style.width = '50%';

  // set height of vertical lines:
  let lines = cacheDom.line;
  let scheduleHeight = cacheDom.schedule.getBoundingClientRect().height + 'px';
  for ( let i = 0; i < lines.length; i++ ) {
    lines[i].style.height = scheduleHeight;
  }

  // Adds text to horizontal "shift" bars:
  (function nameShift1() {
    let lgt = cacheDom.shift1.length;
    for ( let i = 0; i < lgt; i++ ) {
      cacheDom.shift1[i].innerText = 'employee name 7:00am to 1:45pm';
    }
  })()

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

  const placeholderValue = function(event) {
    if ( event.target !== event.currentTarget ) {
      if ( event.target.nodeName === 'BUTTON') {
        let text = event.target.innerText + `...`;
        cacheDom.settingsInput.setAttribute('placeholder', text);
        console.log(event.target.nodeName);
      }
    }
  };

  cacheDom.settings.addEventListener('click', placeholderValue, false);

  // Navigation button by David:
  // Currently unused

  // var display = false;
  // $(document).ready(function() {
  //   $("#navigationButton").click(function() {
  //     if(!display) {
  //       $("ul li").css("display", "block");
  //       display = true;
  //     }
  //     else {
  //       $("ul li").css("display", "none");
  //       display = false;
  //     }
  //   });
  // });


  /*********************************
   Input Objects from settings:
  *********************************/

  // functions for pulling data from settings menu:
  const createEmployees = function(name, maxHours, avail) {
      let employeeName = name;
      employees[employeeName] = { maxHours, avail };
    };

  const createTimetable = function(day, open, close, staffRequired) {
    timetable[day][open] = open;
    timetable[day][close] = close;
    timetable[day][staffRequired] = staffRequired;
  };


  /*********************************
   Schedule Maker algorithm:
  *********************************/

  // variables setup:
  const employeeArr1 = [];
  var employeeArr2 = [];
  var employeeArr3 = [];
  const shiftsArr1 = [];
  const shiftsArr2 = [];
  var assignedShiftsObj1 = {};
  var assignedShiftsObj2 = {};

  // Sample employees object for testing:
  const employees = {
    'Eddard Stark': {
      maxHours: 12,
      avail: [1, 2, 5, 7]
    },
    'Robert Baratheon': {
      maxHours: 32,
      avail: [2, 4, 5]
    },
    'Jaime Lannister': {
      maxHours: 8,
      avail: [1, 2, 5, 6]
    },
    'Catelyn Stark': {
      maxHours: 16,
      avail: [2, 3, 4, 5]
    },
    'Cersei Lannister': {
      maxHours: 4,
      avail: [1, 3, 5, 7]
    },
    'Daenerys Targaryen': {
      maxHours: 24,
      avail: [2, 4, 5, 6, 7]
    },
    'Jorah Mormont': {
      maxHours: 20,
      avail: [2, 4, 6, 7]
    },
    'Petyr Baelish': {
      maxHours: 12,
      avail: [2, 4, 5]
    },
    'Viserys Targaryen': {
      maxHours: 44,
      avail: [1, 3, 4, 5, 6, 7]
    },
    'Jon Snow': {
      maxHours: 8,
      avail: [2, 4, 6]
    },
    'Sansa Stark': {
      maxHours: 16,
      avail: [2, 4, 7]
    },
    'Arya Stark': {
      maxHours: 24,
      avail: [1, 2, 4, 5]
    },
    'Robb Stark': {
      maxHours: 4,
      avail: [3, 5, 6]
    },
    'Theon Greyjoy': {
      maxHours: 12,
      avail: [3, 4, 5, 6]
    },
    'Bran Stark': {
      maxHours: 16,
      avail: [1, 2, 3, 5, 7]
    },
    'Joffrey Baratheon': {
      maxHours: 24,
      avail: [3, 4, 5, 7]
    },
    'Tyrion Lannister': {
      maxHours: 28,
      avail: [1, 2, 3, 4, 6]
    }
  };

  // Sample timetable object for testing:
  const timetable = {
    Monday: {
      open: 7,
      close: 17,
      staffRequired: 2
    },
    Tuesday: {
      open: 7,
      close: 17,
      staffRequired: 3
    },
    Wednesday: {
      open: 7,
      close: 18,
      staffRequired: 2
    },
    Thursday: {
      open: 7,
      close: 20,
      staffRequired: 3
    },
    Friday: {
      open: 7,
      close: 20,
      staffRequired: 3
    },
    Saturday: {
      open: 7,
      close: 20,
      staffRequired: 5
    },
    Sunday: {
      open: 7,
      close: 16,
      staffRequired: 4
    }
  };

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
  const shiftsArr1Maker = function() {
    let weekdays = Object.keys(timetable);
    // console.log(weekdays);
    weekdays.forEach(function(weekday, index) {
      // console.log(x, 'open: ', timetable[x].open, 'close: ', timetable[x].close);
      // let weekday = timetable[x];
      let open = timetable[weekday].open;
      let close = timetable[weekday].close;
      let staffRequired = timetable[weekday].staffRequired;
      // console.log(staffRequired);
      let dayLength = close - open;
      let start = open;
      let timeSlots = [];
      var timeSlot1, timeSlot2, timeSlot3, timeSlot4;
      if ( dayLength < 8 ) {
        timeSlot1 = `${index + 1}-${weekday}: ${start} to ${close}`;
        for ( let i = 0; i < staffRequired; i++ ) {
          timeSlots.push(timeSlot1);
        }
      }
      else if ( dayLength >=8 && dayLength < 12 ) {
        timeSlot1 = `${index + 1}-${weekday}: ${start} to ${start+4}`;
        timeSlot2 = `${index + 1}-${weekday}: ${start+4} to ${close}`;
        for ( let i = 0; i < staffRequired; i++ ) {
          timeSlots.push(timeSlot1, timeSlot2);
        }
      }
      else if ( dayLength >=12 && dayLength < 16 ) {
        timeSlot1 = `${index + 1}-${weekday}: ${start} to ${start+4}`;
        timeSlot2 = `${index + 1}-${weekday}: ${start+4} to ${start+8}`;
        timeSlot3 = `${index + 1}-${weekday}: ${start+8} to ${close}`;
        for ( let i = 0; i < staffRequired; i++ ) {
          timeSlots.push(timeSlot1, timeSlot2, timeSlot3);
        }
      }
      else if ( dayLength >=16 && dayLength < 20 ) {
        timeSlot1 = `${index + 1}-${weekday}: ${start} to ${start+4}`;
        timeSlot2 = `${index + 1}-${weekday}: ${start+4} to ${start+8}`;
        timeSlot3 = `${index + 1}-${weekday}: ${start+8} to ${start+12}`;
        timeSlot4 = `${index + 1}-${weekday}: ${start+12} to ${close}`;
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

  // employee match function:
  // const matchAvailEmpl = function(num) {
  //   let search = new RegExp(num);
  //   let rule = function(x) {
  //     if ( x.match(search) ) {
  //       return x;
  //     }
  //   }
  // }

  // Final Shift Assigner function:
  const assignedShiftsObj2Maker = function(edit) {
    let lgt;
    if ( employeeArr3.length > shiftsArr2.length ) {
      lgt = shiftsArr2.length;
    }
    else {
      lgt = employeeArr3.length;
    }
    console.log('employeeArr3 before: ', employeeArr3);
    console.log('employeeArr3 length before: ', employeeArr3.length);
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
      // let empl = employeeArr3.find(rule.bind(null, index));
      let remove1;
      let shift = shiftsArr2[i];
      let empl = employeeArr3.find(function(element, index) {
        remove1 = index;
        // console.log(remove1, i);
        return element.match(search);
      });
      let j = i.toString().padStart(2, '0');
      if ( edit === 'edit' ) {
        empl = empl.match(/[A-Za-z]+/g).join(' ');
        shift = shift.substring(2, shift.length-1);
      }
      assignedShiftsObj2[j + '. ' + shift] = empl;
      let remove2 = employeeArr3.indexOf(empl);
      employeeArr3.splice(remove1, 1);
    }
  };


  // run all functions:
  const createAll = (function() {
    employeeArr1Maker(); //repl.it indicating 'too many errors' but it's working fine!
    employeeArr2Maker();
    employeeArr3Maker();
    shiftsArr1Maker();
    shiftsArr2Maker();
    assignedShiftsObj1Maker();
    assignedShiftsObj2Maker('edit'); // cleanup result
  })();

})();
