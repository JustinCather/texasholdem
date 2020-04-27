using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Library
{
    public enum State
    {
        Waiting,
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
        public Game(string gameName, double buyInAmount, double bigBlindAmount)
        {
            Name = gameName;
            BuyInAmount = buyInAmount;
            BigBlindAmount = bigBlindAmount;
        }

        private static readonly Random rand = new Random(42);
        public const int CardsInDeck = 52;

        private LinkedList<Player> BetQueue { get; } = new LinkedList<Player>();
        private Dictionary<string, Player> PlayerLookup { get; } = new Dictionary<string, Player>();
        private Stack<Card> Deck { get; set; } = null;
        private int currentPotIndex = 0;
        private List<Pot> Pots { get; set; } = new List<Pot>() { new Pot() };
        public double PotSize { get { return Pots.Sum(x => x.PotAmount); } }
        public double MinBet { get; private set; } = 0;
        public string Name { get; private set; } = string.Empty;
        public double BigBlindAmount { get; private set; }
        public double BuyInAmount { get; private set; }
        public int PlayerCount => Players.Count;
        public Card[] Table { get; } = new Card[5];
        public State State { get; private set; } = State.Waiting;
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
                    if (suite != Suite.Hidden && value != CardValue.Hidden)
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

        private void AdjustPotPlayerChips(Player player, double wager)
        {
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
                _ => HandType.HighCard
            };

            return (result, handValue);
        }

        private void NextStage()
        {

            SetPot(currentPotIndex);
            //todo: verify enough players to continue play.

            if (State == State.Start)
            {
                RequeuePlayers();
                Table[0] = NextCardInDeck();
                Table[1] = NextCardInDeck();
                Table[2] = NextCardInDeck();
                State = State.Flop;
                if (BetQueue.Count() == 0)
                    NextStage();
            }
            else if (State == State.Flop)
            {
                RequeuePlayers();
                Table[3] = NextCardInDeck();
                State = State.River;
                if (BetQueue.Count() == 0)
                    NextStage();
            }
            else if (State == State.River)
            {
                RequeuePlayers();
                Table[4] = NextCardInDeck();
                State = State.Turn;
                if (BetQueue.Count() == 0)
                    NextStage();
            }
            else
            {
                // Game over.
                foreach (var pot in Pots)
                {
                    double share = 0;
                    Player winner = null;
                    (HandType HandType, int HandValue) winningHand = default;
                    var winners = new List<Player>();

                    if (pot.EligiblePlayers.Count() == 1)
                    {
                        winners.Add(pot.EligiblePlayers[0]);
                    }
                    else
                    {
                        foreach (var p in pot.EligiblePlayers)
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
                    }
                    share = pot.PotAmount / winners.Count;
                    foreach (var w in winners)
                    {
                        w.Chips += share;
                    }
                }

                State = State.GameOver;
            }

            foreach (var p in Players)
            {
                p.CurrentBet = 0;
            }

            MinBet = 0; // Allows checks.
            if (State == State.GameOver)
            {
                Start();
            }
        }

        private void SetPot(int index, IEnumerable<Player> playerPool = null)
        {
            var players = playerPool ?? GetPlayersStillInGame();
            if(playerPool.Count() == 1)
            {
                //there is only one player eligible for this split pot
                //The only way they should get here if they over bet, so give them a refund
                playerPool.ElementAt(0).Chips += playerPool.ElementAt(0).CurrentBet;
            }
            if (MinBet != 0 || players.Count() > 0) // We didn't check around, if we did there is no money to add to the pot
            {
                var testValue = players.Max(x => x.CurrentBet);
                if (players.All(x => x.CurrentBet == testValue || x.CurrentBet == 0))
                {
                    Pots[index].AddToPot(Players.Sum(x => x.CurrentBet));
                }
                else
                {
                    var playerAllIn = players.Where(x => x.CurrentBet == (players.Min(y => y.CurrentBet))).ElementAt(0);
                    var betValue = playerAllIn.CurrentBet;
                    var sumAddedToMainPot = 0.0;
                    foreach (var p in Players)
                    {
                        if (p.CurrentBet != 0 && p.CurrentBet >= playerAllIn.CurrentBet)
                        {
                            sumAddedToMainPot += betValue;
                            p.CurrentBet -= betValue;
                        }
                        else if (p.CurrentBet < playerAllIn.CurrentBet) // the player(p) had folded
                        {
                            sumAddedToMainPot += p.CurrentBet;
                            p.CurrentBet = 0;
                        }
                    }
                    Pots[index].AddToPot(sumAddedToMainPot);
                    Pot newPot = new Pot();
                    newPot.EligiblePlayers = players.Where(x => x.CurrentBet > 0).ToList();
                    Pots.Add(newPot);
                    currentPotIndex++;
                    SetPot(currentPotIndex, players.Where(x => x.CurrentBet > 0));
                }
            }
        }
        public IEnumerable<Card> GetTableCards()
        {
            return this.Table.Where(x => x != null);
        }

        public IEnumerable<Card> GetPlayerCards(string name)
        {
            return PlayerLookup[name].Hand.Where(x => x != null);
        }

        public bool Fold(string name)
        {
            var player = GetPlayer(name);
            VerifyIsPlayersTurn(player);
            BetQueue.RemoveFirst();
            player.Folded = true;
            player.Hand[0] = null;
            player.Hand[1] = null;
            Pots.ForEach(x => x.RemovePlayer(player));

            if (GetPlayersStillInGame().Count() == 1)
            {
                State = State.GameOver;
                NextStage();
                return false;
            }
            else
            {
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
        }

        public bool Bet(string name, double wager)
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

        public bool AddPlayer(string name, string avatar)
        {
            if (!PlayerLookup.ContainsKey(name))
            {
                var newPlayer = new Player()
                {
                    Name = name,
                    Position = Players.Count,
                    Chips = BuyInAmount,
                    Avatar = avatar
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
            foreach (var p in Players)
            {
                p.AllIn = false;
                p.Folded = false;
                p.Hand[0] = null;
                p.Hand[1] = null;
            }
            Dealer = Dealer == null ? Players[0] : PlayerAfterRecursive(Dealer);
            LittleBlind = PlayerAfterRecursive(Dealer);
            BigBlind = PlayerAfterRecursive(LittleBlind);



            for (int i = 0; i < Table.Length; i++) Table[i] = null;

            Deck = GetNewDeck();
            State = State.Start;
            Pots = new List<Pot>() { new Pot() };
            currentPotIndex = 0;
            Pots[currentPotIndex].EligiblePlayers = Players.Where(x => x.Chips > 0).ToList();

            // Add everyone to the bet queue.
            var nextToBet = PlayerAfterRecursive(BigBlind);
            while (nextToBet.Position != LittleBlind.Position)
            {
                BetQueue.AddLast(nextToBet);
                nextToBet = PlayerAfterRecursive(nextToBet);
            }
            BetQueue.AddLast(LittleBlind); // Need to add him back in since he only betted 25 so far.

            AdjustPotPlayerChips(LittleBlind, BigBlindAmount / 2.0);
            AdjustPotPlayerChips(BigBlind, BigBlindAmount);
            Deal(0);
            Deal(1);
        }

        private void RequeuePlayers()
        {
            var firstPlayer = PlayerAfterRecursive(Dealer);
            var startAt = firstPlayer;
            do
            {
                if (startAt != Dealer || (startAt == Dealer && !Dealer.Folded))
                {
                    BetQueue.AddLast(startAt);
                    startAt = PlayerAfterRecursive(startAt);
                }
            } while (startAt.Position != firstPlayer.Position);
        }
    }
}
