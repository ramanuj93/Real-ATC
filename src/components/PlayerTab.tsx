import React from 'react';

export interface PlayerTabProps {

}

export interface PlayerTabState {

}


export class PlayerTab extends React.Component<PlayerTabProps, PlayerTabState> {

    render() {
        return <div>
            <audio id='player' controls></audio>
        </div>;
    }
}