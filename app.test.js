import React from 'react';
// const ReactDOM = require('react-dom');
import App from './src/app.jsx';
// const App = require('./src/app.jsx');
import { shallow } from 'enzyme';
// const { shallow } = require('enzyme');

describe('<App>', () => {
  const wrapper = shallow(<App></App>)
  it('does good things', () => {
    expect(wrapper.find('div').exists()).toBe(true);
  });
});