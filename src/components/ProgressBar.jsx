import React from 'react';
import { motion } from 'framer-motion';
import { progressVariants } from '../utils/motion';

const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true, 
  className = '',
  size = 'md',
  color = 'blue',
  animated = true,
  label = ''
}) => {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  };
  
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  };
  
  const backgroundColors = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    amber: 'bg-amber-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100'
  };
  
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-900">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full ${backgroundColors[color]} rounded-full overflow-hidden ${sizes[size]}`}>
        {animated ? (
          <motion.div
            className={`${colors[color]} ${sizes[size]} rounded-full`}
            variants={progressVariants}
            initial="initial"
            animate="animate"
            custom={clampedProgress}
          />
        ) : (
          <div 
            className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${clampedProgress}%` }}
          />
        )}
      </div>
    </div>
  );
};

// Specialized progress components
export const StepProgress = ({ currentStep, totalSteps, className = '' }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">
          Étape {currentStep} sur {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(progress)}% terminé
        </span>
      </div>
      
      <div className="flex space-x-2 mb-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
              i < currentStep 
                ? 'bg-blue-600' 
                : i === currentStep - 1 
                ? 'bg-blue-400' 
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      <ProgressBar 
        progress={progress} 
        showPercentage={false} 
        animated={true}
        size="sm"
      />
    </div>
  );
};

export const CircularProgress = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  color = 'blue',
  showPercentage = true,
  className = ''
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedProgress / 100) * circumference;
  
  const colors = {
    blue: '#2563eb',
    green: '#16a34a',
    amber: '#d97706',
    red: '#dc2626',
    purple: '#9333ea'
  };
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;