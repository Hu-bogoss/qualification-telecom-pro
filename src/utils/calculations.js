// Telecom savings calculation utilities

/**
 * Calculate potential savings based on user inputs
 * @param {Object} budgetData - User budget and service information
 * @returns {Object} Savings calculation results with validated inputs
 */
export const calculateSavings = (budgetData) => {
  const {
    fixedBudget = 0,
    internetBudget = 0,
    cybersecurityBudget = 0,
    phoneSystem = 'none',
    cybersecurity = 'no',
    companySize = 1,
    multiSite = false
  } = budgetData;

  // Validate and parse inputs to prevent NaN
  const fixedBudgetNum = parseFloat(fixedBudget) || 0;
  const internetBudgetNum = parseFloat(internetBudget) || 0;
  const cybersecurityBudgetNum = parseFloat(cybersecurityBudget) || 0;

  const totalBudget = fixedBudgetNum + internetBudgetNum + cybersecurityBudgetNum;

  // Ensure totalBudget is valid
  if (isNaN(totalBudget) || totalBudget <= 0) {
    return {
      totalBudget: 0,
      minSavings: 0,
      maxSavings: 0,
      avgSavingsPercent: 0,
      monthlySavings: 0,
      yearlySavings: 0,
      isEligible: false
    };
  }

  // Base savings calculation
  let baseSavings = {
    min: 12,
    max: 18
  };

  // Adjust based on phone system
  if (phoneSystem === 'rental') {
    baseSavings.min += 2;
    baseSavings.max += 4;
  } else if (phoneSystem === 'purchase') {
    baseSavings.min += 1;
    baseSavings.max += 2;
  }

  // Adjust based on cybersecurity
  if (cybersecurity === 'no') {
    baseSavings.min += 1;
    baseSavings.max += 2;
  } else if (cybersecurity === 'yes') {
    baseSavings.min -= 2;
    baseSavings.max -= 3;
  }

  // Adjust based on company size
  if (companySize > 10) {
    baseSavings.min += 2;
    baseSavings.max += 3;
  } else if (companySize > 5) {
    baseSavings.min += 1;
    baseSavings.max += 2;
  }

  // Adjust based on multi-site
  if (multiSite) {
    baseSavings.min += 2;
    baseSavings.max += 4;
  }

  // Clamp values between 8% and 20%
  const minSavings = Math.max(8, Math.min(20, baseSavings.min));
  const maxSavings = Math.max(8, Math.min(20, baseSavings.max));

  // Calculate monetary savings with validation
  const avgSavingsPercent = (minSavings + maxSavings) / 2;
  const monthlySavings = Math.round((totalBudget * avgSavingsPercent) / 100);
  const yearlySavings = monthlySavings * 12;

  return {
    totalBudget: Math.round(totalBudget),
    minSavings,
    maxSavings,
    avgSavingsPercent: Math.round(avgSavingsPercent * 100) / 100,
    monthlySavings,
    yearlySavings,
    isEligible: totalBudget >= 180
  };
};

/**
 * Generate savings explanation bullets in French
 * @param {Object} budgetData - User budget and service information
 * @returns {Array} Array of explanation strings
 */
export const generateSavingsExplanation = (budgetData) => {
  const explanations = [];
  const {
    phoneSystem,
    cybersecurity,
    companySize,
    multiSite
  } = budgetData;

  // Base explanation
  explanations.push('Optimisation des contrats télécom existants');

  // Phone system specific
  if (phoneSystem === 'rental') {
    explanations.push('Remplacement du système téléphonique en location');
  } else if (phoneSystem === 'purchase') {
    explanations.push('Modernisation du système téléphonique');
  }

  // Cybersecurity specific
  if (cybersecurity === 'no') {
    explanations.push('Mise en place d\'une solution cybersécurité intégrée');
  } else if (cybersecurity === 'unsure') {
    explanations.push('Audit et optimisation de la cybersécurité');
  }

  // Company size specific
  if (companySize > 10) {
    explanations.push('Négociation de tarifs préférentiels entreprise');
  }

  // Multi-site specific
  if (multiSite) {
    explanations.push('Centralisation et mutualisation multi-sites');
  }

  // Always add these
  explanations.push('Renégociation des contrats opérateurs');
  explanations.push('Élimination des services non utilisés');

  return explanations.slice(0, 4); // Limit to 4 explanations
};

/**
 * Calculate lead scoring based on various factors
 * @param {Object} leadData - Complete lead information
 * @returns {Object} Lead score and qualification level
 */
export const calculateLeadScore = (leadData) => {
  const {
    totalBudget = 0,
    role = '',
    companySize = 1,
    multiSite = false,
    cybersecurity = 'no',
    phoneSystem = 'none'
  } = leadData;

  let score = 0;

  // Budget scoring (40% of total score)
  if (totalBudget >= 1000) score += 40;
  else if (totalBudget >= 500) score += 30;
  else if (totalBudget >= 300) score += 20;
  else if (totalBudget >= 200) score += 10;

  // Role scoring (30% of total score)
  const roleScores = {
    'Gérant': 30,
    'Président': 30,
    'DG': 30,
    'DAF': 25,
    'DSI': 25,
    'Office Manager': 15
  };
  score += roleScores[role] || 0;

  // Company size scoring (15% of total score)
  if (companySize >= 50) score += 15;
  else if (companySize >= 20) score += 12;
  else if (companySize >= 10) score += 8;
  else if (companySize >= 5) score += 5;

  // Additional factors (15% of total score)
  if (multiSite) score += 8;
  if (cybersecurity === 'no') score += 4;
  if (phoneSystem === 'rental') score += 3;

  // Determine qualification level
  let qualification = 'Low';
  if (score >= 80) qualification = 'Hot';
  else if (score >= 60) qualification = 'Warm';
  else if (score >= 40) qualification = 'Medium';

  return {
    score: Math.min(100, score),
    qualification,
    isQualified: score >= 40 && totalBudget >= 200
  };
};

/**
 * Format currency for French locale
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage for display
 * @param {number} percentage - Percentage to format
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (percentage) => {
  return `${Math.round(percentage)}%`;
};

/**
 * Validate budget inputs
 * @param {Object} budgetData - Budget form data
 * @returns {Object} Validation results
 */
export const validateBudgetInputs = (budgetData) => {
  const errors = {};
  const {
    fixedBudget,
    internetBudget,
    companySize
  } = budgetData;

  // Calculate total budget (fixed + internet only) - always allow to continue
  const totalBudget = parseFloat(fixedBudget || 0) + parseFloat(internetBudget || 0);

  // Validate company size
  if (!companySize) {
    errors.companySize = 'La taille de l\'entreprise est requise';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    totalBudget,
    isEligible: totalBudget >= 150
  };
};