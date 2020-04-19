import React from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import MicIcon from '@material-ui/icons/Mic';
import { Button, Card } from '@material-ui/core';
import Axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

export interface MicrophoneTabProps {

}

export interface MicrophoneTabState {
    href: any;
    download: string;
    running: boolean;
    loading: boolean;
}

export const apiConfig = {
    timeout: 30000,
    baseURL: "https://localhost:3001/sendaudio",
    headers: {
        common: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    }
}

export class MicrophoneTab extends React.Component<MicrophoneTabProps, MicrophoneTabState> {

    private _mediaRecorder: MediaRecorder = null;
    private _recordedChunks: any[] = [];

    constructor(props) {
        super(props);
        this.state = {
            running: false,
            loading: false,
            href: null,
            download: null
        };
        
    }

    render() {
        return <div className='record-container'>
            <Card className='card'>
                <div className='top-half-card'>
                    <div className='detail-text'><span>Callsigns are:</span>Torch, Inferno, Fiend, Sheep, Devil and Rebel</div>
                    <div className='detail-text'><span>Airplanes are:</span>F-18, F-14, F-16, tomcat and hornet</div>
                    <div className='detail-text'><span>Runways are:</span>3L, 3R, 21L and 21R (say Right or Left!)</div>
                </div>
                <div className='bottom-half-card'>
                <Button className='samesizebutton' variant='contained' color='primary' startIcon={<MicIcon/>} onClick={(e) => {
                    if ( this.state.running) {
                        this.stopRecord();
                    } else {
                        this.startRecord();
                        this.setState({
                            running: true
                        });
                    }
                }}>
                    {this.state.running ? 'Stop' : 'Record'}
                </Button>
                {this.state.loading && <CircularProgress className='progress' size={50}></CircularProgress>}
                <Button className='samesizebutton' variant='contained' color='secondary' startIcon={<CloudDownloadIcon/>} disabled>Download</Button>
                </div>
            </Card>
            <Card className='card-thin'>
                <span>Say something like: </span>
                Nellis Tower, Inferno 1 is a flight of 4 F-18s, ready to taxi to runway 3L.
            </Card>
        </div>;
    }

    private startRecord() {
        console.log('starting....')
        this._recordedChunks = [];
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        }).then(this.beginRecording.bind(this));
    }

    private stopRecord() {
        this._mediaRecorder.stop();
    }

    private beginRecording(stream) {
        const options: MediaRecorderOptions = {
            mimeType: 'audio/webm; codecs=pcm'
        };
        this._mediaRecorder = new MediaRecorder(stream, options);
        this._mediaRecorder.addEventListener('dataavailable', this.dataUpdate.bind(this));
        this._mediaRecorder.addEventListener('stop',this.updateState.bind(this));
        this._mediaRecorder.start();
    }

    private dataUpdate(e) {
        if ((e as any).data.size > 0) {
            this._recordedChunks.push((e as any).data);
        }
    }

    private updateState() {
        console.log('stopped...');
        let blob = new Blob(this._recordedChunks);
        this.setState({
            // href: URL.createObjectURL(blob),
            // download: 'acetest.wav',
            running: false
        });
        let formdata = new FormData();
        formdata.append('recorded', blob, 'audio');
        this.setState({
            loading: true
        });
        Axios.post('http://localhost:5000/sendaudio', formdata, {
            responseType: 'blob',
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then((response) => {
            this.setState({
                loading: false
            });
            console.log(response);
            let x = new Blob([response.data], {
                type: 'audio/wav'
            })
            let blobObj = URL.createObjectURL(x);
            let player: HTMLAudioElement = new Audio(blobObj);
            player.play();
            this.setState({
                href: blobObj,
                download: 'result.wav',
                running: false
            });
        }).catch(e => {
            this.setState({
                loading: false
            });
            console.log(e);
        })
        
    }

    
}