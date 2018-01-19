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
    assignedShiftsObject: document.getElementById('assigned-shifts-object')
  };

  console.log('')

  /*****************************************
   Schedule Maker algorithm:
  *****************************************/

  // variables setup:
  const employeeArr1 = [];
  var employeeArr2 = [];
  var employeeArr3 = [];
  const shiftsArr1 = [];
  const shiftsArr2 = [];
  var assignedShiftsObj1 = {};
  var assignedShiftsObj2 = {};

  // Sample employees object for testing:
  // Moved to an external file named 'myObjects'


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
    timetable[day][open] = open;
    timetable[day][close] = close;
    timetable[day][staffRequired] = staffRequired;
  };


  /*****************************************
   run all scheduling functions:
  *****************************************/

  const createAll = (function() {
    employeeArr1Maker(); //repl.it indicating 'too many errors' but it's working fine!
    employeeArr2Maker();
    employeeArr3Maker();
    shiftsArr1Maker();
    shiftsArr2Maker();
    assignedShiftsObj1Maker();
    assignedShiftsObj2Maker('edit'); // cleanup result
    // createEmployees();
    // createTimetable();
  })();


  /*****************************************
   Display employee object to menu page:
  *****************************************/

  // var output = '';
  // for ( var property in employees ) {
  //   output += property + ': ' + employees[property] +'; ';
  // }
  // or
  // cacheDom.employeeObject.innerText = JSON.stringify(employees); //output;

  let text1 = `<h3>Employee object</h3><br/>`;
  Object.keys(employees).forEach(function(name) {
    let maxHours = employees[name].maxHours;
    let avail = employees[name].avail;
    text1 += `<ins>${name}</ins>: &nbsp&nbsp max hours: ${maxHours} /  avail: ${avail}</br>`;
  });
  cacheDom.employeeObject.innerHTML = text1;


  /*****************************************
   Display assigned shifts object to menu page:
  *****************************************/

  let text2 = `<h3>Assigned shifts</h3><br/>`;
  for ( var shift in assignedShiftsObj2 ) {
    let name = assignedShiftsObj2[shift];
    text2 += `<ins>${shift}</ins>: &nbsp&nbsp ${name}</br>`;
  };
  cacheDom.assignedShiftsObject.innerHTML = text2;


  /*****************************************
   Distribute shifts on schedule grid
   by manipulating shift bars from
   info extracted from assignedShiftsObj2:
  *****************************************/

  function nameShift1() {
    let lgt = cacheDom.shift1.length;
    let obj = assignedShiftsObj2;
    let employee = Object.values(obj)[1];
    let start = Object.keys(obj)[1].split(' ')[2];
    let end = Object.keys(obj)[1].split(' ')[4];
    let dayLength = 14;
    let barLeft = Math.round((start - 7 + 0.01) / 14) * 100;
    let barWidth = (end - start + 0.01) / 14 * 100;
    cacheDom.shift1[0].style.left = barLeft + '%';
    cacheDom.shift1[0].style.width = barWidth + '%';
    for ( let i = 0; i < lgt; i++ ) {
      cacheDom.shift1[i].textContent = `${employee}:  ${start} to ${end}`;
    }
  }

  function nameShift2() { //ZZ
    let lgt = cacheDom.shift2.length;
    let obj = assignedShiftsObj2;
    let employee = Object.values(obj)[2];
    let start = Object.keys(obj)[2].split(' ')[2];
    let end = Object.keys(obj)[2].split(' ')[4];
    let dayLength = 14;
    let barLeft = Math.round((start - 7 + 0.01) / 14) * 100;
    let barWidth = (end - start + 0.01) / 14 * 100;
    cacheDom.shift2[0].style.left = barLeft + '%';
    cacheDom.shift2[0].style.width = barWidth + '%';
    for ( let i = 0; i < lgt; i++ ) {
      cacheDom.shift2[i].textContent = `${employee}:  ${start} to ${end}`;
    }
  }

  nameShift1();
  nameShift2();

  // manipulate shift1 bar (testing);

  // set width of shift1 bar (for testing only):
  // cacheDom.shift1[0].style.left = '1%';
  // cacheDom.shift1[0].style.width = '50%';


  /*****************************************
   Set height of vertical lines (CSS manip)
  *****************************************/

  let lines = cacheDom.line;
  let scheduleHeight = cacheDom.schedule.getBoundingClientRect().height + 'px';
  for ( let i = 0; i < lines.length; i++ ) {
    lines[i].style.height = scheduleHeight;
  }


  /*****************************************
   Navigation functions:
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

  // const placeholderValue = function(event) {
  //   if ( event.target !== event.currentTarget ) {
  //     if ( event.target.nodeName === 'BUTTON') {
  //       let text = event.target.innerText + `...`;
  //       cacheDom.settingsInput.setAttribute('placeholder', text);
  //       console.log(event.target.nodeName);
  //     }
  //   }
  // };

  // cacheDom.settings.addEventListener('click', placeholderValue, false);


  /*****************************************
   Navigation button by David:
   (currently unused)
  *****************************************/

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


})();

/*******************************************
********************************************
**  AUTHOR:  Team Geckos-6
** PROJECT:  Chingu Voyage 3
**    DATE:  Dec 2017-Jan 2018
** VERSION:  1.10
********************************************
*******************************************/
