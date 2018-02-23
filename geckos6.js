/*******************************************
********************************************
**  AUTHOR:  Team Geckos-6
** PROJECT:  Chingu Voyage 3
**    DATE:  Dec 2017-Jan 2018
** VERSION:  1.18
********************************************
*******************************************/

const geckos6AppModule = (function() {

  const cacheDom = {
    welcomePage: document.getElementById('welcome-page'),
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
    getStarted: document.getElementById('get-started'),
    settings: document.getElementById('settings'),
    settingsInput: document.getElementById('settings-input'),
    aside: document.getElementsByTagName('aside')[0],
    goHome: document.getElementById('go-home'),
    hideMenuNav: document.getElementById('hide-menu-nav'),
    showMenuNav: document.getElementById('show-menu-nav'),
    settingsButtons: document.querySelectorAll('#settings > button'),
    employeeObject: document.getElementById('employee-object'),
    timeTableObject: document.getElementById('timetable-object'),
    assignedShiftsObject: document.getElementById('assigned-shifts-object'),
    objectTextFields: document.getElementById('object-text-fields'),
    scroll: document.getElementsByClassName('scroll-texts'),
    effect1: document.getElementById('effect1'),
    effect2: document.getElementById('effect2'),
    shiftAll: document.querySelectorAll('[class*="shift"]'),
    emplName: document.getElementById('employee-name'),
    availDays: document.getElementById('avail-days'),
    maxHours: document.getElementById('max-hours'),
    addEmployeeButton: document.getElementById('add-employee'),
    businessDay: document.getElementById('business-day'),
    open: document.getElementById('open'),
    close: document.getElementById('close'),
    paragraph1: document.getElementById('paragraph1'),
    paragraph2: document.getElementById('paragraph2'),
    paragraph3: document.getElementById('paragraph3'),
    demo: document.getElementById('demo'),
    createSchedule: document.getElementById('create'),
    saveAll: document.getElementById('save-all'),
    clearAll: document.getElementById('clear-all'),
    numShifts: document.getElementById('num-shifts'),
    addBusinessDayButton: document.getElementById('add-business-day'),
    scheduleContainer: document.getElementById('schedule-container')
  };


  /********************************************
   Vue Instance: session-time (in nav bar)
  ********************************************/

  Vue.component('session-time', {
    //props: ['alpha'],
    template: '<span v-html="beta + alpha"></span>',
    data: function() {
      return {
        beta: '',
        alpha: 'session opened!',
        hours: null, // enter hour or undefined/null
        minutes: null // enter minute or undefined/null
      }
    },
    methods: {
      session: function() {
        this.alpha = timeRelatedFunctions.sessionTime(this.hours,this.minutes)
      }
    },
    mounted() {
      this.interval = setInterval(this.session, 1000),
      this.beta = timeRelatedFunctions.displayTimeOpened(this.hours,this.minutes)
    }
  });

  var sessionTimeComponent = new Vue({
    el: '#sessionTimeComponent'
  });


  /********************************************
   Vue Instance: today-date (in nav bar)
  ********************************************/

  var todayDateInstance = new Vue({
    el: '#todayDateInstance',
    data: {},
    methods: {
      todayDate: function() {
        return 'Today is ' + timeRelatedFunctions.todayDate();
      }
    }
  });


/*****************************************
 Schedule Maker algorithm:
*****************************************/

  // variables setup:
  var employeeArr1 = [];
  var employeeArr2 = [];
  var employeeArr3 = [];
  var shiftsArr1 = [];
  var shiftsArr2 = [];
  // var assignedShiftsObj1 = {};
  var assignedShiftsObj2 = {};

  // Sample employees object in external file named 'myObjects.js'

  // create initial array of employee names with a repeat for every number of possible shifts:
  // identifier: 00-00-00-0-name-[avail]
  // first pair of digits: index
  // second pair of digits: iteration position of names
  // third pair of digits: max # of shifts employee can work
  // single digit after 3 pairs: # of weekdays available
  function employeeArr1Maker() {
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
  function employeeArr2Maker() {
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
  function employeeArr3Maker() {
    employeeArr3 = employeeArr2.map(function(x) {
      y = x.slice(11, x.length);
      return y;
    });
    // console.log('employeeArr3: ' + employeeArr3);
  };

  // create initial array of shift slots (creates sub-arrays):
  function shiftsArr1Maker(nameNum) {
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
  function shiftsArr2Maker() {
    let lgt1 = shiftsArr1.length;
    for ( let i = 0; i < lgt1; i++ ) {
      let lgt2 = shiftsArr1[i].length;
      for ( let j = 0; j < lgt2; j++ ) {
        shiftsArr2.push(shiftsArr1[i][j]);
      }
    }
    // console.log('shiftsArr2: ', shiftsArr2);
  };

  // Notes:
  // assign employee names for every shift slot
  // stops when it runs out of shifts or names, whichever comes first:
  // const assignedShiftsObj1Maker = function() {
  //   let lgt;
  //   if ( employeeArr3.length > shiftsArr2.length ) {
  //     lgt = shiftsArr2.length;
  //   }
  //   else {
  //     lgt = employeeArr3.length;
  //   }
  //   for ( let i = 0; i < lgt; i++ ) {
  //     assignedShiftsObj1[i + '. ' + shiftsArr2[i]] = employeeArr3[i];
  //   }
  // };

  // Final Shift Assigner function:
  function assignedShiftsObj2Maker(edit) {
    let lgt;
    // console.log('employeeArr3: ', employeeArr3);
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
      // let search = new RegExp(num);
      // employee match function (not used):
      // let rule = function(element, index) {
      //   if ( element.match(search) ) {
      //     return element;
      //   }
      // }
      let remove1;
      let shift = shiftsArr2[i];
      let empl = employeeArr3.find(function(element, index) {
        remove1 = index;
        return element.match(num);
      });
      let j = (i + 1).toString().padStart(2, '0');
      if ( edit === 'edit' ) {
        if ( empl ) {
          empl = empl.match(/[A-Za-z]+/g).join(' ');
        }
        else {
          empl = 'no one available!'
          lgt++;
        }
      shift = shift.substring(2, shift.length);
      }
      assignedShiftsObj2[j + ' ' + shift] = empl;
      // let remove2 = employeeArr3.indexOf(empl);
      if ( remove1 < (employeeArr3.length - 1) ) {
        employeeArr3.splice(remove1, 1);
        // console.log('remove1: ', remove1);
        // console.log('employeeArr3: ', employeeArr3);
      }
    }
  };


  /*****************************************
   Create Objects from menu settings:
  *****************************************/

  // functions for pulling data from settings menu:
  function createEmployees(name, maxHours, avail) {
      let employeeName = name;
      employees[employeeName] = { maxHours, avail };
  };

  function createTimetable(day, open, close, staffRequired) {
    timetable[day] = {};
    timetable[day].open = Number(open);
    timetable[day].close = Number(close);
    timetable[day].staffRequired = Number(staffRequired);
    // console.log(timetable);
    cacheDom.createSchedule.removeAttribute('disabled');
  };

  // create array of employee's available days:
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
    // console.log('checkboxes: ', checkboxes);
    return checkboxes;
  }


  /*****************************************
   Run all scheduling functions:
  *****************************************/

  function createAll() {
    employeeArr1Maker();
    employeeArr2Maker();
    employeeArr3Maker();
    shiftsArr1Maker('num');
    shiftsArr2Maker();
    // assignedShiftsObj1Maker();
    assignedShiftsObj2Maker('edit'); // cleanup result
  };

  function clearAll() {
    employees = {};
    timetable = {};
    employeeArr1 = [];
    employeeArr2 = [];
    employeeArr3 = [];
    shiftsArr1 = [];
    shiftsArr2 = [];
    // assignedShiftsObj1 = {};
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

  function displayEmplObj() {
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

  function displayTimetableObj() {
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

  function displayAssignedShiftsObj() {
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

  function greyOutShiftBar(element, employee) {
    if ( employee === 'no one available!' ) {
      element.style.backgroundColor = `#555`;
    }
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
      greyOutShiftBar(element, employee)
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

  function showWelcomePage(event) {
    if ( event.type === 'touchstart' ) {
      event.preventDefault();
    }
    hideOverflow();
    // classList.replace not available on mobile: cacheDom.welcomePage.classList.replace('left-position-100', 'left-position-zero');
    // cacheDom.welcomePage.classList.remove('left-position-100');
    cacheDom.welcomePage.classList.remove('left-translateX-100vw');
    // cacheDom.welcomePage.classList.add('left-position-zero');
    // cacheDom.aside.classList.remove('display-flex');
    adjustTopOnOffSP('off');
    adjustTopOnOffWP('off');
    // setTimeout(function() {
    //   showOverflow();
    // },500); // match transition-duration
  }

  function hideWelcomePage(event) {
    if ( event.type === 'touchstart' ) {
      event.preventDefault();
    }
    // classList.replace not available on mobile: cacheDom.welcomePage.classList.replace('left-position-zero', 'left-position-100');
    // cacheDom.welcomePage.classList.remove('left-position-zero');
    // cacheDom.welcomePage.classList.add('left-position-100');
    cacheDom.welcomePage.classList.add('left-translateX-100vw');
    cacheDom.aside.classList.add('display-block');
    adjustTopOnOffWP('on');
    setTimeout(function() {
      showOverflow();
    },500); // match transition-duration
  }

  function hideMenu(event) {
    if ( event.type === 'touchstart' ) {
      event.preventDefault();
    }
    cacheDom.hideMenuNav.setAttribute('disabled', true);
    cacheDom.showMenuNav.removeAttribute('disabled');
    hideOverflow();
    cacheDom.aside.classList.toggle('left-translateX-100vw');
    cacheDom.scheduleContainer.classList.add('display-flex');
    adjustTopOnOffSP('on');
    setTimeout(function() {
      showOverflow();
    },500); // match transition-duration
  }

  function showMenu(event) {
    if ( event.type === 'touchstart' ) {
      event.preventDefault();
    }
    cacheDom.showMenuNav.setAttribute('disabled', true);
    cacheDom.hideMenuNav.removeAttribute('disabled');
    hideOverflow();
    cacheDom.aside.classList.toggle('left-translateX-100vw');
    adjustTopOnOffSP('off');
    setTimeout(function() {
      cacheDom.scheduleContainer.classList.remove('display-flex');
      showOverflow();
      cacheDom.aside.style.top = 0;
      document.documentElement.scrollTop = 0;
    },500); // match transition-duration
  }

  cacheDom.getStarted.addEventListener('touchstart', hideWelcomePage, false);
  cacheDom.getStarted.addEventListener('click', hideWelcomePage, false);


  cacheDom.goHome.addEventListener('touchstart', showWelcomePage, false);
  cacheDom.goHome.addEventListener('click', showWelcomePage, false);

  cacheDom.showMenuNav.addEventListener('touchstart', showMenu, false);
  cacheDom.showMenuNav.addEventListener('click', showMenu, false);

  cacheDom.hideMenuNav.addEventListener('touchstart', hideMenu, false);
  cacheDom.hideMenuNav.addEventListener('click', hideMenu, false);

  function addEmployee(event) {
    if ( event.type === 'touchstart' ) {
      event.preventDefault();
    }
    let name = cacheDom.emplName.value;
    let avail = getAvailDays();
    let maxHours = cacheDom.maxHours.value;
    createEmployees(name, maxHours, avail);
    displayEmplObj();
  }

  cacheDom.addEmployeeButton.addEventListener('touchstart', addEmployee, false);
  cacheDom.addEmployeeButton.addEventListener('click', addEmployee, false);

  function addBusinessDay(event) {
    if ( event.type === 'touchstart' ) {
      event.preventDefault();
    }
    let day = cacheDom.businessDay.value;
    // console.log('cacheDom.businessDay: ', cacheDom.businessDay.value);
    // console.log('day: ', day);
    let open = cacheDom.open.value.substr(0,2);
    // console.log('open: ', open);
    let close = cacheDom.close.value.substr(0,2);;
    // console.log('close: ', close);
    let staffRequired = cacheDom.numShifts.value;
    createTimetable(day, open, close, staffRequired);
    displayTimetableObj();
  }

  cacheDom.addBusinessDayButton.addEventListener('touchstart', addBusinessDay, false);
  cacheDom.addBusinessDayButton.addEventListener('click', addBusinessDay, false);

  function createDemo(event) {
    if ( event.type === 'touchstart' ) {
      event.preventDefault();
    }
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

  function createSchedule(event) {
    if ( event.type === 'touchstart' ) {
      event.preventDefault();
    }
    hideEmptyShiftBars('yes');
    createAll();
    displayEmplObj();
    displayTimetableObj();
    displayAssignedShiftsObj();
    createShiftBars();
    hideEmptyShiftBars();
    cacheDom.createSchedule.setAttribute('disabled', true);
    cacheDom.clearAll.removeAttribute('disabled');
  }

  cacheDom.demo.addEventListener('touchstart', createDemo, false);
  cacheDom.demo.addEventListener('click', createDemo, false);

  cacheDom.createSchedule.addEventListener('touchstart', createSchedule, false);
  cacheDom.createSchedule.addEventListener('click', createSchedule, false);

  function clearOnlyIfConfirmed(event) {
    if ( event.type === 'touchstart' ) {
      event.preventDefault();
    }
    let confirm = window.confirm('Ok to clear All? Beware, this will clear all your entries. It also clears the demo data');
    if ( confirm ) {
      clearAll();
    }
  }

  cacheDom.clearAll.addEventListener('touchstart', clearOnlyIfConfirmed, false);
  cacheDom.clearAll.addEventListener('click', clearOnlyIfConfirmed, false);


  // Remove text fade-out effect when scrolled to bottom:
  function removeFadeOut(event) {
    var element = event.target;
    // console.log(element);
    if ( element.scrollHeight - element.scrollTop === element.clientHeight )
    {
      cacheDom.effect1.classList.remove('fade-out-text');
    }
    else { cacheDom.effect1.classList.add('fade-out-text');
    }
  }

  cacheDom.scroll[2].addEventListener('scroll', removeFadeOut, false);

  // Prevent scrolling of menu page when cursor inside scrollable objects:
  function hideOverflow() {
    document.body.style.overflowY = "hidden";
    // document.body.style.marginRight = '17px';
  }

  function showOverflow() {
    document.body.style.overflowY = "unset";
  }

  cacheDom.objectTextFields.addEventListener('mouseover', hideOverflow, false);
  cacheDom.objectTextFields.addEventListener('mouseout', showOverflow, false);

  // Adjust top of other pages when scrolling
  function adjustTopWelcomePage() {
    let top = document.documentElement.scrollTop;
    let vh = document.documentElement.clientHeight;
    // console.log(top);
    if ( top < vh ) { // vh
      cacheDom.welcomePage.style.top = `${top}px`;
    }
  }

  function adjustTopSettingsPage() {
    let top = document.documentElement.scrollTop;
    let vh = document.documentElement.clientHeight;
    // console.log(top);
    if ( top < vh ) { // vh
      cacheDom.aside.style.top = `${top}px`;
    }
  }

  function adjustTopOnOffWP(x) {
    if ( x === 'on' ) {
      document.addEventListener('scroll', adjustTopWelcomePage, false);
    }
    else {
      document.removeEventListener('scroll', adjustTopWelcomePage, false);
    }
  }

  function adjustTopOnOffSP(x) {
    if ( x === 'on' ) {
      document.addEventListener('scroll', adjustTopSettingsPage, false);
    }
    else {
      document.removeEventListener('scroll', adjustTopSettingsPage, false);
    }
  }

  function limitScroll(element) {
    let limit = document.documentElement.clientHeight * 2;
    if ( element.scrollHeight > limit) {
      hideOverflow();
    }
  }


return {
  clientHeight: function() {
    return document.documentElement.clientHeight;
  },
  scrollTop: function() {
    return document.documentElement.scrollTop;
  },
  scrollHeight: function() {
    return document.documentElement.scrollHeight;
  }
}

})();

/*******************************************
********************************************
**  AUTHOR:  Team Geckos-6
** PROJECT:  Chingu Voyage 3
**    DATE:  Dec 2017-Jan 2018
** VERSION:  1.18
********************************************
*******************************************/
