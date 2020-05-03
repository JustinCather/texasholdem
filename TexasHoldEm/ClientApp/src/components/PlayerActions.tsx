import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as PokerStore from '../store/Poker';
import { Form, FormGroup, Button, Label, Input } from 'reactstrap';
import Player from './Player';

interface ActionState {
    state: string,
    playerBet: number,
    minBet: number,
    maxBet: number,
    player: PokerStore.Player 
}

type PokerProps =
    PokerStore.PokerState &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}>;

class PlayerActions extends React.PureComponent<PokerProps, ActionState> {
    public constructor(props: PokerProps) {
        super(props);
        this.state = this.initState(props);
        

        this.handleFold = this.handleFold.bind(this);
        this.handleCall = this.handleCall.bind(this);
        this.handleAllIn = this.handleAllIn.bind(this);
        this.handleBetOrRaise = this.handleBetOrRaise.bind(this);
        this.back = this.back.bind(this);
        this.bet = this.bet.bind(this);
        this.raise = this.raise.bind(this);
        this.setBet = this.setBet.bind(this);
    }
    private initState(props: PokerProps) {
        var _maxBet = 0;
        var tempPlayer = props.seats.filter((x) => x.seatTaken && x.player && x.player.isYou)[0].player;
        let player;
        if (tempPlayer)
            player = tempPlayer;
        else {
            player = new Player();
            player.currentBet = 0;
        }
        if (player) {
            _maxBet = player.availableMoney;
        }
        return {
            state: 'init',
            playerBet: props.currentBet,
            minBet: 0,
            maxBet: _maxBet,
            player: player
        };

    }
    bet = () => {
        let newState = { ...this.state };
        newState.state = 'increaseBet';
        newState.minBet = this.props.bigBlindAmount;
        this.setState(newState);
    }

    raise = () => {
        let newState = { ...this.state };
        newState.state = 'increaseBet';
        newState.minBet = 2 * this.props.currentBet;
        newState.maxBet = newState.player.currentBet + newState.player.availableMoney;
        newState.playerBet = newState.minBet;
        this.setState(newState);
    }

    setBet = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newState = { ...this.state };
        let value = event.target.value;
        newState.playerBet = +value;
        this.setState(newState);
    };

    handleBetOrRaise = () => {
        this.props.bet(this.props.name, this.state.player.playerName, (this.state.playerBet - this.state.player.currentBet));
    }

    handleFold = () => {
        this.props.fold(this.props.name, this.state.player.playerName);
    }

    handleCall = () => {
        this.props.bet(this.props.name, this.state.player.playerName, this.state.playerBet - this.state.player.currentBet);
    }

    handleAllIn = () => {
        this.props.bet(this.props.name, this.state.player.playerName, this.state.player.availableMoney);
    }

    handleHide = () => {
        this.props.hideCards(this.props.name, this.state.player.playerName);
    }

    handleShow = () => {
        this.props.showCards(this.props.name, this.state.player.playerName);
    }

    back = () => {
        let newState = { ...this.state };
        newState.state = 'init'
        this.setState(newState);
    }
    public componentWillReceiveProps(nextProps: PokerProps) {
        var newState = this.initState(nextProps);
        this.setState(newState);
    }
    public render() {
        return (<React.Fragment>
            <div style={{ position: 'absolute', top: '81vh', left: '42vW' }}>
                {(this.state.state === 'init' && !this.state.player.playerLost && this.props.currentBet == 0 &&  this.state.player.availableMoney > this.props.bigBlindAmount) &&
                    <div>
                    <button onClick={this.handleFold} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Fold </button>
                    <button onClick={this.handleCall} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Check </button>
                    <button onClick={this.bet} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Bet  </button>
                    </div>
                }

                {(this.state.state === 'init' && !this.state.player.playerLost && this.props.currentBet == 0 && this.state.player.availableMoney <= this.props.bigBlindAmount) &&
                    <div>
                    <button onClick={this.handleFold} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Fold </button>
                    <button onClick={this.handleCall} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Check </button>
                    <button onClick={this.handleAllIn} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> ALL IN! </button>
                    </div>
                }

                {(this.state.state === 'init' && !this.state.player.playerLost && this.props.currentBet > 0 && (this.state.player.availableMoney + this.state.player.currentBet) > this.props.currentBet && (this.state.player.availableMoney + this.state.player.currentBet) > 2*this.props.currentBet  ) &&
                    <div>
                    <button onClick={this.handleFold} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Fold </button>
                    <button onClick={this.handleCall} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Call <br /> ${this.props.currentBet - (this.state.player.currentBet ?? 0)} </button>
                    <button onClick={this.raise} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Raise </button>
                    </div>
                }
                {(this.state.state === 'init' && !this.state.player.playerLost && this.props.currentBet > 0 && (this.state.player.availableMoney + this.state.player.currentBet) > this.props.currentBet && (this.state.player.availableMoney + this.state.player.currentBet) <= 2*this.props.currentBet) &&
                    <div>
                        <button onClick={this.handleFold} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Fold </button>
                        <button onClick={this.handleCall} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Call <br /> ${this.props.currentBet - (this.state.player.currentBet ?? 0)} </button>
                        <button onClick={this.handleAllIn} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> ALL IN! </button>
                    </div>
                }
                {(this.state.state === 'init' && !this.state.player.playerLost && this.props.currentBet > 0 && (this.state.player.availableMoney + this.state.player.currentBet) <= this.props.currentBet) &&
                    <div>
                    <button onClick={this.handleFold} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Fold </button>
                    <button onClick={this.handleAllIn} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '15vH', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> ALL IN! </button>
                    </div>
                }
                {(this.state.state === 'init' && this.state.player.playerLost) &&
                    <div>
                        <button onClick={this.handleHide} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Hide Cards </button>
                        <button onClick={this.handleShow} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '15vH', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Show Cards </button>
                    </div>
                }
                {(this.state.state === 'increaseBet') &&
                    <div>
                    <button onClick={this.back} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '18vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Back </button>
                    <input type="number" onChange={this.setBet} min={this.state.minBet} max={this.state.maxBet} name="name" value={this.state.playerBet} style={{ marginLeft: '10px', marginTop: '4vH', width: '15vH', fontSize: '3vh', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'gray', borderColor: 'gray' }} />
                    <button onClick={this.handleBetOrRaise} style={{ marginLeft: '10px', textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '18vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Confirm </button>
                    </div>
                }
            </div>
        </React.Fragment>
        );
    }
};


export default (PlayerActions as any);
