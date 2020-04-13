using System;
using TexasHoldEm.Library;
using Xunit;
using Xunit.Abstractions;

namespace TexasHoldEm.Test
{
    public class TexasSizedTest
    {
        private ITestOutputHelper log;

        public TexasSizedTest(ITestOutputHelper log)
        {
            this.log = log;
        }

        [Fact]
        public void RunGame()
        {
            var game = new Game();
            game.AddPlayer("a");
            game.AddPlayer("b");
            game.AddPlayer("c");
            game.AddPlayer("d");

            Assert.True(game.PlayerCount == 4);
            game.Start();

            int i = 0;
            int bet = game.MinBet;
            Assert.Equal(50, game.MinBet);

            while (game.Bet(game.Current.Name, bet - game.Current.CurrentBet))
            {
                i++;
                if (i == 3) Assert.Equal(100, game.MinBet);
                if (i > 3) Assert.Equal(200, game.MinBet);
                if (i == 2 || i == 3) bet = game.MinBet * 2;
            }
        }
    }
}

