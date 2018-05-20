import calcProductionCost from '../calcProductionCost';
import { prodCostDefaults } from '../consts';

describe('calcProductionCost', () => {
  it('should work', () => {
    const data = {
      pCost: 450,
      initialCost: 1850,
      salesCost: 3600
    };

    const result = calcProductionCost(data, prodCostDefaults);

    expect(result).toBe(450);
  });
});