import moment from 'moment';

export const daysBetween = (date1: Date, date2: Date) => {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1.valueOf() - date2.valueOf());

  // Convert back to days and return
  return Math.ceil(differenceMs / ONE_DAY);
};

export const addDays = (date: Date, days: number) => {
  let d = moment(date.valueOf());
  d.add(days, 'days');
  return moment(d);
};
