import { calc585weight, arrToObjByKey, getAuShare, isSales } from './utils';
import _ from 'lodash';

// import { SALES_TAGS } from './consts';
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
  // Посчитаем общую стоимость всех покупок
  const ordersCost = orders.reduce((sum, order) => {
    return sum += order.cost.retail;
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
    return sum += calc585weight(upgrade, 'weightOfMetal');
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
    ordersCost,
    ordersWeight,
    ordersWeight585,
    ordersWeightToCount585,
    ordersWeightWithoutSales585: null,
    discounts: {
      ordersDiscount: null,
      extraDiscount: null
    },
    toPay: null
  };

  const scrapMetalsInfo = {
    metals,
    metalsCost: null,
    scrapMetalsWeight585,
    weightForExchange585,
    weightForPurchase585,
    isPurchase
  };

  const upgradesInfo = {
    upgrades,
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
  return orders.map(order => {
    const au585weight = calc585weight(order, 'weight');
    const weightToCount585 = isSales(order) ? 0 : au585weight;
    return { ...order, weightToCount585 };
  });
}

export function sortOrders(orders) {
  const notAuOrders = orders.filter(order => getAuShare(order.probe) === 0);
  const auSalesOrders = orders.filter(order => {
    return getAuShare(order.probe) !== 0 && isSales(order);
  });
  const leftAuOrders = orders
    .filter(order => {
      return getAuShare(order.probe) !== 0 && !isSales(order);
    })
    .sort((a, b) => {
      const aProductionCostIn585 = a.cost.costOfWork * (0.585 / getAuShare(a.probe));
      const bProductionCostIn585 = b.cost.costOfWork * (0.585 / getAuShare(b.probe));
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
    const { weight, weightOfMetal } = upgrade;
    const maxActualWeight = weight - weightOfMetal;
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
