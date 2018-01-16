using SchoolCheckIn.CheckIn.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Service
{
    public class ClassServices
    {
        private readonly IClass _classService = new UnityContainerHelp().GetServer<IClass>();



        public void Save(SchoolCheckIn.CheckIn.Model.Class classModel)
        {
            PetaPoco.Database db = new PetaPoco.Database("DatabaseConn");
            db.BeginTransaction();
            try
            {
                _classService.Class(db);
                _classService.SaveClass(classModel);
                db.CompleteTransaction();
            }
            catch (Exception e)
            {
                db.AbortTransaction();
                throw e;
            }
        }

        public void Delete(SchoolCheckIn.CheckIn.Model.Class classModel)
        {
            PetaPoco.Database db = new PetaPoco.Database("DatabaseConn");
            db.BeginTransaction();
            try
            {
                _classService.Class(db);
                _classService.DeleteClass(classModel);
                db.CompleteTransaction();
            }
            catch (Exception e)
            {
                db.AbortTransaction();
                throw e;
            }
        }

        public List<SchoolCheckIn.CheckIn.Model.Class> GetClassList(string name)
        {
            PetaPoco.Database db = new PetaPoco.Database("DatabaseConn");
           
            try
            {
                _classService.Class(db);
                return _classService.GetClassList(name);
                
            }
            catch (Exception e)
            {
                
                throw e;
            }
        }

        public SchoolCheckIn.CheckIn.Model.Class GetClass(int id)
        {
            PetaPoco.Database db = new PetaPoco.Database("DatabaseConn");

            try
            {
                _classService.Class(db);
                return _classService.GetClass(id);
            }
            catch (Exception e)
            {

                throw e;
            }
        }

        public void ImportClass(string file)
        {
            PetaPoco.Database db = new PetaPoco.Database("DatabaseConn");
            db.BeginTransaction();
            try
            {
                _classService.Class(db);
                _classService.ImportClass(file);
                db.CompleteTransaction();
            }
            catch (Exception e)
            {
                db.AbortTransaction();
                throw e;
            }
        }
    }
}
