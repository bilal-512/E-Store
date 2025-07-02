import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaint';
import Bills from './pages/Bill';
import Events from './pages/Event';
import Store from './pages/Store';
import Appointments from './pages/Appointments';
import TransactionHistory from './pages/TransactionHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminStore from './pages/AdminStore';
import AdminEvents from './pages/AdminEvents';
import AdminUsers from './pages/AdminUsers';
import AdminBalanceRequests from './pages/AdminBalanceRequests';
import AdminComplaints from './pages/AdminComplaints';
import AdminBills from './pages/AdminBills';
import Loader from './components/Loader';
import React, { useEffect, useState } from 'react';
// import Bills, Events, Store, Appointments

function AppWithLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Simulate loading
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/events" element={<Events />} />
        <Route path="/store" element={<Store />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/store" element={<AdminStore />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/balance-requests" element={<AdminBalanceRequests />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/bills" element={<AdminBills />} />
        {/* Add more routes here */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWithLoader />
    </Router>
  );
}

export default App;
