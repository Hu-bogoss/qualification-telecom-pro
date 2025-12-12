import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, AlertCircle, Check } from 'lucide-react';

const BudgetForm = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  
  // État initial correspondant à ton schéma Backend
  const [budgetData, setBudgetData] = useState({
    operator: 'orange',
    fixedBudget: '', // Fixe + location
    internetBudget: '', // Mobile / Internet
    cybersecurityBudget: '',
    companySize: '5-10',
    multiSites: false,
    cybersecurity: 'unsure',
    email: '', // Seul contact demandé ici
    totalBudget: 0,
    timestamp: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});

  // Les questions avec ton design Apple/Stripe
  const questions = [
    {
      id: 'operator',
      label: 'Quel est votre opérateur actuel ?',
      type: 'select',
      options: [
        { value: 'orange', label: 'Orange' },
        { value: 'sfr', label: 'SFR' },
        { value: 'bouygues', label: 'Bouygues Telecom' },
        { value: 'free', label: 'Free' },
        { value: 'autre', label: 'Autre' }
      ]
    },
    {
      id: 'fixedBudget',
      label: 'Charge mensuelle Fixe (inclus location matériel) ? (€)',
      type: 'number',
      placeholder: '0'
    },
    {
      id: 'internetBudget',
      label: 'Coût mensuel Mobile / Internet ? (€)',
      type: 'number',
      placeholder: '0'
    },
    {
      id: 'cybersecurity',
      label: 'Avez-vous une solution de cybersécurité ?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
        { value: 'unsure', label: 'Je ne sais pas' }
      ]
    },
    // Cette question ne s'affiche que si cyber == yes
    {
      id: 'cybersecurityBudget',
      label: 'Budget mensuel cybersécurité ? (€)',
      type: 'number',
      placeholder: '0',
      condition: (data) => data.cybersecurity === 'yes'
    },
    {
      id: 'companySize',
      label: 'Taille de votre entreprise ?',
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
      id: 'multiSites',
      label: 'Avez-vous plusieurs sites ou bureaux ?',
      type: 'boolean',
      options: [
        { value: false, label: 'Non' },
        { value: true, label: 'Oui' }
      ]
    },
    {
      id: 'email',
      label: 'Votre email professionnel ?',
      type: 'email',
      placeholder: 'vous@entreprise.com'
    }
  ];

  // Filtrer les questions actives (gestion conditionnelle)
  const activeQuestions = questions.filter(q => !q.condition || q.condition(budgetData));
  const currentQ = activeQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / activeQuestions.length) * 100;

  // Gestion des changements d'inputs
  const handleInputChange = (field, value) => {
    let newValue = value;
    const newData = {
      ...budgetData,
      [field]: newValue,
      timestamp: new Date().toISOString()
    };

    // Calcul automatique du total
    if (['fixedBudget', 'internetBudget', 'cybersecurityBudget'].includes(field)) {
      const fixed = parseInt(newData.fixedBudget) || 0;
      const internet = parseInt(newData.internetBudget) || 0;
      const cyber = parseInt(newData.cybersecurityBudget) || 0;
      newData.totalBudget = fixed + internet + cyber;
    }

    setBudgetData(newData);
    setErrors({ ...errors, [field]: '' });

    // Auto-advance logique (Apple style)
    if (currentQ.type === 'select' || currentQ.type === 'boolean') {
        const timer = setTimeout(() => handleNext(newData), 600); // Rapide pour les choix
        return () => clearTimeout(timer);
    }
  };

  // Validation
  const validateStep = (dataToValidate = budgetData) => {
    const value = dataToValidate[currentQ.id];
    
    if (!value && value !== 0 && value !== false) {
      setErrors({ [currentQ.id]: 'Ce champ est requis' });
      return false;
    }

    if (currentQ.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors({ email: 'Email invalide' });
        return false;
      }
    }
    return true;
  };

  // Navigation Suivant
  const handleNext = async (data = budgetData) => {
    if (!validateStep(data)) return;

    if (currentQuestion < activeQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setIsAutoAdvancing(false);
    } else {
      await handleSubmit(data);
    }
  };

  // Navigation Retour
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  // Auto-advance pour les inputs texte/nombre (délai plus long)
  useEffect(() => {
    if (isAutoAdvancing && currentQuestion < activeQuestions.length - 1) {
      const timer = setTimeout(() => {
        handleNext();
      }, 1400); 
      return () => clearTimeout(timer);
    }
  }, [isAutoAdvancing, currentQuestion]);

  // SOUMISSION FINALE VERS RAILWAY
  const handleSubmit = async (finalData) => {
    // 1. Sauvegarde locale pour la page de résultats
    localStorage.setItem('budgetData', JSON.stringify(finalData));

    // 2. Envoi au Backend Railway
    // NOTE IMPORTANTE: On envoie "A venir" pour les champs requis par le backend (company, name)
    // qui ne sont pas demandés à cette étape pour ne pas casser le flow.
    try {
      await fetch('https://qualification-telecom-backend-production.up.railway.app/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: 'A venir (Étape Budget)', 
          firstName: 'A venir',
          lastName: 'A venir',
          email: finalData.email,
          phone: 'Non renseigné',
          operator: finalData.operator,
          fixedBudget: parseInt(finalData.fixedBudget) || 0,
          internetBudget: parseInt(finalData.internetBudget) || 0,
          cybersecurityBudget: parseInt(finalData.cybersecurityBudget) || 0,
          totalBudget: finalData.totalBudget,
          companySize: finalData.companySize,
          multiSite: finalData.multiSites,
          cybersecurity: finalData.cybersecurity,
          status: 'pending',
          source: 'form_budget',
          consentContact: true
        })
      });
      console.log('Lead budget pré-enregistré sur Railway');
    } catch (error) {
      console.error('Erreur connexion backend:', error);
      // On ne bloque pas l'utilisateur si le backend échoue, on continue vers les résultats
    }

    setCompleted(true);
    setTimeout(() => {
      navigate('/results');
    }, 2000);
  };

  // Écran de chargement de fin
  if (completed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-blue-600" strokeWidth={3} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Analyse en cours...</h1>
          <p className="text-lg text-gray-600">Nos algorithmes comparent vos coûts.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4 py-8">
      <motion.div 
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-600">Question {currentQuestion + 1}/{activeQuestions.length}</p>
              <p className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-600" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          {/* Question Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 min-h-[64px]">
            {currentQ.label}
          </h2>

          {/* Input Area */}
          <div className="mb-8">
            {currentQ.type === 'text' || currentQ.type === 'email' ? (
              <input
                type={currentQ.type}
                value={budgetData[currentQ.id]}
                onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                placeholder={currentQ.placeholder}
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors[currentQ.id] ? 'border-red-500' : 'border-gray-200'}`}
                autoFocus
              />
            ) : currentQ.type === 'number' ? (
              <div className="relative">
                <input
                  type="number"
                  value={budgetData[currentQ.id]}
                  onChange={(e) => {
                    handleInputChange(currentQ.id, e.target.value);
                    if(e.target.value.length > 1) setIsAutoAdvancing(true);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  placeholder="0"
                  className={`w-full px-4 py-4 text-3xl font-bold text-center border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors[currentQ.id] ? 'border-red-500' : 'border-gray-200'}`}
                  autoFocus
                />
              </div>
            ) : currentQ.type === 'select' ? (
              <div className="space-y-3">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleInputChange(currentQ.id, opt.value)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      budgetData[currentQ.id] === opt.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm'
                        : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{opt.label}</span>
                      {budgetData[currentQ.id] === opt.value && <Check className="w-5 h-5" />}
                    </div>
                  </button>
                ))}
              </div>
            ) : currentQ.type === 'boolean' ? (
              <div className="flex space-x-4">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleInputChange(currentQ.id, opt.value)}
                    className={`flex-1 p-6 text-center rounded-xl border-2 transition-all ${
                      budgetData[currentQ.id] === opt.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : null}

            {errors[currentQ.id] && (
              <div className="flex items-center space-x-2 mt-3 text-red-600 animate-pulse">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">{errors[currentQ.id]}</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleBack}
              className="flex items-center justify-center px-6 py-3 text-gray-500 hover:text-gray-800 font-medium transition"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Retour
            </button>
            <button
              onClick={() => handleNext()}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transform hover:scale-[1.02] transition shadow-lg"
            >
              <span>{currentQuestion === activeQuestions.length - 1 ? 'Voir mes résultats' : 'Suivant'}</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default BudgetForm;
