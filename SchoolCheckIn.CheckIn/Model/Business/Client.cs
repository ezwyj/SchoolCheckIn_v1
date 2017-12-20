using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Model
{
    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<ClientEx> ExInfo { get; set; }

        public List<Class> ClassPackage { get; set; }
    }

    public class ClientEx
    {
        public int Id { get; set; }
        public string KeyNameId { get; set; }
        public string KeyNameValue { get; set; }
    }
}
