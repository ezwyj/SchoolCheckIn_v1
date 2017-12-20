using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Model
{
    public class Class
    {
        public string Name { get; set; }

        public int Id { get; set; }

        public int TotalTime { get; set; }

        public string InputUser { get; set; }

        public DateTime InputTime { get; set; }

        public List<ClassEx> ExInfo { get; set; }
    }

    public class ClassEx
    {
        public int Id { get; set; }
        public string KeyNameId { get; set; }
        public string KeyNameValue { get; set; }
    }
}
