import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
dayjs.extend(utc); dayjs.extend(tz);
const COL = import.meta.env.VITE_TZ || 'Asia/Colombo';
export function toLocal(iso) { return dayjs.utc(iso).tz(COL); }
export function fmt(iso, withTime = true) {
  const d = toLocal(iso);
  return withTime ? d.format('DD MMM YYYY, hh:mm A') : d.format('YYYY-MM-DD');
}
export function ymdLocal(dateObj) { return dayjs(dateObj).tz(COL).format('YYYY-MM-DD'); }
