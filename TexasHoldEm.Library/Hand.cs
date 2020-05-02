using System;
using System.Collections.Generic;
using System.Linq;

namespace TexasHoldEm.Library
{
    public enum HandType
    {
        HighCard,
        OnePair,
        TwoPair,
        ThreeOfAKind,
        Straight,
        Flush,
        FullHouse,
        FourOfAKind,
        StraightFlush,
        RoyalFlush,
    }

    public class Hand
    {
        public HandType Type { get; set; }
        public List<Card> BestCards { get; set; }
        //high cards will be listed Highest To Lowest
        //this will be used to determine hc,straight,flush,etc.
        //so for A high straights the a is the first card
        //so for A low straights the A is the last card
        private List<CardValue> HighCards { get; set; }
        //if two pair, pair one is always the higher of the values
        //if full house, pair one is the value that has 3 of a kind
        private CardValue? PairOne { get;  set; }
        private CardValue? PairTwo { get; set; }

        public Hand(Card[] playerCards, Card[] tableCards)
        {
            var possibleCards = new List<Card>();
            possibleCards.AddRange(playerCards);
            possibleCards.AddRange(tableCards);

            var royalFLush = SetRoyalFlush(possibleCards);
            if (!royalFLush)
            {
                var straightFlush = SetStraightFlush(possibleCards);
                if (!straightFlush)
                {
                    var fourOfAKind = SetFourOfAKind(possibleCards);
                    if (!fourOfAKind)
                    {
                        var fullHouse = SetFullHouse(possibleCards);
                        if(!fullHouse)
                        {
                            var flush = SetFlush(possibleCards);
                            if (!flush)
                            {
                                var straight = SetStraight(possibleCards);
                                if (!straight)
                                {
                                    var threeOfAKind = SetThreeOfAKind(possibleCards);
                                    if (!threeOfAKind)
                                    {
                                        var twoPair = SetTwoPair(possibleCards);
                                        if (!twoPair)
                                        {
                                            var onePair = SetOnePair(possibleCards);
                                            if (!onePair)
                                                SetHighCard(possibleCards);
                                        }
                                    }
                                }
                            }
                        }
                    } 
                }
            }

            if (BestCards.Count() > 5)
                throw new Exception("Hands can only have 5 cards");
        }

        public static bool operator >(Hand left, Hand right)
        {
            if (left.Type > right.Type)
                return true;
            if (left.Type < right.Type)
                return false;

            if(left.Type == HandType.OnePair 
                || left.Type == HandType.TwoPair 
                || left.Type == HandType.FullHouse 
                || left.Type == HandType.ThreeOfAKind
                || left.Type == HandType.FourOfAKind)
            {
                if (left.PairOne > right.PairOne)
                    return true;
                if (left.PairOne < right.PairOne)
                    return false;

                if(left.Type == HandType.TwoPair || left.Type == HandType.FullHouse)
                {
                    if (left.PairTwo > right.PairTwo)
                        return true;
                    if (left.PairTwo < right.PairTwo)
                        return false;

                    if (left.Type == HandType.FullHouse)
                        return false; //hands will be equal at this point
                }

                return CompareHighCards(left.HighCards, right.HighCards) == 0;
            }
            //we know the hands have the same value
            return CompareHighCards(left.HighCards, right.HighCards) == 0;
        }
       
        public static bool operator <(Hand left, Hand right)
        {
            if (left.Type > right.Type)
                return false;
            if (left.Type < right.Type)
                return true;

            if (left.Type == HandType.OnePair
                || left.Type == HandType.TwoPair
                || left.Type == HandType.FullHouse
                || left.Type == HandType.ThreeOfAKind
                || left.Type == HandType.FourOfAKind)
            {
                if (left.PairOne > right.PairOne)
                    return false;
                if (left.PairOne < right.PairOne)
                    return true;

                if (left.Type == HandType.TwoPair || left.Type == HandType.FullHouse)
                {
                    if (left.PairTwo > right.PairTwo)
                        return false;
                    if (left.PairTwo < right.PairTwo)
                        return true;

                    if (left.Type == HandType.FullHouse)
                        return false; //hands will be equal at this point
                }

                return CompareHighCards(left.HighCards, right.HighCards) == 1;
            }
            //we know the hands have the same value
            return CompareHighCards(left.HighCards, right.HighCards) == 1;
        }

        public static bool operator ==(Hand left, Hand right)
        {
            if (left.Type != right.Type)
                return false;

            if (left.Type == HandType.OnePair
                || left.Type == HandType.TwoPair
                || left.Type == HandType.FullHouse
                || left.Type == HandType.ThreeOfAKind
                || left.Type == HandType.FourOfAKind)
            {
                if (left.PairOne != right.PairOne)
                    return false;

                if (left.Type == HandType.TwoPair || left.Type == HandType.FullHouse)
                {
                    if (left.PairOne != right.PairTwo)
                        return false;
                }

                return CompareHighCards(left.HighCards, right.HighCards) == 2;
            }
            //we know the hands have the same value
            return CompareHighCards(left.HighCards, right.HighCards) == 2;


        }

        public static bool operator !=(Hand left, Hand right)
        {
            if (left.Type != right.Type)
                return true;

            if (left.Type == HandType.OnePair
                || left.Type == HandType.TwoPair
                || left.Type == HandType.FullHouse
                || left.Type == HandType.ThreeOfAKind
                || left.Type == HandType.FourOfAKind)
            {
                if (left.PairOne != right.PairOne)
                    return true;

                if (left.Type == HandType.TwoPair || left.Type == HandType.FullHouse)
                {
                    if (left.PairOne != right.PairTwo)
                        return true;
                }

                return CompareHighCards(left.HighCards, right.HighCards) != 2;
            }
            //we know the hands have the same value
            return CompareHighCards(left.HighCards, right.HighCards) != 2;
        }

        private static int CompareHighCards(List<CardValue> leftHighCards, List<CardValue> rightHighCards)
        {
            for (int i = 0; i < leftHighCards.Count; i++)
            {
                if (leftHighCards[i] == rightHighCards[i])
                    continue;
                if (leftHighCards[i] > rightHighCards[i])
                    return 0;
                if (leftHighCards[i] < rightHighCards[i])
                    return 1;
            }
            return 2;
        }

        private bool SetRoyalFlush(List<Card> cards)
        {
            var royalFlushValues = new List<CardValue> { CardValue.Ace, CardValue.King, CardValue.Queen, CardValue.Jack, CardValue.Ten };
            Suite flushedSuite;
            if (!IsFlush(cards,out flushedSuite))
                return false;
            
            var cardsOfSameSuite = cards.Where(x => x.Suite == flushedSuite);
            var potentialCards = cardsOfSameSuite.Where(x => royalFlushValues.Contains(x.Value));
            if (potentialCards.Count() == 5 )
            {
                Type = HandType.RoyalFlush;
                BestCards = potentialCards.OrderByDescending(x => x.Value).ToList();
                return true;
            }
            return false;
        }
    
        private bool SetStraightFlush(List<Card> cards)
        {
            Suite suite;
            if(IsFlush(cards,out suite))
            {
                List<Card> straightCards;
                if(IsStraight(cards.Where(x => x.Suite ==suite), out straightCards))
                {
                    Type = HandType.StraightFlush;
                    HighCards = straightCards.Select(x=> x.Value).ToList();
                    BestCards = straightCards;
                    return true;
                }
            }
            return false;
        }
       
        private bool SetFourOfAKind(List<Card> cards)
        {
            var groupedCards = cards.GroupBy(x => x.Value);
            if (groupedCards.Any(x => x.Count() == 4))
            {
                var highCard = cards.OrderByDescending(x => x.Value).Where(x => x.Value != PairOne).Take(1);
                Type = HandType.FourOfAKind;
                PairOne = groupedCards.Where(x => x.Count() == 4).First().Key;
                HighCards = highCard.Select(x=>x.Value).ToList();
                BestCards = new List<Card>(groupedCards.Where(x => x.Count() == 4).First().ToList());
                BestCards.Add(highCard.First());
                return true;
            }
            return false;
        }
        
        private bool SetFullHouse(List<Card> cards)
        {
            CardValue threeOfAKind;
            if(IsThreeOfAKind(cards,out threeOfAKind))
            {
                CardValue pair;
                if(IsPair(cards.Where(x => x.Value != threeOfAKind), out pair))
                {
                    Type = HandType.FullHouse;
                    PairOne = threeOfAKind;
                    PairTwo = pair;
                    BestCards = new List<Card>(cards.Where(x => x.Value == threeOfAKind));
                    BestCards.AddRange(cards.Where(x => x.Value == pair));
                    return true;
                }
            }
            return false;
        }

        private bool SetFlush(List<Card> cards)
        {
            Suite suite;
            if (IsFlush(cards, out suite))
            {
                var orderedCards = cards.Where(x => x.Suite == suite).OrderByDescending(x => x.Value).Take(5);
                Type = HandType.Flush;
                HighCards = orderedCards.Select(x => x.Value).ToList();
                BestCards = orderedCards.ToList();
                return true;
            }

            return false;
        }

        private bool SetStraight(List<Card> cards)
        {
            List<Card> straightCards;
            if(IsStraight(cards,out straightCards))
            {
                Type = HandType.Straight;
                HighCards = straightCards.Select(x => x.Value).ToList();
                BestCards = straightCards;
                return true;
            }

            return false;
        }

        private bool SetThreeOfAKind(List<Card> cards)
        {
            CardValue value;
            if(IsThreeOfAKind(cards,out value))
            {
                var otherCards = cards.OrderByDescending(x => x.Value).Where(x => x.Value != value).Take(2);
                Type = HandType.ThreeOfAKind;
                HighCards = otherCards.Select(x => x.Value).ToList();
                BestCards = new List<Card>(cards.Where(x => x.Value == value));
                BestCards.AddRange(otherCards);
                return true;
            }
            return false;
        }

        private bool SetTwoPair(List<Card> cards)
        {
            CardValue pairOne;
            if(IsPair(cards,out pairOne))
            {
                CardValue pairTwo;
                if(IsPair(cards.Where(x => x.Value != pairOne),out pairTwo))
                {
                    var otherCards = cards.OrderByDescending(x => x.Value).Where(x => x.Value != pairOne && x.Value != pairTwo).Take(1);
                    Type = HandType.TwoPair;
                    PairOne = pairOne;
                    PairTwo = pairTwo;
                    HighCards = otherCards.Select(x => x.Value).ToList();
                    BestCards = new List<Card>(cards.Where(x => x.Value == pairOne));
                    BestCards.AddRange(cards.Where(x => x.Value == pairTwo));
                    BestCards.AddRange(otherCards);
                    return true;
                }
            }
            return false;
        }

        private bool SetOnePair(List<Card> cards)
        {
            CardValue pairOne;
            if (IsPair(cards, out pairOne))
            {
                var otherCards = cards.OrderByDescending(x => x.Value).Where(x => x.Value != pairOne).Take(3);
                Type = HandType.OnePair;
                PairOne = pairOne;
                HighCards = otherCards.Select(x => x.Value).ToList();
                BestCards = new List<Card>(cards.Where(x => x.Value == pairOne));
                BestCards.AddRange(otherCards);
                return true;
            }
            return false;
        }

        private bool SetHighCard(List<Card> cards)
        {
            var bestCards = cards.OrderByDescending(x => x.Value).Take(5);
            Type = HandType.HighCard;
            HighCards = bestCards.Select(x=>x.Value).ToList();
            BestCards = new List<Card>(bestCards);
            return true;
        }
        private bool IsFlush(IEnumerable<Card> cards, out Suite suite)
        {
            suite = Suite.Hidden;
            var groupedBySuite = cards.GroupBy(x => x.Suite);
            if( groupedBySuite.Any(x => x.Count() >= 5))
            {
                suite = groupedBySuite.Where(x => x.Count() >= 5).First().Key;
                return true;
            }
            return false;
        }

        private bool IsStraight(IEnumerable<Card> cards, out List<Card> straightCards)
        {
            straightCards = new List<Card>();
            var lowStraightValues = new List<CardValue> { CardValue.Five, CardValue.Four, CardValue.Three, CardValue.Two, CardValue.Ace };
            var highStraightValues = new List<CardValue> { CardValue.Ace, CardValue.King, CardValue.Queen, CardValue.Jack, CardValue.King };

            var isStraight = true;
            foreach(var v in highStraightValues)
            {
                if (!cards.Any(x => x.Value == v))
                {
                    isStraight = false;
                    break;
                }
                else
                {
                    straightCards.Add(cards.First(x => x.Value == v));
                }
            }

            if(isStraight)
            {
                return true;
            }

            straightCards = new List<Card>();
            foreach (var v in lowStraightValues)
            {
                if (!cards.Any(x => x.Value == v))
                {
                    isStraight = false;
                    break;
                }
                else
                {
                    straightCards.Add(cards.First(x => x.Value == v));
                }
            }

            if (isStraight)
            {
                return true;
            }

            //not a high or low straight
            straightCards = new List<Card>();
            var ordered = cards.OrderByDescending(a => a.Value).ToList();
            for (var i = 0; i < ordered.Count - 5; i++)
            {
                var skipped = ordered.Skip(i);
                var possibleStraight = skipped.Take(5);
                if (IsStraight(possibleStraight))
                {
                    straightCards = possibleStraight.ToList();
                    return true;
                }
            }
            return false;
        }

        private bool IsStraight(IEnumerable<Card> cards)
        {
            return cards.GroupBy(card => card.Value).Count() == cards.Count() && cards.Max(card => (int)card.Value) - cards.Min(card => (int)card.Value) == 4;
        }
        
        private bool IsThreeOfAKind(IEnumerable<Card> cards, out CardValue value)
        {
            var groupedCards = cards.GroupBy(x => x.Value);
            if(groupedCards.Any(x => x.Count() >= 3))
            {
                value = groupedCards.Where(x => x.Count() >= 3).Max(x => x.Key);
                return true;
            }
            value = CardValue.Hidden;
            return false;
        }

        private bool IsPair(IEnumerable<Card> cards, out CardValue value)
        {
            var groupedCards = cards.GroupBy(x => x.Value);
            if (groupedCards.Any(x => x.Count() >= 2))
            {
                value = groupedCards.Where(x => x.Count() >=2 ).Max(x => x.Key);
                return true;
            }
            value = CardValue.Hidden;
            return false;

        }
    }
}
