using System.Collections.Generic;

namespace TexasHoldEm.Models
{
    public class PlayerState
    {
        public string Name { get; set; } = string.Empty;
        public string ProfileImage { get; set; } = string.Empty;
        public int AvailableMoney { get; set; } = 0;
        public int CurrentBet { get; set; } = 0;
        public bool Folded { get; set; } = false;
        public bool PlayersTurn { get; set; } = false;
        public bool AllIn { get; set; } = false;
        public bool IsYou { get; set; } = false;
        public bool IsDealer { get; set; } = false;
        public IEnumerable<Card> Cards { get; set; } = null;
    }
}
