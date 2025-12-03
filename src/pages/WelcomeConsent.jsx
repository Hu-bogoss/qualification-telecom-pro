import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';
import Card from '../components/Card';

const WelcomeConsent = () => {
  const navigate = useNavigate();
  const [consents, setConsents] = useState({
    contact: false,
    professional: false
  });
  const [errors, setErrors] = useState({});
  const timerInitializedRef = useRef(false);

  // Countdown timer - Only initialize ONCE
  useEffect(() => {
    if (timerInitializedRef.current) return;
    timerInitializedRef.current = true;

    const timer = setInterval(() => {
      // Timer logic if needed
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      consents: consents
    };
    localStorage.setItem('userConsent', JSON.stringify(consentData));
    navigate('/budget');
  };

  const isFormValid = consents.contact && consents.professional;

  // Operators data
  const operators = [
    { name: 'Orange', logo: '🟠', color: '#FF6600' },
    { name: 'SFR', logo: '🔴', color: '#FF0000' },
    { name: 'Bouygues', logo: '🔵', color: '#0066FF' },
    { name: 'Free', logo: '⚫', color: '#000000' },
    { name: 'Crosscall', logo: '🟢', color: '#00AA00' },
    { name: 'Autres', logo: '⭐', color: '#666666' }
  ];

  const steps = [
    {
      number: '1',
      title: 'Sélectionnez votre opérateur',
      description: 'Orange, SFR, Bouygues, Free ou autre'
    },
    {
      number: '2',
      title: 'Analysez vos dépenses',
      description: 'Répondez à quelques questions rapides'
    },
    {
      number: '3',
      title: 'Découvrez les meilleures offres',
      description: 'On analyse plus de 500 alternatives'
    },
    {
      number: '4',
      title: 'Mises en contact direct',
      description: 'Nous vous mettons en relation avec les fournisseurs'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ===== NAVIGATION ===== */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">TelecomAudit</div>
          <div className="text-sm text-gray-600">Trouvez la meilleure offre</div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Économisez sur votre forfait
              <br />
              <span className="text-blue-600">peu importe votre opérateur</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Vous êtes chez Orange, SFR, Bouygues ou Free? On analyse plus de 500 offres pour trouver la meilleure pour vous. Et on vous met en contact direct avec les fournisseurs.
            </p>
          </motion.div>

          {/* Operators Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-12"
          >
            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wide">
              Nous travaillons avec tous les opérateurs
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
              {operators.map((op, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors bg-gray-50 hover:bg-blue-50"
                >
                  <div className="text-3xl mb-2">{op.logo}</div>
                  <div className="text-xs font-semibold text-gray-700 text-center">{op.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/budget')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all inline-flex items-center space-x-2"
            >
              <span>Commencer l'analyse</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <p className="text-sm text-gray-500">
            ✓ Gratuit • ✓ Pas de carte bancaire • ✓ 2 minutes
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche?
            </h2>
            <p className="text-lg text-gray-600">
              4 étapes simples pour économiser
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-6 mx-auto">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 -right-4 w-8 h-8 text-blue-300">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyse complète
              </h3>
              <p className="text-gray-600 text-sm">
                Plus de 500 offres télécom analysées en temps réel
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contact direct
              </h3>
              <p className="text-gray-600 text-sm">
                Nous vous mettons en relation avec les meilleurs fournisseurs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Données sécurisées
              </h3>
              <p className="text-gray-600 text-sm">
                100% RGPD compliant. Vos données ne seront jamais vendues
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Pourquoi nous choisir?
              </h2>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0, duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Économies réelles
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Nos clients économisent en moyenne 8 à 20% par an
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Gratuit et sans engagement
                    </h3>
                    <p className="text-gray-600 text-sm">
                      L'analyse est 100% gratuite, aucun engagement requis
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Experts en télécom
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Notre équipe maîtrise tous les contrats et offres du marché
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Suivi personnalisé
                    </h3>
                    <p className="text-gray-600 text-sm">
                      On vous accompagne jusqu'à la signature du nouveau contrat
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-8 border border-gray-200"
            >
              <div className="space-y-6">
                <div>
                  <p className="text-5xl font-bold text-blue-600 mb-2">8-20%</p>
                  <p className="text-gray-600">
                    Économies moyennes par an
                  </p>
                </div>

                <div className="h-px bg-gray-200"></div>

                <div>
                  <p className="text-5xl font-bold text-blue-600 mb-2">2 min</p>
                  <p className="text-gray-600">
                    Temps pour compléter l'analyse
                  </p>
                </div>

                <div className="h-px bg-gray-200"></div>

                <div>
                  <p className="text-5xl font-bold text-blue-600 mb-2">500+</p>
                  <p className="text-gray-600">
                    Offres analysées en temps réel
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FORM SECTION ===== */}
      <section id="form-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Prêt à commencer?
              </h2>
              <p className="text-lg text-gray-600">
                Quelques informations pour lancer l'analyse
              </p>
            </div>

            <Card className="p-8 border border-gray-200">
              <div className="space-y-6">
                {/* Contact Consent */}
                <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.contact}
                      onChange={() => handleConsentChange('contact')}
                      className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        <strong>J'accepte</strong> que TelecomAudit analyse mes dépenses télécom et me mette en contact avec les meilleurs fournisseurs. Je peux retirer mon consentement à tout moment.
                      </p>
                    </div>
                  </label>
                  {errors.contact && (
                    <p className="text-red-600 text-sm mt-3 ml-8">❌ {errors.contact}</p>
                  )}
                </div>

                {/* Professional Status */}
                <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.professional}
                      onChange={() => handleConsentChange('professional')}
                      className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        <strong>Je confirme</strong> être un professionnel et que cette demande concerne mon entreprise.
                      </p>
                    </div>
                  </label>
                  {errors.professional && (
                    <p className="text-red-600 text-sm mt-3 ml-8">❌ {errors.professional}</p>
                  )}
                </div>
              </div>

              {/* GDPR Notice */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  🔒 Vos données sont protégées conformément au RGPD. Elles ne seront jamais vendues à des tiers.
                </p>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-all ${
                    isFormValid
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Commencer l'analyse</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Gratuit • Sans engagement • Analyse en 2 minutes
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">À propos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">À propos de nous</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Notre mission</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Conditions d'utilisation</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Politique de confidentialité</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Cookies</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">FAQ</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Email: hello@telecomaudit.fr</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Suivez-nous</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">LinkedIn</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Twitter</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Facebook</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© 2024 TelecomAudit. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeConsent;
