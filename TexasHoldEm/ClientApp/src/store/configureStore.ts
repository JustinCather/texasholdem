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
    ShowCards,
    HideCards
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
            case "CREATE_GAME": {
                var createGameAction = {
                    GameName:action.gameName,
                    BigBlind: action.bigBlind,
                    StartingMoney: action.buyIn
                };
                connection.invoke("CreateGame", createGameAction);
                break;
            }
            case "ADD_PLAYER": {
                let playerAction = {
                    Action: ActionType.Add,
                    PlayerName: action.name,
                    GameName: action.game,
                    Avatar: action.avatar,
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
            case "SHOW_CARDS": {
                let playerAction = {
                    Action: ActionType.ShowCards,
                    PlayerName: action.name,
                    GameName: action.game,
                    Wager: 0
                };
                connection.invoke("TakeAction", playerAction);
                break;
            }
            case "HIDE_CARDS": {
                let playerAction = {
                    Action: ActionType.HideCards,
                    PlayerName: action.name,
                    GameName: action.game,
                    Wager: 0
                };
                connection.invoke("TakeAction", playerAction);
                break;
                break;
            }
            case 'START_GAME':
                let playerAction = {
                    Action: ActionType.Start,
                    PlayerName: action.name,
                    GameName: action.game,
                    Wager: 0
                };
                connection.invoke('TakeAction', playerAction);
                break;
        }

        return next(action);
    }
}

export function signalRRegisterCommands(store: any) {

    
    connection.on('newPlayerJoined', (game, added, players) => {
        store.dispatch({ type: 'PLAYER_ADDED', name: added, players: players });
    });

    connection.on('signalrGameStateUpdate', (state) => {
        store.dispatch({ type: 'UPDATE_GAME_STATE', state: state });
    });

    connection.on('gameAlreadyExists', (state) => {
        store.dispatch({ type: 'GAME_ALREADY_EXISTS', state: state });
    });

    connection.on('gameCreated', (state) => {
        store.dispatch({ type: 'GAME_CREATED', state: state });
    });
    
    connection.on('gameStarted', data => {
        store.dispatch({ type: 'GAME_STARTED' });
    });

    connection.on('playerBeingDealt', (first, second) => {
        const cards = [first, second];

        store.dispatch({ type: 'PLAYER_BEING_DEALT', hand: cards });
    });

    connection.start();
}