// import { prodCostDefaults } from './consts';

const calcProductionCost = (data, consts) => {
  const {
    DEFAULT_DISCOUNT, DEFAULT_METAL_COST, DEFAULT_P_COST,
    DEFAULT_UP
  } = consts;

  let { pCost, initialCost, salesCost } = data;
  let pCostFromInit; let currentUp;

  pCost = pCost ? pCost : 0;
  const price = salesCost * (1 - DEFAULT_DISCOUNT);

  if (initialCost) {
    pCostFromInit = initialCost - DEFAULT_METAL_COST;
    currentUp = price / initialCost;
  } else {
    pCostFromInit = 0;
    currentUp = price / (DEFAULT_METAL_COST + DEFAULT_P_COST);
  }
  const x = currentUp / DEFAULT_UP;
  const pCostMin = x <= 1 ? DEFAULT_P_COST : x * DEFAULT_P_COST;
  const pCostCalced = (price / DEFAULT_UP) - DEFAULT_METAL_COST;

  // console.log(pCost, pCostMin, pCostFromInit, pCostCalced);

  return Math.max(pCost, pCostMin, pCostFromInit, pCostCalced);
};

export default calcProductionCost;
