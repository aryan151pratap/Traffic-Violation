import { useEffect, useState } from "react";
import { FaEdit, FaTimes, FaWifi } from "react-icons/fa";

const API_BACKEND = import.meta.env.VITE_BACKEND;

const Backend_url = ({ setNotification, ngrok_url, setNgrok_url }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const get_url = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BACKEND}/api/backend`);
        const result = await res.json();
        if (res.ok && result.url) {
          setNgrok_url(result.url.url);
        }
      } catch (err) {
        setNotification({ error: err.message });
      } finally {
        setLoading(false);
      }
    };

    get_url();
  }, []);

  const handle_save_url = async () => {
    try {
      if (url) {
        const res = await fetch(`${API_BACKEND}/api/save_url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url }),
        });
        if (res.ok) {
          setNgrok_url(url);
          setUrl("");
          setNotification({ status: "Successfully URL added 🥳" });
        }
      }
    } catch (err) {
      setNotification({ error: err.message });
    }
  };

  return (
    <div className="p-2 px-4 text-sm flex flex-col gap-2">
      <div className="flex flex-row items-center">
        <FaWifi className="text-green-500 mr-2" />
        <p>Add a Current Working Url</p>
      </div>
      <div className="p-1 bg-slate-100 rounded-md text-slate-700 flex flex-row gap-10 justify-between items-center">
        <div className="shrink-0 p-1 rounded-md bg-slate-300 text-slate-700">
          <p className="flex flex-row items-center gap-2">
            <FaWifi className="h-5 w-5 p-[2px] rounded-md bg-white text-green-600" />
            Backend API:
          </p>
        </div>

        {loading ? (
          <div className="items-center flex flex-row gap-2 justify-center px-2">
            <div className="w-fit h-fit p-2.5 border-3 border-t-transparent border-green-500 rounded-full animate-spin"></div>
            <p>Loading Backend url...</p>
          </div>
        ) : !edit ? (
          <div className="flex flex-row gap-2 items-center bg-slate-500 rounded-md border border-slate-500">
            <FaEdit
              className="p-1.5 w-full h-full bg-white text-green-500 rounded-md cursor-pointer"
              onClick={() => {
                setEdit(true);
                setUrl(ngrok_url);
              }}
            />
            <span className="px-2 text-white">{ngrok_url}</span>
          </div>
        ) : (
          <div className="w-full flex flex-row gap-2">
            <input
              type="text"
              value={url}
              placeholder="Enter Python Backend Ngrok Url ..."
              className="w-full bg-white rounded-md px-2 py-1 text-black outline outline-slate-400 focus:outline-slate-700"
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className="px-2 bg-red-200 rounded-md cursor-pointer"
              onClick={() => {
                setUrl("");
                setEdit(false);
              }}
            >
              <FaTimes className="text-red-500" />
            </button>
            {url && (
              <button
                className="px-2 p-1 bg-green-500 text-green-200 rounded focus:bg-green-800 cursor-pointer"
                onClick={handle_save_url}
              >
                Add
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Backend_url;
