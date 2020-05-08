using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Models
{

    public class PlayerAction
    {
        public enum ActionType
        {
            Add,
            Start,
            Bet,
            Fold,
            ShowCards,
            HideCards
        }

        public ActionType Action { get; set; } = ActionType.Add;
        public string GameName { get; set; } = string.Empty;
        public string PlayerName { get; set; } = string.Empty;
        public double Wager { get; set; } = 0;
        public string Avatar { get; set; }

        public override string ToString()
        {
            return $"action: {Action}\n" +
                $"gameName: {GameName}\n" +
                $"playerName:{PlayerName}\n" +
                $"wager: {Wager}";
        }
    }
}
