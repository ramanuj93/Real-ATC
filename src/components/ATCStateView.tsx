import React from 'react';
// import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Axios from 'axios';

export enum FLIGHT_STATE {
    TAXI,
    WAIT_FOR_TAXI,
    HOLD_SHORT,
    TAKE_RUNWAY,
    TAKEOFF,
    DEPART,
    INBOUND,
    INITIAL,
    FINAL
}

export interface SyncObj {
    aircrafts: Aircraft[];
    runway: Runway;
}

export interface Aircraft {
    callsign: string;
    size: number;
    status: FLIGHT_STATE;
}

export interface Runway {
    name: string;
    taxi_to: number;
    hold_short: number;
    on_runway: number;
    departing: number;
    incoming: number;
    on_final: number;
}

export interface ATCStateViewProps {
    aircrafts: Aircraft[];
    runway: Runway;
}

export interface ATCStateViewState {
    aircrafts: Aircraft[];
    runway: Runway;
}

export class ATCStateView extends React.Component<ATCStateViewProps, ATCStateViewState> {


    constructor(props) {
        super(props);
        this.state = {
            aircrafts: props.aircrafts,
            runway: props.runway
        };
        // setInterval(this.sync_server, 2000);
    }

    render() {
        
        return <div className='record-container'>
            <div className='card'>
            <TableContainer component={Paper}>
                <Table aria-label="customized table">
                    <TableHead className='aircraft-table-head'>
                        <TableRow>
                            <TableCell className='light-color'>CallSign</TableCell>
                            <TableCell className='light-color'>Waiting</TableCell>
                            <TableCell className='light-color'>Taxiign</TableCell>
                            <TableCell className='light-color'>Holding Short</TableCell>
                            <TableCell className='light-color'>Active On Runway</TableCell>
                            <TableCell className='light-color'>Cleared Takeoff</TableCell>
                            <TableCell className='light-color'>Departed</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.getRows()}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        </div>;
    }

    private getRows() {
        if ( this.props.aircrafts &&  this.props.aircrafts.length > 0 ) {
            return this.props.aircrafts.map(aircraft => {
                return <TableRow key={aircraft.callsign}>
                <TableCell component="th" scope="row">{aircraft.callsign}</TableCell>
                <TableCell align="center">{aircraft.status === FLIGHT_STATE.WAIT_FOR_TAXI ? aircraft.size : 0}</TableCell>
                <TableCell align="center">{aircraft.status === FLIGHT_STATE.TAXI ? aircraft.size : 0}</TableCell>
                <TableCell align="center">{aircraft.status === FLIGHT_STATE.HOLD_SHORT ? aircraft.size : 0}</TableCell>
                <TableCell align="center">{aircraft.status === FLIGHT_STATE.TAKE_RUNWAY ? aircraft.size : 0}</TableCell>
                <TableCell align="center">{aircraft.status === FLIGHT_STATE.TAKEOFF ? aircraft.size : 0}</TableCell>
                <TableCell align="center">{aircraft.status === FLIGHT_STATE.DEPART ? aircraft.size : 0}</TableCell>
              </TableRow>
            });
        }
        return null;
    }

    private sync_server() {
        Axios.post('http://0.0.0.0:5000/sync_status', 'request_sync', {
            responseType: 'json',
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then((response) => {
            if (response && response.data && response.status === 200) {
                let new_status_synced: SyncObj = response.data;
                let new_state: ATCStateViewState = this.state;
                if (new_status_synced.aircrafts && new_status_synced.aircrafts.length > 0) {
                    new_state.aircrafts = new_status_synced.aircrafts;
                }
                if (new_status_synced.runway) {
                    new_state.runway = new_status_synced.runway;
                }
                this.setState(new_state);
            }

        }).catch(e => {
            
            console.log(e);
        });
    }
}