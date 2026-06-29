import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateTime = (value?: string, format: string = 'DD/MM/YYYY') => {
  if (!value) return '';
  return dayjs(value).format(format);
};

export const toUTC7 = (date?: string) => {
  if (!date) return ''; 
  return dayjs.utc(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
};