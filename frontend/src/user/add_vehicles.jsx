import { useState } from "react";
const API_BACKEND = import.meta.env.VITE_BACKEND;

const Vehicles = ({ userId, setCounter }) => {
  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    vehicleType: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_BACKEND}/user/add-vehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...vehicle,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Vehicle added successfully!");
        setVehicle({ vehicleNumber: "", vehicleType: "" });
        setCounter((e) => e+1);
      } else {
        setMessage(data.message || "Error adding vehicle");
      }
    } catch (error) {
      setMessage("Failed to connect to server");
    }
  };

  return (
    <div className="w-60 flex flex-col p-2">
      <div className="text-xs">

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
          <input
            type="text"
            name="vehicleNumber"
            value={vehicle.vehicleNumber}
            onChange={handleChange}
            placeholder="Vehicle Number (e.g. UP14AB1234)"
            required
            className="outline-none border border-blue-200 w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="vehicleType"
            value={vehicle.vehicleType}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Vehicle Type</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Truck">Truck</option>
            <option value="Bus">Bus</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            className="w-fit bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Add Vehicle
          </button>
        </form>

        {message && (
          <p className="text-center mt-3 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
