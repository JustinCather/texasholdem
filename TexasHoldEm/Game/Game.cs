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
        public int BetStartsAt { get; set; } = -1;
        private Queue<Player> BetQueue { get; } = new Queue<Player>();
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

        private void Deal()
        {
            int first = PlayerAfter(DealerIndex);
            int next = first;

            do
            {
                Players[next].Hand[0] = Deck.Next();
                Players[next].Hand[1] = Deck.Next();
                next = PlayerAfter(next);
            } while (next != first);
        }

        private void Bet(Player player, int wager)
        {
            if (player.Chips < wager)
            {
                throw new ArgumentException($"{nameof(wager)} cannot be less than players chips");
            }
            Pot.Add(wager);
            player.Chips -= wager;
            player.CurrentBet = wager;
        }

        private void NextStage()
        {
            foreach (var p in Players) p.CurrentBet = 0;
            Pot.MinBet = 0; // Allows checks.

            if (State == State.Flop)
            {
                Table[0] = Deck.Next();
                Table[1] = Deck.Next();
                Table[2] = Deck.Next();
                State = State.Turn;
            }
            else if (State == State.Turn)
            {
                Table[3] = Deck.Next();
                State = State.Flop;
            }
            else if (State == State.River)
            {
                Table[4] = Deck.Next();
                State = State.GameOver;
            }
        }

        public Player GetPlayer(string name)
        {
            return PlayerLookup[name];
        }

        public Card[] GetTableCards()
        {
            return this.Table.Where(x => x != null).ToArray();
        }

        public bool Bet(Player player, int wager, out Player nextPlayer)
        {
            nextPlayer = null;

            if (BetQueue.Count == 0)
            {
                throw new Exception("No more bets accepted");
            }

            if (BetQueue.Peek().Position != player.Position)
            {
                throw new Exception($"{player.Name} attempted to bet out of turn");
            }

            Bet(player, wager);
            BetQueue.Dequeue();

            if (BetQueue.Count == 0)
            {
                NextStage();
                return false;
            }
            else
            {
                nextPlayer = BetQueue.Peek();
                return true;
            }
        }

        public bool AddPlayer(string name, out Player player)
        {
            if (!PlayerLookup.ContainsKey(name))
            {
                var newPlayer = new Player()
                {
                    Name = name,
                    Position = Players.Count,
                    Chips = 1000000 //todo
                };
                PlayerLookup[name] = newPlayer;
                Players.Add(newPlayer);
                player = newPlayer;
                return true;
            }
            else
            {
                player = PlayerLookup[name];
            }

            return false;
        }

        public Player Start()
        {
            DealerIndex = DealerIndex < 0 ? 0 : PlayerAfter(DealerIndex);
            int littleBlind = PlayerAfter(DealerIndex);
            int bigBlind = PlayerAfter(littleBlind);
            int firstToBet = PlayerAfter(bigBlind);
            int nextToBet = firstToBet;

            Deck = new Deck();
            State = State.Flop;
            Pot.Size = 0;
            Dealer = Players[DealerIndex];
            LittleBlind = Players[littleBlind];
            BigBlind = Players[bigBlind];
            WaitingForBets = true;
            BetStartsAt = littleBlind;
            
            while (nextToBet != littleBlind)
            {
                BetQueue.Enqueue(Players[nextToBet]);
                nextToBet = PlayerAfter(nextToBet);
            }
            BetQueue.Enqueue(LittleBlind); // Need to add him back in since he only betted 25 so far.

            for (int i = 0; i < Table.Length; i++) Table[i] = null;

            Bet(LittleBlind, 25);
            Bet(BigBlind, 50);
            Deal();

            return Players[firstToBet];
        }

        
    }
}
