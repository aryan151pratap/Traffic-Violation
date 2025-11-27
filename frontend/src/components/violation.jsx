import { useEffect, useRef, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function Violation({result, setResult}) {
  const CHALLAN_ELIGIBLE = [
    "without_helmet",
    "mobile_usage",
    "overloaded_bike",
    "without helmet",
    "mobile usage",
    "overloaded bike"
  ];

  const [violations, setViolations] = useState([]);
  const [curr_vol, setCur_vol] = useState([]);
  const [show, setShow] = useState(false);

  const sending = useRef(false);
  const pendingData = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result]);


  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/violation_stream");
    let lastUpdate = 0;

    eventSource.onmessage = (event) => {
      const now = Date.now();
      if (now - lastUpdate > 200) {
        const data = JSON.parse(event.data);
        setViolations(data.violations);
        lastUpdate = now;
      }
    };

    return () => eventSource.close();
  }, []);

  const filter_challan_data = (violations) => {
    const numberPlates = violations.filter(v =>
      ["number_plate","number plate"].includes(v.violation_type.toLowerCase())
    );

    const challanViolations = violations.filter(v =>
      CHALLAN_ELIGIBLE.includes(v.violation_type.toLowerCase())
    );

    const vehicles = violations.filter(v =>
      !["number_plate","number plate"].includes(v.violation_type.toLowerCase())
    );

    const matched = vehicles.map(v => {
      const [vx1, vy1, vx2, vy2] = v.boxes;

      const platesInside = numberPlates.filter(np => {
        const [nx1, ny1, nx2, ny2] = np.boxes;
        return nx1 >= vx1 && ny1 >= vy1 && nx2 <= vx2 && ny2 <= vy2;
      });

      const challanInside = challanViolations.filter(np => {
        const [nx1, ny1, nx2, ny2] = np.boxes;
        return nx1 >= vx1 && ny1 >= vy1 && nx2 <= vx2 && ny2 <= vy2;
      });

      if (platesInside.length > 0 && challanInside.length > 0) {
        return {
          vehicle: v,
          number_plates: platesInside,
          challan: challanInside
        };
      }
      return null;
    }).filter(v => v !== null);

    return matched;
  };

  const sendOCR = async (payload) => {
    try {
      sending.current = true;
      const res = await fetch(`${API_BACKEND}/OCR`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
      const newResult = await res.json();
      if(res.ok){
        setResult(e => [...e, ...newResult.results]);
      }
    } finally {
      sending.current = false;
      if (pendingData.current) {
        const temp = pendingData.current;
        pendingData.current = null;
        sendOCR(temp);
      }
    }
  };

  useEffect(() => {
    const challan_data = filter_challan_data(violations);

    if (!challan_data || challan_data.length === 0) return;

    setCur_vol(challan_data);

    const payload = challan_data.map((i) => ({
      vehicle: i.vehicle.violation_type,
      evidence_image: i.vehicle.crop_image,
      no_plate: i.number_plates[0].crop_image,
      challan_type: i.challan.length > 0 ? i.challan[0].violation_type : null,
      challan_image: i.challan.length > 0 ? i.challan[0].crop_image : null
    }));

    if (sending.current) {
      pendingData.current = payload;
      return;
    }

    sendOCR(payload);
  }, [violations]);

  return (
    <div className="flex flex-col gap-20 p-2">

      <div className="h-[270px] py-2">
        <div className="bg-slate-200 flex flex-row text-sm font-semibold gap-2 rounded-t-md p-2">
          <p className={`${!show ? "bg-slate-600 text-white" : "bg-white"} px-2 p-1 border-2 border-slate-800 rounded-sm cursor-pointer`}
            onClick={() => setShow(false)}
          >Detected Images</p>
          <p className={`${show ? "bg-slate-600 text-white" : "bg-white"} px-2 p-1 border-2 border-slate-800 rounded-sm cursor-pointer`}
            onClick={() => setShow(true)}
          >OCR Data</p>
        </div>

        {!show ?
        <div className="flex flex-wrap gap-2 p-2 border-dashed border border-slate-400 h-full overflow-auto">
          {violations.length === 0 ? (
            <p className="text-gray-500">[waiting for events...]</p>
          ) : (
            violations?.map((v, i) => (
              <div key={i} className="h-fit mb-1 flex flex-col gap-1 items-center p-1 rounded-md border-dashed border border-slate-500">
                <p className="w-full px-1 text-xs border border-dashed border-slate-500 rounded-sm ">{v?.violation_type}</p>
                <img src={`data:image/jpeg;base64,${v?.crop_image}`} alt="" className="w-30 h-fit rounded-md"/>
              </div>
            ))
          )}
        </div>
        :
        <div className="flex flex-col gap-2 p-2 border-dashed border border-slate-400 h-full rounded-md overflow-y-auto">
          {curr_vol?.map((item, index) => (
            <div key={index} className="text-sm flex flex-row gap-2 mb-3">
              <div className="h-fit flex flex-col gap-1 border border-dashed border-slate-500 rounded-md p-1">
                <p className="rounded-md border border-dashed border-slate-500 px-2 text-center capitalize">{item?.vehicle?.violation_type}</p>
                <img src={`data:image/jpeg;base64,${item?.vehicle?.crop_image}`} alt="" className="w-30 h-fit object-cover rounded-md"/>
              </div>

              <div className="shrink-0 flex flex-col gap-1">
                <p className="px-1 border border-dashed border-slate-500 text-center rounded-md">Challan Violations</p>
                <div className="flex flex-row border border-dashed border-slate-500 rounded-md">
                  {item?.challan?.map((c, i) => (
                    <div key={i} className="w-full flex flex-col gap-1 items-center p-1">
                      <p className="px-1 w-full border rounded-md border-dashed border-slate-500">{c?.violation_type}</p>
                      <img src={`data:image/jpeg;base64,${c?.crop_image}`} alt="" className="rounded-md w-30 h-fit object-cover"/>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="px-1 border border-dashed border-slate-500 text-center rounded-md">Number Plate</p>
                <div className="flex flex-row border border-dashed border-slate-500 rounded-md">
                  {item?.number_plates?.map((c, i) => (
                    <div key={i} className="w-full flex flex-col gap-1 items-center p-1">
                      <p className="px-1 w-full border rounded-md border-dashed border-slate-500">{c?.violation_type}</p>
                      <img src={`data:image/jpeg;base64,${c?.crop_image}`} alt="" className="rounded-md w-30 h-fit object-cover"/>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
        }
        
        {!show ?
        <div className="text-sm bg-slate-200 rounded-b-md p-2 flex flex-row gap-2">
          <p>Total Images: </p>
          <p className="text-green-700 font-semibold">{violations?.length}</p>
        </div>
        :
        <div className="text-sm bg-slate-200 rounded-b-md p-2 flex flex-row gap-2">
          <p>Total Vehicles Challans: </p>
          <p className="text-green-700 font-semibold">{curr_vol?.length}</p>
        </div>
        }
      </div>

      <div className="rounded-md overflow-hidden">
        <h2 className="bg-slate-200 px-2 p-1">
          🚦 Traffic Violation Live Console
        </h2>

        <div ref={scrollRef} className="h-[230px] p-2 text-sm bg-slate-50 text-slate-900 overflow-y-auto">
          {result.length === 0 ? (
            <p className="text-gray-500">[waiting for events...]</p>
          ) : (
            result.map((i, index) => (
              <div key={index} className={`text-xs mb-1 flex flex-col justify-between ${i?.error ? "bg-red-200/70 text-red-800" : "even:bg-slate-200/70"}`}>
                <div className="flex flex-row gap-4 items-center">
                  <span className="ml-2">{i?.datetime}</span>
                  <p className={`${i.success ? "bg-green-300 text-green-800" : i?.duplicate ? "bg-yellow-400/80 text-yellow-800" : "bg-red-300 text-red-800 "} flex flex-row gap-1 items-center px-2 p-1 text-xs font-semibold capitalize`}>
                    {i?.error && <FaTimes/>} {i?.success ? "Success" : i?.duplicate ? "Duplicate" : "Error"}
                  </p>
                  
                  {i?.plate &&
                    <div className="flex flex-row items-center gap-1">plate number :
                      <p className={`font-semibold ${i?.error ? "bg-red-300 text-red-800" : "bg-zinc-300"} px-2 p-1 hover:underline cursor-pointer`}>{i?.plate}</p>
                    </div>
                  }
                  <p className={`text-xs flex flex-row gap-1 items-center ${i?.error && "text-red-800 font-semibold"}`}>
                    {i?.error && i?.violation &&
                      <span className="bg-red-300 px-2 p-1 hover:underline">{i?.violation}</span>
                    }
                    <span>{i?.error}</span>
                    {i?.duplicate && i?.violation &&
                      <span className="flex flex-row gap-1 items-center">
                        violation: <span className="px-2 p-1 bg-yellow-400/80 text-yellow-800 font-semibold hover:underline capitalize cursor-pointer">{i?.violation}</span>
                      </span>
                    }
                  </p>
                  
                </div>
                {i?.success && 
                <div className="w-full py-1 bg-white">
                  <div className="w-full flex flex-row gap-2 p-2 bg-green-200 border border-green-300">
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex flex-row items-center">
                        <FaCheck className="h-6 w-6 p-1 text-green-50 bg-green-500"/>
                        <p className="w-fit px-2 p-1 bg-green-100 text-green-800  border-green-400 font-semibold">Success</p>
                      </div>
                      <div className="h-fit grid grid-cols-4 gap-1 mt-auto">
                        <p className="px-2 p-1 text-zinc-100 bg-zinc-700 font-semibold">PlateNumber</p>
                        <p className="px-2 p-1 text-zinc-100 bg-zinc-700 font-semibold">User name</p>
                        <p className="px-2 p-1 text-zinc-100 bg-zinc-700 font-semibold">violation</p>
                        <p className="px-2 p-1 text-zinc-100 bg-zinc-700 font-semibold">Status</p>
                      </div>
                      <div className="h-fit grid grid-cols-4 gap-1">
                        <p className="px-2 p-1 text-green-100 bg-green-700 font-semibold hover:underline cursor-pointer">{i?.plate}</p>
                        <p className="px-2 p-1 text-green-100 bg-green-700 font-semibold hover:underline cursor-pointer">{i?.user}</p>
                        <p className="px-2 p-1 text-green-100 bg-green-700 font-semibold hover:underline cursor-pointer capitalize">{i?.challan?.violation}</p>
                        <p className={`px-2 p-1 ${i?.challan?.status == "Pending" ? "text-yellow-800 bg-yellow-400/80" : "text-green-100 bg-green-700"} font-semibold`}>{i?.challan?.status}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center border border-rose-400 ml-auto">
                      <p className="text-rose-100 font-semibold bg-rose-600 px-2 p-1">Evidence_Image</p>
                      <img src={`data:image/jpeg;base64,${i?.challan?.evidenceUrl}`} alt="" className="h-20 w-full"/>
                    </div>
                  </div>
                </div>
                }
              </div>
            ))
          )}
        </div>

        <div className="flex flex-row items-center gap-2 text-sm font-semibold bg-slate-200 sticky bottom-0 px-2 p-1 justify-end">
          <p>Last Detected Frame Time: </p>
          <p className="text-white bg-slate-700 rounded-md px-2 p-1">
            {violations.length > 0
            ? new Date(violations[violations.length - 1].timestamp).toLocaleString()
            : "--"}
          </p>
        </div>
      </div>

    </div>
  );
}
