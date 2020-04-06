using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Game
{
    public class Deck
    {
        private static readonly Random rand = new Random(42);
        public const int CardsInDeck = 52;

        public Stack<Card> Cards { get; private set; } = GetCards();

        public Card Next() => Cards.Pop();

        private static Stack<Card> GetCards()
        {
            var deckList = new List<Card>(CardsInDeck);
            var deck = new Stack<Card>(CardsInDeck);

            foreach (var suite in Enum.GetValues(typeof(Suite)).Cast<Suite>())
            {
                foreach (var value in Enum.GetValues(typeof(CardValue)).Cast<CardValue>())
                {
                    deckList.Add(new Card()
                    {
                        Suite = suite,
                        CardValue = value
                    });
                }
            }

            lock(rand)
            {
                foreach (var c in deckList.OrderBy(x => rand.Next()))
                {
                    deck.Push(c);
                }
            }

            return deck;
        }

    }
}
