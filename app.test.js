import React from 'react';
import App from './src/app.jsx';
import { shallow } from 'enzyme';

describe('<App>', () => {
  const wrapper = shallow(<App></App>)
  it('does good things', () => {
    expect(wrapper.find('div').exists()).toBe(true);
  });

  it('No face message is initially hidden', () => {
    expect(wrapper.find('.no-face-message').exists()).toBe(false);
  });

  it('No face message is displayed when hasNoFace is true', () => {
    const instance = wrapper.instance();
    instance.setState({ hasNoFace: true });
    expect(wrapper.find('.no-face-message').exists()).toBe(true);
  });

  it('findFace() populates data into App state', () => {
    // ...
  });
});