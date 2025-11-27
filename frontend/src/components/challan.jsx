import { useEffect, useState } from "react";
import { FaRupeeSign, FaTrash } from "react-icons/fa";
const API_BACKEND = import.meta.env.VITE_BACKEND;

const Challan = function({setLoading}){
	const [users, setUsers] = useState([]);
	const [input, setInput] = useState("");
	const [currentUser, setCurrentUser] = useState([]);
	useEffect(() => {
		const getUser = async function(){
			try{
				setLoading(true);
				const res = await fetch(`${API_BACKEND}/user`,{
					method: "GET"
				})
				const result = await res.json();
				if(res.ok){
					setUsers(result.user);
				}
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		}
		getUser();
	},[])

	const handleUser = async function(id, i){
		const res = await fetch(`${API_BACKEND}/challan/${id}`);
		const result = await res.json();
		if(res.ok){
			setCurrentUser({ ...i, vehicles: result.user.vehicles});
		}
	}

	const handleDelete = async function(userId, challanId){
		try{
			setLoading(true);
			const res = await fetch(`${API_BACKEND}/delete-challan/${userId}/${challanId}`);
			const result = await res.json();
			if(res.ok){
				setCurrentUser(prev => ({
					...prev,
					vehicles: prev.vehicles.map(v => ({
					...v,
					challans: v.challans.filter(c => String(c._id) !== challanId)
					}))
				}));
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	}

	return(
		<div className="p-2">
			<div className="px-2 font-semibold hover:underline">
				<p>Challan Management</p>
			</div>
			<div className="bg-slate-50 p-2 flex flex-row gap-2 items-center justify-center text-sm">
				<p className="font-semibold">Search User</p>
				<input type="text" 
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="px-2 p-1 border-2 border-slate-300 focus:border-slate-600 rounded-md"/>
			</div>

			<div className="flex flex-col gap-1">
				{users?.map((i,index) => (
					<div key={index} className="p-1 flex flex-col gap-1 justify-center odd:bg-slate-200 text-sm">
						<div className="flex flex-row gap-1 items-center">
							<div className="">
								{i?.profile_img ?
								<img src={i?.profile_img} alt="" className="h-10 w-10 object-cover rounded"/>
								:
								<div className="h-10 w-10 flex items-center justify-center text-slate-500 bg-white rounded">No</div>
								}
							</div>
							<p className="flex flex-col hover:underline cursor-pointer font-semibold"
								onClick={() => handleUser(i?._id, i)}
							>
								<span>{i?.name}</span>
								<span className="text-xs text-zinc-500">{i?.email}</span>
							</p>
						</div>
						
						<div className="bg-white rounded bg-zinc-100 border border-zinc-300">
							{currentUser && currentUser?.email == i.email &&
								<div className="p-2">
									{console.log(currentUser)}
									<div className="grid grid-cols-4 gap-4">
										<p className="flex flex-col items-center gap-1">
											<span className="underline">Name</span>
											<span>{currentUser?.name}</span>
										</p>
										<p className="flex flex-col items-center gap-1">
											<span className="underline">E-mail</span>
											<span>{currentUser?.email}</span>
										</p>
										<p className="flex flex-col items-center gap-1">
											<span className="underline">Contact</span>
											<span>{currentUser?.contact}</span>
										</p>
										<p className="flex flex-col items-center gap-1">
											<span className="underline">LicenseNumber</span>
											<span>{currentUser?.licenseNumber}</span>
										</p>
									</div>

									{currentUser?.vehicles.length > 0 ?
									<div className="border border-slate-200 flex flex-col gap-1">
										<div className="px-2 p-1 font-semibold capitalize bg-slate-200 grid grid-cols-4 gap-4 underline">
											<p className="flex flex-col gap-1">ID</p>
											<p className="flex flex-col gap-1">vehicleType</p>
											<p className="flex flex-col gap-1">vehicleNumber</p>
											<p className="flex flex-col gap-1">challans</p>
										</div>
										{currentUser?.vehicles?.map((v, index1) => (
											<div key={index1} className="border border-slate-300">
												<div className="px-2 p-1 grid grid-cols-4 gap-4 items-center bg-slate-300">
													<p className="flex flex-col gap-1 hover:underline cursor-pointer">
														<span className="line-clamp-1">{v?._id}</span>
													</p>
													<p className="bg-zinc-200 px-2 flex flex-col gap-1">
														<span>{v?.vehicleType}</span>
													</p>
													<p className="flex flex-col gap-1">
														<span className="bg-zinc-200 px-2">{v?.vehicleNumber}</span>
													</p>
													<p className="flex flex-col gap-1">
														<span>{v?.challans?.length}</span>
													</p>
												</div>
												{v?.challans?.length > 0 ?
												<div className="">
													<div className="grid grid-cols-5 gap-4 underline bg-zinc-200 px-2 p-1">
														<p className="flex flex-col gap-1">challanId</p>
														<p className="flex flex-col gap-1">violation</p>
														<p className="flex flex-col gap-1">fineAmount</p>
														<p className="flex flex-col gap-1">status</p>
													</div>
													
													{v?.challans?.map((c, index2) => (
														<div key={index2} className={`p-2 ${c?.status == "Pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>
															<div className="grid grid-cols-5 gap-4 items-center">
																<p className="flex flex-col gap-1 hover:underline cursor-pointer">
																	<span className="line-clamp-1 font-semibold">{c?.challanId}</span>
																</p>
																<p className="flex flex-col capitalize font-semibold gap-1">
																	<span>{c?.violation}</span>
																</p>
																<p className="flex flex-row items-center font-semibold gap-1">
																	<FaRupeeSign/>
																	{c?.fineAmount}
																</p>
																<p className={`flex flex-col gap-1 font-semibold ${c?.status == "Pending" ? "bg-yellow-100 px-2 p-1" : "bg-green-100 px-2 p-1"}`}>
																	<span>{c?.status}</span>
																</p>
																<p className={`flex flex-col gap-1 font-semibold items-center cursor-pointer bg-red-200 text-red-500 px-2 p-1`}
																	onClick={() => handleDelete(currentUser?._id, c?._id)}
																>
																	<FaTrash className="hover:text-red-900"/>
																</p>
															</div>
														</div>
													))}
												</div>
												:
												<div className="p-2 flex justify-center">No challans . . .</div>
												}
											</div>
										))}
										
									</div>
									:
									<div className="mt-2 border border-slate-200 p-2 flex items-center justify-center">No Vehicles . . .</div>
									}
								</div>
							}
						</div>
					</div>
				))}
			</div>
			
		</div>
	)
}

export default Challan;