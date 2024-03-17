import React from 'react';
import parseISO from 'date-fns/parseISO';
import toString from 'lodash/toString';
import {
  Link,
} from '@strapi/design-system/v2';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

const CellValue = ({ type, value }) => {
  const { formatDate, formatTime, formatNumber, formatMessage } = useIntl();
  let formattedValue = typeof value === 'string' && !!formatMessage({ id: `${value}`, defaultMessage: '' }) ? formatMessage({ id: `${value}`, defaultMessage: '' }) : value;

  if (typeof value === 'string' && value?.includes('https://yandex.ru')) {
    return (
      <Link onClick={(e) => e.stopPropagation()} href={value}>{formatMessage({ id: `cell.value.geolocation` })}</Link>
    );
  }

  if (typeof value === 'string' && value?.includes('https://yadi.sk') || typeof value === 'string' &&  value?.includes('storage.yandexcloud.net')) {
    const links = value?.split(', ');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>
        {links?.map((link, i) => <Link onClick={(e) => e.stopPropagation()} href={link}>{`Фото ${i + 1}`}</Link>)}
      </div>
    );
  }

  if (type === 'boolean') {
    formattedValue = formatMessage({ id: `cell.value.boolean.${value}` });
  }

  if (type === 'date') {
    formattedValue = formatDate(parseISO(value), { dateStyle: 'short' });
  }

  if (type === 'datetime') {
    const [date, time] = value?.split('T');
    const [year, month, day] = date?.split('-');
    const [h, m] = time.slice(0, 8)?.split(':');
    formattedValue = `${day}.${month}.${year}, ${h}:${m}`;
  }

  if (type === 'time') {
    const [hour, minute, second] = value.split(':');
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);

    formattedValue = formatTime(date, {
      numeric: 'auto',
      style: 'short',
    });
  }

  if (['float', 'decimal'].includes(type)) {
    formattedValue = formatNumber(value, {
      // Should be kept in sync with the corresponding value
      // in the design-system/NumberInput: https://github.com/strapi/design-system/blob/main/packages/strapi-design-system/src/NumberInput/NumberInput.js#L53
      maximumFractionDigits: 20,
    });
  }

  if (['integer', 'biginteger'].includes(type)) {
    formattedValue = formatNumber(value, { maximumFractionDigits: 0 });
  }

  return toString(formattedValue);
};

CellValue.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
};

export default CellValue;
