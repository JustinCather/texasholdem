using System;
using System.Collections;
using System.Collections.Generic;
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

        public class HandTestData : IEnumerable<object[]>
        {
            public IEnumerator<object[]> GetEnumerator()
            {
                yield return new object[] // royal flush
                {
                    126,
                    new Card[]
                    {
                        new Card(Suite.Hearts, CardValue.Ten),
                        new Card(Suite.Hearts, CardValue.Jack),
                        new Card(Suite.Hearts, CardValue.Queen),
                        new Card(Suite.Hearts, CardValue.King),
                        new Card(Suite.Hearts, CardValue.Ace),
                    }
                };
                yield return new object[] // straight flush (six)
                {
                    117,
                    new Card[]
                    {
                        new Card(Suite.Clubs, CardValue.Six),
                        new Card(Suite.Clubs, CardValue.Five),
                        new Card(Suite.Clubs, CardValue.Four),
                        new Card(Suite.Clubs, CardValue.Two),
                        new Card(Suite.Clubs, CardValue.Three),
                    }
                };
                yield return new object[] // straight flush (ace)
                {
                    116,
                    new Card[]
                    {
                        new Card(Suite.Clubs, CardValue.Ace),
                        new Card(Suite.Clubs, CardValue.Five),
                        new Card(Suite.Clubs, CardValue.Four),
                        new Card(Suite.Clubs, CardValue.Three),
                        new Card(Suite.Clubs, CardValue.Two),
                    }  
                };
                yield return new object[] // four of a kind (jack)
                {
                    108,
                    new Card[]
                    {
                        new Card(Suite.Hearts, CardValue.Jack),
                        new Card(Suite.Diamonds, CardValue.Jack),
                        new Card(Suite.Spades, CardValue.Jack),
                        new Card(Suite.Clubs, CardValue.Jack),
                        new Card(Suite.Clubs, CardValue.Two),
                    }
                };
                yield return new object[] // full house (king)
                {
                    96,
                    new Card[]
                    {
                        new Card(Suite.Hearts, CardValue.King),
                        new Card(Suite.Diamonds, CardValue.King),
                        new Card(Suite.Spades, CardValue.King),
                        new Card(Suite.Clubs, CardValue.Two),
                        new Card(Suite.Spades, CardValue.Two),
                    }
                };
                yield return new object[] // flush (king)
                {
                    82,
                    new Card[]
                    {
                        new Card(Suite.Diamonds, CardValue.Six),
                        new Card(Suite.Diamonds, CardValue.Two),
                        new Card(Suite.Diamonds, CardValue.King),
                        new Card(Suite.Diamonds, CardValue.Queen),
                        new Card(Suite.Diamonds, CardValue.Four),
                    }
                };
                yield return new object[] // straight (five)
                {
                    60,
                    new Card[]
                    {
                        new Card(Suite.Diamonds, CardValue.Four),
                        new Card(Suite.Clubs, CardValue.Five),
                        new Card(Suite.Spades, CardValue.Ace),
                        new Card(Suite.Hearts, CardValue.Two),
                        new Card(Suite.Diamonds, CardValue.Three),
                    }
                };
                yield return new object[] // three of a kind (four)
                {
                    45,
                    new Card[]
                    {
                        new Card(Suite.Diamonds, CardValue.Four),
                        new Card(Suite.Clubs, CardValue.Four),
                        new Card(Suite.Spades, CardValue.Four),
                        new Card(Suite.Hearts, CardValue.Two),
                        new Card(Suite.Diamonds, CardValue.Three),
                    }
                };
                yield return new object[] // two pair (king)
                {
                    40,
                    new Card[]
                    {
                        new Card(Suite.Diamonds, CardValue.King),
                        new Card(Suite.Clubs, CardValue.King),
                        new Card(Suite.Spades, CardValue.Six),
                        new Card(Suite.Hearts, CardValue.Six),
                        new Card(Suite.Diamonds, CardValue.Three),
                    }
                };
                yield return new object[] // one pair (six)
                {
                    19,
                    new Card[]
                    {
                        new Card(Suite.Diamonds, CardValue.Ace),
                        new Card(Suite.Clubs, CardValue.Two),
                        new Card(Suite.Spades, CardValue.Six),
                        new Card(Suite.Hearts, CardValue.Six),
                        new Card(Suite.Diamonds, CardValue.Three),
                    }
                };
                yield return new object[] // high card (eight)
                {
                    7,
                    new Card[]
                    {
                        new Card(Suite.Diamonds, CardValue.Two),
                        new Card(Suite.Clubs, CardValue.Four),
                        new Card(Suite.Spades, CardValue.Six),
                        new Card(Suite.Hearts, CardValue.Eight),
                        new Card(Suite.Diamonds, CardValue.Five),
                    }
                };
                yield return new object[] // high card (ace)
                {
                    13,
                    new Card[]
                    {
                        new Card(Suite.Diamonds, CardValue.Two),
                        new Card(Suite.Clubs, CardValue.Four),
                        new Card(Suite.Spades, CardValue.Six),
                        new Card(Suite.Hearts, CardValue.Ace),
                        new Card(Suite.Diamonds, CardValue.Five),
                    }
                };
            }

            IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        }

        [Theory]
        [ClassData(typeof(HandTestData))]
        public void TestHand(int value, Card[] hand)
        {
            var game = new Game();
            var result = game.HandResult(hand);
            Assert.Equal(value, result);
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

