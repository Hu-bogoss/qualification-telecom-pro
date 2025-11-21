import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Phone, Zap, Euro, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card, { FeatureCard } from '../components/Card';
import { fadeInUp, containerVariants, itemVariants } from '../utils/motion';
import AIAnimation from '../components/AIAnimation';

const WelcomeConsent = () => {
  const navigate = useNavigate();
  const [consents, setConsents] = useState({
    contact: false,
    professional: false
  });
  const [errors, setErrors] = useState({});

  const handleConsentChange = (type) => {
    setConsents(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    if (errors[type]) {
      setErrors(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!consents.contact) {
      newErrors.contact = 'Ce consentement est obligatoire pour continuer';
    }
    if (!consents.professional) {
      newErrors.professional = 'Veuillez confirmer votre statut professionnel';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Store consent data with timestamp and IP (mock)
    const consentData = {
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1', // In real app, get from backend
      consents: consents
    };
    localStorage.setItem('userConsent', JSON.stringify(consentData));

    navigate('/budget');
  };

  const isFormValid = consents.contact && consents.professional;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
              <Phone className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading leading-tight"
          >
            Baissez votre facture télécom jusqu'à{' '}
            <span className="text-blue-600">20%</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            L'IA analyse en temps réel le marché des telecoms et vous permet d'évaluer vos économies en 2 minutes —
            <strong className="text-blue-600">Audit gratuit !</strong>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center space-x-4 text-sm text-gray-500"
          >
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Conforme RGPD</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Sans engagement</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>⏱️ 2 minutes</span>
          </motion.div>
        </motion.div>

        {/* AI Animation Section */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <AIAnimation />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
              L'Intelligence Artificielle au Service de Vos Économies
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Notre IA analyse en continu plus de 500 offres télécom et cybersécurité
              pour identifier les meilleures opportunités d'économies adaptées à votre profil d'entreprise.
            </p>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={Euro}
              title="Économies Garanties"
              description="Réduisez vos coûts télécom de 8% à 20% selon votre configuration actuelle"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={Shield}
              title="Cybersécurité Incluse"
              description="La garantie d'une solutions télécoms et cybersécurité dans une seule offre"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={Zap}
              title="Audit Express"
              description="Diagnostic gratuit sur site en 30-45 minutes par nos experts"
            />
          </motion.div>
        </motion.div>

        {/* Consent Form */}
        <motion.div
          {...fadeInUp}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-heading">
              Consentements Obligatoires
            </h2>

            <div className="space-y-6">
              {/* Contact Consent */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.contact}
                    onChange={() => handleConsentChange('contact')}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      <strong>J'autorise TelecomAudit</strong> à analyser mes coûts et, si une meilleure offre est trouvée, à transmettre mes coordonnées à l’opérateur retenu pour qu’il me présente sa proposition. Je peux retirer mon consentement à tout moment.
                    </p>
                  </div>
                </label>
                {errors.contact && (
                  <p className="text-red-600 text-sm mt-2 ml-7">{errors.contact}</p>
                )}
              </div>

              {/* Professional Status */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.professional}
                    onChange={() => handleConsentChange('professional')}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      <strong>Je confirme être un professionnel</strong> et souhaiter optimiser les coûts télécoms/cybersécurité de mon entreprise. Cette estimation est réservée aux professionnels uniquement.
                    </p>
                  </div>
                </label>
                {errors.professional && (
                  <p className="text-red-600 text-sm mt-2 ml-7">{errors.professional}</p>
                )}
              </div>
            </div>

            {/* GDPR Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    Protection de vos données (RGPD)
                  </h3>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Vos données sont traitées conformément au RGPD. Elles ne seront utilisées
                    que pour vous proposer nos services télécom et ne seront jamais vendues à des tiers.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full"
                disabled={!isFormValid}
                icon={ArrowRight}
              >
                Démarrer l'estimation
              </Button>

              <p className="text-center text-xs text-gray-500 mt-3">
                En continuant, vous acceptez nos conditions d'utilisation
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeConsent;