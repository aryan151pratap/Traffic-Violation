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
      <div className="w-full flex flex-col gap-2 items-center">
        <h2 className="">Controlled Live Object Detection</h2>

        {/* Buttons */}
        <div className="flex flex-row gap-2">
          <button
            onClick={() => handleStart(null)}
            disabled={streaming}
            className={`border p-1 px-2 rounded ${
              !streaming ? "border" : "border-dashed cursor-not-allowed"
            }`}
          >
            Start
          </button>
          <button
            onClick={handleStop}
            // disabled={!streaming}
            className={`border p-1 px-2 rounded 
            `}
          >
            Stop
          </button>
        </div>

        {/* Video Stream */}
        {streaming && (
          <div className="border border-gray-300 rounded mt-4">
            
            <div className="p-4">
              <img
                src={videoUrl}
                alt="Live Stream"
                className="w-[640px] border border-zinc-400 rounded"
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
