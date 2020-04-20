import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { ApplicationState, reducers } from './';
import * as signalR from "@microsoft/signalr";
import { connect } from 'http2';

enum ActionType {
    Add,
    Start,
    Bet,
    Fold,
}


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
            case "ADD_PLAYER": {
                let playerAction = {
                    Action: ActionType.Add,
                    PlayerName: action.name,
                    GameName: action.game,
                    Wager: 0
                };
                connection.invoke("TakeAction", playerAction);
                break;
            }
            case "PLAYER_FOLD": {
                let playerAction = {
                    Action: ActionType.Fold,
                    PlayerName: action.name,
                    GameName: action.game,
                    Wager: 0
                };
                connection.invoke("TakeAction", playerAction);
                break;
            }
            case "PLAYER_BET": {
                let playerAction = {
                    Action: ActionType.Bet,
                    PlayerName: action.name,
                    GameName: action.game,
                    Wager: action.wager
                };
                connection.invoke("TakeAction", playerAction);
                break;
            }
            case 'START_GAME':
                connection.invoke('StartGame', action.game);
                break;
        }

        return next(action);
    }
}

export function signalRRegisterCommands(store: any) {

    
    connection.on('newPlayerJoined', (game, added, players) => {
        store.dispatch({ type: 'PLAYER_ADDED', name: added, players: players });
        console.log("A new player has been added");
    });

    connection.on('signalrGameStateUpdate', (state) => {
        console.log(store);
        store.dispatch({ type: 'UPDATE_GAME_STATE', state: state });
        console.log("Game State Updated");
    });

    connection.on('gameStarted', data => {
        store.dispatch({ type: 'GAME_STARTED' });
        console.log("The game has started");
    });

    connection.on('playerBeingDealt', (first, second) => {
        const cards = [first, second];

        store.dispatch({ type: 'PLAYER_BEING_DEALT', hand: cards });
        console.log("The player was dealt");
    });

    connection.start();
}