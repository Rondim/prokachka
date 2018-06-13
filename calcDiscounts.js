import { upgrades } from "./tests/fixtures";
import { calc585weight, isSales, getDiscountForSales } from './utils';
import { UPGRADE_METAL_COST, memberDiscounts } from './consts';
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
    if (!isSales(orders[id])) {
      sum += (weight / orders[id]['weight']) * calc585weight(orders[id], 'weight');
    }
    return sum;
  }, 0);

  if (userInfo === null || errors.upgradesInfo.length > 0) {
    paidParts = calcDiscountForPaidParts(ordersInfo, 0, 0);
  } else {
    const discount = memberDiscounts[userInfo.type];
    if (ordersWeightWithoutSales585 < weightForExchange585) {
      paidParts = calcDiscountForPaidParts(ordersInfo, 0, discount);
      upgradeParts = calcDiscountForUpgradeParts(ordersInfo);
    } else {
      paidParts = calcDiscountForPaidParts(ordersInfo, discount, discount);
      upgradeParts = calcDiscountForUpgradeParts(ordersInfo);
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
    const { cost: { retail }, weight } = orders[id];
    const discountPercent = (isSales(orders[id]))
      ? getDiscountForSales(orders[id])
      : (calc585weight(orders[id], 'weight') === 0)
        ? agDiscPercent
        : auDiscPercent
    ;

    part.discount = discountPercent * retail * (part.weight / weight);
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
    const upgradePartCost = order.cost.retail * (weight / order.weight);
    const discount = upgradePartCost - upgradeMetalCost - (weight * order.cost.costOfWork);
    part.discount = discount;
  });
  return upgradeParts;
}
