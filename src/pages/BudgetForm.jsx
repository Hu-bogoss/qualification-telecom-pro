import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(null);
  const [savingsData, setSavingsData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        hasEconomies: false,
        reason: 'justPrice',
        minSavings: 0,
        maxSavings: 0,
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
      hasEconomies: true,
      reason: 'savings',
      minSavings: Math.floor(monthlySavings),
      maxSavings: Math.ceil(monthlySavings),
      yearlySavings: Math.floor(yearlySavings),
      monthlyAverageSavings: Math.floor(monthlySavings),
      savingsPercentage: savingsPercentage
    };
  };

  useEffect(() => {
    const storedBudgetData = localStorage.getItem('budgetData');
    if (storedBudgetData) {
      try {
        const data = JSON.parse(storedBudgetData);
        setBudgetData(data);
        
        const savings = calculateSavings(data);
        setSavingsData(savings);
        
        setLoading(false);
      } catch (error) {
        console.error('Error parsing budget data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleBooking = () => {
    // À adapter avec ta vraie page de réservation
    navigate('/appointment');
  };

  const handleBack = () => {
    navigate('/budget');
  };

  if (loading || !budgetData || !savingsData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyse de vos données...</p>
        </motion.div>
      </div>
    );
  }

  const { hasEconomies, reason } = savingsData;

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">TelecomAudit</div>
          <div className="text-sm text-gray-600">Résultats de votre analyse</div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Result Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-8"
            >
              {hasEconomies ? (
                <TrendingDown className="w-8 h-8 text-blue-600" strokeWidth={2} />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={2} />
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              {hasEconomies ? 'Économies identifiées' : 'Juste prix confirmé'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              {hasEconomies
                ? `Vous pouvez économiser jusqu'à ${formatCurrency(savingsData.yearlySavings)} par an`
                : 'Après analyse des offres sur le marché et des leviers d\'économie, vous payez le juste prix'}
            </motion.p>
          </motion.div>

          {/* Main Result Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12 mb-12"
          >
            {hasEconomies ? (
              /* Economies Case */
              <div className="space-y-8">
                {/* Savings Breakdown */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-8 text-center">
                  <p className="text-sm text-gray-600 mb-2">Économies mensuelles</p>
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl font-bold text-blue-600 mb-2"
                  >
                    {formatCurrency(savingsData.monthlyAverageSavings)}
                  </motion.h2>
                  <p className="text-sm text-gray-600">
                    soit <span className="font-semibold">{savingsData.savingsPercentage}%</span> de réduction
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Économies annuelles</p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-3xl font-bold text-green-600"
                    >
                      {formatCurrency(savingsData.yearlySavings)}
                    </motion.p>
                  </div>
                </div>

                {/* Current Budget */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Budget actuel mensuel</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(savingsData.totalBudget)}
                    </p>
                  </div>

                  <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm text-green-700 mb-2">Nouvel budget estimé</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(savingsData.totalBudget - savingsData.monthlyAverageSavings)}
                    </p>
                  </div>
                </div>

                {/* Savings Gauge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900">Potentiel d'économie</p>
                    <p className="text-sm font-semibold text-blue-600">{savingsData.savingsPercentage}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${savingsData.savingsPercentage}%` }}
                      transition={{ delay: 0.7, duration: 1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Key Insights */}
                <div className="grid md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <p className="text-sm text-blue-700 font-semibold">Analyse</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {savingsData.savingsPercentage}% de réduction identifiée
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <p className="text-sm text-green-700 font-semibold">Économies</p>
                    <p className="text-xs text-green-600 mt-1">
                      {formatCurrency(savingsData.yearlySavings)}/an
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                  >
                    <p className="text-sm text-purple-700 font-semibold">Audit gratuit</p>
                    <p className="text-xs text-purple-600 mt-1">
                      30-45 min sur site
                    </p>
                  </motion.div>
                </div>
              </div>
            ) : (
              /* Just Price Case */
              <div className="space-y-8">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600" strokeWidth={2} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Budget télécom optimisé
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Votre budget actuel : <span className="font-semibold">{formatCurrency(savingsData.totalBudget)}/mois</span>
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-8 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-4">
                    Analyse du marché complétée
                  </h3>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900">Offres analysées</p>
                        <p className="text-sm text-green-700 mt-0.5">
                          Plus de 500 offres du marché comparées
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900">Leviers d'économie</p>
                        <p className="text-sm text-green-700 mt-0.5">
                          Tous les leviers d'économie ont été évalués
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900">Juste prix confirmé</p>
                        <p className="text-sm text-green-700 mt-0.5">
                          Vous payez le meilleur prix du marché
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>💡 Conseil:</strong> Révisez vos contrats annuellement pour rester dans les meilleures conditions tarifaires du marché.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* CTA Section */}
          {hasEconomies && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center mb-12 text-white"
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
          )}

          {/* Footer Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
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
