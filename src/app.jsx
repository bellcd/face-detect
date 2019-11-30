import React from 'react';
import Clarifai from 'clarifai';
import Keys from '../keys.js';
import utils from './utils.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.app = new Clarifai.App({
      apiKey: Keys.clarifai
    });

    this.state = {
      regions: [],
      boxPositions: [],
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
        return faceModel.predict(this.state.imgUrl);
      })
      .then(response => {
        console.log('response: ', response);
        const img = document.querySelector('img')
        let hasNoFace = false;
        let regions = [];
        let boxPositions = [];

        if (response.outputs[0].data.regions.length === 0) {
          hasNoFace = true;
        } else {
          regions = response.outputs[0].data.regions;
        }

        boxPositions = regions.map(region => {
          return utils.calculateBox(region['region_info']['bounding_box'], img.width, img.height);
        });
        this.setState({ regions, boxPositions, imgWidth: img.width, imgHeight: img.height, hasNoFace });
        })
      .catch(err => {
        console.log(err); // TODO: better error message to end user ...
      });
  }

  render() {
    // TODO: move styling into separate stylesheet??
    // TODO: separate component ??
    const boundingBoxes = this.state.boxPositions.map((p, i) => { // TODO: change this index to use an identifier from the Clarifai api call??
      return <div key={i} className="bounding-box"
        style={{ top: p.topStart, left: p.leftStart, width: p.leftStop - p.leftStart, height: p.topStop - p.topStart }}
      ></div>
    });

    return (
      <>
      <h1>Faces Detect</h1>
      <section>
        <form>
          <input type="text" onChange={this.updateImgUrl} value={this.state.imgUrl}></input>
          <button type="submit" onClick={this.findFace}>Find the face</button>
        </form>
        <div id="active-image">
          {this.state.hasNoFace ? <div className="no-face-message">No Face Detected!</div> : null}
          {this.state.imgUrl ? <img src={this.state.imgUrl}></img> : null}
          <div className="bounding-boxes">
            {boundingBoxes}
          </div>
        </div>
      </section>
      <footer>Made with ❤️ by Christian Dibala Bell</footer>
      </>
    );
  }
}

export default App;