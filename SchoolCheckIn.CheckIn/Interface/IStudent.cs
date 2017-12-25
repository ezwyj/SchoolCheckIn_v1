﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolCheckIn.CheckIn.Model;

namespace SchoolCheckIn.CheckIn.Interface
{
    interface IStudent
    {
        void ImportStudent(string file);
        void DeleteStuent(Student student);
        void SaveStudent(Student student);
        Student GetStudent(int id);
        List<Student> GetStudentList(string name,string className);


    }
}