import React, { FC, useRef } from 'react';
import { DateTimePicker } from '@strapi/design-system';
import './styles.css';

type PropTypes = {
  onChange?: (value?: string) => void;
  value?: string;
  timeValue?: string;
  dateLabel?: string;
  timeLabel?: string;
  today?: Date;
};

const DateSelect: FC<PropTypes> = ({ onChange, value, dateLabel, today }) => {
  const dateRef = useRef(null);

  const onClearClick = (): void => {
    onChange?.(undefined);
  };

  return (
    <div className="data-to-excel-date-picker-container">
      <DateTimePicker
        ref={dateRef}
        onChange={onChange}
        value={value || undefined}
        label={dateLabel}
        initialDate={value}
        maxDate={today}
        locale="ru-RU"
        onClear={onClearClick}
      />
    </div>
  );
};

export default DateSelect;
