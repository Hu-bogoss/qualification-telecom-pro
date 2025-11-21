import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  Zap,
  Euro,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import Button from '../components/Button';
import Card, { FeatureCard } from '../components/Card';
import SavingsGauge from '../components/SavingsGauge';
import { StepProgress } from '../components/ProgressBar';
import {
  calculateSavings,
  generateSavingsExplanation,
  formatCurrency
} from '../utils/calculations';
import { fadeInUp, containerVariants, itemVariants, bounceIn } from '../utils/motion';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(null);
  const [savingsData, setSavingsData] = useState(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackData, setCallbackData] = useState({ name: '', phone: '', email: '' });

  // Calculate total budget including cybersecurity with validation
  const calculateTotalBudgetWithCyber = (data) => {
    const fixedBudget = parseFloat(data.fixedBudget) || 0;
    const internetBudget = parseFloat(data.internetBudget) || 0;
    const cyberBudget = parseFloat(data.cybersecurityBudget) || 0;
    return fixedBudget + internetBudget + cyberBudget;
  };

  // Calculate total budget without cybersecurity with validation
  const calculateTotalBudgetWithoutCyber = (data) => {
    const fixedBudget = parseFloat(data.fixedBudget) || 0;
    const internetBudget = parseFloat(data.internetBudget) || 0;
    return fixedBudget + internetBudget;
  };

  const [totalBudgetWithCyber, setTotalBudgetWithCyber] = useState(0);
  const [totalWithoutCyber, setTotalWithoutCyber] = useState(0);
  const [isOptimizedBudget, setIsOptimizedBudget] = useState(false);

  useEffect(() => {
    const storedBudgetData = localStorage.getItem('budgetData');
    if (storedBudgetData) {
      const data = JSON.parse(storedBudgetData);
      setBudgetData(data);

      // Calculate savings with validated data
      const calculatedSavings = calculateSavings(data);
      setSavingsData(calculatedSavings);

      const totalWithCyber = calculateTotalBudgetWithCyber(data);
      const totalWithoutCyber = calculateTotalBudgetWithoutCyber(data);
      setTotalBudgetWithCyber(totalWithCyber);
      setTotalWithoutCyber(totalWithoutCyber);
      setIsOptimizedBudget(totalWithoutCyber < 180);
    } else {
      navigate('/budget');
    }
  }, [navigate]);

  const handleContinueToBooking = () => {
    navigate('/appointment');
  };

  const handleBack = () => {
    navigate('/role');
  };

  const handleCallbackSubmit = () => {
    // Store callback request
    const callbackRequest = {
      ...callbackData,
      budgetData,
      timestamp: new Date().toISOString(),
      type: 'callback_request'
    };
    localStorage.setItem('callbackRequest', JSON.stringify(callbackRequest));

    alert('Merci ! Nous vous rappellerons dans les plus brefs délais.');
    navigate('/');
  };

  if (!budgetData || !savingsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calcul de vos économies...</p>
        </div>
      </div>
    );
  }

  const explanations = generateSavingsExplanation(budgetData);
  const isEligible = totalWithoutCyber >= 180;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <motion.div {...fadeInUp} className="mb-8">
          <StepProgress currentStep={4} totalSteps={4} />
        </motion.div>

        {/* Results Header */}
        <motion.div
          className="text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            {isEligible ? (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            ) : isOptimizedBudget ? (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-600 rounded-full mb-4">
                <Lightbulb className="h-10 w-10 text-white" />
              </div>
            )}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading"
          >
            {isEligible
              ? 'Excellente nouvelle ! 🎉'
              : isOptimizedBudget
              ? 'Budget télécom bien optimisé ! 👍'
              : 'Merci pour votre intérêt !'}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {isEligible
              ? `Vous pouvez économiser jusqu'à ${formatCurrency(savingsData.yearlySavings)} par an`
              : isOptimizedBudget
              ? `Votre budget télécom de ${formatCurrency(totalBudgetWithCyber)}/mois est déjà bien maîtrisé`
              : 'Nous avons des conseils personnalisés pour optimiser vos coûts télécom'}
          </motion.p>
        </motion.div>

        {isEligible ? (
          /* Eligible Results */
          <div className="space-y-8">
            {/* Savings Gauge */}
            <motion.div {...fadeInUp}>
              <Card className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">
                  Vos économies potentielles
                </h2>

                <SavingsGauge
                  minSavings={savingsData.minSavings}
                  maxSavings={savingsData.maxSavings}
                  currentBudget={savingsData.totalBudget}
                  animated={true}
                  showDetails={true}
                />

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Budget actuel :</strong> {formatCurrency(savingsData.totalBudget)}/mois
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Savings Explanation */}
            <motion.div {...fadeInUp}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Comment nous pouvons vous aider :
                </h3>

                <div className="space-y-3">
                  {explanations.map((explanation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{explanation}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Benefits Cards */}
            <motion.div
              className="grid md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={Euro}
                  title="Réduction des coûts"
                  description="Économies immédiates sur vos factures télécom et internet"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={Zap}
                  title="Continuité internet"
                  description="Solutions de backup pour éviter les coupures"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={Shield}
                  title="Protection cyber"
                  description="Sécurisation complète de vos données"
                />
              </motion.div>
            </motion.div>

            {/* Call to Action */}
            <motion.div {...bounceIn}>
              <Card variant="gradient" className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
                  Audit gratuit sur site
                </h2>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Un conseiller se déplace gratuitement pour un audit express (30-45 min).
                  Diagnostic personnalisé et devis sur mesure.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleContinueToBooking}
                    size="lg"
                    icon={ArrowRight}
                  >
                    Planifier mon audit gratuit
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  ✅ Sans engagement • ✅ Audit personnalisé • ✅ Devis gratuit
                </p>
              </Card>
            </motion.div>
          </div>
        ) : isOptimizedBudget ? (
          /* Optimized Budget Results */
          <div className="space-y-8">
            <motion.div {...fadeInUp}>
              <Card className="p-8">
                <div className="text-center mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                    Budget télécom bien optimisé
                  </h2>
                  <p className="text-gray-600">
                    Votre budget actuel : {formatCurrency(totalBudgetWithCyber)}/mois
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-green-800 mb-3">
                    Félicitations ! Votre budget télécom est déjà optimisé
                  </h3>
                  <p className="text-green-700 text-sm mb-4">
                    Avec un budget inférieur à 180€/mois, vous maîtrisez déjà bien vos coûts télécom et cybersécurité.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Points positifs :</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Budget maîtrisé</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Coûts sous contrôle</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Bonne gestion télécom</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Recommandations :</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li className="flex items-start space-x-2">
                          <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Maintenez votre niveau de sécurité</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Surveillez l'évolution de vos besoins</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Phone className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Révisez annuellement vos contrats</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Option */}
            <motion.div {...fadeInUp}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Besoin d'accompagnement pour l'évolution ?
                </h3>
                <p className="text-gray-600 mb-6">
                  Si votre entreprise se développe ou si vos besoins évoluent, nous restons à votre disposition pour un conseil personnalisé.
                </p>

                {!showCallbackForm ? (
                  <Button
                    onClick={() => setShowCallbackForm(true)}
                    variant="outline"
                  >
                    Être recontacté pour l'évolution
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Votre nom"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={callbackData.name}
                        onChange={(e) => setCallbackData(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <input
                        type="tel"
                        placeholder="Téléphone"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={callbackData.phone}
                        onChange={(e) => setCallbackData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email professionnel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={callbackData.email}
                      onChange={(e) => setCallbackData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <div className="flex space-x-3">
                      <Button onClick={handleCallbackSubmit} size="sm">
                        Envoyer
                      </Button>
                      <Button
                        onClick={() => setShowCallbackForm(false)}
                        variant="ghost"
                        size="sm"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        ) : (
          /* Non-Eligible Results - Budget too low but not optimized */
          <div className="space-y-8">
            {/* Educational Content */}
            <motion.div {...fadeInUp}>
              <Card className="p-8">
                <div className="text-center mb-6">
                  <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                    Budget télécom optimisable
                  </h2>
                  <p className="text-gray-600">
                    Votre budget actuel : {formatCurrency(totalBudgetWithCyber)}/mois
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Conseils d'optimisation :</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Renégociez vos contrats annuellement</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Auditez vos lignes non utilisées</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Mutualisez internet et téléphonie</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Évaluez les solutions cloud</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Prochaines étapes :</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Développez votre activité</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Recontactez-nous dans 6 mois</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Priorisez la cybersécurité</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Callback Form */}
            <motion.div {...fadeInUp}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Souhaitez-vous être recontacté ?
                </h3>
                <p className="text-gray-600 mb-6">
                  Laissez vos coordonnées pour recevoir nos conseils personnalisés par email
                </p>

                {!showCallbackForm ? (
                  <Button
                    onClick={() => setShowCallbackForm(true)}
                    variant="outline"
                  >
                    Oui, contactez-moi
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Votre nom"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={callbackData.name}
                        onChange={(e) => setCallbackData(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <input
                        type="tel"
                        placeholder="Téléphone"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={callbackData.phone}
                        onChange={(e) => setCallbackData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email professionnel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={callbackData.email}
                      onChange={(e) => setCallbackData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <div className="flex space-x-3">
                      <Button onClick={handleCallbackSubmit} size="sm">
                        Envoyer
                      </Button>
                      <Button
                        onClick={() => setShowCallbackForm(false)}
                        variant="ghost"
                        size="sm"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}

        {/* Navigation */}
        <motion.div {...fadeInUp} className="mt-8">
          <div className="flex justify-between">
            <Button
              onClick={handleBack}
              variant="ghost"
              icon={ArrowLeft}
            >
              Retour
            </Button>

            {!isEligible && !isOptimizedBudget && (
              <Button
                onClick={() => navigate('/')}
                variant="outline"
              >
                Nouvelle estimation
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;