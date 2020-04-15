﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Library
{
    public enum Suite
    {
        Hearts,
        Diamonds,
        Clubs,
        Spades
    }

    public enum CardValue
    {
        Ace,
        Two,
        Three,
        Four,
        Five,
        Six,
        Seven,
        Eight,
        Nine,
        Ten,
        Jack,
        Queen,
        King
    }

    public class Card
    {
        public Card() { }
        public Card(Suite suite, CardValue value)
        {
            this.Suite = suite;
            this.Value = value;
        }

        public Suite Suite { get; set; }
        public CardValue Value { get; set; }
        public override string ToString() => $"{Value} of {Suite}";
    }
}
