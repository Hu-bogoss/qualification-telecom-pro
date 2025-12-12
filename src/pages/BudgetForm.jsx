import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, AlertCircle } from 'lucide-react';

const BudgetForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [budgetData, setBudgetData] = useState({
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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
    const question = questions[step];
    const value = budgetData[question.id];

    if (!value && value !== 0) {
      setErrors({ [question.id]: 'Requis' });
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

    if (step < questions.length - 1) {
      setStep(step + 1);
      setIsAutoAdvancing(true);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    localStorage.setItem('budgetData', JSON.stringify(budgetData));

    try {
      await fetch('https://qualification-telecom-backend-production.up.railway.app/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: budgetData.company,
          firstName: '',
          lastName: '',
          email: budgetData.email,
          phone: '',
          operator: budgetData.operator,
          fixedBudget: parseInt(budgetData.fixedBudget) || 0,
          internetBudget: parseInt(budgetData.internetBudget) || 0,
          cybersecurityBudget: parseInt(budgetData.cybersecurityBudget) || 0,
          totalBudget: budgetData.totalBudget,
          companySize: budgetData.companySize,
          multiSite: false,
          cybersecurity: budgetData.cybersecurity,
          status: 'pending',
          source: 'form_budget',
          consentContact: true
        })
      });
    } catch (error) {
      console.error('Backend error:', error);
    }

    navigate('/results');
  };

  useEffect(() => {
    if (isAutoAdvancing && step < questions.length - 1) {
      const timer = setTimeout(() => {
        handleNext();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isAutoAdvancing, step]);

  const currentQ = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-600">
                {step + 1}/{questions.length}
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

          <motion.div
            key={step}
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <span>{step === questions.length - 1 ? 'Analyser' : 'Suivant'}</span>
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetForm;
