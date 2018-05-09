import { calc585weight, arrToObjByKey, getAuShare } from './utils';
import _ from 'lodash';
// Здерь рассчитываем все необходимые данные из входящих данных,
// необходимые для дальнейшей логики

export default function calcInitialData(
  orders = [], 
  scrapMetals = { metals: [], isPurchase: false }, 
  upgrades = [], 
  user
) {
  // ORDERS
  // Посчитать для каждой покупки, какую массу золота в 585 учитывать
  // при расчете условий прокачки
  orders = setWeightToCountForOrders(orders);
  // Сортируем покупки в обратном порядке применения прокачки
  orders = sortOrders(orders);
  // Посчитать суммарное значение учитываемой массы Au
  // для прочкачки
  const ordersWeightToCount585 = orders.reduce((sum, order) => {
    return sum += order.weightToCount585;
  }, 0);
 
  // Посчитаем общую массу изделий
  const ordersWeight = orders.reduce((sum, order) => {
    return sum += order.weight;
  }, 0);
  // Также посчитаем общую массу золотых товаров в 585
  const ordersWeight585 = orders.reduce((sum, order) => {
    return sum += calc585weight(order, 'weight');
  }, 0);

  // UPGRADES
  // Посчитать значение массы прокачки,продаже
  const upgradesWeight585 = upgrades.reduce((sum, upgrade) => {
    return sum += calc585weight(upgrade, 'weight');
  }, 0);
  // Посчитать значение массы прокачки,
  // исходя из реальных масс изделий, которые принесли
  const actualUpgradeWeight585 = upgrades.reduce((sum, upgrade) => {
    return sum += calc585weight(upgrade, 'actualWeight');
  }, 0);
  // Посчитать массу, которую можно возместить ломом при прокачке
  const addWeight585 = upgradesWeight585 - actualUpgradeWeight585;
  
  // SCRAP METALS
  // Посчитать массу лома в 585
  const { metals, isPurchase } = scrapMetals;
  const scrapMetalsWeight585 = metals.reduce((sum, metal) => {
    return sum += calc585weight(metal, 'weight');
  }, 0);

  // СМЕШАННИЕ ОПЕРАЦИИ
  // Посчитаем массу для обмена за вычетом массы для прокачки
  // и саму массу лома используемую в прокачке
  const actualAddWeight585 = calcActualAddWeight(scrapMetalsWeight585, addWeight585);
  const weightForExchange585 = !isPurchase ? scrapMetalsWeight585 - actualAddWeight585 : 0;
  const weightForPurchase585 = isPurchase ? scrapMetalsWeight585 - actualAddWeight585 : 0;
  // Распределим actualAddWeight между upgrades причем
  // не учитывая 585
  upgrades = setActualAddWeight(upgrades, actualAddWeight585);

  const ordersInfo = {
    orders: arrToObjByKey('id', orders),
    sequence: orders.map(({ id }) => id),
    paidParts: null,
    upgradeParts: null,
    ordersWeight,
    ordersWeight585,
    ordersWeightToCount585,
    ordersWeightWithoutSales585: null,
    discounts: {
      ordersDiscount: null,
      extraDiscount: null
    }
  };

  const scrapMetalsInfo = {
    metals: arrToObjByKey(null, scrapMetals.metals),
    sequence: scrapMetals.metals.map((m, index) => index.toString()),
    metalParts: null,
    scrapMetalsWeight585,
    weightForExchange585,
    weightForPurchase585,
    isPurchase
  };

  const upgradesInfo = {
    upgrades: arrToObjByKey('id', upgrades),
    sequence: upgrades.map(({ id }) => id),
    upgradesWeight585,
    actualUpgradeWeight585,
    addWeight585,
    actualAddWeight585,
    maxUpgradeWeightForOrders585: null,
    minOrdersWeightForUpgrades585: null,
    weightToUpgrade585: null
  };

  const errors = {
    ordersInfo: [],
    scrapMetalsInfo: [],
    upgradesInfo: []
  };

  return {
    ordersInfo,
    scrapMetalsInfo,
    upgradesInfo,
    errors,
    userInfo: user ? user : null
  };
}

export function setWeightToCountForOrders(orders) {
  orders.forEach(order => {
    if (order['probe'] === 'AG_925' || order.tags.includes('распродажа 20')) {
      order['weightToCount585'] = 0;
    } else {
      order['weightToCount585'] = calc585weight(order, 'weight');
    }
  });
  return orders;
}

export function sortOrders(orders) {
  const notAuOrders = orders.filter(order => getAuShare(order.probe) === 0);
  const auSalesOrders = orders.filter(order => {
    return getAuShare(order.probe) !== 0 && order.tags.includes('распродажа 20');
  });
  const leftAuOrders = orders
    .filter(order => {
      return getAuShare(order.probe) !== 0 && !order.tags.includes('распродажа 20');
    })
    .sort((a, b) => {
      const aProductionCostIn585 = a.productionCost * (0.585 / getAuShare(a.probe));
      const bProductionCostIn585 = b.productionCost * (0.585 / getAuShare(b.probe));
      return bProductionCostIn585 - aProductionCostIn585;
    });

  return [...notAuOrders, ...auSalesOrders, ...leftAuOrders];
}

export function calcActualAddWeight(scrapMetalsWeight585, addWeight585) {
  let actualAddWeight = scrapMetalsWeight585 >= addWeight585
    ? addWeight585
    : scrapMetalsWeight585
  ;
  return actualAddWeight;
}

export function setActualAddWeight(upgrades, actualAddWeight585) {
  let current585 = actualAddWeight585;

  upgrades.forEach(upgrade => {
    const { weight, actualWeight } = upgrade;
    const maxActualWeight = weight - actualWeight;
    const maxActualWeight585 = maxActualWeight * (getAuShare(upgrade.probe) / 0.585);
    const newCurrent585 = current585 - maxActualWeight585;
    if (current585 <= 0) {
      upgrade.actualAddWeight = 0;
    } else if (current585 > 0 && newCurrent585 <= 0) {
      upgrade.actualAddWeight = current585 * (0.585 / getAuShare(upgrade.probe));
    } else {
      upgrade.actualAddWeight = _.round(maxActualWeight, 2);
    }
    current585 = newCurrent585;
  });

  return upgrades;
}