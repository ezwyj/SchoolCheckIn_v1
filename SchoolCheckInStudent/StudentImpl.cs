using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PetaPoco;
using SchoolCheckIn.CheckIn.Interface;
using SchoolCheckIn.CheckIn.Model;
using System.Data;
using System.Data.OleDb;
using System.Dynamic;

namespace SchoolCheckIn.Student
{
    public class StudentImpl : SchoolCheckIn.CheckIn.Interface.IStudent
    {
        PetaPoco.Database _db;

        void IStudent.AddClass(Class classinfo)
        {
            throw new NotImplementedException();
        }

        void IStudent.DeleteClass(Class classInfo)
        {
            throw new NotImplementedException();
        }

        void IStudent.DeleteStuent(int studentId)
        {
            throw new NotImplementedException();
        }

        dynamic IStudent.GetStudent(int id)
        {
            var entity = _db.Single<entity.StudentEntity>(id);
            var entityEx = _db.Fetch<Student.entity.StudentEx>("select * from StudentExInfo where studentId=@0", entity.Id);
            dynamic retStudent = new ExpandoObject();
            retStudent.Id = entity.Id;
            retStudent.IsHide = entity.IsHide;
            retStudent.Name = entity.Name;
            foreach(var extItem in entityEx)
            {
                (retStudent as ICollection<KeyValuePair<string, object>>).Add(new KeyValuePair<string, object>(extItem.KeyName, extItem.KeyValue));
            }

            return retStudent;
        }

        dynamic IStudent.GetStudentList(string name, string className, DateTime startClassTime, DateTime endClassTime)
        {
            string sql = "select * from StudentInfo where 1=1 ";
            if (!string.IsNullOrEmpty(name))
            {
                sql += " and name like '%" + name + "%'";
            }
            var list = _db.Fetch<entity.StudentEntity>(sql);
            List<dynamic> retList = new List<dynamic>();
            foreach (var studentItem in list)
            {
                var entityEx = _db.Fetch<Student.entity.StudentEx>("select * from StudentExInfo where studentId=@0", studentItem.Id);
                dynamic retStudent = new ExpandoObject();
                retStudent.Id = studentItem.Id;
                retStudent.IsHide = studentItem.IsHide;
                retStudent.Name = studentItem.Name;
                foreach (var extItem in entityEx)
                {
                    (retStudent as ICollection<KeyValuePair<string, object>>).Add(new KeyValuePair<string, object>(extItem.KeyName, extItem.KeyValue));
                }
                retList.Add(retStudent);
            }
            return retList;
            
           
        }

        /// <summary>
        /// 唯一需要注意的是，如果目标机器的操作系统，是64位的话。
        /// 项目需要 编译为 x86，而不是简单的使用默认的 Any CPU.
        /// </summary>
        /// <param name="strExcelFileName"></param>
        /// <returns></returns>
        private string GetOleDbConnectionString(string strExcelFileName)
        {
            // Office 2007 以及 以下版本使用.
            string strJETConnString =
              String.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};Extended Properties='Excel 8.0;HDR=Yes;IMEX=1;'", strExcelFileName);
            // xlsx 扩展名 使用.
            string strASEConnXlsxString =
              String.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0 Xml;HDR=YES;IMEX=1;\"", strExcelFileName);
            // xls 扩展名 使用.
            string strACEConnXlsString =
              String.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 8.0;HDR=YES\"", strExcelFileName);
            //其他
            string strOtherConnXlsString =
              String.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};Extended Properties='Excel 8.0;HDR=Yes;IMEX=1;'", strExcelFileName);

            //尝试使用 ACE. 假如不发生错误的话，使用 ACE 驱动.
            try
            {
                System.Data.OleDb.OleDbConnection cn = new System.Data.OleDb.OleDbConnection(strACEConnXlsString);
                cn.Open();
                cn.Close();
                // 使用 ACE
                return strACEConnXlsString;
            }
            catch (Exception)
            {
                // 启动 ACE 失败.
            }

            // 尝试使用 Jet. 假如不发生错误的话，使用 Jet 驱动.
            try
            {
                System.Data.OleDb.OleDbConnection cn = new System.Data.OleDb.OleDbConnection(strJETConnString);
                cn.Open();
                cn.Close();
                // 使用 Jet
                return strJETConnString;
            }
            catch (Exception)
            {
                // 启动 Jet 失败.
            }

            // 尝试使用 Jet. 假如不发生错误的话，使用 Jet 驱动.
            try
            {
                System.Data.OleDb.OleDbConnection cn = new System.Data.OleDb.OleDbConnection(strASEConnXlsxString);
                cn.Open();
                cn.Close();
                // 使用 Jet
                return strASEConnXlsxString;
            }
            catch (Exception)
            {
                // 启动 Jet 失败.
            }
            // 假如 ACE 与 JET 都失败了，默认使用 JET.
            return strOtherConnXlsString;
        }
        private DataSet GetExcelData(string strFilePath)
        {

            //获取连接字符串
            // @"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + filePath + ";Extended Properties=Excel 12.0;HDR=YES;";
            string strConn = GetOleDbConnectionString(strFilePath);

            DataSet ds = new DataSet();
            using (OleDbConnection conn = new OleDbConnection(strConn))
            {
                //打开连接
                conn.Open();
                System.Data.DataTable dt = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, new object[] { null, null, null, "TABLE" });

                // 取得Excel工作簿中所有工作表  
                System.Data.DataTable schemaTable = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                OleDbDataAdapter sqlada = new OleDbDataAdapter();

                foreach (DataRow dr in schemaTable.Rows)
                {
                    try
                    {
                        string strSql = "Select * From [" + dr[2].ToString().Trim() + "]";
                        if (strSql.Contains("$"))
                        {
                            OleDbCommand objCmd = new OleDbCommand(strSql, conn);
                            sqlada.SelectCommand = objCmd;
                            sqlada.Fill(ds, dr[2].ToString().Trim());
                        }
                    }
                    catch { }
                }
                //关闭连接
                conn.Close();
            }
            return ds;

        }


        string IStudent.ImportStudent(string file)
        {
            var ds = GetExcelData(file);
            int i = 0, j = 0;
            string msg = "";
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                try
                {
                    var saveStudent = new entity.StudentEntity();
                    saveStudent.Name = dr[1].ToString();
                    saveStudent.FatherTelephone = dr[2].ToString();
                    saveStudent.MotherTelephone = dr[3].ToString();
                    _db.Save(saveStudent);
                    i++;
                }
                catch (Exception e)
                {
                    j++;
                }

            }
            return string.Format("成功导入数据{0}条,失败{1}条", i, j);
        }

        void IStudent.SaveStudent(CheckIn.Model.Student student)
        {
            var entity = new entity.StudentEntity();
            entity.Id = student.Id;
            entity.IsHide = student.IsHide;
            entity.Name = student.Name;
            if (student.Id == 0)
            {
                //更新人脸识别库
                //if(student.)
            }

        }

        void IStudent.Student(Database db)
        {
            _db = db;
        }

        void IStudent.AddClass(List<Class> classInfoes)
        {
            throw new NotImplementedException();
        }
    }
}
