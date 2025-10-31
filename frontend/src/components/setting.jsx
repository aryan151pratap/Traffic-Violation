import { useEffect, useState } from "react";
import Notification from "./notification";
import { FaExclamationTriangle, FaMagic, FaRobot } from "react-icons/fa";
import Backend_url from "./backend_url";
const API_BASE = import.meta.env.VITE_API_BASE;

const Setting = function({ngrok_url, setNgrok_url}){
	const [models, setModels] = useState(null);
	const [currentModel, setCurrentModel] = useState(null);
	const [notification, setNotification] = useState(null);
	const [selectModel, setSelectModel] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let ignore = false;

		const fetchModels = async () => {
			try {
				setLoading(true);
				const res = await fetch(`${API_BASE}/models`);
				const result = await res.json();
				console.log(result);
				if (res.ok && !ignore) {
					setModels(result.models);
					setCurrentModel(result.current_model);
					setSelectModel(result.current_model);
				}
			} catch (err) {
				console.error(err);
				setNotification({ error: err.message });
			} finally {
				setLoading(false);
			}
		};

		fetchModels();

		return () => {
			ignore = true;
		};
	}, []);

	const handle_change_model = async function(){
		try{
			if(currentModel !== selectModel){
				
				const res = await fetch(`${API_BASE}/change_model`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ model: selectModel }),
				});

				if(res.ok){
					setCurrentModel(selectModel);
					setNotification({status: 'Model Change Sucessfully!'})
				}
			}
		} catch (err){
			console.log(err);
			setNotification({error: err});
		}
	}

	return(
		<div className="w-full p-4 grid md:grid-cols-2 gap-10 font-semibold">

			<div className="flex flex-col gap-2">
				<p>Python Backened Url</p>
				<Backend_url setNotification={setNotification} ngrok_url={ngrok_url} setNgrok_url={setNgrok_url}/>
			</div>

			<div className="flex flex-col gap-2">
				<p className="">Model Selection setting</p>
				<div className="p-2 px-4 font-semibold text-sm flex flex-col gap-2">
					<p className="">Current working model for traffic detection</p>
					<div className="py-1 bg-slate-100 rounded-md mb-2">
						<div className="flex justify-between px-1">
							<span className="bg-slate-300 text-slate-700 rounded-md p-1 flex gap-2 items-center">
								<FaRobot className="text-slate-900 bg-slate-100 p-[2px] rounded-md h-5 w-5"/>
								Current model:
							</span>
							{!loading ?
								<span className="bg-slate-500 flex flex-row items-center text-white rounded-md">
									{currentModel ?
									<FaMagic className="text-yellow-400 bg-white w-full h-full px-2 rounded-md border border-slate-500"/>
									:
									<FaExclamationTriangle className="text-yellow-400 bg-white w-full h-full px-2 rounded-md border border-slate-500"/>
									}
									<span className="shrink-0 p-1 px-2">{currentModel ? currentModel : 'No model found 😥'}</span>
								</span>
								:
								<div className="items-center flex flex-row gap-2 justify-center px-2">
									<div className="w-fit h-fit p-2.5 border-3 border-t-transparent border-green-500 rounded-full animate-spin"></div>
									<p>Loading model...</p>
								</div>
							}
						</div>
					</div>
					<p className="">Selecting model for traffic detection</p>
					<div className="p-1 rounded-md bg-slate-100 flex flex-row items-center">
						<div className="p-1 px-2 rounded-md text-slate-700 bg-slate-300">
							<span className="flex gap-2 items-center">
								Select model:
							</span>
						</div>
						{loading ?
						<div className="items-center flex flex-row gap-2 justify-center px-2 ml-auto">
							<div className="w-fit h-fit p-2.5 border-3 border-t-transparent border-green-500 rounded-full animate-spin"></div>
							<p>Loading models...</p>
						</div>
						: models ?
						<select className="outline-none ml-auto bg-slate-500 text-white p-1 rounded-md"
							value={selectModel}
							onChange={(e) => setSelectModel(e.target.value)}
						>
							{models?.map((i, index) => (
								<option key={index} value={i}>
									{i}
								</option>
							))}
						</select>
						:
						<div className="outline-none ml-auto bg-slate-500 text-white rounded-md flex flex-row">
							<FaExclamationTriangle className="h-7 w-7 text-yellow-400 bg-white p-1 rounded-md border border-slate-500"/>
							<span className="px-2 items-center flex">no models found</span>
						</div>
						}
					</div>
					{selectModel !== currentModel &&
					<div className="ml-auto flex flex-row gap-2 border border-slate-200 p-1 rounded-md">
						<button className="bg-slate-500 focus:bg-slate-600 px-2 p-1 rounded-md text-slate-100 cursor-pointer"
						 onClick={handle_change_model}
						>
							save changes
						</button>
						<button className="bg-red-500 focus:bg-red-600 px-2 p-1 rounded-md text-red-50 cursor-pointer">
							Cancel
						</button>
					</div>
					}
				</div>
			</div>



			<Notification
			notification={notification}
			setNotification={setNotification}
			/>
		</div>
	)
}

export default Setting;