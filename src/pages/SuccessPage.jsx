import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Mail, MessageSquare, Download, Home } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { fadeInUp, staggerContainer } from '../utils/motion';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('appointmentData') || '{}');
    setAppointmentData(data);
    
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateCalendarLink = (type) => {
    if (!appointmentData) return '#';
    
    const { preferredDate, preferredTime, company, meetingType, address, city } = appointmentData;
    const startDate = new Date(`${preferredDate}T${preferredTime}:00`);
    const endDate = new Date(startDate.getTime() + 45 * 60000); // 45 minutes
    
    const title = encodeURIComponent('Audit Télécom & Cybersécurité - TelecomPro Solutions');
    const details = encodeURIComponent(
      `Audit gratuit avec ${company}\n` +
      `Type: ${meetingType === 'onsite' ? 'Sur site' : 'Visioconférence'}\n` +
      `${meetingType === 'onsite' && address ? `Lieu: ${address}, ${city}` : ''}`
    );
    
    const startTime = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    if (type === 'google') {
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}`;
    } else {
      return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${title}
DESCRIPTION:${details}
END:VEVENT
END:VCALENDAR`;
    }
  };

  const handleNewEvaluation = () => {
    // Clear all stored data
    localStorage.removeItem('consentLog');
    localStorage.removeItem('budgetData');
    localStorage.removeItem('roleData');
    localStorage.removeItem('appointmentData');
    navigate('/');
  };

  if (!appointmentData) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement...</p>
          <Button onClick={() => navigate('/')} className="mt-4">Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50"
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
                transition: {
                  duration: Math.random() * 2 + 2,
                  ease: 'linear'
                }
              }}
              className={`absolute w-3 h-3 ${
                ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][i % 5]
              } rounded-full`}
            />
          ))}
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="text-center mb-8"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-6"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              ✅ C'est planifié !
            </h1>
            <p className="text-xl text-gray-600 font-body">
              Votre audit gratuit est confirmé
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={fadeInUp}>
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Récapitulatif de votre rendez-vous</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-semibold">{formatDate(appointmentData.preferredDate)}</div>
                    <div className="text-gray-600">à {appointmentData.preferredTime}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {appointmentData.meetingType === 'onsite' ? '🏢' : '💻'}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {appointmentData.meetingType === 'onsite' ? 'Rendez-vous sur site' : 'Visioconférence'}
                    </div>
                    <div className="text-gray-600">
                      {appointmentData.meetingType === 'onsite' 
                        ? `${appointmentData.address}, ${appointmentData.city}` 
                        : 'Lien de connexion envoyé par email'
                      }
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 flex items-center justify-center">👤</div>
                  <div>
                    <div className="font-semibold">{appointmentData.name}</div>
                    <div className="text-gray-600">{appointmentData.role} - {appointmentData.company}</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Prochaines étapes</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium">Confirmation par email</div>
                    <div className="text-sm text-gray-600">Vous recevrez un email de confirmation avec tous les détails</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-medium">Rappels automatiques</div>
                    <div className="text-sm text-gray-600">SMS et email à J-1 et H-2 avant le rendez-vous</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <div className="font-medium">Préparation de l'audit</div>
                    <div className="text-sm text-gray-600">Notre expert préparera votre diagnostic personnalisé</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Ajouter à votre agenda</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href={generateCalendarLink('google')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Google Calendar</span>
                </a>
                
                <a
                  href={generateCalendarLink('outlook')}
                  download="audit-telecom.ics"
                  className="flex items-center justify-center space-x-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Outlook / iCal</span>
                </a>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center">
            <Card className="p-6">
              <p className="text-gray-600 mb-4">
                Besoin de modifier ou annuler ? Contactez-nous au <strong>01 23 45 67 89</strong>
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={handleNewEvaluation}
                  variant="outline"
                  className="flex items-center space-x-2 mx-auto"
                >
                  <Home className="w-4 h-4" />
                  <span>Nouvelle évaluation</span>
                </Button>
                
                <p className="text-sm text-gray-500">
                  Merci de votre confiance ! 🚀
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;