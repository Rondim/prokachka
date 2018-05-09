import calcInitialData, { setWeightToCountForOrders, calcActualAddWeight,
setActualAddWeight, sortOrders } from '../calcInitialData';
import { auOrders, agOrders, scrapMetals, upgrades, user } from './fixtures';
import { arrToObjByKey } from '../utils';
import _ from 'lodash';


describe('calcInitialData', () => {
  let testOrders, testUpgrades, testScrapMetals, testUser;
  beforeEach(() => {
    testOrders = _.cloneDeep([...auOrders, ...agOrders]);
    testUpgrades = _.cloneDeep(upgrades);
    testScrapMetals = _.cloneDeep(scrapMetals);
    testUser = _.cloneDeep(user);
  });

  it('should work with isPurchase false', () => {
    const result = calcInitialData(testOrders, testScrapMetals, testUpgrades, testUser);

    expect(result.ordersInfo.ordersWeightToCount585).toBeCloseTo(2.9154, 4);
    expect(result.ordersInfo.ordersWeight).toBeCloseTo(14.8);
    expect(result.ordersInfo.ordersWeight585).toBeCloseTo(5.2054, 4);
    expect(result.upgradesInfo.upgradesWeight585).toBeCloseTo(3.1141, 4);
    expect(result.upgradesInfo.actualUpgradeWeight585).toBeCloseTo(2.8044, 4);
    expect(result.upgradesInfo.addWeight585).toBeCloseTo(0.3097, 4);
    expect(result.upgradesInfo.actualAddWeight585).toBeCloseTo(0.3097, 4);
    expect(result.scrapMetalsInfo.scrapMetalsWeight585).toBeCloseTo(3.9320, 4);
    expect(result.scrapMetalsInfo.weightForExchange585).toBeCloseTo(3.6223, 4);
    expect(result.scrapMetalsInfo.weightForPurchase585).toBeCloseTo(0);
    expect(result.userInfo).toEqual(user);
  });

  it('should work with isPurchase true', () => {
    testScrapMetals.isPurchase = true;
    const result = calcInitialData(testOrders, testScrapMetals, testUpgrades, testUser);

    expect(result.scrapMetalsInfo.scrapMetalsWeight585).toBeCloseTo(3.9320, 4);
    expect(result.scrapMetalsInfo.weightForExchange585).toBeCloseTo(0);
    expect(result.scrapMetalsInfo.weightForPurchase585).toBeCloseTo(3.6223, 4);
    expect(result.userInfo).toEqual(user);
  });
  it('should work with undefineds', () => {
    const result = calcInitialData(); 
    expect(result.ordersInfo.orders).toEqual({});
    expect(result.ordersInfo.ordersWeightToCount585).toBeCloseTo(0);
    expect(result.ordersInfo.ordersWeight).toBeCloseTo(0);
    expect(result.ordersInfo.ordersWeightWithoutSales585).toBe(null);
    expect(result.ordersInfo.discounts).toEqual({
      ordersDiscount: null, extraDiscount: null
    });
    expect(result.upgradesInfo.upgrades).toEqual({});
    expect(result.upgradesInfo.upgradesWeight585).toBeCloseTo(0);
    expect(result.upgradesInfo.maxUpgradeWeightForOrders585).toBe(null);
    expect(result.upgradesInfo.weightToUpgrade585).toBe(null);
    expect(result.upgradesInfo.minOrdersWeightForUpgrades585).toBe(null);
    expect(result.upgradesInfo.actualUpgradeWeight585).toBeCloseTo(0);
    expect(result.upgradesInfo.addWeight585).toBeCloseTo(0);
    expect(result.upgradesInfo.actualAddWeight585).toBeCloseTo(0);
    expect(result.scrapMetalsInfo.metals).toEqual({});
    expect(result.scrapMetalsInfo.scrapMetalsWeight585).toBeCloseTo(0);
    expect(result.scrapMetalsInfo.weightForExchange585).toBeCloseTo(0);
    expect(result.scrapMetalsInfo.weightForPurchase585).toBeCloseTo(0);
    expect(result.scrapMetalsInfo.isPurchase).toBe(false);
    expect(result.userInfo).toBe(null);
  });

  describe('help functions', () => {
    it('set weightToCount585 for each order', () => {
      const result = setWeightToCountForOrders(testOrders);
      expect(result[0]['weightToCount585']).toBeCloseTo(1.55);
      expect(result[1]['weightToCount585']).toBeCloseTo(0);
      expect(result[2]['weightToCount585']).toBeCloseTo(1.3654, 4);
      expect(result[3]['weightToCount585']).toBeCloseTo(0);
    });

    it('sortOrders sort orders', () => {
      const result = sortOrders(testOrders);
      expect(result[0]['id']).toBe('11'); // Сначало не золотые
      expect(result[1]['id']).toBe('12'); // Сначало не золотые
      expect(result[2]['id']).toBe('2'); // Потом акционные и распродажа
      expect(result[3]['id']).toBe('3'); // Затем с большим productionCost на грамм
      expect(result[4]['id']).toBe('1'); // Потом с более меньшим
    });
    
    it('calcActualAddWeight works', () => {
      const scrapWeight1 = 0.1;
      const scrapWeight2 = 0.2;
      const scrapWeight3 = 0.05;
      const addWeight = 0.1;
      const result1 = calcActualAddWeight(scrapWeight1, addWeight);
      const result2 = calcActualAddWeight(scrapWeight2, addWeight);
      const result3 = calcActualAddWeight(scrapWeight3, addWeight);
      expect(result1).toBe(0.1); 
      expect(result2).toBe(0.1); 
      expect(result3).toBe(0.05); 
    });
    
    it('setActualAddWeight works', () => {
      const upgrades = [
        { id: '31', probe: 'AU_585', weight: 1.5, actualWeight: 1.3 },
        { id: '32', probe: 'AU_375', weight: 2.4, actualWeight: 2.0 },
        { id: '33', probe: 'AU_585', weight: 1.8, actualWeight: 1.4 }
      ];
      const actualAddWeight585_1 = 0;
      const actualAddWeight585_2 = 0.15;
      const actualAddWeight585_3 = 0.3;
      const actualAddWeight585_4 = 1;

      const result1 = setActualAddWeight(_.cloneDeep(upgrades), actualAddWeight585_1);
      const result2 = setActualAddWeight(_.cloneDeep(upgrades), actualAddWeight585_2);
      const result3 = setActualAddWeight(_.cloneDeep(upgrades), actualAddWeight585_3);
      const result4 = setActualAddWeight(_.cloneDeep(upgrades), actualAddWeight585_4);

      expect(result1[0].actualAddWeight).toBeCloseTo(0);
      expect(result1[1].actualAddWeight).toBeCloseTo(0);
      
      expect(result2[0].actualAddWeight).toBeCloseTo(0.15);
      expect(result2[1].actualAddWeight).toBeCloseTo(0);

      expect(result3[0].actualAddWeight).toBeCloseTo(0.2);
      expect(result3[1].actualAddWeight).toBeCloseTo(0.156, 3);
      expect(result3[2].actualAddWeight).toBeCloseTo(0);

      expect(result4[0].actualAddWeight).toBeCloseTo(0.2);
      expect(result4[1].actualAddWeight).toBeCloseTo(0.4);
      expect(result4[2].actualAddWeight).toBeCloseTo(0.4);
    });
  });
});
