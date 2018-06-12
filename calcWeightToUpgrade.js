import { STANDART_UPGRADE_SHARE, EXCHANGE_UPGRADE_SHARE } from './consts';

export default function calcWeightToUpgrade(data) {
  const {
    scrapMetalsInfo: { weightForExchange585 },
    upgradesInfo: { addWeight585, upgradesWeight585, actualAddWeight585, actualUpgradeWeight585 },
    ordersInfo: { ordersWeightToCount585, ordersWeight585 },
    userInfo,
    errors
  } = data;

  const upgradeMode = userInfo ? userInfo.upgradeMode : null;
  const grams = userInfo ? userInfo.grams : null;
  const totalGrams = grams !== null ? grams.super + grams.usual : null;

  let maxUpgradeWeightForOrders585 = null;
  let minOrdersWeightForUpgrades585 = null;
  let weightToUpgrade585 = null;

  

  if (upgradeMode === null) {
    weightToUpgrade585 = 0;
  }
  
  if (upgradeMode === 'usual') {
    const shareToUpgrade = weightForExchange585 > 0
      ? EXCHANGE_UPGRADE_SHARE
      : STANDART_UPGRADE_SHARE
    ;
    maxUpgradeWeightForOrders585 = ordersWeightToCount585 * shareToUpgrade;
    minOrdersWeightForUpgrades585 = upgradesWeight585 / shareToUpgrade;
    if (upgradesWeight585 > totalGrams) {
      errors.upgradesInfo.push('Граммов на счет меньше, чем масса выбранных изделий');
    } else if (maxUpgradeWeightForOrders585 < upgradesWeight585) {
      errors.upgradesInfo.push('Масса выбранных изделий в прокачку больше максимально разрешенной массы');
    } else {
      weightToUpgrade585 = actualAddWeight585 + actualUpgradeWeight585;
    }
  } 
  
  if (upgradeMode === 'super') {
    const shareToUpgrade = weightForExchange585 > 0
      ? 0
      : 1
    ;
    maxUpgradeWeightForOrders585 = shareToUpgrade !== 0 ? ordersWeight585 * shareToUpgrade : 0;
    minOrdersWeightForUpgrades585 = shareToUpgrade !== 0 ? upgradesWeight585 / shareToUpgrade : 0;

    if (upgradesWeight585 > grams.super) {
      errors.upgradesInfo.push('Граммов меньше, чем масса выбранных изделий');
    } else if (maxUpgradeWeightForOrders585 < upgradesWeight585) {
      errors.upgradesInfo.push('Масса выбранных изделий в прокачку больше максимально разрешенной массы');
    } else {
      weightToUpgrade585 = actualAddWeight585 + actualUpgradeWeight585;
    }
  }


  return {
    ...data,
    upgradesInfo: {
      ...data.upgradesInfo,
      maxUpgradeWeightForOrders585,
      minOrdersWeightForUpgrades585,
      weightToUpgrade585
    }
  };
}