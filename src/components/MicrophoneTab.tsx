import React from 'react';
import MicIcon from '@material-ui/icons/Mic';
import { Button } from '@material-ui/core';
import Axios, { AxiosInstance, AxiosPromise } from 'axios'

export interface MicrophoneTabProps {

}

export interface MicrophoneTabState {
    href: any;
    download: string;
    running: boolean;
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
            href: null,
            download: null
        };
        
    }

    render() {
        return <div>
            <a id="download" href={this.state.href} download={this.state.download}>Download</a>
            <Button variant='contained' color='secondary' startIcon={<MicIcon/>} onClick={(e) => {
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
            href: URL.createObjectURL(blob),
            download: 'acetest.wav',
            running: false
        });
        let formdata = new FormData();
        formdata.append('recorded', blob, 'audio');
        Axios.post('http://localhost:3001/sendaudio', formdata)
        
    }

    
}