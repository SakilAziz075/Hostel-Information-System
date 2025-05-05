// src/router/Router.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';

import MainLayout from '../layouts/MainLayout';

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>}/>
        </Routes>
        
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
