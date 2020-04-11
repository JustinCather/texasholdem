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
            game.AddPlayer("a", out var p1);
            game.AddPlayer("b", out var p2);
            game.AddPlayer("c", out var p3);
            game.AddPlayer("d", out var p4);

            Assert.True(game.PlayerCount == 4);
            Assert.Equal(p1, game.GetPlayer("a"));
            Assert.Equal(p2, game.GetPlayer("b"));
            Assert.Equal(p3, game.GetPlayer("c"));
            Assert.Equal(p4, game.GetPlayer("d"));

            game.Start();

            int i = 0;
            int bet = game.MinBet;
            Assert.Equal(50, game.MinBet);

            while (game.Bet(game.Current, bet - game.Current.CurrentBet))
            {
                i++;
                if (i == 3) Assert.Equal(100, game.MinBet);
                if (i > 3) Assert.Equal(200, game.MinBet);
                if (i == 2 || i == 3) bet = game.MinBet * 2;
            }
        }
    }
}

