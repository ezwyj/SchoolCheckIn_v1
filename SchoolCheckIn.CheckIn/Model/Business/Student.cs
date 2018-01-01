using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Model
{
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<StudentEx> ExInfo { get; set; }

        public List<Class> ClassPackage { get; set; }

        public bool IsHide { get; set; }
    }

    public class StudentEx
    {
        public int Id { get; set; }
        public string KeyNameId { get; set; }
        public string KeyNameValue { get; set; }
    }
}
