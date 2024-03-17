import React, { memo, useMemo } from 'react';

import { GenericInput, NotAllowedInput, useLibrary } from '@strapi/helper-plugin';
import {
  Link,
  theme,
} from '@strapi/design-system/v2';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import take from 'lodash/take';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { useContentTypeLayout } from '../../hooks';
import { getFieldName } from '../../utils';
import InputUID from '../InputUID';
import { RelationInputDataManager } from '../RelationInputDataManager';
import Wysiwyg from '../Wysiwyg';

import { connect, generateOptions, getInputType, select, VALIDATIONS_TO_OMIT } from './utils';
import styled from 'styled-components';

const PhotoContainer = styled.div`
  width: 100%;
  padding: 6px 12px;
  border-radius: 4px;
  border: ${({ theme }) => `1px solid ${theme.colors.neutral200}`};
`;

const Label = styled.span`
  margin-bottom: 4px;
  font-size: 0.75rem;
  line-height: 1.33;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral800};
`;

export const simpleValuetwoDigits = (value) => {
  if (Number(value) < 10) {
    return '0' + value;
  }
  return `${value}`;
}

const returnDateAndTime = (date) => {
  return `${date.getFullYear()}-${simpleValuetwoDigits(date.getMonth() + 1)}-${simpleValuetwoDigits(date.getDate())}T${simpleValuetwoDigits(date.getHours())}:${simpleValuetwoDigits(date.getMinutes())}:${'00'}`;
};

const returnValue = (value) => {
  if (value?.includes('Z')) {
    return value?.slice(0, -5);
  }
  return value;
}

function Inputs({
  allowedFields,
  componentUid,
  fieldSchema,
  formErrors,
  isCreatingEntry,
  keys,
  labelAction,
  metadatas,
  onChange,
  readableFields,
  shouldNotRunValidations,
  queryInfos,
  value,
  size,
  customFieldInputs,
}) {
  const { fields } = useLibrary();
  const { formatMessage } = useIntl();
  const { contentType: currentContentTypeLayout } = useContentTypeLayout();

  const disabled = useMemo(() => !get(metadatas, 'editable', true), [metadatas]);
  const { type, customField: customFieldUid } = fieldSchema;
  const error = get(formErrors, [keys], null);

  const fieldName = useMemo(() => {
    return getFieldName(keys);
  }, [keys]);

  const validations = useMemo(() => {
    const inputValidations = omit(
      fieldSchema,
      shouldNotRunValidations
        ? [...VALIDATIONS_TO_OMIT, 'required', 'minLength']
        : VALIDATIONS_TO_OMIT
    );

    const regexpString = fieldSchema.regex || null;

    if (regexpString) {
      const regexp = new RegExp(regexpString);

      if (regexp) {
        inputValidations.regex = regexp;
      }
    }

    return inputValidations;
  }, [fieldSchema, shouldNotRunValidations]);

  const isRequired = useMemo(() => get(validations, ['required'], false), [validations]);

  const isChildOfDynamicZone = useMemo(() => {
    const attributes = get(currentContentTypeLayout, ['attributes'], {});
    const foundAttributeType = get(attributes, [fieldName[0], 'type'], null);

    return foundAttributeType === 'dynamiczone';
  }, [currentContentTypeLayout, fieldName]);

  const inputType = getInputType(type);

  let inputValue = type === 'media' && !value ? [] : value;

  const isUserAllowedToEditField = useMemo(() => {
    const joinedName = fieldName.join('.');

    if (allowedFields.includes(joinedName)) {
      return true;
    }

    if (isChildOfDynamicZone) {
      return allowedFields.includes(fieldName[0]);
    }

    const isChildOfComponent = fieldName.length > 1;

    if (isChildOfComponent) {
      const parentFieldName = take(fieldName, fieldName.length - 1).join('.');

      return allowedFields.includes(parentFieldName);
    }

    return false;
  }, [allowedFields, fieldName, isChildOfDynamicZone]);

  const isUserAllowedToReadField = useMemo(() => {
    const joinedName = fieldName.join('.');

    if (readableFields.includes(joinedName)) {
      return true;
    }

    if (isChildOfDynamicZone) {
      return readableFields.includes(fieldName[0]);
    }

    const isChildOfComponent = fieldName.length > 1;

    if (isChildOfComponent) {
      const parentFieldName = take(fieldName, fieldName.length - 1).join('.');

      return readableFields.includes(parentFieldName);
    }

    return false;
  }, [readableFields, fieldName, isChildOfDynamicZone]);

  const shouldDisplayNotAllowedInput = useMemo(() => {
    return isUserAllowedToReadField || isUserAllowedToEditField;
  }, [isUserAllowedToEditField, isUserAllowedToReadField]);

  const shouldDisableField = useMemo(() => {
    if (!isCreatingEntry) {
      const doesNotHaveRight = isUserAllowedToReadField && !isUserAllowedToEditField;

      if (doesNotHaveRight) {
        return true;
      }

      return disabled;
    }

    return disabled;
  }, [disabled, isCreatingEntry, isUserAllowedToEditField, isUserAllowedToReadField]);

  const options = useMemo(
    () => generateOptions(fieldSchema.enum || [], isRequired),
    [fieldSchema, isRequired]
  );

  const { label, description, placeholder, visible } = metadatas;
  
  if (visible === false) {
    return null;
  }

  if (type.includes('datetime') && inputValue) {
    const date = returnDateAndTime(new Date(inputValue));
    inputValue = returnValue(date);
  }

  if (typeof value === 'string' && value?.includes('https://yadi.sk') || typeof value === 'string' && value?.includes('https://yandex.ru')) {
    const links = value?.split(', ');
    const linkLabel = value?.includes('https://yadi.sk') ? 'Фото заявки' : 'Координаты отправки';
    const linkName = value?.includes('https://yadi.sk') ? 'Фото' : 'Координаты';
    const linkFullName = (index) => linkName === 'Фото' ? `${linkName} ${index + 1}` : linkName; 
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 4 }}>
        <Label>{linkLabel}</Label>
        <PhotoContainer>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>
            {links?.map((link, i) => <Link onClick={(e) => e.stopPropagation()} href={link}>{linkFullName(i)}</Link>)}
          </div>
        </PhotoContainer>
      </div>
      
    )
  }

  if (!shouldDisplayNotAllowedInput) {
    return (
      <NotAllowedInput
        description={description ? { id: description, defaultMessage: description } : null}
        intlLabel={{ id: `content-manager.containers.ListPage.table-headers.${label}`, defaultMessage: label }}
        labelAction={labelAction}
        error={error && formatMessage(error)}
        name={keys}
        required={isRequired}
      />
    );
  }

  if (type === 'relation') {
    return (
      <RelationInputDataManager
        {...metadatas}
        {...fieldSchema}
        componentUid={componentUid}
        description={
          metadatas.description
            ? formatMessage({
                id: metadatas.description,
                defaultMessage: metadatas.description,
              })
            : undefined
        }
        intlLabel={{
          id: `content-manager.containers.ListPage.table-headers.${label}`,
          defaultMessage: metadatas.label,
        }}
        labelAction={labelAction}
        isUserAllowedToEditField={isUserAllowedToEditField}
        isUserAllowedToReadField={isUserAllowedToReadField}
        name={keys}
        placeholder={
          metadatas.placeholder
            ? {
                id: metadatas.placeholder,
                defaultMessage: metadatas.placeholder,
              }
            : null
        }
        queryInfos={queryInfos}
        size={size}
        value={value}
        error={error && formatMessage(error)}
      />
    );
  }

  const customInputs = {
    uid: InputUID,
    media: fields.media,
    wysiwyg: Wysiwyg,
    ...fields,
    ...customFieldInputs,
  };

  return (
    <GenericInput
      attribute={fieldSchema}
      autoComplete="new-password"
      intlLabel={{ id: `content-manager.containers.ListPage.table-headers.${label}`, defaultMessage: label }}
      // in case the default value of the boolean is null, attribute.default doesn't exist
      isNullable={inputType === 'bool' && [null, undefined].includes(fieldSchema.default)}
      description={description ? { id: description, defaultMessage: description } : null}
      disabled={shouldDisableField}
      error={error}
      labelAction={labelAction}
      contentTypeUID={currentContentTypeLayout.uid}
      customInputs={customInputs}
      multiple={fieldSchema.multiple || false}
      name={keys}
      onChange={onChange}
      options={options}
      placeholder={placeholder ? { id: placeholder, defaultMessage: placeholder } : null}
      required={fieldSchema.required || false}
      step={getStep(type)}
      type={customFieldUid || inputType}
      // validations={validations}
      value={inputValue}
      withDefaultValue={false}
    />
  );
}

Inputs.defaultProps = {
  componentUid: undefined,
  formErrors: {},
  labelAction: undefined,
  size: undefined,
  value: null,
  queryInfos: {},
  customFieldInputs: {},
};

Inputs.propTypes = {
  allowedFields: PropTypes.array.isRequired,
  componentUid: PropTypes.string,
  fieldSchema: PropTypes.object.isRequired,
  formErrors: PropTypes.object,
  keys: PropTypes.string.isRequired,
  isCreatingEntry: PropTypes.bool.isRequired,
  labelAction: PropTypes.element,
  metadatas: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  readableFields: PropTypes.array.isRequired,
  size: PropTypes.number,
  shouldNotRunValidations: PropTypes.bool.isRequired,
  value: PropTypes.any,
  queryInfos: PropTypes.shape({
    containsKey: PropTypes.string,
    defaultParams: PropTypes.object,
    endPoint: PropTypes.string,
  }),
  customFieldInputs: PropTypes.object,
};

const getStep = (type) => {
  switch (type) {
    case 'float':
    case 'decimal':
      return 0.01;
    default:
      return 1;
  }
};

const Memoized = memo(Inputs, isEqual);

export default connect(Memoized, select);
