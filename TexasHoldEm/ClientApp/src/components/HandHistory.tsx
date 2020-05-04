import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as PokerStore from '../store/Poker';
import { Form, FormGroup, Button, Label, Input } from 'reactstrap';
import Player from './Player';
import { GetCardImage } from '../helpers/cardImageHelper'
type PokerProps =
    PokerStore.PokerState &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}>;

interface MessageState {
    showHandHistory: boolean;
    chatMessage: string;
    player: PokerStore.Player;
}

class HandHistory extends React.PureComponent<PokerProps, MessageState> {
    public constructor(props: PokerProps) {
        super(props);
        console.log('init props');
        console.log(props);
        var tempPlayer = props.seats.filter(function (x) { return x.seatTaken && x.player && x.player.isYou; })[0].player;
        var player;
        if (tempPlayer)
            player = tempPlayer;
        else {
            player = new Player();
        }

        this.state = {
            showHandHistory: true,
            chatMessage: '',
            player: player
        }

        this.showChat = this.showChat.bind(this);
        this.showHandHistory = this.showHandHistory.bind(this);
        this.setChatMessage = this.setChatMessage.bind(this);
        this.sendChat = this.sendChat.bind(this);
    }

    showChat = () => {
        var newState = { ...this.state };
        newState.showHandHistory = false;
        this.setState(newState);
    }

    showHandHistory = () => {
        var newState = { ...this.state };
        newState.showHandHistory = true;
        this.setState(newState);
    }

    setChatMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newState = { ...this.state };
        let value = event.target.value;
        newState.chatMessage = value;
        this.setState(newState);
    };

    sendChat = () => {
        this.props.sendChat(this.props.name, this.state.player.playerName, this.state.chatMessage);
        var newState = { ...this.state };
        newState.chatMessage = '';
        this.setState(newState);
    }

    public componentWillReceiveProps(nextProps: PokerProps) {
        console.log('new props rec')
        var newState = {...this.state};
        this.setState(newState);
    }

    public render() {
        console.log('rendering chat/history')
        return (<React.Fragment>
            <div style={{ position: 'absolute', top: '0vh', left: '80vw', backgroundColor: 'white', height: '8vh', width: '20vw', textAlign: 'center', verticalAlign: 'center', borderBottom: '2px solid black' }}>
                <button onClick={this.showChat} style={{ width:'50%', height:'100%',backgroundColor: !this.state.showHandHistory? 'grey' : 'lightgrey'}}> Chat </button>
                <button onClick={this.showHandHistory} style={{ width: '50%', height: '100%', backgroundColor: this.state.showHandHistory ? 'grey' : 'lightgrey' }}> Hand History </button>
                </div>
            <div style={{ position: 'absolute', top: '8vh', left: '80vw', backgroundColor: 'khaki', height: '82vh', overflow: 'scroll', width: '20vw' }}>
                {this.state.showHandHistory &&
                    <ul>
                        {this.props.handHistory.map((hand, index) => (
                            <div>
                                <div>
                                    {hand.message}
                                </div>
                                <div>
                                    {hand.cards && hand.cards.map((card, index) => (
                                        <img src={GetCardImage(card)} style={{ height: '8vh' }} />
                                    ))}
                                </div>
                                <br />
                            </div>
                        ))}
                    </ul>
                }
                {!this.state.showHandHistory &&
                    <ul style={{paddingLeft:'0px'}}>
                    {this.props.chat.map((message, index) => (
                        <div style={{ textAlign: this.state.player.playerName == message.playerName ? 'right' : 'left', paddingRight: this.state.player.playerName == message.playerName ? '10px' : '0px', paddingLeft: this.state.player.playerName != message.playerName ? '10px' : '0px'}}>
                        <div style={{ fontWeight: 'bold' }}>
                                {this.state.player.playerName ?  message.playerName : 'You'}:
                        </div>
                        <div>
                            {message.message}
                            </div>
                        </div>
                        ))}
                    </ul>
                }
            </div>
            <div style={{ position: 'absolute', top: '90vh', left: '80vw', backgroundColor: 'white', height: '10vh', width: '20vw' }}>
                <input type='text' onChange={this.setChatMessage} value={this.state.chatMessage} style= {{width:'15vw', height:'100%'}} ></input>
                <button onClick={this.sendChat} style={{ width: '5vw', height: '100%'}}>Send</button>
            </div>
        </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.poker.pokerState,
    PokerStore.actionCreators
)(HandHistory as any);