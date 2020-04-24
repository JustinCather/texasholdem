using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
                        ProfileImage = string.Empty,
                        PlayerName = p.Name,
                        AvailableMoney = p.Chips,
                        CurrentBet = p.CurrentBet,
                        Folded = p.Folded,
                        PlayersTurn = p == game.Current,
                        AllIn = p.AllIn,
                        IsYou = false,
                        IsDealer = p == game.Dealer,
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
        public GameState AddPlayer(string game, string name)
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

            instance.AddPlayer(name);

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

        public GameState Fold(string game, string name)
        {
            var instance = Games[game];
            instance.Fold(name);
            return GetState(instance);
        }
    }
}
