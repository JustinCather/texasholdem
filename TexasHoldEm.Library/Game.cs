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


        private LinkedList<Player> BetQueue { get; } = new LinkedList<Player>();
        private Dictionary<string, Player> PlayerLookup { get; } = new Dictionary<string, Player>();
        private Stack<Card> Deck { get; set; } = null;

        public int PotSize { get; private set; } = 0;
        public int MinBet { get; private set; } = 0;
        public string Name { get; private set; } = string.Empty;
        public int PlayerCount => Players.Count;
        public Card[] Table { get; } = new Card[5];
        public State State { get; private set; } = State.Flop;
        public Player Dealer { get; private set; }
        public Player BigBlind { get; private set; }
        public Player LittleBlind { get; private set; }
        public Player Current => BetQueue.First?.Value;
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

        private Card NextCardInDeck() => Deck.Pop();

        private Player PlayerAfter(int index) => Players[(index + 1) % PlayerCount];

        private Player PlayerAfterRecursive(Player player)
        {
            return PlayerAfterRecursive(player.Position, player.Position);
        }

        private Player PlayerAfterRecursive(int startIndex, int index)
        {
            var player = PlayerAfter(index);

            if (player.Position == startIndex || (!player.Folded && player.Chips > 0))
            {
                return player;
            }

            return PlayerAfterRecursive(startIndex, index + 1);
        }

        private Player GetPlayer(string name)
        {
            return PlayerLookup[name];
        }

        private void VerifyIsPlayersTurn(Player player)
        {
            if (BetQueue.Count == 0)
            {
                throw new Exception("No more bets accepted");
            }

            if (BetQueue.First.Value.Position != player.Position)
            {
                throw new Exception($"{player.Name} attempted to bet out of turn");
            }

            
        }

        private void Deal(int pos)
        {
            var first = PlayerAfterRecursive(Dealer);
            var next = first;

            do
            {
                next.Hand[pos] = NextCardInDeck();
                next = PlayerAfterRecursive(next.Position, next.Position);
            } while (next.Position != first.Position);
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
            //todo: verify enough players to continue play.

            if (State == State.Start)
            {
                Table[0] = NextCardInDeck();
                Table[1] = NextCardInDeck();
                Table[2] = NextCardInDeck();
                State = State.Flop;
            }
            else if (State == State.Flop)
            {
                Table[3] = NextCardInDeck();
                State = State.River;
            }
            else if (State == State.River)
            {
                Table[4] = NextCardInDeck();
                State = State.Turn;
            }
            else
            {
                State = State.GameOver;
                // Game over.
                //todo: win conditions.

            }

            foreach (var p in Players)
            {
                p.CurrentBet = 0;
                p.Folded = false;
                p.AllIn = false;
            }

            MinBet = 0; // Allows checks.
        }

        public IEnumerable<Card> GetTableCards()
        {
            return this.Table.Where(x => x != null);
        }

        public IEnumerable<Card> GetPlayerCards(string name)
        {
            return PlayerLookup[name].Hand.Where(x => x != null);
        }

        public void Fold(string name)
        {
            var player = GetPlayer(name);
            VerifyIsPlayersTurn(player);
            BetQueue.RemoveFirst();
            player.Folded = true;
            player.Hand[0] = null;
            player.Hand[1] = null;
        }

        public bool Bet(string name, int wager)
        {
            var player = GetPlayer(name);

            VerifyIsPlayersTurn(player);

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
            BetQueue.RemoveFirst();

            if (wager + player.CurrentBet > MinBet)
            {
                // Need to requeue other players.
                var startAt = PlayerAfterRecursive(player);

                if (BetQueue.Count > 0)
                {
                    startAt = PlayerAfterRecursive(BetQueue.Last.Value);
                }

                while (startAt.Position != player.Position)
                {
                    BetQueue.AddLast(startAt);
                    startAt = PlayerAfterRecursive(startAt);
                }
            }

            // Add the players bet to pot.
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

        public bool AddPlayer(string name)
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
                return true;
            }

            return false;
        }

        public void Start()
        {
            var enoughPlayers = Players.Where(x => x.Chips > 0).Count() > 1;
            if (!enoughPlayers)
            {
                throw new Exception("Not enough players with chips to play");
            }

            Dealer = Dealer == null ? Players[0] : PlayerAfterRecursive(Dealer);
            LittleBlind = PlayerAfterRecursive(Dealer);
            BigBlind = PlayerAfterRecursive(LittleBlind);

            foreach (var p in Players)
            {
                p.AllIn = false;
                p.Folded = false;
                p.Hand[0] = null;
                p.Hand[1] = null;
            }

            for (int i = 0; i < Table.Length; i++) Table[i] = null;

            Deck = GetNewDeck();
            State = State.Start;
            PotSize = 0;

            // Add everyone to the bet queue.
            var nextToBet = PlayerAfterRecursive(BigBlind);
            while (nextToBet.Position != LittleBlind.Position)
            {
                BetQueue.AddLast(nextToBet);
                nextToBet = PlayerAfterRecursive(nextToBet);
            }
            BetQueue.AddLast(LittleBlind); // Need to add him back in since he only betted 25 so far.

            AdjustPotPlayerChips(LittleBlind, 25);
            AdjustPotPlayerChips(BigBlind, 50);
            Deal(0);
            Deal(1);
        }
    }
}
