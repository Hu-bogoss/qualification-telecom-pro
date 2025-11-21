import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Wifi, Shield, Building, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { StepProgress } from '../components/ProgressBar';
import { validateBudgetInputs } from '../utils/calculations';
import { fadeInUp, containerVariants, itemVariants } from '../utils/motion';

const BudgetForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fixedBudget: '',
    internetBudget: '',
    phoneSystem: '',
    cybersecurity: '',
    cybersecurityBudget: '',
    companySize: '',
    multiSite: false
  });
  const [errors, setErrors] = useState({});
  const [showTooltips, setShowTooltips] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleTooltip = (field) => {
    setShowTooltips(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = () => {
    const validation = validateBudgetInputs(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Store form data
    localStorage.setItem('budgetData', JSON.stringify({
      ...formData,
      totalBudget: validation.totalBudget,
      isEligible: validation.isEligible
    }));

    navigate('/role');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <motion.div {...fadeInUp} className="mb-8">
          <StepProgress currentStep={2} totalSteps={4} />
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 mb-4 font-heading"
          >
            Évaluez votre budget télécom actuel
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Renseignez vos coûts mensuels pour calculer vos économies potentielles
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.div {...fadeInUp}>
          <Card className="p-8">
            <div className="space-y-8">
              {/* Telecom Budgets */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Fixed Telephony Budget */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <label className="text-sm font-medium text-gray-900">
                      Budget téléphonie fixe mensuel *
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('fixed')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </div>

                  {showTooltips.fixed && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                      Inclut : lignes fixes, standard téléphonique, communications nationales/internationales
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Ex: 150"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.fixedBudget ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.fixedBudget}
                      onChange={(e) => handleInputChange('fixedBudget', e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€/mois</span>
                  </div>
                  {errors.fixedBudget && (
                    <p className="text-red-600 text-sm mt-1">{errors.fixedBudget}</p>
                  )}
                </div>

                {/* Internet Budget */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    <label className="text-sm font-medium text-gray-900">
                      Budget internet mensuel *
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('internet')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </div>

                  {showTooltips.internet && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                      Inclut : connexions internet, liaisons spécialisées, backup 4G/5G
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Ex: 80"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.internetBudget ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.internetBudget}
                      onChange={(e) => handleInputChange('internetBudget', e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€/mois</span>
                  </div>
                  {errors.internetBudget && (
                    <p className="text-red-600 text-sm mt-1">{errors.internetBudget}</p>
                  )}
                </div>
              </div>

              {/* Phone System */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <label className="text-sm font-medium text-gray-900">
                    Votre standard téléphonique actuel
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'rental', label: 'En location', desc: 'Loué chez un opérateur' },
                    { value: 'purchase', label: 'Acheté', desc: 'Équipement en propriété' },
                    { value: 'none', label: 'Aucun', desc: 'Pas de standard' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.phoneSystem === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="phoneSystem"
                        value={option.value}
                        checked={formData.phoneSystem === option.value}
                        onChange={(e) => handleInputChange('phoneSystem', e.target.value)}
                        className="sr-only"
                      />
                      <span className="font-medium text-gray-900">{option.label}</span>
                      <span className="text-sm text-gray-600 mt-1">{option.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cybersecurity */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <label className="text-sm font-medium text-gray-900">
                    Avez-vous une solution cybersécurité ?
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'yes', label: 'Oui', desc: 'Solution déployée' },
                    { value: 'no', label: 'Non', desc: 'Aucune protection' },
                    { value: 'unsure', label: 'Je ne sais pas', desc: 'Incertain de la couverture' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.cybersecurity === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cybersecurity"
                        value={option.value}
                        checked={formData.cybersecurity === option.value}
                        onChange={(e) => handleInputChange('cybersecurity', e.target.value)}
                        className="sr-only"
                      />
                      <span className="font-medium text-gray-900">{option.label}</span>
                      <span className="text-sm text-gray-600 mt-1">{option.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cybersecurity Budget - Conditional */}
              {formData.cybersecurity === 'yes' && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <label className="text-sm font-medium text-gray-900">
                      Budget cybersécurité mensuel *
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('cybersecurity')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </div>

                  {showTooltips.cybersecurity && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                      Inclut : antivirus, firewall, solutions de sécurité réseau, formations sécurité
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Ex: 50"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cybersecurityBudget ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.cybersecurityBudget}
                      onChange={(e) => handleInputChange('cybersecurityBudget', e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€/mois</span>
                  </div>
                  {errors.cybersecurityBudget && (
                    <p className="text-red-600 text-sm mt-1">{errors.cybersecurityBudget}</p>
                  )}
                </div>
              )}

              {/* Company Info */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Company Size */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Building className="h-5 w-5 text-blue-600" />
                    <label className="text-sm font-medium text-gray-900">
                      Nombre d'employés *
                    </label>
                  </div>

                  <select
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.companySize ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formData.companySize}
                    onChange={(e) => handleInputChange('companySize', e.target.value)}
                  >
                    <option value="">Sélectionnez une tranche</option>
                    <option value="0-5">0 à 5 employés</option>
                    <option value="5-10">5 à 10 employés</option>
                    <option value="10-20">10 à 20 employés</option>
                    <option value="20+">Plus de 20 employés</option>
                  </select>
                  {errors.companySize && (
                    <p className="text-red-600 text-sm mt-1">{errors.companySize}</p>
                  )}
                </div>

                {/* Multi-site */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Building className="h-5 w-5 text-blue-600" />
                    <label className="text-sm font-medium text-gray-900">
                      Entreprise multi-sites ?
                    </label>
                  </div>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.multiSite}
                      onChange={(e) => handleInputChange('multiSite', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-900">Oui, nous avons plusieurs sites/bureaux</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={handleBack}
                variant="ghost"
                icon={ArrowLeft}
              >
                Retour
              </Button>

              <Button
                onClick={handleSubmit}
                icon={ArrowRight}
              >
                Continuer
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetForm;