import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import trafficVideo from './video/video.mp4';


const TrafficViolationLanding = ({setFullLoading}) => {

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const check_user = async function(){
      setFullLoading(true);
      try{
        const email = localStorage.getItem("email");
			  const user_id = localStorage.getItem("userId");
        console.log(email, user_id);
        if(email && user_id){
          setUser(email);
          setUserId(user_id);
        }
      } catch(err) {
        console.log(err.message);
      } finally {
        setFullLoading(false);
      }
    }

    check_user();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-blue-600 font-bold text-2xl">TrafficGuard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? 
              <Link to="/auth">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Sign up
                </button>
              </Link>
              :
              <Link to={`/dashboard`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Dashboard
                </button>
              </Link>
              }
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                Developer API
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              AI-Powered Traffic Violation Detection System
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Our advanced computer vision system automatically detects traffic violations in real-time,
              making roads safer and enforcement more efficient.
            </p>
            
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors">
                Request Demo
              </button>
              <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md transition-colors">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Right Column - Hero Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-80 bg-blue-200 rounded-xl shadow-lg overflow-hidden">
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mb-4 text-blue-800">
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900">AI-Powered Traffic Monitoring</h3>
                  <p className="text-blue-800 mt-2">Real-time violation detection with 99.2% accuracy</p>
                </div>
              </div> */}
				<div className="w-full h-full flex items-center justify-center">
					<video
						src={trafficVideo}
						autoPlay
						loop
						muted
						playsInline
						className="w-full object-cover rounded-2xl shadow-lg"
					/>
				</div>
            </div>
          </div>
			

        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Violation Detection</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our system uses cutting-edge AI and computer vision to identify various traffic violations automatically
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Helmet Detection */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Helmet Detection</h3>
              <p className="text-gray-600">
                Automatically detect riders without helmets with our advanced AI algorithms. 
                Identifies both presence and proper fastening of safety helmets.
              </p>
            </div>
            
            {/* License Plate Recognition */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">License Plate Recognition</h3>
              <p className="text-gray-600">
                Advanced OCR technology captures license plate numbers even at high speeds 
                and in various weather conditions with 98.7% accuracy.
              </p>
            </div>
            
            {/* Speed Detection */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6V4a1 1 0 10-2 0v2H9a1 1 0 100 2h2v2a1 1 0 102 0V8h2a1 1 0 100-2h-2zm5 11a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a2 2 0 012-2h8a2 2 0 012 2v5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Speed Limit Detection</h3>
              <p className="text-gray-600">
                Precisely measure vehicle speed and detect violations using radar-integrated 
                AI cameras. Customizable thresholds for different road types.
              </p>
            </div>
            
            {/* Wrong Way Detection */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wrong Way Detection</h3>
              <p className="text-gray-600">
                Identify vehicles traveling in the wrong direction on one-way streets, 
                highways, and exit ramps. Instant alerts to prevent accidents.
              </p>
            </div>
            
            {/* Seat Belt Detection */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seat Belt Compliance</h3>
              <p className="text-gray-600">
                Detect drivers and passengers not wearing seat belts with our advanced 
                interior vehicle analysis algorithms.
              </p>
            </div>
            
            {/* Red Light Detection */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Red Light Violation</h3>
              <p className="text-gray-600">
                Detect vehicles that fail to stop at red traffic signals with precise 
                timing and positioning analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Advanced Technology Stack</h2>
            <p className="text-blue-100 max-w-3xl mx-auto">
              Our system leverages the latest advancements in AI and computer vision to deliver accurate results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Deep Learning</h3>
              <p className="text-blue-100">Neural networks trained on millions of traffic images for maximum accuracy</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Processing</h3>
              <p className="text-blue-100">Process video feeds in real-time with minimal latency for immediate violation detection</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">High Accuracy OCR</h3>
              <p className="text-blue-100">Advanced optical character recognition for license plate reading in various conditions</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Enhance Traffic Safety?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Join municipalities and organizations around the world using our technology to make roads safer
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md transition-colors text-lg">
              Request a Demo
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md transition-colors text-lg">
              Developer API Access
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TrafficGuard</h3>
              <p className="text-gray-400">
                AI-powered traffic violation detection for safer roads and smarter cities.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Helmet Detection</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">License Plate OCR</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Speed Monitoring</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Seat Belt Detection</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} TrafficGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrafficViolationLanding;