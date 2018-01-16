using SchoolCheckIn.CheckIn.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolCheckIn.CheckIn.Model;
using System.Net.Mime;
using System.Drawing;
using PetaPoco;

namespace SchoolCheckIn.Student
{
    public class CheckInImpl : ICheckIn
    {
        private PetaPoco.Database _db;

        CheckIn.Model.Student ICheckIn.CheckIn(Image image)
        {
            throw new NotImplementedException();
        }

        void ICheckIn.CheckIn(Database db)
        {
            _db = db;
        }

        CheckIn.Model.Student ICheckIn.CheckIn(string QrCode)
        {
            throw new NotImplementedException();
        }

        List<CheckIn.Model.CheckIn> ICheckIn.GetCheckInList(CheckIn.Model.Student student)
        {
            throw new NotImplementedException();
        }

        List<CheckIn.Model.CheckIn> ICheckIn.GetCheckInList(DateTime datetime)
        {
            throw new NotImplementedException();
        }
    }
}
