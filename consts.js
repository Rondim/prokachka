// это просто константы их не надо думаю выносить в конфиги

export const AU_SHARES = {
  'Au 585': 0.585,
  'Au 583': 0.583,
  'Au 500': 0.500,
  'Au 375': 0.375,
  'Au 750': 0.750,
  'Au 9999': 0.9999,
  'Au 900': 0.900,
  'Ag 925': 0
};

// Цены металлов в конфиг
export const UPGRADE_METAL_COST = 1400;
export const UPGRADE_METAL_TYPE = 'upgrade_1400';
export const PURCHASE_METAL_COST = 1350;
export const PURCHASE_METAL_TYPE = 'purchase_1350';
export const EXCHANGE_HIGH_METAL_COST = 1950;
export const EXCHANGE_HIGH_METAL_TYPE = 'exchange_1950';
export const EXCHANGE_LOW_METAL_COST = 1550;
export const EXCHANGE_LOW_METAL_TYPE = 'exchange_1550';

 // Данные необходимые для расчета productionCost,
 // скорее всего конфиг для сервера только
export const prodCostDefaults = {
  DEFAULT_METAL_COST: 1450,
  DEFAULT_UP: 1.774,
  DEFAULT_P_COST: 390,
  DEFAULT_DISCOUNT: 0.12
};

// Теги с распродажей в конфиг и соответствие скидок к тегам
export const SALES_TAGS = ['распродажа 20']; // список тегов для распродажи
export const salesDiscounts = {
  'распродажа 20': 0.20
};
// Скидки для разных пользователей в конфиг
export const memberDiscounts = {
  'SILVER': 0.12,
  'GOLD': 0.15,
  'PLATINUM': 0.18
};

// Доля, которую можно прокачать в конфиг
export const EXCHANGE_UPGRADE_SHARE = 0.25;
export const STANDART_UPGRADE_SHARE = 0.5;
