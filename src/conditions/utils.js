import { AU_SHARES } from './consts';

export const arrToObjByKey = (key, arr) => {
  return arr.reduce((outObj, item, index) => {
    const objKey = !key ? index : item[key];
    outObj[objKey] = item;
    return outObj;
  }, {})
};

export const calc585weight = (obj, weightKey) => {
  return obj[weightKey] * (AU_SHARES[obj['probe']] / 0.585);
}

export const getAuShare = (probe) => {
  if (!AU_SHARES[probe]) return 0;
  return AU_SHARES[probe];
}
