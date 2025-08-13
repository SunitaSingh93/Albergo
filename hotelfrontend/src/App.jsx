import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
// import AdminLayout from './components/AdminLatout';
import './App.css';
// import PrivateRoute from './routes/PrivateRoute';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/admin' element={<AdminDashboard />} /> 
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
      </Routes>
    </Router>
  );
}

export default App
