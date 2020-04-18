import React from 'react';
import logo from './logo.svg';
import { Button } from '@material-ui/core';
import './App.css';
import { PlayerTab } from './components/PlayerTab';
import { MicrophoneTab } from './components/MicrophoneTab';

let shouldStop = false;
let stopped = false;

function App() {    

  return (
    <div className="App">
      <a id="download">Download</a>
      <button id="stop" onClick={function() {
      shouldStop = true;
    }}>Stop</button>
      <PlayerTab></PlayerTab>
      <MicrophoneTab></MicrophoneTab>
      <Button variant="contained" color="primary">Hello World</Button>
    </div>
  );
}

export default App;
