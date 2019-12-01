import React from 'react';
// import Clarifai from 'clarifai';
import Keys from '../keys.js';
// import utils from './utils.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.urlInputField = React.createRef();

    this.state = {
      regions: [],
      boxPositions: [],
      imgUrl: '',
      imgWidth: 0,
      imgHeight: 0,
      hasNoFace: false,
      url: `https://face-detect-api-bellcd.herokuapp.com`
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

  async findFace(e) {
    e.preventDefault();
    this.validateInputField();
    if (this.urlInputField.current.reportValidity()) {
      // JSON object with imgUrl, imgWidth, imgHeight
      const body = {
        imgUrl: this.state.imgUrl,
        imgWidth: 100,
        imgHeight: 200
      };

      // api call to backend
      const response = await fetch(`${this.state.url}/image`, { method: 'POST', body: JSON.stringify(body) })
      console.log('response: ', response);
      // setState() with results
      this.setState(response);
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
      <h1>Face Detection</h1>
      <section>
        <form>
          <input id="image-url" type="url" pattern="https://.*|http://.*" required onChange={this.updateImgUrl} value={this.state.imgUrl} placeholder="URL to an image" ref={this.urlInputField}></input>
          <button type="submit" onClick={this.findFace}>Find the face(s)</button>
        </form>
        <div id="active-image-container">
          {this.state.hasNoFace ? <div className="no-face-message">No Face Detected!</div> : null}
          {this.state.imgUrl ? <img id="active-image" src={this.state.imgUrl}></img> : null}
          <div className="bounding-boxes">
            {boundingBoxes}
          </div>
        </div>
      </section>
      <footer>Made with ❤️ by <a href="https://bellcd.github.io/">Christian Dibala Bell</a></footer>
      </>
    );
  }
}

export default App;