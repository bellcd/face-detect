import React from 'react';
import App from './src/app.jsx';
import { shallow } from 'enzyme';

const multipleFacesUrl = `https://samples.clarifai.com/face-det.jpg`;

// TODO: reorganize how to share state between tests??
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

  it('boxPositions and regions are made empty arrays, and all <div class="bounding-box"> are removed when imgUrl changes after displaying boxes', () => {
    instance.setState({
      imgUrl: 'https://samples.clarifai.com/face-det.jpg',
      boxPositions: [
        {
          leftStart: 106,
          leftStop: 152,
          topStart: 102,
          topStop: 159
        }
      ],
      regions: [
        {
          id: "b0n6gx2wo509",
          region_info: {
            bounding_box: {
              bottom_row: 0.6547073,
              left_col: 0.26655892,
              right_col: 0.824851,
              top_row: 0.16958831
            }
          }
        }
      ]
    });
    wrapper.find('#image-url').simulate('change', { target: { value: 'anything else' }});

    expect(instance.state.boxPositions).toBeInstanceOf(Array);
    expect(instance.state.boxPositions).toHaveLength(0);

    expect(instance.state.regions).toBeInstanceOf(Array);
    expect(instance.state.regions).toHaveLength(0);

    expect(wrapper.find('.bounding-box')).toHaveLength(0);
  });

  it('no-face-message is initially hidden', () => {
    expect(wrapper.find('.no-face-message').exists()).toBe(false);
  });

  it('no-face-message is displayed when hasNoFace is true', () => {
    instance.setState({ hasNoFace: true });
    expect(wrapper.find('.no-face-message').exists()).toBe(true);
  });

  it('Several <div class="bounding-box"> are created when boxPositions has several objects', () => {
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