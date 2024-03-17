import React, { useRef } from 'react';
import { Field, FieldLabel, FieldInput, Flex } from '@strapi/design-system';
import { useIntl } from 'react-intl';

export default function PhoneInput({
  disabled,
  error,
  intlLabel,
  intlDescription,
  labelAction,
  name,
  onChange,
  placeholder,
  required,
  value,
}: any) {
  const ref = useRef(null);
  const { formatMessage } = useIntl();

  const phoneFormatter = (value: string): string => {
    const phone = value?.replace('+7', '')?.replace(/\D/g, '')?.slice(0, 10)?.split('');
    return `${phone?.length > 0 ? '(' : ''}${[
      phone['0'] || '',
      phone['1'] || '',
      phone['2'] || '',
    ]}${phone?.length >= 3 ? ')' : ''}${[phone['3'] || '', phone['4'] || '', phone['5'] || '']}${
      phone?.length > 6 ? '-' : ''
    }${[phone['6'] || '', phone['7'] || '']}${phone?.length > 8 ? '-' : ''}${[
      phone['8'] || '',
      phone['9'] || '',
    ]}`
      ?.split(',')
      ?.join('')
      ?.slice(0, 14);
  };

  const onChangeHandler = (event: any): void => {
    const {
      target: { value },
    } = event;
    const newValue = phoneFormatter(value);
    onChange({ target: { name, value: newValue ? `+7 ${newValue}` : '', type: 'string' } });
  };

  const onKeyDown = (e: any) => {
    if (e.code === 'Backspace') {
      const lastChar = e?.target?.value[e?.target?.value?.length - 1];
      if (lastChar === ')') {
        const value = e?.target?.value?.slice(0, e?.target?.value?.length - 1);
        onChange({ target: { name, value, type: 'string' } });
      }
    }
  };

  return (
    <Field id={name} name={name} hint={intlDescription?.id} error={error}>
      <Flex direction="column" alignItems="flex-start" gap={1}>
        <FieldLabel>{formatMessage({ id: intlLabel?.id })}</FieldLabel>
        <FieldInput
          ref={ref}
          disabled={disabled}
          onChange={onChangeHandler}
          value={value || ''}
          name={name}
          placeHolder={'Введите телефон'}
          required={!!required}
          onKeyDown={onKeyDown}
        />
      </Flex>
    </Field>
  );
}
