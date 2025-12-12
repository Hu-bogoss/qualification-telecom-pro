import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, AlertCircle } from 'lucide-react';

const BudgetForm = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [budgetData, setBudgetData] = useState({
    company: '',
    email: '',
    operator: 'orange',
    operatorOther: '',
    fixedBudget: '',
    internetBudget: '',
    cybersecurityBudget: '',
    companySize: '5-10',
    multiSites: false,
    cybersecurity: 'unsure',
    totalBudget: 0,
    isEligible: false,
    timestamp: new Date().toISOString()
  });
  const [errors, setErrors] = useState({});
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      id: 'company',
      label: 'Quel est le nom de votre entreprise?',
      type: 'text',
      placeholder: 'Ex: TechCorp SARL'
    },
    {
      id: 'fixedBudget',
      label: 'Budget mensuel téléphonie fixe? (€)',
      type: 'number',
      placeholder: '0'
    },
    {
      id: 'internetBudget',
      label: 'Budget mensuel internet? (€)',
      type: 'number',
      placeholder: '0'
    },
    {
      id: 'cybersecurityBudget',
      label: 'Budget mensuel antivirus? (€)',
      type: 'number',
      placeholder: '0'
    },
    {
      id: 'companySize',
      label: 'Taille de votre entreprise?',
      type: 'select',
      options: [
        { value: '1-5', label: '1-5 employés' },
        { value: '5-10', label: '5-10 employés' },
        { value: '10-50', label: '10-50 employés' },
        { value: '50-250', label: '50-250 employés' },
        { value: '250+', label: '250+ employés' }
      ]
    },
    {
      id: 'email',
      label: 'Votre email?',
      type: 'email',
      placeholder: 'vous@entreprise.fr'
    }
  ];

  const handleInputChange = (field, value) => {
    let newValue = value;
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
      newData.isEligible = fixed < 120 && internet < 150;
    }

    setBudgetData(newData);
    setErrors({ ...errors, [field]: '' });
  };

  const validateStep = () => {
    const question = questions[currentQuestion];
    const value = budgetData[question.id];

    if (!value && value !== 0) {
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
    if (!validateStep()) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAutoAdvancing(true);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    // Sauvegarde locale
    localStorage.setItem('budgetData', JSON.stringify(budgetData));

    // Envoi au Backend (Correction ici : ajout des champs manquants)
    try {
      await fetch('https://qualification-telecom-backend-production.up.railway.app/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: budgetData.company || 'Non renseigné',
          firstName: 'En attente', // AJOUT CRITIQUE POUR LE BACKEND
          lastName: 'En attente',  // AJOUT CRITIQUE POUR LE BACKEND
          email: budgetData.email,
          phone: 'Non renseigné',
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
      console.log('Données envoyées au backend avec succès');
    } catch (error) {
      console.error('Erreur envoi backend:', error);
    }

    setCompleted(true);
    setTimeout(() => {
      navigate('/results');
    }, 2000);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigate('/');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Parfait!</h1>
          <p className="text-lg text-gray-600">Nous analysons vos données...</p>
        </motion.div>
      </div>
    );
  }

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
                {currentQuestion + 1}/{questions.length}
              </p>
              <p className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
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
            
            <div className="mb-6">
              {currentQ.type === 'text' && (
                <input
                  type="text"
                  value={budgetData[currentQ.id]}
                  onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
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
                  <option value="">Sélectionner...</option>
                  {currentQ.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {errors[currentQ.id] && (
                <div className="flex items-center space-x-2 mt-3 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{errors[currentQ.id]}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              <ArrowLeft className="h-5 w-5" />
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
