import gif from "./assets/pss-gif.gif";
import frog from "./assets/frog.webp";
import monster from "./assets/monster.webp";
import rabbit from "./assets/rabbit.gif";



const Loading  = function(){
	return(
		<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs p-2 flex items-center justify-center">
			<div className="flex flex-col items-center text-white font-semibold">
				<img 
				src={monster} alt="" className="h-40 w-40 object-cover rounded-md"/>
				<p>Loading ...</p>
			</div>
		</div>
	)
}

export default Loading;