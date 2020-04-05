import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { ApplicationState, reducers } from './';
import * as signalR from "@microsoft/signalr";
import { connect } from 'http2';

export default function configureStore(history: History, initialState?: ApplicationState) {
    const middleware = [
        thunk,
        routerMiddleware(history),
        signalRInvokeMiddleware
    ];

    const rootReducer = combineReducers({
        ...reducers,
        router: connectRouter(history)
    });

    const enhancers = [];
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
    }

    return createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );
}

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/poker")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

export function signalRInvokeMiddleware(store: any) {
    return (next: any) => async (action: any) => {
        switch (action.type) {
            case "SIGNALR_INCREMENT_COUNT":
                connection.invoke('IncrementCounter');
                break;
            case "SIGNALR_DECREMENT_COUNT":
                connection.invoke('DecrementCounter');
                break;
            case "ADD_PLAYER":
                connection.invoke("AddPlayer", action.game, action.name)
                break;
            case 'START_GAME':
                connection.invoke('StartGame', action.game);
                break;
        }

        return next(action);
    }
}

export function signalRRegisterCommands(store: any) {

    connection.on('IncrementCounter', data => {
        store.dispatch({ type: 'INCREMENT_COUNT' })
        console.log("Count has been incremented");
    })

    connection.on('DecrementCounter', data => {
        store.dispatch({ type: 'DECREMENT_COUNT' })
        console.log("Count has been decremented");
    })

    connection.on('newPlayerJoined', (game, added, players) => {
        store.dispatch({type: 'PLAYER_ADDED', name: added, players: players});
        console.log("A new player has been added");
    });

    connection.on('gameStarted', data => {
        store.dispatch({type: 'GAME_STARTED'});
        console.log("The game has started");
    });

    //(c1Suite,  c1Value, c2Suite, c2Value)
    connection.on('playerBeingDealt', (first, second) => {
        const cards = [first, second];

        store.dispatch({type: 'PLAYER_BEING_DEALT', hand: cards});
        console.log("The player was dealt");
    });

    connection.start();
}