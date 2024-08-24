// src/App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Login from './views/auth/Login';
import Deposit from './views/Deposit';
import User from './views/User';
import Report from './views/Report';
import NotFound from './components/common/NotFound';
import PrivateRoute from './utils/PrivateRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Role from './views/Role';
import SourceCategory from './views/SourceCategory';
import Region from './views/Region';
import Dashboard from './views/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/deposit" element={<PrivateRoute element={<Deposit />} />} />
        <Route path="/user" element={<PrivateRoute element={<User />} />} />
        <Route path="/role" element={<PrivateRoute element={<Role />} />} />
        <Route path="/source-category" element={<PrivateRoute element={<SourceCategory />} />} />
        <Route path="/region" element={<PrivateRoute element={<Region />} />} />
        <Route path="/report" element={<PrivateRoute element={<Report />} />} />

        <Route path="*" element={<NotFound />} />
      </Routes> 
    </Router>
  );
}

export default App;
