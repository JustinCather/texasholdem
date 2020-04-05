using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Game
{
    public enum Chip
    { 
        TwentyFiveCents = 25,
        FiftyCents = 50,
        OneDollar = 100,
        TwoDollarsFiftyCents = 250,
        FiveDollars = 500
    }


    public class Pot
    {
        public int Size { get; set; } = 0;
        public Chip MinBet { get; set; } = Chip.TwentyFiveCents;
    }
}
