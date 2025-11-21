import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { fadeInUp, containerVariants, itemVariants } from '../utils/motion';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Identifiants administrateur (en production, utiliser une authentification sécurisée)
  const ADMIN_CREDENTIALS = {
    username: 'm.bahmida',
    password: '082024'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulation d'une vérification d'authentification
    setTimeout(() => {
      if (
        formData.username === ADMIN_CREDENTIALS.username &&
        formData.password === ADMIN_CREDENTIALS.password
      ) {
        // Stocker l'état d'authentification
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminLoginTime', Date.now().toString());

        // Rediriger vers le panneau d'administration
        navigate('/admin');
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white font-heading mb-2">
            Accès Administrateur
          </h1>
          <p className="text-blue-200">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  Nom d'utilisateur *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Entrez votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg p-3"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !formData.username || !formData.password}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Security Notice */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-yellow-200">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Accès sécurisé et confidentiel</span>
            </div>
            <p className="text-xs text-yellow-300 mt-1">
              Cet espace est réservé aux administrateurs autorisés uniquement
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div variants={itemVariants} className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-300 hover:text-white text-sm transition-colors duration-200"
          >
            ← Retour à l'accueil
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;