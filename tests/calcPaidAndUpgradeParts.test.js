import calcPaidUpgradeParts from '../calcPaidAndUpgradeParts';
import calcInitialData from '../calcInitialData';
import calcWeightToUpgrade from '../calcWeightToUpgrade';
import { auOrders, agOrders, scrapMetals, upgrades, user } from './fixtures';
import _ from 'lodash';

describe('calcPaidUpgradeParts', () => {
  let data, testOrders, testUpgrades, testScrapMetals, testUser;
  beforeEach(() => {
    testOrders = _.cloneDeep([...auOrders, ...agOrders]);
    testUpgrades = _.cloneDeep(upgrades);
    testScrapMetals = _.cloneDeep(scrapMetals);
    testUser = _.cloneDeep(user);
    data = calcInitialData(testOrders, testScrapMetals, testUpgrades, testUser);
  });

  describe('no user', () => {
    it('should work with orders', () => {
      data.userInfo = null;
      data = calcWeightToUpgrade(data);

      const paidParts = calcPaidUpgradeParts(data)['ordersInfo']['paidParts'];
      const upgradeParts = calcPaidUpgradeParts(data)['ordersInfo']['upgradeParts'];

      expect(paidParts['1']['weight']).toBeCloseTo(1.55);
      expect(paidParts['1']['parted']).toBe(false);
      expect(paidParts['3']['weight']).toBeCloseTo(2.13);
      expect(paidParts['3']['parted']).toBe(false);
      expect(paidParts['11']['weight']).toBeCloseTo(3.8);
      expect(paidParts['11']['parted']).toBe(false);
      expect(upgradeParts).toEqual({});
    });

    it('should work with no orders', () => {
      data.userInfo = null;
      data.ordersInfo = { orders: [], sequence: [] };
      data = calcWeightToUpgrade(data);

      const paidParts = calcPaidUpgradeParts(data)['ordersInfo']['paidParts'];
      const upgradeParts = calcPaidUpgradeParts(data)['ordersInfo']['upgradeParts'];

      expect(paidParts).toEqual({});
      expect(upgradeParts).toEqual({});
    });
  });

  describe('with user', () => {
    it('should work', () => {
      testScrapMetals = { metals: [], isPurchase: false };
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
      data = calcInitialData(testOrders, testScrapMetals, testUpgrades, testUser);
      data = calcWeightToUpgrade(data);

      const result = calcPaidUpgradeParts(data);
      const { paidParts, upgradeParts } = result.ordersInfo;

      expect(result.ordersInfo.sequence).toEqual(['11', '12', '2', '3', '4', '1']);
      expect(paidParts['11']['weight']).toBeCloseTo(3.8);
      expect(paidParts['11']['parted']).toBe(false);
      expect(paidParts['2']['weight']).toBeCloseTo(2.29);
      expect(paidParts['2']['parted']).toBe(false);
      expect(paidParts['4']['weight']).toBeCloseTo(2.7456, 4);
      expect(paidParts['4']['parted']).toBe(true);
      expect(paidParts['1']).toBe(undefined);
      expect(upgradeParts['4']['weight']).toBeCloseTo(1.2544, 4);
      expect(upgradeParts['4']['parted']).toBe(true);
      expect(upgradeParts['1']['weight']).toBeCloseTo(1.55);
      expect(upgradeParts['1']['parted']).toBe(false);
    });
    it('works with upgrade errors', () => {
      data = calcWeightToUpgrade(data);

      const result = calcPaidUpgradeParts(data);
      const { paidParts, upgradeParts } = result.ordersInfo;

      expect(paidParts['1']['weight']).toBeCloseTo(1.55);
      expect(paidParts['1']['parted']).toBe(false);
      expect(paidParts['3']['weight']).toBeCloseTo(2.13);
      expect(paidParts['3']['parted']).toBe(false);
      expect(paidParts['11']['weight']).toBeCloseTo(3.8);
      expect(paidParts['11']['parted']).toBe(false);
      expect(upgradeParts).toEqual({});
    });
    it('works with no orders', () => {
      data.ordersInfo = { orders: [], sequence: [] };
      data = calcWeightToUpgrade(data);

      const result = calcPaidUpgradeParts(data);
      const { paidParts, upgradeParts } = result.ordersInfo;

      expect(paidParts).toEqual({});
      expect(upgradeParts).toEqual({});
    });
  });

});
