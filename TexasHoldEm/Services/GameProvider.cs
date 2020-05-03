using System.Collections.Generic;
using System.Linq;
using TexasHoldEm.Models;

namespace TexasHoldEm.Services
{
    public class GameProvider
    {
        private Dictionary<string, Library.Game> Games { get; } = new Dictionary<string, Library.Game>();
        private GameState GetState(Library.Game game)
        {
            var state = new GameState()
            {
                Name = game.Name,
                State = game.State,
                CurrentBet = game.MinBet,
                PotSize = game.PotSize,
                SmallBlindAmount = game.BigBlindAmount/2.0, //todo
                BigBlindAmount = game.BigBlindAmount, //todo
                CommunityCards = new List<Card>(game.GetTableCards().Select(x => new Card(x.Suite, x.Value))),
            };

            foreach (var p in game.Players)
            {
                state.Seats[p.Position] = new Seat()
                {
                    SeatTaken = true,
                    Player = new PlayerState()
                    {
                        ProfileImage =p.Avatar,
                        PlayerName = p.Name,
                        AvailableMoney = p.Chips,
                        CurrentBet = p.CurrentBet,
                        Folded = p.Folded,
                        PlayersTurn = p == game.Current,
                        AllIn = p.AllIn,
                        IsYou = false,
                        IsDealer = p == game.Dealer,
                        PlayerPosition = p.Position,
                        PlayerLost = game.State > Library.State.River && p == game.Current
                    },
                };
            }
            for (var i = 0; i < state.Seats.Length; i++)
            {
                if (state.Seats[i] == null)
                {
                    state.Seats[i] = new Seat()
                    {
                        SeatTaken = false
                    };
                }
            }

            return state;
        }

        public IEnumerable<Card> GetPlayerCards(string game, string user)
        {
            var instance = Games[game];
            return instance.GetPlayerCards(user).Select(x => new Card(x.Suite, x.Value));
        }

        public bool PlayersNeedToTakeAction (string game)
        {
            return Games[game].Current != null;
        }
        public GameState PrepareGameStateForPlayer(GameState state, string user)
        {
            var dealerPos = state.Seats.Where(s => s.Player != null && s.Player.IsDealer).FirstOrDefault()?.Player.PlayerPosition;
            int? currentPlayerPosition = state.Seats.Where(s => s.Player != null && s.Player.PlayersTurn).FirstOrDefault()?.Player.PlayerPosition;
            foreach(var seat in state.Seats){
                if (seat.SeatTaken && seat.Player != null)
                {
                    if (seat.Player.PlayerName.Equals(user))
                    {
                        seat.Player.IsYou = true;
                    }
                    else
                    {
                        seat.Player.IsYou = false;
                    }

                    var cards = GetPlayerCards(state.Name, seat.Player.PlayerName);
                    if(cards != null && cards.Count(x=> x!=null) > 0)
                    {
                        if(seat.Player.IsYou)
                        {
                            seat.Player.Cards = cards;
                        }
                        else
                        {
                            var showCards = false;
                            if (seat.SeatTaken)
                            {
                                if (Games[state.Name].ShowPlayerCards.Where(x => x.Name == seat.Player.PlayerName).Count() > 0)
                                {
                                    showCards = true;
                                }
                                if(currentPlayerPosition != null && dealerPos != null && showCards)
                                {
                                    showCards = false;
                                    if(currentPlayerPosition > dealerPos)
                                    {
                                        if(seat.Player.PlayerPosition < currentPlayerPosition && seat.Player.PlayerPosition > dealerPos)
                                        {
                                            showCards = true;
                                        }
                                    }
                                    else
                                    {
                                        if(seat.Player.PlayerPosition < currentPlayerPosition || seat.Player.PlayerPosition > dealerPos)
                                        {
                                            showCards = true;
                                        }
                                    }
                                }
                                if (state.State == Library.State.DistributingPot)
                                    showCards = true;
                                if (showCards)
                                {
                                    seat.Player.Cards = cards;
                                }
                                else
                                {
                                    seat.Player.Cards = cards.Count(x => x != null) == 0 ? cards : new List<Card> { new Card(Library.Suite.Hidden, Library.CardValue.Hidden), new Card(Library.Suite.Hidden, Library.CardValue.Hidden) };
                                }
                            }
                            else
                            {
                                seat.Player.Cards = cards;
                            }
                        }
                    }
                    else
                    {
                        seat.Player.Cards = new List<Card>();
                    }
                }
            }
            return state;
        }
        public bool CreateGame(string gameName, double startingMoney, double bigBlind)
        {
            if (!Games.ContainsKey(gameName))
            {
                var game  = new Library.Game(gameName,startingMoney,bigBlind);
                Games[gameName] = game;
                return true;
            }
            else
            {
                return false;
            }
        }
        public GameState AddPlayer(string game, string name,string avatar)
        {
            Library.Game instance;

            if (!Games.ContainsKey(game))
            {
                return new GameState()
                {
                    JoinedGame = false,
                    ErrorMessage = "Game Does Not Exist"
               };
            }
            else
            {
                instance = Games[game];
            }

            instance.AddPlayer(name,avatar);

            return GetState(instance);
        }

        public GameState StartGame(string game)
        {
            var instance = Games[game];
            instance.Start();
            return GetState(instance);
        }

        public GameState Bet(string game, string name, double bet)
        {
            var instance = Games[game];
            instance.Bet(name, bet);
            return GetState(instance);
        }

        public GameState ShowCards(string game, string name)
        {
            var instance = Games[game];
            instance.ShowCards(name);
            return GetState(instance);
        }

        public GameState HideCards(string game, string name)
        {
            var instance = Games[game];
            instance.HideCards(name);
            return GetState(instance);
        }


        public GameState Fold(string game, string name)
        {
            var instance = Games[game];
            instance.Fold(name);
            return GetState(instance);
        }

        public GameState AdvanceState(string game)
        {
            var instance = Games[game];
            instance.NextStage();
            return GetState(instance);
        }
    }
}
