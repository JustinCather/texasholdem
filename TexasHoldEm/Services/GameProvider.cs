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
                SmallBlindAmount = 25, //todo
                BigBlindAmount = 50, //todo
                CommunityCards = new List<Card>(game.GetTableCards().Select(x => new Card(x.Suite, x.CardValue))),
                Seats = new List<Seat>(12)
            };

            foreach (var p in game.Players)
            {
                state.Seats.Add(new Seat()
                {
                    SeatTaken = true,
                    Player = new PlayerState()
                    {
                        ProfileImage = string.Empty,
                        Name = p.Name,
                        AvailableMoney = p.Chips,
                        CurrentBet = p.CurrentBet,
                        Folded = p.Folded,
                        PlayersTurn = p == game.Current,
                        AllIn = p.AllIn,
                        IsYou = false,
                        IsDealer = p == game.Dealer,
                    },
                });
            }

            return state;
        }

        public IEnumerable<Card> GetPlayerCards(string game, string user)
        {
            var instance = Games[game];
            return instance.GetPlayerCards(user).Select(x => new Card(x.Suite, x.CardValue));
        }

        public GameState AddPlayer(string game, string name)
        {
            Library.Game instance;

            if (!Games.ContainsKey(game))
            {
                instance = new Library.Game();
                Games[game] = instance;
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

        public GameState Bet(string game, string name, int bet)
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
