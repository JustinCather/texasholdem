using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Models
{
    public class HandHistory
    {
        public string Message { get; set; }
        public List<Card> Cards { get; set; }
    }
}
