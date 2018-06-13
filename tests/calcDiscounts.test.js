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

  return data;
}

describe('calcDiscounts', () => {
  let data, testOrders, testUpgrades, testScrapMetals, testUser;
  beforeEach(() => {
    testOrders = _.cloneDeep([...auOrders, ...agOrders]);
    testUpgrades = _.cloneDeep(upgrades);
    testScrapMetals = _.cloneDeep(scrapMetals);
    testUser = _.cloneDeep(user);
  });

  describe('no user or there are errors', () => {
    it('discount should be 0, sales should be 20%', () => {
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      const {
        ordersInfo: { paidParts, upgradeParts, discounts },
        errors
      } = calcDiscounts(data);
      expect(errors.upgradesInfo.length).toBe(1);
      expect(paidParts['1']['discount']).toBeCloseTo(0);
      expect(paidParts['2']['discount']).toBeCloseTo(1648);
      expect(paidParts['11']['discount']).toBeCloseTo(0);
      expect(paidParts['11']['discount']).toBeCloseTo(0);
      expect(upgradeParts).toEqual({});
      expect(discounts.ordersDiscount).toBeCloseTo(1648);
      expect(discounts.extraDiscount).toBeCloseTo(0);
    });
  });

  describe('no upgrades with user', () => {
    beforeEach(() => {
      testUpgrades = [];
    });

    it('works without exchanges', () => {
      testScrapMetals = { metals: [], isPurchase: false };
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      const {
        ordersInfo: { paidParts, upgradeParts, discounts },
        errors
      } = calcDiscounts(data);
      expect(errors.upgradesInfo.length).toBe(0);
      expect(paidParts['1']['discount']).toBeCloseTo(670.8);
      expect(paidParts['2']['discount']).toBeCloseTo(1648);
      expect(paidParts['11']['discount']).toBeCloseTo(213.6);
      expect(upgradeParts).toEqual({});
      expect(discounts.ordersDiscount).toBeCloseTo(3386.8);
      expect(discounts.extraDiscount).toBeCloseTo(0);
    })
    it('works with exchanges < ordersWeightWithoutSales', () => {
      testScrapMetals.metals = [testScrapMetals.metals[0]];
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      const {
        ordersInfo: { paidParts, upgradeParts, discounts },
        errors
      } = calcDiscounts(data);

      expect(errors.upgradesInfo.length).toBe(0);
      expect(paidParts['1']['discount']).toBeCloseTo(670.8);
      expect(paidParts['2']['discount']).toBeCloseTo(1648);
      expect(paidParts['11']['discount']).toBeCloseTo(213.6);
      expect(upgradeParts).toEqual({});
      expect(discounts.ordersDiscount).toBeCloseTo(3386.8);
      expect(discounts.extraDiscount).toBeCloseTo(0);
    })

    it('works with exchanges >= ordersWeightWithoutSales', () => {
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      const {
        ordersInfo: { paidParts, upgradeParts, discounts },
        errors
      } = calcDiscounts(data);

      expect(errors.upgradesInfo.length).toBe(0);
      expect(paidParts['1']['discount']).toBeCloseTo(0);
      expect(paidParts['2']['discount']).toBeCloseTo(1648);
      expect(paidParts['11']['discount']).toBeCloseTo(213.6);
      expect(upgradeParts).toEqual({});
      expect(discounts.ordersDiscount).toBeCloseTo(2125.6);
      expect(discounts.extraDiscount).toBeCloseTo(0);
    })
  });
  describe('with upgrades, with user', () => {
    beforeEach(() => {
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
    it('works without exchanges', () => {
      testScrapMetals = { metals: [], isPurchase: false };
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      const {
        ordersInfo: { paidParts, upgradeParts, discounts },
        errors
      } = calcDiscounts(data);

      expect(errors.upgradesInfo.length).toBe(0);
      expect(upgradeParts['1']['discount']).toBeCloseTo(2846.5);
      expect(upgradeParts['4']['discount']).toBeCloseTo(2270.3897, 4);
      expect(paidParts['11']['discount']).toBeCloseTo(213.6);
      expect(paidParts['2']['discount']).toBeCloseTo(1648);
      expect(paidParts['3']['discount']).toBeCloseTo(590.4);
      expect(paidParts['4']['discount']).toBeCloseTo(1186.1169, 4);
    })
    it('works with exchanges < ordersWeightWithoutSales', () => {
      testUpgrades = [{
        id: '31', probe: 'Au 585', weight: 1.7, weightOfMetal: 1.6
      }];
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      const {
        ordersInfo: { paidParts, upgradeParts, discounts },
        errors
      } = calcDiscounts(data);

      expect(errors.upgradesInfo.length).toBe(0);
      expect(upgradeParts['1']['discount']).toBeCloseTo(2846.5);
      expect(upgradeParts['4']['discount']).toBeCloseTo(271.5, 1);
      expect(paidParts['11']['discount']).toBeCloseTo(213.6);
      expect(paidParts['2']['discount']).toBeCloseTo(1648);
      expect(paidParts['3']['discount']).toBeCloseTo(590.4);
      expect(paidParts['4']['discount']).toBeCloseTo(1663.2, 1);
    })

    it('works with exchanges >= ordersWeightWithoutSales', () => {
      testUpgrades = [{
        id: '31', probe: 'Au 585', weight: 1.7, weightOfMetal: 1.6
      }];
      testScrapMetals.metals.push({ weight: 3, probe: 'Au 585' });
      data = init(testOrders, testScrapMetals, testUpgrades, testUser);
      const {
        ordersInfo: { paidParts, upgradeParts, discounts },
        errors
      } = calcDiscounts(data);

      expect(errors.upgradesInfo.length).toBe(0);
      expect(upgradeParts['1']['discount']).toBeCloseTo(2846.5);
      expect(upgradeParts['4']['discount']).toBeCloseTo(271.5, 1);
      expect(paidParts['11']['discount']).toBeCloseTo(213.6);
      expect(paidParts['2']['discount']).toBeCloseTo(1648);
      expect(paidParts['3']['discount']).toBeCloseTo(0);
      expect(paidParts['4']['discount']).toBeCloseTo(0);
    })
  });
});
