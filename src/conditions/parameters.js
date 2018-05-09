// Здесь будет проверяться возможность использования нескольких условий покупки
// Если нельзя, то надо будет запрещать такую продажу

// Параметры влияющие на разрешение или запрещение

// ПЛАТЕЖНЫЕ МЕТОДЫ
//   - Наличные
//   - Платежные карты
//      * Обычная карта
//      * Халва
//   - Кредит
//      * ОТП
//      * Альфа-Банк
//   - Рассрочка
//   - Обмен
//   - Бонусы
//   - Купоны

// ПОЛЬЗОВАТЕЛЬCКИЕ СТАТУСЫ
//  - Платиновый
//  - Золотой
//  - Серебрянный

// ПОЛЬЗОВАТЕЛЬСКИЕ АКЦИИ (специальные предложения для пользователя)

// ТИП ПОКУПАЕМОГО ИЗДЕЛИЯ
//  - Распродажа
//  - Неакционные

// ПРОКАЧКА
//  - изделия купленные ранее
//  - использовать или нет

// ОТДЕЛ (для разных отделов могут быть немного разные условия)


// Пример объекта с условиями

const parameters = {
  payMethods: [
    { name: 'Наличные', payGroup: { name: 'Наличные' } },
    { name: 'Обычная карта', payGroup: { name: 'Платежная карта' } },
    { name: 'Халва', payGroup: { name: 'Платежная карта' } },
    { name: 'ОТП Банк', payGroup: { name: 'Кредит' } },
    { name: 'Альфа-Банк', payGroup: { name: 'Кредит' } },
    { name: 'Рассрочка', payGroup: { name: 'Рассрочка' } },
    { name: 'Бонусы', payGroup: { name: 'Бонусы' } },
    { name: 'Купоны', payGroup: { name: 'Купоны' } }
  ],
  user: {
    status: 'SILVER',
    promotions: [],
    grams: {
      usual: 10,
      super: 4
    }
  },
  weightToCount: {
    'default': 1,
    'распродажа 20': 0
  },
  upgrade: {
    upgradeItems: [
      {
        id: '22',
        image: '',
        itemType: 'Серьги',
        probe: 'AU_585',
        mid: '839290',
        manufacturer: 'Magnat',
        weight: 1.75,
        actualWeight: 1.63
      }
    ]
  },
  orders: [
    {
      id: '1',
      image: '',
      itemType: 'Кольцо',
      probe: 'AU_585',
      mid: '808373',
      manufacturer: 'Sokolov',
      weight: 1.93,
      cost: 6950,
      productionCost: 400,
      tags: ['распродажа 20']
    }
  ],
  scrapMetals: [
    {
      weight: 1.33,
      probe: 'AU_585'
    }
  ],
  department: 'Аскиз'
};

const output = {
  ordersInfo: {
    discount: {
      'bonuses': 1200
    },
    orders: {
      '1': {
        image: '',
        itemType: 'Кольцо',
        probe: 'AU_585',
        mid: '808373',
        manufacturer: 'Sokolov',
        weight: 1.93,
        weightToCount: 1.93,
        cost: 6950,
        tags:['распродажа 20']
      }
    },
    paidParts: {
      '1': {
        discount: 830,
        toPay: 6120,
        weight: 0.42,
        parted: true
      }
    },
    upgradeParts: {
      '1': {
        discount: 1,
        toPay: 3100,
        weight: 1.51,
        parted: false
      }
    },
    sequence: ['1', '2', '3']
  },
  upgradeInfo: {
    upgrades: {
      '234': {
        id: '234',
        image: '',
        itemType: 'Серьги',
        probe: 'AU_585',
        mid: '839290',
        manufacturer: 'Magnat',
        weight: 1.75,
        actualWeight: 1.63,
        actualAddWeight: 0.12
      }
    },
    maxWeightToUpgrade: 3.72,
    minOrdersWeight: 3.50,
    sequence: ['234']
  },
  scrapMetalsInfo: {
    metals: {
      '1': {
        id: '1',
        weight: 1.33,
        probe: 'AU_585'
      },
      '2': {
        id: '2',
        weight: 2.06,
        probe: 'AU_375'
      }
    },
    metalParts: {
      '1': {
        weight: 0.12,
        cost: 1400,
        type: 'upgrade_1400'
      },
      '2': {
        weight: 1.33,
        cost: 1550,
        type: 'exchange_1550'
      }
    },
    sequence: ['1', '2']
  },
  errors: {
    ordersInfo: [],
    upgradeInfo: [],
    scrapMetalsInfo: []
  } 
};
