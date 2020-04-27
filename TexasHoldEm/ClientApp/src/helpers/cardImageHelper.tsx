import { Card, Suite, CardValue } from '../store/Poker';
import TenClubs from '../Images/cards/10C.png';
import TenDiamonds from '../Images/cards/10D.png';
import TenHearts from '../Images/cards/10H.png';
import TenSpades from '../Images/cards/10S.png';
import TwoClubs from '../Images/cards/2C.png';
import TwoDiamonds from '../Images/cards/2D.png';
import TwoHearts from '../Images/cards/2H.png';
import TwoSpades from '../Images/cards/2S.png';
import ThreeClubs from '../Images/cards/3C.png';
import ThreeDiamonds from '../Images/cards/3D.png';
import ThreeHearts from '../Images/cards/3H.png';
import ThreeSpades from '../Images/cards/3S.png';
import FourClubs from '../Images/cards/4C.png';
import FourDiamonds from '../Images/cards/4D.png';
import FourHearts from '../Images/cards/4H.png';
import FourSpades from '../Images/cards/4S.png';
import FiveClubs from '../Images/cards/5C.png';
import FiveDiamonds from '../Images/cards/5D.png';
import FiveHearts from '../Images/cards/5H.png';
import FiveSpades from '../Images/cards/5S.png';
import SixClubs from '../Images/cards/6C.png';
import SixDiamonds from '../Images/cards/6D.png';
import SixHearts from '../Images/cards/6H.png';
import SixSpades from '../Images/cards/6S.png';
import SevenClubs from '../Images/cards/7C.png';
import SevenDiamonds from '../Images/cards/7D.png';
import SevenHearts from '../Images/cards/7H.png';
import SevenSpades from '../Images/cards/7S.png';
import EightClubs from '../Images/cards/8C.png';
import EightDiamonds from '../Images/cards/8D.png';
import EightHearts from '../Images/cards/8H.png';
import EightSpades from '../Images/cards/8S.png';
import NineClubs from '../Images/cards/9C.png';
import NineDiamonds from '../Images/cards/9D.png';
import NineHearts from '../Images/cards/9H.png';
import NineSpades from '../Images/cards/9S.png';
import JackClubs from '../Images/cards/JC.png';
import JackDiamonds from '../Images/cards/JD.png';
import JackHearts from '../Images/cards/JH.png';
import JackSpades from '../Images/cards/JS.png';
import QueenClubs from '../Images/cards/QC.png';
import QueenDiamonds from '../Images/cards/QD.png';
import QueenHearts from '../Images/cards/QH.png';
import QueenSpades from '../Images/cards/QS.png';
import KingClubs from '../Images/cards/KC.png';
import KingDiamonds from '../Images/cards/KD.png';
import KingHearts from '../Images/cards/KH.png';
import KingSpades from '../Images/cards/KS.png';
import AceClubs from '../Images/cards/AC.png';
import AceDiamonds from '../Images/cards/AD.png';
import AceHearts from '../Images/cards/AH.png';
import AceSpades from '../Images/cards/AS.png';
import CardBack from '../Images/cards/card-back.jpg';

export function GetCardImage(card: Card) {
    console.log('Getting Card Image');
    if (card.suite == Suite.Hidden || card.value == CardValue.Hidden) {
        return CardBack;
    } else {
        switch (card.suite) {
            case Suite.Hearts:
                return getCardHeart(card.value);
            case Suite.Clubs:
                return getCardClubs(card.value);
            case Suite.Diamonds:
                return getCardDiamonds(card.value);
            case Suite.Spades:
                return getCardSpades(card.value);
        }
    }
}

function getCardHeart(value: CardValue) {
    switch (value) {
        case CardValue.Ace:
            return AceHearts;
        case CardValue.Two:
            return TwoHearts;
        case CardValue.Three:
            return ThreeHearts;
        case CardValue.Four:
            return FourHearts;
        case CardValue.Five:
            return FiveHearts;
        case CardValue.Six:
            return SixHearts;
        case CardValue.Seven:
            return SevenHearts;
        case CardValue.Eight:
            return EightHearts;
        case CardValue.Nine:
            return NineHearts;
        case CardValue.Ten:
            return TenHearts;
        case CardValue.Jack:
            return JackHearts;
        case CardValue.Queen:
            return QueenHearts;
        case CardValue.King:
            return KingHearts;
    }
}

function getCardClubs(value: CardValue) {
    switch (value) {
        case CardValue.Ace:
            return AceClubs;
        case CardValue.Two:
            return TwoClubs;
        case CardValue.Three:
            return ThreeClubs;
        case CardValue.Four:
            return FourClubs;
        case CardValue.Five:
            return FiveClubs;
        case CardValue.Six:
            return SixClubs;
        case CardValue.Seven:
            return SevenClubs;
        case CardValue.Eight:
            return EightClubs;
        case CardValue.Nine:
            return NineClubs;
        case CardValue.Ten:
            return TenClubs;
        case CardValue.Jack:
            return JackClubs;
        case CardValue.Queen:
            return QueenClubs;
        case CardValue.King:
            return KingClubs;
    }
}

function getCardDiamonds(value: CardValue) {
    switch (value) {
        case CardValue.Ace:
            return AceDiamonds;
        case CardValue.Two:
            return TwoDiamonds;
        case CardValue.Three:
            return ThreeDiamonds;
        case CardValue.Four:
            return FourDiamonds;
        case CardValue.Five:
            return FiveDiamonds;
        case CardValue.Six:
            return SixDiamonds;
        case CardValue.Seven:
            return SevenDiamonds;
        case CardValue.Eight:
            return EightDiamonds;
        case CardValue.Nine:
            return NineDiamonds;
        case CardValue.Ten:
            return TenDiamonds;
        case CardValue.Jack:
            return JackDiamonds;
        case CardValue.Queen:
            return QueenDiamonds;
        case CardValue.King:
            return KingDiamonds;
    }
}

function getCardSpades(value: CardValue) {
    switch (value) {
        case CardValue.Ace:
            return AceSpades;
        case CardValue.Two:
            return TwoSpades;
        case CardValue.Three:
            return ThreeSpades;
        case CardValue.Four:
            return FourSpades;
        case CardValue.Five:
            return FiveSpades;
        case CardValue.Six:
            return SixSpades;
        case CardValue.Seven:
            return SevenSpades;
        case CardValue.Eight:
            return EightSpades;
        case CardValue.Nine:
            return NineSpades;
        case CardValue.Ten:
            return TenSpades;
        case CardValue.Jack:
            return JackSpades;
        case CardValue.Queen:
            return QueenSpades;
        case CardValue.King:
            return KingSpades;
    }
}
