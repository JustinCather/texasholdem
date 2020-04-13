using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Library
{ 
    public enum State
    {
        Start,
        Flop,
        Turn,
        River,
        GameOver
    }

    public class Game
    {
        private static readonly Random rand = new Random(42);
        public const int CardsInDeck = 52;


        private int DealerIndex { get; set; } = -1;
        public int BetStartsAt { get; set; } = -1;
        private Queue<Player> BetQueue { get; } = new Queue<Player>();
        private Dictionary<string, Player> PlayerLookup { get; } = new Dictionary<string, Player>();
        private Stack<Card> Deck { get; set; } = null;

        public int PotSize { get; set; } = 0;
        public int MinBet { get; set; } = 0;
        public string Name { get; set; } = string.Empty;
        public int PlayerCount => Players?.Count ?? 0;
        public Card[] Table { get; } = new Card[5];
        public State State { get; private set; } = State.Flop;
        public Player Dealer { get; private set; }
        public Player BigBlind { get; private set; }
        public Player LittleBlind { get; private set; }
        public Player Current => BetQueue.Count > 0 ? BetQueue.Peek() : null;
        public List<Player> Players { get; } = new List<Player>();
        public bool WaitingForBets { get; private set; } = false;
        public string PeekBetQueue => string.Join("=>", BetQueue.ToArray().Select(x => x.Name));

        private static Stack<Card> GetNewDeck()
        {
            var deckList = new List<Card>(CardsInDeck);
            var deck = new Stack<Card>(CardsInDeck);

            foreach (var suite in Enum.GetValues(typeof(Suite)).Cast<Suite>())
            {
                foreach (var value in Enum.GetValues(typeof(CardValue)).Cast<CardValue>())
                {
                    deckList.Add(new Card()
                    {
                        Suite = suite,
                        CardValue = value
                    });
                }
            }

            lock (rand)
            {
                foreach (var c in deckList.OrderBy(x => rand.Next()))
                {
                    deck.Push(c);
                }
            }

            return deck;
        }

        private int PlayerAfter(int index) => (index + 1) % PlayerCount;

        private Card NextCardInDeck() => Deck.Pop();

        private void ResetGame()
        {
            foreach (var p in Players)
            {
                p.AllIn = false;
                p.Folded = false;
                p.Hand[0] = null;
                p.Hand[1] = null;
            }

            for (int i = 0; i < Table.Length; i++) Table[i] = null;

            Deck = GetNewDeck();
            State = State.Flop;
            PotSize = 0;
        }

        private void Deal()
        {
            int first = PlayerAfter(DealerIndex);
            int next = first;

            do
            {
                Players[next].Hand[0] = NextCardInDeck();
                Players[next].Hand[1] = NextCardInDeck();
                next = PlayerAfter(next);
            } while (next != first);
        }

        private void AdjustPotPlayerChips(Player player, int wager)
        {
            PotSize += wager;
            player.Chips -= wager;
            player.CurrentBet += wager;

            if (player.CurrentBet > MinBet)
            {
                MinBet = player.CurrentBet;
            }

            player.AllIn = player.Chips == 0;
        }

        private void NextStage()
        {
            foreach (var p in Players) p.CurrentBet = 0;
            MinBet = 0; // Allows checks.

            if (State == State.Flop)
            {
                Table[0] = NextCardInDeck();
                Table[1] = NextCardInDeck();
                Table[2] = NextCardInDeck();
                State = State.Turn;
            }
            else if (State == State.Turn)
            {
                Table[3] = NextCardInDeck();
                State = State.Flop;
            }
            else if (State == State.River)
            {
                Table[4] = NextCardInDeck();
                State = State.GameOver;
            }
            else
            {
                // Game over.
                //todo: win conditions.

            }
        }

        public Player GetPlayer(string name)
        {
            return PlayerLookup[name];
        }

        public IEnumerable<Card> GetTableCards()
        {
            return this.Table.Where(x => x != null);
        }

        public bool Bet(Player player, int wager)
        {
            if (BetQueue.Count == 0)
            {
                throw new Exception("No more bets accepted");
            }

            if (BetQueue.Peek().Position != player.Position)
            {
                throw new Exception($"{player.Name} attempted to bet out of turn");
            }

            if (player.Folded)
            {
                throw new Exception($"{player.Name} cannot bet after folding");
            }

            if (wager + player.CurrentBet < MinBet)
            {
                throw new Exception($"{player.Name} attempted to bet below min bet of {MinBet}");
            }

            if (player.Chips < wager)
            {
                throw new Exception($"{player.Name} attempt to bet {wager} and only has {player.Chips}");
            }

            // Remove the player from queue.
            BetQueue.Dequeue();

            if (wager + player.CurrentBet > MinBet)
            {
                // Need to requeue other players.
                var hold = BetQueue.ToArray();
                var stopAt = player.Position;
                var startAt = PlayerAfter(stopAt);

                if (hold.Length > 0)
                {
                    startAt = hold[hold.Length - 1].Position;
                    startAt = PlayerAfter(startAt);
                }

                while (startAt != stopAt)
                {
                    if (!Players[startAt].Folded)
                    {
                        BetQueue.Enqueue(Players[startAt]);
                    }
                    
                    startAt = PlayerAfter(startAt);
                }
            }

            AdjustPotPlayerChips(player, wager);
            
            if (BetQueue.Count == 0)
            {
                NextStage();
                return false;
            }
            else
            {
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

        public void Start()
        {
            DealerIndex = DealerIndex < 0 ? 0 : PlayerAfter(DealerIndex);
            int littleBlind = PlayerAfter(DealerIndex);
            int bigBlind = PlayerAfter(littleBlind);
            int firstToBet = PlayerAfter(bigBlind);
            int nextToBet = firstToBet;

            ResetGame();
         
            Dealer = Players[DealerIndex];
            LittleBlind = Players[littleBlind];
            BigBlind = Players[bigBlind];
            BetStartsAt = littleBlind;
            
            while (nextToBet != littleBlind)
            {
                BetQueue.Enqueue(Players[nextToBet]);
                nextToBet = PlayerAfter(nextToBet);
            }
            BetQueue.Enqueue(LittleBlind); // Need to add him back in since he only betted 25 so far.

            AdjustPotPlayerChips(LittleBlind, 25);
            AdjustPotPlayerChips(BigBlind, 50);
            Deal();
        }

        
    }
}
