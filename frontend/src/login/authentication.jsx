import React, { useState } from 'react';
import OTP from './otp';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/notification';
const API_BACKEND = import.meta.env.VITE_BACKEND;

const AuthPages = ({setFullLoading}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [otpStep, setOtpStep] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading , setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handle_verify_email = async function(){
    try{
      if(!formData.email) return;
      setLoading(true);
      const res = await fetch(`${API_BACKEND}/auth/email_verify`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: formData.email, password: formData.password})
      });
      const result = await res.json();
      if(res.ok){
        setOtpStep(true);
        setNotification(result);
      }
    } catch (err){
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handle_sign_in = async function(){
    try{
      if(!formData.email) return;
      setLoading(true);
      const res = await fetch(`${API_BACKEND}/auth/sign_in`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: formData.email, password: formData.password})
      });
      const result = await res.json();
      if(res.ok){
        localStorage.setItem("email", formData.email);
			  localStorage.setItem("userId", result.userId);
        navigate(`/dashboard`);
        setNotification(result);
      } else{
        setNotification(result);
      }
    } catch (err){
      console.log(err.message);
      setNotification({error: err.message});
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in with:", formData);
      handle_sign_in();
    } else {
      console.log("Verifying email:", formData.email);
      handle_verify_email();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-md md:max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 py-6 px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">TrafficGuard</h1>
          <p className="text-blue-100 mt-2">AI-Powered Traffic Violation Detection</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 font-medium ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => {
              setIsLogin(true);
              setOtpStep(false);
            }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-4 font-medium ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => {
              setIsLogin(false);
              setOtpStep(false);
            }}
          >
            Sign Up
          </button>
        </div>

        <div className="px-8 py-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {isLogin ? 'Sign in to your account' : otpStep ? 'Enter OTP' : 'Create a new account'}
          </h2>
          
          {otpStep ? (
            <OTP setOtpStep={setOtpStep} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="outline-none w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      className="outline-none w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  {loading ?
                  <div
                    className="w-full bg-blue-600 text-white items-center flex justify-center p-2 rounded-md"
                  >
                    <div className='p-3.5 border-3 border-t-transparent w-fit rounded-full animate-spin'></div>
                  </div>
                  :
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-greebluen-500 focus:ring-offset-2 font-medium"
                  >
                  {!isLogin ? 'Verify Email' : 'Sign In'}
                  </button>
                  }
                </>
            </form>
          )}
        </div>
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
      </div>
    </div>
  );
};

export default AuthPages;
