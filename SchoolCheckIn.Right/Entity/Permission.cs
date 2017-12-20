using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Right.Entity
{
    [TableName("Right_Permission")]
    [PrimaryKey("PermissionId", AutoIncrement = true)]
    public class Permission
    {
        public int PermissionId { get; set; }
        public string Name { get; set; }

        public int ObjectId { get; set; }
        public int OperationId { get; set; }
        public int RoleId { get; set; }

    }
}
