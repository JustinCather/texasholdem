import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as PokerStore from '../store/Poker';
import { Form, FormGroup, Button, Label, Input } from 'reactstrap';

type PokerProps =
    PokerStore.PokerState &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}>;

class Poker extends React.PureComponent<PokerProps> {    
    public render() {
        const { joined, otherPlayers, gameName, playerName } = this.props;

        if (joined) {
            return (
                <React.Fragment>
                    <h1>Poker</h1>

                    <p aria-live="polite">Hello <strong>{this.props.playerName}</strong></p>
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
                    <Form inline>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="gameName" className="mr-sm-2">Game</Label>
                            <Input type="text" name="gameName" id="gameName" value={gameName} onChange={(event) => this.props.gameChange(event.target.value)} />
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="userName" className="mr-sm-2">Player Name</Label>
                            <Input type="text" name="userName" id="userName" value={playerName} onChange={(event) => this.props.playerChange(event.target.value)} />
                        </FormGroup>
                        <Button onClick={() => this.props.join(this.props.gameName, this.props.playerName)}>Submit</Button>
                    </Form>
                </React.Fragment>
            );
        }
    }
};

export default connect(
    (state: ApplicationState) => state.poker,
    PokerStore.actionCreators
)(Poker as any);
