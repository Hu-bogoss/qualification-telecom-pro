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
  ArrowRight,
  ArrowLeft,
  Shield,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

// French departments
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

const AVAILABLE_TIMES = ['09:00', '11:00', '14:00', '16:00'];

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    preferredDate: '',
    preferredTime: '',
    siret: '',
    department: '',
    finalConsent: false,
  });
  const [siretLoading, setSiretLoading] = useState(false);
  const [siretError, setSiretError] = useState('');
  const [errors, setErrors] = useState({});
  const [availableDates, setAvailableDates] = useState([]);

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();

    // Générer 60 jours de disponibilité
    for (let i = 1; i <= 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Passer les weekends (0 = dimanche, 6 = samedi)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }

    setAvailableDates(dates);
  };

  useEffect(() => {
    generateAvailableDates();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const searchSiretData = async (siret) => {
    if (!siret || siret.length !== 14) return;

    setSiretLoading(true);
    setSiretError('');

    try {
      // API SIRÈNE publique OpenDataSoft (données officielle INSEE)
      // Pas de token requis, totalement gratuit
      const encodedSiret = encodeURIComponent(`"${siret}"`);
      const response = await fetch(
        `https://data.opendatasoft.com/api/v2/catalog/datasets/sirene_v3/records?where=siret=${encodedSiret}&limit=1`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        setSiretError('SIRET non trouvé. Veuillez saisir manuellement.');
        setSiretLoading(false);
        return;
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const record = data.results[0].record.fields;
        const codePostal = record.code_postal || '';
        const department = codePostal.substring(0, 2);

        setFormData(prev => ({
          ...prev,
          company: record.nom_commercial || record.denomination || record.enseigne || 'Entreprise',
          address: record.adresse_complete || '',
          postalCode: codePostal,
          city: record.libelle_commune || '',
          department: department
        }));

        setErrors(prev => ({
          ...prev,
          company: '',
          address: '',
          postalCode: '',
          city: '',
          department: ''
        }));
      } else {
        setSiretError('SIRET non trouvé. Veuillez saisir manuellement.');
      }
    } catch (error) {
      console.error('Erreur API SIRÈNE:', error);
      setSiretError('Erreur de recherche. Veuillez saisir manuellement.');
    } finally {
      setSiretLoading(false);
    }
  };

  const handleSiretChange = (value) => {
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length <= 14) {
      handleInputChange('siret', cleanValue);
      setSiretError('');

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
    if (!formData.address.trim()) newErrors.address = 'Adresse requise';
    if (!formData.city.trim()) newErrors.city = 'Ville requise';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Code postal requis';
    if (!formData.preferredDate) newErrors.preferredDate = 'Date requise';
    if (!formData.preferredTime) newErrors.preferredTime = 'Heure requise';
    if (!formData.finalConsent) newErrors.finalConsent = 'Consentement requis';

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

    const appointmentData = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      id: Date.now().toString()
    };

    localStorage.setItem('appointmentData', JSON.stringify(appointmentData));
    console.log('Appointment booked:', appointmentData);

    navigate('/success');
  };

  const handleBack = () => {
    navigate('/results');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatDateFull = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">TelecomAudit</div>
          <div className="text-sm text-gray-600">Étape 4/4 - Planifiez votre audit</div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-8"
            >
              <Calendar className="w-8 h-8 text-blue-600" strokeWidth={2} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Planifiez votre audit
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Un expert se déplace pour un diagnostic personnalisé sur site (30-45 minutes)
            </motion.p>
          </motion.div>

          {/* Two Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid lg:grid-cols-5 gap-12"
          >
            {/* Left: Form (3 columns) */}
            <div className="lg:col-span-3 space-y-8">
              {/* Contact Information Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Informations de contact
                </h2>

                <div className="space-y-6">
                  {/* Company & SIRET Row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Entreprise *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Nom"
                          className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.company ? 'border-red-300' : 'border-gray-300'
                          }`}
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                        />
                      </div>
                      {errors.company && <p className="text-red-600 text-xs mt-1">{errors.company}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        SIRET *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="14 chiffres"
                          className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.siret ? 'border-red-300' : 'border-gray-300'
                          }`}
                          value={formData.siret}
                          onChange={(e) => handleSiretChange(e.target.value)}
                          maxLength="14"
                        />
                        {siretLoading && (
                          <div className="absolute right-3 top-3.5">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                      {errors.siret && <p className="text-red-600 text-xs mt-1">{errors.siret}</p>}
                      {siretError && <p className="text-orange-600 text-xs mt-1">{siretError}</p>}
                    </div>
                  </div>

                  {/* Prenom & Nom Row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        placeholder="Votre prénom"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                      {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        placeholder="Votre nom"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                      {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="vous@entreprise.fr"
                          className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Téléphone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="01 23 45 67 89"
                          className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      placeholder="Adresse complète"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                    {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                  </div>

                  {/* City & PostalCode & Department Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        placeholder="Ville"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.city ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                      {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        CP *
                      </label>
                      <input
                        type="text"
                        placeholder="75001"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.postalCode ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      />
                      {errors.postalCode && <p className="text-red-600 text-xs mt-1">{errors.postalCode}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Département *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <div className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-white flex items-center justify-between ${
                          errors.department ? 'border-red-300' : 'border-gray-300'
                        } ${formData.siret.length === 14 ? 'bg-gray-100' : ''}`}>
                          <span className={formData.department ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
                            {formData.department 
                              ? `${formData.department} - ${DEPARTMENTS.find(d => d.code === formData.department)?.name}`
                              : 'Sélectionner...'}
                          </span>
                          {formData.siret.length === 14 && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                      {errors.department && <p className="text-red-600 text-xs mt-1">{errors.department}</p>}
                      {formData.siret.length === 14 && (
                        <p className="text-xs text-green-600 mt-1">✓ Auto-rempli depuis le SIRET</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={formData.finalConsent}
                    onChange={(e) => handleInputChange('finalConsent', e.target.checked)}
                    className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      Je confirme vouloir bénéficier d'un <strong>audit télécom gratuit</strong> et autorise le conseiller à me contacter pour confirmer ce rendez-vous.
                    </p>
                    {errors.finalConsent && (
                      <p className="text-red-600 text-xs mt-2">{errors.finalConsent}</p>
                    )}
                  </div>
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.05, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-semibold transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour</span>
                </motion.button>

                <motion.button
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  whileHover={{ scale: isFormValid() ? 1.05 : 1 }}
                  whileTap={{ scale: isFormValid() ? 0.95 : 1 }}
                  className={`flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold transition ${
                    isFormValid()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Confirmer</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Right: Calendar (2 columns) */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm p-8 sticky top-32">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Sélectionnez une date
                </h2>

                {!formData.department ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Sélectionnez votre département</p>
                    <p className="text-sm text-gray-500 mt-2">pour voir les créneaux</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {availableDates.map((date) => {
                      const isSelected = formData.preferredDate === date;
                      const dateObj = new Date(date + 'T00:00:00');

                      return (
                        <motion.button
                          key={date}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => handleInputChange('preferredDate', date)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition ${
                            isSelected
                              ? 'border-blue-600 bg-white shadow-md'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {formatDate(date)}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {dateObj.toLocaleDateString('fr-FR', { weekday: 'long' })}
                              </p>
                            </div>
                            <ChevronRight className={`w-5 h-5 transition ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Time Selection */}
                {formData.preferredDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 pt-8 border-t border-blue-200"
                  >
                    <p className="text-sm font-semibold text-gray-900 mb-4">Horaires disponibles</p>
                    <div className="grid grid-cols-2 gap-3">
                      {AVAILABLE_TIMES.map((time) => {
                        const isSelected = formData.preferredTime === time;
                        return (
                          <motion.button
                            key={time}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => handleInputChange('preferredTime', time)}
                            className={`flex items-center justify-center p-3 rounded-lg border-2 transition ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                            }`}
                          >
                            <Clock className="h-4 w-4 mr-1.5" />
                            <span className="font-semibold">{time}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Summary */}
                {formData.preferredDate && formData.preferredTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-white rounded-lg border-2 border-green-200"
                  >
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-green-900 uppercase">Rendez-vous</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatDateFull(formData.preferredDate)}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          À {formData.preferredTime}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
