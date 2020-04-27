using System;
using System.Collections.Generic;
using System.Text;

namespace TexasHoldEm.Library
{
    public class Pot
    {
        public Pot()
        {

        }
        public void AddToPot(double amount)
        {
            PotAmount += amount;
        }
        public void RemovePlayer(Player p)
        {
            EligiblePlayers.Remove(p);
        }
        public List<Player> EligiblePlayers { get; set; }
        public Double PotAmount { get; private set; } = 0;

    }
}
