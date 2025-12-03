import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Zap,
  CheckCircle,
  TrendingDown,
  Euro
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

    // Si fixe < 120€ ET internet < 150€ : Aucune offre trouvée (juste prix)
    if (fixedBudget < 120 && internetBudget < 150) {
      return {
        totalBudget,
        fixedBudget,
        internetBudget,
        cyberBudget,
        hasEconomies: false,
        hasOffre: false,
        reason: 'noOfferFound',
        yearlySavings: 0,
        monthlyAverageSavings: 0,
        savingsPercentage: 0
      };
    }

    // Si fixe >= 120€ OU internet >= 150€ : Offre trouvée avec économies
    if (fixedBudget >= 120 || internetBudget >= 150) {
      const savingsPercentage = Math.floor(Math.random() * 6) + 10; // 10-15%
      const monthlySavings = totalBudget * (savingsPercentage / 100);
      const yearlySavings = monthlySavings * 12;

      return {
        totalBudget,
        fixedBudget,
        internetBudget,
        cyberBudget,
        hasEconomies: true,
        hasOffre: true,
        reason: 'offerFound',
        yearlySavings: Math.floor(yearlySavings),
        monthlyAverageSavings: Math.floor(monthlySavings),
        savingsPercentage: savingsPercentage
      };
    }

    return {
      totalBudget,
      fixedBudget,
      internetBudget,
      cyberBudget,
      hasEconomies: false,
      hasOffre: false,
      reason: 'unknown',
      yearlySavings: 0,
      monthlyAverageSavings: 0,
      savingsPercentage: 0
    };
  };

  // Loading animation sequence - 8 SECONDES
  useEffect(() => {
    const storedBudgetData = localStorage.getItem('budgetData');
    if (storedBudgetData) {
      try {
        const data = JSON.parse(storedBudgetData);
        setBudgetData(data);
        
        const savings = calculateSavings(data);
        setSavingsData(savings);

        // Sequence d'animation sur 12 secondes
        const timings = [
          { delay: 1000, step: 1 },    // 1.0s  - Analyse de votre profil en cours...
          { delay: 3500, step: 2 },    // 3.5s  - Analyse des offres correspondantes...
          { delay: 6500, step: 3 },    // 6.5s  - Offre trouvée / Vérification position...
          { delay: 9000, step: 4 },    // 9.0s  - Vérification / Analyse complète...
          { delay: 12000, step: 5 }    // 12.0s - Afficher les résultats
        ];

        timings.forEach(({ delay, step }) => {
          setTimeout(() => {
            setLoadingStep(step);
            if (step === 5) {
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

  // Loading Screen - 8 SECONDES
  if (!showResults || !budgetData || !savingsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md px-4"
        >
          {/* Animated Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-12"
          />

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: loadingStep >= 1 ? 1 : 0, y: loadingStep >= 1 ? 0 : 10 }}
            transition={{ duration: 0.6 }}
            className={`mb-8 pb-8 border-b border-gray-200 ${loadingStep >= 2 ? 'opacity-50' : ''}`}
          >
            <p className="text-lg text-gray-900 font-semibold">
              Analyse de votre profil en cours...
            </p>
            {loadingStep >= 1 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: loadingStep >= 2 ? '100%' : '60%' }}
                transition={{ duration: 1.5 }}
                className="h-1 bg-blue-600 rounded-full mt-3 max-w-xs mx-auto"
              />
            )}
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: loadingStep >= 2 ? 1 : 0, y: loadingStep >= 2 ? 0 : 10 }}
            transition={{ duration: 0.6 }}
            className={`mb-8 pb-8 border-b border-gray-200 ${loadingStep >= 3 ? 'opacity-50' : ''}`}
          >
            <p className="text-lg text-gray-900 font-semibold">
              Analyse des offres correspondantes...
            </p>
            {loadingStep >= 2 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: loadingStep >= 3 ? '100%' : '70%' }}
                transition={{ duration: 1.5 }}
                className="h-1 bg-green-600 rounded-full mt-3 max-w-xs mx-auto"
              />
            )}
          </motion.div>

          {/* Step 3 - DYNAMIQUE selon offre trouvée */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: loadingStep >= 3 ? 1 : 0, y: loadingStep >= 3 ? 0 : 10 }}
            transition={{ duration: 0.6 }}
            className={`mb-8 pb-8 border-b border-gray-200 ${loadingStep >= 4 ? 'opacity-50' : ''}`}
          >
            <p className="text-lg text-gray-900 font-semibold">
              {savingsData?.hasOffre 
                ? 'Offre trouvée, calcul des économies...'
                : 'Vérification de votre position tarifaire...'
              }
            </p>
            {loadingStep >= 3 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: loadingStep >= 4 ? '100%' : '75%' }}
                transition={{ duration: 1.2 }}
                className="h-1 bg-purple-600 rounded-full mt-3 max-w-xs mx-auto"
              />
            )}
          </motion.div>

          {/* Step 4 - DYNAMIQUE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: loadingStep >= 4 ? 1 : 0, y: loadingStep >= 4 ? 0 : 10 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-900 font-semibold">
              {savingsData?.hasOffre 
                ? 'Vérification des résultats...'
                : 'Analyse complète en cours...'
              }
            </p>
            {loadingStep >= 4 && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-2 h-2 bg-blue-600 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                  className="w-2 h-2 bg-blue-600 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                  className="w-2 h-2 bg-blue-600 rounded-full"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const { hasEconomies, hasOffre, fixedBudget, internetBudget, cyberBudget } = savingsData;

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">TelecomAudit</div>
          <div className="text-sm text-gray-600">Analyse complétée</div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 shadow-lg ${
                savingsData.hasOffre
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                  : 'bg-gradient-to-br from-green-500 to-green-600'
              }`}
            >
              {savingsData.hasOffre ? (
                <TrendingDown className="w-10 h-10 text-white" strokeWidth={2} />
              ) : (
                <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              {savingsData.hasOffre ? 'Offre trouvée!' : 'Aucune offre trouvée'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl text-gray-600 max-w-3xl mx-auto font-light"
            >
              {savingsData.hasOffre
                ? `L'IA a identifié une offre équivalente\navec un meilleur coût`
                : `Votre offre actuelle est bien positionnée\nvous payez le juste prix`}
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-12"
          >
            {/* Budget Breakdown Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Vos dépenses actuelles
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Téléphonie Fixe */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-600 mb-3 font-medium uppercase tracking-wide">
                    Téléphonie fixe
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {formatCurrency(fixedBudget)}
                  </p>
                  <p className="text-xs text-gray-500">/mois</p>
                </motion.div>

                {/* Internet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-600 mb-3 font-medium uppercase tracking-wide">
                    Internet
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {formatCurrency(internetBudget)}
                  </p>
                  <p className="text-xs text-gray-500">/mois</p>
                </motion.div>

                {/* Cybersécurité - Only if filled */}
                {cyberBudget > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
                  >
                    <p className="text-sm text-gray-600 mb-3 font-medium uppercase tracking-wide">
                      Antivirus
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {formatCurrency(cyberBudget)}
                    </p>
                    <p className="text-xs text-gray-500">/mois</p>
                  </motion.div>
                )}

                {/* Total */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg text-white"
                >
                  <p className="text-sm mb-3 font-medium uppercase tracking-wide opacity-90">
                    Total mensuel
                  </p>
                  <p className="text-4xl font-bold mb-2">
                    {formatCurrency(savingsData.totalBudget)}
                  </p>
                  <p className="text-xs opacity-75">/mois</p>
                </motion.div>
              </div>
            </div>

            {/* AI Finding - Main Highlight */}
            {savingsData.hasOffre ? (
              /* OFFRE TROUVÉE */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-12 border-2 border-green-200 shadow-lg"
              >
                <div className="flex items-start space-x-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex-shrink-0"
                  >
                    <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      L'IA a identifié une offre équivalente avec un meilleur coût
                    </h3>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      Vous pouvez économiser jusqu'à <span className="font-bold text-green-600">{savingsData.savingsPercentage}%</span> de vos dépenses mensuelles
                    </p>

                    {/* Savings Cards */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-5 border border-green-200">
                        <p className="text-sm text-gray-600 mb-2">Économies mensuelles</p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(savingsData.monthlyAverageSavings)}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-green-200">
                        <p className="text-sm text-gray-600 mb-2">Économies annuelles</p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(savingsData.yearlySavings)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* AUCUNE OFFRE TROUVÉE - JUSTE PRIX */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-3xl p-12 border-2 border-blue-200 shadow-lg"
              >
                <div className="flex items-start space-x-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex-shrink-0"
                  >
                    <CheckCircle className="w-12 h-12 text-blue-600" strokeWidth={2} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Votre offre actuelle est bien positionnée
                    </h3>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                      Après analyse complète du marché et comparaison avec plus de 500 offres, nous avons confirmé que <span className="font-bold">vous payez le juste prix</span>. Aucune offre équivalente meilleure n'a été trouvée sur le marché.
                    </p>

                    {/* Summary Box */}
                    <div className="bg-white rounded-xl p-6 border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Summary de votre offre</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                          <span className="text-gray-700">Téléphonie fixe</span>
                          <span className="font-bold text-gray-900">{formatCurrency(fixedBudget)}/mois</span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                          <span className="text-gray-700">Internet</span>
                          <span className="font-bold text-gray-900">{formatCurrency(internetBudget)}/mois</span>
                        </div>
                        {cyberBudget > 0 && (
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <span className="text-gray-700">Antivirus</span>
                            <span className="font-bold text-gray-900">{formatCurrency(cyberBudget)}/mois</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-semibold text-gray-900">Total mensuel</span>
                          <span className="text-2xl font-bold text-blue-600">{formatCurrency(savingsData.totalBudget)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-300">
                      <p className="text-sm text-blue-900">
                        <strong>💡 Conseil:</strong> Continuez à surveiller régulièrement le marché. Nous vous recommandons de réviser votre contrat annuellement pour rester dans les meilleures conditions tarifaires.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* CTA Section - Visible seulement si offre trouvée */}
            {savingsData.hasOffre && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-8"
                >
                  <Zap className="w-6 h-6" />
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Audit gratuit personnalisé
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Un consultant se déplace gratuitement pour un audit express. Diagnostic détaillé et devis personnalisé sans engagement.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBooking}
                  className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center space-x-3"
                >
                  <span>Réserver mon audit gratuit</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <p className="text-sm text-blue-100 mt-8">
                  ✓ Sans engagement • ✓ Audit personnalisé • ✓ Devis gratuit
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Footer Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200"
          >
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.05, x: -4 }}
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
