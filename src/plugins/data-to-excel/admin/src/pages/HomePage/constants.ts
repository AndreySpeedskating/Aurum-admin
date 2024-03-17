export const TYPE_ALIAS: { [key: string]: string } = {
  cargo: 'Груз',
  user: 'Пользователи',
  'auto-park': 'Транспорт',
  counterpartie: 'Контрагенты',
  application: 'Накладные',
  'unloading-point': 'Точки разгрузки',
  'loading-point': 'Точки погрузки',
};

export const BOOLEAN_ALIAS = {
  false: 'Нет',
  true: 'Да',
};

export const WHITE_LIST = ['api::application.application', 'api::auto-park.auto-park', 'api::cargo.cargo', 'api::counterpartie.counterpartie', 'api::loading-point.loading-point', 'api::unloading-point.unloading-point'];
