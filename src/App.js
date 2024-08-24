import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Deposit from './components/deposit/Deposit';
import User from './components/user/User';
import Report from './components/report/Report';
import NotFound from './components/views/NotFound';
import PrivateRoute from './components/utils/PrivateRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Role from './components/role/Role';
import SourceCategory from './components/source-category/SourceCategory';
import Region from './components/region/Region';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/user" element={<User />} />
        <Route path="/role" element={<Role />} />
        <Route path="/source-category" element={<SourceCategory />} />
        <Route path="/region" element={<Region />} />
        <Route path="/report" element={<Report />} />
        {/* <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />*/}
      </Routes> 
    </Router>
  );
}

export default App;
