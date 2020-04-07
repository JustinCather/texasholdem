using System;
using TexasHoldEm.Game;
using Xunit;
using Xunit.Abstractions;

namespace TexasHoldEmTest
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

            var np = game.Start();
            Assert.Equal(p4, np);

            Assert.Throws<Exception>(() => game.Bet(p1, 100, out var t1));
            Assert.Throws<ArgumentException>(() => game.Bet(np, int.MaxValue, out var t1));

            while (game.Bet(np, 50, out np))
            {
                log.WriteLine("next play to bet " + np.Name);
            }
        }
    }
}

