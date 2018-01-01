using SchoolCheckIn.CheckIn.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Interface
{
    public interface ISchool
    {
        void School(PetaPoco.Database db);
        void Setup(School school);
        School GetSchoolInfo();
        void SaveSchool(School school);
    }
}
