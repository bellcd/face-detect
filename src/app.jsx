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

    this.urlInputField = React.createRef();

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
    this.validateInputField = this.validateInputField.bind(this);
  }

  // TODO: move this to utils??
  validateInputField() {
    const input = this.urlInputField.current;
    const validity = input.validity;
    if (validity.badInput || validity.patternMismatch || validity.typeMismatch || validity.valueMissing) {
      input.setCustomValidity(`URL must start with https:// or http://`);
    } else {
      input.setCustomValidity(``);
    }
  }

  // TODO: how to handle only displaying the image if the url is valid??
  updateImgUrl(e) {
    this.validateInputField();
    this.urlInputField.current.reportValidity();

    let result = {
      imgUrl: e.target.value,
      regions: [],
      boxPositions: []
    };

    this.setState(result);
  }

  findFace(e) {
    e.preventDefault();
    this.validateInputField();
    if (this.urlInputField.current.reportValidity()) {
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
          <input id="image-url" type="url" pattern="https://.*|http://.*" required onChange={this.updateImgUrl} value={this.state.imgUrl} placeholder="URL to an image" ref={this.urlInputField}></input>
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