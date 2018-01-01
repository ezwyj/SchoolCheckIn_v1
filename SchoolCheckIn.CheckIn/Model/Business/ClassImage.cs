using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SchoolCheckIn.CheckIn.Model
{
    public class ClassImage
    {
        public Class ClassInfo { get; set; }

        private List<Bitmap> _images = new List<Bitmap>();
        
        public List<Bitmap> Image
        {
            get { return _images; }
            set { _images = value;  }
        } 
    }
}
