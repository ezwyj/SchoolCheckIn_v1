using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Right.Entity
{
    [TableName("Right_Role")]
    [PrimaryKey("RoleId", AutoIncrement = true)]
    public class Role 
    {


        [Column]
        public string Name { get; set; }

        [Column("RoleId")]
        public int RoleId { get; set; }

        [Column]
        public int Sort { get; set; }
    }
}
