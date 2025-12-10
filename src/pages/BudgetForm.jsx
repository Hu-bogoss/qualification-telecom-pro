import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

const BudgetForm = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [budgetData, setBudgetData] = useState({
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    operator: '',
    operatorOther: '',
    fixedBudget: '',
    internetBudget: '',
    cybersecurityBudget: '',
    companySize: '',
    multiSites: false,
    cybersecurity: '',
    totalBudget: 0,
    isEligible: false,
    timestamp: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  const questions = [
    {
      id: 'company',
      label: 'Quel est le nom de votre entreprise?',
      type: 'text',
      placeholder: 'Ex: TechCorp SARL'
    },
    {
      id: 'firstName',
      label: 'Quel est votre prénom?',
      type: 'text',
      placeholder: 'Votre prénom'
    },
    {
      id: 'lastName',
      label: 'Quel est votre nom?',
      type: 'text',
      placeholder: 'Votre nom'
    },
    {
      id: 'email',
      label: 'Quel est votre email?',
      type: 'email',
      placeholder: 'vous@entreprise.fr'
    },
    {
      id: 'phone',
      label: 'Quel est votre téléphone?',
      type: 'tel',
      placeholder: '+33 1 23 45 67 89'
    },
    {
      id: 'operator',
      label: 'Quel est votre opérateur téléphonique actuel?',
      type: 'select',
      options: [
        { value: '', label: 'Sélectionner...' },
        { value: 'orange', label: 'Orange' },
        { value: 'sfr', label: 'SFR' },
        { value: 'bouygues', label: 'Bouygues' },
        { value: 'free', label: 'Free' },
        { value: 'autre', label: 'Autre' }
      ]
    },
    {
      id: 'fixedBudget',
      label: 'Quel est votre budget mensuel pour la téléphonie fixe? (€)',
      type: 'number',
      placeholder: '0'
    },
    {
      id: 'internetBudget',
      label: 'Quel est votre budget mensuel pour l\'internet? (€)',
      type: 'number',
      placeholder: '0'
    },
    {
      id: 'cybersecurityBudget',
      label: 'Quel est votre budget mensuel pour l\'antivirus/cybersécurité? (€)',
      type: 'number',
      placeholder: '0'
    },
    {
      id: 'companySize',
      label: 'Quelle est la taille de votre entreprise?',
      type: 'select',
      options: [
        { value: '', label: 'Sélectionner...' },
        { value: '1-5', label: '1-5 employés' },
        { value: '5-10', label: '5-10 employés' },
        { value: '10-50', label: '10-50 employés' },
        { value: '50-250', label: '50-250 employés' },
        { value: '250+', label: '250+ employés' }
      ]
    },
    {
      id: 'multiSites',
      label: 'Avez-vous plusieurs sites?',
      type: 'radio',
      options: [
        { value: false, label: 'Non' },
        { value: true, label: 'Oui' }
      ]
    },
    {
      id: 'cybersecurity',
      label: 'Avez-vous une solution antivirus/cybersécurité?',
      type: 'select',
      options: [
        { value: '', label: 'Sélectionner...' },
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
        { value: 'unsure', label: 'Je ne sais pas' }
      ]
    }
  ];

  const handleInputChange = (field, value) => {
    let newValue = value;
    
    if (field === 'multiSites') {
      newValue = value === 'true' || value === true;
    }

    const newData = {
      ...budgetData,
      [field]: newValue,
      timestamp: new Date().toISOString()
    };

    if (field === 'fixedBudget' || field === 'internetBudget' || field === 'cybersecurityBudget') {
      const fixed = parseInt(newData.fixedBudget) || 0;
      const internet = parseInt(newData.internetBudget) || 0;
      const cyber = parseInt(newData.cybersecurityBudget) || 0;
      newData.totalBudget = fixed + internet + cyber;
    }

    setBudgetData(newData);
    setErrors({ ...errors, [field]: '' });
  };

  const validateQuestion = () => {
    const question = questions[currentQuestion];
    const value = budgetData[question.id];

    if (!value && value !== 0 && value !== false) {
      setErrors({ [question.id]: 'Ce champ est requis' });
      return false;
    }

    if (question.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors({ email: 'Email invalide' });
        return false;
      }
    }

    setErrors({});
    return true;
  };

  const handleNext = async () => {
    if (!validateQuestion()) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAutoAdvancing(false);
    } else {
      await handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setIsAutoAdvancing(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateQuestion()) return;

    // Sauvegarder dans localStorage
    localStorage.setItem('budgetData', JSON.stringify(budgetData));

    // Envoyer au backend
    try {
      const response = await fetch('https://qualification-telecom-backend-production.up.railway.app/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: budgetData.company,
          firstName: budgetData.firstName,
          lastName: budgetData.lastName,
          email: budgetData.email,
          phone: budgetData.phone,
          operator: budgetData.operator,
          fixedBudget: parseInt(budgetData.fixedBudget) || 0,
          internetBudget: parseInt(budgetData.internetBudget) || 0,
          cybersecurityBudget: parseInt(budgetData.cybersecurityBudget) || 0,
          totalBudget: budgetData.totalBudget,
          companySize: budgetData.companySize,
          multiSite: budgetData.multiSites,
          cybersecurity: budgetData.cybersecurity,
          status: 'pending',
          source: 'form_budget',
          consentContact: true
        })
      });

      const data = await response.json();
      console.log('Lead sauvegardé au backend:', data);
    } catch (error) {
      console.error('Erreur envoi backend:', error);
    }

    navigate('/results');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  useEffect(() => {
    if (isAutoAdvancing && currentQuestion < questions.length - 1) {
      const timer = setTimeout(() => {
        handleNext();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isAutoAdvancing, currentQuestion]);

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-600">
                Question {currentQuestion + 1}/{questions.length}
              </p>
              <p className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQ.label}</h2>

            {/* Input Fields */}
            <div className="mb-6">
              {currentQ.type === 'text' && (
                <input
                  type="text"
                  value={budgetData[currentQ.id]}
                  onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQ.placeholder}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors[currentQ.id] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  autoFocus
                />
              )}

              {currentQ.type === 'email' && (
                <input
                  type="email"
                  value={budgetData[currentQ.id]}
                  onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQ.placeholder}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors[currentQ.id] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  autoFocus
                />
              )}

              {currentQ.type === 'tel' && (
                <input
                  type="tel"
                  value={budgetData[currentQ.id]}
                  onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQ.placeholder}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors[currentQ.id] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  autoFocus
                />
              )}

              {currentQ.type === 'number' && (
                <input
                  type="number"
                  value={budgetData[currentQ.id]}
                  onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQ.placeholder}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors[currentQ.id] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  autoFocus
                />
              )}

              {currentQ.type === 'select' && (
                <select
                  value={budgetData[currentQ.id]}
                  onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors[currentQ.id] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  autoFocus
                >
                  {currentQ.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {currentQ.type === 'radio' && (
                <div className="space-y-3">
                  {currentQ.options.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={currentQ.id}
                        value={option.value}
                        checked={budgetData[currentQ.id] === option.value}
                        onChange={(e) => handleInputChange(currentQ.id, e.target.value === 'true')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-900 font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {errors[currentQ.id] && (
                <div className="flex items-center space-x-2 mt-3 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{errors[currentQ.id]}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Retour</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              <span>{currentQuestion === questions.length - 1 ? 'Analyser' : 'Suivant'}</span>
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetForm;
