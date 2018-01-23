 using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.ValueSets
{
    [PetaPoco.TableName("ValueItem")]
    [PetaPoco.PrimaryKey("ID", AutoIncrement =  true)]
    public class ValueItem 
    {

        public ValueItem()
        {
        }
        public int ID { get; set; }
        public int ValueSetID { get; set; }
        public string Text { get; set; }
        public string Value { get; set; }
        public string Meaning { get; set; }



        public bool IsEnabled { get; set; }
        public int Weight { get; set; }

        public bool IsDelete { get; set; }
        public string InputUser { get; set; }
        public DateTime? InputTime { get; set; }



    }
}
