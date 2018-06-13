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
    testOrders.push({
      id: '4',
      probe: 'Au 585',
      weight: 4,
      cost: {
        retail: 14400,
        costOfWork: 390,
      },
      tags: []
    });
  });
  describe('isPurchase false', () => {
    it('weightForExchange < ordersWeightWithoutSales', () => {
      testUpgrades = [{
        id: '31', probe: 'Au 585', weight: 1.7, weightOfMetal: 1.6
      }];
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      data = calcExchangeMetalCost(data);
      const {
        scrapMetalsInfo: { metals, metalsCost }
      } = data;

      expect(metals[0]['parts'][0]['weight']).toBeCloseTo(0.1);
      expect(metals[0]['parts'][0]['gramCost']).toBeCloseTo(1400);
      expect(metals[0]['parts'][0]['type']).toBe('upgrade_1400');
      expect(metals[0]['parts'][1]['weight']).toBeCloseTo(0.95);
      expect(metals[0]['parts'][1]['gramCost']).toBeCloseTo(1550);
      expect(metals[0]['parts'][1]['type']).toBe('exchange_1550');
      expect(metals[1]['parts'][0]['weight']).toBeCloseTo(2.03);
      expect(metals[1]['parts'][0]['gramCost']).toBeCloseTo(1544.7009, 4);
      expect(metals[1]['parts'][0]['type']).toBe('exchange_1550');
      expect(metals[2]['parts'][0]['weight']).toBeCloseTo(1.34);
      expect(metals[2]['parts'][0]['gramCost']).toBeCloseTo(993.5897, 4);
      expect(metals[2]['parts'][0]['type']).toBe('exchange_1550');
    });
    it('weightForExchange > ordersWeightWithoutSales, but metalCost < toPay', () => {
      testUpgrades = [{
        id: '31', probe: 'Au 585', weight: 1.7, weightOfMetal: 1.6
      }];
      testScrapMetals.metals.push({
        weight: 4, probe: 'Au 585'
      });

      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      data = calcExchangeMetalCost(data);
      const {
        scrapMetalsInfo: { metals, metalsCost }
      } = data;

      expect(metals[0]['parts'][0]['weight']).toBeCloseTo(0.1);
      expect(metals[0]['parts'][0]['gramCost']).toBeCloseTo(1400);
      expect(metals[0]['parts'][0]['type']).toBe('upgrade_1400');
      expect(metals[0]['parts'][1]['weight']).toBeCloseTo(0.95);
      expect(metals[0]['parts'][1]['gramCost']).toBeCloseTo(1950);
      expect(metals[0]['parts'][1]['type']).toBe('exchange_1950');
      expect(metals[1]['parts'][0]['weight']).toBeCloseTo(2.03);
      expect(metals[1]['parts'][0]['gramCost']).toBeCloseTo(1943.3333, 4);
      expect(metals[1]['parts'][0]['type']).toBe('exchange_1950');
      expect(metals[2]['parts'][0]['weight']).toBeCloseTo(1.34);
      expect(metals[2]['parts'][0]['gramCost']).toBeCloseTo(1250);
      expect(metals[2]['parts'][0]['type']).toBe('exchange_1950');
      expect(metals[3]['parts'][0]['weight']).toBeCloseTo(1.3834, 4);
      expect(metals[3]['parts'][0]['gramCost']).toBeCloseTo(1950);
      expect(metals[3]['parts'][0]['type']).toBe('exchange_1950');
      expect(metals[3]['parts'][1]['weight']).toBeCloseTo(2.61665, 5);
      expect(metals[3]['parts'][1]['gramCost']).toBeCloseTo(1550);
      expect(metals[3]['parts'][1]['type']).toBe('exchange_1550');
    });

    it('weightForExchange > ordersWeightWithoutSales, but metalCost < toPay', () => {
      testUpgrades = [{
        id: '31', probe: 'Au 585', weight: 1.7, weightOfMetal: 1.6
      }];
      testScrapMetals.metals.push({
        weight: 4, probe: 'Au 585'
      });

      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      data = calcExchangeMetalCost(data);
      const {
        scrapMetalsInfo: { metals, metalsCost }
      } = data;

      expect(metals[0]['parts'][0]['weight']).toBeCloseTo(0.1);
      expect(metals[0]['parts'][0]['gramCost']).toBeCloseTo(1400);
      expect(metals[0]['parts'][0]['type']).toBe('upgrade_1400');
      expect(metals[0]['parts'][1]['weight']).toBeCloseTo(0.95);
      expect(metals[0]['parts'][1]['gramCost']).toBeCloseTo(1950);
      expect(metals[0]['parts'][1]['type']).toBe('exchange_1950');
      expect(metals[1]['parts'][0]['weight']).toBeCloseTo(2.03);
      expect(metals[1]['parts'][0]['gramCost']).toBeCloseTo(1943.3333, 4);
      expect(metals[1]['parts'][0]['type']).toBe('exchange_1950');
      expect(metals[2]['parts'][0]['weight']).toBeCloseTo(1.34);
      expect(metals[2]['parts'][0]['gramCost']).toBeCloseTo(1250);
      expect(metals[2]['parts'][0]['type']).toBe('exchange_1950');
      expect(metals[3]['parts'][0]['weight']).toBeCloseTo(1.3834, 4);
      expect(metals[3]['parts'][0]['gramCost']).toBeCloseTo(1950);
      expect(metals[3]['parts'][0]['type']).toBe('exchange_1950');
      expect(metals[3]['parts'][1]['weight']).toBeCloseTo(2.61665, 5);
      expect(metals[3]['parts'][1]['gramCost']).toBeCloseTo(1550);
      expect(metals[3]['parts'][1]['type']).toBe('exchange_1550');
    });

    it('weightForExchange > ordersWeightWithoutSales and metalCost > toPay', () => {
      testUpgrades = [{
        id: '31', probe: 'Au 585', weight: 1.7, weightOfMetal: 1.6
      }];
      testScrapMetals.metals.push({
        weight: 15, probe: 'Au 585'
      });

      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      data = calcExchangeMetalCost(data);
      const {
        scrapMetalsInfo: { metals, metalsCost }
      } = data;

      expect(metals[0]['parts'][0]['weight']).toBeCloseTo(0.1);
      expect(metals[0]['parts'][0]['gramCost']).toBeCloseTo(1400);
      expect(metals[0]['parts'][0]['type']).toBe('upgrade_1400');
      expect(metals[0]['parts'][1]['weight']).toBeCloseTo(0.95);
      expect(metals[0]['parts'][1]['gramCost']).toBeCloseTo(1950);
      expect(metals[0]['parts'][1]['type']).toBe('exchange_1950');
      expect(metals[1]['parts'][0]['weight']).toBeCloseTo(2.03);
      expect(metals[1]['parts'][0]['gramCost']).toBeCloseTo(1943.3333, 4);
      expect(metals[1]['parts'][0]['type']).toBe('exchange_1950');
      expect(metals[2]['parts'][0]['weight']).toBeCloseTo(1.34);
      expect(metals[2]['parts'][0]['gramCost']).toBeCloseTo(1250);
      expect(metals[2]['parts'][0]['type']).toBe('exchange_1950');
      expect(metals[3]['parts'][0]['weight']).toBeCloseTo(1.3834, 4);
      expect(metals[3]['parts'][0]['gramCost']).toBeCloseTo(1950);
      expect(metals[3]['parts'][0]['type']).toBe('exchange_1950');
      expect(metals[3]['parts'][1]['weight']).toBeCloseTo(12.475097, 6);
      expect(metals[3]['parts'][1]['gramCost']).toBeCloseTo(1550);
      expect(metals[3]['parts'][1]['type']).toBe('exchange_1550');
      expect(metals[3]['parts'][2]['weight']).toBeCloseTo(1.14155, 5);
      expect(metals[3]['parts'][2]['gramCost']).toBeCloseTo(1350);
      expect(metals[3]['parts'][2]['type']).toBe('purchase_1350');
      expect(metalsCost.upgrade.weight).toBeCloseTo(0.1);
      expect(metalsCost.upgrade.gramCost).toBe(1400);
      expect(metalsCost.exchangeHigh.weight).toBeCloseTo(5.21538, 5);
      expect(metalsCost.exchangeHigh.gramCost).toBe(1950);
      expect(metalsCost.exchangeLow.weight).toBeCloseTo(12.475, 3);
      expect(metalsCost.exchangeLow.gramCost).toBe(1550);
      expect(metalsCost.purchase.weight).toBeCloseTo(1.14);
      expect(metalsCost.purchase.gramCost).toBe(1350);
      expect(metalsCost.totalCost).toBeCloseTo(31187.5);
    });
  });

  describe('isPurchase true', () => {
    beforeEach(() => {
      testScrapMetals.isPurchase = true;
    });
    it('weightForExchange = 0', () => {
      testUpgrades = [{
        id: '31', probe: 'Au 585', weight: 1.7, weightOfMetal: 1.6
      }];
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      data = calcExchangeMetalCost(data);
      const {
        scrapMetalsInfo: { metals, metalsCost, weightForExchange585 }
      } = data;

      expect(weightForExchange585).toBe(0);
      expect(metals[0]['parts'][0]['weight']).toBeCloseTo(0.1);
      expect(metals[0]['parts'][0]['gramCost']).toBeCloseTo(1400);
      expect(metals[0]['parts'][0]['type']).toBe('upgrade_1400');
      expect(metals[0]['parts'][1]['weight']).toBeCloseTo(0.95);
      expect(metals[0]['parts'][1]['gramCost']).toBeCloseTo(1350);
      expect(metals[0]['parts'][1]['type']).toBe('purchase_1350');
      expect(metals[1]['parts'][0]['weight']).toBeCloseTo(2.03);
      expect(metals[1]['parts'][0]['gramCost']).toBeCloseTo(1345.3846, 4);
      expect(metals[1]['parts'][0]['type']).toBe('purchase_1350');
      expect(metals[2]['parts'][0]['weight']).toBeCloseTo(1.34);
      expect(metals[2]['parts'][0]['gramCost']).toBeCloseTo(865.3846, 4);
      expect(metals[2]['parts'][0]['type']).toBe('purchase_1350');
    });
  });
});
