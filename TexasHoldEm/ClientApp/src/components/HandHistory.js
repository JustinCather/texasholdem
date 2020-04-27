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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var PokerStore = require("../store/Poker");
var HandHistory = /** @class */ (function (_super) {
    __extends(HandHistory, _super);
    function HandHistory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HandHistory.prototype.getCardImage = function (card) {
        return './cards/' + card.value + card.suite + '.png';
    };
    HandHistory.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement("ul", null, this.props.map(function (hand, index) { return (React.createElement("div", null,
                React.createElement("div", null,
                    hand.player,
                    " won $",
                    hand.amount,
                    " with a *get hand name*"),
                React.createElement("div", null,
                    hand.cards.map(function (card, index) { return (React.createElement("img", { src: _this.getCardImage(card) })); }),
                    ";"))); }))));
    };
    return HandHistory;
}(React.PureComponent));
;
exports.default = react_redux_1.connect(function (state) { return state.poker.handHistoryState; }, PokerStore.actionCreators)(HandHistory);
//# sourceMappingURL=HandHistory.js.map