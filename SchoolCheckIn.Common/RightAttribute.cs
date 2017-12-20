using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Common
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class RightAttribute : Attribute


    {
        public RightAttribute()

        {

        }


        public string ResourceName { get; set; }

        public string OperationCode { get; set; }


    }
}
