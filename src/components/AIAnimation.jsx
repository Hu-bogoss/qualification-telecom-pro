import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Euro, Phone, Wifi, Shield } from 'lucide-react';

const AIAnimation = () => {
  const [scanAngle, setScanAngle] = useState(0);
  const [detectedSavings, setDetectedSavings] = useState([]);
  const [currentScan, setCurrentScan] = useState(0);
  const [scanSpeed, setScanSpeed] = useState(1.5);
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [activeCompanies, setActiveCompanies] = useState(127);
  const [dynamicAmount, setDynamicAmount] = useState(392);
  const [dynamicOpportunities, setDynamicOpportunities] = useState(90);
  const [cycleStartTime, setCycleStartTime] = useState(Date.now());

  // Données des économies détectées avec timing varié
  const savingsData = [
    { id: 1, type: 'phone', label: 'Téléphonie fixe', savings: '15%', amount: '45€', x: 120, y: 80, delay: 0.8 },
    { id: 2, type: 'internet', label: 'Internet pro', savings: '22%', amount: '67€', x: 200, y: 120, delay: 1.6 },
    { id: 3, type: 'mobile', label: 'Forfaits mobiles', savings: '18%', amount: '38€', x: 80, y: 160, delay: 2.4 },
    { id: 4, type: 'security', label: 'Cybersécurité', savings: '12%', amount: '28€', x: 180, y: 180, delay: 3.2 },
    { id: 5, type: 'cloud', label: 'Solutions cloud', savings: '25%', amount: '89€', x: 140, y: 60, delay: 4.0 },
    { id: 6, type: 'voip', label: 'VoIP Enterprise', savings: '30%', amount: '125€', x: 100, y: 100, delay: 4.8 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle(prev => {
        const newAngle = (prev + scanSpeed) % 360;

        // Variation dynamique de la vitesse pour plus de fluidité
        if (newAngle % 90 === 0) {
          setScanSpeed(prev => 1.2 + Math.sin(Date.now() / 2000) * 0.8);
        }

        return newAngle;
      });

      // Système de détection progressive avec timing naturel et reset automatique (180 secondes)
      const currentTime = Date.now();
      const cycleElapsed = (currentTime - cycleStartTime) / 1000; // en secondes
      const totalCycleDuration = 180; // 180 secondes = 3 minutes

      // Reset automatique du cycle toutes les 180 secondes
      if (cycleElapsed >= totalCycleDuration) {
        setDetectedSavings([]);
        setDynamicOpportunities(90); // Reset à la valeur minimale
        setCycleStartTime(currentTime);
        return;
      }

      // Animation dynamique du compteur d'opportunités (90 à 280)
      const progressRatio = cycleElapsed / totalCycleDuration;
      const baseOpportunities = 90;
      const maxOpportunities = 280;
      const opportunityRange = maxOpportunities - baseOpportunities;

      // Variation sinusoïdale pour un mouvement naturel
      const sineWave = Math.sin(progressRatio * Math.PI * 2) * 0.3;
      const cosineWave = Math.cos(progressRatio * Math.PI * 1.5) * 0.2;
      const noiseVariation = Math.sin(currentTime / 3000) * 0.1;

      const dynamicFactor = progressRatio + sineWave + cosineWave + noiseVariation;
      const clampedFactor = Math.max(0, Math.min(1, dynamicFactor));

      const newOpportunityCount = Math.floor(baseOpportunities + (opportunityRange * clampedFactor));
      setDynamicOpportunities(newOpportunityCount);

      // Détection progressive des économies avec timing naturel
      const detectionCycle = cycleElapsed % 20; // Cycle de détection de 20 secondes

      // Reset des détections au début de chaque cycle
      if (detectionCycle < 0.5 && detectedSavings.length > 0) {
        setDetectedSavings([]);
        return;
      }

      savingsData.forEach((saving, index) => {
        const shouldDetect = detectionCycle > saving.delay &&
                           !detectedSavings.find(s => s.id === saving.id);

        if (shouldDetect && detectedSavings.length <= index) {
          setDetectedSavings(prev => {
            if (!prev.find(s => s.id === saving.id)) {
              return [...prev, saving];
            }
            return prev;
          });
        }
      });

      // Pulse dynamique basé sur le cycle
      setPulseIntensity(1 + Math.sin(currentTime / 1000 * 3) * 0.3);

      // Variation du nombre de sociétés actives (plus réaliste)
      const baseCompanies = 127;
      const timeVariation = Math.floor(Math.sin(currentTime / 15000) * 12 + Math.cos(currentTime / 11000) * 8);
      setActiveCompanies(baseCompanies + timeVariation);

      // Variation dynamique du montant total (plus fluide)
      const baseAmount = 392;
      const amountTimeVariation = Math.sin(currentTime / 12000) * 35 + Math.cos(currentTime / 18000) * 22;
      const detectionBonus = detectedSavings.length * 12;
      const opportunityBonus = (newOpportunityCount - 90) * 0.8; // Bonus basé sur les opportunités
      const newAmount = Math.round(baseAmount + amountTimeVariation + detectionBonus + opportunityBonus);
      setDynamicAmount(newAmount);
    }, 50); // Fréquence légèrement réduite pour plus de fluidité
    return () => clearInterval(interval);
  }, [scanSpeed, detectedSavings.length, cycleStartTime]);

  // Reset périodique pour maintenir la dynamique (optionnel - déjà géré dans le useEffect principal)
  useEffect(() => {
    const resetInterval = setInterval(() => {
      // Reset complet du système toutes les 180 secondes
      setCycleStartTime(Date.now());
      setDetectedSavings([]);
      setDynamicOpportunities(90);
      setScanSpeed(1.5);
    }, 180000); // 180 secondes = 3 minutes

    return () => clearInterval(resetInterval);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'phone': return Phone;
      case 'internet': return Wifi;
      case 'mobile': return Phone;
      case 'security': return Shield;
      case 'cloud': return Euro;
      default: return Euro;
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto h-80 bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 rounded-2xl overflow-hidden border border-blue-100 shadow-lg">
      {/* Radar Background avec effet de profondeur */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="300" height="300" className="absolute">
          {/* Cercles concentriques du radar avec animation */}
          {[60, 100, 140].map((radius, index) => (
            <motion.circle
              key={index}
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke="#10B981"
              strokeWidth="1"
              opacity={0.2 + Math.sin((scanAngle + index * 60) * Math.PI / 180) * 0.1}
              animate={{
                strokeOpacity: [0.2, 0.4, 0.2],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3 + index,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          {/* Lignes de grille dynamiques */}
          <g stroke="#10B981" strokeWidth="1" opacity={0.15 + pulseIntensity * 0.05}>
            <line x1="150" y1="10" x2="150" y2="290" />
            <line x1="10" y1="150" x2="290" y2="150" />
            <line x1="44" y1="44" x2="256" y2="256" />
            <line x1="256" y1="44" x2="44" y2="256" />
          </g>
          {/* Faisceau radar rotatif avec dégradé amélioré */}
          <defs>
            <radialGradient id="radarBeam" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
              <stop offset="30%" stopColor="#10B981" stopOpacity={0.3 * pulseIntensity} />
              <stop offset="70%" stopColor="#0052CC" stopOpacity={0.6 * pulseIntensity} />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d="M 150 150 L 150 10 A 140 140 0 0 1 220 60 Z"
            fill="url(#radarBeam)"
            filter="url(#glow)"
            animate={{ rotate: scanAngle }}
            transition={{ duration: 0.04, ease: "linear" }}
            style={{ transformOrigin: '150px 150px' }}
          />

          {/* Faisceau secondaire pour effet de profondeur */}
          <motion.path
            d="M 150 150 L 150 10 A 100 100 0 0 1 200 80 Z"
            fill="url(#radarBeam)"
            opacity="0.4"
            animate={{ rotate: scanAngle * 0.7 }}
            transition={{ duration: 0.06, ease: "linear" }}
            style={{ transformOrigin: '150px 150px' }}
          />
        </svg>
      </div>
      {/* Points d'économies détectées avec animations améliorées */}
      {detectedSavings.map((saving, index) => {
        const Icon = getIcon(saving.type);
        return (
          <motion.div
            key={saving.id}
            className="absolute"
            style={{
              left: `${saving.x}px`,
              top: `${saving.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: 1,
              rotate: 0
            }}
            transition={{
              delay: saving.delay,
              duration: 0.6,
              type: "spring",
              stiffness: 200
            }}
          >
            {/* Point clignotant avec effet de pulsation */}
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 0 0 rgba(16, 185, 129, 0.7)',
                  '0 0 0 10px rgba(16, 185, 129, 0)',
                  '0 0 0 0 rgba(16, 185, 129, 0)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white shadow-lg" />
              {/* Onde de propagation */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-green-400"
                animate={{
                  scale: [1, 2.5],
                  opacity: [0.8, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              {/* Tooltip avec économies - animation améliorée */}
              <motion.div
                className="absolute bottom-7 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 min-w-max border border-green-200 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateY: [0, 5, 0]
                }}
                transition={{
                  delay: saving.delay + 0.4,
                  duration: 0.5,
                  type: "spring"
                }}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-green-600" />
                  <div className="text-xs">
                    <div className="font-semibold text-gray-900">{saving.label}</div>
                    <div className="text-green-600 font-bold">
                      -{saving.savings} ({saving.amount}/mois)
                    </div>
                  </div>
                </div>
                {/* Flèche du tooltip avec ombre */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white drop-shadow-sm" />
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
      {/* Indicateurs de scan améliorés */}
      <motion.div
        className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-blue-100"
        animate={{
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
          <motion.div
            className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            animate={{
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="text-sm font-medium text-gray-700">Analyse IA en cours...</span>
        <div className="text-xs text-gray-600 mt-1 font-medium">
          {dynamicOpportunities} opportunité{dynamicOpportunities > 1 ? 's' : ''} identifiée{dynamicOpportunities > 1 ? 's' : ''}
        </div>
      </motion.div>
      {/* Compteur de sociétés actives */}
      <motion.div
        className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-orange-200"
        animate={{
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
            animate={{
              opacity: [1, 0.3, 1],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div>
            <motion.span
              className="text-lg font-bold text-orange-600"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {activeCompanies}
            </motion.span>
            <div className="text-xs text-gray-600 font-medium">
              sociétés recherchent
            </div>
            <div className="text-xs text-gray-500">
              en ce moment
            </div>
          </div>
        </div>
      </motion.div>
      {/* Résumé des économies totales avec animation */}
      {detectedSavings.length > 0 && (
        <motion.div
          className="absolute bottom-4 right-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-4 shadow-xl border border-green-500"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            boxShadow: [
              '0 4px 20px rgba(16, 185, 129, 0.3)',
              '0 8px 30px rgba(16, 185, 129, 0.4)',
              '0 4px 20px rgba(16, 185, 129, 0.3)'
            ]
          }}
          transition={{
            delay: 2,
            duration: 0.6,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold"
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {dynamicAmount}€
            </motion.div>
            <div className="text-sm opacity-90 font-medium">économies/mois</div>
          </div>
        </motion.div>
      )}
      {/* Effet de balayage périphérique amélioré */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `conic-gradient(from ${scanAngle}deg,
            transparent 0deg,
            rgba(16, 185, 129, 0.08) 20deg,
            rgba(0, 82, 204, 0.12) 40deg,
            transparent 60deg)`
        }}
        animate={{
          rotate: scanAngle * 0.3,
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          rotate: { duration: 0.1, ease: "linear" },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </div>
  );
};

export default AIAnimation;