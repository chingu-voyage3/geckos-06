/*********************************************
**********************************************
**  Copyright (C) 2017
**  AUTHOR:  Tony Whomever
**   PLACE:  Ottawa, ON, Canada
**    DATE:  September 2017
**
**********************************************
*********************************************/
"use strict";

// Time related functions module:

var timeRelatedFunctions = (function() {

var monthNames = function(number) {
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return months[number];
};

var monthNamesAbbrev = function(number) {
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[number];
};

var weekdayNames = function(number) {
  var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return weekdays[number];
};

const sessionOpen = new Date();

return { //returns all public methods below:

/********************************************
 1. Today's Date function:
********************************************/

todayDate: function() {
  var x = new Date();
  var day = x.getDate();
  var weekday = weekdayNames(x.getDay());
  var month = monthNames(x.getMonth());
  var year = x.getFullYear();
  var today = `${weekday} ${month} ${day}, ${year}`;
  // Ternary Operator in lieu of if else statement
  var weekdayNum = x.getDay();
  var commentTemplate = '<br /><span style="font-size: 0.9em">';
  var comment =
  weekdayNum === 0 ? commentTemplate + 'It\'s Sunday, enjoy it, don\'t think about tomorrow</span>' :
  weekdayNum === 1 ? commentTemplate + 'It\'s a good day to make a schedule!</span>' :
  weekdayNum === 2 ? commentTemplate + 'It\'s a good day to make a schedule!</span>' :
  weekdayNum === 3 ? commentTemplate + 'Happy HUMP day! It\'s a good day to make a schedule!</span>' :
  weekdayNum === 4 ? commentTemplate + 'It\'s a good day to make a schedule!</span>' :
  weekdayNum === 5 ? commentTemplate + 'TGIF! It\'s a good day to make a schedule!</span>' :
  commentTemplate + 'Saturdays RULE the world! Why not make a schedule?</span>';
  return today + comment;
},


/********************************************
 2. Elapsed Time function:
********************************************/

elapsedTimeSinceCreated: function() {
  var x = new Date();
  var creationDate = new Date(2017, 6, 24, 13);
  var diffInMinutes = Math.round((x - creationDate) / 1000 / 60);
  var text = '';

  var diffInHours = Math.floor(diffInMinutes/60);
  var diffInDays = Math.floor(diffInMinutes/60/24);

  var minAfterHours = diffInMinutes - diffInHours * 60;
  var hoursAfterDays = diffInHours - diffInDays * 24;

  var mins;
  if ( minAfterHours === 1 ) {
    mins = " minute";
  }
  else mins = " minutes";

  var hours;
  if ( hoursAfterDays === 1 ) {
    hours = " hour";
  }
  else hours = " hours";

  var days;
  if ( diffInDays === 1 ) {
    days = " day";
  }
  else days = " days";

  if ( diffInMinutes < 60 ) {
    text = text + diffInMinutes + mins;
  }

  else if ( diffInMinutes < 3600 ) {
    text = text + diffInHours + hours + " and " + minAfterHours + mins;
  }

  else {
    text = text + ` ${diffInDays} ${days} ${hoursAfterDays} ${hours} and ${minAfterHours} ${mins} `;
  }

  return text;
},


/********************************************
 3. Session Time functions:
********************************************/

/*
var sessionOpen;
window.addEventListener('DOMContentLoaded', function() {
  sessionOpen = new Date();
}); */


// const sessionOpen = new Date();

displayTimeOpened: function(hh, mm) {
  var hours;
  var minutes;
  var am_pm;

  if ( hh || hh === 0 ) {
    hours = hh;
  }
  else hours = sessionOpen.getHours();

  if ( mm || mm === 0 ) {
    minutes = mm;
  }
  else minutes = sessionOpen.getMinutes();

  minutes === 0 ? minutes = "00" : // 0 doesn't work
  minutes < 10 ? minutes = "0" + minutes :
  null;

  hours === 0 ? (hours = 12, am_pm = "am") :
  hours < 12 ? (am_pm = "am") :
  hours === 12 ? (am_pm = "pm") :
  hours > 12 ? (hours -= 12, am_pm = "pm"):
  null;
  var timeOpened = `${hours}:${minutes} ${am_pm}`;
  return `Session opened at ${timeOpened}<br/>`;
},

sessionTime: function(hh, mm) {
  var x = new Date();
  if ( hh ) {
    sessionOpen.setHours(hh);
  }
  if ( mm ) {
    sessionOpen.setMinutes(mm);
    sessionOpen.getSeconds(0); // works without this line
  }

  var y = sessionOpen;

  var diffInSeconds = Math.round((x - y) / 1000);
  var text = '';

  var diffInMinutes = Math.floor(diffInSeconds/60);
  var diffInHours = Math.floor(diffInSeconds/60/60);
  var diffInDays = Math.floor(diffInSeconds/60/60/24);

  var secsAfterMinutes = diffInSeconds - diffInMinutes * 60;
  var minAfterHours = diffInMinutes - diffInHours * 60;
  var hoursAfterDays = diffInHours - diffInDays * 24;

  var secs;
  if ( secsAfterMinutes === 1 ) {
    secs = " sec"; // " second";
  }
  else secs = " secs"; // " seconds";

  var mins;
  if ( minAfterHours === 1 ) {
    mins = " min"; // " minute";
  }
  else mins = " mins"; // " minutes";

  var hours;
  if ( hoursAfterDays === 1 ) {
    hours = " hr"; // " hour";
  }
  else hours = " hrs"; // " hours";

  var days;
  if ( diffInDays === 1 ) {
    days = " day";
  }
  else days = " days";


  if ( diffInSeconds < 60 ) {
      text = text + `This session just opened ${diffInSeconds} ${secs} ago`;
    }

  else if ( diffInMinutes < 60 ) {
    text = text + `elapsed time:  ${diffInMinutes} ${mins} and ${secsAfterMinutes} ${secs}`;
  }

  else if ( diffInMinutes < 1440 ) {
    text = text + `time elapsed:  ${diffInHours} ${hours} ${minAfterHours} ${mins} ${secsAfterMinutes} ${secs}`;
  }

  else {
    text = text + `elapsed time:  ${diffInDays} ${days} ${hoursAfterDays} ${hours} ${minAfterHours} ${mins}`;
  }

  return text;
},

/*
function go() {
  var y = setInterval(function() {
  sessionTime();
  }, 1000);
}
*/


/********************************************
 4. Time Stamp function:
********************************************/

timeStampItem: function(id, hh, mm) {
  let now = new Date();
  // for same day:
  var hours;
  var minutes;
  var am_pm;
  if ( hh || hh === 0 ) {
    hours = hh;
  }
  else hours = now.getHours();
  if ( mm || mm === 0 ) {
    minutes = mm;
  }
  else minutes = now.getMinutes();
  minutes === 0 ? minutes = "00" :
  minutes < 10 ? minutes = "0" + minutes :
  null;
  hours === 0 ? (hours = 12, am_pm = "am") :
  hours < 12 ? (am_pm = "am") :
  hours === 12 ? (am_pm = "pm") :
  hours > 12 ? (hours -= 12, am_pm = "pm"):
  null;
  // for yesterday or older:
  var beginningOfYear = new Date(2016,11,31);
  const daysCalc = 1000 * 60 * 60 * 24;
  const hoursCalc = 1000 * 60 * 60;
  var dayOfYear = Math.floor(( now - beginningOfYear ) / daysCalc);
  var timeAdded = `<div class="timeStamp" id="timeStamp${id}-date${dayOfYear}" style="color:${colorPicker.value}">${hours}:${minutes}${am_pm}&nbsp&nbsp&nbsp&nbsp </div>`;
  //for simple text (i.e. weather update):
  var timeUpdated = ` ${hours}:${minutes}${am_pm}`;
  if ( id === 'update' ) {
    return timeUpdated;
  }
  else return timeAdded;
}

}; //closes return of multiple public methods

})();

/*********************************************
**********************************************
**  Copyright (C) 2017
**  AUTHOR:  Tony Whomever
**   PLACE:  Ottawa, ON, Canada
**    DATE:  September 2017
**
**********************************************
*********************************************/
