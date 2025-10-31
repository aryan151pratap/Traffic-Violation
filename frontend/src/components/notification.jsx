import { useEffect, useState } from "react";
import { FaCheck, FaExclamationCircle, FaTimes } from "react-icons/fa";

export default function Notification({ notification, setNotification }) {
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (notification) {
      setProgress(100);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.max(0, prev - 1));
      }, 40);

	  const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [notification, setNotification]);

  if (!notification) return null;


  return (
    <div className="fixed min-w-60 top-0 right-0 p-2 transition-all duration-300 z-50 animate-fadeIn">
      <div className={`w-full rounded-l-md shadow-lg bg-slate-200 overflow-hidden border-l-4 ${notification?.error ? 'bg-red-600 border-red-600' : 'bg-green-500 border-green-600'}`}>
        
        <div className={`p-2 items-center bg-white`}>
          <div className="flex gap-4 items-center justify-between">
            {notification?.error ?
              <FaExclamationCircle className="ml-1 text-red-50 bg-red-500 h-7 w-7 p-1.5 rounded-full"/>
              :
              <FaCheck className="ml-1 text-green-500 bg-green-200 h-7 w-7 p-1.5 rounded-full"/>
            }
            <span className={`font-semibold ${notification?.error ? "text-red-600" : "text-green-600"}`}>
              {notification?.error ? notification.error : notification.status}
            </span>

            <FaTimes className={`h-8 w-8 p-2.5 text-slate-200 rounded-md ${notification?.error ? 'hover:bg-red-600' : 'hover:bg-green-600'} cursor-pointer`}
              onClick={() => setNotification(null)}
            />
          </div>

         <div className="text-white">
           {notification?.source && (
            <div className="p-2 flex justify-between text-sm">
              <span className="">Source:</span>
              <span className="font-medium">{notification.source}</span>
            </div>
            )}
         </div>

        </div>
        <div className={`h-0.5 ${notification?.error ? 'bg-red-400' : 'bg-green-400'} bg-white`}>
          <div 
            className={`h-full  ${notification?.error ? 'bg-red-400' : 'bg-green-600'} transition-all duration-40 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}