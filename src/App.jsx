import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import CreateEvent from './components/Event/CreateEvent';
import EventDetail from './components/Event/EventDetail';
import ClientRegistration from './components/Registration/ClientRegistration';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import EventLanding from './pages/All Event/EventLanding';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
// styles import हटा दिया

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" />;
};

const App = () => (
  <div>
    <Navbar />
    <main>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/register/:eventId" element={<ClientRegistration />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-event"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />

        <Route
          path="/event/:eventId"
          element={
            <PrivateRoute>
              <EventDetail />
            </PrivateRoute>
          }
        />

        {/* default redirect */}
        <Route path="/dashboard" element={<Navigate to="/dashboard" />} />
        <Route path="/all-events" element={<EventLanding />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
