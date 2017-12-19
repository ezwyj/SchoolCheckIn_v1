using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unity.Interception.InterceptionBehaviors;
using Unity.Interception.PolicyInjection.Pipeline;

namespace SchoolCheckIn.Common
{
    public class ExceptionLoggingBehavior : IInterceptionBehavior
    {
        private static ILog Logger = log4net.LogManager.GetLogger("AppError");
        public IEnumerable<Type> GetRequiredInterfaces()
        {
            return Type.EmptyTypes;
        }

        public IMethodReturn Invoke(IMethodInvocation input, GetNextInterceptionBehaviorDelegate getNext)
        {
            log4net.Config.XmlConfigurator.Configure();
            var methodReturn = getNext().Invoke(input, getNext);
            if (methodReturn.Exception != null)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("调用方法：" + input.MethodBase.Name.ToString() + "\r\n");
                sb.Append("调用参数：");
                for (int i = 0; i < input.Arguments.Count; i++)
                {
                    if (input.Arguments[i] != null)
                    {
                        string x = input.Arguments[i].GetType().ToString();
                        Console.WriteLine("参数:");
                        sb.Append(string.Format("{0}: {1}\r\n", input.Arguments.ParameterName(i), input.Arguments[i]));
                    }
                }
                sb.Append(methodReturn.Exception.StackTrace + "\r\n");
                sb.Append("---------------------------------------------------------------\r\n");
                Logger.Error(sb.ToString());
            }

            return methodReturn;
        }

        public bool WillExecute
        {
            get { return true; }
        }
    }
}
}
