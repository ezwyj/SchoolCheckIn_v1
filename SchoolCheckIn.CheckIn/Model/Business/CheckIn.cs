using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Model
{
    public class CheckIn
    {
        public int Id { get; set; }

        public int CheckInClientId { get; set; }

        public DateTime CheckInTime { get; set; }
    }
}
