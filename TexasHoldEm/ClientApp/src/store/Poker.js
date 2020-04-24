"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// models
var GameState;
(function (GameState) {
    GameState["Start"] = "start";
    GameState["Flop"] = "flop";
    GameState["Turn"] = "turn";
    GameState["River"] = "river";
    GameState["GameOver"] = "gameOver";
})(GameState = exports.GameState || (exports.GameState = {}));
var Suit;
(function (Suit) {
    Suit["Hearts"] = "h";
    Suit["Diamonds"] = "d";
    Suit["Clubs"] = "c";
    Suit["Spades"] = "s";
})(Suit = exports.Suit || (exports.Suit = {}));
var CardValue;
(function (CardValue) {
    CardValue["Ace"] = "a";
    CardValue["Two"] = "2";
    CardValue["Three"] = "3";
    CardValue["Four"] = "4";
    CardValue["Five"] = "5";
    CardValue["Six"] = "6";
    CardValue["Seven"] = "7";
    CardValue["Eight"] = "8";
    CardValue["Nine"] = "9";
    CardValue["Ten"] = "10";
    CardValue["Jack"] = "j";
    CardValue["Queen"] = "q";
    CardValue["King"] = "k";
})(CardValue = exports.CardValue || (exports.CardValue = {}));
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
    };
}
function NewInitState() {
    return {
        state: GameState.GameOver,
        name: 'Chris Test Game',
        joinedGame: true,
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
;
;
;
// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
exports.actionCreators = {
    join: function (game, name) { return function (dispatch, getState) {
        dispatch({ type: 'ADD_PLAYER', game: game, name: name });
    }; },
    bet: function (game, name, wager) { return function (dispatch, getState) {
        dispatch({ type: 'PLAYER_BET', game: game, name: name, wager: wager });
    }; },
    fold: function (game, name) { return function (dispatch, getState) {
        dispatch({ type: 'PLAYER_FOLD', game: game, name: name });
    }; },
    gameChange: function (name) { return ({ type: 'GAME_NAME_CHANGED', name: name }); },
    playerChange: function (name) { return ({ type: 'PLAYER_NAME_CHANGED', name: name }); },
    startGame: function () { return function (dispatch, getState) {
        var _a;
        var state = getState();
        var poker = (_a = state.poker) === null || _a === void 0 ? void 0 : _a.pokerState;
        var game = poker === undefined ? "" : poker.name;
        dispatch({ type: 'START_GAME', game: game });
    }; },
    createGame: function (gameName, buyIn, bigBlind) { return function (dispatch, getState) {
        dispatch({ type: 'CREATE_GAME', gameName: gameName, buyIn: buyIn, bigBlind: bigBlind });
    }; },
    resetCreateGame: function () { return function (dispatch, getState) {
        dispatch({ type: 'RESET_CREATE_GAME' });
    }; }
};
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
exports.reducer = function (state, incomingAction) {
    var action = incomingAction;
    console.log('poker reducer');
    console.log('currentState');
    console.log(state);
    console.log('action type');
    console.log(action.type);
    switch (action.type) {
        case 'UPDATE_GAME_STATE':
            var newState = __assign({}, state);
            newState.pokerState = action.state;
            console.log('new state');
            console.log(action.state);
            return newState;
        case 'GAME_CREATED':
            var newState = __assign({}, state);
            newState.createGameState = {
                attemptedToCreate: true,
                success: true
            };
            console.log('game created statea');
            console.log(newState);
            return newState;
        case 'GAME_ALREADY_EXISTS':
            var newState = __assign({}, state);
            newState.createGameState = {
                attemptedToCreate: true,
                success: false
            };
            console.log('game created statea');
            console.log(newState);
            return newState;
        case 'RESET_CREATE_GAME':
            console.log('resetting game state 1');
            var newState = __assign({}, state);
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
                    pokerState: BlankState(),
                    createGameState: {
                        attemptedToCreate: false,
                        success: false
                    }
                };
                return newState;
            }
            return state;
    }
};
//# sourceMappingURL=Poker.js.map