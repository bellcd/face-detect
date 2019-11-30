import React from 'react';
import App from './src/app.jsx';
import { shallow } from 'enzyme';


describe('<App>', () => {
  let wrapper = shallow(<App></App>)
  let instance = wrapper.instance();

  afterEach(() => {
    wrapper = shallow(<App></App>);
    instance = wrapper.instance();
  });

  it('Initially, no image is displayed', () => {
    expect(wrapper.find('img').exists()).toBe(false);
  });

  it('Image is displayed when imgUrl is not the empty string', () => {
    instance.setState({ imgUrl: 'https://samples.clarifai.com/face-det.jpg' });
    expect(wrapper.find('img').exists()).toBe(true);
  });

  it('no-face-message is initially hidden', () => {
    expect(wrapper.find('.no-face-message').exists()).toBe(false);
  });

  it('no-face-message is displayed when hasNoFace is true', () => {
    instance.setState({ hasNoFace: true });
    expect(wrapper.find('.no-face-message').exists()).toBe(true);
  });

  it('Several <div class="bounding-box"> are created when this.state.boxPositions has several objects', () => {
    instance.setState({ boxPositions: [
      {
        leftStart: 106,
        leftStop: 152,
        topStart: 102,
        topStop: 159
      },
      {
        leftStart: 46,
        leftStop: 62,
        topStart: 12,
        topStop: 49
      },
      {
        leftStart: 206,
        leftStop: 252,
        topStart: 202,
        topStop: 259
      }
    ]});
    expect(wrapper.find('.bounding-box')).toHaveLength(3);
  });
});