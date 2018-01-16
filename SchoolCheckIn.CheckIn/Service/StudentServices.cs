using SchoolCheckIn.CheckIn.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Service
{
    public class StudentServices
    {
        private readonly IStudent _studentService = new UnityContainerHelp().GetServer<IStudent>();
        private readonly IClass _classService = new UnityContainerHelp().GetServer<IClass>();
        private readonly ICheckIn _checkInService = new UnityContainerHelp().GetServer<ICheckIn>();

        public List<Model.Student> GetStudentList( string name, string className, DateTime startClassTime, DateTime endClassTime)
        {
            try
            {
                using (var db = new PetaPoco.Database("databaseConn"))
                {
                    _studentService.Student(db);
                    _classService.Class(db);
                    var list = _studentService.GetStudentList(name, className, startClassTime, endClassTime);
                    foreach (var item in list)
                    {
                        item.ClassPackage = _classService.GetClassListByStudent(item);
                        
                    }
                    return list;
                }
            }
            catch (Exception e)
            {
                throw e;
            }

        }
        public void ImportStudent( string file)
        {
            using (var db = new PetaPoco.Database("databaseConn"))
            {
                db.BeginTransaction();
                try
                {

                    _studentService.Student(db);
                    _studentService.ImportStudent(file);
                    db.CompleteTransaction();
                }
                catch (Exception e)
                {
                    db.AbortTransaction();
                    throw e;
                }
            }

        }
        public dynamic GetStudent(int Id)
        {
            using (var db = new PetaPoco.Database("databaseConn"))
            {
               
                try
                {

                    _studentService.Student(db);
                    var retStudent =  _studentService.GetStudent(Id);
                    retStudent.History = _checkInService.GetCheckInList(retStudent);
                    

                    return retStudent;
                    
                }
                catch (Exception e)
                {
                    
                    throw e;
                }
            }
        }
    }
}
