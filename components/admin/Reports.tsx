'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, MapPin, Calendar, Filter, Download } from 'lucide-react';
import { exportToExcel } from '@/lib/export';
import { exportToPdf } from '@/lib/pdfExport';
import { Registro } from '@/types/database';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function Reports() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [filteredRegistros, setFilteredRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    departamento: '',
    genero: ''
  });

  useEffect(() => {
    fetchRegistros();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [registros, filters]);

  const fetchRegistros = async () => {
    try {
      const { data, error } = await supabase
        .from('registros')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistros(data || []);
    } catch (error) {
      console.error('Error fetching registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = registros;

    if (filters.departamento) {
      filtered = filtered.filter(reg => reg.departamento === filters.departamento);
    }

    if (filters.genero) {
      filtered = filtered.filter(reg => reg.genero === filters.genero);
    }

    setFilteredRegistros(filtered);
  };

  const getDepartamentos = () => {
    const deptos = [...new Set(registros.map(reg => reg.departamento).filter(Boolean))];
    return deptos.sort();
  };

  const getAgeGroups = () => {
    const groups = {
      '10-17': 0,
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0
    };

    filteredRegistros.forEach(reg => {
      const age = reg.edad || 0;
      if (age <= 17) groups['10-17']++;
      else if (age <= 25) groups['18-25']++;
      else if (age <= 35) groups['26-35']++;
      else if (age <= 45) groups['36-45']++;
      else if (age <= 55) groups['46-55']++;
      else groups['56+']++;
    });

    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  };

  const getGenderData = () => {
    const genderCount = filteredRegistros.reduce((acc, reg) => {
      const gender = reg.genero || 'No especificado';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(genderCount).map(([name, value]) => ({ name, value }));
  };

  const getDepartmentData = () => {
    const deptCount = filteredRegistros.reduce((acc, reg) => {
      const dept = reg.departamento || 'Sin departamento';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deptCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 departments
  };

  const getStatistics = () => {
    const total = filteredRegistros.length;
    const validAgeRegs = filteredRegistros.filter(reg => reg.edad !== null);
    const avgAge = validAgeRegs.length > 0 
      ? Math.round(validAgeRegs.reduce((sum, reg) => sum + (reg.edad || 0), 0) / validAgeRegs.length)
      : 0;
    const today = new Date().toISOString().split('T')[0];
    const todayRegistrations = filteredRegistros.filter(reg => 
      reg.created_at?.split('T')[0] === today
    ).length;

    return { total, avgAge, todayRegistrations };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-500 mt-1">Análisis detallado de los inscritos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToExcel(filteredRegistros, 'Reporte_Filtrado')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
          <button
            onClick={() => exportToPdf(filteredRegistros, 'Reporte_Filtrado')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <select
              value={filters.departamento}
              onChange={(e) => setFilters(prev => ({ ...prev, departamento: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los departamentos</option>
              {getDepartamentos().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
            <select
              value={filters.genero}
              onChange={(e) => setFilters(prev => ({ ...prev, genero: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los géneros</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ departamento: '', genero: '' })}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inscritos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Edad Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgAge} años</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Registros Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayRegistrations}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departamentos</p>
              <p className="text-2xl font-bold text-gray-900">{getDepartamentos().length}</p>
            </div>
            <MapPin className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Edad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getAgeGroups()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getAgeGroups().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Género</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getGenderData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getGenderData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inscritos por Departamento (Top 10)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDepartmentData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights Adicionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Departamento más activo</h4>
            <p className="text-2xl font-bold text-blue-600">
              {getDepartmentData()[0]?.name || 'N/A'}
            </p>
            <p className="text-sm text-blue-700">
              {getDepartmentData()[0]?.value || 0} inscritos
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Rango de edad predominante</h4>
            <p className="text-2xl font-bold text-green-600">
              {getAgeGroups().sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
            </p>
            <p className="text-sm text-green-700">
              {getAgeGroups().sort((a, b) => b.value - a.value)[0]?.value || 0} personas
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Género predominante</h4>
            <p className="text-2xl font-bold text-purple-600">
              {getGenderData().sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
            </p>
            <p className="text-sm text-purple-700">
              {getGenderData().sort((a, b) => b.value - a.value)[0]?.value || 0} personas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
