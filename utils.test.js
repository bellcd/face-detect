const utils = require('./src/utils.js');

describe('calculateBox()', () => {
  const boundingBox = {
    'bottom_row': 0.6547073,
    'left_col': 0.26655892,
    'right_col': 0.824851,
    'top_row': 0.16958831
  }

  it('Returns an object with 4 keys of leftStart, leftStop, topStart, topStop with values of numbers', () => {
    const result = utils.calculateBox(boundingBox, 100, 100);
    expect(result).toHaveProperty('leftStart', expect.any(Number));
    expect(result).toHaveProperty('leftStop', expect.any(Number));
    expect(result).toHaveProperty('topStart', expect.any(Number));
    expect(result).toHaveProperty('topStop', expect.any(Number));
  });

  it('Calculates the corner positions of a box', () => {
    expect(utils.calculateBox())
  });

  it('Returns an empty object if any argument is falsy', () => {
    expect(utils.calculateBox()).toEqual({});
    expect(utils.calculateBox(true, true, false)).toEqual({});
    expect(utils.calculateBox(true, false, true)).toEqual({});
    expect(utils.calculateBox(false, true, true)).toEqual({});
    expect(utils.calculateBox(1, 1, 0)).toEqual({});
  });

  it('Returns an empty object if boundingBox argument is empty', () => {
    expect(utils.calculateBox({}, 10, 20)).toEqual({});
  });
});