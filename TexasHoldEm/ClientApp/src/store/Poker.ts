import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { Redirect } from 'react-router-dom';

// models
export enum GameState {
    Start = 'start',
    Flop = 'flop',
    Turn = 'turn',
    River = 'river',
    GameOver = 'gameOver'
}

export interface Seat {
    seatTaken: boolean;
    player?: Player;
}

export interface Player {
    playerName: string;
    profileImage?: string;
    availableMoney: number;
    currentBet?: number;
    folded: boolean;
    allIn: boolean;
    playersTurn: boolean;
    isYou: boolean;
    isDealer: boolean;
    cards?: Card[];
}

export interface Card {
    suit: Suit;
    value: CardValue;
}

export enum Suit {
    Hearts = 'h',
    Diamonds = 'd',
    Clubs = 'c',
    Spades = 's'
}

export enum CardValue {
    Ace = 'a',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'j',
    Queen = 'q',
    King = 'k'
}

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface PokerState {
    state: GameState;
    name: string;
    currentBet: number;
    potSize: number;
    smallBlindAmount: number;
    joinedGame: boolean;
    bigBlindAmount: number;
    communityCards: Card[];
    seats: Seat[];
}

function BlankState() {
    return {
        state: GameState.GameOver,
        name: '',
        currentBet: 0,
        potSize: 0,
        smallBlindAmount: 0,
        bigBlindAmount: 0,
        communityCards: [],
        seats: [],
        joinedGame: false
    }
}
function NewInitState() {
    return {
        state: GameState.GameOver,
        name: 'Chris Test Game',
        joinedGame:true,
        currentBet: 20,
        potSize: 200,
        smallBlindAmount: 10,
        bigBlindAmount: 20,
        communityCards: [
            {
                suit: Suit.Hearts,
                value: CardValue.King
            },
            {
                suit: Suit.Hearts,
                value: CardValue.Queen
            },
            {
                suit: Suit.Hearts,
                value: CardValue.Ten
            },
            {
                suit: Suit.Clubs,
                value: CardValue.King
            },
            {
                suit: Suit.Hearts,
                value: CardValue.Jack
            }
        ],
        seats: [
            {
                seatTaken: true,
                player: {
                    playerName: 'Picard',
                    availableMoney: 3000,
                    currentBet: 20,
                    folded: false,
                    allIn: false,
                    playersTurn: false,
                    isYou: false,
                    isDealer: false,
                    profileImage: './picard.jpg'
                }
            },
            {
                seatTaken: true,
                player: {
                    playerName: 'Kirk',
                    availableMoney: 1000,
                    currentBet: 20,
                    folded: true,
                    allIn: false,
                    playersTurn: false,
                    isYou: false,
                    isDealer: true,
                    profileImage: './kirk.jpg'
                }
            },
            {
                seatTaken: true,
                player: {
                    playerName: '7of9',
                    availableMoney: 10000,
                    currentBet: 20,
                    folded: false,
                    allIn: false,
                    playersTurn: false,
                    isYou: false,
                    isDealer: true,
                    profileImage: './7of9.jpg'
                }
            },
            {
                seatTaken: true,
                player: {
                    playerName: 'Chris',
                    availableMoney: 1000,
                    currentBet: 200,
                    folded: false,
                    allIn: false,
                    playersTurn: true,
                    isYou: true,
                    isDealer: true,
                    cards: [{ suit: Suit.Hearts, value: CardValue.Ace }, { suit: Suit.Hearts, value: CardValue.Eight }],
                    profileImage: './sully.jpg'
                }
            },
            {
                seatTaken: true,
                player: {
                    playerName: 'Han',
                    availableMoney: 10000,
                    currentBet: 20,
                    folded: false,
                    allIn: false,
                    playersTurn: false,
                    isYou: false,
                    isDealer: true,
                    profileImage: './han.jpg'
                }
            },
            {
                seatTaken: true,
                player: {
                    playerName: 'Chewy',
                    availableMoney: 10000,
                    currentBet: 20,
                    folded: false,
                    allIn: false,
                    playersTurn: false,
                    isYou: false,
                    isDealer: true,
                    profileImage: './chewy.jpg'
                }
            },
            {
                seatTaken: true,
                player: {
                    playerName: "Col. Jack O'Neill",
                    availableMoney: 10000,
                    currentBet: 20,
                    folded: false,
                    allIn: false,
                    playersTurn: false,
                    isYou: false,
                    isDealer: true,
                    profileImage: './oneill.jpg'
                }
            },
            {
                seatTaken: true,
                player: {
                    playerName: 'Thor',
                    availableMoney: 10000,
                    currentBet: 20,
                    folded: false,
                    allIn: false,
                    playersTurn: false,
                    isYou: false,
                    isDealer: true,
                    profileImage: './thor.jpg'
                }
            },
            {
                seatTaken: true,
                player: {
                    playerName: "Ned Stark",
                    availableMoney: 10000,
                    currentBet: 20,
                    folded: false,
                    allIn: false,
                    playersTurn: false,
                    isYou: false,
                    isDealer: true,
                    profileImage: './nedstark.jpg'
                }
            },
        ]
    };
}
// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface AddPlayer { type: 'ADD_PLAYER', game: string, name: string }
export interface PlayerBet { type: 'PLAYER_BET', game: string, name: string, wager: number }
export interface PlayerFold { type: 'PLAYER_FOLD', game: string, name: string }
export interface PlayerAdded { type: 'PLAYER_ADDED', name: string, players: string[] }
export interface PlayerNameChanged { type: 'PLAYER_NAME_CHANGED', name: string }
export interface GameNameChanged { type: 'GAME_NAME_CHANGED', name: string }
export interface StartGame { type: 'START_GAME', game: string }
export interface GameStarted { type: 'GAME_STARTED' }
export interface PlayerBeingDealt { type: 'PLAYER_BEING_DEALT', hand: string[] }
export interface GameStateUpdated { type: 'UPDATE_GAME_STATE', state: PokerState }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = AddPlayer | GameStateUpdated | PlayerFold | PlayerBet | PlayerAdded | PlayerNameChanged | GameNameChanged | StartGame | GameStarted | PlayerBeingDealt;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    join: (game: string, name: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'ADD_PLAYER', game: game, name: name });
    },
    bet: (game: string, name: string, wager: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'PLAYER_BET', game: game, name: name, wager: wager });
    },
    fold: (game: string, name: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'PLAYER_FOLD', game: game, name: name });
    },
    gameChange: (name: string) => ({ type: 'GAME_NAME_CHANGED', name: name } as GameNameChanged),
    playerChange: (name: string) => ({ type: 'PLAYER_NAME_CHANGED', name: name } as PlayerNameChanged),
    startGame: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState();
        const poker = state.poker;
        const game = poker === undefined ? "" : poker.name;
        dispatch({ type: 'START_GAME', game: game });
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<PokerState> = (state: PokerState | undefined, incomingAction: Action): PokerState => {
    const action = incomingAction as KnownAction;
    console.log('what action did i get');
    console.log(action);
    switch (action.type) {
        case 'UPDATE_GAME_STATE':
            console.log('new state');
            console.log(action.state);
            return { ...action.state };
        //case 'ADD_PLAYER':
        //    return { ...state, ...{ playerName: action.name, joined: true } };
        //case 'PLAYER_ADDED':
        //    return { ...state, ...{ otherPlayers: action.players, playerCount: action.players.length } };
        //case 'GAME_NAME_CHANGED':
        //    return { ...state, ...{ gameName: action.name } };
        //case 'PLAYER_NAME_CHANGED':
        //    return { ...state, ...{ playerName: action.name } };
        //case 'START_GAME':
        //case 'GAME_STARTED':
        //    return { ...state, ...{ started: true } };
        //case 'PLAYER_BEING_DEALT':
        //   return { ...state, ...{ hand: action.hand } };
        default:
            if (state === undefined) {
                return BlankState();
            }
            return state;
    }
};
