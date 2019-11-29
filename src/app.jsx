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
      boundingBox: {}
    }

    this.send = this.send.bind(this);
  }

  componentDidMount() {
    this.send();
  }

  send() {
    this.app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
      .then(faceModel => {
        console.log('faceModel: ', faceModel);
        return faceModel.predict('https://i.ytimg.com/vi/F_fb0A2hu48/maxresdefault.jpg')
      })
      .then(response => {
        console.log('response: ', response);
        this.setState({ boundingBox: response.outputs[0].data.regions[0]['region_info']['bounding_box']})
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <>
        <img src="https://i.ytimg.com/vi/F_fb0A2hu48/maxresdefault.jpg"
          style={{position: 'relative'}}
        ></img>
        <div
          style={{position: 'absolute', top: 0, left: 0, border: '1px solid red'}}
        ></div>
      </>
    );
  }
}

export default App;