using SchoolCheckIn.CheckIn.Model.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Interface
{
    interface ISchool
    {
        void Setup(School school);
        School GetSchoolInfo();
        void SaveSchool(School school);
    }
}
