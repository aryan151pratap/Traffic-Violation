import { useEffect, useRef, useState } from "react";

export default function Violation() {
  const [violations, setViolations] = useState([]);
  const detection = ["without helmet", "number plate", ""]

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/violation_stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.violations) {
          // append instead of replace
          setViolations(data.violations);
        }
      } catch (err) {
        console.error("Error parsing violation stream:", err);
      }
    };

    return () => eventSource.close();
  }, []);


  return (
    <div className="p-4">
      <div className="relative rounded-md overflow-hidden">
        <h2 className="sticky bg-slate-200 top-0 p-2">
          🚦 Traffic Violation Live Console
        </h2>

        <div className="h-[250px] p-2 text-sm bg-slate-50 text-slate-900 overflow-y-auto">
          {violations.length === 0 ? (
            <p className="text-gray-500">[waiting for events...]</p>
          ) : (
            violations.map((v, i) => (
              <div key={i} className="even:bg-zinc-200/70 mb-1 flex flex-row justify-between">
                <span>[{new Date(v.timestamp).toLocaleTimeString()}]</span>
                <span className="flex items-center w-28">{v.violation_type.toUpperCase()}</span>
                <span>confidence: <span className={`font-bold ${(v.accuracy * 100).toFixed(1) > 60 ? "text-green-700" : "text-red-500"}`}>{(v.accuracy * 100).toFixed(1)}%</span></span>
                <span className="text-green-600">200✅</span>
              </div>
            ))
          )}
        </div>

        <div className="bg-slate-200 sticky bottom-0 p-2 text-end">
          {violations.length > 0
            ? new Date(violations[violations.length - 1].timestamp).toLocaleString()
            : "--"}
        </div>

      </div>
      <div className="h-[250px] py-2">
        <div className="bg-slate-200 rounded-t-md p-2">
          <span></span>
          <p>Detected Images</p>
        </div>
        <div className="flex flex-wrap gap-2 p-2 border-dashed border border-slate-400 h-full overflow-auto">
          {violations.length === 0 ? (
            <p className="text-gray-500">[waiting for events...]</p>
          ) : (
            violations.map((v, i) => (
              <div key={i} className="h-fit mb-1 flex flex-wrap p-1 rounded-md border-dashed border border-slate-500">
                <img src={`data:image/jpeg;base64,${v.crop_image}`} alt="" className="w-20 h-fit rounded-md"/>
              </div>
            ))
          )}
        </div>
        <div className="bg-slate-200 rounded-b-md p-2 flex flex-row gap-2">
          <p>Total Images</p>
          <p className="text-green-600">{violations.length}</p>
        </div>
      </div>
    </div>
  );
}
