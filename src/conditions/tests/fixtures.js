export const auOrders = [
  {
    id: '1',
    probe: 'AU_585',
    weight: 1.55,
    cost: 5590,
    productionCost: 370,
    tags: []
  },
  {
    id: '2',
    probe: 'AU_585',
    weight: 2.29,
    cost: 8240,
    productionCost: 450,
    tags: ['распродажа 20']
  },
  {
    id: '3',
    probe: 'AU_375',
    weight: 2.13,
    cost: 4920,
    productionCost: 390,
    tags: []
  }
];

export const agOrders = [
  {
    id: '11',
    probe: 'AG_925',
    weight: 3.80,
    cost: 1780,
    tags: []
  },
  {
    id: '12',
    probe: 'AG_925',
    weight: 5.03,
    cost: 2200,
    tags: []
  }
];

export const scrapMetals = {
  metals: [
    { weight: 1.05, probe: 'AU_585' },
    { weight: 2.03, probe: 'AU_583' },
    { weight: 1.34, probe: 'AU_375' }
  ],
  isPurchase: false
};

export const upgrades = [
  { id: '31', probe: 'AU_585', weight: 1.55, actualWeight: 1.33 },
  { id: '32', probe: 'AU_375', weight: 2.44, actualWeight: 2.30 }
];

export const user = {
  status: 'SILVER',
  cardId: '0000011',
  grams: {
    usual: 10,
    super: 4
  },
  upgradeMode: 'usual'
};