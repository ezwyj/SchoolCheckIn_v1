using SchoolCheckIn.CheckIn.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.CheckIn.Service
{
    public class CheckInServices
    {
        private readonly ICheckIn _schoolService = new UnityContainerHelp().GetServer<ICheckIn>();

        public void CheckIn(string QrCode)
        {

        }
    }
}
