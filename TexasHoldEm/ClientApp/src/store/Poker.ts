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
export interface CreateGameState {
    attemptedToCreate: boolean,
    success: boolean
}

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
    errorMessage: string;
}
export interface AppState {
    pokerState: PokerState,
    createGameState: CreateGameState
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
        joinedGame: false,
        errorMessage: ''
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
export interface CreateGame {type:'CREATE_GAME', gameName:string,buyIn:number,bigBlind:number}
export interface GameCreated { type: 'GAME_CREATED' };
export interface GameAlreayExists { type: 'GAME_ALREADY_EXISTS' };
export interface ResetCreateGameState { type: 'RESET_CREATE_GAME' };
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = CreateGame| ResetCreateGameState | GameCreated | GameAlreayExists|AddPlayer | GameStateUpdated | PlayerFold | PlayerBet | PlayerAdded | PlayerNameChanged | GameNameChanged | StartGame | GameStarted | PlayerBeingDealt;

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
        const poker = state.poker?.pokerState;
        const game = poker === undefined ? "" : poker.name;
        dispatch({ type: 'START_GAME', game: game });
    },
    createGame: (gameName: string, buyIn: number, bigBlind: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'CREATE_GAME', gameName: gameName, buyIn: buyIn, bigBlind: bigBlind });
    },
    resetCreateGame: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'RESET_CREATE_GAME' });
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<AppState> = (state: AppState | undefined, incomingAction: Action): AppState => {
    const action = incomingAction as KnownAction;
    console.log('poker reducer');
    console.log('currentState');
    console.log(state);
    console.log('action type');
    console.log(action.type);
    switch (action.type) {
        case 'UPDATE_GAME_STATE':
            var newState = { ...state } as AppState;
            newState.pokerState = action.state;
            console.log('new state');
            console.log(action.state);
            return newState;

        case 'GAME_CREATED':
            var newState = { ...state } as AppState;
            newState.createGameState = {
                attemptedToCreate: true,
                success: true
            }
            console.log('game created statea');
            console.log(newState);
            return newState;
        case 'GAME_ALREADY_EXISTS':
            var newState = { ...state } as AppState;
            newState.createGameState = {
                attemptedToCreate: true,
                success: false
            }
            console.log('game created statea');
            console.log(newState);
            return newState;
        case 'RESET_CREATE_GAME':
            console.log('resetting game state 1');
            var newState = { ...state } as AppState;
            console.log('resetting game state 2');
            newState.createGameState = {
                attemptedToCreate: false,
                success: false
            };
            console.log('resetting game state 3');
            newState.pokerState.errorMessage = '';
            console.log('resetting game state 4');
            console.log('game created statea');
            console.log('resetting game state 5');
            console.log(newState);
            return newState;
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

                var newState = {
                    pokerState:  BlankState(),
                    createGameState: {
                        attemptedToCreate: false,
                        success: false
                    }
                } as AppState;
                return newState;
            }
            return state;
    }
};
