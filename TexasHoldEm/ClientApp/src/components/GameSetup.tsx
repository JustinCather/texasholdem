import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class GameSetup extends React.Component {

    public render() {
        return (
            <React.Fragment>
                <div style={{ color:'white',backgroundColor: 'black', width: '100%', height: '100%', position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} >
                    Set up a new game
                </div>
            </React.Fragment>
        );
    }
};

export default (GameSetup as any);