import React, { useState, useEffect } from "react";
import { startStream, stopStream } from "../middleware/api";
import Notification from "./notification";

export default function Page({ngrok_url}) {
  const [streaming, setStreaming] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [notification, setNotification] = useState(null);

  const handleStart = async (file = null) => {
    try {
		const result = await startStream(ngrok_url, file);
      if(result.ok){
        setNotification(result.result);
      }
		setStreaming(true);
    } catch (err) {
      console.error(err);
      setNotification({error: err});
      alert("Could not start stream.");
    }
  };

  const handleStop = async () => {
    try {
      const result = await stopStream(ngrok_url);
      if(result.ok){
        setNotification(result.result);
      }
      setStreaming(false);
      setVideoUrl("");
    } catch (err) {
      console.error(err);
	    setNotification({error: err});
      alert("Could not stop stream.");
    }
  };

  useEffect(() => {
    if (streaming) {
      // Add timestamp to avoid browser caching
      setVideoUrl(`${ngrok_url}/video?t=${Date.now()}`);
    }
  }, [streaming]);

  return (
    <div className="h-full w-full p-4">
      <div className="w-full flex flex-col gap-2">
        <h2 className="font-semibold">Controlled Live Object Detection</h2>

      <div className="p-1">
        <div className="flex flex-row gap-2">
          <button
            onClick={() => handleStart(null)}
            disabled={streaming}
            className={`bg-green-300 hover:bg-green-500 cursor-pointer p-1 px-2 ${
              !streaming ? "" : "bg-green-500 cursor-not-allowed"
            }`}
          >
            Start
          </button>
          <button
            onClick={handleStop}
            // disabled={!streaming}
            className={`p-1 px-2 bg-red-300 hover:bg-red-500 cursor-pointer
            `}
          >
            Stop
          </button>
        </div>
      </div>

        {/* Video Stream */}
        {streaming && (
          <div className="border border-gray-300 rounded mt-1">
            
            <div className="p-2 bg-black">
              <img
                src={videoUrl}
                alt="Live Stream"
                className="w-[640px]"
              />
            </div>
          </div>
        )}
      </div>

	  <Notification
      notification={notification}
      setNotification={setNotification}
    />
    </div>
  );
}
