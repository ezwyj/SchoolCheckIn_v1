using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Student.entity
{
    [TableName("StudentInfo")]
    public class StudentEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string HardImage { get; set; }
        public bool IsHide { get; set; }
        public string BaiduLibraryId { get; set; }
        public string FatherTelephone { get; set; }
        public string MotherTelephone { get; set; }

        public DateTime? Birthday { get; set; }

        public string EnglishName { get; set; }
    }

    [TableName("StudentExInfo")]
    public class StudentEx
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string KeyName { get; set; }
        public string KeyValue { get; set; }
    }
}
