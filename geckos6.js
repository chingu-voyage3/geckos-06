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
    shift1: document.getElementsByClassName('shift1')
};

function nameShift1() {
  let lgt = cacheDom.shift1.length;
  for ( let i = 0; i < lgt; i++ ) {
    cacheDom.shift1[i].innerText = 'employee name 7:00am to 1:45pm';
    console.log(cacheDom.shift1);
  }
}

nameShift1();
console.log('test');

}();
