import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class GameMenu extends React.Component {
    redirectGameSetup = () => {
        return <Redirect to="/setup/" />
    };

    redirectToJoinGame = () => {
        return <Redirect to="/join/" />
    }

    public render() {
        return (
            <React.Fragment>
                <div style={{ backgroundColor: 'black', width: '100%', height: '100%', position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} >
                    <button onClick={this.redirectGameSetup} style={{ color:'white' }}> Game Setup </button>
                    <button onClick={this.redirectToJoinGame} style={{ color: 'white' }}> Join Game </button>
                </div>
            </React.Fragment>
        );
    }
};

export default (GameMenu as any);