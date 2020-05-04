"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var React = require("react");
var react_redux_1 = require("react-redux");
var PokerStore = require("../store/Poker");
var Player_1 = require("./Player");
var cardImageHelper_1 = require("../helpers/cardImageHelper");
var HandHistory = /** @class */ (function (_super) {
    __extends(HandHistory, _super);
    function HandHistory(props) {
        var _this = _super.call(this, props) || this;
        _this.showChat = function () {
            var newState = __assign({}, _this.state);
            newState.showHandHistory = false;
            _this.setState(newState);
        };
        _this.showHandHistory = function () {
            var newState = __assign({}, _this.state);
            newState.showHandHistory = true;
            _this.setState(newState);
        };
        _this.setChatMessage = function (event) {
            var newState = __assign({}, _this.state);
            var value = event.target.value;
            newState.chatMessage = value;
            _this.setState(newState);
        };
        _this.sendChat = function () {
            _this.props.sendChat(_this.props.name, _this.state.player.playerName, _this.state.chatMessage);
            var newState = __assign({}, _this.state);
            newState.chatMessage = '';
            _this.setState(newState);
        };
        console.log('init props');
        console.log(props);
        var tempPlayer = props.seats.filter(function (x) { return x.seatTaken && x.player && x.player.isYou; })[0].player;
        var player;
        if (tempPlayer)
            player = tempPlayer;
        else {
            player = new Player_1.default();
        }
        _this.state = {
            showHandHistory: true,
            chatMessage: '',
            player: player
        };
        _this.showChat = _this.showChat.bind(_this);
        _this.showHandHistory = _this.showHandHistory.bind(_this);
        _this.setChatMessage = _this.setChatMessage.bind(_this);
        _this.sendChat = _this.sendChat.bind(_this);
        return _this;
    }
    HandHistory.prototype.componentWillReceiveProps = function (nextProps) {
        console.log('new props rec');
        var newState = __assign({}, this.state);
        this.setState(newState);
    };
    HandHistory.prototype.render = function () {
        var _this = this;
        console.log('rendering chat/history');
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { style: { position: 'absolute', top: '0vh', left: '80vw', backgroundColor: 'white', height: '8vh', width: '20vw', textAlign: 'center', verticalAlign: 'center', borderBottom: '2px solid black' } },
                React.createElement("button", { onClick: this.showChat, style: { width: '50%', height: '100%', backgroundColor: !this.state.showHandHistory ? 'grey' : 'lightgrey' } }, " Chat "),
                React.createElement("button", { onClick: this.showHandHistory, style: { width: '50%', height: '100%', backgroundColor: this.state.showHandHistory ? 'grey' : 'lightgrey' } }, " Hand History ")),
            React.createElement("div", { style: { position: 'absolute', top: '8vh', left: '80vw', backgroundColor: 'khaki', height: '82vh', overflow: 'scroll', width: '20vw' } },
                this.state.showHandHistory &&
                    React.createElement("ul", null, this.props.handHistory.map(function (hand, index) { return (React.createElement("div", null,
                        React.createElement("div", null, hand.message),
                        React.createElement("div", null, hand.cards && hand.cards.map(function (card, index) { return (React.createElement("img", { src: cardImageHelper_1.GetCardImage(card), style: { height: '8vh' } })); })),
                        React.createElement("br", null))); })),
                !this.state.showHandHistory &&
                    React.createElement("ul", { style: { paddingLeft: '0px' } }, this.props.chat.map(function (message, index) { return (React.createElement("div", { style: { textAlign: _this.state.player.playerName == message.playerName ? 'right' : 'left', paddingRight: _this.state.player.playerName == message.playerName ? '10px' : '0px', paddingLeft: _this.state.player.playerName != message.playerName ? '10px' : '0px' } },
                        React.createElement("div", { style: { fontWeight: 'bold' } },
                            _this.state.player.playerName ? message.playerName : 'You',
                            ":"),
                        React.createElement("div", null, message.message))); }))),
            React.createElement("div", { style: { position: 'absolute', top: '90vh', left: '80vw', backgroundColor: 'white', height: '10vh', width: '20vw' } },
                React.createElement("input", { type: 'text', onChange: this.setChatMessage, value: this.state.chatMessage, style: { width: '15vw', height: '100%' } }),
                React.createElement("button", { onClick: this.sendChat, style: { width: '5vw', height: '100%' } }, "Send"))));
    };
    return HandHistory;
}(React.PureComponent));
;
exports.default = react_redux_1.connect(function (state) { return state.poker.pokerState; }, PokerStore.actionCreators)(HandHistory);
//# sourceMappingURL=HandHistory.js.map