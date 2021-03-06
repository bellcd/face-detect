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
      hasNoFace: false,
      url: `https://face-detect-api-bellcd.herokuapp.com`,
      error: null
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
      boxPositions: [],
      error: null
    };

    this.setState(result);
  }

  // TODO: change this to use async / await ... need to handle regeneratorRuntime is not defined error
  postFaceUrl() {
    // JSON object with imgUrl, imgWidth, imgHeight
    const body = {
      imgUrl: this.state.imgUrl,
      imgWidth: document.querySelector('img').width, // TODO: better way to handle getting these values ...
      imgHeight: document.querySelector('img').height
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
          this.setState(json);
        }
      })
      .catch(error => {
        this.setState(error)
      });
  }

  findFace(e) {
    e.preventDefault();
    this.validateInputField();
    if (this.urlInputField.current.reportValidity()) {
      this.postFaceUrl();
    }
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
          <button type="submit" onClick={this.findFace}>Find the face(s)</button>
        </form>
        <div className="error-message-container">
          {this.state.error ? <p>There was an error. Please try a different image url.</p> : null}
        </div>
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