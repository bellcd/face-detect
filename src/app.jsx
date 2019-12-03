import React from 'react';

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
      needToResetRandomImg: false,
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
      needToResetRandomImg: false
    };

    this.setState(result);
  }

  updateUseRandomFace(e) {
    // TODO: a bit WET, combine with the function above ??
    let result = {
      useRandomFace: e.target.checked,
      regions: [],
      boxPositions: [],
      error: null,
      visibility: 'hidden',
      needToResetRandomImg: false
    };

    if (e.target.checked) {
      result = Object.assign({}, result, { imgUrl: `https://source.unsplash.com/random?face,${this.pickSearchTerm(this.state.useMan)}` });
    } else {
      result = Object.assign({}, result, { imgUrl: '' });
    }

    this.setState(result);
  }

  // TODO: change this to use async / await ... need to handle regeneratorRuntime is not defined error
  postFaceUrl() {
    // JSON object with imgUrl, imgWidth, imgHeight
    const body = {
      imgUrl: this.state.imgUrl,
      imgWidth: document.querySelector('img').clientWidth, // TODO: better way to handle getting these values ...
      imgHeight: document.querySelector('img').clientHeight
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
          const result = Object.assign({}, json, { visibility: 'visible', needToResetRandomImg: true });
          this.setState(result);
        }
      })
      .catch(error => {
        this.setState(error)
      });
  }

  findFace(e) {
    e ? e.preventDefault() : null;
    this.validateInputField();
    if (this.urlInputField.current.reportValidity()) {
      if (this.state.needToResetRandomImg) {
        this.setState((state, props) => {
          return {
            imgUrl: `https://source.unsplash.com/random?face,${this.pickSearchTerm(this.state.useMan)}`, // TODO: does this cause the <img> element to get rerendered ?? (ie, new network request?) might have to extract the image into a separate component to pass in the url as props??
            needToResetRandomImg: false,
            useMan: !state.useMan
          };
        });
      } else {
        this.postFaceUrl();
      }
    }
  }

  pickSearchTerm(useMan) {
    return useMan ? 'man' : 'woman';
  }

  render() {
    // TODO: this seems like a not scalable way of handling multiple sequential button clicks on the Find the Faces(s) button ...
    this.state.needToResetRandomImg ? this.findFace() : null;

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
        <div id="image-container">
          {this.state.hasNoFace ? <div className="no-face-message">No Face Detected!</div> : null}
          {this.state.imgUrl ? <img id="image" style={{ visibility: this.state.visibility }} src={this.state.imgUrl}></img> : null}
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