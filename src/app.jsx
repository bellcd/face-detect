import React from 'react';
import utils from './utils.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.urlInputField = React.createRef();

    this.state = {
      regions: [],
      boxPositions: [],
      showBoxes: true,
      imgUrl: '',
      imgWidth: 0,
      imgHeight: 0,
      hasNoFace: false,
      visibility: 'hidden',
      url: `https://face-detect-api-bellcd.herokuapp.com`,
      error: null,
      useMan: true
    }

    this.findFace = this.findFace.bind(this);
    this.updateImgUrl = this.updateImgUrl.bind(this);
    this.validateInputField = this.validateInputField.bind(this);
    this.updateUseRandomFace = this.updateUseRandomFace.bind(this);
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
      boxPositions: [],
      error: null,
      visibility: 'hidden',
    };

    this.setState(result);
  }

  updateUseRandomFace(e) {
    const isChecked = e.target.checked;
    // TODO: a bit WET, combine with the function above ??
    let result = {
      useRandomFace: e.target.checked,
      regions: [],
      boxPositions: [],
      error: null,
      visibility: 'hidden',
    };

    // TODO: need to add error handling ...
    this.getRandomImageUrl((error, imgUrl) => {
      if (isChecked) {
        result = Object.assign({}, result, { imgUrl });
      } else {
        result = Object.assign({}, result, { imgUrl: '' });
      }

      this.setState(result);
    });
  }

  // TODO: needs testing
  // TODO: change to async / await instead of callbacks??
  getRandomImageUrl(cb) {
    fetch(`https://source.unsplash.com/random?face,${this.pickSearchTerm(this.state.useMan)}`)
      .then(res => {
        cb(null, res.url.slice(0, res.url.indexOf('?')));
      })
      .catch(error => cb(error, null));
  }

  componentDidUpdate() {
    if (!this.state.showBoxes) {
      const imgWidth = document.querySelector('img').clientWidth;
      const imgHeight = document.querySelector('img').clientHeight;
      // calculate the imgWidth and imgHeight from the img in the DOM, then call setState to update those boxPositions
      let boxPositions = this.state.regions.map(region => {
        return utils.calculateBox(region.region_info.bounding_box, imgWidth, imgHeight);
      });
      // also update showBoxes to true
      this.setState({ boxPositions, showBoxes: true, imgWidth, imgHeight });
    }
  }

  // when this.state.regions is NOT an empty array
    // display: none; the Find the Face button
    // display the Find again button
    // on find again button click
      // invoke getRandomImageUrl
      // call the face detect api with that random url
        // TODO: how to get the image rendered, so I can calculate the proper width and height, so I can set boxPositions, and render the boxes in the appropriate places??
          // set a flag to hide the rendered boxes - at the initial (incorrect) image size
          // then, when the width and height have been calculated and set from the displayed image, change that flag so that the recalculated (now correct) boxes display ??

  // TODO: change this to use async / await ... need to handle regeneratorRuntime is not defined error
  postFaceUrl() {
    const doStuff = (error, imgUrl, showBoxes) => {
      // JSON object with imgUrl, imgWidth, imgHeight
      const body = {
        imgUrl,
        // imgWidth: document.querySelector('img').clientWidth, // TODO: better way to handle getting these values ...
        // imgHeight: document.querySelector('img').clientHeight
        imgWidth: 0,
        imgHeight: 0
      };

      // api call to backend
      const options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
      };

      fetch(`${this.state.url}/image`, options)
        .then(res => res.json())
        // setState() with results
        .then(json => {
          if (json.name === 'Error') { // TODO: handle this better ...
            this.setState({ error: json });
          } else {
            this.setState((state, props) => {
              return Object.assign({}, json, { visibility: 'visible', useMan: !state.useMan, showBoxes: false, imgUrl });
            });
          }
        })
        .catch(error => {
          this.setState(error)
        });
    }

    if (this.state.regions.length !== 0) {
      // there is already a face displayed on the page with boxes around it, so we need to get a NEW image url, and set that in state
      this.getRandomImageUrl(doStuff);
    } else {
      // no face image is displayed
      doStuff(null, this.state.imgUrl, this.state.showBoxes)
    }
  }

  // TODO: figure out how to handle the below situation
    // when findFace() is triggered
  findFace(e) {
    e ? e.preventDefault() : null;
    this.validateInputField();
    if (this.urlInputField.current.reportValidity()) {
      this.postFaceUrl();
    }
  }

  pickSearchTerm(useMan) {
    return useMan ? 'man' : 'woman';
  }

  render() {
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
          <div>
            <input id="random-image-checkbox" type="checkbox" onChange={this.updateUseRandomFace} value={this.state.useRandomFace}></input>
            <label htmlFor="random-image-checkbox">Random Face</label>
          </div>
          <button type="submit" onClick={this.findFace}>Find the face(s)</button>
        </form>
        <div className="error-message-container">
          {this.state.error ? <p>There was an error. Please try a different image url.</p> : null}
        </div>
        <div id="media-container">
          <div id="image-container">
            {this.state.hasNoFace ? <div className="no-face-message">No Face Detected!</div> : null}
            {this.state.imgUrl ? <img id="image" style={{ visibility: this.state.visibility }} src={this.state.imgUrl}></img> : null}
          </div>
          <div className="bounding-boxes">
            {this.state.showBoxes ? boundingBoxes : null}
          </div>
        </div>
      </section>
      <footer>Made with ❤️ by <a href="https://bellcd.github.io/">Christian Dibala Bell</a></footer>
      </>
    );
  }
}

export default App;