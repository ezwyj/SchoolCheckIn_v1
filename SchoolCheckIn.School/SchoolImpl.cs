using SchoolCheckIn.CheckIn.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolCheckIn.CheckIn.Model;
using PetaPoco;

namespace SchoolCheckIn.School
{
    public class SchoolImpl : ISchool
    {
        private Database _db;
        CheckIn.Model.School ISchool.GetSchoolInfo()
        {
            var list = _db.Fetch<SchoolEntity>("select top 1 * from SchoolInfo");
            if (list.Count == 0)
            {
                throw new Exception("未配置学校基本信息!");
            }
            CheckIn.Model.School retSchool = new CheckIn.Model.School();
            retSchool.Address = list[0].Address;
            retSchool.Administrator = _db.Single<Employee>(list[0].AdministratorId);
            retSchool.Name = list[0].Name;
            retSchool.President = _db.Single<Employee>(list[0].PresidentId);
            retSchool.Telephone = list[0].Telephone;
            return retSchool;
        }

        void ISchool.SaveSchool(CheckIn.Model.School school)
        {
            var list  = _db.Fetch<SchoolEntity>("select top 1 * from SchoolInfo");
            if(list.Count == 0)
            {
                throw new Exception("未配置学校基本信息!");
            }
            SchoolEntity entity = list[0];
            entity.Address = school.Address;
            entity.Name = school.Name;
            entity.Telephone = school.Telephone;
            entity.PresidentId = school.President.User.UserId;
            entity.AdministratorId = school.Administrator.User.UserId;

            _db.Save(entity);
        }

        void ISchool.School(global::PetaPoco.Database db)
        {
            _db = db;
        }

        void ISchool.Setup(CheckIn.Model.School school)
        {
            SchoolEntity entity = new SchoolEntity();
            entity.Address = school.Address;
            entity.Name = school.Name;
            entity.Telephone = school.Telephone;
            entity.PresidentId = school.President.User.UserId;
            entity.AdministratorId = school.Administrator.User.UserId;

            _db.Save(entity);
        }
    }
}
