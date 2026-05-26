import dayjs from 'dayjs';

export const formatDateTime = (value?: string, format: string = 'DD/MM/YYYY') => {
  if (!value) return '';
  return dayjs(value).format(format);
};