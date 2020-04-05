using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Game
{
    public class Deck
    {
        private static readonly Random rand = new Random(42);

        public List<Card> Cards { get; private set; } = GetCards();

        public Card this[int i] => Cards[i];

        private static List<Card> GetCards()
        {
            var deck = new List<Card>();

            foreach (var suite in Enum.GetValues(typeof(Suite)).Cast<Suite>())
            {
                foreach (var value in Enum.GetValues(typeof(CardValue)).Cast<CardValue>())
                {
                    deck.Add(new Card()
                    {
                        Suite = suite,
                        CardValue = value
                    });
                }
            }

            lock(rand)
            {
                return deck.OrderBy(x => rand.Next()).ToList();
            }
        }

    }
}
