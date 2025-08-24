import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./user_details";
import Notification from "../components/notification";
import UserProfile from "./profile";
const API_BACKEND = import.meta.env.VITE_BACKEND;

const Dashboard = function(){

	const email = localStorage.getItem('email');
	const userId = localStorage.getItem('userId');
	const [details, setDetails] = useState(null);
	const navigate = useNavigate();
	const [notification, setNotification] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const check_user = async function(){
			try{
				setLoading(true);
				if(email && userId){
					console.log(email, userId);
					const res = await fetch(`${API_BACKEND}/user/details`, {
						method: 'POST',
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({email}), 
					}) 
					const result = await res.json();
					console.log(result);
					if(res.ok){
						setDetails(result);
					}
					
				} else {
					navigate('/');
				}
			} catch(err) {
				console.log(err.message);
				navigate("/");
			} finally {
				setLoading(false);
			}
		}
	
		check_user();
	}, [email, userId]);

	
	return(
		<div>
			{loading ?
			<div className="w-full items-center h-screen flex flex-col gap-2 justify-center">
				<div className="p-5 border-3 border-t-transparent border-b-transparent w-fit rounded-full animate-spin"></div>
				<div>
					Loading Details...
				</div>
			</div>	
			: !details?.agreeToTerms ?
				<div>
					<UserForm setNotification={setNotification} setDetails={setDetails}/>
				</div>
			:
				<div>
					<UserProfile user={details}/>
				</div>
			}

			<Notification
				notification={notification}
				setNotification={setNotification}
			/>

		</div>
	)
}

export default Dashboard;