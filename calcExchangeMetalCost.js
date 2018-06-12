import { calc585weight, getAuShare } from './utils';
import { UPGRADE_METAL_COST, UPGRADE_METAL_TYPE,
  PURCHASE_METAL_COST, PURCHASE_METAL_TYPE,
  EXCHANGE_HIGH_METAL_COST, EXCHANGE_HIGH_METAL_TYPE,
  EXCHANGE_LOW_METAL_COST, EXCHANGE_LOW_METAL_TYPE } from './consts';
import _ from 'lodash';


export default function calcExchangeMetalCost(data) {
  const {
    ordersInfo: {
      ordersWeightWithoutSales585,
      ordersCost,
      discounts
    },
    scrapMetalsInfo,
    upgradesInfo: {
      actualAddWeight585,
      actualUpgradeWeight585
    }
  } = data;

  let { metals, isPurchase, weightForExchange585, weightForPurchase585 } = scrapMetalsInfo;

  const discount = discounts.ordersDiscount + discounts.extraDiscount;
  const upgradeMetalCost = (actualAddWeight585 + actualUpgradeWeight585) * UPGRADE_METAL_COST;

  metals.forEach(metal => metal.parts = []);

  metals = setMetalParts(metals, actualAddWeight585, UPGRADE_METAL_COST, UPGRADE_METAL_TYPE);

  if (isPurchase) {
    metals = setMetalParts(metals, weightForPurchase585, PURCHASE_METAL_COST, PURCHASE_METAL_TYPE);
  }

  if (!isPurchase) {
    if (weightForExchange585 < ordersWeightWithoutSales585) {
      metals = setMetalParts(metals, weightForExchange585, EXCHANGE_LOW_METAL_COST, EXCHANGE_LOW_METAL_TYPE);
    }
    if (weightForExchange585 >= ordersWeightWithoutSales585) {
      metals = setMetalParts(metals, ordersWeightWithoutSales585, EXCHANGE_HIGH_METAL_COST, EXCHANGE_HIGH_METAL_TYPE);

      const highCostExchangeSum = ordersWeightWithoutSales585 * EXCHANGE_HIGH_METAL_COST;
      const leftToPay = ordersCost - discount - upgradeMetalCost - highCostExchangeSum;
      let leftToExchange = weightForExchange585 - ordersWeightWithoutSales585;

      if (leftToExchange * EXCHANGE_LOW_METAL_COST <= leftToPay) {
        metals = setMetalParts(metals, leftToExchange, EXCHANGE_LOW_METAL_COST, EXCHANGE_LOW_METAL_TYPE);
      } else {
        const lowCostExchangeWeight = leftToPay / EXCHANGE_LOW_METAL_COST;
        metals = setMetalParts(metals, lowCostExchangeWeight, EXCHANGE_LOW_METAL_COST, EXCHANGE_LOW_METAL_TYPE);
        leftToExchange = leftToExchange - lowCostExchangeWeight;
        metals = setMetalParts(metals, leftToExchange, PURCHASE_METAL_COST, PURCHASE_METAL_TYPE);
      }
    }
  }

  const metalsCost = calcMetalsCost(metals);
  const toPay = ordersCost - metalsCost.totalCost - discount - upgradeMetalCost;

  data.scrapMetalsInfo = {
    ...scrapMetalsInfo,
    metals,
    metalsCost
  };
  data.ordersInfo.toPay = toPay;

  return data;
}

function getGramCost(gramCost585, probe) {
  return gramCost585 * (getAuShare(probe) / 0.585);
}

function setMetalParts(metals, workWeight585, metalCost585, operationType) {
  let currentPoint = 0;
  metals.forEach(metal => {
    const { probe } = metal;
    const leftMetalWeight = getLeftMetalWeight(metal);
    if (leftMetalWeight !== 0) {
      const nextPoint = currentPoint + leftMetalWeight * (getAuShare(probe) / 0.585);
      if (nextPoint <= workWeight585) {
        metal.parts.push({
          gramCost: getGramCost(metalCost585, probe),
          type: operationType,
          weight: leftMetalWeight
        });
      } else if (currentPoint < workWeight585 && nextPoint > workWeight585) {
        metal.parts.push({
          gramCost: getGramCost(metalCost585, probe),
          type: operationType,
          weight: (workWeight585 - currentPoint) * (0.585 / getAuShare(probe))
        });
      }
      currentPoint = nextPoint;
    }
  });

  return metals;
}

function getLeftMetalWeight(metal) {
  if (metal.parts.length === 0) return metal.weight;

  const usedWeight = metal.parts.reduce((sum, part) => sum += part.weight, 0);
  const leftWeight = metal.weight - usedWeight;

  if (_.round(leftWeight, 4) === 0) return 0;

  return leftWeight;
}

function calcMetalsCost(metals) {
  const metalsCost = {
    upgrade: { weight: 0, gramCost: 0 },
    exchangeHigh: { weight: 0, gramCost: 0 },
    exchangeLow: { weight: 0, gramCost: 0 },
    purchase: { weight: 0, gramCost: 0 },
    totalCost: 0
  };
  metals.forEach(metal => {
    metal.parts.forEach(part => {
      const partWeight585 = (part.weight / metal.weight) * calc585weight(metal, 'weight');
      let gramCost;

      switch (part.type) {
        case UPGRADE_METAL_TYPE:
          const { upgrade } = metalsCost;
          upgrade.weight += partWeight585;
          upgrade.gramCost = gramCost = UPGRADE_METAL_COST;
          break;
        case EXCHANGE_HIGH_METAL_TYPE:
          const { exchangeHigh } = metalsCost;
          exchangeHigh.weight += partWeight585;
          exchangeHigh.gramCost = gramCost = EXCHANGE_HIGH_METAL_COST;
          break;
        case EXCHANGE_LOW_METAL_TYPE:
          const { exchangeLow } = metalsCost;
          exchangeLow.weight += partWeight585;
          exchangeLow.gramCost = gramCost = EXCHANGE_LOW_METAL_COST;
          break;
        case PURCHASE_METAL_TYPE:
          const { purchase } = metalsCost;
          purchase.weight += partWeight585;
          purchase.gramCost = gramCost = PURCHASE_METAL_COST;
          break;
      }

      metalsCost.totalCost += partWeight585 * gramCost;
    });
  });

  return metalsCost;
}
