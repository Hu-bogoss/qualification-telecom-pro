import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Phone, Zap, Euro, ArrowRight, Play, Users, TrendingDown } from 'lucide-react';
import CountUp from 'react-countup';
import Button from '../components/Button';
import Card, { FeatureCard } from '../components/Card';
import { fadeInUp, containerVariants, itemVariants } from '../utils/motion';
import AIAnimation from '../components/AIAnimation';

const ImprovedWelcomeConsent = () => {
  const navigate = useNavigate();
  const [consents, setConsents] = useState({
    contact: false,
    professional: false
  });
  const [errors, setErrors] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [percentage, setPercentage] = useState(0);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Counter animation for headline
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < 20) {
        count++;
        setPercentage(count);
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

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

    const consentData = {
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      consents: consents
    };
    localStorage.setItem('userConsent', JSON.stringify(consentData));
    navigate('/budget');
  };

  const isFormValid = consents.contact && consents.professional;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen pt-20 pb-12 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute right-0 top-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Urgency Badge */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-block mb-8"
            >
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-900 border border-blue-200">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Offre limitée: 50 audits gratuits restants
              </div>
            </motion.div>

            {/* Main Headline with Counter Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Baissez votre facture télécom de
              </h1>

              <motion.div
                key={percentage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-7xl md:text-8xl lg:text-9xl font-black text-blue-600 mb-4"
              >
                {percentage}%
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                en 2 minutes
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Notre IA analyse plus de 500 offres télécom et cybersécurité en temps réel pour vous proposer les meilleures économies, 100% gratuit.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-10"
            >
              <div className="inline-flex items-center justify-center space-x-6 bg-white rounded-2xl shadow-lg px-8 py-6 border border-blue-100">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Offre valide encore</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {minutes}:{seconds.toString().padStart(2, '0')} min
                  </p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Audits disponibles</p>
                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-3xl font-bold text-red-500"
                  >
                    50
                  </motion.p>
                </div>
              </div>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  <CountUp end={2547} duration={2.5} />+
                </p>
                <p className="text-gray-600 text-sm">Entreprises aidées</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <Euro className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  €<CountUp end={847000} duration={2.5} separator="," />
                </p>
                <p className="text-gray-600 text-sm">Économies générées</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  <CountUp end={98} duration={2.5} />%
                </p>
                <p className="text-gray-600 text-sm">Satisfaction clients</p>
              </div>
            </motion.div>

            {/* Main CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('consent-section').scrollIntoView({ behavior: 'smooth' })}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl transition-all"
              >
                Commencer l'estimation gratuite →
              </motion.button>

              <p className="text-gray-600 text-sm">
                ✅ Pas de carte bancaire requise • ⏱️ 2 minutes • 🔒 Données sécurisées
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comment ça marche?
            </h2>
            <p className="text-xl text-gray-600">
              3 étapes simples pour économiser jusqu'à 20%
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '1',
                title: 'Répondez à 2 minutes de questions',
                description: 'Décrivez vos dépenses actuelles en télécommunications'
              },
              {
                step: '2',
                title: 'Notre IA analyse vos données',
                description: 'Nous comparons plus de 500 offres pour trouver la meilleure'
              },
              {
                step: '3',
                title: 'Recevez vos recommandations',
                description: 'Découvrez vos économies potentielles et nos meilleures offres'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative"
              >
                <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 h-full">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:flex absolute top-1/4 -right-4 items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold z-10">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== VIDEO TESTIMONIAL SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que nos clients disent
            </h2>
            <p className="text-xl text-gray-600">
              Des résultats réels de vrais clients
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          >
            <div className="relative bg-gray-900 aspect-video flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full"
                >
                  <Play className="w-8 h-8 text-white fill-white" />
                </motion.div>
              </motion.div>

              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=675&fit=crop"
                alt="Testimonial"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                "TelecomAudit nous a permis d'économiser €47,000 par an simplement en optimisant nos offres télécom. C'est incroyable! Le processus a été simple et rapide, et les recommandations étaient très pertinentes pour notre entreprise."
              </p>

              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop"
                  alt="Jean Dupont"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-gray-900">Jean Dupont</p>
                  <p className="text-sm text-gray-600">CTO, TechStartup Inc.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi nous choisir?
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
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
                description="Solutions télécoms et cybersécurité intégrées dans une seule offre"
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
        </div>
      </section>

      {/* ===== AI ANIMATION SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AIAnimation />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                L'Intelligence Artificielle au Service de Vos Économies
              </h3>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Notre IA analyse en continu plus de 500 offres télécom et cybersécurité pour identifier les meilleures opportunités d'économies adaptées à votre profil d'entreprise. Aucune offre ne vous échappe.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== CONSENT SECTION ===== */}
      <section id="consent-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Prêt à commencer?
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Compléter ces informations pour obtenir votre audit personnalisé
              </p>

              <div className="space-y-6">
                {/* Contact Consent */}
                <div className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.contact}
                      onChange={() => handleConsentChange('contact')}
                      className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        <strong>J'autorise TelecomAudit</strong> à analyser mes coûts et, si une meilleure offre est trouvée, à transmettre mes coordonnées à l'opérateur retenu. Je peux retirer mon consentement à tout moment.
                      </p>
                    </div>
                  </label>
                  {errors.contact && (
                    <p className="text-red-600 text-sm mt-3 ml-8 flex items-center">
                      <span className="mr-2">❌</span>{errors.contact}
                    </p>
                  )}
                </div>

                {/* Professional Status */}
                <div className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.professional}
                      onChange={() => handleConsentChange('professional')}
                      className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        <strong>Je confirme être un professionnel</strong> et souhaiter optimiser les coûts télécoms/cybersécurité de mon entreprise. Cette estimation est réservée aux professionnels.
                      </p>
                    </div>
                  </label>
                  {errors.professional && (
                    <p className="text-red-600 text-sm mt-3 ml-8 flex items-center">
                      <span className="mr-2">❌</span>{errors.professional}
                    </p>
                  )}
                </div>
              </div>

              {/* GDPR Notice */}
              <div className="mt-8 p-5 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-blue-900 mb-1">
                      Protection de vos données (RGPD)
                    </h3>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Vos données sont traitées conformément au RGPD. Elles ne seront utilisées que pour vous proposer nos services télécom et ne seront jamais vendues à des tiers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
                    isFormValid
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Démarrer l'estimation</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
                </p>
              </div>
            </Card>

            {/* Trust Badges Footer */}
            <div className="mt-12 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Conforme RGPD</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm">Données sécurisées</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm">100% gratuit</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ImprovedWelcomeConsent;
