import React from 'react';
import Clarifai from 'clarifai';
import Keys from '../keys.js';
import utils from '../utils.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.app = new Clarifai.App({
      apiKey: Keys.clarifai
    });

    this.state = {
      boundingBox: {},
      boxPositions: {},
      imgUrl: '',
      imgWidth: 0,
      imgHeight: 0,
      hasNoFace: false
    }

    this.findFace = this.findFace.bind(this);
    this.updateImgUrl = this.updateImgUrl.bind(this);
  }

  updateImgUrl(e) {
    this.setState({ imgUrl: e.target.value });
  }

  findFace(e) {
    e.preventDefault();
    this.app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
      .then(faceModel => {
        const url = this.state.imgUrl;
        return faceModel.predict(`https://i.pinimg.com/originals/af/53/c9/af53c958168535bd1af01970f14d7697.jpg`);
      })
      .then(response => {
        console.log('response: ', response);
        const img = document.querySelector('img')
        let hasNoFace = false;
        let boundingBox = {};

        if (Object.keys(response.outputs[0].data).length === 0) {
          hasNoFace = true;
        } else {
          boundingBox = response.outputs[0].data.regions[0]['region_info']['bounding_box'];
        }

        const boxPositions = utils.calculateBox(boundingBox, img.width, img.height);
        this.setState({ boundingBox, boxPositions, imgWidth: img.width, imgHeight: img.height, hasNoFace });
        })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <>
        <div
          style={{position: 'absolute', top: this.state.boxPositions.topStart, left: this.state.boxPositions.leftStart, border: '1px solid red', width: this.state.boxPositions.leftStop - this.state.boxPositions.leftStart, height: this.state.boxPositions.topStop - this.state.boxPositions.topStart }}
        ></div>
        <form>
          <input type="text" onChange={this.updateImgUrl} value={this.state.imgUrl}></input>
          <button type="submit" onClick={this.findFace}>Find the face</button>
        </form>
        {this.state.hasNoFace ? <div>No Face Detected!</div> : null}
        <img src={this.state.imgUrl}
          style={{position: 'relative'}}
        ></img>
      </>
    );
  }
}

export default App;