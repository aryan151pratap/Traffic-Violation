import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Linking from './linking';
import TrafficViolationLanding from './landing';
import AuthPages from './login/authentication';
import { useEffect, useState } from 'react';
import Dashboard from './user/dashboard';
import Loading from './loading';

function App() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="">
      {loading &&
      <div>
        <Loading/>
      </div>
      }
      <Routes>
        <Route path="/" element={<TrafficViolationLanding setFullLoading={setLoading}/>} />
        <Route path="/developer" element={<Linking setLoading={setLoading}/>} />
        <Route path="/auth" element={<AuthPages setLoading={setLoading}/>} />
        <Route path="/dashboard" element={<Dashboard setFullLoading={setLoading}/>} />
        {/* Redirect any unknown route to home */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
