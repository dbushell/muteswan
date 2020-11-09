// Return current date (now or global override)
const getDate = () => {
  const key = '__MUTESWAN_DATE__';
  if (window && window[key] instanceof Date) {
    return window[key];
  }

  return new Date();
};

// Return midnight timestamp for start of date
const getMidnight = (date) => {
  if (!(date instanceof Date)) {
    date = date ? new Date(date) : getDate();
  }

  date.setHours(0, 0, 0, 0);
  let unix = date.getTime();
  unix -= new Date().getTimezoneOffset() * 60000;
  return unix;
};

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const abbrDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const abbrMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

// Return string date formats based on Moment.js
// https://momentjs.com/docs/#/displaying/format/
const getDateFormat = (now) => {
  return {
    ISO: now.toISOString(),
    dddd: days[now.getDay()],
    ddd: abbrDays[now.getDay()],
    DD: `${now.getDate()}`.padStart(2, '0'),
    D: now.getDate(),
    MMMM: months[now.getMonth()],
    MMM: abbrMonths[now.getMonth()],
    MM: `${now.getMonth() + 1 + 1}`.padStart(2, '0'),
    M: now.getMonth() + 1,
    Y: now.getFullYear()
  };
};

export {getDate, getDateFormat, getMidnight};
