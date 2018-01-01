using SchoolCheckIn.CheckIn.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolCheckIn.CheckIn.Model;

namespace SchoolCheckIn.Class
{
    public class ClassImpl : IClass
    {
        void IClass.BatchBuildClass(CheckIn.Model.Class classInfo, CycleEnum cycle)
        {
            throw new NotImplementedException();
        }

        void IClass.DeleteClass(CheckIn.Model.Class classInfo)
        {
            throw new NotImplementedException();
        }

        List<CheckIn.Model.Class> IClass.GetClassList(string name)
        {
            throw new NotImplementedException();
        }

        void IClass.ImportClass(string file)
        {
            throw new NotImplementedException();
        }

        void IClass.SaveClass(CheckIn.Model.Class classInfo)
        {
            throw new NotImplementedException();
        }
    }
}
