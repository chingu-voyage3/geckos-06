/*********************************
**********************************
**  AUTHOR:  Team Geckos-6
** PROJECT:  Chingu Voyage 3
**    DATE:  Dec 2017-Jan 2018
**
**********************************
*********************************/

const geckos6AppModule = function () {

  const cacheDom = {
    shift1: document.getElementsByClassName('shift1'),
    schedule: document.getElementById('schedule'),
    main: document.getElementsByTagName('main')[0],
    settings: document.getElementById('settings'),
    settingsInput: document.getElementById('settings-input'),
    aside: document.getElementsByTagName('aside')[0],
    showMenu: document.getElementById('show-menu'),
    hideMenu: document.getElementById('hide-menu'),
    settingsButtons: document.querySelectorAll('#settings > button')
  };


// Adds text to horizontal "shift" bars:
(function nameShift1() {
  let lgt = cacheDom.shift1.length;
  for ( let i = 0; i < lgt; i++ ) {
    cacheDom.shift1[i].innerText = 'employee name 7:00am to 1:45pm';
  }
})()

var hideMenu = function() {
  cacheDom.aside.classList.add('hide');
  cacheDom.aside.classList.add('hide2');
}

var showMenu = function() {
  cacheDom.aside.classList.remove('hide');
  cacheDom.aside.classList.remove('hide2');
}

cacheDom.showMenu.addEventListener('click', showMenu, false);

cacheDom.hideMenu.addEventListener('click', hideMenu, false);

var placeholderValue = function(event) {
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


}();
