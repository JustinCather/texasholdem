using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TexasHoldEm.Library;

namespace TexasHoldEm.Models
{
    public class Card
    {
        public Card() { }

        public Card(Suite suite, CardValue value)
        {
            this.Suite = suite;
            this.Value = value;
        }

        public Suite Suite { get; set; } = Suite.Hearts;
        public CardValue Value { get; set; } = CardValue.Ace;
    }
}
