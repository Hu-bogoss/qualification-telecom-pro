import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Wifi, Shield, Building, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import Card from '../components/Card';
import { validateBudgetInputs } from '../utils/calculations';

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
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

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

  const budgetItems = [
    {
      id: 'fixedBudget',
      icon: Phone,
      label: 'Budget téléphonie fixe mensuel',
      placeholder: 'Ex: 150',
      tooltip: 'Inclut: lignes fixes, standard téléphonique, communications nationales/internationales',
      required: true
    },
    {
      id: 'internetBudget',
      icon: Wifi,
      label: 'Budget internet mensuel',
      placeholder: 'Ex: 80',
      tooltip: 'Inclut: connexions internet, liaisons spécialisées, backup 4G/5G',
      required: true
    }
  ];

  const phoneSystemOptions = [
    { value: 'rental', label: 'En location', desc: 'Loué chez un opérateur' },
    { value: 'purchase', label: 'Acheté', desc: 'Équipement en propriété' },
    { value: 'none', label: 'Aucun', desc: 'Pas de standard' }
  ];

  const cybersecurityOptions = [
    { value: 'yes', label: 'Oui', desc: 'Solution déployée' },
    { value: 'no', label: 'Non', desc: 'Aucune protection' },
    { value: 'unsure', label: 'Je ne sais pas', desc: 'Incertain' }
  ];

  const companySizeOptions = [
    { value: '0-5', label: '0 à 5 employés' },
    { value: '5-10', label: '5 à 10 employés' },
    { value: '10-20', label: '10 à 20 employés' },
    { value: '20+', label: 'Plus de 20 employés' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">TelecomAudit</div>
          <div className="text-sm text-gray-600">Étape 2/4</div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="fixed top-16 w-full h-1 bg-gray-100 z-40">
        <motion.div
          initial={{ width: '25%' }}
          animate={{ width: '50%' }}
          transition={{ duration: 0.5 }}
          className="h-full bg-blue-600"
        />
      </div>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Vos dépenses actuelles
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Renseignez vos coûts mensuels pour calculer vos économies potentielles
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12"
          >
            <div className="space-y-12">
              {/* Budget Inputs */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-8">
                  Budget mensuel
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {budgetItems.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                      >
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <label className="text-sm font-semibold text-gray-900">
                            {item.label}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => toggleTooltip(item.id)}
                            className="text-gray-400 hover:text-gray-600 transition"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </div>

                        {showTooltips[item.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700"
                          >
                            {item.tooltip}
                          </motion.div>
                        )}

                        <div className="relative">
                          <input
                            type="number"
                            placeholder={item.placeholder}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                              errors[item.id] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                            }`}
                            value={formData[item.id]}
                            onChange={(e) => handleInputChange(item.id, e.target.value)}
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            €/mois
                          </span>
                        </div>
                        {errors[item.id] && (
                          <p className="text-red-600 text-sm mt-2">{errors[item.id]}</p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Phone System */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Votre standard téléphonique
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {phoneSystemOptions.map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.phoneSystem === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
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
                      <span className="font-semibold text-gray-900">{option.label}</span>
                      <span className="text-sm text-gray-600 mt-1">{option.desc}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Cybersecurity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cybersécurité
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  {cybersecurityOptions.map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.cybersecurity === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
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
                      <span className="font-semibold text-gray-900">{option.label}</span>
                      <span className="text-sm text-gray-600 mt-1">{option.desc}</span>
                    </motion.label>
                  ))}
                </div>

                {/* Cybersecurity Budget - Conditional */}
                {formData.cybersecurity === 'yes' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <label className="text-sm font-semibold text-gray-900">
                        Budget cybersécurité mensuel
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleTooltip('cybersecurityBudget')}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </div>

                    {showTooltips.cybersecurityBudget && (
                      <div className="mb-4 p-3 bg-white border border-blue-200 rounded-lg text-sm text-blue-700">
                        Inclut: antivirus, firewall, solutions de sécurité réseau, formations sécurité
                      </div>
                    )}

                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Ex: 50"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.cybersecurityBudget ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        value={formData.cybersecurityBudget}
                        onChange={(e) => handleInputChange('cybersecurityBudget', e.target.value)}
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        €/mois
                      </span>
                    </div>
                    {errors.cybersecurityBudget && (
                      <p className="text-red-600 text-sm mt-2">{errors.cybersecurityBudget}</p>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Informations entreprise
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Company Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                      Nombre d'employés <span className="text-red-500">*</span>
                    </label>

                    <select
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.companySize ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                      }`}
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                    >
                      <option value="">Sélectionnez une tranche</option>
                      {companySizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.companySize && (
                      <p className="text-red-600 text-sm mt-2">{errors.companySize}</p>
                    )}
                  </div>

                  {/* Multi-site */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                      Structure
                    </label>

                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.multiSite
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.multiSite}
                        onChange={(e) => handleInputChange('multiSite', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="font-semibold text-gray-900">
                        Entreprise multi-sites
                      </span>
                    </motion.label>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-semibold transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition"
              >
                <span>Continuer</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center text-sm text-blue-700"
          >
            💡 Vos données sont sécurisées et conformes au RGPD
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;
