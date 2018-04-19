// Рассчитываем оплачиваемую часть и неоплачиваемую часть
// На входе такие параметры: 
//   * есть ли прокачка или нет
//   * есть ли обмен или нет 
//   * есть ли товары с распродажи
//   * есть ли акция
// На выходе:
//   * разрешенная доля или масса в обмен
//   * масса в оплату
//   * сумма в оплату за оплачиваемую часть
//   * цена и сумма в оплату за прокачеваемую часть

const orderExample = {
  id: 123,
  weight: 1.48,
  cost: 5330,
  itemType: "Серьги",
  productionCost: 400,
  itemTags: [],
  instanceTags: ["распродажа 20"],
  probe: 'AU_585',
  stoneType: 'Без камней'
};


const outputExample = {
  paidPart: {
    orders: [
      { id: 1, weight: 2.33, cost: 8000, isFullOrder: true },
      { id: 2, weight: 0.89, cost: 8000, isFullOrder: false }
    ]
  },
  upgragePart: {
    orders: [
      { id: 2, weight: 0.77, gramCost: 400, isFullOrder: false },
      { id: 3, weight: 2.28, gramCost: 390, isFullOrder: true }
    ]
  }
};

function calcPaidAndUpgradeParts(orders, user, payMethods) {
  // Проверить влияние разные акций
  if (orders.some(({ instanceTags }) => instanceTags.include('распродажа 20'))) {
    return calcOrdersByShare(orders, 0.25);
  }
  // Если есть обмен
  if (payMethods.exchange) {
    return calcOrdersByShare(orders, 0.25);
  }
  // Проверить влияние метода оплаты
  // if (orders.some())


  // передаем функции покупки и долю, которую можно поменять
  // возвращаем разбитые покупки на оплачиваемую и прокачеваемую часть
  function calcOrdersByShare(orders, upgradeShare) {
    // считаем общую массу покупок
    const ordersWeight = orders.reduce((sum, order) => sum += order.weight, 0);

    // считаем массу для прокачку в граммах
    const upgradeWeight = ordersWeight * upgradeShare;

    // сортируем покупки в порядке возрастания стоимости работы
    const ordersSorted = orders.sort((a, b) => a.productionCost - b.productionCost);

    let oldSum = 0;
    let currentSum = 0;

    const output = {
      paidPart: {
        orders: []
      },
      upgradePart: {
        orders: []
      }
    };
    orders.forEach(order => {
      currentSum += order.weight;
      if (currentSum <= upgradeWeight) {
        output.paidPart.orders.push({ ...order, isFullOrder: true });
      } else if (currentSum > upgradeWeight && oldSum < upgradeWeight) {
        const paidPartWeight = upgradeWeight - oldSum;
        const upgradePartWeight = currentSum - upgradeWeight;
        output.paidPart.orders.push({ ...order, weight: paidPartWeight, isFullOrder: false });
        output.upgradePart.orders.push({ ...order, weight: upgradePartWeight, isFullOrder: false });
      } else {
        output.upgradePart.orders.push({ ...order, isFullOrder: false });
      }
    });

    return output;
  }
}



// Рассчитываем независимо скидку, цену лома в обмен, считаем начисление бонусов

