import React, { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
const API_BACKEND = import.meta.env.VITE_BACKEND;
import { useNavigate } from 'react-router-dom';

const OTP = ({ setOtpStep }) => {
  const [otp, setOtp] = useState("");
  const [otp_status, setOtp_status] = useState(null);
  const navigate = useNavigate();

  const handle_send_otp = async function(){
	try{
		const res = await fetch(`${API_BACKEND}/auth/send_otp`, {
        	method: 'POST',
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify({otp})
		});

		const result = await res.json();

		if(res.ok){
			setOtp_status(result.status);
			localStorage.setItem("email", result.email);
			localStorage.setItem("userId", result.userId);
			navigate(`/dashboard`);
		}
    } catch (err){
      console.log(err.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
	handle_send_otp();
  };

  return (
	<div>
		<div className="h-full w-full p-6 flex items-center justify-center bg-gray-100 rounded-xl">
			<div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
				{!otp_status && 
				<h2 className="text-xl font-bold text-center text-gray-800 mb-4">
					Verify OTP
				</h2>
				}
				{!otp_status ?
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						maxLength={6}
						placeholder="Enter 6-digit OTP"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						className="outline-none w-full px-4 py-2 border border-gray-300 rounded-md text-center tracking-widest text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>

					<button
						type="submit"
						className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					>
						Verify
					</button>
				</form>
				:
				<div>
					<div className="shrink-0 w-full items-center flex gap-4 justify-center p-2 text-sm bg-blue-500 text-white rounded">
						<FaCheck className="shrink-0 h-7 w-7 p-1 rounded-full text-green-400"/>
						<span className="shrink-0">{otp_status}</span>
						{/* <FaTimes className="shrink-0 h-7 w-7 p-2 bg-blue-400 rounded hover:bg-blue-600 cursor-pointer"/> */}
					</div>
				</div>
				}
			</div>
		</div>
		
	</div>
  );
};

export default OTP;
