// CommonJS module:
// module.exports.employees = employees;
// module.exports.timetable = timetable;

// es6 module:
// export { employees, timetable };

// variables setup:
var employees = {};
var timetable = {};

function createDemoObj() {
  // Sample employees object for testing:
   employees = {
    'alpha': {
      maxHours: 12,
      avail: [3, 5, 7]
    },
    'bravo': {
      maxHours: 12,
      avail: [3, 4, 5]
    },
    'charlie': {
      maxHours: 8,
      avail: [1, 2, 5, 6]
    }
  };

  // Sample timetable object for testing:
   timetable = {
    Monday: {
      open: 7,
      close: 17,
      staffRequired: 1
    },
    Tuesday: {
      open: 7,
      close: 17,
      staffRequired: 3
    },
    Wednesday: {
      open: 7,
      close: 16,
      staffRequired: 2
    },
    Thursday: {
      open: 7,
      close: 16,
      staffRequired: 3
    },
    Friday: {
      open: 7,
      close: 16,
      staffRequired: 3
    },
    Saturday: {
      open: 9,
      close: 16,
      staffRequired: 5
    },
    Sunday: {
      open: 10,
      close: 16,
      staffRequired: 4
    }
  };
}
