using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TexasHoldEm.Models;
using TexasHoldEm.Services;

namespace TexasHoldEm.Hubs
{
    public class PokerHub : Hub
    {
        private GameProvider gameProvider;
        private UserProvider userProvider;

        public PokerHub(GameProvider gameProvider, UserProvider userProvider)
        {
            this.gameProvider = gameProvider;
            this.userProvider = userProvider;
        }

        private async Task SendGameState(GameState state)
        {
            var users = state.Seats
                .Where(x => x.SeatTaken)
                .Select(x => x.Player)
                .ToDictionary(x => x.PlayerName, y => y);

            foreach (var userAndIds in userProvider.GetUsersAndIds(users.Keys))
            {
                var user = users[userAndIds.user];

                try
                {
                    user.Cards = gameProvider.GetPlayerCards(state.Name, user.PlayerName);
                    user.IsYou = true;

                    foreach (var id in userAndIds.ids)
                    {
                        await Clients.Client(id).SendAsync("signalrGameStateUpdate", state);
                    }
                }
                finally
                {
                    user.Cards = null;
                    user.IsYou = false;
                }
            }
        }

        public async Task TakeAction(PlayerAction action)
        {
            GameState state = null;

            if (string.IsNullOrEmpty(action.GameName))
            {
                throw new HubException($"{nameof(action.GameName)} must be provided");
            }

            if (string.IsNullOrEmpty(action.PlayerName))
            {
                throw new HubException($"{nameof(action.PlayerName)} must be provided");
            }

            userProvider.AddConnection(action.PlayerName, Context.ConnectionId);

            switch (action.Action)
            {
                case PlayerAction.ActionType.Add:
                    state = gameProvider.AddPlayer(action.GameName, action.PlayerName);
                    break;
                case PlayerAction.ActionType.Start:
                    state = gameProvider.StartGame(action.GameName);
                    break;
                case PlayerAction.ActionType.Bet:
                    state = gameProvider.Bet(action.GameName, action.PlayerName, action.Wager);
                    break;
                case PlayerAction.ActionType.Fold:
                    state = gameProvider.Fold(action.GameName, action.PlayerName);
                    break;
                default:
                    break;
            }

            if (state != null)
            {
                await SendGameState(state);
            }
        }
    }
}
