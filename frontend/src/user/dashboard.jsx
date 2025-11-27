import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./user_details";
import Notification from "../components/notification";
import UserProfile from "./profile";
import Vehicles from "./add_vehicles";
const API_BACKEND = import.meta.env.VITE_BACKEND;

const Dashboard = function({setFullLoading}){

	const email = localStorage.getItem('email');
	const userId = localStorage.getItem('userId');
	const [details, setDetails] = useState(null);
	const navigate = useNavigate();
	const [notification, setNotification] = useState(null);
	const [counter, setCounter] = useState(0);


	useEffect(() => {
		const check_user = async function(){
			try{
				setFullLoading(true);
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
					}else{
						navigate('/');
						localStorage.removeItem('email');
						localStorage.removeItem('userId');
					}
					
				} else {
					navigate('/');
				}
			} catch(err) {
				console.log(err.message);
				navigate("/");
			} finally {
				setFullLoading(false);
			}
		}
	
		check_user();
	}, [email, userId, counter]);

	
	return(
		<div>
			
			{!details?.agreeToTerms ?
				<div>
					<UserForm setNotification={setNotification} setDetails={setDetails}/>
				</div>
			:
				<div>
					<UserProfile user={details} setCounter={setCounter}/>
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