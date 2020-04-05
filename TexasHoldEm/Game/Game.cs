using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Game
{
    public enum State
    {
        Flop,
        Turn,
        River,
        GameOver
    }

    public class Game
    {
        private Dictionary<string, Player> IdToPlayer = new Dictionary<string, Player>();
        public string Name { get; set; } = string.Empty;
        public int PlayerCount => Players?.Count ?? 0;
        public State State { get; private set; } = State.Flop;
        public Player Dealer { get; private set; }
        public Player BigBlind { get; private set; }
        public Player LittleBlind { get; private set; }
        public List<Player> Players { get; } = new List<Player>();
        public Pot Pot { get; } = new Pot();

        public void AddPlayer(string connection, string name)
        {
            var newPlayer = new Player()
            {
                Name = name
            };
            IdToPlayer[connection] = newPlayer;
            Players.Add(newPlayer);
        }
    }
}
