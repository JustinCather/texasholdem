using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TexasHoldEm.Game;

namespace TexasHoldEm.Hubs
{
    public class PokerHub : Hub
    {
        private GameProvider gameProvider;

        public PokerHub(GameProvider gameProvider)
        {
            this.gameProvider = gameProvider;
        }

        private async Task EnsureIdLinked(Player player, string game)
        {
            player.ConnectionIds.Add(Context.ConnectionId);
            await Groups.AddToGroupAsync(Context.ConnectionId, game);
        }

        private async Task MessagePlayer(Player player, string method, params object[] args)
        {
            foreach (var c in player.ConnectionIds)
            {
                if (args != null && args.Length > 0)
                {
                    await Clients.Client(c).SendAsync(method, args);
                }
                else
                {
                    await Clients.Client(c).SendAsync(method);
                }
            }
        }

        public async Task AddPlayer(string game, string name)
        {
            if (!gameProvider.Games.ContainsKey(game))
            {
                gameProvider.Games[game] = new Game.Game();
            }

            var g = gameProvider.Games[game];

            if (g.AddPlayer(name, out var player))
            {
                await EnsureIdLinked(player, game);
                await Clients.Group(game).SendAsync("newPlayerJoined", game, name, g.Players.Select(x => x.Name).ToArray());
            }
        }

        public async Task StartGame(string game)
        {
            var g = gameProvider.Games[game];
            var waitingOn = g.Start();

            foreach (var p in g.Players)
            {
                await MessagePlayer(p, "playerBeingDealt", p.Hand[0].ToString(), p.Hand[1].ToString());
            }

            await Clients.Group(game).SendAsync("gameStarted");
            await MessagePlayer(waitingOn, "playersBet");
            await Clients.Group(game).SendAsync("waitingForPlayerToBet", waitingOn.Name);
        }

        public async Task Bet(string game, string name, int bet)
        {
            var g = gameProvider.Games[game];
            var user = g.GetPlayer(name);

            await EnsureIdLinked(user, game);

            g.Bet(user, bet, out var waitingOn);

            if (waitingOn != null)
            {
                await MessagePlayer(waitingOn, "playersBet");
                await Clients.Group(game).SendAsync("waitingForPlayerToBet", waitingOn.Name);
            }
        }
    }
}
