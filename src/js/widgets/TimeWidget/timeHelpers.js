// timeString will be either a string in the form "12:30 AM" or undefined
export function parseTime(timeString) {
  if (typeof timeString === 'string') {
    // TODO: verify that this is truly 'useless'
    // eslint-disable-next-line no-useless-escape
    const [hour, minute, period] = timeString.split(/\:|\s/);
    return {
      hour,
      minute,
      period
    };
  }
  return {
    hour: '',
    minute: '',
    period: 'am',
  };
}

export function formatHourMinute(val) {
  if (val === '') return '';
  const numberVal = Number(val);
  if (numberVal || (numberVal === 0)) {
    const hourOrMinute = numberVal.toString();
    if (!isNaN(hourOrMinute) && hourOrMinute.length === 1) {
      return `0${numberVal}`;
    } else if (!isNaN(hourOrMinute)) {
      return hourOrMinute;
    }
  }
  return '';
}

export function formatTime({ hour, minute, period }) {
  if (hour && minute.length && period) {
    return `${formatHourMinute(hour)}:${formatHourMinute(minute)} ${period}`;
  }

  return undefined;
}
