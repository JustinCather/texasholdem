﻿using System;
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
            Bet
        }

        public ActionType Action { get; set; } = ActionType.Add;
        public string GameName { get; set; } = string.Empty;
        public string PlayerName { get; set; } = string.Empty;
        public int Wager { get; set; } = 0;
    }
}