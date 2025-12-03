import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Zap,
  CheckCircle
} from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(null);
  const [savingsData, setSavingsData] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateSavings = (data) => {
    const fixedBudget = parseFloat(data.fixedBudget) || 0;
    const internetBudget = parseFloat(data.internetBudget) || 0;
    const cyberBudget = parseFloat(data.cybersecurityBudget) || 0;

    const totalBudget = fixedBudget + internetBudget + cyberBudget;

    // Si fixe < 120€ : juste prix, pas d'économie
    if (fixedBudget < 120) {
      return {
        totalBudget,
        fixedBudget,
        internetBudget,
        cyberBudget,
        hasEconomies: false,
        yearlySavings: 0,
        monthlyAverageSavings: 0,
        savingsPercentage: 0
      };
    }

    // Si fixe >= 120€ : économies entre 10-15% (aléatoire)
    const savingsPercentage = Math.floor(Math.random() * 6) + 10; // 10-15%
    const monthlySavings = totalBudget * (savingsPercentage / 100);
    const yearlySavings = monthlySavings * 12;

    return {
      totalBudget,
      fixedBudget,
      internetBudget,
      cyberBudget,
      hasEconomies: true,
      yearlySavings: Math.floor(yearlySavings),
      monthlyAverageSavings: Math.floor(monthlySavings),
      savingsPercentage: savingsPercentage
    };
  };

  // Loading animation sequence
  useEffect(() => {
    const storedBudgetData = localStorage.getItem('budgetData');
    if (storedBudgetData) {
      try {
        const data = JSON.parse(storedBudgetData);
        setBudgetData(data);
        
        const savings = calculateSavings(data);
        setSavingsData(savings);

        // Sequence d'animation
        const timings = [
          { delay: 500, step: 1 },   // Analyse de votre en cours...
          { delay: 1000, step: 2 },  // Analyse des offres correspondantes...
          { delay: 1500, step: 3 },  // Offre trouvée calcul des économies...
          { delay: 2000, step: 4 }   // Afficher les résultats
        ];

        timings.forEach(({ delay, step }) => {
          setTimeout(() => {
            setLoadingStep(step);
            if (step === 4) {
              setShowResults(true);
            }
          }, delay);
        });
      } catch (error) {
        console.error('Error parsing budget data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleBooking = () => {
    navigate('/appointment');
  };

  const handleBack = () => {
    navigate('/budget');
  };

  // Loading Screen
  if (!showResults || !budgetData || !savingsData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-8"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <p className="text-lg text-gray-900 font-semibold">
              Analyse de votre profil en cours...
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStep >= 2 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <p className="text-lg text-gray-900 font-semibold">
              Analyse des offres correspondantes...
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStep >= 3 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <p className="text-lg text-gray-900 font-semibold">
              Offre trouvée, calcul des économies...
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStep >= 3 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-2 h-2 bg-blue-600 rounded-full"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                className="w-2 h-2 bg-blue-600 rounded-full"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-blue-600 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const { hasEconomies, fixedBudget, internetBudget, cyberBudget } = savingsData;

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">TelecomAudit</div>
          <div className="text-sm text-gray-600">Analyse complétée</div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Result Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-8"
            >
              <Zap className="w-8 h-8 text-blue-600" strokeWidth={2} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              {hasEconomies ? 'Offre trouvée!' : 'Analyse complète'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              {hasEconomies
                ? `L'IA a identifié une offre équivalente avec un meilleur coût`
                : 'Votre budget télécom est bien optimisé'}
            </motion.p>
          </motion.div>

          {/* Main Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12 mb-12"
          >
            {/* Current Expenses Summary */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Votre dépenses actuelles
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Téléphonie Fixe */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <p className="text-sm text-gray-600 mb-2">Téléphonie fixe</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(fixedBudget)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">/mois</p>
                </motion.div>

                {/* Internet */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <p className="text-sm text-gray-600 mb-2">Internet</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(internetBudget)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">/mois</p>
                </motion.div>

                {/* Cybersécurité - Only if filled */}
                {cyberBudget > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <p className="text-sm text-gray-600 mb-2">Antivirus</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(cyberBudget)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">/mois</p>
                  </motion.div>
                )}

                {/* Total */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-6 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <p className="text-sm text-blue-700 mb-2 font-semibold">Total mensuel</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(savingsData.totalBudget)}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">/mois</p>
                </motion.div>
              </div>

              {/* AI Finding */}
              {hasEconomies && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-6 bg-green-50 rounded-xl border border-green-200"
                >
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">
                        L'IA a identifié une offre équivalente avec un meilleur coût
                      </h3>
                      <p className="text-green-700">
                        Vous pouvez économiser <span className="font-bold">{savingsData.savingsPercentage}%</span> soit <span className="font-bold">{formatCurrency(savingsData.monthlyAverageSavings)}/mois</span> ({formatCurrency(savingsData.yearlySavings)}/an)
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-12" />

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Audit gratuit personnalisé
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Un consultant se déplace gratuitement pour un audit express. Diagnostic détaillé et devis personnalisé sans engagement.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBooking}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-2"
              >
                <span>Réserver mon audit gratuit</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p className="text-sm text-blue-100 mt-6">
                ✓ Sans engagement • ✓ Audit personnalisé • ✓ Devis gratuit
              </p>
            </motion.div>
          </motion.div>

          {/* Footer Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-between"
          >
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-semibold transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour</span>
            </motion.button>

            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 hover:text-gray-900 font-semibold transition"
            >
              Nouvelle estimation
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
