import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Crown, Building, Calculator, Settings, Briefcase, ArrowRight, ArrowLeft, Mail } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { StepProgress } from '../components/ProgressBar';
import { fadeInUp, containerVariants, itemVariants } from '../utils/motion';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = [
    { 
      value: 'Gérant', 
      label: 'Gérant', 
      icon: Crown, 
      description: 'Propriétaire ou gérant de l\'entreprise',
      isDecisionMaker: true 
    },
    { 
      value: 'Président', 
      label: 'Président', 
      icon: Crown, 
      description: 'Président directeur général',
      isDecisionMaker: true 
    },
    { 
      value: 'DG', 
      label: 'Directeur Général', 
      icon: Building, 
      description: 'Direction générale',
      isDecisionMaker: true 
    },
    { 
      value: 'DAF', 
      label: 'Directeur Administratif et Financier', 
      icon: Calculator, 
      description: 'Responsable des finances',
      isDecisionMaker: true 
    },
    { 
      value: 'DSI', 
      label: 'Directeur des Systèmes d\'Information', 
      icon: Settings, 
      description: 'Responsable IT et télécom',
      isDecisionMaker: true 
    },
    { 
      value: 'Autre', 
      label: 'Autre', 
      icon: User, 
      description: 'Autre fonction',
      isDecisionMaker: false 
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.value);
    setErrors({});
    
    if (!role.isDecisionMaker) {
      setShowManagerForm(true);
    } else {
      setShowManagerForm(false);
      setManagerEmail('');
    }
  };

  const handleSubmit = () => {
    const selectedRoleData = roles.find(r => r.value === selectedRole);
    
    if (!selectedRole) {
      setErrors({ role: 'Veuillez sélectionner votre fonction' });
      return;
    }

    if (!selectedRoleData.isDecisionMaker) {
      if (!managerEmail || !managerEmail.includes('@')) {
        setErrors({ managerEmail: 'Veuillez saisir un email valide' });
        return;
      }
      
      // Store non-decision maker data for follow-up
      const nonDecisionMakerData = {
        role: selectedRole,
        managerEmail: managerEmail,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('nonDecisionMakerData', JSON.stringify(nonDecisionMakerData));
      
      // Redirect to a thank you page or show message
      alert('Merci ! Nous contacterons directement votre responsable pour planifier un audit.');
      navigate('/');
      return;
    }

    // Store role data for decision makers
    const roleData = {
      role: selectedRole,
      isDecisionMaker: true
    };
    localStorage.setItem('roleData', JSON.stringify(roleData));
    
    navigate('/results');
  };

  const handleBack = () => {
    navigate('/budget');
  };

  const selectedRoleData = roles.find(r => r.value === selectedRole);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <motion.div {...fadeInUp} className="mb-8">
          <StepProgress currentStep={3} totalSteps={4} />
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
            Quelle est votre fonction ?
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Cette information nous permet de vous proposer l'interlocuteur adapté
          </motion.p>
        </motion.div>

        {/* Role Selection */}
        <motion.div {...fadeInUp}>
          <Card className="p-8">
            <div className="space-y-4">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.value;
                
                return (
                  <motion.label
                    key={role.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={isSelected}
                      onChange={() => handleRoleSelect(role)}
                      className="sr-only"
                    />
                    
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      isSelected ? 'bg-blue-600' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {role.label}
                        </h3>
                        {role.isDecisionMaker && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Décideur
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {role.description}
                      </p>
                    </div>
                    
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </motion.label>
                );
              })}
            </div>
            
            {errors.role && (
              <p className="text-red-600 text-sm mt-4">{errors.role}</p>
            )}

            {/* Manager Email Form for Non-Decision Makers */}
            {showManagerForm && selectedRoleData && !selectedRoleData.isDecisionMaker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-amber-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 mb-2">
                      Transfert vers votre responsable
                    </h3>
                    <p className="text-sm text-amber-700 mb-4">
                      Pour vous faire gagner du temps, nous contacterons directement 
                      la personne habilitée à prendre des décisions télécom dans votre entreprise.
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-2">
                        Email de votre responsable *
                      </label>
                      <input
                        type="email"
                        placeholder="responsable@entreprise.fr"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                          errors.managerEmail ? 'border-red-300' : 'border-amber-300'
                        }`}
                        value={managerEmail}
                        onChange={(e) => {
                          setManagerEmail(e.target.value);
                          if (errors.managerEmail) {
                            setErrors(prev => ({ ...prev, managerEmail: '' }));
                          }
                        }}
                      />
                      {errors.managerEmail && (
                        <p className="text-red-600 text-sm mt-1">{errors.managerEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Decision Maker Notice */}
            {selectedRoleData && selectedRoleData.isDecisionMaker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Parfait ! Vous pouvez prendre des décisions télécom
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      Nous pourrons vous proposer directement un audit personnalisé
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

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
                disabled={!selectedRole}
                icon={ArrowRight}
              >
                {selectedRoleData && !selectedRoleData.isDecisionMaker ? 'Transférer' : 'Voir mes économies'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;