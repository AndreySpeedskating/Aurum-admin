import { BOOLEAN_ALIAS } from './constants';

export const getCookie = (name: string): string | undefined => {
  const matches = new RegExp(
    `(?:^|; )${name.replace(/([$()*.?[{|}]\\\/\+\^])/g, '\\$1')}=([^;]*)`
  ).exec(document.cookie);
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const toDayDate = (): string => {
  return new Date().toLocaleDateString('ru-RU');
};

export type Column = {
  label?: string;
  value: string;
  format?: string;
};

const ApplicationColumnKeys = [
  'SendDate',
  'ApplicationDate',
  'ApplicationNumber',
  'GarageNumber',
  'loading_point',
  'alt_loading_point',
  'loading_time',
  'unloading_point',
  'alt_unloading_point',
  'unloading_time',
  'volume',
  'weight',
  'milleage',
  'cargo',
  'users_permissions_user',
  'counterpartie',
  'geolink',
  'ApplicationPhoto',
  'approved',
];

const format = {
  SendDate: 'dd.mm.yyyy hh:mm',
  ApplicationDate: 'dd.mm.yyyy',
  unloading_time: 'dd.mm.yyyy hh:mm',
  loading_time: 'dd.mm.yyyy hh:mm',
  volume: '00.00',
  weight: '00.00',
  milleage: '#',
};

export const returnColumn = (
  data: any[],
  formatMessage: (payload: { id: string }) => string
): Column[] => {
  if (Object.keys(data?.[0])?.includes('alt_loading_point')) {
    return ApplicationColumnKeys?.map((key) => ({
      label:
        formatMessage({ id: `content-manager.containers.ListPage.table-headers.${key}` }) || key,
      value: key,
      format: format[key],
    }));
  }
  return Object.keys(data[0])?.map((key) => ({
    label: formatMessage({ id: `content-manager.containers.ListPage.table-headers.${key}` }) || key,
    value: key,
  }));
};

const returnValue = (value: string): string => {
  if (typeof value === 'string' && value?.includes('Z')) {
    return value?.slice(0, -5);
  }
  return value;
};

export const returnTableRow = (data: any[]): any[] =>
  data?.map((row) => {
    const keys = Object.keys(row);
    return keys.reduce((acc, key) => {
      let value = row[key];
      if (['volume', 'weight', 'milleage']?.includes(key)) {
        value = Number(row[key]);
      }
      if (typeof value === 'object' && value !== null) {
        const valueKeyName = Object.keys(value)?.find(
          (key) => key?.includes('name') || key?.includes('GarageNumber')
        );
        if (valueKeyName) {
          value = row[key][valueKeyName];
        }
      }
      if (typeof value === 'boolean') {
        value = BOOLEAN_ALIAS[`${row[key]}`] || row[key];
      }
      if (typeof value === 'string') {
        if (key?.toLowerCase()?.includes('date') || key?.toLowerCase()?.includes('time')) {
          value = new Date(returnValue(row[key]));
          if (key.toLocaleLowerCase().includes('time')) {
            const [date, time] = row[key]?.split('T');
            value = new Date(`${date}T${time.slice(0, 8)}`);
          }
        }
      }
      const isAutoPark = key === 'auto_park';
      return { ...acc, [isAutoPark ? 'GarageNumber' : key]: value };
    }, {} as any);
  });

export const simpleValuetwoDigits = (value: number): string => {
  if (Number(value) < 10) {
    return '0' + value;
  }
  return `${value}`;
};

const returnDateAndTime = (date: Date): string => {
  return `${date.getFullYear()}-${simpleValuetwoDigits(date.getMonth() + 1)}-${simpleValuetwoDigits(
    date.getDate()
  )}T${simpleValuetwoDigits(date.getHours())}:${simpleValuetwoDigits(date.getMinutes())}:${'00'}`;
};

export const returnDateForServer = (date: Date): string => (date ? returnDateAndTime(date) : '');

export const returnDateForFile = (date: Date): string =>
  date
    ? date?.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : '';
