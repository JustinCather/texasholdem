import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as PokerStore from '../store/Poker';
import { Form, FormGroup, Button, Label, Input } from 'reactstrap';
import Player from './Player';

type PokerProps =
    PokerStore.HandHistory[] &
    typeof PokerStore.actionCreators &
    RouteComponentProps<{}>;

class HandHistory extends React.PureComponent<PokerProps> {
    private getCardImage(card: PokerStore.Card) {
        return './cards/' + card.value + card.suite + '.png';
    }

    public render() {
        return (<React.Fragment>
            <ul>
                {this.props.map((hand, index) => (
                    <div>
                        <div>
                            {hand.player} won ${hand.amount} with a *get hand name*
                        </div>
                        <div>
                            {hand.cards.map((card, index) => (
                                <img src={this.getCardImage(card)} />
                                ))};
                        </div>
                    </div>
                ))}
            </ul>
        </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.poker.handHistoryState,
    PokerStore.actionCreators
)(HandHistory as any);