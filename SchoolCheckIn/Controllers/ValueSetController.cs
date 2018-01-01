using SchoolCheckIn.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SchoolCheckIn.Controllers
{
    public class ValueSetController : Controller
    {

        /// <summary>
        /// 值集设置
        /// </summary>
        /// <returns></returns>
        [RightFilter("值集设置", "Select")]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 新增值集
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Save", true)]
        public ActionResult CreateValueSet(string json)
        {
            if (string.IsNullOrWhiteSpace(json))
            {
                return Json(new { State = false, Msg = "保存的内容为空。" }, JsonRequestBehavior.AllowGet);
            }

            var v = Newtonsoft.Json.JsonConvert.DeserializeObject<ValueSet>(json);
            var svc = new ProjectArchive.ValueSet.Service.ValueSetService();
            string msg = string.Empty;
            var user = UserEntity.GetCurrentUser();

            var rst = svc.CreateValueSet(v.Text, v.Description, user.Name, user.Badge);

            if (!string.IsNullOrWhiteSpace(msg))
            {
                return Json(new { State = false, Msg = msg }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { State = true, Msg = string.Empty, Data = rst }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 创建值项目
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Save", true)]
        public ActionResult CreateValueItem(string json)
        {
            if (string.IsNullOrWhiteSpace(json))
            {
                return Json(new { State = false, Msg = "保存的内容为空。" }, JsonRequestBehavior.AllowGet);
            }

            var v = Newtonsoft.Json.JsonConvert.DeserializeObject<ValueItem>(json);
            var svc = new ValueSetService();
            string msg = string.Empty;
            var user = UserEntity.GetCurrentUser();
            v.CreateTime = DateTime.Now;
            v.Creator = user.Name;
            v.CreatorId = user.Badge;

            ProjectArchive.ValueSet.Entity.ValueItem rst = new ValueItem();
            try
            {
                rst = svc.CreateItem(v);
            }
            catch (Exception e)
            {
                msg = e.Message;
            }



            return Json(new { State = true, Msg = msg, Data = rst }, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// 编辑值集
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Delete", true)]
        public ActionResult DeleteValueItem(int id)
        {
            var svc = new ValueSetService();

            var user = UserEntity.GetCurrentUser();
            bool retState = false;
            string msg = string.Empty;
            try
            {
                svc.DeleteValueItem(id);
                retState = true;
            }
            catch (Exception e)
            {
                msg = e.Message;
            }


            return Json(new { State = retState, Msg = msg }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 删除值集
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Delete", true)]
        public ActionResult DeleteValueSet(int id)
        {
            var svc = new ValueSetService();

            var user = UserEntity.GetCurrentUser();
            bool retState = false;
            string msg = string.Empty;
            try
            {
                svc.DeleteValueSet(id);
                retState = true;
            }
            catch (Exception e)
            {
                msg = e.Message;
            }

            return Json(new { State = retState, Msg = msg }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取值集项目
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Select", true)]
        public ActionResult GetValueItemByID(int id)
        {
            if (id == 0)
            {
                return Json(new { State = false, Msg = "值集ID不能为0" }, JsonRequestBehavior.AllowGet);
            }

            var svc = new ValueSetService();
            string msg = string.Empty;

            var vs = svc.GetValueItemByID(id);

            if (vs == null)
            {
                return Json(new { State = false, Msg = "值集不存在。" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { State = true, Msg = string.Empty, Data = vs }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取值列表
        /// </summary>
        /// <returns></returns>
        [RightFilter("值集设置", "Select", true)]
        public JsonResult GetValueItemList(int valueSetId)
        {
            var list = ValueSetService.GetValueItemList(valueSetId);
            return Json(new { State = true, Msg = string.Empty, Data = list }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取值列表，供使用
        /// </summary>
        /// <param name="valueSetId"></param>
        /// <returns></returns>
        public JsonResult GetValueItemListForUse(int valueSetId)
        {
            var list = ValueSetService.GetValueItemList(valueSetId).FindAll(a => a.IsEnabled);
            return Json(new { State = true, Msg = string.Empty, Data = list }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取值集列表
        /// </summary>
        /// <param name="name">名称</param>
        /// <param name="enabledFlag">启用标志</param>
        /// <returns></returns>
        [RightFilter("值集设置", "Select", true)]
        public JsonResult GetValueItemListByName(string name, string enabledFlag)
        {
            var vs = ProjectArchive.ValueSet.Entity.ValueSet.GetListByProperty(o => o.Text, name).Where(o => o.IsDelete == false).FirstOrDefault();
            var list =
                ValueItem.GetListByProperty(o => o.SetId, vs.Id)
                    .Where(o => o.IsDelete == false)
                    .OrderBy(o => o.Sort)
                    .ToList();

            list = list.Where(o => o.IsEnabled == bool.Parse(enabledFlag)).ToList();


            return Json(new { State = true, Message = string.Empty, Data = list }, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// 根据ID获取值合
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Select", true)]
        public ActionResult GetValueSetByID(int id)
        {
            if (id == 0)
            {
                return Json(new { State = false, Msg = "值集ID不能为0" }, JsonRequestBehavior.AllowGet);
            }

            var svc = new ValueSetService();
            string msg = string.Empty;

            var vs = svc.GetValueSetByID(id);

            if (vs == null)
            {
                return Json(new { State = false, Msg = "值集不存在。" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { State = true, Msg = string.Empty, Data = vs }, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// 根据名称获取值集
        /// </summary>
        /// <param name="name">名称</param>
        /// <returns></returns>
        [RightFilter("值集设置", "Select", true)]
        public ActionResult GetValueSetByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return Json(new { State = false, Msg = "名称不能为空。" }, JsonRequestBehavior.AllowGet);
            }

            var svc = new ValueSetService();
            string msg = string.Empty;
            var user = UserEntity.GetCurrentUser();

            var vs = svc.GetValueSetByName(name);

            if (vs == null)
            {
                return Json(new { State = false, Msg = "值集不存在。" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { State = true, Msg = string.Empty, Data = vs }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取集列表
        /// </summary>
        /// <returns></returns>
        [RightFilter("值集设置", "Select", true)]
        public JsonResult GetValueSetList()
        {
            var db = ProjectArchive.ValueSet.Entity.ValueSet.DefaultDB;

            var rst = new List<ProjectArchive.ValueSet.Entity.ValueSet>();
            try
            {
                rst = db.Fetch<ProjectArchive.ValueSet.Entity.ValueSet>("where SetId is null and isdelete=0 order by Sort").ToList();
            }
            catch (Exception ex)
            {

                return Json(new { State = false, Msg = "查询失败。" + ex.Message }, JsonRequestBehavior.AllowGet);
            }



            return
                Json(
                    new
                    {
                        State = true,
                        Msg = string.Empty,
                        Data = rst
                    },
                    JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 保存值集项目
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Save", true)]
        public ActionResult SaveValueItem(string json)
        {
            var svc = new ValueSetService();

            var user = UserEntity.GetCurrentUser();
            if (string.IsNullOrWhiteSpace(json))
            {
                return Json(new { State = false, Msg = "保存的内容为空。" }, JsonRequestBehavior.AllowGet);
            }

            var v = Newtonsoft.Json.JsonConvert.DeserializeObject<ValueItem>(json);
            bool retState = false;

            string msg = string.Empty;
            try
            {
                v.Creator = user.Name;
                v.CreatorId = user.Badge;
                v.CreateTime = DateTime.Now;
                svc.SaveValueItem(v);
                retState = true;
            }
            catch (Exception e)
            {
                msg = e.Message;
            }



            return Json(new { State = retState, Msg = msg, Data = v }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 保存值集
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Save", true)]
        public ActionResult SaveValueSet(string json)
        {
            var svc = new ValueSetService();

            var user = UserEntity.GetCurrentUser();
            if (string.IsNullOrWhiteSpace(json))
            {
                return Json(new { State = false, Msg = "保存的内容为空。" }, JsonRequestBehavior.AllowGet);
            }

            var v = Newtonsoft.Json.JsonConvert.DeserializeObject<ProjectArchive.ValueSet.Entity.ValueSet>(json);

            string msg = string.Empty;
            bool retState = false;
            try
            {
                v.CreateTime = DateTime.Now;
                v.CreatorID = user.Badge;
                v.Creator = user.Name;
                svc.SaveValueSet(v);
                retState = true;
            }
            catch (Exception e)
            {
                msg = e.Message;
            }



            return Json(new { State = retState, Msg = msg, Data = v }, JsonRequestBehavior.AllowGet);
        }
    }
}