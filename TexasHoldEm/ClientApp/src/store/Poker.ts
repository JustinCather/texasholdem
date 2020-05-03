import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { Redirect } from 'react-router-dom';

// models
export enum GameState {
    Waiting,
    Start,
    Flop,
    Turn,
    River,
    DeterminingWinner,
    DistributingPot,
    GameOver
}

export interface Seat {
    seatTaken: boolean;
    player?: Player;
}

export interface Player {
    playerName: string;
    profileImage?: string;
    availableMoney: number;
    currentBet: number;
    folded: boolean;
    allIn: boolean;
    playersTurn: boolean;
    isYou: boolean;
    isDealer: boolean;
    cards?: Card[];
    playerLost: boolean;
    playerPosition: number;
}

export interface Card {
    suite: Suite;
    value: CardValue;
}

export enum Suite {
    Hearts,
    Diamonds,
    Clubs,
    Spades,
    Hidden
}

export enum CardValue {
    Ace,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Hidden
}
export interface HandHistory {
    player: string,
    amount: number,
    cards: Card[]
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
    createGameState: CreateGameState,
    handHistoryState: HandHistory[]
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
                suite: Suite.Hearts,
                value: CardValue.King
            },
            {
                suite: Suite.Hearts,
                value: CardValue.Queen
            },
            {
                suite: Suite.Hearts,
                value: CardValue.Ten
            },
            {
                suite: Suite.Clubs,
                value: CardValue.King
            },
            {
                suite: Suite.Hearts,
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
                    cards: [{ suit: Suite.Hearts, value: CardValue.Ace }, { suit: Suite.Hearts, value: CardValue.Eight }],
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

export interface AddPlayer { type: 'ADD_PLAYER', game: string, name: string, avatar: string }
export interface PlayerBet { type: 'PLAYER_BET', game: string, name: string, wager: number }
export interface PlayerFold { type: 'PLAYER_FOLD', game: string, name: string }
export interface PlayerAdded { type: 'PLAYER_ADDED', name: string, players: string[] }
export interface PlayerNameChanged { type: 'PLAYER_NAME_CHANGED', name: string }
export interface GameNameChanged { type: 'GAME_NAME_CHANGED', name: string }
export interface StartGame { type: 'START_GAME', game: string, name: string }
export interface GameStarted { type: 'GAME_STARTED' }
export interface PlayerBeingDealt { type: 'PLAYER_BEING_DEALT', hand: string[] }
export interface GameStateUpdated { type: 'UPDATE_GAME_STATE', state: PokerState }
export interface CreateGame {type:'CREATE_GAME', gameName:string,buyIn:number,bigBlind:number}
export interface GameCreated { type: 'GAME_CREATED' };
export interface GameAlreayExists { type: 'GAME_ALREADY_EXISTS' };
export interface ResetCreateGameState { type: 'RESET_CREATE_GAME' };
export interface ShowCards { type: 'SHOW_CARDS', game: string, name: string }
export interface HideCards { type: 'HIDE_CARDS', game: string, name: string }
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = ShowCards | HideCards| CreateGame| ResetCreateGameState | GameCreated | GameAlreayExists|AddPlayer | GameStateUpdated | PlayerFold | PlayerBet | PlayerAdded | PlayerNameChanged | GameNameChanged | StartGame | GameStarted | PlayerBeingDealt;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    join: (game: string, name: string, avatar: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'ADD_PLAYER', game: game, name: name,avatar:avatar });
    },
    bet: (game: string, name: string, wager: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'PLAYER_BET', game: game, name: name, wager: wager });
    },
    fold: (game: string, name: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'PLAYER_FOLD', game: game, name: name });
    },
    showCards: (game: string, name: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: "SHOW_CARDS", game: game, name: name });
    },
    hideCards: (game: string, name: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: "HIDE_CARDS", game: game, name: name });
    },
    gameChange: (name: string) => ({ type: 'GAME_NAME_CHANGED', name: name } as GameNameChanged),
    playerChange: (name: string) => ({ type: 'PLAYER_NAME_CHANGED', name: name } as PlayerNameChanged),
    startGame: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState();
        const poker = state.poker.pokerState;
        const game = poker === undefined ? "" : poker.name;
        var user = state.poker.pokerState.seats.filter((x) => x.seatTaken && x.player && x.player.isYou);
        if (user[0].player)
            dispatch({ type: 'START_GAME', game: game, name: user[0].player.playerName });
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

    switch (action.type) {
        case 'UPDATE_GAME_STATE':
            var newState = { ...state } as AppState;
            newState.pokerState = action.state;
            return newState;

        case 'GAME_CREATED':
            var newState = { ...state } as AppState;
            newState.createGameState = {
                attemptedToCreate: true,
                success: true
            }
            return newState;
        case 'GAME_ALREADY_EXISTS':
            var newState = { ...state } as AppState;
            newState.createGameState = {
                attemptedToCreate: true,
                success: false
            }
            return newState;
        case 'RESET_CREATE_GAME':
            var newState = { ...state } as AppState;
            newState.createGameState = {
                attemptedToCreate: false,
                success: false
            };
            newState.pokerState.errorMessage = '';
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
                    pokerState: BlankState(),
                    createGameState: {
                        attemptedToCreate: false,
                        success: false
                    },
                    handHistoryState: [] as HandHistory[]
                } as AppState;
                return newState;
            }
            return state;
    }
};
