import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const DEPARTMENTS = [
  { code: '01', name: 'Ain' },
  { code: '02', name: 'Aisne' },
  { code: '03', name: 'Allier' },
  { code: '04', name: 'Alpes-de-Haute-Provence' },
  { code: '05', name: 'Hautes-Alpes' },
  { code: '06', name: 'Alpes-Maritimes' },
  { code: '07', name: 'Ardèche' },
  { code: '08', name: 'Ardennes' },
  { code: '09', name: 'Ariège' },
  { code: '10', name: 'Aube' },
  { code: '11', name: 'Aude' },
  { code: '12', name: 'Aveyron' },
  { code: '13', name: 'Bouches-du-Rhône' },
  { code: '14', name: 'Calvados' },
  { code: '15', name: 'Cantal' },
  { code: '16', name: 'Charente' },
  { code: '17', name: 'Charente-Maritime' },
  { code: '18', name: 'Cher' },
  { code: '19', name: 'Corrèze' },
  { code: '21', name: 'Côte-d\'Or' },
  { code: '22', name: 'Côtes-d\'Armor' },
  { code: '23', name: 'Creuse' },
  { code: '24', name: 'Dordogne' },
  { code: '25', name: 'Doubs' },
  { code: '26', name: 'Drôme' },
  { code: '27', name: 'Eure' },
  { code: '28', name: 'Eure-et-Loir' },
  { code: '29', name: 'Finistère' },
  { code: '2A', name: 'Corse-du-Sud' },
  { code: '2B', name: 'Haute-Corse' },
  { code: '30', name: 'Gard' },
  { code: '31', name: 'Haute-Garonne' },
  { code: '32', name: 'Gers' },
  { code: '33', name: 'Gironde' },
  { code: '34', name: 'Hérault' },
  { code: '35', name: 'Ille-et-Vilaine' },
  { code: '36', name: 'Indre' },
  { code: '37', name: 'Indre-et-Loire' },
  { code: '38', name: 'Isère' },
  { code: '39', name: 'Jura' },
  { code: '40', name: 'Landes' },
  { code: '41', name: 'Loir-et-Cher' },
  { code: '42', name: 'Loire' },
  { code: '43', name: 'Haute-Loire' },
  { code: '44', name: 'Loire-Atlantique' },
  { code: '45', name: 'Loiret' },
  { code: '46', name: 'Lot' },
  { code: '47', name: 'Lot-et-Garonne' },
  { code: '48', name: 'Lozère' },
  { code: '49', name: 'Maine-et-Loire' },
  { code: '50', name: 'Manche' },
  { code: '51', name: 'Marne' },
  { code: '52', name: 'Haute-Marne' },
  { code: '53', name: 'Mayenne' },
  { code: '54', name: 'Meurthe-et-Moselle' },
  { code: '55', name: 'Meuse' },
  { code: '56', name: 'Morbihan' },
  { code: '57', name: 'Moselle' },
  { code: '58', name: 'Nièvre' },
  { code: '59', name: 'Nord' },
  { code: '60', name: 'Oise' },
  { code: '61', name: 'Orne' },
  { code: '62', name: 'Pas-de-Calais' },
  { code: '63', name: 'Puy-de-Dôme' },
  { code: '64', name: 'Pyrénées-Atlantiques' },
  { code: '65', name: 'Hautes-Pyrénées' },
  { code: '66', name: 'Pyrénées-Orientales' },
  { code: '67', name: 'Bas-Rhin' },
  { code: '68', name: 'Haut-Rhin' },
  { code: '69', name: 'Rhône' },
  { code: '70', name: 'Haute-Saône' },
  { code: '71', name: 'Saône-et-Loire' },
  { code: '72', name: 'Sarthe' },
  { code: '73', name: 'Savoie' },
  { code: '74', name: 'Haute-Savoie' },
  { code: '75', name: 'Paris' },
  { code: '76', name: 'Seine-Maritime' },
  { code: '77', name: 'Seine-et-Marne' },
  { code: '78', name: 'Yvelines' },
  { code: '79', name: 'Deux-Sèvres' },
  { code: '80', name: 'Somme' },
  { code: '81', name: 'Tarn' },
  { code: '82', name: 'Tarn-et-Garonne' },
  { code: '83', name: 'Var' },
  { code: '84', name: 'Vaucluse' },
  { code: '85', name: 'Vendée' },
  { code: '86', name: 'Vienne' },
  { code: '87', name: 'Haute-Vienne' },
  { code: '88', name: 'Vosges' },
  { code: '89', name: 'Yonne' },
  { code: '90', name: 'Territoire de Belfort' },
  { code: '91', name: 'Essonne' },
  { code: '92', name: 'Hauts-de-Seine' },
  { code: '93', name: 'Seine-Saint-Denis' },
  { code: '94', name: 'Val-de-Marne' },
  { code: '95', name: 'Val-d\'Oise' }
];

const AVAILABLE_TIMES = ['09:00', '11:00', '14:00', '16:00'];

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [siretLoading, setSiretLoading] = useState(false);
  const [siretError, setSiretError] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    company: '',
    siret: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    department: '',
    preferredDate: '',
    preferredTime: '',
    finalConsent: false,
    timestamp: new Date().toISOString()
  });

  const [availableDates, setAvailableDates] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    generateAvailableDates();
  }, []);

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    setAvailableDates(dates);
  };

  const searchSiretData = async (siret) => {
    if (!siret || siret.length !== 14) return;

    setSiretLoading(true);
    setSiretError('');

    try {
      const response = await fetch(
        `https://data.opendatasoft.com/api/v2/catalog/datasets/sirene_v3/records?where=siret%3D%22${siret}%22&limit=1`,
        { method: 'GET', headers: { 'Accept': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const record = data.results[0].record.fields;
          const codePostal = record.code_postal || '';
          const department = codePostal.substring(0, 2);

          setFormData(prev => ({
            ...prev,
            company: record.nom_commercial || record.denomination || 'Entreprise',
            address: record.adresse_complete || '',
            postalCode: codePostal,
            city: record.libelle_commune || '',
            department: department
          }));

          setErrors(prev => ({
            ...prev,
            company: '', address: '', postalCode: '', city: '', department: ''
          }));
          return;
        }
      }

      setSiretError('SIRET non trouvé. Veuillez saisir manuellement.');
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      timestamp: new Date().toISOString()
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
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
      formData.department.trim() &&
      formData.preferredDate &&
      formData.preferredTime &&
      formData.finalConsent
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  const formatDateFull = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('appointmentData', JSON.stringify(formData));

    // Envoyer au backend
    try {
      const response = await fetch('https://qualification-telecom-backend-production.up.railway.app/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: formData.company,
          siret: formData.siret,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          department: formData.department,
          appointmentDate: formData.preferredDate,
          appointmentTime: formData.preferredTime,
          status: 'booked',
          consentContact: formData.finalConsent,
          source: 'form_appointment'
        })
      });

      const data = await response.json();
      console.log('RDV sauvegardé au backend:', data);
    } catch (error) {
      console.error('Erreur envoi backend:', error);
    }

    navigate('/success');
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Planifiez votre audit</h1>
              <p className="text-gray-600 mt-1">Expert se déplace sur site (30-45 min)</p>
            </div>
          </div>
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            Étape 4/4
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-5 gap-8">
          {/* Formulaire - 3 colonnes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Entreprise et SIRET */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Entreprise *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Nom entreprise"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {errors.company && <p className="text-red-600 text-xs mt-1">{errors.company}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      SIRET *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.siret}
                        onChange={(e) => handleSiretChange(e.target.value)}
                        placeholder="14 chiffres"
                        maxLength="14"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.siret ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {siretLoading && (
                        <div className="absolute right-3 top-3.5">
                          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                        </div>
                      )}
                    </div>
                    {siretError && <p className="text-red-600 text-xs mt-1">{siretError}</p>}
                    {errors.siret && <p className="text-red-600 text-xs mt-1">{errors.siret}</p>}
                  </div>
                </div>

                {/* Prénom et Nom */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Votre prénom"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email et Téléphone */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="vous@entreprise.fr"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+33 1 23 45 67 89"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Adresse *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Rue Test"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                {/* Ville, CP, Département */}
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Paris"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Code Postal *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="75001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.postalCode && <p className="text-red-600 text-xs mt-1">{errors.postalCode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Département *
                    </label>
                    <div className={`w-full px-4 py-3 border rounded-lg bg-white flex items-center justify-between ${
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
                    {errors.department && <p className="text-red-600 text-xs mt-1">{errors.department}</p>}
                    {formData.siret.length === 14 && (
                      <p className="text-xs text-green-600 mt-1">✓ Auto-rempli depuis le SIRET</p>
                    )}
                  </div>
                </div>

                {/* Consentement */}
                <div className="border-t pt-6">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.finalConsent}
                      onChange={(e) => handleInputChange('finalConsent', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded mt-1"
                    />
                    <div className="flex items-start space-x-2">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        Je confirme vouloir bénéficier d'un audit télécom gratuit et j'accepte les conditions RGPD
                      </span>
                    </div>
                  </label>
                  {errors.finalConsent && <p className="text-red-600 text-xs mt-2">{errors.finalConsent}</p>}
                </div>

                {/* Navigation */}
                <div className="flex space-x-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => navigate('/appointment')}
                    className="flex items-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Retour</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!isFormValid()}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition font-semibold ${
                      isFormValid()
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Confirmer</span>
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Calendar - 2 colonnes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2"
          >
            <div className="sticky top-32 bg-gradient-to-b from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dates disponibles</h3>

              <div className="space-y-2 mb-6">
                {availableDates.map((date) => (
                  <motion.button
                    key={date}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('preferredDate', date)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                      formData.preferredDate === date
                        ? 'border-blue-600 bg-white shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{formatDate(date)}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {formData.preferredDate && (
                <>
                  <div className="border-t pt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Horaires disponibles</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_TIMES.map((time) => (
                        <motion.button
                          key={time}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInputChange('preferredTime', time)}
                          className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border-2 transition font-semibold ${
                            formData.preferredTime === time
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                          <span>{time}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {formData.preferredTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-white border-2 border-green-200 rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">✓ Rendez-vous</p>
                          <p className="text-sm text-gray-600">{formatDateFull(formData.preferredDate)}</p>
                          <p className="text-sm text-gray-600">À {formData.preferredTime}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentBooking;
