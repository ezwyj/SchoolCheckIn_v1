using SchoolCheckIn.Models;
using SchoolCheckIn.ValueSets;
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
            string Msg = string.Empty;
            try
            {
                if (string.IsNullOrWhiteSpace(json))
                {
                    Msg = "保存的内容为空。";
                }
                var v = Newtonsoft.Json.JsonConvert.DeserializeObject<ValueSet>(json);
                var svc = new ValueSetService();
                string user = HttpContext.User.Identity.Name;
                svc.CreateValueSet(v.Name, v.Description, user);
                return Json(new { State = false, Msg = "" }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception e)
            {
                return Json(new { State = false, Msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// 创建值项目
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Save", true)]
        public ActionResult CreateValueItem(string json)
        {
            try
            {
                var vi = Newtonsoft.Json.JsonConvert.DeserializeObject<ValueItem>(json);
                var svc = new ValueSetService();
                svc.SaveValueItem(vi);
                return Json(new { State = false, Msg = "" }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception e)
            {
                return Json(new { State = false, Msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        /// <summary>
        /// 编辑值集
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [RightFilter("值集设置", "Delete", true)]
        public ActionResult DeleteValueItem(int id)
        {
            try
            {
                var svc = new ValueSetService();
                svc.DeleteValueItem(id);
                return Json(new { State = false, Msg = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { State = false, Msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
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

            try
            {
                svc.DeteValueSet(id);

            }
            catch (Exception e)
            {
                return Json(new { State = false, Msg = e.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { State = true, Msg = "" }, JsonRequestBehavior.AllowGet);
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
            var vItem = svc.GetValueItemByID(id);

            if (vItem == null)
            {
                return Json(new { State = false, Msg = "值集不存在。" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { State = true, Msg = string.Empty, Data = vItem }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取值列表
        /// </summary>
        /// <returns></returns>
        [RightFilter("值集设置", "Select", true)]
        public JsonResult GetValueItemList(int valueSetId)
        {
            var svc = new ValueSetService();
            var list = svc.GetValueItemList(valueSetId);
            return Json(new { State = true, Msg = string.Empty, Data = list }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取值列表，供使用
        /// </summary>
        /// <param name="valueSetId"></param>
        /// <returns></returns>
        public JsonResult GetValueItemListForUse(int valueSetId)
        {
            var svc = new ValueSetService();
            var list = svc.GetValueItemList(valueSetId).FindAll(a => a.IsEnabled);
            return Json(new { State = true, Msg = string.Empty, Data = list }, JsonRequestBehavior.AllowGet);
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
            var vs = svc.GetValueSetByName(name);

            if (vs == null)
            {
                return Json(new { State = false, Msg = "值集不存在。" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { State = true, Msg = string.Empty, Data = vs }, JsonRequestBehavior.AllowGet);
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

           
            if (string.IsNullOrWhiteSpace(json))
            {
                return Json(new { State = false, Msg = "保存的内容为空。" }, JsonRequestBehavior.AllowGet);
            }

            var v = Newtonsoft.Json.JsonConvert.DeserializeObject<ValueItem>(json);
            try
            {

                svc.SaveValueItem(v);

            }
            catch (Exception e)
            {
                return Json(new { State = false, Msg = e.Message }, JsonRequestBehavior.AllowGet);
            }



            return Json(new { State = true, Msg = "", Data = v }, JsonRequestBehavior.AllowGet);
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

            if (string.IsNullOrWhiteSpace(json))
            {
                return Json(new { State = false, Msg = "保存的内容为空。" }, JsonRequestBehavior.AllowGet);
            }

            var v = Newtonsoft.Json.JsonConvert.DeserializeObject<ValueSet>(json);
            try
            {

                svc.SaveValueSet(v);
            }
            catch (Exception e)
            {
                return Json(new { State = false, Msg = e.Message, Data = v }, JsonRequestBehavior.AllowGet);
            }



            return Json(new { State = true, Msg = "", Data = v }, JsonRequestBehavior.AllowGet);
        }
    }
}