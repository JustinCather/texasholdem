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
    maxBet: number
}

type PokerProps =
    PokerStore.PokerState &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}>;

class PlayerActions extends React.PureComponent<PokerProps, ActionState> {
    public constructor(props: PokerProps) {
        super(props);
        var _maxBet = 0;
        if (this.props.seats && this.props.seats[0].player) {
            _maxBet = this.props.seats[0].player.availableMoney;
        }
        this.state = {
            state: 'init',
            playerBet: this.props.currentBet,
            minBet: 0,
            maxBet: _maxBet
        };

        this.handleFold = this.handleFold.bind(this);
        this.handleCall = this.handleCall.bind(this);
        this.handleAllIn = this.handleAllIn.bind(this);
        this.handleBetOrRaise = this.handleBetOrRaise.bind(this);
        this.back = this.back.bind(this);
        this.bet = this.bet.bind(this);
        this.raise = this.raise.bind(this);
        this.setBet = this.setBet.bind(this);
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
        let playerName = '';
        if (this.props.seats[0].player)
            playerName = this.props.seats[0].player.playerName;
        this.props.bet(this.props.name, playerName, this.state.playerBet);
        alert('Sending bet of ' + this.state.playerBet + 'to the server');
    }

    handleFold = () => {
        let playerName = '';
        if (this.props.seats[0].player)
            playerName = this.props.seats[0].player.playerName;
        this.props.fold(this.props.name, playerName);
        alert('Player Folded');
    }

    handleCall = () => {
        let playerName = '';
        if (this.props.seats[0].player)
            playerName = this.props.seats[0].player.playerName;
        this.props.bet(this.props.name, playerName, this.props.currentBet);
        alert('Player called the current bet');
    }

    handleAllIn = () => {
        let playerName = '';
        let wager = 0;
        if (this.props.seats[0].player) {
            playerName = this.props.seats[0].player.playerName;
            wager = this.props.seats[0].player.availableMoney;
        }

        this.props.bet(this.props.name, playerName, wager);
        alert('Player called the current bet');
        alert('Player is going all in');
    }

    back = () => {
        let newState = { ...this.state };
        newState.state = 'init'
        this.setState(newState);
    }

    public render() {
        return (<React.Fragment>
            <div style={{ position: 'absolute', top: '81vh', left: '42vW' }}>
                {(this.state.state === 'init' && this.props.currentBet == 0 && this.props.seats[0].player && this.props.seats[0].player.availableMoney > this.props.bigBlindAmount) &&
                    <div>
                    <button onClick={this.handleFold} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Fold </button>
                    <button onClick={this.handleCall} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Check </button>
                    <button onClick={this.bet} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Bet  </button>
                    </div>
                }

                {(this.state.state === 'init' && this.props.currentBet == 0 && this.props.seats[0].player && this.props.seats[0].player.availableMoney <= this.props.bigBlindAmount) &&
                    <div>
                    <button onClick={this.handleFold} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Fold </button>
                    <button onClick={this.handleCall} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Check </button>
                    <button onClick={this.handleAllIn} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> ALL IN! </button>
                    </div>
                }

                {(this.state.state === 'init' && this.props.currentBet > 0 && this.props.seats[0].player && this.props.seats[0].player.availableMoney > this.props.currentBet) &&
                    <div>
                    <button onClick={this.handleFold} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Fold </button>
                    <button onClick={this.handleCall} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Call <br /> ${this.props.currentBet} </button>
                    <button onClick={this.raise} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Raise </button>
                    </div>
                }
                {(this.state.state === 'init' && this.props.currentBet > 0 && this.props.seats[0].player && this.props.seats[0].player.availableMoney <= this.props.currentBet) &&
                    <div>
                    <button onClick={this.handleFold} style={{ textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> Fold </button>
                    <button onClick={this.handleAllIn} style={{ textAlign: 'center', verticalAlign: 'top', marginLeft: '15vH', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' }}> ALL IN! </button>
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
