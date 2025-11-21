import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

const ProtectedAdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const adminAuth = sessionStorage.getItem('adminAuthenticated');
      const loginTime = sessionStorage.getItem('adminLoginTime');
      
      if (adminAuth === 'true' && loginTime) {
        // Vérifier si la session n'a pas expiré (24 heures)
        const currentTime = Date.now();
        const sessionDuration = currentTime - parseInt(loginTime);
        const maxSessionDuration = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
        
        if (sessionDuration < maxSessionDuration) {
          setIsAuthenticated(true);
        } else {
          // Session expirée, nettoyer le stockage
          sessionStorage.removeItem('adminAuthenticated');
          sessionStorage.removeItem('adminLoginTime');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  // Affichage de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Vérification des autorisations...</p>
        </motion.div>
      </div>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  // Afficher le contenu protégé si authentifié
  return children;
};

export default ProtectedAdminRoute;