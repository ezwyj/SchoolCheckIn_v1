using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SchoolCheckIn.Controllers
{
    public class SchoolController : Controller
    {
        // GET: Config
        public ActionResult MainClass()
        {
            return View();
        }
    }
}