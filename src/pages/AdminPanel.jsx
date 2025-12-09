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
  AlertCircle,
  PieChart,
  BarChart3,
  DollarSign
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOperator, setFilterOperator] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [reporting, setReporting] = useState(null);
  const [activeTab, setActiveTab] = useState('leads');
  const [loading, setLoading] = useState(false);
  const API_URL = 'https://qualification-telecom-backend-production.up.railway.app/api';

  // Vérifier authentification
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    const loginTime = localStorage.getItem('adminLoginTime');

    if (!token || !email) {
      navigate('/admin-login');
      return;
    }

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
    loadLeads();
    loadReporting();
  }, [navigate]);

  // Charger les leads depuis l'API
  const loadLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/leads`);
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.data);
        setFilteredLeads(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement leads:', error);
      // Fallback localStorage si API échoue
      loadLeadsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fallback localStorage
  const loadLeadsFromLocalStorage = () => {
    try {
      const budgetData = localStorage.getItem('budgetData');
      const appointmentData = localStorage.getItem('appointmentData');
      const leadsArray = [];

      if (budgetData) {
        const budget = JSON.parse(budgetData);
        leadsArray.push({
          _id: '1',
          company: budget.company || 'Entreprise inconnue',
          firstName: budget.firstName || '',
          lastName: budget.lastName || '',
          email: budget.email || '',
          phone: budget.phone || '',
          operator: budget.operator || 'autre',
          fixedBudget: budget.fixedBudget || 0,
          internetBudget: budget.internetBudget || 0,
          cybersecurityBudget: budget.cybersecurityBudget || 0,
          totalBudget: (budget.fixedBudget || 0) + (budget.internetBudget || 0) + (budget.cybersecurityBudget || 0),
          status: 'pending',
          createdAt: budget.timestamp || new Date().toISOString(),
          consentContact: true
        });
      }

      if (appointmentData) {
        const appointment = JSON.parse(appointmentData);
        leadsArray.push({
          _id: '2',
          company: appointment.company || 'Entreprise inconnue',
          firstName: appointment.firstName || '',
          lastName: appointment.lastName || '',
          email: appointment.email || '',
          phone: appointment.phone || '',
          address: appointment.address,
          city: appointment.city,
          postalCode: appointment.postalCode,
          department: appointment.department,
          status: 'booked',
          appointmentDate: appointment.preferredDate,
          createdAt: appointment.timestamp || new Date().toISOString(),
          consentContact: appointment.finalConsent
        });
      }

      setLeads(leadsArray);
      setFilteredLeads(leadsArray);
    } catch (error) {
      console.error('Erreur localStorage:', error);
    }
  };

  // Charger reporting
  const loadReporting = async () => {
    try {
      const response = await fetch(`${API_URL}/leads/reporting/stats`);
      const data = await response.json();
      
      if (data.success) {
        setReporting(data.data);
      }
    } catch (error) {
      console.error('Erreur reporting:', error);
    }
  };

  // Filter et search
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        (lead.company?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (`${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    if (filterOperator !== 'all') {
      filtered = filtered.filter(lead => lead.operator === filterOperator);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, filterStatus, filterOperator]);

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

      if (field === 'totalBudget') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (field === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
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
      cancelled: 'bg-red-100 text-red-800',
      converted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      booked: 'RDV Confirmé',
      pending: 'En attente',
      cancelled: 'RDV Annulé',
      converted: 'Converti',
      rejected: 'Rejeté'
    };
    return labels[status] || status;
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      'Entreprise', 'Contact', 'Email', 'Téléphone', 'Opérateur', 'Budget Fixe', 'Budget Internet', 'Budget Antivirus', 'Budget Total', 'Statut', 'Date', 'Consentement'
    ];

    const csvData = filteredLeads.map(lead => [
      lead.company || '',
      `${lead.firstName || ''} ${lead.lastName || ''}`,
      lead.email || '',
      lead.phone || '',
      lead.operator || '',
      lead.fixedBudget || 0,
      lead.internetBudget || 0,
      lead.cybersecurityBudget || 0,
      lead.totalBudget || 0,
      getStatusLabel(lead.status),
      new Date(lead.createdAt).toLocaleDateString('fr-FR'),
      lead.consentContact ? 'Oui' : 'Non'
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

  // Calculs stats
  const stats = {
    totalLeads: leads.length,
    bookedLeads: leads.filter(l => l.status === 'booked').length,
    cancelledLeads: leads.filter(l => l.status === 'cancelled').length,
    pendingLeads: leads.filter(l => l.status === 'pending').length,
    totalFixedBudget: leads.reduce((sum, l) => sum + (l.fixedBudget || 0), 0),
    avgFixedBudget: leads.filter(l => l.fixedBudget > 0).length > 0 
      ? Math.round(leads.filter(l => l.fixedBudget > 0).reduce((sum, l) => sum + l.fixedBudget, 0) / leads.filter(l => l.fixedBudget > 0).length)
      : 0,
    totalInternetBudget: leads.reduce((sum, l) => sum + (l.internetBudget || 0), 0),
    avgInternetBudget: leads.filter(l => l.internetBudget > 0).length > 0
      ? Math.round(leads.filter(l => l.internetBudget > 0).reduce((sum, l) => sum + l.internetBudget, 0) / leads.filter(l => l.internetBudget > 0).length)
      : 0,
    totalCyberBudget: leads.reduce((sum, l) => sum + (l.cybersecurityBudget || 0), 0),
    avgCyberBudget: leads.filter(l => l.cybersecurityBudget > 0).length > 0
      ? Math.round(leads.filter(l => l.cybersecurityBudget > 0).reduce((sum, l) => sum + l.cybersecurityBudget, 0) / leads.filter(l => l.cybersecurityBudget > 0).length)
      : 0,
    totalOverall: leads.reduce((sum, l) => sum + (l.totalBudget || 0), 0),
    avgOverall: leads.filter(l => l.totalBudget > 0).length > 0
      ? Math.round(leads.filter(l => l.totalBudget > 0).reduce((sum, l) => sum + l.totalBudget, 0) / leads.filter(l => l.totalBudget > 0).length)
      : 0,
    withConsent: leads.filter(l => l.consentContact).length
  };

  // Répartition opérateur
  const operatorDistribution = {};
  leads.forEach(lead => {
    const op = lead.operator || 'autre';
    operatorDistribution[op] = (operatorDistribution[op] || 0) + 1;
  });

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

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'leads'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📊 Leads
          </button>
          <button
            onClick={() => setActiveTab('reporting')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'reporting'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📈 Reporting
          </button>
        </div>

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <>
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
            >
              <StatCard value={stats.totalLeads} label="Total Leads" icon={Users} color="blue" />
              <StatCard value={stats.bookedLeads} label="RDV Confirmés" icon={Calendar} color="green" />
              <StatCard value={stats.cancelledLeads} label="RDV Annulés" icon={AlertCircle} color="red" />
              <StatCard value={stats.pendingLeads} label="En Attente" icon={AlertCircle} color="amber" />
              <StatCard value={stats.withConsent} label="Avec Consentement" icon={Shield} color="green" />
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
                  <option value="all">Tous statuts</option>
                  <option value="booked">RDV Confirmés</option>
                  <option value="cancelled">RDV Annulés</option>
                  <option value="pending">En attente</option>
                  <option value="converted">Convertis</option>
                </select>

                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value)}
                >
                  <option value="all">Tous opérateurs</option>
                  <option value="orange">Orange</option>
                  <option value="sfr">SFR</option>
                  <option value="bouygues">Bouygues</option>
                  <option value="free">Free</option>
                  <option value="autre">Autre</option>
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
              {loading || filteredLeads.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{loading ? 'Chargement...' : 'Aucun lead'}</p>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Opérateur
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('totalBudget')}
                        >
                          Budget Total {getSortIcon('totalBudget')}
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
                        <tr key={lead._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium text-gray-900">{lead.company || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-gray-900">{`${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-gray-600">{lead.email || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm font-medium capitalize">{lead.operator || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium text-gray-900">
                              {lead.totalBudget ? `${lead.totalBudget}€` : '0€'}
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
          </>
        )}

        {/* REPORTING TAB */}
        {activeTab === 'reporting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fixe */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Téléphonie Fixe</h3>
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">CA Total</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalFixedBudget}€</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Panier Moyen</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.avgFixedBudget}€</p>
                  </div>
                </div>
              </div>

              {/* Internet */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Internet</h3>
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">CA Total</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalInternetBudget}€</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Panier Moyen</p>
                    <p className="text-2xl font-bold text-green-600">{stats.avgInternetBudget}€</p>
                  </div>
                </div>
              </div>

              {/* Antivirus */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Antivirus</h3>
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">CA Total</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalCyberBudget}€</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Panier Moyen</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.avgCyberBudget}€</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Vue Globale</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="text-sm text-gray-600">CA Total</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOverall}€</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <p className="text-sm text-gray-600">Panier Moyen Global</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgOverall}€</p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="text-sm text-gray-600">Leads avec Consentement</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.withConsent}</p>
                </div>
              </div>
            </div>

            {/* Répartition Opérateur */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Répartition par Opérateur</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(operatorDistribution).map(([operator, count]) => (
                  <div key={operator} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 capitalize">{operator}</p>
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                    <p className="text-xs text-gray-600">{Math.round(count / leads.length * 100)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

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
                        <p className="font-medium text-gray-900">{selectedLead.company || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Opérateur</p>
                        <p className="font-medium text-gray-900 capitalize">{selectedLead.operator || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Statut</p>
                        <p className="font-medium text-gray-900">{getStatusLabel(selectedLead.status)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Budget Total</p>
                        <p className="font-medium text-gray-900">{selectedLead.totalBudget || 0}€</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{`${selectedLead.firstName || ''} ${selectedLead.lastName || ''}`.trim() || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedLead.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedLead.phone || 'N/A'}</span>
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

                  {(selectedLead.fixedBudget > 0 || selectedLead.internetBudget > 0 || selectedLead.cybersecurityBudget > 0) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Détail Budget</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Fixe</p>
                          <p className="font-medium">{selectedLead.fixedBudget || 0}€</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Internet</p>
                          <p className="font-medium">{selectedLead.internetBudget || 0}€</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Antivirus</p>
                          <p className="font-medium">{selectedLead.cybersecurityBudget || 0}€</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Consentement RGPD</h3>
                    <div className="flex items-center space-x-2">
                      {selectedLead.consentContact ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <Shield className="h-4 w-4" />
                          <span>Consentement donné ✓</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>Pas de consentement</span>
                        </div>
                      )}
                    </div>
                  </div>
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
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200'
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600'
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
