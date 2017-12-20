using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Right.Entity
{
    [TableName("Right_UserRole")]
    public class UserRole
    { 

        [Column]

        public int UserRoleId { get; set; }

        [Column("RoleId")]
        public int RoleId { get; set; }

        [Column("UserId")]
        public int UserId { get; set; }
    }
}
