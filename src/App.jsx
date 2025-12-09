import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages publiques
import WelcomeConsent from './pages/WelcomeConsent';
import BudgetForm from './pages/BudgetForm';
import ResultsPage from './pages/ResultsPage';
import AppointmentBooking from './pages/AppointmentBooking';
import SuccessPage from './pages/SuccessPage';

// Pages Admin
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<WelcomeConsent />} />
        <Route path="/budget" element={<BudgetForm />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/appointment" element={<AppointmentBooking />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* Routes Admin - Sécurisées */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />

        {/* Route par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
