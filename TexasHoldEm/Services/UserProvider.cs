using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TexasHoldEm.Services
{
    public class UserProvider
    {
        private ConcurrentDictionary<string, ConcurrentDictionary<string, string>> UserConnections { get; } = new ConcurrentDictionary<string, ConcurrentDictionary<string, string>>();

        public void AddConnection(string name, string id)
        {
            if (!UserConnections.ContainsKey(name))
            {
                UserConnections[name] = new ConcurrentDictionary<string, string>();
            }

            UserConnections[name][id] = id;
        }

        public IEnumerable<(string user, ICollection<string> ids)> GetUsersAndIds(IEnumerable<string> users)
        {
            return UserConnections.Where(x => users.Contains(x.Key)).Select(x => (x.Key, x.Value.Values));
        }
    }
}
