const App = require('./src/app.jsx');

describe('calculateBox()', () => {
  it('Calculates the corner positions of a box', () => {
    expect(App.calculateBox()).toBe('function');
  });
});