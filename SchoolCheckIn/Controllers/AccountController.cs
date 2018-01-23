using SchoolCheckIn.Right.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SchoolCheckIn.Controllers
{
    public class AccountController : Controller
    {
        /// <summary>
        /// 登录页
        /// </summary>
        /// <returns></returns>
        public ActionResult Login(string returnUrl, string errorMsg, string username)
        {
            ViewBag.returnUrl = returnUrl;
            ViewBag.errorMsg = errorMsg;
            ViewBag.username = username;
            return View();
        }

        /// <summary>
        /// 登录方法
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult LoginAction(string username, string password, string returnUrl)
        {
            if (string.IsNullOrWhiteSpace(username) && string.IsNullOrWhiteSpace(password))
            {
                return RedirectToAction("Login", "Account", new { returnUrl = returnUrl, errorMsg = "用户名、密码不能为空！" });
            }
            
            returnUrl = string.IsNullOrWhiteSpace(returnUrl) ? System.Web.Security.FormsAuthentication.DefaultUrl : returnUrl;
           

            string msg = string.Empty;
            PetaPoco.Database db = new PetaPoco.Database("DatabaseConn");
            ApplicationRightService ars = new ApplicationRightService(db);

            if ( ars.Login(username, password))
            {
                var user = ars.GetUserByBadge(username);

                System.Web.Security.FormsAuthentication.SetAuthCookie(user.Badge+":"+user.UserName , true);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return RedirectToAction("Login", "Account", new { returnUrl = returnUrl, errorMsg = msg, username = username });
            }
        }

        /// <summary>
        ///  登出
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        public ActionResult Logout(string returnUrl)
        {
            // 如果已登录，则需要先登出
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                Session.Clear();
                System.Web.Security.FormsAuthentication.SignOut();
            }
            return RedirectToAction("Login", "Account", new { returnUrl = returnUrl });
        }
    }
}