export const auOrders = [
  {
    id: '1',
    probe: 'Au 585',
    weight: 1.55,
    cost: {
      retail: 5590,
      costOfWork: 370,
    },
    tags: []
  },
  {
    id: '2',
    probe: 'Au 585',
    weight: 2.29,
    cost: {
      retail: 8240,
      costOfWork: 450,
    },
    tags: ['распродажа 20']
  },
  {
    id: '3',
    probe: 'Au 375',
    weight: 2.13,
    cost: {
      retail: 4920,
      costOfWork: 390,
    },
    tags: []
  }
];

export const agOrders = [
  {
    id: '11',
    probe: 'Ag 925',
    weight: 3.80,
    cost: {
      retail: 1780
    },
    tags: []
  },
  {
    id: '12',
    probe: 'Ag 925',
    weight: 5.03,
    cost: {
      retail: 2200
    },
    tags: []
  }
];

export const scrapMetals = {
  metals: [
    { weight: 1.05, probe: 'Au 585' },
    { weight: 2.03, probe: 'Au 583' },
    { weight: 1.34, probe: 'Au 375' }
  ],
  isPurchase: false
};

export const upgrades = [
  { id: '31', probe: 'Au 585', weight: 1.55, weightOfMetal: 1.33 },
  { id: '32', probe: 'Au 375', weight: 2.44, weightOfMetal: 2.30 }
];

export const user = {
  type: 'Ag',
  id: '0000011',
  upgradeMode: 'usual',
  member: {
    fullname: '123',
    grams: {
      usual: 10,
      super: 4
    }
  },
};
