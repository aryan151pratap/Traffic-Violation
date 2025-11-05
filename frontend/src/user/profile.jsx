import React from "react";
import { useNavigate } from "react-router-dom";
import Vehicles from "./add_vehicles";
import { useState } from "react";

const API_BACKEND = import.meta.env.VITE_BACKEND;
const API_USER_DASHBOARD = import.meta.env.VITE_USER_DASHBOARD;

export default function UserProfile({ user, setCounter }) {
  const navigate = useNavigate();
  const [addVehicles, setAddVehicles] = useState(false);

  const handle_delete_account = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await fetch(`${API_BACKEND}/auth/delete_account/${email}`, {
        method: "GET",
      });
      if (res.ok) {
        localStorage.setItem("email", "");
        localStorage.setItem("userId", "");
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handle_logout = () => {
    localStorage.setItem("email", "");
    localStorage.setItem("userId", "");
    navigate("/");
  };

  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      <div className="sticky inset-0 p-2 bg-white shadow-lg">
        <div className="font-semibold">
          Traffic Violation 
        </div>
      </div>
      <div className="w-full shadow-lg p-6">
        {!user ? (
          <p className="text-center text-gray-600">Loading user data...</p>
        ) : (
          <div>
            <div className="flex sm:flex-col flex-row gap-2 justify-between items-center text-center">
              {user.profile_img ? (
                <img
                  src={user.profile_img}
                  alt="Profile"
                  className="sm:order-1 order-2 sm:w-32 sm:h-32 h-20 w-20 sm:rounded-full rounded-md border-4 border-blue-500 object-cover mb-3"
                />
              ) : (
                <div className="text-sm sm:order-1 order-2 sm:w-32 sm:h-32 h-20 w-20 sm:rounded-full rounded-md bg-gray-200 flex items-center justify-center text-gray-500 mb-3">
                  No Image
                </div>
              )}
              <div className="sm:order-2 order-1 flex flex-col items-start">
                <h3 className="text-xl font-semibold text-gray-700">
                  {user.name}
                </h3>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-gray-700">
              <p><strong>Contact:</strong> {user.contact}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p><strong>License Number:</strong> {user.licenseNumber}</p>
              <p><strong>Agree To Terms:</strong> {user.agreeToTerms ? "Yes" : "No"}</p>
              <p><strong>OTP:</strong> {user.otp || "N/A"}</p>
              <p><strong>OTP Expiry:</strong> {user.otpExpiry ? new Date(user.otpExpiry).toLocaleString() : "N/A"}</p>
              <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
            </div>

            <div>
              <div className="py-2 text-sm font-semibold">
                <p>For more details or Challans. <a href={`${API_USER_DASHBOARD}/${user.email}`} target="_blank" className="text-blue-700 hover:underline">Click here</a></p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Vehicles</h3>
              {user.vehicles && user.vehicles.length > 0 ? (
                user.vehicles.map((v, i) => (
                  <div
                    key={i}
                    className="border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50"
                  >
                    <p><strong>Vehicle Number:</strong> {v.vehicleNumber}</p>
                    <p><strong>Vehicle Type:</strong> {v.vehicleType}</p>

                    {v.challans && v.challans.length > 0 ? (
                      <div className="mt-3">
                        <h4 className="font-semibold text-blue-500 mb-1">Challans</h4>
                        {v.challans.map((c, j) => (
                          <div
                            key={j}
                            className="border rounded-lg p-3 mb-2 bg-white shadow-sm"
                          >
                            <p><strong>Challan ID:</strong> {c.challanId}</p>
                            <p><strong>Date:</strong> {c.date}</p>
                            <p><strong>Violation:</strong> {c.violation}</p>
                            <p><strong>Location:</strong> {c.location}</p>
                            <p><strong>Fine Amount:</strong> ₹{c.fineAmount}</p>
                            <p><strong>Status:</strong> {c.status}</p>
                            {c.evidence && c.evidence.screenshot && (
                              <img
                                src={c.evidence.screenshot}
                                alt="Evidence"
                                className="w-32 mt-2 rounded-lg border"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-1">No challans available</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No vehicles added yet</p>
              )}
              <button 
              onClick={() => setAddVehicles(!addVehicles)}
              className={`p-1 ${!addVehicles ? "bg-green-300 text-green-800" : "bg-green-500 text-white"} cursor-pointer hover:bg-green-400 rounded text-sm mt-2`}
              >
                Add Vehicles
              </button>
              {addVehicles &&
              <div>
                <Vehicles userId={user._id} setCounter={setCounter}/>
              </div>
              }
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handle_logout}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md transition-all"
              >
                Logout
              </button>
              <button
                onClick={handle_delete_account}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md transition-all"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
