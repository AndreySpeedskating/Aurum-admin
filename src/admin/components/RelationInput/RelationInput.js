import React, { useRef, useState, useMemo, useEffect, forwardRef } from 'react';

import {
  Status,
  Box,
  Link,
  Icon,
  Flex,
  TextButton,
  Typography,
  Tooltip,
  VisuallyHidden,
  Combobox,
  Tag,
  Checkbox,
} from '@strapi/design-system';
import { Cross, Refresh, Information } from '@strapi/icons';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';

import { usePrev } from '../../hooks';

// import { Option } from './components/Option';
import { RelationItem } from './components/RelationItem';
import { RelationList } from './components/RelationList';
import { RELATION_GUTTER, RELATION_ITEM_HEIGHT } from './constants';

const roleAlias = {
  4: 'Механик',
  3: 'Водитель',
};

export const LinkEllipsis = styled(Link)`
  display: block;

  > span {
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
`;

export const TextInfo = styled(Typography)`
  white-space: pre-wrap;
`;

export const CheckBoxItem = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 6px;
  margin: 6px 0;
  cursor: pointer;
`;

export const DisconnectButton = styled.button`
  height: 16px;
  svg path {
    fill: ${({ theme, disabled }) =>
      disabled ? theme.colors.neutral600 : theme.colors.neutral500};
  }

  &:hover svg path,
  &:focus svg path {
    fill: ${({ theme, disabled }) => !disabled && theme.colors.neutral600};
  }
`;

const RelContainer = styled.div`
  position: relative;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 4px 0;
`;

const RelationInput = ({
  canReorder,
  description,
  disabled,
  error,
  iconButtonAriaLabel,
  id,
  name,
  numberOfRelationsToDisplay,
  label,
  labelAction,
  labelLoadMore,
  labelDisconnectRelation,
  listAriaDescription,
  liveText,
  loadingMessage,
  onCancel,
  onDropItem,
  onGrabItem,
  noRelationsMessage,
  onRelationConnect,
  onRelationLoadMore,
  onRelationDisconnect,
  onRelationReorder,
  onSearchNextPage,
  onSearch,
  placeholder,
  publicationStateTranslations,
  required,
  relations: paginatedRelations,
  searchResults,
  size,
}) => {
  const [textValue, setTextValue] = useState('');
  const [overflow, setOverflow] = useState('');

  const listRef = useRef();
  const outerListRef = useRef();
  const comboRef = useRef();

  const { data } = searchResults;

  const relations = paginatedRelations.data;
  const totalNumberOfRelations = relations.length ?? 0;

  const dynamicListHeight = useMemo(
    () =>
      totalNumberOfRelations > numberOfRelationsToDisplay
        ? Math.min(totalNumberOfRelations, numberOfRelationsToDisplay) *
            (RELATION_ITEM_HEIGHT + RELATION_GUTTER) +
          RELATION_ITEM_HEIGHT / 2
        : Math.min(totalNumberOfRelations, numberOfRelationsToDisplay) *
          (RELATION_ITEM_HEIGHT + RELATION_GUTTER),
    [totalNumberOfRelations, numberOfRelationsToDisplay]
  );

  const shouldDisplayLoadMoreButton = !!labelLoadMore && paginatedRelations.hasNextPage;

  const options = useMemo(
    () =>
      data
        .flat()
        .filter(Boolean)
        .map((result) => ({
          ...result,
          value: result.id,
          label: result.mainField || roleAlias[result.id],
        })),
    [data, relations]
  );

  useEffect(() => {
    if (totalNumberOfRelations <= numberOfRelationsToDisplay) {
      return setOverflow('');
    }

    const handleNativeScroll = (e) => {
      const parentScrollContainerHeight = e.target.parentNode.scrollHeight;
      const maxScrollBottom = e.target.scrollHeight - e.target.scrollTop;

      if (e.target.scrollTop === 0) {
        return setOverflow('bottom');
      }

      if (maxScrollBottom === parentScrollContainerHeight) {
        return setOverflow('top');
      }

      return setOverflow('top-bottom');
    };

    const outerListRefCurrent = outerListRef?.current;

    if (!paginatedRelations.isLoading && relations.length > 0 && outerListRefCurrent) {
      outerListRef.current.addEventListener('scroll', handleNativeScroll);
    }

    return () => {
      if (outerListRefCurrent) {
        outerListRefCurrent.removeEventListener('scroll', handleNativeScroll);
      }
    };
  }, [paginatedRelations, relations, numberOfRelationsToDisplay, totalNumberOfRelations]);

  useEffect(() => {
    if (shouldDisplayLoadMoreButton) {
      handleLoadMore();
    }
  }, [shouldDisplayLoadMoreButton]);

  useEffect(() => {
    if (comboRef?.current && relations?.length) {
      const listContainer = comboRef?.current?.previousElementSibling;
      if (listContainer) {
        listContainer.style['width'] = 'fit-content';
        listContainer.style['max-width'] = '60%';
      }
    }
  }, [comboRef?.current, relations]);

  const handleMenuOpen = (isOpen) => {
    if (isOpen) {
      onSearch();
    }
  };

  /**
   *
   * @param {number} newIndex
   * @param {number} currentIndex
   *
   * @returns {void}
   */
  const handleUpdatePositionOfRelation = (newIndex, currentIndex) => {
    if (onRelationReorder && newIndex >= 0 && newIndex < relations.length) {
      onRelationReorder(currentIndex, newIndex);
    }
  };

  const previewRelationsLength = usePrev(relations.length);
  /**
   * @type {React.MutableRefObject<'onChange' | 'loadMore'>}
   */
  const updatedRelationsWith = useRef();

  const handleLoadMore = () => {
    updatedRelationsWith.current = 'loadMore';
    onRelationLoadMore();
  };

  useEffect(() => {
    if (updatedRelationsWith.current === 'onChange') {
      setTextValue('');
    }

    if (
      updatedRelationsWith.current === 'onChange' &&
      relations.length !== previewRelationsLength
    ) {
      listRef?.current?.scrollToItem(relations.length, 'end');
      updatedRelationsWith.current = undefined;
    } else if (
      updatedRelationsWith.current === 'loadMore' &&
      relations.length !== previewRelationsLength
    ) {
      listRef?.current?.scrollToItem(0, 'start');
      updatedRelationsWith.current = undefined;
    }
  }, [previewRelationsLength, relations]);

  const ariaDescriptionId = `${name}-item-instructions`;

  const onChangeHandler = (relationId) => {
    if (!relationId) {
      return;
    }
    onRelationConnect(options.find((opt) => opt.id === relationId));
    updatedRelationsWith.current = 'onChange';
  };

  const getTooltip = (arr) => arr?.slice(5)?.map((el) => el?.name)?.join(', ');

  return (
    <Flex gap={3} justifyContent="space-between" alignItems="end" wrap="wrap">
      <Flex direction="column" alignItems="stretch" basis={'100%'} gap={2}>
        <Combobox
          style={{ width: '60%', minWidth: '60%' }}
          ref={comboRef}
          autocomplete="list"
          error={error}
          name={name}
          hint={description}
          id={id}
          required={required}
          label={label}
          labelAction={labelAction}
          disabled={disabled}
          placeholder={placeholder}
          hasMoreItems={searchResults.hasNextPage}
          loading={searchResults.isLoading}
          onOpenChange={handleMenuOpen}
          noOptionsMessage={() => noRelationsMessage}
          loadingMessage={loadingMessage}
          onLoadMore={() => {
            onSearchNextPage();
          }}
          textValue={textValue}
          startIcon={relations.length > 0 && (
            <RelContainer>
              {relations?.slice(0, 5)?.map((relation, index) => (
                <ListItem
                  key={`${relation.mainField}_${relation.id}`}
                  data={{
                    name,
                    ariaDescribedBy: ariaDescriptionId,
                    canDrag: canReorder,
                    disabled,
                    handleCancel: onCancel,
                    handleDropItem: onDropItem,
                    handleGrabItem: onGrabItem,
                    iconButtonAriaLabel,
                    labelDisconnectRelation,
                    onRelationDisconnect,
                    publicationStateTranslations,
                    relation,
                    updatePositionOfRelation: handleUpdatePositionOfRelation,
                  }}
                />
              ))}
              {relations?.length > 5 && (
                <ListItem
                  isInfo={true}
                  tooltipText={getTooltip(relations)}
                  data={{
                    name,
                    ariaDescribedBy: ariaDescriptionId,
                    canDrag: canReorder,
                    disabled,
                    handleCancel: onCancel,
                    handleDropItem: onDropItem,
                    handleGrabItem: onGrabItem,
                    iconButtonAriaLabel,
                    labelDisconnectRelation,
                    onRelationDisconnect,
                    publicationStateTranslations,
                    relation: { ...relations[5], href: false, mainField: `+ ${relations?.length - 5}` }
                  }}
                />
              )}
            </RelContainer>
          )}
          onChange={onChangeHandler}
          onTextValueChange={(text) => {
            setTextValue(text);
          }}
          onInputChange={(event) => {
            onSearch(event.currentTarget.value);
          }}
        >
          {options?.filter((opt) => opt.label).map((opt) => {
            const isChecked = relations?.find((relation) => relation?.id === opt?.id);
            return <CheckBoxItem key={opt.id} onClick={() => !!isChecked ? onRelationDisconnect(isChecked) : onChangeHandler(opt?.id)} {...opt}><Checkbox {...opt} checked={!!isChecked} /><Typography styles={{ margin: '0' }}>{opt?.label}</Typography></CheckBoxItem>;
          })}
        </Combobox>
      </Flex>
    </Flex>
  );
};

const RelationsResult = PropTypes.shape({
  data: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      id: PropTypes.number.isRequired,
      publicationState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      mainField: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  hasNextPage: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSuccess: PropTypes.bool.isRequired,
});

const SearchResults = PropTypes.shape({
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      href: PropTypes.string,
      mainField: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      publicationState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    })
  ),
  hasNextPage: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isSuccess: PropTypes.bool.isRequired,
});

RelationInput.defaultProps = {
  canReorder: false,
  description: undefined,
  disabled: false,
  error: undefined,
  labelAction: null,
  labelLoadMore: null,
  liveText: undefined,
  onCancel: undefined,
  onDropItem: undefined,
  onGrabItem: undefined,
  required: false,
  relations: { data: [] },
  searchResults: { data: [] },
};

RelationInput.propTypes = {
  error: PropTypes.string,
  canReorder: PropTypes.bool,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  iconButtonAriaLabel: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelAction: PropTypes.element,
  labelLoadMore: PropTypes.string,
  labelDisconnectRelation: PropTypes.string.isRequired,
  listAriaDescription: PropTypes.string.isRequired,
  liveText: PropTypes.string,
  loadingMessage: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  noRelationsMessage: PropTypes.string.isRequired,
  numberOfRelationsToDisplay: PropTypes.number.isRequired,
  onCancel: PropTypes.func,
  onDropItem: PropTypes.func,
  onGrabItem: PropTypes.func,
  onRelationConnect: PropTypes.func.isRequired,
  onRelationDisconnect: PropTypes.func.isRequired,
  onRelationLoadMore: PropTypes.func.isRequired,
  onRelationReorder: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSearchNextPage: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  publicationStateTranslations: PropTypes.shape({
    draft: PropTypes.string.isRequired,
    published: PropTypes.string.isRequired,
  }).isRequired,
  required: PropTypes.bool,
  searchResults: SearchResults,
  size: PropTypes.number.isRequired,
  relations: RelationsResult,
};

/**
 * This is in a separate component to enforce passing all the props the component requires to react-window
 * to ensure drag & drop correctly works.
 */
const ListItem = ({ isInfo, data, index, style, icon, tooltipText }) => {
  const {
    ariaDescribedBy,
    canDrag,
    disabled,
    handleCancel,
    handleDropItem,
    handleGrabItem,
    iconButtonAriaLabel,
    name,
    labelDisconnectRelation,
    onRelationDisconnect,
    publicationStateTranslations,
    relation,
    updatePositionOfRelation,
  } = data;
  const { publicationState, href, mainField, id } = relation;
  const statusColor = publicationState === 'draft' ? 'secondary' : 'success';

  return (
    <RelationItem
      ariaDescribedBy={ariaDescribedBy}
      canDrag={false}
      disabled={disabled}
      displayValue={String(mainField ?? id)}
      iconButtonAriaLabel={iconButtonAriaLabel}
      id={id}
      index={index}
      name={name}
      endAction={
        <DisconnectButton
          data-testid={`remove-relation-${id}`}
          disabled={disabled}
          type="button"
          onClick={isInfo ? () => undefined : () => onRelationDisconnect(relation)}
          aria-label={labelDisconnectRelation}
        >
          {isInfo ? (
            <Tooltip
              id={'tooltip-select'}
              description={tooltipText}
            >
              <Icon width="12px" as={Information} />
            </Tooltip>
          ) : <Icon width="12px" as={Cross} />}
        </DisconnectButton>
      }
      onCancel={handleCancel}
      onDropItem={handleDropItem}
      onGrabItem={handleGrabItem}
      status={publicationState || undefined}
      style={{
        ...(style && { style }),
        width: 'fit-content',
        display: 'flex',
        listStyle: 'none',
        bottom: style?.bottom ?? 0 + RELATION_GUTTER,
        height: style?.height ?? 0 - RELATION_GUTTER,
      }}
      updatePositionOfRelation={updatePositionOfRelation}
    >
      <Box style={{ padding: '0 0 0 6px' }}>
        {isInfo ? (
            <TextInfo textColor={disabled ? 'neutral600' : 'primary600'} ellipsis>
              {mainField ?? id}
            </TextInfo>
          ) : (
            <Tooltip description={mainField ?? `${id}`}>
              {href ? (
                <LinkEllipsis to={href}>{mainField ?? id}</LinkEllipsis>
              ) : (
                <TextInfo textColor={disabled ? 'neutral600' : 'primary600'} ellipsis>
                  {mainField || roleAlias[id]}
                </TextInfo>
              )}
            </Tooltip>
          )}
      </Box>

      {publicationState && (
        <Status variant={statusColor} showBullet={false} size="S">
          <Typography fontWeight="bold" textColor={`${statusColor}700`}>
            {publicationStateTranslations[publicationState]}
          </Typography>
        </Status>
      )}
    </RelationItem>
  );
};

ListItem.defaultProps = {
  data: {},
};

ListItem.propTypes = {
  data: PropTypes.shape({
    ariaDescribedBy: PropTypes.string.isRequired,
    canDrag: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func,
    handleDropItem: PropTypes.func,
    handleGrabItem: PropTypes.func,
    iconButtonAriaLabel: PropTypes.string.isRequired,
    labelDisconnectRelation: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onRelationDisconnect: PropTypes.func.isRequired,
    publicationStateTranslations: PropTypes.shape({
      draft: PropTypes.string.isRequired,
      published: PropTypes.string.isRequired,
    }).isRequired,
    relations: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        id: PropTypes.number.isRequired,
        publicationState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        mainField: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
    updatePositionOfRelation: PropTypes.func.isRequired,
  }),
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default RelationInput;
