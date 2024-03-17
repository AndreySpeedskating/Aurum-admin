import React, { useState, useEffect } from 'react';
import xlsx, { IJsonSheet } from 'json-as-xlsx';
import {
  Alert,
  Button,
  Flex,
  ContentLayout,
  HeaderLayout,
  Main,
  Typography,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
import { getFetchClient } from '@strapi/helper-plugin';
import { Select, DateSelect } from './components';
import {
  getCookie,
  returnColumn,
  returnDateForFile,
  returnDateForServer,
  returnTableRow,
  toDayDate,
} from './helpers';
import { TYPE_ALIAS, WHITE_LIST } from './constants';
import apiHandler from './apiHandlers';

const today = new Date();
export const yesterday = new Date(new Date().setDate(today.getDate() - 1));
yesterday.setHours(0, 0);
today.setHours(23, 59);

const HomePage = () => {
  const [types, setTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState<any>(yesterday);
  const [selectedEndDate, setSelectedEndDate] = useState<any>(today);
  const { formatMessage } = useIntl();
  const { get } = getFetchClient();
  const jwt = getCookie('jwtRoles');
  const [data, setData] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const getTypes = async (): Promise<void> => {
    await get('content-manager/init').then((response: any) => {
      const results = response?.data?.data?.contentTypes;
      const collectionTypes = Object.keys(results)?.reduce((acc, key) => {
        if (
          results[key]?.kind === 'collectionType' &&
          results[key]?.isDisplayed &&
          WHITE_LIST.includes(results[key]?.uid)
        ) {
          return [...acc, results[key]];
        }
        return [...acc];
      }, [] as any[]);
      setSelectedType(collectionTypes?.[0]?.apiID);
      setTypes(collectionTypes);
    });
  };

  useEffect(() => {
    getTypes();
  }, []);

  const changeSelectHandler = async (value: any): Promise<void> => {
    setSelectedType(value);
  };

  const findDataHandler = async (): Promise<void> => {
    const selectedTypeObj = types?.find((collectionType) => collectionType.apiID === selectedType);
    if (!selectedStartDate) {
      setShowAlert(true);
      setData([]);
      setTimeout(() => {
        setShowAlert(false);
      }, 8000);
      return;
    }
    if (selectedTypeObj) {
      showAlert && setShowAlert(false);
      await apiHandler
        .getContent({
          content: selectedTypeObj.uid,
          startDate: `${returnDateForServer(selectedStartDate)}.000Z`,
          endDate: `${returnDateForServer(selectedEndDate)}.000Z`,
        })
        .then((response) => {
          setData(response);
          setShowResult(true);
          return response;
        })
        .catch(() => {
          setData([]);
        });
    }
  };

  const changeSelectStartDateHandler = (value: any): void => {
    setSelectedStartDate(value);
  };

  const changeSelectEndDateHandler = (value: any): void => {
    setSelectedEndDate(value);
  };

  const transferDataToExcel = (): void => {
    const xlsxData: IJsonSheet[] = [
      {
        sheet: TYPE_ALIAS[selectedType],
        columns: returnColumn(data, formatMessage) as any,
        content: returnTableRow(data),
      },
    ];
    const settings = {
      fileName: `${TYPE_ALIAS[selectedType]} - от ${returnDateForFile(selectedStartDate) || ''}`,
      extraLength: 3,
      writeMode: 'writeFile',
      writeOptions: {},
      RTL: false,
    };
    xlsx(xlsxData, settings);
  };

  return (
    <Main aria-busy="true">
      <HeaderLayout
        title={formatMessage({
          id: getTrad('page.title'),
        })}
        subtitle={`${formatMessage({ id: getTrad('page.date') })} ${toDayDate()}`}
      />
      <ContentLayout>
        <Flex gap={4} alignItems="flex-end">
          <Flex gap={4} alignItems="flex-end" wrap="wrap">
            <Select
              onChange={changeSelectHandler}
              intlLabel={formatMessage({ id: getTrad('select.title') })}
              description={formatMessage({ id: getTrad('select.description') })}
              value={selectedType}
              list={types}
              name="types"
            />
            <DateSelect
              onChange={changeSelectStartDateHandler}
              value={selectedStartDate}
              today={today}
              dateLabel={formatMessage({ id: getTrad('date.start.title') })}
              timeLabel={formatMessage({ id: getTrad('time.start.title') })}
            />
            <DateSelect
              onChange={changeSelectEndDateHandler}
              value={selectedEndDate}
              dateLabel={formatMessage({ id: getTrad('date.end.title') })}
              timeLabel={formatMessage({ id: getTrad('time.end.title') })}
            />
          </Flex>
          <Flex gap={4} alignItems="flex-end">
            <Button disabled={!selectedType} onClick={findDataHandler} size="L">
              {formatMessage({ id: getTrad('page.find.button') })}
            </Button>
            <Button disabled={data?.length === 0} onClick={transferDataToExcel} size="L">
              {formatMessage({ id: getTrad('page.export.button') })}
            </Button>
          </Flex>
        </Flex>
        <div style={{ marginTop: 24 }}>
          {showResult ? (
            <Typography variant="epsilon">{`По запросу найдено ${data?.length} записей (${TYPE_ALIAS[selectedType]})`}</Typography>
          ) : (
            ''
          )}
        </div>
        {showAlert && (
          <Alert
            onClose={() => setShowAlert(false)}
            closeLabel="Закрыть"
            title="Укажите начало периода"
            variant="danger"
          />
        )}
      </ContentLayout>
    </Main>
  );
};

export default HomePage;
