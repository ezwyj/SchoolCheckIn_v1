using SchoolCheckIn.CheckIn.Service;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SchoolCheckIn.Controllers
{
    public class StudentsController : Controller
    {
        // GET: Students
        public ActionResult Index()
        {
            return View();
        }
        private bool CreateFolderIfNeeded(string path)
        {
            bool result = true;
            if (!Directory.Exists(path))
            {
                 Directory.CreateDirectory(path);
            }
            return result;
        }

        public JsonResult ImportStudent()
        {
            if (Request.Files.Count == 0)
            {
                return Json(new { state = false, Message = "没有上传文件" });
            }
            try
            {
                var student = new StudentServices();
                var filepath = System.Web.HttpContext.Current.Server.MapPath("~/FileUpload");
                CreateFolderIfNeeded(filepath);
                string badge = HttpContext.User.Identity.Name;
                foreach (string file in Request.Files)
                {
                    HttpPostedFileBase uploadFile = Request.Files[file] as HttpPostedFileBase;
                    if (uploadFile != null && uploadFile.ContentLength > 0)
                    {
                        var path = Path.Combine(filepath, Guid.NewGuid().ToString() + ".xls");
                        uploadFile.SaveAs(path);
                    student.ImportStudent(file);
                    }
                }
                return Json(new { State = true, Message = "上传成功" });
            }
            catch (Exception e)
            {
                return Json(new { State = false, Message = e.Message });
            }

        }

        public JsonResult GetStudentList(string name, string className, DateTime startTime,DateTime endTime, int pageIndex, int pageSize)
        {
            bool state = true;
            string msg = string.Empty;
            List<CheckIn.Model.Student> list = null;
            int total = 0;
            try
            {
                var studentService = new SchoolCheckIn.CheckIn.Service.StudentServices();
                list = studentService.GetStudentList(name, className, startTime, endTime);
                total = list.Count;
                list = list.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
           


            return new JsonResult { Data = new { State = state, Message = msg, Data = list, Total = total }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetStudent(int studentId)
        {
            bool state = true;
            string msg = string.Empty;
            CheckIn.Model.Student entity = null;
            int total = 0;
            try
            {
                var studentService = new SchoolCheckIn.CheckIn.Service.StudentServices();
                entity = studentService.GetStudent(studentId);

            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }



            return new JsonResult { Data = new { State = state, Message = msg, Data = entity, Total = total }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}