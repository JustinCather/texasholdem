using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Hubs
{
    public class PokerHub : Hub
    {
        //private Game.GameProvider gameProvider;

        //public PokerHub(Game.GameProvider gameProvider)
        //{
        //    this.gameProvider = gameProvider;
        //}

        //public async Task NewGame(string name)
        //{
        //    if (!gameProvider.Games.ContainsKey(name))
        //    {
        //        gameProvider.Games[name] = new Game.Game();
        //    }

        //    await Clients.All.SendAsync("gamesAvailable", gameProvider.Games.Keys);
        //}

        //public async Task AddPlayer(string game, string name)
        //{
        //    if (gameProvider.Games.ContainsKey(name))
        //    {
        //        var g = gameProvider.Games[game];
        //        g.AddPlayer(Context.ConnectionId, name);
        //        await Clients.All.SendAsync("newPlayerJoined", game, name);
        //    }
        //}

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
