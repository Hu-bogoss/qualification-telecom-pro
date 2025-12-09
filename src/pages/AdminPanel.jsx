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

      if (direction === 'a
