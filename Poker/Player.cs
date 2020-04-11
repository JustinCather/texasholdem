﻿using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Library
{
    public class Player
    {
        public Player()
        {
        }

        public string Name { get; set; } = string.Empty;
        public int Position { get; set; } = 0;
        public int Chips { get; set; } = 0;
        public int CurrentBet { get; set; } = 0;
        public bool Folded { get; set; } = false;
        public Card[] Hand { get; } = new Card[2];
    }
}