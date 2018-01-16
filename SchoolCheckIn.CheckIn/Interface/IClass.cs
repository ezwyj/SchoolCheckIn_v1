using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolCheckIn.CheckIn.Model;

namespace SchoolCheckIn.CheckIn.Interface
{
    public interface IClass
    {
        void SaveClass(Class classInfo);
        void DeleteClass(Class classInfo);
        List<Class> GetClassList(string name);
        Class GetClass(int id);
        void ImportClass(string file);
        void BatchBuildClass(Class classInfo,DateTime startTime, CycleEnum cycle,int time);
        void Class(PetaPoco.Database db);
        List<Class> GetClassListByStudent(Student student);
    }

    public enum CycleEnum
    {
        Day=0,
        Week=1,
        TwoWeek,
        Month

    }
}
