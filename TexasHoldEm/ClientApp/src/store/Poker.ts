import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface PokerState {
    joined: boolean;
    playerCount: number;
    otherPlayers: string[];
    playerName: string;
    gameName: string;
    isPlayersTurn: boolean;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface AddPlayer { type: 'ADD_PLAYER', game: string, name: string }
export interface PlayerAdded { type: 'PLAYER_ADDED', name: string, players: string[] }
export interface PlayerNameChanged { type: 'PLAYER_NAME_CHANGED', name: string }
export interface GameNameChanged { type: 'GAME_NAME_CHANGED', name: string }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = AddPlayer | PlayerAdded | PlayerNameChanged | GameNameChanged;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    join: (game: string, name: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'ADD_PLAYER', game: game, name: name });
    },
    gameChange: (name: string) => ({ type: 'GAME_NAME_CHANGED', name: name } as GameNameChanged),
    playerChange: (name: string) => ({ type: 'PLAYER_NAME_CHANGED', name: name } as PlayerNameChanged)
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<PokerState> = (state: PokerState | undefined, incomingAction: Action): PokerState => {
    if (state === undefined) {
        return { joined: false, gameName: "test", isPlayersTurn: false, playerCount: 0, playerName: "", otherPlayers: [] }
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'ADD_PLAYER':
            return { ...state, ...{ playerName: action.name, joined: true } };
        case 'PLAYER_ADDED':
            return { ...state, ...{ otherPlayers: action.players, playerCount: action.players.length } };
        case 'GAME_NAME_CHANGED':
            return { ...state, ...{ gameName: action.name } };
        case 'PLAYER_NAME_CHANGED':
            return { ...state, ...{ playerName: action.name } };
        default:
            return state;
    }
};
