import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as PokerStore from '../store/Poker';
import { Form, FormGroup, Button, Label, Input } from 'reactstrap';
import CSS from 'csstype';
import { relative } from 'path';

type PokerProps =
    PokerStore.Player &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}> &
    {
        cardToTheLeft: boolean;
        dealerIconLeft: string;
        chipsTop: string;
        chipsLeft: string;
    };


class Player extends React.PureComponent<PokerProps> {
    public render() {
        console.log('Rendering player, props:');
        console.log(this.props);
        let cardOne, cardTwo;
        if (this.props.cards && this.props.cards.length == 2) {
            cardOne = './cards/' + this.props.cards[0].value + this.props.cards[0].suit + '.png';
            cardTwo = './cards/' + this.props.cards[1].value + this.props.cards[1].suit + '.png';
        }
        var playerImage = (
            <div style={{
                height: '10vH', width: '10vH', backgroundColor: '#263238', borderRadius: '50%', overflow: 'hidden', border: '2px solid #263238', position: 'relative', left: '50%', transform: 'translatex(-50%)'
            }}>
                {this.props.profileImage &&
                    <img src={window.location.origin + '/' + this.props.profileImage } style={{height:'10vH',width:'10vH'}} />
}           </div>
        );

        if (this.props.playersTurn) {
            playerImage = (
                <div style={{ border: '8px solid deepskyblue', borderRadius: '50%', width: '12vH', height: '12vH', left: '50%', transform: 'translate(-50%)', position: 'relative' }}>
                    {playerImage}
                </div>
            );
        }
        return (
            <React.Fragment>
                <div style={{ width: '16vH' }}>
                    {playerImage}
                    <div style={{ fontSize: '13px', borderBottom: '1px solid white', backgroundColor: 'black', color: 'white', textAlign: 'center' }}>
                        {this.props.playerName}
                    </div>
                    <div style={{ fontSize: '13px', backgroundColor: 'black', color: 'white', textAlign: 'center' }}>
                        {'$' + this.props.availableMoney}
                    </div>
                </div>
                
                {this.props.isDealer &&
                    <div style={{ position: 'absolute', top: '-20px', left: this.props.dealerIconLeft, color: 'deepskyblue' }}>
                        <h1>D</h1>
                    </div>
                }
                
                {(this.props.currentBet !== undefined && this.props.currentBet > 0) &&
                    < div style={{ position: 'absolute', top: this.props.chipsTop, left: this.props.chipsLeft }}>
                    <img src='./chips.png' style={{ height: '5vh' }} />
                    <h6 style={{ backgroundColor: 'rgba(0,0,0,.4)', color: 'lightgray', textAlign:'center' }}>${this.props.currentBet}</h6>
                    </div>
                }
                
                {(this.props.isYou && !this.props.folded && this.props.cards && this.props.cards.length > 0) &&
                    <div style={{ position: 'relative', top: '-16vH', left: '85%', display: 'inline-block' }}>
                        <img src={cardOne} style={{ height: '15vH', top: '0px', left: '90px' }} />
                        <img src={cardTwo} style={{ height: '15vH' }} />
                    </div>
                }

                {(!this.props.isYou && !this.props.folded && this.props.cardToTheLeft) &&
                    <div>
                        <img src='./cards/card-back.jpg' style={{ height: '8vH', position: 'absolute', top: '0px', left: '-35px' }} />
                        <img src='./cards/card-back.jpg' style={{ height: '8vH', position: 'absolute', top: '-5px', left: '-20px' }} />
                    </div>
                }

                {(!this.props.isYou && !this.props.folded && !this.props.cardToTheLeft) &&
                    <div>
                        <img src='./cards/card-back.jpg' style={{ height: '8vH', position: 'absolute', top: '0px', left: '95px' }} />
                        <img src='./cards/card-back.jpg' style={{ height: '8vH', position: 'absolute', top: '-5px', left: '110px' }} />
                    </div>
                }

            </React.Fragment>
        );
    }
};


export default (Player as any);
