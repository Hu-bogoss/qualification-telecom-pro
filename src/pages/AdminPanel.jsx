import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Download,
  Search,
  Eye,
  Calendar,
  TrendingUp,
  Shield,
  Phone,
  Mail,
  MapPin,
  LogOut,
  ChevronUp,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    const loginTime = localStorage.getItem('adminLoginTime');

    if (!token || !email) {
      navigate('/admin-login');
      return;
    }

    // Vérifier que la session n'a pas expiré (24h)
    if (loginTime) {
      const now = new Date();
      const lastLogin = new Date(loginTime);
      const diffHours = (now - lastLogin) / (1000 * 60 * 60);

      if (diffHours > 24) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminLoginTime');
        navigate('/admin-login');
        return;
      }
    }

    setIsAuthenticated(true);
    setAdminEmail(email);
    loadLeadsData();
  }, [navigate]);

  // Charger les leads depuis localStorage
  const loadLeadsData = () => {
    try {
      const budgetData = localStorage.getItem('budgetData');
      const appointmentData = localStorage.getItem('appointmentData');

      const leadsArray = [];

      if (budgetData) {
        const budget = JSON.parse(budgetData);
        leadsArray.push({
          id: 1,
          company: budget.company || 'Entreprise inconnue',
          contact: `${budget.firstName} ${budget.lastName}`,
          email: budget.email || '',
          phone: budget.phone || '',
          role: budget.role || 'Non spécifié',
          totalBudget: (budget.fixedBudget || 0) + (budget.internetBudget || 0) + (budget.cybersecurityBudget || 0),
          fixedBudget: budget.fixedBudget || 0,
          internetBudget: budget.internetBudget || 0,
          cybersecurityBudget: budget.cybersecurityBudget || 0,
          companySize: budget.companySize || 'Non spécifié',
          multiSite: budget.multiSites || false,
          cybersecurity: budget.cybersecurity || 'Non spécifié',
          createdAt: budget.timestamp || new Date().toISOString(),
          status: appointmentData ? 'booked' : 'pending',
          appointmentDate: appointmentData ? appointmentData.preferredDate : null,
          consentGiven: true,
          source: 'form_budget'
        });
      }

      if (appointmentData) {
        const appointment = JSON.parse(appointmentData);
        leadsArray.push({
          id: 2,
          company: appointment.company || 'Entreprise inconnue',
          contact: `${appointment.firstName} ${appointment.lastName}`,
          email: appointment.email || '',
          phone: appointment.phone || '',
          role: 'Non spécifié',
          address: appointment.address,
          city: appointment.city,
          postalCode: appointment.postalCode,
          department: appointment.department,
          totalBudget: 0,
          companySize: 'Non spécifié',
          multiSite: false,
          cybersecurity: 'Non spécifié',
          createdAt: appointment.timestamp || new Date().toISOString(),
          status: 'booked',
          appointmentDate: `${appointment.preferredDate}T${appointment.preferredTime}:00Z`,
          consentGiven: appointment.finalConsent,
          source: 'form_appointment'
        });
      }

      setLeads(leadsArray);
      setFilteredLeads(leadsArray);
    } catch (error) {
      console.error('Erreur loading leads:', error);
    }
  };

  // Filter et search
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, filterStatus]);

  // Tri
  const handleSort = (field) => {
    let direction = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortField(field);
    setSortDirection(direction);

    const sortedLeads = [...filteredLeads].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (field === 'totalBudget' || field === 'companySize') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (field === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLeads(sortedLeads);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ?
      <ChevronUp className="h-4 w-4 inline ml-1" /> :
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      booked: 'bg-green-100 text-green-800',
      pending: 'bg-amber-100 text-amber-800',
      converted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      booked: 'RDV Confirmé',
      pending: 'En attente',
      converted: 'Converti',
      rejected: 'Rejeté'
    };
    return labels[status] || status;
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      'Entreprise', 'Contact', 'Email', 'Téléphone', 'Budget Total', 'Statut', 'Date', 'Source'
    ];

    const csvData = filteredLeads.map(lead => [
      lead.company,
      lead.contact,
      lead.email,
      lead.phone,
      lead.totalBudget || 'N/A',
      getStatusLabel(lead.status),
      new Date(lead.createdAt).toLocaleDateString('fr-FR'),
      lead.source
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminLoginTime');
    navigate('/admin-login');
  };

  const stats = {
    totalLeads: leads.length,
    bookedLeads: leads.filter(l => l.status === 'booked').length,
    pendingLeads: leads.filter(l => l.status === 'pending').length,
    averageBudget: leads.filter(l => l.totalBudget > 0).length > 0
      ? Math.round(leads.filter(l => l.totalBudget > 0).reduce((sum, l) => sum + l.totalBudget, 0) / leads.filter(l => l.totalBudget > 0).length)
      : 0
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg sticky top-0 z-50 mb-8 rounded-lg"
        >
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Connecté: {adminEmail}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">RGPD ✓</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <StatCard value={stats.totalLeads} label="Total Leads" icon={Users} />
          <StatCard value={stats.bookedLeads} label="RDV Confirmés" icon={Calendar} color="green" />
          <StatCard value={stats.pendingLeads} label="En Attente" icon={AlertCircle} color="amber" />
          <StatCard value={`${stats.averageBudget}€`} label="Budget Moyen" icon={TrendingUp} color="blue" />
        </motion.div>

        {/* Search et Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="booked">RDV Confirmés</option>
              <option value="pending">En attente</option>
              <option value="converted">Convertis</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="h-5 w-5" />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun lead pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('company')}
                    >
                      Entreprise {getSortIcon('company')}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('contact')}
                    >
                      Contact {getSortIcon('contact')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalBudget')}
                    >
                      Budget {getSortIcon('totalBudget')}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      Statut {getSortIcon('status')}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      Date {getSortIcon('createdAt')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900">{lead.company}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{lead.contact}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900">
                          {lead.totalBudget ? `${lead.totalBudget}€/mois` : 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-5 w-5" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Details Modal */}
        {showDetails && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Détails du Lead</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Entreprise</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Entreprise</p>
                        <p className="font-medium text-gray-900">{selectedLead.company}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Statut</p>
                        <p className="font-medium text-gray-900">{getStatusLabel(selectedLead.status)}</p>
                      </div>
                      {selectedLead.totalBudget > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Budget Total</p>
                          <p className="font-medium text-gray-900">{selectedLead.totalBudget}€/mois</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{selectedLead.contact}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedLead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedLead.phone}</span>
                      </div>
                    </div>
                  </div>

                  {selectedLead.address && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Adresse</h3>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p>{selectedLead.address}</p>
                          <p>{selectedLead.postalCode} {selectedLead.city}</p>
                          <p className="text-sm text-gray-600">{selectedLead.department}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedLead.fixedBudget > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Détail Budget</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Fixe</p>
                          <p className="font-medium">{selectedLead.fixedBudget}€</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Internet</p>
                          <p className="font-medium">{selectedLead.internetBudget}€</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cyber</p>
                          <p className="font-medium">{selectedLead.cybersecurityBudget}€</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StatCard = ({ value, label, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200'
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    amber: 'text-amber-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 ${colors[color]} rounded-lg p-6`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`h-10 w-10 ${iconColors[color]}`} />
      </div>
    </motion.div>
  );
};

export default AdminPanel;
