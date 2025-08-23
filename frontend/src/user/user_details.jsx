import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
const API_BACKEND = import.meta.env.VITE_BACKEND;

function UserForm({setNotification, setDetails}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: localStorage.getItem('email'),
    address: "",
    profile_img: null,
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [name]: reader.result, // Base64 string
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData);

    const res = await fetch(`${API_BACKEND}/user/save_details`, {
      method: "POST",
      headers: {
							"Content-Type": "application/json",
						},
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (res.ok) {
      setNotification({status: "User registered successfully!"});
      setFormData({
        firstName: "",
        lastName: "",
        contact: "",
        email: "",
        address: "",
        profile_img: null,
        agreeToTerms: false,
      });
      setDetails(result.user);
    } else {
      setNotification({error: "Error registering user"});
    }
    setLoading(false);
  };

  const clearFile = () => {
    setFormData({ ...formData, profile_img: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <p
                className="w-full px-4 py-2.5 text-sm bg-slate-100 rounded border border-gray-300 text-slate-500 cursor-not-allowed"
              >{formData.email}
              </p>
            </div>
            
            <div>
              <input
                type="number"
                name="contact"
                placeholder="Phone Number"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="pt-1">
              <label className="block text-sm text-gray-600 mb-2 px-1">Profile Image</label>
              <div className="flex flex-row gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  name="profile_img"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.profile_img &&
                <div className="shrink-0 flex flex-row gap-2 items-center">
                  <img src={formData.profile_img} alt="Profile" className="h-10 w-10 object-cover rounded-md border border-dashed"/>
                  <FaTimes className="w-10 h-10 p-3 bg-red-200 hover:bg-red-300 focus:bg-red-400 text-red-600 rounded-lg cursor-pointer"
                  onClick={clearFile}                  />
                </div>
                }
              </div>
            </div>
            
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-600">
                I agree to terms & conditions
              </label>
            </div>
            {loading ?
            <div
            className="w-full items-center flex justify-center text-blue-500"
            >
              <div className="p-3.5 w-fit border-3 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>  
              :
            <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded text-sm font-medium transition-colors mt-4"
            >
              Register
            </button>
            }
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserForm;