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
        public Chip MinBet { get; set; } = Chip.FiftyCents;

        private bool AdjustPot(ref int val, Chip chip)
        {
            int chipVal = (int)chip;

            if (val > 0 && val % chipVal == 0)
            {
                Size += chipVal;
                val -= chipVal;
                return true;
            }
            else
            {
                return false;
            }
        }

        public void Add(int value)
        {
            int lVal = value;

            if (value < (int)MinBet / 2)
            {
                throw new ArgumentException($"{nameof(value)} cannot be less than min bet of {MinBet}");
            }

            while (lVal > 0)
            {
                AdjustPot(ref lVal, Chip.FiveDollars);
                AdjustPot(ref lVal, Chip.TwoDollarsFiftyCents);
                AdjustPot(ref lVal, Chip.OneDollar);
                AdjustPot(ref lVal, Chip.FiftyCents);
                AdjustPot(ref lVal, Chip.TwentyFiveCents);
            }
        }

    }
}
