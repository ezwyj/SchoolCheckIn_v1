using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Model
{
    public class Student 

    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string FatherTelephone { get; set; }
        public string MotherTelephone { get; set; }

        public DateTime? Birthday { get; set; }

        public string EnglishName { get; set; }

        public List<Class> ClassPackage { get; set; }

        public bool IsHide { get; set; }

        public List<Model.CheckIn> History { get; set; }

      
    }

   
}
