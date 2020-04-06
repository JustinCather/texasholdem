using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Game
{
    public class Pot
    {
        public int Size { get; set; } = 0;
        public int MinBet { get; set; } = 0;


        public void Add(int value)
        {
            if (value < MinBet)
            {
                throw new ArgumentException($"{nameof(value)} cannot be less than min bet of {MinBet}");
            }

            Size += value;
            if (value > MinBet)
            {
                MinBet = value;
            }
        }

    }
}
