import { FaFile, FaImage, FaImages, FaVideo } from "react-icons/fa";

const Side_Bar = function({mode, setMode}){
	return(
		<div className="text-sm md:h-full sticky top-0 p-2 px-4 bg-slate-50 justify-center md:justify-start flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-gray-200">
			<div className="hidden md:flex font-semibold text-slate-700 uppercase">
				<p>Media</p>
			</div>
			<div className="flex font-semibold flex-row md:flex-col gap-1">
				<label
				className={`cursor-pointer items-center p-3 md:px-2 md:p-1 rounded-md flex gap-3 ${
					mode === "video"
					? "md:border-0 border border-indigo-500 text-indigo-500"
					: "text-slate-700 hover:bg-slate-200/80"
				} `}
				>
					<input
						type="radio"
						name="mode"
						className="hidden"
						checked={mode === "video"}
						onChange={() => setMode("video")}
					/>
					<FaVideo />
					<p className="hidden md:flex">Video</p>
				</label>

				<label
				className={`cursor-pointer items-center p-3 md:px-2 md:p-1 rounded-md flex gap-3 ${
					mode === "image"
					? "md:border-0 sm:border border-indigo-500 text-indigo-500"
					: "text-slate-700 hover:bg-slate-200/80"
				} `}
				>
					<input
						type="radio"
						name="mode"
						className="hidden"
						checked={mode === "image"}
						onChange={() => setMode("image")}
					/>
					<FaImages />
					<p className="hidden md:flex">Image</p>
				</label>
			</div>

		</div>
	)
}

export default Side_Bar;