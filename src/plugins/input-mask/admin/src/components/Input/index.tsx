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
  title,
  onChange,
  placeholder,
  required,
  value,
}: any) {
  const ref = useRef(null);
  const { formatMessage } = useIntl();

  const formatter = (value: string): string => {
    const clearValue = value?.replace(/[^\d.]+/g, '');
    const currentValue = clearValue?.slice(0, clearValue?.[1] === '.' ? 4 : 5)?.split('');
    return currentValue?.reduce((acc, val, i) => {
      if (i === 0 && val === '0') {
        return '';
      }
      if (i === 2 && !acc.includes('.') && val !== '.') {
        return acc + `.${val}`;
      }
      if (acc.includes('.') && val === '.') {
        return acc;
      }
      return acc + val;
    }, '');
  };

  const onChangeHandler = (event: any): void => {
    const {
      target: { value },
    } = event;
    const newValue = formatter(value);
    onChange({ target: { name, value: newValue ? `${newValue}` : '', type: 'string' } });
  };

  const onKeyDown = (e: any) => {
    if (e.code === 'Backspace') {
      const lastChar = e?.target?.value[e?.target?.value?.length - 1];
      if (lastChar === '.') {
        const value = e?.target?.value?.slice(0, e?.target?.value?.length - 1);
        onChange({ target: { name, value, type: 'string' } });
      }
    }
  };

  return (
    <Field id={name} name={name} hint={intlDescription?.id} error={error} required={required}>
      <Flex direction="column" alignItems="flex-start" gap={1}>
        <FieldLabel>{formatMessage({ id: intlLabel?.id })}</FieldLabel>
        <FieldInput
          ref={ref}
          disabled={disabled}
          onChange={onChangeHandler}
          value={value || ''}
          name={name}
          placeHolder={''}
          inputMode="decimal"
          required={!!required}
          onKeyDown={onKeyDown}
        />
      </Flex>
    </Field>
  );
}
