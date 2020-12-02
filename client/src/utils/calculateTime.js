export function timeStringToNumber(time) {
  return (
    new Date(('01 Jan 1970 ' + time || '').replace('.', ':') + ' GMT') /
      3600000 || 0
  );
}

export function timeStringToFloat(time) {
  try {
    let hoursMinutes = time.split(/[.:]/);
    let hours = parseInt(hoursMinutes[0], 10);
    let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  } catch (e) {
    return 'ERROR';
  }
}

export function hoursToString(hours) {
  let minutes = hours * 60;
  return (
    ('00' + Math.floor(minutes / 60)).slice(-2) +
    ':' +
    ('00' + Math.round(minutes % 60)).slice(-2)
  );
}
