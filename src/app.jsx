import React from 'react';
import Clarifai from 'clarifai';
import Keys from '../keys.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.app = new Clarifai.App({
      apiKey: Keys.clarifai
    });

    this.state = {
      boundingBox: {},
      boxPositions: {}
    }

    this.send = this.send.bind(this);
    this.calculateBox = this.calculateBox.bind(this);
  }

  componentDidMount() {
    this.send();
  }

  componentDidUpdate() {
  }

  send() {
    this.app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
      .then(faceModel => {
        console.log('faceModel: ', faceModel);
        return faceModel.predict('https://i.ytimg.com/vi/F_fb0A2hu48/maxresdefault.jpg')
      })
      .then(response => {
        const boundingBox = response.outputs[0].data.regions[0]['region_info']['bounding_box'];
        const boxPositions = this.calculateBox(boundingBox);
        this.setState({ boundingBox, boxPositions });
      })
      .catch(err => console.log(err));
  }

  calculateBox(boundingBox) {
    const img = document.querySelector('img'); // TODO: improve getting the width of the image ...

    const leftStart = boundingBox.left_col * img.width;
    console.log('leftStart: ', leftStart);
    // calculate left start from containing img

    // calculate top start from containing img
    const topStart = boundingBox.top_row * img.height;
    console.log('topStart: ', topStart);
      // same thing for left stop
        // calculate width of bounding box as leftStop - leftStart
        const leftStop = boundingBox.right_col * img.width;
        console.log('leftStop: ', leftStop);
      // same thing for top stop
        // calculate height of bounding box as topStop - topStart
        const topStop = boundingBox.bottom_row * img.height;
        console.log('topStop: ', topStop);

    return {
      leftStart,
      leftStop,
      topStart,
      topStop
    }
  }

  render() {
    return (
      <>
        <img src="https://i.ytimg.com/vi/F_fb0A2hu48/maxresdefault.jpg"
          style={{position: 'relative'}}
        ></img>
        <div
          style={{position: 'absolute', top: this.state.boxPositions.topStart, left: this.state.boxPositions.leftStart, border: '1px solid red', width: this.state.boxPositions.leftStop - this.state.boxPositions.leftStart, height: this.state.boxPositions.topStop - this.state.boxPositions.topStart }}
        ></div>
      </>
    );
  }
}

export default App;