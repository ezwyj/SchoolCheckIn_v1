using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolCheckIn.CheckIn.Model;

namespace SchoolCheckIn.CheckIn.Interface
{
    interface IClass
    {
        void SaveClass(Class classInfo);
        void DeleteClass(Class classInfo);
        List<Class> GetClassList(string name);
        void ImportClass(string file);
    }
}
