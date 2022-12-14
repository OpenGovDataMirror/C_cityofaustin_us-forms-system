import { set } from 'lodash';
import { isAfter, isBefore } from 'date-fns';

// dateString will be either a string in the form '2011-11-11' or undefined
export function parseISODate(dateString) {
  if (typeof dateString === 'string') {
    const [year, month, day] = dateString.split('-', 3);
    return {
      month,
      day,
      year
    };
  }
  return {
    month: '',
    day: '',
    year: '',
  };
}

export function formatYear(val) {
  return val;
}

export function formatDayMonth(val) {
  if (val === '') return '';
  const numberVal = Number(val);
  if (numberVal) {
    const dayOrMonth = numberVal.toString();
    if (Number(dayOrMonth) && dayOrMonth.length === 1) {
      return `0${numberVal}`;
    } else if (Number(dayOrMonth)) {
      return dayOrMonth;
    }
  }
  return '';
}

export function formatISOPartialDate({ month, day, year }) {
  if (month && day && year) {
    return `${formatYear(year)}-${formatDayMonth(month)}-${formatDayMonth(day)}`;
  }

  return undefined;
}

// Make sure that date is valid. If invalid, plug in approximate date.
// Approximation is made by js Date parser's convention.
// Ex: '02-31-2019' => '03-31-2019'
export function setValidDate(newState, validation) {
  const { year, month, day } = newState.value;
  // A reminder that js Dates start months at index=0 ;)
  const validDate = new Date(year, month - 1, day);

  const validMonth = validDate.getMonth() + 1;
  const validDay = validDate.getDate();

  if (validMonth !== Number(month)) {
    set(newState, ['value', 'month'], formatDayMonth(validMonth));
  }
  if (validDay !== Number(day)) {
    set(newState, ['value', 'day'], formatDayMonth(validDay));
  }

  if (validation === 'pastOnly') {
    // If date is in the future, go back to last year
    const isDateInFuture = isAfter(
      new Date(year, newState.value.month - 1, newState.value.day),
      new Date()
    );
    if (isDateInFuture) {
      // Only need to subtract 1 year,
      // Because we do not allow years that are greater than the current year
      set(newState, ['value', 'year'], year - 1);
    }
  } else if (validation === 'futureOnly') {
    // Note: autocorrect won't work the same for future dates,
    // unless we decided to start tracking "focus" on the year input box.
  }

  return newState;
}

/**
  For validation="pastOnly"
  If the filled out month+day for this year are in the future, then set year to last year.
  ex:
    Today is 5/07/2019
    newState = {value: {month: "11", day: "1"}}
    11/01/2019 is after 05/07/2019, so its not valid for a "pastOnly" calendar.
    So we set the year to 2018
*/
export function autofillYearPast(newState) {
  const currentYear = (new Date()).getFullYear();
  const isDateFromLastYear = isAfter(
    new Date(currentYear, newState.value.month - 1, newState.value.day),
    new Date()
  );
  return isDateFromLastYear ? currentYear - 1 : currentYear;
}

/**
  For validation="futureOnly"
  If the filled out month+day for this year are in the past, then set year to next year.
  ex:
    Today is 5/07/2019
    newState = {value: {month: "03", day: "1"}}
    03/01/2019 is before 05/07/2019, so its not valid for a "futureOnly" calendar.
    So we set the year to 2020
* */
export function autofillYearFuture(newState) {
  const currentYear = (new Date()).getFullYear();
  const isDateInPast = isBefore(
    new Date(currentYear, newState.value.month - 1, newState.value.day),
    new Date()
  );
  return isDateInPast ? currentYear + 1 : currentYear;
}
