using SchoolCheckIn.Models;
using SchoolCheckIn.Right.Entity;
using SchoolCheckIn.Right.Model;
using SchoolCheckIn.Right.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SchoolCheckIn.Controllers
{
    public class RightController : Controller
    {
        static PetaPoco.Database db = new PetaPoco.Database("DatabaseConn");
        ApplicationRightService ars = new ApplicationRightService(db);

        /// <summary>
        /// 权限设置页面
        /// </summary>
        /// <returns></returns>
        [RightFilter("权限设置", "Select")]
        public ActionResult Index()
        {
            return View();
        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetRightObjectTypeList()
        {
            try
            {
                var keyValues = new List<KeyValuePair<int, string>>();
                KeyValuePair<int, string> keyValue;

                foreach (int key in Enum.GetValues(typeof(RightObjectTypeEnum)))
                {
                    keyValue = new KeyValuePair<int, string>(key, Enum.GetName(typeof(RightObjectTypeEnum), key));
                    keyValues.Add(keyValue);
                }
                return Json(new { State = true, Msg = "", Data = keyValues }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { State = false, Msg = e.Message });
            }
        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetRightObjects(string keyword)
        {
            string msg = string.Empty;
            bool state = true;
            var rst = new List<RightObject>();
            try
            {

                rst = ars.GetRightObjects(keyword);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetRightObjectById(int id)
        {
            string msg = string.Empty;
            bool state = true;
            var rst = new RightObject();
            try
            {

                rst = ars.GetRightObject(id);
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [RightFilter("权限设置", "Save", true)]
        [HttpPost]
        public JsonResult SaveRightObject(string json)
        {
            string msg = string.Empty;
            bool state = true;
            try
            {
                RightObject ro = Newtonsoft.Json.JsonConvert.DeserializeObject<RightObject>(json);
                ars.SaveObject(ro);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [RightFilter("权限设置", "Delete", true)]
        [HttpPost]
        public JsonResult DeleteRightObject(int id)
        {
            string msg = string.Empty;
            bool state = true;

            try
            {
                var ro = ars.GetRightObject(id);
                if (ro == null)
                {
                    throw new Exception("未找到目标资源!");
                }
                ars.DeleteObject(ro);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetRoles(string keyword)
        {
            string msg = string.Empty;
            bool state = true;
            var rst = new List<Role>();
            try
            {

                rst = ars.GetRoles(keyword);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetRoleById(int id)
        {
            string msg = string.Empty;
            bool state = true;
            var rst = new Role();
            try
            {

                rst = ars.GetRole(id);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [RightFilter("权限设置", "Save", true)]
        [HttpPost]
        public JsonResult SaveRole(string json)
        {
            string msg = string.Empty;
            bool state = true;

            try
            {
                Role postModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Role>(json);
                ars.SaveRole(postModel);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [RightFilter("权限设置", "Delete", true)]
        [HttpPost]
        public JsonResult DeleteRole(int id)
        {
            string msg = string.Empty;
            bool state = true;

            try
            {
                var ro = ars.GetRole(id);
                if (ro == null)
                {
                    throw new Exception("未找到角色!");
                }
                ars.DeleteRole(ro);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [RightFilter("权限设置", "Save", true)]
        public JsonResult AddUserInRole(int roleId, string badge, string name, string department)
        {
            string msg = string.Empty;
            bool state = true;

            try
            {
                Right.Entity.Role r = ars.GetRole(roleId);
                Right.Entity.User u = ars.GetUserByBadge(badge);

                if (u == null)
                {
                    u = new Right.Entity.User();
                    u.Badge = badge;
                    u.UserName = name;
                    u.Department = department;
                    ars.SaveUser(u);

                    ars.AddRoleToUser(r, u);
                }
                else
                {
                    var roles = ars.GetRoleByUser(u);
                    if (roles.Where(a => a.RoleId == r.RoleId).Count() > 0)
                    {
                        throw new Exception("本角色已包含用户" + u.UserName + "!");
                    }

                    ars.AddRoleToUser(r, u);

                }

            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetRolesByUser(int uid)
        {
            string msg = string.Empty;
            bool state = true;
            var rst = new List<Role>();
            try
            {
                User u = ars.GetUser(uid);
                rst = ars.GetRoleByUser(u);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetUserByRole(int roleId)
        {
            string msg = string.Empty;
            bool state = true;
            var rst = new List<User>();
            try
            {

                rst = ars.GetUserByRole(roleId);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [RightFilter("权限设置", "Delete", true)]
        public JsonResult DeleteUserInRole(int roleId, int userId)
        {
            string msg = string.Empty;
            bool state = true;
            var rst = new List<User>();
            try
            {
                var u = ars.GetUser(userId);
                var r = ars.GetRole(roleId);
                ars.DeleteUserRole(u, r);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetOperations(string keyword)
        {
            string msg = string.Empty;
            bool state = true;
            var rst = new List<Operation>();
            try
            {

                rst = ars.GetOperations(keyword);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetOperationById(int id)
        {
            string msg = string.Empty;
            bool state = true;
            var rst = new Operation();
            try
            {

                rst = ars.GetOperation(id);
            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [RightFilter("权限设置", "Save", true)]
        [HttpPost]
        public JsonResult SaveOperation(string json)
        {
            string msg = string.Empty;
            bool state = true;

            try
            {
                Operation postModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Operation>(json);
                ars.SaveOperation(postModel);

            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [RightFilter("权限设置", "Delete", true)]
        [HttpPost]
        public JsonResult DeleteOperation(int id)
        {
            string msg = string.Empty;
            bool state = true;

            try
            {
                Operation postModel = ars.GetOperation(id);
                ars.DeleteOperation(postModel);

            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [RightFilter("权限设置", "Select", true)]
        public JsonResult GetPermissionByRole(int roleId)
        {
            string msg = string.Empty;
            bool state = true;
            List<PermissionModel> rst = new List<PermissionModel>();
            try
            {
                rst = ars.GetPermissionModelByRole(roleId);

            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg, Data = rst }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [RightFilter("权限设置", "Save", true)]
        [HttpPost]
        public JsonResult SavePermission(int roleId, string json)
        {
            string msg = string.Empty;
            bool state = true;

            try
            {
                List<PermissionModel> rst = Newtonsoft.Json.JsonConvert.DeserializeObject<List<PermissionModel>>(json);

                ars.SavePermission(roleId, rst);


            }

            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { State = state, Msg = msg }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult IsHaveRight(string objectName, string optionCode)
        {
            try
            {
                return Json(new { State = true, Msg = "", Data = ars.HaveRight(HttpContext.User.Identity.Name, objectName, optionCode) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { State = false, Msg = e.Message });
            }
        }
    }
}