using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Class.Entity
{
    [TableName("ClassInfo")]
    public class ClassEntity
    {

        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Teacher { get; set; }
        /// <summary>
        /// 课时
        /// </summary>
        public int ClassTime { get; set; }
        
        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string InputUser { get; set; }

        public string ClassLevel { get; set; }

        public DateTime InputTime { get; set; }
    }
}
