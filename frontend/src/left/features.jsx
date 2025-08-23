import { useState } from "react";
import { FaBars, FaTimes, FaVideo, FaFileUpload, FaCarCrash, FaCogs, FaChartLine } from "react-icons/fa";

function Features({activeFeature, setActiveFeature}) {
  const [open, setOpen] = useState(false);

  const features = [
    { name: "Live Streaming", icon: <FaVideo /> },
    { name: "Upload File", icon: <FaFileUpload /> },
    { name: "Challan Management", icon: <FaCarCrash /> },
    { name: "Analytics", icon: <FaChartLine /> },
    { name: "Settings", icon: <FaCogs /> },
  ];

  return (
    <div
      className={`h-full bg-gradient-to-b
        from-slate-900 from-20% 
        via-slate-800 via-70% 
        to-blue-700 to-140% 
        transition-all duration-300 ease-in-out ${
        open ? "w-56" : "w-fit"
      } flex flex-col`}
    >
      <div className="p-2 border-gray-700 flex justify-between items-center">
        {open && <span className="text-white font-bold text-lg">Features</span>}
        <button 
          onClick={() => setOpen(!open)}
          className={`${open ? "w-fit" : "w-full"} text-lg flex justify-center p-2 rounded hover:bg-gray-700 transition-colors cursor-pointer`}
          aria-label={open ? "Collapse menu" : "Expand menu"}
        >
          {open ? (
            <FaTimes className="text-white" />
          ) : (
            <FaBars className="text-white" />
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col mt-4 px-2 space-y-1 overflow-y-auto">
        {features.map((f, idx) => (
          <button
            key={idx}
            onClick={() => setActiveFeature(f)}
            className={`flex items-center gap-3 p-2 rounded-sm transition-all ${
              activeFeature?.name === f.name 
                ? "bg-blue-700/70 text-white shadow-md" 
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span className="p-1 text-md min-w-[24px] flex justify-center">
              {f.icon}
            </span>
            {open && (
              <span className="text-sm font-medium whitespace-nowrap">
                {f.name}
              </span>
            )}
          </button>
        ))}
      </div>

      {!open && (
        <div className="absolute left-20 ml-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2">
          {features.map((f, idx) => (
            <div key={idx} className="py-1 px-2 hover:bg-gray-800 rounded">
              {f.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Features;