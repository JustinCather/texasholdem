import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as PokerStore from '../store/Poker';
import Player from './Player';
import PlayerActions from './PlayerActions';
import JoinGame from './JoinGame'
type PokerProps =
    PokerStore.PokerState &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}>;

class Table extends React.PureComponent<PokerProps> {

    private getCardImage(card: PokerStore.Card) {
        return './cards/' + card.value + card.suit + '.png';
    }
    private arrayRotate(arr: PokerStore.Seat[]) {
        let val = arr.shift();
        if (val)
            arr.push(val);
        return arr;
    }

    private rotateSeats(seats: PokerStore.Seat[]) {
        var newArray = [...seats];
        while (true) {
            if (!newArray[0].player) {
                newArray = this.arrayRotate(newArray) as PokerStore.Seat[];
                continue;
            }
            if (!newArray[0].player.isYou) {
                newArray = this.arrayRotate(newArray) as PokerStore.Seat[];
                continue;
            }
            break;
        }
        return newArray;
    }
    public render() {
        console.log('here are the props');
        console.log(this.props);
        
        if (!this.props.joinedGame) {
            return <JoinGame />
        }
        else {
            const seats = this.rotateSeats(this.props.seats);
            return (
                <React.Fragment>
                    <h1>Poker</h1>

                    <div style={{
                        height: '65%', width: '65vw', top: '50%', left: '50%', position: 'relative', transform: 'translate(-65%,-70%)', border: '8px solid #7c3333', borderRadius: '160px'
                    }}>
                        <div id='table-div' style={{ backgroundColor: 'green', border: '7px solid #a95555', borderRadius: '150px', height: '100%', width: '100%' }}>
                            <div style={{ border: '7px solid rgba(0, 0, 0, .1)', borderRadius: '140px', height: '100%', width: '100%' }}>
                                <h1 style={{
                                    color: 'gold', top: '70%', left: '50%', position: 'relative', transform: 'translate(-50%,0%)', textAlign: 'center', width: '80%'
                                }}>
                                    JCS CASINO
                            </h1>
                                {(this.props.potSize > 0) &&
                                    <div style={{ left: '50%', position: 'relative', transform: 'translate(-50%,0%)', textAlign: 'center', top: '0%', width: '25%' }}>
                                        <img src='./chips.png' style={{ height: '6vh' }} />
                                        <h6 style={{ backgroundColor: 'rgba(0,0,0,.4)', color: 'lightgray', textAlign: 'center' }}>Pot: ${this.props.potSize}</h6>
                                    </div>
                                }
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'max-content' }}>
                                    {(this.props.communityCards && this.props.communityCards[0]) &&
                                        <img src={this.getCardImage(this.props.communityCards[0])} style={{ height: '18vh' }} />
                                    }
                                    {(this.props.communityCards && this.props.communityCards[1]) &&
                                        <img src={this.getCardImage(this.props.communityCards[1])} style={{ height: '18vh' }} />
                                    }
                                    {(this.props.communityCards && this.props.communityCards[2]) &&
                                        <img src={this.getCardImage(this.props.communityCards[2])} style={{ height: '18vh' }} />
                                    }
                                    {(this.props.communityCards && this.props.communityCards[3]) &&
                                        <img src={this.getCardImage(this.props.communityCards[3])} style={{ height: '18vh' }} />
                                    }
                                    {(this.props.communityCards && this.props.communityCards[4]) &&
                                        <img src={this.getCardImage(this.props.communityCards[4])} style={{ height: '18vh' }} />
                                    }
                                </div>
                                <div style={{ top: '56vH', left: '13vW', position: 'absolute' }}>
                                    <Player {...seats[0].player} chipsTop={'-7vh'} chipsLeft={'6vw'} />
                                </div>
                                {(seats[1].seatTaken && seats[1].player) &&
                                    <div style={{ top: '51vH', left: '0vW', position: 'absolute' }}>
                                        <Player {...seats[1].player} cardToTheLeft={true} dealerIconLeft={'85px'} chipsTop={'-6vH'} chipsLeft={'8vw'} />
                                    </div>
                                }
                                {(seats[2].seatTaken && seats[2].player) &&
                                    <div style={{ top: '22vH', left: '-4vW', position: 'absolute' }}>
                                        <Player {...seats[2].player} cardToTheLeft={true} dealerIconLeft={'85px'} chipsTop={'6vH'} chipsLeft={'10vw'} />
                                    </div>
                                }
                                {(seats[3].seatTaken && seats[3].player) &&
                                    <div style={{ top: '-4vH', left: '0vW', position: 'absolute' }}>
                                        <Player {...seats[3].player} cardToTheLeft={true} dealerIconLeft={'85px'} chipsTop={'15vH'} chipsLeft={'8vw'} />
                                    </div>
                                }
                                {(seats[4].seatTaken && seats[4].player) &&
                                    <div style={{ top: '-11vH', left: '16vW', position: 'absolute' }}>
                                        <Player {...seats[4].player} cardToTheLeft={true} dealerIconLeft={'85px'} chipsTop={'18vH'} chipsLeft={'2vw'} />
                                    </div>
                                }

                                {(seats[5].seatTaken && seats[5].player) &&
                                    <div style={{ top: '-11vH', left: '42vW', position: 'absolute' }}>
                                        <Player {...seats[5].player} cardToTheLeft={false} dealerIconLeft={'0vw'} chipsTop={'18vH'} chipsLeft={'3vw'} />
                                    </div>
                                }
                                {(seats[6].seatTaken && seats[6].player) &&
                                    <div style={{ top: '-4vH', left: '56vW', position: 'absolute' }}>
                                        <Player {...seats[6].player} cardToTheLeft={false} dealerIconLeft={'0vw'} chipsTop={'15vH'} chipsLeft={'-4vw'} />
                                    </div>
                                }
                                {(seats[7].seatTaken && seats[7].player) &&
                                    <div style={{ top: '22vH', left: '61VW', position: 'absolute' }}>
                                        <Player {...seats[7].player} cardToTheLeft={false} dealerIconLeft={'0vw'} chipsTop={'6vH'} chipsLeft={'-5vw'} />
                                    </div>
                                }
                                {(seats[8].seatTaken && seats[8].player) &&
                                    <div style={{ top: '51vH', left: '56vW', position: 'absolute' }}>
                                        <Player {...seats[8].player} cardToTheLeft={false} dealerIconLeft={'0vw'} chipsTop={'-6vH'} chipsLeft={'-3vw'} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {(seats[0].player && seats[0].player.playersTurn) &&
                        <PlayerActions {...this.props} />
                    }
                </React.Fragment>
            );
        }
    }
};

export default connect(
    (state: ApplicationState) => state.poker.pokerState,
    PokerStore.actionCreators
)(Table as any);