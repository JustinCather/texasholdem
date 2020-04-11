# texasholdem
Client side state object
```json
{
  currentBet: number,
  potSize: number,
  smallBlindAmount: number,
  bigBlindAmount:number,
  communityCards: [
    {
      value: string,
      suit: string,
      image: string
    }
  ],
  seats:[
    seatTaken: bool,
    player:[
      profilePic: string
      name: string,
      availableMoney: number,
      currentBet: number,
      stillInHand: bool,
      playersTurn: bool,
      allIn: bool,
      isYou: bool,
      isDealer: bool
      cards: [
        {
          value: string,
          suit: string,
          image: string
        }
      ]
    ]
  ]
}
```
Possible Requirments:

Client Side
- only show availabe actions when it is the players turn
- rotate seats until you would show up at the bottom of the table
- put a star or something next to the player whose turn it is
- put a Dealer icon next to the current dealer
- when all-in player is all in replace their profile pic with 'ALL IN!' text
- if !seatTaken hide the seat from the table

- if table.CurrentBet = 0
	- show available options as fold,check, bet (slider bar from bigblind amount to player.availableMoney)
- if table.CurrentBet > 0 and table.CurrentBet < (player.availableMoney / 2)
	- show available options as fold, call (table.currentBet), raise(slider bar from table.currentBet * 2 to player.availableMoney)
- if table.CurrentBet > 0 and table.CurrentBet >= (player.availableMoney / 2) and table.currentBet < player.availableMoney
	- show availabe options as fold, call (table.currentBet), All IN!(player.availabeMoney)
- if table.CurrentBet > 0 and table.CurrentBet >= (player.availableMoney / 2) and table.currentBet >= player.availableMoney
	- show availabe options as fold, -hide middle option-, All IN!(player.availabeMoney)


Server Side
- when player joins game randomly set their seat

- At start of hand
	- reset available players list to those whose availabeMoney > 0
	- move dealer to next available player
	- if big blind player.availabeMoney < table.bigBlindAmount
		- set table.currentBet = table.bigBlindAmount
		- mark player as all in

- On Check -> leave table.CurrentBet to 0

- On Bet/Raise < player.availabeMoney -> 
	- set table.currentBet = playerBet
	- subtract player bet from available money
	- increment table pot by bet amount
	- reset list of players that need to take action 

- On Bet/Raise = player.availabeMoney 
	- same as above but mark all in flag on player

- On Fold = set is player.stillInHand to false, clear player.Cards array

- When resetting list of players that need to take action, remove players who are all in or folded

- When end of turn
	- clear all players currentBet
	- in this and similar scenarios player 1 needs money refunded
		- player 1 bets 30
		- player 2 only has 20. Player 2 calls and goes all in
		- all other players fold
		- player 1 is owed 10 back into the availabeMoney


- Before next turn
	- if the number of players still in > 1 and number of !players.allIn <=1, show all players cards
		- this is the scenario where there is no more actions to be taken
	- if the number of players still in = 1
		- this player wins, end hand


- At end of hand,
	- figure out splitting pots
	- determine winner
