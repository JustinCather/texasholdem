﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Game
{
    public class GameProvider
    {
        public Dictionary<string, Game> Games { get; } = new Dictionary<string, Game>();
    }
}