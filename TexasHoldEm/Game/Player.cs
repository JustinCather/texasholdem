using System;
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

        public string Id { get; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public int Position { get; private set; } = 0;
        public int Chips { get; private set; }
    }
}
