// src/router/Router.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import WardenDashboard from '../pages/WardenDashboard';

import MainLayout from '../layouts/MainLayout';
import Signup from '../pages/SignUp';

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/warden-dashboard" element={<WardenDashboard />} />
          {/* <Route path="/prefect-dashboard" element={<PrefectDashboard />} />
          <Route path="/wing-representative-dashboard" element={<WingRepresentativeDashboard />} /> */}
        </Routes>
        
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
