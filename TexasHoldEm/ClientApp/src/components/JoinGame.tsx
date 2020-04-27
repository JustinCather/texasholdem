import * as React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Button, Label, Input } from 'reactstrap';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as PokerStore from '../store/Poker';
import axios from 'axios';

interface PageState {
    gameName: string,
    playerName: string,
    newGameName: string,
    buyIn: number,
    bigBlind: number,
    createNewGame: boolean,
    imgFile: File | null
}

type PokerProps =
    PokerStore.AppState &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}>;

class JoinGame extends React.PureComponent<PokerProps, PageState> {
    public constructor(props: PokerProps) {
        super(props);
        this.state = {
            gameName: '',
            playerName: '',
            bigBlind: .50,
            buyIn: 20,
            createNewGame: false,
            newGameName: '',
            imgFile: null,
        };

        this.handleGameNameChange = this.handleGameNameChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleBigBlindChange = this.handleBigBlindChange.bind(this);
        this.handleBuyInChange = this.handleBuyInChange.bind(this);
        this.handleNewGameNameChange = this.handleNewGameNameChange.bind(this);
        this.handleCreateNewGame = this.handleCreateNewGame.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleUploadClick = this.handleUploadClick.bind(this);
    }


    setFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.files && e.currentTarget.files[0])
            this.setState({ imgFile: e.currentTarget.files[0] });
    }
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

    handleCreateNewGame = () => {
        var newState = { ...this.state };
        newState.createNewGame = true;
        this.setState(newState);
    }

    handleBack = () => {
        var newState = { ...this.state };
        newState.createNewGame = false;
        this.setState(newState);
    }

    handleNewGameNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        var newState = { ...this.state };
        newState.newGameName = event.target.value;
        this.setState(newState);
    }

    handleBigBlindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        var newState = { ...this.state };
        newState.bigBlind = +event.target.value
        this.setState(newState);
    }
    handleBuyInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        var newState = { ...this.state };
        newState.buyIn = +event.target.value
        this.setState(newState);
    }
    acknowledgeGameCreated = () => {
        var newState = { ...this.state };
        newState.createNewGame = false;
        newState.newGameName = '';
        newState.bigBlind = .5;
        newState.buyIn = 20;
        this.setState(newState);
        this.props.resetCreateGame();
    }

    handleUploadClick = () => {
        if (this.state.imgFile) {
            const url = window.location.origin + '/api/Upload';
            const formData = new FormData();
            formData.append('file', this.state.imgFile);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };

            var result = axios.post(url, formData, config).then(
                data => {
                    this.props.join(this.state.gameName, this.state.playerName, data.data.dbPath);
                }
            );
        } else {
            this.props.join(this.state.gameName, this.state.playerName, '');
        }
    }

    public render() {
        if (this.state.createNewGame && !this.props.createGameState.success) {
            return (
                <React.Fragment>
                    <h1>Create Game</h1>
                    <div style={{ width: '25%', position: 'absolute', left: '50%', transform: 'translatex(-50%)' }}>
                        <Form>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="newGameName" className="mr-sm-2">Game</Label>
                                <Input type="text" name="newGameName" id="newGameName" value={this.state.newGameName} onChange={this.handleNewGameNameChange} />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="buyIn" className="mr-sm-2">Buy In</Label>
                                <Input type="number" name="buyIn" id="buyIn" value={this.state.buyIn} onChange={this.handleBuyInChange} />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="bigBlind" className="mr-sm-2">BigBlind</Label>
                                <Input type="number" name="bigBlind" id="bigBlind" value={this.state.bigBlind} onChange={this.handleBigBlindChange} />
                            </FormGroup>                            
                        </Form>
                        <Button style={{ marginTop: '10px' }} onClick={this.handleBack}>Back</Button>
                        <Button style={{ marginTop: '10px', marginLeft: '10px' }} onClick={() => this.props.createGame(this.state.newGameName, this.state.buyIn, this.state.bigBlind)}>Create</Button>
                        {(this.props.createGameState.attemptedToCreate && !this.props.createGameState.success) &&
                            <div>
                                <h4 style={{ color: 'red', marginTop: '15px' }}>A game with this name already exists</h4>
                            </div>
                        }
                    </div>
                </React.Fragment>
            )
        } if (this.state.createNewGame && this.props.createGameState.success) {
            return (
                <React.Fragment>
                    <div>
                        <h2 style={{ width: '100%', textAlign: 'center', color: 'green' }} >Succesfully Created Game</h2>
                        <button style={{ left: '50%', position: 'relative', transform: 'translate(-50%,0%)' }} onClick={this.acknowledgeGameCreated} >Back to Main Menu </button>
                    </div>
                </React.Fragment>
            );
        }
        else {
            var newState = { ...this.state };
            newState.createNewGame = false;
            return (
                <React.Fragment>
                    <h1>Poker</h1>
                    <div style={{ width: '25%', position: 'absolute', left: '50%', transform: 'translatex(-50%)' }}>
                        <Form>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="gameName" className="mr-sm-2">Game</Label>
                                <Input type="text" name="gameName" id="gameName" value={this.state.gameName} onChange={this.handleGameNameChange} />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="userName" className="mr-sm-2">Player Name</Label>
                                <Input type="text" name="userName" id="userName" value={this.state.playerName} onChange={this.handleNameChange} />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="profilePic" className="mr-sm-2">Avatar</Label>
                                <Input type="file" name="profilePic" id="profilePic" onChange={e => this.setFile(e)} />
                            </FormGroup>
                        </Form>
                        <Button style={{ marginTop: '10px' }} onClick={this.handleCreateNewGame}>Create New Game</Button>
                        <Button style={{ marginTop: '10px', marginLeft: '10px' }} onClick={() => this.handleUploadClick()}>Join</Button>
                        <h4 style={{ color: 'red', marginTop: '15px' }}>{this.props.pokerState.errorMessage}</h4>
                    </div>
                </React.Fragment>
            );
        }
    }
};

export default connect(
    (state: ApplicationState) => state.poker,
    PokerStore.actionCreators
)(JoinGame as any);