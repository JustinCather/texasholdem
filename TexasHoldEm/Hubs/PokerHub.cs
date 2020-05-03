using Microsoft.AspNetCore.SignalR;
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

        private async Task SendGameCreated(string userId)
        {
            await Clients.Client(userId).SendAsync("gameCreated");
        }

        private async Task SendGameAlreadyExists(string userId)
        {
            await Clients.Client(userId).SendAsync("gameAlreadyExists");
        }

        private async Task SendJoinStatus(string userId, GameState state)
        {
            await Clients.Client(userId).SendAsync("signalrGameStateUpdate", state);
        }

        private async Task SendGameState(GameState state)
        {
            var users = state.Seats
                .Where(x => x.SeatTaken)
                .Select(x => x.Player)
                .ToDictionary(x => x.PlayerName, y => y);

            foreach (var userAndIds in userProvider.GetUsersAndIds(users.Keys))
            {
                state = gameProvider.PrepareGameStateForPlayer(state, userAndIds.user);

                foreach (var id in userAndIds.ids)
                {
                    await Clients.Client(id).SendAsync("signalrGameStateUpdate", state);
                }
            }

            if (!gameProvider.PlayersNeedToTakeAction(state.Name) && state.State != Library.State.Waiting)
            {
                await Task.Delay(5000);
                await SendGameState(gameProvider.AdvanceState(state.Name));
            }
        }
        public async Task CreateGame(CreateGame game)
        {
            var successful = gameProvider.CreateGame(game.GameName, game.StartingMoney, game.BigBlind);
            if (successful)
            {
                await SendGameCreated(Context.ConnectionId);
            }
            else
            {
                await SendGameAlreadyExists(Context.ConnectionId);
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
                    state = gameProvider.AddPlayer(action.GameName, action.PlayerName, action.Avatar);
                    if (state.JoinedGame == false && !string.IsNullOrEmpty(state.ErrorMessage))
                    {
                        await SendJoinStatus(Context.ConnectionId, state);
                        return;
                    }
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
                case PlayerAction.ActionType.ShowCards:
                    state = gameProvider.ShowCards(action.GameName, action.PlayerName);
                    break;
                case PlayerAction.ActionType.HideCards:
                    state = gameProvider.HideCards(action.GameName, action.PlayerName);
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
