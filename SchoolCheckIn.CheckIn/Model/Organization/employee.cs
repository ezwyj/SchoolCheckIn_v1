using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Model
{
    public class Employee
    {

        /// <summary>
        /// 工号
        /// </summary>
        public string Badge
        {
            get; set;
        }

        public string EnglishName { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>

        public string Name { get; set; }
        /// <summary>
        /// 邮箱
        /// </summary>

        public string Email { get; set; }

        public Department Department { get; set; }

        public string JobId { get; set; }
        public string Job { get; set; }

    }
}
