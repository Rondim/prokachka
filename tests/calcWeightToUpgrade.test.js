import calcWeightToUpgrade from '../calcWeightToUpgrade';
import calcInitialData from '../calcInitialData';
import { auOrders, agOrders, scrapMetals, upgrades, user } from './fixtures';
import _ from 'lodash';

describe('calcShareToUpgrade', () => {
  let data;
  beforeEach(() => {
    const testOrders = _.cloneDeep([...auOrders, ...agOrders]);
    const testUpgrades = _.cloneDeep(upgrades);
    const testScrapMetals = _.cloneDeep(scrapMetals);
    const testUser = _.cloneDeep(user);
    data = calcInitialData(testOrders, scrapMetals, upgrades, testUser);
  });

  describe('no user', () => {
    it('return 0 and nulls', () => {
      data.userInfo = null;
      const result = calcWeightToUpgrade(data);
      expect(result.errors.upgradesInfo.length).toBe(0);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(0);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBe(null);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBe(null);
    });
  });

  describe('usual mode', () => {
    it('works with exchange and sufficient grams and appropriate upgradesWeight', () => {
      data.userInfo.grams = { usual: 20, super: 20 };
      data.scrapMetalsInfo.weightForExchange585 = 1;
      data.ordersInfo.ordersWeightToCount585 = 2;
      data.upgradesInfo.upgradesWeight585 = 0.5;
      data.upgradesInfo.actualAddWeight585 = 0.1;
      data.upgradesInfo.actualUpgradeWeight585 = 0.4;
      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(0);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(0.5);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(0.5);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(2);
    });

    it('works with exchange and insufficient grams and appropriate upgradesWeight', () => {
      data.userInfo.member.grams = { usual: 0, super: 0 };
      data.scrapMetalsInfo.weightForExchange585 = 1;
      data.ordersInfo.ordersWeightToCount585 = 2;
      data.upgradesInfo.upgradesWeight585 = 0.5;

      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(1);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(null);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(0.5);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(2);
    });

    it('works with exchange and sufficient grams and inappropriate upgradesWeight', () => {
      data.userInfo.grams = { usual: 20, super: 20 };
      data.scrapMetalsInfo.weightForExchange585 = 1;
      data.ordersInfo.ordersWeightToCount585 = 2;
      data.upgradesInfo.upgradesWeight585 = 2;
      data.upgradesInfo.actualAddWeight585 = 0.5;
      data.upgradesInfo.actualUpgradeWeight585 = 1.5;

      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(1);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(null);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(0.5);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(8);
    });

    it('works with exchange and insufficient grams and inappropriate upgradesWeight', () => {
      data.userInfo.grams = { usual: 0, super: 0 };
      data.scrapMetalsInfo.weightForExchange585 = 1;
      data.ordersInfo.ordersWeightToCount585 = 2;
      data.upgradesInfo.upgradesWeight585 = 2;
      data.upgradesInfo.actualAddWeight585 = 0.5;
      data.upgradesInfo.actualUpgradeWeight585 = 1.5;

      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(1);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(null);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(0.5);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(8);
    });
    it('works with no exchange and sufficient grams and appropriate upgrades weight', () => {
      data.userInfo.member.grams = { usual: 20, super: 20 };
      data.scrapMetalsInfo.weightForExchange585 = 0;
      data.ordersInfo.ordersWeightToCount585 = 2;
      data.upgradesInfo.upgradesWeight585 = 0.5;
      data.upgradesInfo.actualAddWeight585 = 0.1;
      data.upgradesInfo.actualUpgradeWeight585 = 0.4;

      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(0);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(0.5);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(1);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(1);
    });
  });

  describe('super mode', () => {
    it('works with exchange and sufficient grams and appropriate upgradesWeight', () => {
      data.userInfo = { upgradeMode: 'super', member: { grams: { usual: 20, super: 20 } } };
      data.scrapMetalsInfo.weightForExchange585 = 1;
      data.ordersInfo.ordersWeight585 = 2;
      data.upgradesInfo.upgradesWeight585 = 0.5;
      data.upgradesInfo.actualAddWeight585 = 0.1;
      data.upgradesInfo.actualUpgradeWeight585 = 0.4;
      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(1);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(null);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(0);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(0);
    });

    it('works with noexchange and sufficient grams and appropriate upgradesWeight', () => {
      data.userInfo = { upgradeMode: 'super', member: { grams: { usual: 20, super: 20 } } };
      data.scrapMetalsInfo.weightForExchange585 = 0;
      data.ordersInfo.ordersWeight585 = 2;
      data.upgradesInfo.upgradesWeight585 = 0.5;
      data.upgradesInfo.actualAddWeight585 = 0.1;
      data.upgradesInfo.actualUpgradeWeight585 = 0.4;
      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(0);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(0.5);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(2);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(0.5);
    });

    it('works with noexchange and insufficient grams and appropriate upgradesWeight', () => {
      data.userInfo = { upgradeMode: 'super', member: { grams: { usual: 20, super: 0 } } };
      data.scrapMetalsInfo.weightForExchange585 = 0;
      data.ordersInfo.ordersWeight585 = 2;
      data.upgradesInfo.upgradesWeight585 = 0.5;
      data.upgradesInfo.actualAddWeight585 = 0.1;
      data.upgradesInfo.actualUpgradeWeight585 = 0.4;
      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(1);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(null);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(2);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(0.5);
    });

    it('works with noexchange and sufficient grams and inappropriate upgradesWeight', () => {
      data.userInfo = { upgradeMode: 'super', member: { grams: { usual: 20, super: 20 } } };
      data.scrapMetalsInfo.weightForExchange585 = 0;
      data.ordersInfo.ordersWeight585 = 2;
      data.upgradesInfo.upgradesWeight585 = 3;
      data.upgradesInfo.actualAddWeight585 = 0.5;
      data.upgradesInfo.actualUpgradeWeight585 = 2.5;
      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(1);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(null);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(2);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(3);
    });

    it('works with noexchange and insufficient grams and inappropriate upgradesWeight', () => {
      data.userInfo = { upgradeMode: 'super', member: { grams: { usual: 20, super: 0 } } };
      data.scrapMetalsInfo.weightForExchange585 = 0;
      data.ordersInfo.ordersWeight585 = 2;
      data.upgradesInfo.upgradesWeight585 = 3;
      data.upgradesInfo.actualAddWeight585 = 0.5;
      data.upgradesInfo.actualUpgradeWeight585 = 2.5;
      const result = calcWeightToUpgrade(data);

      expect(result.errors.upgradesInfo.length).toBe(1);
      expect(result.upgradesInfo.weightToUpgrade585).toBe(null);
      expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBeCloseTo(2);
      expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBeCloseTo(3);
    });
  });
});
