import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Linking from './linking';
import TrafficViolationLanding from './landing';
import AuthPages from './login/authentication';
import { useEffect, useState } from 'react';
import Dashboard from './user/dashboard';

function App() {
  
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<TrafficViolationLanding />} />
        <Route path="/developer" element={<Linking />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
