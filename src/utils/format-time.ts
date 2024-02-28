import { format, getTime, isValid, parseISO, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

function isValidDate(date: InputValue): date is Date | string | number {
  if (date === null || date === undefined) return false;
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return isValid(parsedDate);
}

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';
  if (!isValidDate(date)) return date ?? "";
  return date ? format(new Date(date), fm) : '';
}

export function fTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'p';
  if (!isValidDate(date)) return date ?? "";
  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';
  if (!isValidDate(date)) return date ?? "";

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  if (!isValidDate(date)) return date ?? "";

  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  if (!isValidDate(date)) return date ?? "";
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
    })
    : '';
}

export function isBetween(inputDate: Date | string | number, startDate: Date, endDate: Date) {
  const date = new Date(inputDate);

  const results =
    new Date(date.toDateString()) >= new Date(startDate.toDateString()) &&
    new Date(date.toDateString()) <= new Date(endDate.toDateString());

  return results;
}

export function isAfter(startDate: Date | null, endDate: Date | null) {
  const results =
    startDate && endDate ? new Date(startDate).getTime() > new Date(endDate).getTime() : false;

  return results;
}
