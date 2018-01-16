using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolCheckIn.CheckIn.Model;

namespace SchoolCheckIn.CheckIn.Interface
{
    public interface IStudent
    {
        string ImportStudent(string file);
        void DeleteStuent(int studentId);
        void SaveStudent(Student student);
        dynamic GetStudent(int id);
        dynamic GetStudentList(string name,string className,DateTime startClassTime,DateTime endClassTime);
        void AddClass(Class classinfo);
        void AddClass(List<Class> classInfoes);
        void DeleteClass(Class classInfo);
        void Student(PetaPoco.Database db);
    }
}
