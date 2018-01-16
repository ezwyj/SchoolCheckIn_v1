using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.ValueSets
{

    [PetaPoco.TableName("ValueSet")]
    [PetaPoco.PrimaryKey("ID", AutoIncrement = true)]
    public class ValueSet 
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string InputUser { get; set; }
 
        public DateTime? InputTime { get; set; }

        public bool IsEnabled { get; set; }
        public bool IsDelete { get; set; }

    }
}
