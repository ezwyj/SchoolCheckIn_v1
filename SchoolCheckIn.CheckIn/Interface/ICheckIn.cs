using SchoolCheckIn.CheckIn.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace SchoolCheckIn.CheckIn.Interface
{
    interface ICheckIn
    {
        Student CheckIn(string QrCode);
        Student CheckIn(Image image);
        List<CheckIn.Model.CheckIn> GetCheckInList(DateTime datetime);
        List<CheckIn.Model.CheckIn> GetCheckInList(Student student);
        

    }
}
