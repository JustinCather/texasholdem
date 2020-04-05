import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CounterState {
    count: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface IncrementCountAction { type: 'INCREMENT_COUNT' }
export interface DecrementCountAction { type: 'DECREMENT_COUNT' }
export interface IncrementSignalRCountAction { type: 'SIGNALR_INCREMENT_COUNT' }
export interface DecrementSignalRCountAction { type: 'SIGNALR_DECREMENT_COUNT' }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = IncrementCountAction | DecrementCountAction | IncrementSignalRCountAction | DecrementSignalRCountAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

// export const actionCreators = {
//     increment: () => ({ type: 'INCREMENT_COUNT' } as IncrementCountAction),
//     incrementS: () => ({ type: 'SIGNALR_INCREMENT_COUNT'} as IncrementSignalRCountAction),
//     decrement: () => ({ type: 'DECREMENT_COUNT' } as DecrementCountAction),
//     decrementS: () => ({ type: 'SIGNALR_DECREMENT_COUNT' } as DecrementSignalRCountAction)
// };

export const actionCreators = {
    increment: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
         dispatch({ type: 'SIGNALR_INCREMENT_COUNT'});
         dispatch({ type: 'INCREMENT_COUNT'});
    },
    decrement: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
         dispatch({ type: 'SIGNALR_DECREMENT_COUNT'});
         dispatch({ type: 'DECREMENT_COUNT'});
    }
}


// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<CounterState> = (state: CounterState | undefined, incomingAction: Action): CounterState => {
    if (state === undefined) {
        return { count: 0 };
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'INCREMENT_COUNT':
            return { count: state.count + 1 };
        case 'DECREMENT_COUNT':
            return { count: state.count - 1 };
        default:
            return state;
    }
};
