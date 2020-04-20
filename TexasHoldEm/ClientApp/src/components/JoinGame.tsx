import * as React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Button, Label, Input } from 'reactstrap';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as PokerStore from '../store/Poker';

interface PageState {
    gameName: string,
    playerName: string
}

type PokerProps =
    PokerStore.PokerState &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}>;

class JoinGame extends React.PureComponent<PokerProps, PageState> {
    handleGameNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        var newState = { ...this.state };
        newState.gameName = event.target.value;
        this.setState(newState);
    }

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        var newState = { ...this.state };
        newState.playerName = event.target.value;
        this.setState(newState);
    }
    public render() {
        return (
            <React.Fragment>
                <React.Fragment>
                    <h1>Poker</h1>
                    <Form inline>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="gameName" className="mr-sm-2">Game</Label>
                            <Input type="text" name="gameName" id="gameName" onChange={this.handleGameNameChange} />
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="userName" className="mr-sm-2">Player Name</Label>
                            <Input type="text" name="userName" id="userName" onChange={this.handleNameChange} />
                        </FormGroup>
                        <Button onClick={() => this.props.join(this.state.gameName, this.state.playerName)}>Submit</Button>
                    </Form>
                </React.Fragment>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.poker,
    PokerStore.actionCreators
)(JoinGame as any);