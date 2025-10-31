import React from "react";
import { Link, useNavigate } from "react-router-dom";
const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function UserProfile({ user }) {
	
	const navigate = useNavigate();

	
	const handle_delete_account = async function(){
		try{
			const email = localStorage.getItem("email");
			const res = await fetch(`${API_BACKEND}/auth/delete_account/${email}`,{
				method: 'GET'
			});
			if(res.ok){
				localStorage.setItem("email", '');
				localStorage.setItem("userId", '');
				navigate('/');
			}
		} catch(err){
			console.log(err.message);
		}
	}

	const handle_logout = function(){
		localStorage.setItem("email", '');
		localStorage.setItem("userId", '');
		navigate('/');
	}


	return (
		<div className="max-w-2xl mx-auto p-6">
			{/* Profile Header */}
			<div className="bg-white shadow-lg rounded-2xl overflow-hidden">
				<div className="flex items-center p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
					<img
						src={user.profile_img}
						alt="Profile"
						className="w-20 h-20 rounded-full border-4 border-white shadow-md"
					/>
					<div className="ml-4 text-white">
						<h2 className="text-2xl font-semibold">
							{user.firstName} {user.lastName}
						</h2>
						<p className="text-sm">{user.email}</p>
						<p className="text-xs opacity-80">User ID: {user._id}</p>
					</div>
				</div>

				{/* User Info */}
				<div className="p-6 grid grid-cols-2 gap-4 text-gray-700">
					<div>
						<p className="text-sm font-medium text-gray-500">First Name</p>
						<p className="text-base">{user.firstName}</p>
					</div>

					<div>
						<p className="text-sm font-medium text-gray-500">Last Name</p>
						<p className="text-base">{user.lastName}</p>
					</div>

					<div>
						<p className="text-sm font-medium text-gray-500">Email</p>
						<p className="text-base">{user.email}</p>
					</div>

					<div>
						<p className="text-sm font-medium text-gray-500">Contact</p>
						<p className="text-base">{user.contact}</p>
					</div>

					<div>
						<p className="text-sm font-medium text-gray-500">Address</p>
						<p className="text-base">{user.address}</p>
					</div>

					<div>
						<p className="text-sm font-medium text-gray-500">OTP</p>
						<p className="text-base">{user.otp}</p>
					</div>

					<div>
						<p className="text-sm font-medium text-gray-500">OTP Expiry</p>
						<p className="text-base">{user.otpExpiry ?? "Not Set"}</p>
					</div>

					<div>
						<p className="text-sm font-medium text-gray-500">Agree To Terms</p>
						<p className="text-base">
						{user.agreeToTerms ? "✅ Yes" : "❌ No"}
						</p>
					</div>

					<div>
						<p className="text-sm font-medium text-gray-500">Created At</p>
						<p className="text-base">
						{new Date(user.createdAt).toLocaleString()}
						</p>
					</div>

					<div>
						<p className="text-sm font-medium text-gray-500">Updated At</p>
						<p className="text-base">
						{new Date(user.updatedAt).toLocaleString()}
						</p>
					</div>
				</div>

				{/* Vehicles */}
				<div className="px-6 pb-6">
					<p className="text-sm font-medium text-gray-500">Vehicles</p>
					{user.vehicles.length > 0 ? (
						<ul className="list-disc ml-6 text-gray-700">
							{user.vehicles.map((v, i) => (
								<li key={i}>{v}</li>
							))}
						</ul>
					) : (
						<p className="text-gray-600">No vehicles registered</p>
					)}
				</div>

				<div className="p-2 flex flex-row justify-between">
					<button className="bg-red-500 text-white p-2 rounded-md focus:bg-red-600"
						onClick={handle_delete_account}
					>
						Delete Account
					</button>
					<button className="p-2 bg-orange-500 rounded-md text-white focus:bg-orange-600"
						onClick={handle_logout}
					>
						Logout
					</button>
					<Link to="*">
						<button className="bg-green-500 text-white p-2 rounded-md focus:bg-green-600">
							Back
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
