using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Hubs
{
    public class PokerHub : Hub
    {
        private Game.GameProvider gameProvider;

        public PokerHub(Game.GameProvider gameProvider)
        {
            this.gameProvider = gameProvider;
        }

        public async Task AddPlayer(string game, string name)
        {
            if (!gameProvider.Games.ContainsKey(game))
            {
                gameProvider.Games[game] = new Game.Game();
            }
            var g = gameProvider.Games[game];

            await Groups.AddToGroupAsync(Context.ConnectionId, game);

            if (g.AddPlayer(name, Context.ConnectionId))
            {   
                await Clients.Group(game).SendAsync("newPlayerJoined", game, name, g.Players.Select(x => x.Name).ToArray());
            }
        }

        public async Task StartGame(string game)
        {
            var g = gameProvider.Games[game];

            g.Start();

            foreach (var p in g.Players)
            {
                foreach (var c in p.ConnectionIds)
                {
                    await Clients.Client(c).SendAsync("playerBeingDealt", p.Hand[0].ToString(), p.Hand[1].ToString());
                }
            }

            await Clients.Group(game).SendAsync("gameStarted");
        }

        public async Task IncrementCounter()
        {
            List<String> ConnectionIDToIgnore = new List<String>();
            ConnectionIDToIgnore.Add(Context.ConnectionId);
            await Clients.AllExcept(ConnectionIDToIgnore).SendAsync("IncrementCounter");
        }

        public async Task DecrementCounter()
        {
            List<String> ConnectionIDToIgnore = new List<String>();
            ConnectionIDToIgnore.Add(Context.ConnectionId);
            await Clients.AllExcept(ConnectionIDToIgnore).SendAsync("DecrementCounter");
        }
    }
}
