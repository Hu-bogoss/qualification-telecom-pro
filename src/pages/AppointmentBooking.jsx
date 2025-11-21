import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building,
  User,
  ArrowRight,
  ArrowLeft,
  Shield,
  CheckCircle
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { fadeInUp, containerVariants, itemVariants } from '../utils/motion';

// Mock database of existing appointments for slot validation
const mockExistingAppointments = [
  { date: '2024-01-15', time: '09:00', department: '75' },
  { date: '2024-01-15', time: '14:00', department: '69' },
  { date: '2024-01-16', time: '11:00', department: '13' },
  { date: '2024-01-17', time: '16:00', department: '33' },
];

// French departments with commercial coverage
const DEPARTMENTS = [
  { code: '57', name: 'Moselle' },
  { code: '54', name: 'Meurthe-et-Moselle' },
  { code: '76', name: 'Seine-Maritime' },
  { code: '51', name: 'Marne' },
  { code: '02', name: 'Aisne' },
  { code: '08', name: 'Ardennes' },
  { code: '10', name: 'Aube' },
  { code: '52', name: 'Haute-Marne' },
  { code: '55', name: 'Meuse' },
  { code: '77', name: 'Seine-et-Marne' },
  { code: '80', name: 'Somme' },
  { code: '60', name: 'Oise' },
  { code: '95', name: 'Val-d\'Oise' },
  { code: '62', name: 'Pas-de-Calais' },
  { code: '91', name: 'Essonne' },
  { code: '94', name: 'Val-de-Marne' },
  { code: '44', name: 'Loire-Atlantique' },
  { code: '35', name: 'Ille-et-Vilaine' },
  { code: '53', name: 'Mayenne' },
  { code: '56', name: 'Morbihan' },
  { code: '29', name: 'Finistère' },
  { code: '85', name: 'Vendée' },
  { code: '22', name: 'Côtes-d\'Armor' },
  { code: '33', name: 'Gironde' },
  { code: '47', name: 'Lot-et-Garonne' },
  { code: '64', name: 'Pyrénées-Atlantiques' },
  { code: '65', name: 'Hautes-Pyrénées' },
  { code: '12', name: 'Aveyron' },
  { code: '81', name: 'Tarn' },
  { code: '31', name: 'Haute-Garonne' },
  { code: '34', name: 'Hérault' },
  { code: '30', name: 'Gard' },
  { code: '82', name: 'Tarn-et-Garonne' },
  { code: '69', name: 'Rhône' },
  { code: '03', name: 'Allier' },
  { code: '83', name: 'Var' },
  { code: '06', name: 'Alpes-Maritimes' },
  { code: '13', name: 'Bouches-du-Rhône' },
  { code: '16', name: 'Charente' },
  { code: '19', name: 'Corrèze' },
  { code: '23', name: 'Creuse' },
  { code: '87', name: 'Haute-Vienne' }
];

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    preferredDate: '',
    preferredTime: '',
    appointmentType: 'onsite',
    finalConsent: false,
    siret: '',
    department: '',
  });
  const [siretLoading, setSiretLoading] = useState(false);
  const [siretError, setSiretError] = useState('');
  const [errors, setErrors] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    // Load previous data if available
    const budgetData = localStorage.getItem('budgetData');
    const roleData = localStorage.getItem('roleData');

    if (roleData) {
      const role = JSON.parse(roleData);
      setFormData(prev => ({ ...prev, role: role.role }));
    }

    // Generate available time slots filtering out existing appointments
    generateAvailableSlots();
  }, []);

  // Function to check if slot conflicts with existing appointments
  const isSlotAvailable = (date, time, selectedDepartment) => {
    // Check if there's already an appointment at this time
    const conflictingAppointment = mockExistingAppointments.find(
      apt => apt.date === date && apt.time === time
    );

    if (!conflictingAppointment) return true;

    // If there's a conflict, check if it's in the same department
    // If different departments, we need to calculate travel time (backend logic)
    if (conflictingAppointment.department !== selectedDepartment) {
      // In real implementation, this would call backend API to calculate
      // travel time between departments using mapping service
      const travelTimeMinutes = calculateTravelTime(
        conflictingAppointment.department,
        selectedDepartment
      );

      // If travel time is more than 2 hours, slot is not available
      return travelTimeMinutes <= 120;
    }

    return false; // Same department conflict
  };

  // Mock function for travel time calculation (would be backend API call)
  const calculateTravelTime = (dept1, dept2) => {
    // Simplified distance calculation based on department codes
    // In real implementation, this would use Mappy/Google Maps API
    const distance = Math.abs(parseInt(dept1) - parseInt(dept2));
    return Math.min(distance * 15, 300); // Max 5 hours travel
  };

  const generateAvailableSlots = () => {
    const slots = [];
    const today = new Date();

    // Generate slots for next 14 days (excluding weekends)
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Add morning and afternoon slots
      const timeSlots = ['09:00', '11:00', '14:00', '16:00'];

      timeSlots.forEach(time => {
        // Only add slot if it's available (not conflicting with existing appointments)
        const isAvailable = Math.random() > 0.3 && // 70% base availability
                           isSlotAvailable(date.toISOString().split('T')[0], time, formData.department);

        if (isAvailable) {
          slots.push({
            date: date.toISOString().split('T')[0],
            time: time,
            available: true
          });
        }
      });
    }

    setAvailableSlots(slots);
  };

  // Regenerate slots when department changes
  useEffect(() => {
    if (formData.department) {
      generateAvailableSlots();
    }
  }, [formData.department]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const searchSiretData = async (siret) => {
    if (!siret || siret.length !== 14) return;

    setSiretLoading(true);
    setSiretError('');

    try {
      // Base de données simulée d'entreprises françaises réelles
      const mockDatabase = {
        '12345678901234': {
          company: 'TechSolutions SARL',
          address: '123 Avenue des Champs-Élysées',
          postalCode: '75008',
          city: 'Paris'
        },
        '98765432109876': {
          company: 'Innovation Digital SAS',
          address: '45 Rue de la République',
          postalCode: '69002',
          city: 'Lyon'
        },
        '11223344556677': {
          company: 'Marseille Telecom EURL',
          address: '78 La Canebière',
          postalCode: '13001',
          city: 'Marseille'
        },
        '33445566778899': {
          company: 'Toulouse Tech SA',
          address: '156 Rue du Faubourg Saint-Honoré',
          postalCode: '31000',
          city: 'Toulouse'
        },
        '55667788990011': {
          company: 'Nice Innovation SARL',
          address: '89 Promenade des Anglais',
          postalCode: '06000',
          city: 'Nice'
        },
        '77889900112233': {
          company: 'Strasbourg Digital SAS',
          address: '234 Grande Rue',
          postalCode: '67000',
          city: 'Strasbourg'
        },
        '99001122334455': {
          company: 'Bordeaux Solutions EURL',
          address: '67 Cours de l\'Intendance',
          postalCode: '33000',
          city: 'Bordeaux'
        },
        '13579246801357': {
          company: 'Lille Telecom SA',
          address: '145 Rue Nationale',
          postalCode: '59000',
          city: 'Lille'
        },
        '24681357902468': {
          company: 'Nantes Digital SARL',
          address: '78 Rue Crébillon',
          postalCode: '44000',
          city: 'Nantes'
        },
        '36925814703692': {
          company: 'Rennes Tech SAS',
          address: '123 Rue Saint-Malo',
          postalCode: '35000',
          city: 'Rennes'
        }
      };

      // Simulation d'un délai de recherche réaliste
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (mockDatabase[siret]) {
        const data = mockDatabase[siret];

        // Mise à jour automatique des champs
        setFormData(prev => ({
          ...prev,
          company: data.company,
          address: data.address,
          postalCode: data.postalCode,
          city: data.city
        }));

        // Effacer les erreurs des champs auto-remplis
        setErrors(prev => ({
          ...prev,
          company: '',
          address: '',
          postalCode: '',
          city: ''
        }));
      } else {
        setSiretError('SIRET non trouvé. Veuillez vérifier le numéro ou saisir manuellement.');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche SIRET:', error);
      setSiretError('Erreur de connexion. Veuillez saisir manuellement.');
    } finally {
      setSiretLoading(false);
    }
  };

  const handleSiretChange = (value) => {
    // Ne garder que les chiffres
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length <= 14) {
      handleInputChange('siret', cleanValue);
      setSiretError('');

      // Recherche automatique quand 14 chiffres sont saisis
      if (cleanValue.length === 14) {
        searchSiretData(cleanValue);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company.trim()) newErrors.company = 'Nom de l\'entreprise requis';
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Email valide requis';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
    if (!formData.siret.trim()) newErrors.siret = 'Numéro SIRET requis'
    else if (formData.siret.length !== 14) newErrors.siret = 'SIRET doit contenir 14 chiffres';
    if (!formData.department.trim()) newErrors.department = 'Département requis';
    if (formData.appointmentType === 'onsite') {
      if (!formData.address.trim()) newErrors.address = 'Adresse requise pour visite sur site';
      if (!formData.city.trim()) newErrors.city = 'Ville requise';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Code postal requis';
    }

    if (!formData.preferredDate) newErrors.preferredDate = 'Date requise';
    if (!formData.preferredTime) newErrors.preferredTime = 'Heure requise';
    if (!formData.finalConsent) newErrors.finalConsent = 'Consentement final requis';

    return newErrors;
  };

  const isFormValid = () => {
    return (
      formData.company.trim() &&
      formData.siret.trim() &&
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.postalCode.trim() &&
      formData.preferredDate &&
      formData.preferredTime &&
      formData.finalConsent &&
      formData.department.trim()
    );
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Store appointment data
    const appointmentData = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      id: Date.now().toString()
    };

    localStorage.setItem('appointmentData', JSON.stringify(appointmentData));

    // In real app, send to backend API
    console.log('Appointment booked:', appointmentData);

    navigate('/success');
  };

  const handleBack = () => {
    navigate('/results');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupedSlots = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
              <Calendar className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading"
          >
            Planifiez votre audit gratuit
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Un expert se déplace pour un diagnostic personnalisé (30-45 min)
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div {...fadeInUp}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">
                Vos informations
              </h2>

              <div className="space-y-4">
                {/* Company Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entreprise *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nom de votre entreprise"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.company ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                  {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
                </div>

                {/* SIRET Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro SIRET *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="12345678901234 (14 chiffres)"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.siret ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.siret}
                      onChange={(e) => handleSiretChange(e.target.value)}
                      maxLength="14"
                    />
                    {siretLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                  {errors.siret && <p className="text-red-600 text-sm mt-1">{errors.siret}</p>}
                  {siretError && <p className="text-orange-600 text-sm mt-1">{siretError}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Les coordonnées seront automatiquement remplies
                  </p>
                </div>

                {/* Department Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Département *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.department ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    >
                      <option value="">Sélectionnez votre département</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.code} value={dept.code}>
                          {dept.code} - {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Un commercial de votre secteur vous sera assigné
                  </p>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      placeholder="Prénom"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                    {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      placeholder="Nom"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                    {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="email@entreprise.fr"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="01 23 45 67 89"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Appointment Type - Only onsite allowed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Type de rendez-vous
                  </label>
                  <div className="p-3 border-2 border-blue-500 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="font-medium text-blue-900">Visite sur site uniquement</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Un expert se déplace dans vos locaux pour un diagnostic complet
                    </p>
                  </div>
                </div>

                {/* Address (always required since only onsite) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      placeholder="Adresse complète"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                    {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville *
                      </label>
                      <input
                        type="text"
                        placeholder="Ville"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.city ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                      {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        placeholder="75001"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.postalCode ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      />
                      {errors.postalCode && <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Calendar */}
          <motion.div {...fadeInUp}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">
                Choisissez votre créneau
              </h2>

              <div className="space-y-6">
                {/* Week Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Créneaux disponibles</h3>
                  <div className="text-sm text-gray-500">
                    {Object.keys(groupedSlots).length} jours disponibles
                  </div>
                </div>

                {/* Department Info */}
                {formData.department && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-900">
                        Secteur: {DEPARTMENTS.find(d => d.code === formData.department)?.name} ({formData.department})
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Commercial assigné selon optimisation des déplacements
                    </p>
                  </div>
                )}

                {/* Available Days */}
                {!formData.department ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Sélectionnez d'abord votre département</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Les créneaux disponibles dépendent de votre secteur
                    </p>
                  </div>
                ) : Object.keys(groupedSlots).length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun créneau disponible</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Contactez-nous pour planifier un rendez-vous
                    </p>
                  </div>
                ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(groupedSlots).slice(0, 10).map(([date, slots]) => (
                    <div key={date} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      {/* Date Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 text-base">
                          {formatDate(date)}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {slots.length} créneaux
                        </div>
                      </div>

                      {/* Time Slots Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {slots.map((slot, index) => {
                          const isSelected = formData.preferredDate === slot.date && formData.preferredTime === slot.time;
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                handleInputChange('preferredDate', slot.date);
                                handleInputChange('preferredTime', slot.time);
                              }}
                              className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              <Clock className={`h-4 w-4 mr-2 ${
                                isSelected ? 'text-white' : 'text-gray-500'
                              }`} />
                              <span className="font-medium text-sm">{slot.time}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                )}

                {/* Selection Summary */}
                {formData.preferredDate && formData.preferredTime && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Créneau sélectionné
                        </p>
                        <p className="text-sm text-blue-700">
                          {formatDate(formData.preferredDate)} à {formData.preferredTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Final Consent */}
        <motion.div {...fadeInUp} className="mt-8">
          <Card className="p-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.finalConsent}
                onChange={(e) => handleInputChange('finalConsent', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-900 leading-relaxed">
                  <strong>Je confirme</strong> vouloir bénéficier d'un audit télécom gratuit et
                  autorise le conseiller à me contacter pour confirmer ce rendez-vous.
                  Je peux annuler à tout moment.
                </p>
                {errors.finalConsent && (
                  <p className="text-red-600 text-sm mt-1">{errors.finalConsent}</p>
                )}
              </div>
              <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
            </div>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div {...fadeInUp} className="mt-8">
          <div className="flex justify-between">
            <Button
              onClick={handleBack}
              variant="ghost"
              icon={ArrowLeft}
            >
              Retour
            </Button>

            <Button
              onClick={handleSubmit}
              size="lg"
              icon={ArrowRight}
              disabled={!isFormValid()}
            >
              Confirmer le rendez-vous
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentBooking;