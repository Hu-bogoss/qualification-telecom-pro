import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Download,
  Filter,
  Search,
  Eye,
  Trash2,
  Calendar,
  TrendingUp,
  Shield,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Edit,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import Card, { StatCard } from '../components/Card';
import Button from '../components/Button';
import { formatCurrency, formatPercentage, calculateLeadScore } from '../utils/calculations';
import { fadeInUp, containerVariants, itemVariants } from '../utils/motion';

const AdminPanel = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  // Mock data for demonstration with department and postal code
  useEffect(() => {
    const mockLeads = [
      {
        id: 1,
        company: 'TechCorp SARL',
        contact: 'Marie Dubois',
        email: 'marie.dubois@techcorp.fr',
        phone: '+33 1 42 86 75 30',
        role: 'DG',
        totalBudget: 850,
        companySize: 25,
        multiSite: true,
        cybersecurity: 'no',
        phoneSystem: 'rental',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'qualified',
        appointmentDate: '2024-01-22T14:00:00Z',
        consentGiven: true,
        ipAddress: '192.168.1.1',
        department: '75 Paris',
        postalCode: '75001'
      },
      {
        id: 2,
        company: 'Boutique Mode',
        contact: 'Pierre Martin',
        email: 'p.martin@boutiquemode.fr',
        phone: '+33 1 45 23 67 89',
        role: 'Gérant',
        totalBudget: 320,
        companySize: 8,
        multiSite: false,
        cybersecurity: 'unsure',
        phoneSystem: 'purchase',
        createdAt: '2024-01-14T16:45:00Z',
        status: 'pending',
        appointmentDate: null,
        consentGiven: true,
        ipAddress: '192.168.1.2',
        department: '69 Rhône',
        postalCode: '69001'
      },
      {
        id: 3,
        company: 'Conseil & Associés',
        contact: 'Sophie Laurent',
        email: 'sophie@conseil-associes.fr',
        phone: '+33 1 56 78 90 12',
        role: 'DAF',
        totalBudget: 1200,
        companySize: 45,
        multiSite: true,
        cybersecurity: 'yes',
        phoneSystem: 'rental',
        createdAt: '2024-01-13T09:15:00Z',
        status: 'converted',
        appointmentDate: '2024-01-20T10:00:00Z',
        consentGiven: true,
        ipAddress: '192.168.1.3',
        department: '33 Gironde',
        postalCode: '33000'
      },
      {
        id: 4,
        company: 'Innovation Tech',
        contact: 'Jean Dupont',
        email: 'j.dupont@innovation-tech.fr',
        phone: '+33 2 98 76 54 32',
        role: 'CTO',
        totalBudget: 950,
        companySize: 35,
        multiSite: false,
        cybersecurity: 'yes',
        phoneSystem: 'rental',
        createdAt: '2024-01-12T11:20:00Z',
        status: 'qualified',
        appointmentDate: '2024-01-25T09:30:00Z',
        consentGiven: true,
        ipAddress: '192.168.1.4',
        department: '29 Finistère',
        postalCode: '29200'
      },
      {
        id: 5,
        company: 'Services Plus',
        contact: 'Anne Moreau',
        email: 'a.moreau@services-plus.fr',
        phone: '+33 4 91 23 45 67',
        role: 'Directrice',
        totalBudget: 680,
        companySize: 18,
        multiSite: true,
        cybersecurity: 'no',
        phoneSystem: 'purchase',
        createdAt: '2024-01-11T14:15:00Z',
        status: 'pending',
        appointmentDate: null,
        consentGiven: true,
        ipAddress: '192.168.1.5',
        department: '13 Bouches-du-Rhône',
        postalCode: '13001'
      }
    ];

    setLeads(mockLeads);
    setFilteredLeads(mockLeads);
  }, []);

  // Filter and search functionality
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

  // Sorting functionality
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

      // Handle different data types
      if (field === 'totalBudget' || field === 'companySize') {
        aValue = Number(aValue);
        bValue = Number(bValue);
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
    if (sortField !== field) {
      return null;
    }
    return sortDirection === 'asc' ?
      <ChevronUp className="h-4 w-4 inline ml-1" /> :
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      qualified: 'bg-blue-100 text-blue-800',
      pending: 'bg-amber-100 text-amber-800',
      converted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      qualified: 'Qualifié',
      pending: 'En attente',
      converted: 'Converti',
      rejected: 'Rejeté'
    };
    return labels[status] || status;
  };

  const statusOptions = [
    { value: 'qualified', label: 'Qualifié' },
    { value: 'pending', label: 'En attente' },
    { value: 'converted', label: 'Converti' },
    { value: 'rejected', label: 'Rejeté' }
  ];

  const handleStatusChange = (leadId, status) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status } : lead
      )
    );
    setEditingStatus(null);
  };

  const startEditingStatus = (leadId, currentStatus) => {
    setEditingStatus(leadId);
    setNewStatus(currentStatus);
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      'Entreprise', 'Contact', 'Email', 'Téléphone', 'Rôle',
      'Budget Total', 'Taille', 'Multi-sites', 'Cybersécurité',
      'Système Téléphonique', 'Département', 'Code Postal', 'Date Création', 'Statut', 'Score'
    ];

    const csvData = filteredLeads.map(lead => {
      const score = calculateLeadScore(lead);
      return [
        lead.company,
        lead.contact,
        lead.email,
        lead.phone,
        lead.role,
        lead.totalBudget,
        lead.companySize,
        lead.multiSite ? 'Oui' : 'Non',
        lead.cybersecurity,
        lead.phoneSystem,
        lead.department,
        lead.postalCode,
        new Date(lead.createdAt).toLocaleDateString('fr-FR'),
        getStatusLabel(lead.status),
        score.score
      ];
    });

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
    // Clear admin session
    localStorage.removeItem('adminAuthenticated');
    // Redirect to home page
    navigate('/');
  };

  const stats = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    convertedLeads: leads.filter(l => l.status === 'converted').length,
    averageBudget: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.totalBudget, 0) / leads.length) : 0
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-heading">Panel d'Administration</h1>
          <p className="text-gray-600">Gestion des leads et suivi des conversions</p>
        </motion.div>

        {/* Admin Navbar with Logout */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg sticky top-0 z-50 mb-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-2 rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 font-heading">TelecomAudit Admin</h1>
                  <p className="text-xs text-gray-600">Panneau d'administration</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">RGPD Conforme</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  icon={LogOut}
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={stats.totalLeads}
            label="Total Leads"
            trend={12}
          />
          <StatCard
            value={stats.qualifiedLeads}
            label="Leads Qualifiés"
            trend={8}
          />
          <StatCard
            value={stats.convertedLeads}
            label="Conversions"
            trend={15}
          />
          <StatCard
            value={formatCurrency(stats.averageBudget)}
            label="Budget Moyen"
            trend={-3}
          />
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants}>
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par entreprise, contact ou email..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
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
                  <option value="qualified">Qualifiés</option>
                  <option value="pending">En attente</option>
                  <option value="converted">Convertis</option>
                  <option value="rejected">Rejetés</option>
                </select>
              </div>

              <Button
                onClick={handleExportCSV}
                icon={Download}
                variant="outline"
              >
                Exporter CSV
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Leads Table */}
        <motion.div variants={itemVariants}>
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('company')}
                    >
                      Entreprise {getSortIcon('company')}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('contact')}
                    >
                      Contact {getSortIcon('contact')}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('department')}
                    >
                      Département {getSortIcon('department')}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('postalCode')}
                    >
                      Code Postal {getSortIcon('postalCode')}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalBudget')}
                    >
                      Budget {getSortIcon('totalBudget')}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      Statut {getSortIcon('status')}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      Date {getSortIcon('createdAt')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => {
                    const score = calculateLeadScore(lead);
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                            <div className="text-sm text-gray-500">{lead.companySize} employés</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.contact}</div>
                            <div className="text-sm text-gray-500">{lead.role}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.department}</div>
                            <div className="text-sm text-gray-500">Code: {lead.postalCode}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.postalCode}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(lead.totalBudget)}/mois
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{score.score}/100</div>
                            <div className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              score.qualification === 'Hot' ? 'bg-red-100 text-red-800' :
                              score.qualification === 'Warm' ? 'bg-orange-100 text-orange-800' :
                              score.qualification === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {score.qualification}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingStatus === lead.id ? (
                            <div className="flex items-center space-x-2">
                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                {statusOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleStatusChange(lead.id, newStatus)}
                                className="text-green-600 hover:text-green-800"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => setEditingStatus(null)}
                                className="text-red-600 hover:text-red-800"
                              >
                                ✗
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                                {getStatusLabel(lead.status)}
                              </span>
                              <button
                                onClick={() => startEditingStatus(lead.id, lead.status)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Lead Details Modal */}
        {showDetails && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 font-heading">Détails du Lead</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Company Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations Entreprise</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Entreprise</label>
                        <p className="text-gray-900">{selectedLead.company}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Taille</label>
                        <p className="text-gray-900">{selectedLead.companySize} employés</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Multi-sites</label>
                        <p className="text-gray-900">{selectedLead.multiSite ? 'Oui' : 'Non'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Budget Total</label>
                        <p className="text-gray-900">{formatCurrency(selectedLead.totalBudget)}/mois</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{selectedLead.contact} - {selectedLead.role}</span>
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

                  {/* Technical Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration Technique</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Système Téléphonique</label>
                        <p className="text-gray-900">{selectedLead.phoneSystem}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Cybersécurité</label>
                        <p className="text-gray-900">{selectedLead.cybersecurity}</p>
                      </div>
                    </div>
                  </div>

                  {/* GDPR Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Conformité RGPD</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-green-600">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">RGPD Conforme</span>
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="sm"
                        icon={LogOut}
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                      >
                        Logout
                      </Button>
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

export default AdminPanel;