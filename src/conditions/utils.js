import { AU_SHARES, SALES_TAGS, salesDiscounts } from './consts';

export const arrToObjByKey = (key, arr) => {
  return arr.reduce((outObj, item, index) => {
    const objKey = !key ? index : item[key];
    outObj[objKey] = item;
    return outObj;
  }, {})
};

export const calc585weight = (obj, weightKey) => {
  const auShare = AU_SHARES[obj.probe] ? AU_SHARES[obj.probe] : 0;
  return obj[weightKey] * (auShare / 0.585);
};

export const getAuShare = (probe) => {
  if (!AU_SHARES[probe]) return 0;
  return AU_SHARES[probe];
};

export const isSales = (order) => {
  return order.tags.some(tag => SALES_TAGS.includes(tag));
};

export const getDiscountForSales = (order) => {
  const salesTag = order.tags.filter(tag => SALES_TAGS.includes(tag))[0];
  return salesDiscounts[salesTag];
}
