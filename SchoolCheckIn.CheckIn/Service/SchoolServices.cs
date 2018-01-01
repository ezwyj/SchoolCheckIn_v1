using SchoolCheckIn.CheckIn.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Service
{
    public class SchoolServices
    {
        private readonly ISchool _schoolService = new UnityContainerHelp().GetServer<ISchool>();

        

        public void Setup(PetaPoco.Database db, SchoolCheckIn.CheckIn.Model.School school)
        {
            _schoolService.School(db);
            _schoolService.Setup(school);
        }
    }
}
