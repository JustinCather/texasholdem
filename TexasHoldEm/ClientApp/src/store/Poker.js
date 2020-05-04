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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// models
var GameState;
(function (GameState) {
    GameState[GameState["Waiting"] = 0] = "Waiting";
    GameState[GameState["Start"] = 1] = "Start";
    GameState[GameState["Flop"] = 2] = "Flop";
    GameState[GameState["Turn"] = 3] = "Turn";
    GameState[GameState["River"] = 4] = "River";
    GameState[GameState["DeterminingWinner"] = 5] = "DeterminingWinner";
    GameState[GameState["DistributingPot"] = 6] = "DistributingPot";
    GameState[GameState["GameOver"] = 7] = "GameOver";
})(GameState = exports.GameState || (exports.GameState = {}));
var Suite;
(function (Suite) {
    Suite[Suite["Hearts"] = 0] = "Hearts";
    Suite[Suite["Diamonds"] = 1] = "Diamonds";
    Suite[Suite["Clubs"] = 2] = "Clubs";
    Suite[Suite["Spades"] = 3] = "Spades";
    Suite[Suite["Hidden"] = 4] = "Hidden";
})(Suite = exports.Suite || (exports.Suite = {}));
var CardValue;
(function (CardValue) {
    CardValue[CardValue["Ace"] = 0] = "Ace";
    CardValue[CardValue["Two"] = 1] = "Two";
    CardValue[CardValue["Three"] = 2] = "Three";
    CardValue[CardValue["Four"] = 3] = "Four";
    CardValue[CardValue["Five"] = 4] = "Five";
    CardValue[CardValue["Six"] = 5] = "Six";
    CardValue[CardValue["Seven"] = 6] = "Seven";
    CardValue[CardValue["Eight"] = 7] = "Eight";
    CardValue[CardValue["Nine"] = 8] = "Nine";
    CardValue[CardValue["Ten"] = 9] = "Ten";
    CardValue[CardValue["Jack"] = 10] = "Jack";
    CardValue[CardValue["Queen"] = 11] = "Queen";
    CardValue[CardValue["King"] = 12] = "King";
    CardValue[CardValue["Hidden"] = 13] = "Hidden";
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
        errorMessage: '',
        handHistory: [],
        chat: []
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
;
;
;
// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
exports.actionCreators = {
    join: function (game, name, avatar) { return function (dispatch, getState) {
        dispatch({ type: 'ADD_PLAYER', game: game, name: name, avatar: avatar });
    }; },
    bet: function (game, name, wager) { return function (dispatch, getState) {
        dispatch({ type: 'PLAYER_BET', game: game, name: name, wager: wager });
    }; },
    fold: function (game, name) { return function (dispatch, getState) {
        dispatch({ type: 'PLAYER_FOLD', game: game, name: name });
    }; },
    showCards: function (game, name) { return function (dispatch, getState) {
        dispatch({ type: "SHOW_CARDS", game: game, name: name });
    }; },
    hideCards: function (game, name) { return function (dispatch, getState) {
        dispatch({ type: "HIDE_CARDS", game: game, name: name });
    }; },
    gameChange: function (name) { return ({ type: 'GAME_NAME_CHANGED', name: name }); },
    playerChange: function (name) { return ({ type: 'PLAYER_NAME_CHANGED', name: name }); },
    startGame: function () { return function (dispatch, getState) {
        var state = getState();
        var poker = state.poker.pokerState;
        var game = poker === undefined ? "" : poker.name;
        var user = state.poker.pokerState.seats.filter(function (x) { return x.seatTaken && x.player && x.player.isYou; });
        if (user[0].player)
            dispatch({ type: 'START_GAME', game: game, name: user[0].player.playerName });
    }; },
    createGame: function (gameName, buyIn, bigBlind) { return function (dispatch, getState) {
        dispatch({ type: 'CREATE_GAME', gameName: gameName, buyIn: buyIn, bigBlind: bigBlind });
    }; },
    resetCreateGame: function () { return function (dispatch, getState) {
        dispatch({ type: 'RESET_CREATE_GAME' });
    }; },
    sendChat: function (game, player, message) { return function (dispatch, getState) {
        dispatch({ type: 'SEND_CHAT', game: game, player: player, message: message });
    }; }
};
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
exports.reducer = function (state, incomingAction) {
    var action = incomingAction;
    switch (action.type) {
        case 'UPDATE_GAME_STATE':
            var newState = __assign({}, state);
            var tempchat = __spreadArrays(newState.pokerState.chat);
            newState.pokerState = action.state;
            newState.pokerState.chat = tempchat;
            return newState;
        case 'NEW_CHAT_MESSAGE':
            console.log('new message reducer');
            var newState = __assign({}, state);
            var tempPokerState = __assign({}, newState.pokerState);
            console.log(newState);
            tempPokerState.chat = __spreadArrays(tempPokerState.chat, [{ playerName: action.player, message: action.message }]);
            if (tempPokerState.chat.length > 100)
                tempPokerState.chat.shift();
            newState.pokerState = tempPokerState;
            return newState;
        case 'GAME_CREATED':
            var newState = __assign({}, state);
            newState.createGameState = {
                attemptedToCreate: true,
                success: true
            };
            return newState;
        case 'GAME_ALREADY_EXISTS':
            var newState = __assign({}, state);
            newState.createGameState = {
                attemptedToCreate: true,
                success: false
            };
            return newState;
        case 'RESET_CREATE_GAME':
            var newState = __assign({}, state);
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
                    }
                };
                console.log('init state');
                console.log(newState);
                return newState;
            }
            return state;
    }
};
//# sourceMappingURL=Poker.js.map