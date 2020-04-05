using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Game
{
    public class Player
    {
        public Player()
        {
        }

        public ConcurrentBag<string> ConnectionIds { get; } = new ConcurrentBag<string>();
        public string Name { get; set; } = string.Empty;
        public int Chips { get; set; } = 0;
        public Card[] Hand { get; } = new Card[2];
    }
}
