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
var Player_1 = require("./Player");
var PlayerActions = /** @class */ (function (_super) {
    __extends(PlayerActions, _super);
    function PlayerActions(props) {
        var _this = _super.call(this, props) || this;
        _this.bet = function () {
            var newState = __assign({}, _this.state);
            newState.state = 'increaseBet';
            newState.minBet = _this.props.bigBlindAmount;
            _this.setState(newState);
        };
        _this.raise = function () {
            var newState = __assign({}, _this.state);
            newState.state = 'increaseBet';
            newState.minBet = 2 * _this.props.currentBet;
            newState.playerBet = newState.minBet;
            _this.setState(newState);
        };
        _this.setBet = function (event) {
            var newState = __assign({}, _this.state);
            var value = event.target.value;
            newState.playerBet = +value;
            _this.setState(newState);
        };
        _this.handleBetOrRaise = function () {
            _this.props.bet(_this.props.name, _this.state.player.playerName, (_this.state.playerBet - _this.state.player.currentBet));
            alert('Sending bet of ' + _this.state.playerBet + 'to the server');
        };
        _this.handleFold = function () {
            _this.props.fold(_this.props.name, _this.state.player.playerName);
            alert('Player Folded');
        };
        _this.handleCall = function () {
            console.log('handling check/call');
            console.log('current table bet ' + _this.props.currentBet);
            console.log('current player bet ' + _this.state.player.currentBet);
            _this.props.bet(_this.props.name, _this.state.player.playerName, _this.state.playerBet - _this.state.player.currentBet);
            alert('Player called the current bet');
        };
        _this.handleAllIn = function () {
            _this.props.bet(_this.props.name, _this.state.player.playerName, _this.state.player.availableMoney);
            alert('Player called the current bet');
            alert('Player is going all in');
        };
        _this.back = function () {
            var newState = __assign({}, _this.state);
            newState.state = 'init';
            _this.setState(newState);
        };
        _this.state = _this.initState(props);
        _this.handleFold = _this.handleFold.bind(_this);
        _this.handleCall = _this.handleCall.bind(_this);
        _this.handleAllIn = _this.handleAllIn.bind(_this);
        _this.handleBetOrRaise = _this.handleBetOrRaise.bind(_this);
        _this.back = _this.back.bind(_this);
        _this.bet = _this.bet.bind(_this);
        _this.raise = _this.raise.bind(_this);
        _this.setBet = _this.setBet.bind(_this);
        return _this;
    }
    PlayerActions.prototype.initState = function (props) {
        var _maxBet = 0;
        var tempPlayer = props.seats.filter(function (x) { return x.seatTaken && x.player && x.player.isYou; })[0].player;
        var player;
        if (tempPlayer)
            player = tempPlayer;
        else {
            player = new Player_1.default();
            player.currentBet = 0;
        }
        if (player) {
            _maxBet = player.availableMoney;
        }
        return {
            state: 'init',
            playerBet: props.currentBet,
            minBet: 0,
            maxBet: _maxBet,
            player: player
        };
    };
    PlayerActions.prototype.componentWillReceiveProps = function (nextProps) {
        console.log('Resetting State');
        console.log(nextProps);
        var newState = this.initState(nextProps);
        console.log(newState);
        this.setState(newState);
    };
    PlayerActions.prototype.render = function () {
        var _a, _b;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { style: { position: 'absolute', top: '81vh', left: '42vW' } },
                (this.state.state === 'init' && this.props.currentBet == 0 && this.state.player.availableMoney > this.props.bigBlindAmount) &&
                    React.createElement("div", null,
                        React.createElement("button", { onClick: this.handleFold, style: { textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Fold "),
                        React.createElement("button", { onClick: this.handleCall, style: { textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Check "),
                        React.createElement("button", { onClick: this.bet, style: { textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Bet  ")),
                (this.state.state === 'init' && this.props.currentBet == 0 && this.state.player.availableMoney <= this.props.bigBlindAmount) &&
                    React.createElement("div", null,
                        React.createElement("button", { onClick: this.handleFold, style: { textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Fold "),
                        React.createElement("button", { onClick: this.handleCall, style: { textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Check "),
                        React.createElement("button", { onClick: this.handleAllIn, style: { textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " ALL IN! ")),
                (this.state.state === 'init' && this.props.currentBet > 0 && (this.state.player.availableMoney + this.state.player.currentBet) > this.props.currentBet && (this.state.player.availableMoney + this.state.player.currentBet) > 2 * this.props.currentBet) &&
                    React.createElement("div", null,
                        React.createElement("button", { onClick: this.handleFold, style: { textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Fold "),
                        React.createElement("button", { onClick: this.handleCall, style: { textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } },
                            " Call ",
                            React.createElement("br", null),
                            " $",
                            this.props.currentBet - ((_a = this.state.player.currentBet) !== null && _a !== void 0 ? _a : 0),
                            " "),
                        React.createElement("button", { onClick: this.raise, style: { textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Raise ")),
                (this.state.state === 'init' && this.props.currentBet > 0 && (this.state.player.availableMoney + this.state.player.currentBet) > this.props.currentBet && (this.state.player.availableMoney + this.state.player.currentBet) <= 2 * this.props.currentBet) &&
                    React.createElement("div", null,
                        React.createElement("button", { onClick: this.handleFold, style: { textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Fold "),
                        React.createElement("button", { onClick: this.handleCall, style: { textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } },
                            " Call ",
                            React.createElement("br", null),
                            " $",
                            this.props.currentBet - ((_b = this.state.player.currentBet) !== null && _b !== void 0 ? _b : 0),
                            " "),
                        React.createElement("button", { onClick: this.handleAllIn, style: { textAlign: 'center', verticalAlign: 'top', marginLeft: '10px', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " ALL IN! ")),
                (this.state.state === 'init' && this.props.currentBet > 0 && (this.state.player.availableMoney + this.state.player.currentBet) <= this.props.currentBet) &&
                    React.createElement("div", null,
                        React.createElement("button", { onClick: this.handleFold, style: { textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Fold "),
                        React.createElement("button", { onClick: this.handleAllIn, style: { textAlign: 'center', verticalAlign: 'top', marginLeft: '15vH', height: '15vH', width: '15vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " ALL IN! ")),
                (this.state.state === 'increaseBet') &&
                    React.createElement("div", null,
                        React.createElement("button", { onClick: this.back, style: { textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '18vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Back "),
                        React.createElement("input", { type: "number", onChange: this.setBet, min: this.state.minBet, max: this.state.maxBet, name: "name", value: this.state.playerBet, style: { marginLeft: '10px', marginTop: '4vH', width: '15vH', fontSize: '3vh', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'gray', borderColor: 'gray' } }),
                        React.createElement("button", { onClick: this.handleBetOrRaise, style: { marginLeft: '10px', textAlign: 'center', verticalAlign: 'top', height: '15vH', width: '18vH', borderRadius: '40%', background: 'rgb(169, 85, 85)', borderColor: 'rgb(169, 85, 85)', fontSize: '4vh', fontWeight: 'bold' } }, " Confirm ")))));
    };
    return PlayerActions;
}(React.PureComponent));
;
exports.default = PlayerActions;
//# sourceMappingURL=PlayerActions.js.map