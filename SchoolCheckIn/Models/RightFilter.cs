using SchoolCheckIn.Right.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SchoolCheckIn.Models
{
    public class RightFilter : FilterAttribute, IAuthorizationFilter
    {



        private string _resourceName { get; set; }
        private string _operationCode { get; set; }
        private bool _isJsonResult { get; set; }

         

        public RightFilter(string resourceName, string operationCode, bool isJsonResult = false)
        {

            this._resourceName = resourceName;
            this._operationCode = operationCode;
            this._isJsonResult = isJsonResult;
        }

        public void OnAuthorization(AuthorizationContext filterContext)
        {
            var badge = HttpContext.Current.User.Identity.Name;
            PetaPoco.Database db = new PetaPoco.Database("DatabaseConn");
            ApplicationRightService ars = new ApplicationRightService(db);
            if (!ars.HaveRight(badge, _resourceName, _operationCode))
            {
                filterContext.Result = UtilHelper.Error("401", "您没有权限访问该模块", _isJsonResult);
            }
        }
    }
}