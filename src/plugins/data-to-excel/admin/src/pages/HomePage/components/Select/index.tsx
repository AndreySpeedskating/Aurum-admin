import React, { useRef } from 'react';
import { Field, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import './styles.css';
import { TYPE_ALIAS } from '../../constants';

type PropTypes = {
  value: string;
  name: string;
  list?: {
    apiID: string;
    uuid: string;
  }[];
  onChange: (value?: string) => void;
  description?: string;
  intlLabel?: string;
  disabled?: boolean;
  required?: boolean;
};

export default function CargoList({
  list,
  value,
  name,
  onChange,
  description,
  intlLabel,
  required,
  disabled,
}: PropTypes) {
  const ref = useRef(null);

  const onChangeHandler = (value: string): void => {
    onChange?.(value);
  };

  const onClearHandler = (): void => {
    onChange?.(undefined);
  };

  return (
    <Field id={`${name}`} name={`${name}`} hint={`${description}`} required={!!required}>
      <div className="select_data_export">
        <SingleSelect
          ref={ref}
          label={`${intlLabel}`}
          name={name}
          disabled={disabled}
          onChange={onChangeHandler}
          value={value || ''}
          placeHolder={'Выберите груз'}
          required={!!required}
          onClear={onClearHandler}>
          {list?.map((item) => (
            <SingleSelectOption key={`${item}`} id={`${item.uuid}`} value={item.apiID}>{`${
              TYPE_ALIAS[item.apiID]
            }`}</SingleSelectOption>
          ))}
        </SingleSelect>
      </div>
    </Field>
  );
}
