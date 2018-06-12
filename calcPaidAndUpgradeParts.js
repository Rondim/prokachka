import _ from 'lodash';
import { calc585weight } from './utils';

export default function calcPaidUpgradeParts(data) {
  const {
    ordersInfo: {
      orders,
      sequence
    },
    upgradesInfo: {
      weightToUpgrade585
    },
    userInfo,
    errors
  } = data;

  let paidParts = null;
  let upgradeParts = null;
  
  if (userInfo === null || errors.upgradesInfo.length > 0) {
    paidParts = {};
    upgradeParts = {};
    _.forEach(orders, (order, id) => {
      paidParts[id] = {
        parted: false,
        weight: order.weight
      };
    });
  } else if (userInfo) {
    paidParts = {};
    upgradeParts = {};

    let currentWeightToUpgrade = weightToUpgrade585;

    [...sequence].reverse().forEach(id => {
      const weight585 = calc585weight(orders[id], 'weight');
      const newWeightToUpgrade = currentWeightToUpgrade - weight585;
      if (newWeightToUpgrade >= 0) {
        upgradeParts[id] = { weight: orders[id]['weight'], parted: false }
      }
      if (currentWeightToUpgrade <= 0) {
        paidParts[id] = { weight: orders[id]['weight'], parted: false };
      }
      if (currentWeightToUpgrade > 0 && newWeightToUpgrade < 0) {
        upgradeParts[id] = { weight: currentWeightToUpgrade, parted: true },
        paidParts[id] = { 
          weight: orders[id]['weight'] - currentWeightToUpgrade, 
          parted: true 
        };
      }
      currentWeightToUpgrade = newWeightToUpgrade;
    });
  }

  
  
  return {
    ...data,
    ordersInfo: {
      ...data.ordersInfo,
      paidParts,
      upgradeParts
    }
  };
}