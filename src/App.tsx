import React from 'react';
import './App.css';
import { MicrophoneTab } from './components/MicrophoneTab';
import { ATCStateView, FLIGHT_STATE } from './components/ATCStateView';

function App() {    
  return (
    <div className="App">
      <h1>ATC like Real</h1>
      <MicrophoneTab></MicrophoneTab>
      <ATCStateView
        aircrafts={[{
          callsign: 'Inferno 1',
          size: 4,
          status: FLIGHT_STATE.TAXI
        }]}
        runway={null}  />
    </div>
  );
}

export default App;
