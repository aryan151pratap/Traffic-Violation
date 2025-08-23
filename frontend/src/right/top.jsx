function Top({activeFeature}){
	return(
		<div className="w-full p-2 border-b border-gray-300">
			<div className="flex flex-row gap-2 items-center">
				<span className="text-white bg-blue-500 p-2 rounded">
					{activeFeature?.icon}
				</span>
				<p>{activeFeature?.name}</p>
			</div>
		</div>
	)
}

export default Top;