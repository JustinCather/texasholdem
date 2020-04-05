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
        private int DealerIndex { get; set; } = -1;
        private Dictionary<string, Player> PlayerLookup { get; } = new Dictionary<string, Player>();
        private Deck Deck { get; set; }

        public string Name { get; set; } = string.Empty;
        public int PlayerCount => Players?.Count ?? 0;
        public Card[] Table { get; } = new Card[5];
        public State State { get; private set; } = State.Flop;
        public Player Dealer { get; private set; }
        public Player BigBlind { get; private set; }
        public Player LittleBlind { get; private set; }
        public List<Player> Players { get; } = new List<Player>();
        public Pot Pot { get; } = new Pot();
        public bool WaitingForBets { get; private set; } = false;
        private int PlayerAfter(int index) => (index + 1) % PlayerCount;

        private void Bet(Player player, int wager)
        {
            if (player.Chips < wager)
            {
                throw new ArgumentException($"{nameof(wager)} cannot be less than players chips");
            }
            Pot.Add(wager);
            player.Chips -= wager;
        }

        private void Deal()
        {
            int first = PlayerAfter(DealerIndex);
            int next = first;

            do
            {
                Players[next].Hand[0] = Deck[0];
                Players[next].Hand[1] = Deck[1];
                Deck.Cards.RemoveRange(0, 2);
                next = PlayerAfter(next);
            } while (next != first);
        }

        public bool AddPlayer(string name, string connectionId)
        {
            if (!PlayerLookup.ContainsKey(name))
            {
                var newPlayer = new Player()
                {
                    Name = name,
                    Chips = 1000000 //todo
                };
                newPlayer.ConnectionIds.Add(connectionId);
                PlayerLookup[name] = newPlayer;
                Players.Add(newPlayer);
                return true;
            }
            else
            {
                PlayerLookup[name].ConnectionIds.Add(connectionId);
            }

            return false;
        }

        public void Start()
        {
            DealerIndex = DealerIndex < 0 ? 0 : PlayerAfter(DealerIndex);
            int littleBlind = PlayerAfter(DealerIndex);
            int bigBlind = PlayerAfter(littleBlind);

            Deck = new Deck();
            State = State.Flop;
            Pot.Size = 0;
            Dealer = Players[DealerIndex];
            LittleBlind = Players[littleBlind];
            BigBlind = Players[bigBlind];
            WaitingForBets = true;
            for (int i = 0; i < Table.Length; i++) Table[i] = null;

            Bet(LittleBlind, (int)Pot.MinBet / 2);
            Bet(BigBlind, (int)Pot.MinBet);
            Deal();
        }

        public void NextStage()
        {
            if (State == State.Flop)
            {
                Table[0] = Deck[0];
                Table[1] = Deck[1];
                Table[2] = Deck[2];
                Deck.Cards.RemoveRange(0, 3);
            }
            else if (State == State.Turn)
            {
                Table[3] = Deck[0];
                Deck.Cards.RemoveRange(0, 1);
            }
            else if (State == State.River)
            {
                Table[4] = Deck[0];
                Deck.Cards.RemoveRange(0, 1);
            }
        }
      
        public void Bet(string player, int wager)
        {
            var p = PlayerLookup[player];
            Bet(p, wager);
        }
    }
}
