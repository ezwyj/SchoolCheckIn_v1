using SchoolCheckIn.CheckIn.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolCheckIn.CheckIn.Model;
using PetaPoco;

namespace SchoolCheckIn.Class
{
    public class ClassImpl : IClass
    {
        private PetaPoco.Database _db;

        void IClass.BatchBuildClass(CheckIn.Model.Class classInfo, DateTime startTime, CycleEnum cycle, int time)
        {
            for(int i = 1; i < time; i++)
            {
                Entity.ClassEntity entity = new Entity.ClassEntity();
                entity.ClassLevel = classInfo.Level;
                entity.ClassTime = classInfo.ClassTime;
                entity.Description = classInfo.Description;
                entity.StartTime = getTime(startTime, cycle, i);
                entity.EndTime = entity.StartTime.AddMinutes(Common.GlobalVariable.ClassTimeMinute);
                entity.InputTime = DateTime.Now;
                entity.InputUser = classInfo.InputUser;
                entity.Name = classInfo.Name;
                entity.Teacher = classInfo.Teacher;
                entity.Type = classInfo.Type;
                _db.Save(entity);

            }
        }
        private DateTime getTime (DateTime startTime,CycleEnum cycle ,int i)
        {
            switch(cycle)
            {
                case CycleEnum.Day:
                    return startTime.AddDays(i);
                case CycleEnum.Month:
                    return startTime.AddMonths(i);
                case CycleEnum.TwoWeek:
                    return startTime.AddDays(2 * 7 * i);
                case CycleEnum.Week:
                    return startTime.AddDays(7 * i);
            }
            return startTime;
        }

        void IClass.Class(Database db)
        {
            _db = db;
        }

        void IClass.DeleteClass(CheckIn.Model.Class classInfo)
        {
            var entity = _db.Single<Entity.ClassEntity>(classInfo.Id);
            _db.Delete(entity);
        }

        List<CheckIn.Model.Class> IClass.GetClassList(string name)
        {
            var retList = new List<CheckIn.Model.Class>();

            string where = " 1=1 ";
            if (!string.IsNullOrEmpty(name))
            {
                where += "and name like '%" + name + "%'";
            }
            var entityList = _db.Fetch<Entity.ClassEntity>("select * from classInfo " + where);
            foreach(var item in entityList)
            {
                var newModel = new CheckIn.Model.Class();
                newModel.ClassTime = item.ClassTime;
                newModel.Description = item.Description;
                newModel.EndTime = item.EndTime;
                newModel.Id = item.Id;
                newModel.InputTime = item.InputTime;
                //newModel.InputUser = new user
                newModel.Level = item.ClassLevel;
                newModel.Name = item.Name;
                newModel.StartTime = item.StartTime;
                newModel.Teacher = item.Teacher;
                newModel.Type = item.Type;
                retList.Add(newModel);
            }
            return retList;
        }

        void IClass.ImportClass(string file)
        {
            throw new NotImplementedException();
        }

        void IClass.SaveClass(CheckIn.Model.Class classInfo)
        {
            var entity = new Entity.ClassEntity();
            entity.ClassLevel = classInfo.Level;
            entity.ClassTime = classInfo.ClassTime;
            entity.Description = classInfo.Description;
            entity.EndTime = classInfo.EndTime;
            entity.Id = classInfo.Id;
            entity.InputTime = classInfo.InputTime;
            entity.InputUser = classInfo.InputUser;
            entity.Name = classInfo.Name;
            entity.StartTime = classInfo.StartTime;
            entity.Teacher = classInfo.Teacher;
            entity.Type = classInfo.Type;
            _db.Save(entity);


        }

        CheckIn.Model.Class IClass.GetClass(int id)
        {
            var retClass = new CheckIn.Model.Class();
            var entity = _db.Single<Entity.ClassEntity>(id);
            retClass.Level= entity.ClassLevel ;
            retClass.ClassTime=entity.ClassTime  ;
            retClass.Description = entity.Description;
            retClass.EndTime = entity.EndTime;
            retClass.Id = entity.Id;
            retClass.InputTime = entity.InputTime;
            retClass.InputUser = entity.InputUser;
            retClass.Name= entity.Name ;
            retClass.StartTime = entity.StartTime;
            retClass.Teacher =entity.Teacher;
            retClass.Type= entity.Type ;
            return retClass; 
        }

        List<CheckIn.Model.Class> IClass.GetClassListByStudent(Student student)
        {
            throw new NotImplementedException();
        }
    }
}
