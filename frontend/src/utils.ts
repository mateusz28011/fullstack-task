export function doesHttpOnlyCookieExist(cookiename: string): boolean {
  let d = new Date();
  d.setTime(d.getTime() + 1000);
  let expires = 'expires=' + d.toUTCString();

  document.cookie = cookiename + '=new_value;path=/;' + expires;
  if (document.cookie.indexOf(cookiename + '=') === -1) {
    return true;
  } else {
    document.cookie = `${cookiename}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
    return false;
  }
}

export function getShortDayName(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-us', { weekday: 'short' });
}

export const dateWithoutTime = (date: string | Date) => {
  if (date instanceof Date) {
    date.setHours(0, 0, 0, 0);
    return date;
  }
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};
