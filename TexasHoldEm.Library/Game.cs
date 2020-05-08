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
        DeterminingWinner,
        DistributingPot,
        GameOver
    }

    public class Game
    {
        public Game(string gameName, double buyInAmount, double bigBlindAmount)
        {
            Name = gameName;
            BuyInAmount = buyInAmount;
            BigBlindAmount = bigBlindAmount;
        }

        private static readonly Random rand = new Random(DateTime.Now.Millisecond);
        public const int CardsInDeck = 52;

        private LinkedList<Player> BetQueue { get; } = new LinkedList<Player>();
        private Dictionary<string, Player> PlayerLookup { get; } = new Dictionary<string, Player>();
        private Stack<Card> Deck { get; set; } = null;
        private int currentPotIndex = 0;
        private List<Pot> Pots { get; set; } = new List<Pot>() { new Pot() };
        private Dictionary<string, Hand> PlayerHands = new Dictionary<string, Hand>();
        public List<HandHistory> HandHistory = new List<HandHistory>();
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
        public List<Player> ShowPlayerCards = new List<Player>();

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

        public void NextStage()
        {

            //todo: verify enough players to continue play.

            if (State == State.Start)
            {
                SetPot(currentPotIndex);
                RequeuePlayers();
                Table[0] = NextCardInDeck();
                Table[1] = NextCardInDeck();
                Table[2] = NextCardInDeck();
                State = State.Flop;
                if (BetQueue.Count() <= 1)
                {
                    BetQueue.Clear();
                }
            }
            else if (State == State.Flop)
            {
                SetPot(currentPotIndex);
                RequeuePlayers();
                Table[3] = NextCardInDeck();
                State = State.Turn;
                if (BetQueue.Count() == 1)
                {
                    BetQueue.Clear();
                }
            }
            else if (State == State.Turn)
            {
                SetPot(currentPotIndex);
                RequeuePlayers();
                Table[4] = NextCardInDeck();
                State = State.River;
                if (BetQueue.Count() == 1)
                {
                    BetQueue.Clear();
                }
            }
            else if (State == State.River)
            {
                SetPot(currentPotIndex);
                PlayerHands = new Dictionary<string, Hand>();
                ShowPlayerCards = new List<Player>();
                foreach (var player in GetPlayersStillInGame())
                {
                    PlayerHands.Add(player.Name, new Hand(GetPlayerCards(player.Name).ToArray(), Table));
                }
                BetQueue.Clear();

                State = State.DeterminingWinner;
                var playerThatNeedToHideShow = new List<Player>();

                foreach (var pot in Pots)
                {
                    var testPlayerShowCards = Dealer;
                    var firstPlayerIn = false;
                    Hand bestHand = null;
                    do
                    {
                        testPlayerShowCards = PlayerAfter(testPlayerShowCards.Position);
                        if (!testPlayerShowCards.Folded && testPlayerShowCards.Chips != 0 && testPlayerShowCards.Hand[0] != null)
                        {
                            if (!playerThatNeedToHideShow.Contains(testPlayerShowCards))
                            {
                                if (!firstPlayerIn)
                                {
                                    firstPlayerIn = true;
                                    bestHand = PlayerHands[testPlayerShowCards.Name];
                                    ShowPlayerCards.Add(testPlayerShowCards);
                                }
                                else
                                {
                                    if (PlayerHands[testPlayerShowCards.Name] < bestHand)
                                    {
                                        playerThatNeedToHideShow.Add(testPlayerShowCards);
                                    }
                                    else
                                    {
                                        ShowPlayerCards.Add(testPlayerShowCards);
                                        if (PlayerHands[testPlayerShowCards.Name] > bestHand)
                                            bestHand = PlayerHands[testPlayerShowCards.Name];
                                    }
                                }
                            }
                        }
                    } while (testPlayerShowCards != Dealer);
                }
                var requeuePlayer = Dealer;
                do
                {
                    requeuePlayer = PlayerAfter(requeuePlayer.Position);
                    if (playerThatNeedToHideShow.Contains(requeuePlayer))
                        BetQueue.AddLast(requeuePlayer);
                } while (requeuePlayer != Dealer);
            }
            else if (State == State.DeterminingWinner)
            {
                SetPot(currentPotIndex);
                State = State.DistributingPot;

                foreach (var pot in Pots)
                {
                    double share = 0;
                    Player winner = null;
                    Hand winningHand = null;
                    var winners = new List<Player>();

                    if (pot.EligiblePlayers.Count() == 1)
                    {
                        winners.Add(pot.EligiblePlayers[0]);
                    }
                    else
                    {
                        foreach (var p in pot.EligiblePlayers)
                        {
                            var hand = PlayerHands[p.Name];
                            if (winner == null ||
                                hand > winningHand)
                            {
                                winners.Clear();
                                winningHand = hand;
                                winner = p;
                                winners.Add(winner);
                            }
                            else if (hand == winningHand)
                            {
                                winners.Add(p);
                            }
                        }
                    }
                    share = pot.PotAmount / winners.Count;
                    foreach (var w in winners)
                    {
                        w.CurrentBet += share;
                    }
                }
                var allWinners = Players.Where(x => x.CurrentBet > 0);
                if (GetPlayersStillInGame().Count() == 1)
                {
                    allWinners.ElementAt(0).Hand[0] = null;
                    allWinners.ElementAt(0).Hand[1] = null;
                    var newHandHistory = new HandHistory();
                    newHandHistory.PlayerName = allWinners.ElementAt(0).Name;
                    newHandHistory.MoneyWon = allWinners.ElementAt(0).CurrentBet;
                    if (HandHistory.Count == 50)
                        HandHistory.RemoveAt(0);
                    HandHistory.Add(newHandHistory);
                }
                else
                {
                    foreach (var handWinner in allWinners)
                    {
                        var newHandHistory = new HandHistory();
                        newHandHistory.PlayerName = handWinner.Name;
                        newHandHistory.MoneyWon = handWinner.CurrentBet;
                        newHandHistory.Hand = PlayerHands[newHandHistory.PlayerName];
                        HandHistory.Add(newHandHistory);
                    }
                }
                Pots.Clear();

            }
            else if (State == State.DistributingPot)
            {
                foreach (var p in Players)
                {
                    p.Chips += p.CurrentBet;
                    p.Hand[0] = null;
                    p.Hand[1] = null;
                }
                for (int i = 0; i < Table.Length; i++) Table[i] = null;
                State = State.GameOver;
            }
            else {
                Start();
            }

            if (State !=  State.DistributingPot && State != State.Start)
            {
                foreach (var p in Players)
                {
                    p.CurrentBet = 0;
                }
                MinBet = 0; // Allows checks.

            }
        }

        private void SetPot(int index, IEnumerable<Player> playerPool = null)
        {
            var players = playerPool ?? Players;
            if (MinBet != 0 || players.Count() > 0) // We didn't check around, if we did there is no money to add to the pot
            {
                var testValue = players.Max(x => x.CurrentBet);
                if (players.All(x => x.CurrentBet == testValue || x.CurrentBet == 0))
                {
                    Pots[index].AddToPot(Players.Sum(x => x.CurrentBet));
                    foreach(var p in players)
                    {
                        p.CurrentBet = 0;
                    }
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
                    if (newPot.EligiblePlayers.Count == 1)
                    {
                        newPot.EligiblePlayers.ElementAt(0).Chips += newPot.EligiblePlayers.ElementAt(0).CurrentBet;
                        newPot.EligiblePlayers.ElementAt(0).CurrentBet = 0;
                    }
                    else
                    {
                        Pots.Add(newPot);
                        currentPotIndex++;
                        SetPot(currentPotIndex, players.Where(x => x.CurrentBet > 0));
                    }
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
                BetQueue.Clear();
                State = State.DeterminingWinner;
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

        public bool ShowCards(string name)
        {
            var player = GetPlayer(name);
            VerifyIsPlayersTurn(player);
            BetQueue.RemoveFirst();
            Pots.ForEach(x => x.RemovePlayer(player));
            ShowPlayerCards.Add(player);
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

        public bool HideCards(string name)
        {
            var player = GetPlayer(name);
            VerifyIsPlayersTurn(player);
            BetQueue.RemoveFirst();
            player.Hand[0] = null;
            player.Hand[1] = null;
            Pots.ForEach(x => x.RemovePlayer(player));
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

        public bool Bet(string name, double wager)
        {
             var player = GetPlayer(name);

            VerifyIsPlayersTurn(player);

            if (player.Folded)
            {
                throw new Exception($"{player.Name} cannot bet after folding");
            }

            if (wager + player.CurrentBet < MinBet && wager != player.Chips)
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
                    Avatar = avatar,
                    Folded = true
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
            ShowPlayerCards = new List<Player>();
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
