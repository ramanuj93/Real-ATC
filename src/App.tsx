import React from 'react';
import logo from './logo.svg';
import { Button, Card } from '@material-ui/core';
import './App.css';
import { PlayerTab } from './components/PlayerTab';
import { MicrophoneTab } from './components/MicrophoneTab';

let shouldStop = false;
let stopped = false;

function App() {    

  return (
    <div className="App">
      <h1>ATC like Real</h1>
      <MicrophoneTab></MicrophoneTab>
    </div>
  );
}

export default App;
