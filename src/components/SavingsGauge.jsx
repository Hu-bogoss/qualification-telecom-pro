import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Euro, Percent } from 'lucide-react';
import { gaugeVariants } from '../utils/motion';

const SavingsGauge = ({ 
  minSavings = 8, 
  maxSavings = 20, 
  currentBudget = 0,
  animated = true,
  showDetails = true,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const averageSavings = (minSavings + maxSavings) / 2;
  const monthlyEconomies = (currentBudget * averageSavings) / 100;
  const yearlyEconomies = monthlyEconomies * 12;
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(averageSavings);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(averageSavings);
    }
  }, [averageSavings, animated]);
  
  const gaugeSize = 200;
  const strokeWidth = 12;
  const radius = (gaugeSize - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Semi-circle
  const progress = (displayValue / 25) * 100; // Max 25% for gauge scale
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      {/* Gauge Visualization */}
      <div className="relative">
        <svg
          width={gaugeSize}
          height={gaugeSize / 2 + 40}
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={`M ${strokeWidth/2} ${gaugeSize/2} A ${radius} ${radius} 0 0 1 ${gaugeSize - strokeWidth/2} ${gaugeSize/2}`}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <motion.path
            d={`M ${strokeWidth/2} ${gaugeSize/2} A ${radius} ${radius} 0 0 1 ${gaugeSize - strokeWidth/2} ${gaugeSize/2}`}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          
          {/* Center indicator */}
          <motion.circle
            cx={gaugeSize / 2}
            cy={gaugeSize / 2}
            r="4"
            fill="#374151"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          />
          
          {/* Gauge markers */}
          {[0, 5, 10, 15, 20, 25].map((value, index) => {
            const angle = (value / 25) * 180 - 90;
            const x1 = gaugeSize/2 + (radius - 15) * Math.cos(angle * Math.PI / 180);
            const y1 = gaugeSize/2 + (radius - 15) * Math.sin(angle * Math.PI / 180);
            const x2 = gaugeSize/2 + (radius - 5) * Math.cos(angle * Math.PI / 180);
            const y2 = gaugeSize/2 + (radius - 5) * Math.sin(angle * Math.PI / 180);
            
            return (
              <g key={value}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#9ca3af"
                  strokeWidth="2"
                />
                <text
                  x={gaugeSize/2 + (radius - 25) * Math.cos(angle * Math.PI / 180)}
                  y={gaugeSize/2 + (radius - 25) * Math.sin(angle * Math.PI / 180) + 4}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 font-medium"
                >
                  {value}%
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Center value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="text-3xl font-bold text-gray-900">
                {Math.round(displayValue)}
              </span>
              <Percent className="h-6 w-6 text-gray-600" />
            </div>
            <p className="text-sm text-gray-600 mt-1">d'économies</p>
          </motion.div>
        </div>
      </div>
      
      {/* Savings Range Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <span>Min: {minSavings}%</span>
          <span className="w-2 h-0.5 bg-gray-300"></span>
          <span>Max: {maxSavings}%</span>
        </div>
        
        {showDetails && currentBudget > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-4 mt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-1 text-lg font-semibold text-blue-600">
                  <Euro className="h-4 w-4" />
                  <span>{Math.round(monthlyEconomies)}</span>
                </div>
                <p className="text-xs text-gray-600">par mois</p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 text-lg font-semibold text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{Math.round(yearlyEconomies)}</span>
                </div>
                <p className="text-xs text-gray-600">par an</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SavingsGauge;