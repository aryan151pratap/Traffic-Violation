import { useEffect } from "react";
import { useState } from "react";
import { FaEdit, FaTimes, FaWifi } from "react-icons/fa";

const API_BACKEND = import.meta.env.VITE_BACKEND;

const Backend_url = function({ setNotification }){

	const [url, setUrl] = useState(null);
	const [ngrok_url, setNgrok_url] = useState('');

	useEffect(() => {
		const get_url = async function(){
			try{
				const res = await fetch(`${API_BACKEND}/api/backend`);
				const result = await res.json();
				console.log(result);
				if(res.ok){
					setUrl(result.url.url);
					// setNotification(result);
				}
			} catch(err) {
				console.warn(err.message);
				setNotification({error: err.message});
			}
		}

		get_url();

	}, [])

	const handle_save_url = async function(){
		try{
			if(ngrok_url){
				const res = await fetch(`${API_BACKEND}/api/save_url`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ url: ngrok_url }),
				})
				if(res.ok){
					setUrl(ngrok_url);
					setNgrok_url('');
					setNotification({status: 'Sucessfully url added 🥳'});
				}
			}
		} catch(err) {
			console.log(err.message);
			setNotification(err.message);
		}
	}
	return(
		<div className="p-2 px-4 text-sm flex flex-col gap-2">
			<div className="flex flex-row items-center">
				<FaWifi className="text-green-500 mr-2"/>
				<p>Add a Current Working Url</p>
			</div>
				<div className="p-1 bg-slate-100 rounded-md text-slate-700 flex flex-row gap-10 justify-between items-center">
					<div className="shrink-0 p-1 rounded-md bg-slate-300 text-slate-700">
						<p className="flex flex-row items-center gap-2">
							<FaWifi className="h-5 w-5 p-[2px] rounded-md bg-white text-green-600"/>
							Backend API:
						</p>
					</div>
					{url?.length > 0 ? 
						<div className="flex flex-row gap-2 items-center bg-slate-500 rounded-md border border-slate-500">
							<FaEdit className="p-1.5 w-full h-full bg-white text-green-500 rounded-md cursor-pointer"
								onClick={() => {
									setNgrok_url(url);
									setUrl('');
								}}
							/>
							<span className="px-2 text-white">
								{url}
							</span>
						</div>
					:
					url !== null ?
						<div className="w-full flex flex-row gap-2">
							<input type="text" value={ngrok_url} placeholder="Enter Python Backened Ngrok Url ..."
							className="w-full bg-white rounded-md px-2 py-1 text-black outline outline-slate-400 focus:outline-slate-700"
							onChange={(e) => setNgrok_url(e.target.value)}
							/>
							<button className="px-2 bg-red-200 rounded-md cursor-pointer"
								onClick={() => {
									setUrl(ngrok_url);
								}}
							>
								<FaTimes className="text-red-500"/>
							</button>
							{ngrok_url &&
								<button className="px-2 p-1 bg-green-500 text-green-200 rounded focus:bg-green-800 cursor-pointer"
									onClick={handle_save_url}
								>Add</button>
							}
						</div>
					:
						<div className="items-center flex flex-row gap-2 justify-center px-2">
							<div className="w-fit h-fit p-2.5 border-3 border-t-transparent border-green-500 rounded-full animate-spin"></div>
							<p>Loading Backend url...</p>
						</div>
					}
				</div>
				
		</div>
	)
}

export default Backend_url;