using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Right.Entity
{
    [TableName("Right_User")]
    [PrimaryKey("UserId", AutoIncrement = true)]
    public class User 
    {


        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Badge { get; set; }
        public string Department { get; set; }
        public string password { get; set; }
    }
}
