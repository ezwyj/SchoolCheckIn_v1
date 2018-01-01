using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Model
{
    public class School
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telephone { get; set; }
        public Employee President { get; set; }
        public Employee Administrator { get; set; }
    }
}
