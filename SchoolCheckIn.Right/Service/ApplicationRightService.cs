using PetaPoco;
using SchoolCheckIn.Right.Entity;
using SchoolCheckIn.Right.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolCheckIn.Right.Service
{
    public class ApplicationRightService
    {
        private Database _db;

        public ApplicationRightService(PetaPoco.Database db)
        {
            _db = db;
        }
        public bool Login(string userName ,string pwd)
        {
            string sql = "Select * from Right_User where badge='" + userName + "' and password='"+pwd+"'";

            return _db.Fetch<User>(sql).Count>0;
        }

        public bool HaveRight(string badge, string resource, string operationCode)
        {
            User u = GetUserByBadge(badge);
            if (u == null)
            {
                return false;
            }
            List<Role> r = GetRoleByUser(u);
            if (r == null)
            {
                return false;
            }
            List<Permission> permission = new List<Permission>();
            foreach (Role rItem in r)
            {
                var oneRolePermission = GetPermissionByRole(rItem.RoleId);
                permission.AddRange(oneRolePermission);
            }



            RightObject obj = GetRightObject(resource);
            Operation operation = GetOperation(operationCode);
            if (obj == null)
            {
                return false;
            }
            if (operation == null)
            {
                return false;
            }

            var havePermission = permission.Where(a => a.ObjectId == obj.ObjectId).Where(b => b.OperationId == operation.OperationId);
            if (havePermission != null && havePermission.Count() > 0)
            {
                return true;
            }
            return false;

        }

        public User GetUserByBadge(string badge)
        {
           
            string sql = string.Format("Select * from Right_User where badge='{0}'", badge);

            return _db.FirstOrDefault<User>(sql);
        }

        public List<User> GetUserByRole(int roleId)
        {
            
            string sql = string.Format("Select * from Right_User where userId in ( select userId from Right_UserRole where RoleId={0})", roleId);

            return _db.Fetch<User>(sql);
        }
        public void AddUser(User u)
        {
            _db.Insert(u);
        }
        public void DeleteUser(User u)
        {
            _db.Delete(u);
            
        }
        public void SaveUser(User u)
        {
           _db.Save(u);
           
        }
        public List<User> GetUsers(string keyword)
        {
           
            string sql = "Select * from Right_User";
            if (string.IsNullOrEmpty(keyword))
            {
                sql += " where name like %" + keyword + "%";
            }
            return _db.Query<User>(sql).ToList();
        }
        public User GetUser(int id)
        {
           
            string sql = "Select * from Right_User where Userid=" + id;

            return _db.FirstOrDefault<User>(sql);
        }


        public void AddRole(Role r)
        {
     
            _db.BeginTransaction();
            try
            {
                _db.Update(r);
                _db.CompleteTransaction();
            }
            catch (Exception e)
            {
                _db.AbortTransaction();
                throw new Exception(e.Message);
            }

        }
        public void DeleteRole(Role r)
        {
             _db.Delete(r);
        }
        public void SaveRole(Role r)
        {
            _db.Save(r);
        }
        public List<Role> GetRoles(string keyword)
        {
           
            string sql = "Select * from Right_Role";
            if (!string.IsNullOrEmpty(keyword))
            {
                sql += " where name like '%" + keyword + "%'";
            }
            sql += " Order by sort";
            return _db.Query<Role>(sql).ToList();
        }
        public Role GetRole(int id)
        {
            string sql = "Select * from Right_Role where RoleId=" + id;

            return _db.FirstOrDefault<Role>(sql);
        }

        public void AddRoleToUser(Role r, User u)
        {
            UserRole ur = new UserRole();
            ur.RoleId = r.RoleId;
            ur.UserId = u.UserId;
            _db.Insert(ur);
          

        }
        public void DeleteUserRole(User u, Role r)
        {
            
            string sql = "delete from Right_UserRole";
            sql += " where userId=" + u.UserId + " and roleId=" + r.RoleId;
                _db.Execute(sql);
           
        }
        public List<Role> GetRoleByUser(User u)
        {
            
            string sql = "Select * from Right_Role";
            sql += " where roleId in ( select RoleId from Right_UserRole where UserId =" + u.UserId + ")";
            return _db.Query<Role>(sql).ToList();
        }




        public List<Permission> GetPermissionByRole(int roleId)
        {


            
            string sql = "Select * from Right_Permission";
            sql += " where RoleId =" + roleId;




            return _db.Fetch<Permission>(sql);
        }


        public void AddObject(RightObject r)
        {
            

            var checkResult = _db.ExecuteScalar<int>("Select count(*) from Right_Object where name='" + r.Name + "'");
            if (checkResult > 1)
            {
                throw new Exception("含有相同名称的资源!");
            }
             _db.Update(r);
          
        }
        public void DeleteObject(RightObject r)
        {
                _db.Delete(r);
        }
        public void SaveObject(RightObject r)
        {
            
            var checkSql = "Select count(*) from Right_Object where name='" + r.Name + "'";

            if (!_db.IsNew(r))
            {
                checkSql += " and ObjectId != " + r.ObjectId;
            }
            if (_db.ExecuteScalar<int>(checkSql) > 1)
            {
                throw new Exception("含有相同名称的资源!");
            }
            _db.Save(r);

        }
        public List<RightObject> GetRightObjects(string keyword)
        {
            
            string sql = "Select * from Right_Object";
            if (!string.IsNullOrEmpty(keyword))
            {
                sql += " where name like %" + keyword + "%";
            }

            return _db.Query<RightObject>(sql).ToList();
        }
        public RightObject GetRightObject(int id)
        {
            
            string sql = "Select * from Right_Object where objectId=" + id;

            return _db.FirstOrDefault<RightObject>(sql);
        }
        public RightObject GetRightObject(string name)
        {
            
            string sql = "Select * from Right_Object where name='" + name + "'";

            return _db.FirstOrDefault<RightObject>(sql);
        }

        public List<PermissionModel> GetPermissionModelByRole(int roleId)
        {
            List<PermissionModel> pm = new List<PermissionModel>();


            
            string sqlPermission = "select  * from Right_Permission where  RoleId=" + roleId + "";
            var rolePermission = _db.Fetch<Permission>(sqlPermission);

            var objectRight = GetRightObjects("");
            var operation = GetOperations("");
            foreach (var objItem in objectRight)
            {
                PermissionModel pmItem = new PermissionModel();
                pmItem.Resource = objItem;
                foreach (var operationItem in operation)
                {
                    var p = rolePermission.Where(a => a.ObjectId == objItem.ObjectId).Where(b => b.OperationId == operationItem.OperationId).FirstOrDefault();
                    var permissionOperationModel = new PermissionOperationModel();
                    if (p == null)
                    {

                        permissionOperationModel.IsHaveRight = false;
                        permissionOperationModel.OperationCode = operationItem.OperationCode;
                        permissionOperationModel.OperationId = operationItem.OperationId;
                        pmItem.Operations.Add(permissionOperationModel);

                    }
                    else
                    {
                        permissionOperationModel.IsHaveRight = true;
                        permissionOperationModel.OperationCode = operationItem.OperationCode;
                        permissionOperationModel.OperationId = operationItem.OperationId;
                        pmItem.Operations.Add(permissionOperationModel);
                    }

                }
                pm.Add(pmItem);

            }


            return pm;


        }

        public void AddOperation(Operation o)
        {
                _db.Update(o);
        }
        public void DeleteOperation(Operation o)
        {
                _db.Delete(o);
        }
        public void SaveOperation(Operation o)
        {
            
            var checkSql = "Select count(*) from Right_Operation where OperationCode='" + o.OperationCode.Trim() + "'";

            if (!_db.IsNew(o))
            {
                checkSql += " and OperationId != " + o.OperationId;
            }
            if (_db.ExecuteScalar<int>(checkSql) > 1)
            {
                throw new Exception("含有相同名称的资源!");
            }
            _db.Save(o);
           
        }
        public List<Operation> GetOperations(string keyword)
        {
            
            string sql = "Select * from Right_Operation";
            if (!string.IsNullOrEmpty(keyword))
            {
                sql += " where OperationCode like '%" + keyword + "%'";
            }
            return _db.Query<Operation>(sql).ToList();
        }
        public Operation GetOperation(int id)
        {
            
            string sql = "Select * from Right_Operation where OperationId=" + id;

            return _db.FirstOrDefault<Operation>(sql);
        }
        private Operation GetOperation(string operationCode)
        {
            
            string sql = "Select * from Right_Operation where operationCode='" + operationCode + "'";

            return _db.FirstOrDefault<Operation>(sql);
        }

        public void AddPermission(RightObject obj, Operation operation)
        {

                Permission p = new Permission();
                p.ObjectId = obj.ObjectId;
                p.OperationId = operation.OperationId;
                p.Name = "" + obj.Name + "." + operation.OperationCode;
                _db.Save(p);
            
        }
        public void DeletePermission(Permission p)
        {
             _db.Delete(p);
          
        }
        public void SavePermission(int roleId, List<Model.PermissionModel> pm)
        {
            
            string sqlDelete = "delete FROM[ProjectArchive].[dbo].[Right_Permission] WHERE RoleId = " + roleId;
            _db.Execute(sqlDelete);

                foreach (var item in pm)
                {
                    foreach (var pItem in item.Operations)
                    {
                        if (pItem.IsHaveRight)
                        {
                            var saveEntity = new Permission();
                            saveEntity.ObjectId = item.Resource.ObjectId;
                            saveEntity.OperationId = pItem.OperationId;
                            saveEntity.Name = item.Resource.Name + pItem.OperationCode;
                            saveEntity.RoleId = roleId;
                            _db.Save(saveEntity);
                        }



                    }
                }
        }
        public List<User> GetPermissions(string keyword)
        {
            
            string sql = "Select * from Right_Permission";
            if (string.IsNullOrEmpty(keyword))
            {
                sql += " where name like %" + keyword + "%";
            }
            return _db.Query<User>(sql).ToList();
        }
        public Permission GetPermission(int id)
        {
            
            string sql = "Select * from Right_Permission where id=" + id;

            return _db.FirstOrDefault<Permission>(sql);
        }



    }
}
