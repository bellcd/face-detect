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

    }

    this.send = this.send.bind(this);
  }

  send() {
    this.app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
      .then(faceModel => {
        console.log('faceModel: ', faceModel);
        return faceModel.predict('https://i.ytimg.com/vi/F_fb0A2hu48/maxresdefault.jpg')
      })
      .then(response => {
        console.log('response: ', response);
      })
      .catch(err => console.log(err));
  }

  render() {
    this.send();
    return (
      <div>The app renders.</div>
    );
  }
}

export default App;