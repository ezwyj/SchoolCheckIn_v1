using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Student.entity
{
    [TableName("CheckInInfo")]
    public class CheckInEntity
    {
        public int Id { get; set; }
        public DateTime CheckInTime { get; set; }
        public int StudentId { get; set; }

    }
}
