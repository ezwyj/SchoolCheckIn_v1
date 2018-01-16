using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.ValueSets
{
    public class ValueSetService
    {
        private PetaPoco.Database _db;
        /// <summary>
        /// 创建值集
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <param name="msg"></param>
        /// <returns></returns>
        public void CreateValueSet(string name, string description, string inputUser)
        {
            string msg = string.Empty;
            var v = new ValueSet();
            v.Name = name;
            v.Description = description;
            v.InputUser = inputUser;
            v.InputTime = DateTime.Now;
            v.IsDelete = false;
            v.IsEnabled = true;

            var duptest = _db.Fetch<ValueSet>(" where Name =@0", name);
            if (duptest.Count > 0)
            {
                throw new Exception("同名的值集已经存在!");

            }
            _db.Save(v);

        }
        public ValueSet GetValueSetByName(string name)
        {
            var vs = _db.Fetch<ValueSet>(" where text=@0 and isdelete = 0", name);
            if(vs.Count>0)
            {
                return vs[0];
            }
            else
            {
                return null;
            }

        }
        public ValueSet GetValueSetByID(int id)
        {
            var vs = _db.Single<ValueSet>(id);
            return vs;

        }
        public ValueItem GetValueItemByID(int id)
        {
            var vs = _db.Single<ValueItem>(id);
            return vs;

        }

        public void SaveValueSet(ValueSet v)
        {
            string msg;

            var dupval = _db.Fetch<ValueSet>(" where id<>@0 and text=@1", v.ID, v.Name);
            if (dupval != null)
            {
                throw new Exception("同名的值集已经存在!");
            }
            if (v.ID == 0)
            {
                v.IsDelete = false;
                v.IsEnabled = true;
                _db.Save(v);
            }
            else
            {
                _db.Update(v, new string[] { "name","isDelete","isEnabled" });
            }
            
        }

        public ValueItem CreateItem(ValueItem it)
        {
             ValidateItem(it);
             _db.Save(it);
            return it;
        }
        public void ValidateItem(ValueItem rec)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(rec.Value))
            {
                errors.Add("项目的值不能为空。");

            }

            if (string.IsNullOrWhiteSpace(rec.Text))
            {
                errors.Add("项目文本不能为空。");

            }

            if (rec.ValueSetID == 0)
            {
                errors.Add("值集ID不能为空。");
            }


            else
            {
                var vs = _db.Fetch<ValueSet>("where  id=@0", rec.ValueSetID);
                if (vs == null)
                {
                    errors.Add("值集ID不正确。");
                }
            }

            
            if (errors.Count > 0)
            {
                throw new Exception(string.Join(",", errors));

            }
            return ;

        }
        public void SaveValueItem(ValueItem it)
        {
                if (string.IsNullOrEmpty(it.Text))
                {
                    it.Text = it.Value;
                }
                if (string.IsNullOrEmpty(it.Value))
                {
                    it.Value = it.Text;
                }
                ValidateItem(it);
                _db.Save(it);
          
        }
        public void DeleteValueItem(int id)
        {
            var it = _db.Single<ValueItem>(id);
           if (it == null)
            {
                throw new Exception("项目不存在!");
            }
            it.IsDelete = true;
            _db.Save(it);

        }

        public void DeteValueSet(int id)
        {
            var it =  _db.Single<ValueSet>(id);
            if (it == null || it.IsDelete == true)
            {
                throw new Exception( "值集不存在!");
            }
            it.IsDelete = true;

            _db.Save(it);
        }

        public List<ValueItem> GetValueItemList(int valueSetId)
        {
            return _db.Fetch<ValueItem>("select * from ValueItem where ValueSetId=@0 and isEnabled=1 order by weight",valueSetId) .ToList();
        }

    }
}
