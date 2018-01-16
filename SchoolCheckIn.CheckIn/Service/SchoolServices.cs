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
        private readonly IStudent _studentService = new UnityContainerHelp().GetServer<IStudent>();
        private readonly IClass _classService = new UnityContainerHelp().GetServer<IClass>();


        public void Setup( SchoolCheckIn.CheckIn.Model.School school)
        {
            PetaPoco.Database db = new PetaPoco.Database("DatabaseConn");
            db.BeginTransaction();
            try{
                _schoolService.School(db);
                _schoolService.Setup(school);
                db.CompleteTransaction();
            }
            catch(Exception e)
            {
                db.AbortTransaction();
                throw e;
            }
        }

        
    }
}
