import { upgrades } from "./tests/fixtures";
import { calc585weight } from './utils';
import { DISCOUNT, UPGRADE_METAL_COST } from './consts';
import _ from 'lodash';

export default function calcDiscounts(data) {
  let {
    ordersInfo,
    scrapMetalsInfo: {
      weightForExchange585
    },
    upgradesInfo: {
      upgradesWeight585
    },
    userInfo,
    errors
  } = data;

  let { orders, paidParts, upgradeParts } = ordersInfo;
  let ordersDiscount = 0;
  let extraDiscount = 0; 

  const ordersWeightWithoutSales585 = _.reduce(paidParts, (sum, part, id) => {
    const { weight } = part;
    if (!orders[id]['tags'].includes('распродажа 20')) {
      sum += (weight / orders[id]['weight']) * calc585weight(orders[id], 'weight');
    }
    return sum;
  }, 0);

  if (userInfo === null || errors.upgradesInfo.length > 0) {
    paidParts = calcDiscountForPaidParts(ordersInfo, 0, 0);
  } else {
    if (ordersWeightWithoutSales585 < weightForExchange585) {
      paidParts = calcDiscountForPaidParts(ordersInfo, 0, DISCOUNT);
      upgradeParts = calcDiscountForUpgradeParts(ordersInfo)
    } else {
      paidParts = calcDiscountForPaidParts(ordersInfo, DISCOUNT, DISCOUNT);
      upgradeParts = calcDiscountForUpgradeParts(ordersInfo)
    }
  }

  const paidDiscount = _.reduce(paidParts, (sum, part, id) => sum += part.discount, 0);
  const upgradeDiscount = _.reduce(upgradeParts, (sum, part, id) => sum += part.discount, 0);

  ordersDiscount = paidDiscount + upgradeDiscount;

  ordersInfo = {
    ...ordersInfo,
    paidParts,
    upgradeParts,
    ordersWeightWithoutSales585,
    discounts: {
      ordersDiscount,
      extraDiscount
    }
  };

  return {
    ...data,
    ordersInfo
  };
  

  // Если масса металла в обмен больше, то скидки нет
  // Если рассрочка, то скидка такая-то
  // Если акционные изделия, то скидка акционная
}

export function calcDiscountForPaidParts(ordersInfo, auDiscPercent, agDiscPercent) {
  let { paidParts, orders } = ordersInfo;
  paidParts = _.forEach(paidParts, (part, id) => {
    let discount;
    const { cost, weight } = orders[id];
    if (orders[id]['tags'].includes('распродажа 20')) {
      discount = 0.20 * cost * (part.weight / weight);
    } else if (calc585weight(orders[id], 'weight') === 0) {
      discount = agDiscPercent * cost * (part.weight / weight);
    } else {
      discount = auDiscPercent * cost * (part.weight / weight);
    }
    part.discount = discount;
  });

  return paidParts;
}

export function calcDiscountForUpgradeParts(ordersInfo) {
  let { upgradeParts, orders } = ordersInfo;
  upgradeParts = _.forEach(upgradeParts, (part, id) => {
    const order = orders[id];
    const { weight } = part;
    const weight585 = (weight / order.weight) * calc585weight(order, 'weight');
    const upgradeMetalCost = weight585 * UPGRADE_METAL_COST;
    const upgradePartCost = order.cost * (weight / order.weight);
    const discount = upgradePartCost - upgradeMetalCost - (weight * order.productionCost);
    part.discount = discount;
  });
  return upgradeParts;
}