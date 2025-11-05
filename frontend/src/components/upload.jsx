import { useEffect, useState } from "react";
import { startStream, stopStream } from "../middleware/api";
import Notification from "./notification";
import Side_Bar from "../tags/side_bar";
import { FaEllipsisH, FaEllipsisV, FaTimes } from "react-icons/fa";
import Violation from "./violation";
import Page from "./page_1";

function Upload({ngrok_url, send, setSend}) {
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mode, setMode] = useState("video");
  const [videoUrl, setVideoUrl] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      console.log("Selected video:", file.name);
    } else {
      alert("Please upload a valid video file");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid image file");
    }
  };

  const handlesend_video = async () => {
    try {
      setSend(null);
      if (!videoFile) return;

      console.log("Sending video:", videoFile.name);
      const result = await startStream(ngrok_url, videoFile);
      setNotification(result.result);
      setSend("video");

    } catch (err) {
      console.error(err);
      setNotification({ error: err.message });
    }
  };

  const handleCancel = async () => {
    try {
      const result = await stopStream(ngrok_url);
      setNotification(result.result);
      setVideoUrl(null);
      setSend(null);
    } catch (err) {
      console.error(err);
      setNotification({ error: err.message });
    }
  };

  useEffect(() => {
    setVideoUrl(`${ngrok_url}/video?t=${Date.now()}`);
    if(!send){
      setVideoUrl(null);
    }
  }, [send]);

  useEffect(() => {
    if(!send) return;
    setSend(mode);
    setVideoUrl(null);
  }, [mode]);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row overflow-auto">
      <Side_Bar mode={mode} setMode={setMode}/>

      <div className="w-full h-full flex grid grid-cols-1 md:grid-cols-2 overflow-auto">
        <div className="grid h-full w-full flex flex-col md:overflow-auto">

          <div className="flex flex-col">
            <div className="w-full">
              {mode === "video" && (
              <div className="w-full p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Upload Video</label>
                  {videoFile &&
                  <button className="h-8 w-8 flex justify-center items-center bg-red-400 rounded-sm cursor-pointer text-red-900"
                    onClick={() => setVideoFile(null)}
                  >
                    <FaTimes/>
                  </button>
                  }
                </div>

                {videoFile ?
                  <div className="relative flex flex-row h-64 p-2 border-2 border-dashed border-slate-200 rounded overflow-hidden">
                    <video
                      src={URL.createObjectURL(videoFile)}
                      controls
                      className="rounded h-full w-1/2 object-cover"
                    />
                    <div className="ml-2 rounded-md bg-slate-200/50 w-full p-2 font-semibold">
                      <div className="w-full text-sm flex flex-col gap-2">
                        <span className="font-bold">Video name</span>
                        <span className="px-2 p-1 rounded bg-white text-slate-600">{videoFile.name}</span>
                        <span><span className="font-bold">Type:</span> {videoFile.type}</span>
                        <span><span className="font-bold">Size:</span> {formatSize(videoFile.size)}</span>
                        <span><span className="font-bold">Date:</span> {new Date(videoFile.lastModifiedDate).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  :
                  <Media handleMedia={handleVideoChange} accept="video/*"/>
                }
              </div>
              )}

              {mode === "image" && (
              <div className="w-full bg-white rounded p-4 flex flex-col gap-4">
                <label className="font-medium">Upload Image</label>
                {imageFile ?
                  <img
                  src={imageFile}
                  alt="Uploaded"
                  className="w-full max-h-[400px] object-contain border rounded"
                  />
                  :
                  <Media handleMedia={handleImageChange} accept="image/*" />
                }
              </div>
              )}

              {mode === "live" &&
              <Page ngrok_url={ngrok_url}/>
              }
            </div>

            {(videoFile || imageFile) && (mode !== "live") && (
              <div className="h-fit px-4 flex gap-1 md:flex-row justify-end text-sm">
                <button
                  className="px-2 p-1 bg-green-500 text-white"
                  onClick={handlesend_video}
                >
                  Send {mode}
                </button>
                <button
                  className="px-2 p-1 bg-red-500 text-white hover:bg-red-700 cursor-pointer"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {videoUrl && (
            <div className="p-4 w-full">
              <img
                src={videoUrl}
                alt="Live Stream"
                className="w-full border border-zinc-400 rounded"
              />
            </div>
          )}

        </div>
        <div className="md:overflow-auto">
          <Violation/>
        </div>
      </div>

      <Notification
        notification={notification}
        setNotification={setNotification}
      />
    </div>
  );
}

export function Media({ handleMedia, accept }) {
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supports {accept.split('/')[0]}
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleMedia}
        />
      </label>
    </div>
  );
}

export default Upload;
