using System.Collections.Generic;

namespace TexasHoldEm.Models
{
    public class GameState
    {
        public Library.State State { get; set; } = Library.State.Start;
        public string Name { get; set; } = string.Empty;
        public double CurrentBet { get; set; } = 0;
        public double PotSize { get; set; } = 0;
        public double SmallBlindAmount { get; set; } = 0;
        public double BigBlindAmount { get; set; } = 0;
        public List<Card> CommunityCards { get; set; } = new List<Card>();
        public Seat[] Seats { get; set; } = new Seat[9];
        public bool JoinedGame { get; set; } = true;
    }
}
