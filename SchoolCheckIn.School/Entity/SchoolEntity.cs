using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.School
{
    [TableName("SchoolInfo")]
    public class SchoolEntity
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telephone { get; set; }
        public int PresidentId { get; set; }
        public int  AdministratorId { get; set; }
    }
}
