import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import WelcomeConsent from './pages/WelcomeConsent';
import BudgetForm from './pages/BudgetForm';
import ResultsPage from './pages/ResultsPage';
import AppointmentBooking from './pages/AppointmentBooking';
import SuccessPage from './pages/SuccessPage';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import { pageVariants, pageTransition } from './utils/motion';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <WelcomeConsent />
              </motion.div>
            }
          />
          <Route
            path="/budget"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <BudgetForm />
              </motion.div>
            }
          />
          <Route
            path="/results"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ResultsPage />
              </motion.div>
            }
          />
          <Route
            path="/appointment"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AppointmentBooking />
              </motion.div>
            }
          />
          <Route
            path="/success"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <SuccessPage />
              </motion.div>
            }
          />
          <Route
            path="/admin-login"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminLogin />
              </motion.div>
            }
          />
          <Route
            path="/admin"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ProtectedAdminRoute>
                  <AdminPanel />
                </ProtectedAdminRoute>
              </motion.div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
