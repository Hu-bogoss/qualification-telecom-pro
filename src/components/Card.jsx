import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  padding = 'default',
  shadow = 'default',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-200 transition-all duration-300';

  const variants = {
    default: 'hover:shadow-lg',
    elevated: 'shadow-lg hover:shadow-xl',
    flat: 'shadow-none border-gray-100',
    gradient: 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100 hover:from-blue-100 hover:to-sky-100',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    warning: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    default: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${shadows[shadow]} ${className}`;

  const motionProps = hover ? {
    whileHover: { y: -2, scale: 1.01 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div
      className={classes}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FeatureCard = ({ icon: Icon, title, description, className = '' }) => (
  <Card variant="gradient" className={`text-center h-48 flex items-center ${className}`}>
    <div className="flex flex-col items-center justify-center space-y-4 h-full">
      <div className="bg-blue-600 p-3 rounded-full">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 font-heading">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </Card>
);

export const StatCard = ({ value, label, trend, className = '' }) => (
  <Card variant="elevated" padding="lg" className={className}>
    <div className="text-center">
      <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {trend && (
        <div className={`text-xs mt-1 ${
          trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
        }`}>
          {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  </Card>
);

export default Card;