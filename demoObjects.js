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
   timetable = {
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
