using System.Collections.Generic;

namespace TexasHoldEm.Models
{
    public class GameState
    {
        public Library.State State { get; set; } = Library.State.Start;
        public string Name { get; set; } = string.Empty;
        public int CurrentBet { get; set; } = 0;
        public int PotSize { get; set; } = 0;
        public int SmallBlindAmount { get; set; } = 0;
        public int BigBlindAmount { get; set; } = 0;
        public List<Card> CommunityCards { get; set; } = new List<Card>();
        public List<Seat> Seats { get; set; } = new List<Seat>();
    }
}
