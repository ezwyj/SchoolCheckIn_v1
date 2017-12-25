using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Right.Entity
{
    [TableName("Right_Operation")]
    [PrimaryKey("OperationId", AutoIncrement = true)]
    public class Operation 
    {
        public int OperationId { get; set; }
        public string OperationCode { get; set; }
        public string Description { get; set; }
    }
}
