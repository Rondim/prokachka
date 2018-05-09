import { arrToObjByKey } from '../utils';

describe('arrToObjByKey', () => {
  it('should work', () => {
    const arr = [
      { id: '1' },
      { id: '2' }
    ];
    const result = arrToObjByKey('id', arr);
    expect(result).toEqual({ 
      '1': { id: '1' },
      '2': { id: '2' }
    });
  });
}); 