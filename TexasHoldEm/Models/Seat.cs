using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Models
{
    public class Seat
    {
        public bool SeatTaken { get; set; } = false;
        public PlayerState Player { get; set; } = null;
    }
}
