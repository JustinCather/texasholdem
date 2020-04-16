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

    public enum HandType
    {
        HighCard,
        OnePair,
        TwoPair,
        ThreeOfAKind,
        Straight,
        Flush,
        FullHouse,
        FourOfAKind,
        StraightFlush,
        RoyalFlush,
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
                        Value = value
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

        private IEnumerable<Player> GetPlayersStillInGame()
        {
            return Players.Where(x => !x.Folded);
        }

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

        private bool GetIsStraight(Card[] hand)
        {
            for (int i = 1; i < hand.Length; i++)
            {
                if ((hand[i - 1].Value != CardValue.King && hand[i].Value != CardValue.Ace) && 
                    (hand[i - 1].Value + 1 != hand[i].Value))
                {
                    return false;
                }
            }

            return true;
        }

        public (HandType HandType, int HandValue) GetHandResult(Player player)
        {
            return GetHandResult(player.Hand[0], player.Hand[1], Table[0], Table[1], Table[2]);
        }

        public (HandType HandType, int HandValue) GetHandResult(params Card[] hand)
        {
            bool isStraight;

            // Sort it.
            Array.Sort(hand, (x, y) => x.Value.CompareTo(y.Value));

            //Check if this is a straight.
            isStraight = GetIsStraight(hand);

            // Handle the high/low ace condition.
            if (!isStraight && hand[0].Value == CardValue.Ace)
            {
                // If this is not a straight and first card is anace, then move it to the end to be counted as high card.
                do
                {
                    var temp = hand[0];
                    for (int i = 1; i < hand.Length; i++)
                    {
                        hand[i - 1] = hand[i];
                    }
                    hand[^1] = temp;
                } while (hand[0].Value == CardValue.Ace);

                // Recheck is staight for a high straight case.
                isStraight = GetIsStraight(hand);
            }

            var allSameSuite = hand.GroupBy(x => x.Suite).Count() == 1;                     
            var highStraight = isStraight && hand[^1].Value == CardValue.Ace;
            var bestCardValues = hand.GroupBy(x => x.Value).Select(x => (x.Key, x.Count())).OrderByDescending(x => x.Item2).Take(2).ToArray();
            var firstValue = bestCardValues[0];
            var secondValue = bestCardValues[1];
            var handValue = 0;

            for (int i = 0; i < hand.Length; i++)
            {
                if (i > 0 && hand[i].Value == CardValue.Ace)
                {
                    handValue += (int)CardValue.King + 1;
                }

                handValue += (int)hand[i].Value;
            }

            //todo: best of five...not quite right
            var result = (allSameSuite, highStraight, isStraight, firstValue.Item2, secondValue.Item2) switch
            {
                (true, true, _, _, _) => HandType.RoyalFlush,
                (true, _, true, _, _) => HandType.StraightFlush,
                (_, _, _, 4, _) => HandType.FourOfAKind,
                (_, _, _, 3, 2) => HandType.FullHouse,
                (true, _, _, _, _) => HandType.Flush,
                (_, _, true, _, _) => HandType.Straight,
                (_, _, _, 3, _) => HandType.ThreeOfAKind,
                (_, _, _, 2, 2) => HandType.TwoPair,
                (_, _, _, 2, _) => HandType.OnePair,
                _  => HandType.HighCard
            };

            return (result, handValue);
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
                // Game over.
                int share = 0;
                Player winner = null;
                (HandType HandType, int HandValue) winningHand = default;
                var winners = new List<Player>();

                foreach (var p in GetPlayersStillInGame())
                {
                    var hand = GetHandResult(p);
                    if (winner == null || 
                        hand.HandType > winningHand.HandType || 
                        (hand.HandType == winningHand.HandType && hand.HandValue > winningHand.HandValue))
                    {
                        winners.Clear();
                        winningHand = hand;
                        winner = p;
                        winners.Add(winner);
                    }
                    else if (hand.HandType == winningHand.HandType && 
                             hand.HandValue == winningHand.HandValue)
                    {
                        winners.Add(p);
                    }
                }

                share = PotSize / winners.Count;
                foreach (var w in winners)
                {
                    w.Chips += share;
                    PotSize -= share;
                }

                State = State.GameOver;
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
