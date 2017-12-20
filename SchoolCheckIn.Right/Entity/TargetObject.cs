using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Right.Entity
{
    [TableName("Right_Object")]
    [PrimaryKey("ObjectId", AutoIncrement = true)]
    public class RightObject
    {
        public int ObjectId { get; set; }
        public string Name { get; set; }
        public RightObjectTypeEnum ObjectType { get; set; }
        public int ParentObjectId { get; set; }
        public string Remark { get; set; }
        [Ignore]
        public string ObjectTypeExp
        {
            get
            {
                return Enum.GetName(typeof(RightObjectTypeEnum), ObjectType);
            }
        }
    }
}
