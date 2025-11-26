import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { validateBudgetInputs } from '../utils/calculations';

const BudgetForm = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
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
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      id: 'fixedBudget',
      type: 'number',
      title: 'Quel est votre budget téléphonie fixe mensuel?',
      description: 'Lignes fixes, standard, communications nationales/internationales',
      placeholder: '150',
      unit: '€/mois',
      hint: 'Montant approximatif'
    },
    {
      id: 'internetBudget',
      type: 'number',
      title: 'Quel est votre budget internet mensuel?',
      description: 'Connexions internet, liaisons spécialisées, backup 4G/5G',
      placeholder: '80',
      unit: '€/mois',
      hint: 'Montant approximatif'
    },
    {
      id: 'phoneSystem',
      type: 'select',
      title: 'Quel est votre standard téléphonique?',
      description: 'Cela nous aide à calculer vos économies',
      options: [
        { value: 'rental', label: 'En location', desc: 'Loué chez un opérateur' },
        { value: 'purchase', label: 'Acheté', desc: 'Équipement en propriété' },
        { value: 'none', label: 'Aucun', desc: 'Pas de standard' }
      ]
    },
    {
      id: 'cybersecurity',
      type: 'select',
      title: 'Avez-vous une solution cybersécurité?',
      description: 'Antivirus, firewall, sécurité réseau...',
      options: [
        { value: 'yes', label: 'Oui', desc: 'Solution déployée' },
        { value: 'no', label: 'Non', desc: 'Aucune' },
        { value: 'unsure', label: 'Je ne sais pas', desc: 'Incertain' }
      ]
    },
    {
      id: 'companySize',
      type: 'select',
      title: 'Combien d\'employés avez-vous?',
      description: 'Cela nous aide à personnaliser notre analyse',
      options: [
        { value: '0-5', label: '0 à 5', desc: 'Micro-entreprise' },
        { value: '5-10', label: '5 à 10', desc: 'Petite équipe' },
        { value: '10-20', label: '10 à 20', desc: 'PME' },
        { value: '20+', label: '20+', desc: 'Entreprise' }
      ]
    },
    {
      id: 'multiSite',
      type: 'boolean',
      title: 'Avez-vous plusieurs sites ou bureaux?',
      description: 'Cela affecte le calcul de vos économies'
    }
  ];

  // Si cybersecurity === 'yes', ajouter la question du budget cybersécurité
  const displayQuestions = formData.cybersecurity === 'yes' && currentQuestion === 4
    ? [
        ...questions.slice(0, 4),
        {
          id: 'cybersecurityBudget',
          type: 'number',
          title: 'Quel est votre budget cybersécurité mensuel?',
          description: 'Antivirus, firewall, formations de sécurité...',
          placeholder: '50',
          unit: '€/mois',
          hint: 'Montant approximatif'
        },
        ...questions.slice(4)
      ]
    : questions;

  const question = displayQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / displayQuestions.length) * 100;

  const handleNumberChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [question.id]: value
    }));
    if (errors[question.id]) {
      setErrors(prev => ({ ...prev, [question.id]: '' }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [question.id]: value
    }));
    if (errors[question.id]) {
      setErrors(prev => ({ ...prev, [question.id]: '' }));
    }
  };

  const handleBooleanChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [question.id]: value
    }));
  };

  const handleNext = () => {
    // Validation simple
    const fieldValue = formData[question.id];
    
    if (question.type === 'number') {
      if (!fieldValue || fieldValue === '') {
        setErrors(prev => ({ ...prev, [question.id]: 'Ce champ est requis' }));
        return;
      }
      if (isNaN(fieldValue) || fieldValue < 0) {
        setErrors(prev => ({ ...prev, [question.id]: 'Veuillez entrer un montant valide' }));
        return;
      }
    } else if (question.type === 'select') {
      if (!fieldValue) {
        setErrors(prev => ({ ...prev, [question.id]: 'Veuillez sélectionner une option' }));
        return;
      }
    }

    if (currentQuestion < displayQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Form complete
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

      setCompleted(true);
      setTimeout(() => {
        navigate('/role');
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigate('/');
    }
  };

  const isValid = () => {
    if (question.type === 'number') {
      return formData[question.id] && !isNaN(formData[question.id]) && formData[question.id] >= 0;
    } else if (question.type === 'select') {
      return formData[question.id] !== '';
    } else if (question.type === 'boolean') {
      return true; // Always valid
    }
    return false;
  };

  // Completion screen
  if (completed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-8 h-8 text-blue-600" strokeWidth={3} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Parfait!
          </h1>
          <p className="text-lg text-gray-600">
            Nous analysons vos données...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">TelecomAudit</div>
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} sur {displayQuestions.length}
          </div>
        </div>
        <motion.div
          className="h-1 bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-8 px-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Question Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {question.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {question.description}
                </p>
              </div>

              {/* Question Content */}
              <div className="mb-12">
                {question.type === 'number' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative mb-3">
                      <input
                        type="number"
                        placeholder={question.placeholder}
                        value={formData[question.id]}
                        onChange={(e) => handleNumberChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && isValid() && handleNext()}
                        className={`w-full text-center text-5xl md:text-6xl font-light bg-white border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none py-8 transition ${
                          errors[question.id] ? 'border-red-300' : ''
                        }`}
                        autoFocus
                      />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl text-gray-400 font-light">
                        {question.unit}
                      </div>
                    </div>
                    {errors[question.id] && (
                      <p className="text-red-600 text-sm text-center mt-4">
                        {errors[question.id]}
                      </p>
                    )}
                    <p className="text-center text-sm text-gray-500 mt-6">
                      {question.hint}
                    </p>
                  </motion.div>
                )}

                {question.type === 'select' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    {question.options.map((option, idx) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        onClick={() => handleSelectChange(option.value)}
                        className={`w-full p-6 text-left rounded-xl border-2 transition-all ${
                          formData[question.id] === option.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {option.label}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {option.desc}
                            </p>
                          </div>
                          {formData[question.id] === option.value && (
                            <div className="flex-shrink-0 ml-4">
                              <Check className="w-6 h-6 text-blue-600" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {question.type === 'boolean' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    {[
                      { value: true, label: 'Oui', desc: 'Nous avons plusieurs sites' },
                      { value: false, label: 'Non', desc: 'Un seul site' }
                    ].map((option, idx) => (
                      <motion.button
                        key={String(option.value)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        onClick={() => {
                          handleBooleanChange(option.value);
                          // Auto-advance on boolean selection
                          setTimeout(() => handleNext(), 300);
                        }}
                        className={`w-full p-6 text-left rounded-xl border-2 transition-all ${
                          formData[question.id] === option.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {option.label}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {option.desc}
                            </p>
                          </div>
                          {formData[question.id] === option.value && (
                            <div className="flex-shrink-0 ml-4">
                              <Check className="w-6 h-6 text-blue-600" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer - Buttons */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 sm:p-6"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
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
            onClick={handleNext}
            disabled={!isValid()}
            whileHover={isValid() ? { scale: 1.05 } : {}}
            whileTap={isValid() ? { scale: 0.95 } : {}}
            className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition ${
              isValid()
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{currentQuestion === displayQuestions.length - 1 ? 'Terminer' : 'Suivant'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Safety margin for mobile */}
      <div className="h-24 sm:h-20" />
    </div>
  );
};

export default BudgetForm;
