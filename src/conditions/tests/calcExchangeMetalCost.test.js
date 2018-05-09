import calcExchangeMetalCost from '../calcExchangeMetalCost';
import calcDiscounts from '../calcDiscounts';
import calcInitialData from '../calcInitialData';
import calcWeightToUpgrade from '../calcWeightToUpgrade';
import calcPaidAndUpgradeParts from '../calcPaidAndUpgradeParts';
import { auOrders, agOrders, scrapMetals, upgrades, user } from './fixtures';
import _ from 'lodash';

function init(orders, scrapMetals, upgrades, user) {
  let data = calcInitialData(orders, scrapMetals, upgrades, user);
  data = calcWeightToUpgrade(data);
  data = calcPaidAndUpgradeParts(data);
  data = calcDiscounts(data);
  return data;
}


describe('calcExchangeMetalCost', () => {
  let data, testOrders, testUpgrades, testScrapMetals, testUser;
  beforeEach(() => {
    testOrders = _.cloneDeep([...auOrders, ...agOrders]);
    testUpgrades = _.cloneDeep(upgrades);
    testScrapMetals = _.cloneDeep(scrapMetals);
    testUser = _.cloneDeep(user);
  });
  describe('isPurchase false', () => {
    beforeEach(() => {
      testOrders.push({
        id: '4',
        probe: 'AU_585',
        weight: 4,
        cost: 14400,
        productionCost: 390,
        tags: []
      });
    })

    it('works without scrapMetals', () => {
      testScrapMetals = { metals: [], isPurchase: false };
    });
    it('weightForExchange < ordersWeightWithoutSales', () => {
      testUpgrades = [{
        id: '31', probe: 'AU_585', weight: 1.7, actualWeight: 1.6
      }];
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      data = calcExchangeMetalCost(data);
      const {
        scrapMetalsInfo: { metalParts } 
      } = data;
      // console.log(data);

      // expect(metalParts['0'][])
    });
  });
});