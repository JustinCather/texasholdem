import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as PokerStore from '../store/Poker';

type PokerProps =
    PokerStore.PokerState &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}>;

class Poker extends React.PureComponent<PokerProps> {
    public render() {
        // const joined = this.props.joined;
        // const otherPlayers = this.props.otherPlayers;
        // const
        const { joined, otherPlayers } = this.props;

        if (joined) {
            return (
                <React.Fragment>
                    <h1>Poker</h1>

                    <p aria-live="polite">Current number of players: <strong>{this.props.playerCount}</strong></p>
                    <ul>
                        {otherPlayers.map((value, index) => {
                            return <li key={index}>{value}</li>
                        })}
                    </ul>
                </React.Fragment>
            );
        }
        else {
            return (
                <React.Fragment>
                    <h1>Poker</h1>
                    <button type="button"
                        className="btn btn-primary btn-lg"
                        onClick={() => { const namep = window.prompt("Enter name: "); const name = (namep === null ? "" : namep); this.props.addPlayer(name); }}>
                        Join
                    </button>
                </React.Fragment>
            );
        }
    }
};

export default connect(
    (state: ApplicationState) => state.poker,
    PokerStore.actionCreators
)(Poker as any);
