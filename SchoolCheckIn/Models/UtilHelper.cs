using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SchoolCheckIn
{
    public static class UtilHelper
    {
        public static string StaticVersion
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["StaticVersion"];
            }
        }

        public static ActionResult Error(string errorCode, string errorMsg, bool isJsonResult = false)
        {
            if (isJsonResult)
            {

                var json = new JsonResult();
                json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
                json.Data = new { State = false, Msg = "没有权限", ErrorCode = 401 };
                return json;
            }
            else
            {
                var view = new ViewResult();
                view.ViewName = "~/Views/Common/Error.cshtml";
                view.ViewBag.errorCode = errorCode;
                view.ViewBag.errorMsg = errorMsg;
                return view;
            }
        }
    }
}