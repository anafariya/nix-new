import { useState } from 'react';
import {
  Search,
  Calendar,
  User,
  Plane,
  FileText,
  Clock,
  XCircle,
  RefreshCw,
  DollarSign,
  Menu,
  ChevronDown,
  Edit2,
  Download,
  Eye,
  Plus,
  Filter,
  MoreVertical,
  Trash2,
  Copy,
  Send,
  Phone,
  Mail,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  FileSpreadsheet,
  Printer,
  Share2,
  AlertCircle,
  CheckCircle,
  Archive,
  X,
} from 'lucide-react';

const AirTicketManagement = () => {
  const [activeTab, setActiveTab] = useState('issued');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState('NT25B2C0001');

  const tabs = [
    { id: 'issued', label: 'Issued Tickets', icon: FileText, count: 45 },
    { id: 'pending', label: 'Pending Tickets', icon: Clock, count: 12 },
    { id: 'failed', label: 'Failed Bookings', icon: XCircle, count: 3 },
    {
      id: 'reschedule',
      label: 'Reschedule Requests',
      icon: RefreshCw,
      count: 7,
    },
    { id: 'refund', label: 'Refund Requests', icon: DollarSign, count: 5 },
    { id: 'master', label: 'Master Booking', icon: Menu, count: 100 },
  ];

  const notifications = [
    {
      id: 1,
      type: 'success',
      message: 'Booking NT25B2C0001 confirmed',
      time: '5 min ago',
    },
    {
      id: 2,
      type: 'warning',
      message: 'Payment pending for KN2182',
      time: '15 min ago',
    },
    {
      id: 3,
      type: 'error',
      message: 'Booking failed for XY9876',
      time: '1 hour ago',
    },
  ];

  const bookings = [
    {
      ref: 'NT25B2C0001',
      date: '08-Nov-2025',
      client: 'Physics Wala',
      sector: 'DEL-SVO',
      source: 'Travelport',
      pnr: 'ABC1234',
      ticket: '123-1111111000',
      status: 'confirmed',
    },
    {
      ref: 'KN2182',
      date: '08-Nov-2025',
      client: 'Tech Corp',
      sector: 'BOM-LHR',
      source: 'Amadeus',
      pnr: 'XYZ5678',
      ticket: '123-2222222000',
      status: 'confirmed',
    },
    {
      ref: 'AB3456',
      date: '07-Nov-2025',
      client: 'Global Ltd',
      sector: 'DEL-DXB',
      source: 'Sabre',
      pnr: 'PQR9012',
      ticket: '123-3333333000',
      status: 'confirmed',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Air Ticket Management
                </h1>
                <p className="text-sm text-slate-500">
                  Comprehensive booking management system
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Settings className="w-5 h-5" />
              </button>
              <div className="h-8 w-px bg-slate-300"></div>
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium">
                <Plus className="w-5 h-5" />
                New Booking
              </button>
              <button className="p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-6 top-20 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        notif.type === 'success'
                          ? 'bg-green-100 text-green-600'
                          : notif.type === 'warning'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {notif.type === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : notif.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-200">
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Notifications
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Today's Bookings</p>
                <p className="text-3xl font-bold text-slate-900">24</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <span>↑ 12%</span> vs yesterday
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pending Actions</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
                <p className="text-xs text-amber-600 mt-2">Needs attention</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Revenue Today</p>
                <p className="text-3xl font-bold text-slate-900">₹1.2L</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <span>↑ 8%</span> vs yesterday
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Failed Bookings</p>
                <p className="text-3xl font-bold text-slate-900">3</p>
                <p className="text-xs text-red-600 mt-2">Requires review</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Search Bookings
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  showFilters
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                Advanced Search
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Booking Reference
              </label>
              <input
                type="text"
                placeholder="e.g., KN2182"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                defaultValue="KN2182"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Client Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search client..."
                  className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sector
              </label>
              <input
                type="text"
                placeholder="e.g., DEL-SVO"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trip Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Source
                </label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all">
                  <option>All Sources</option>
                  <option>Travelport</option>
                  <option>Amadeus</option>
                  <option>Sabre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all">
                  <option>All Status</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Failed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Status
                </label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all">
                  <option>All Payments</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Failed</option>
                  <option>Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount Range
                </label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all">
                  <option>All Amounts</option>
                  <option>₹0 - ₹10,000</option>
                  <option>₹10,000 - ₹50,000</option>
                  <option>₹50,000+</option>
                </select>
              </div>
            </div>
          )}

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Air PNR
                </label>
                <input
                  type="text"
                  placeholder="PNR Number"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ticket Number
                </label>
                <input
                  type="text"
                  placeholder="Ticket No."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Traveler Name
                </label>
                <input
                  type="text"
                  placeholder="Traveler name"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Passport No
                </label>
                <input
                  type="text"
                  placeholder="Passport number"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              Select Current Date
            </label>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium">
                Reset
              </button>
              <button className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-fit px-6 py-4 flex items-center justify-center gap-2 font-medium transition-all border-b-2 relative ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">Select All</span>
              <div className="h-4 w-px bg-slate-300 mx-2"></div>
              <button className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1">
                <Download className="w-4 h-4" />
                Export Selected
              </button>
              <button className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1">
                <Send className="w-4 h-4" />
                Send Email
              </button>
              <button className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1">
                <Archive className="w-4 h-4" />
                Archive
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </button>
              <button className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Booking Ref
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    PNR
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Ticket No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.map((booking) => (
                  <tr
                    key={booking.ref}
                    onClick={() => setSelectedBooking(booking.ref)}
                    className={`hover:bg-blue-50 transition-colors cursor-pointer ${
                      selectedBooking === booking.ref ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600">
                        {booking.ref}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {booking.client.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">
                          {booking.client}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-sm">
                        {booking.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">
                        {booking.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-900 bg-slate-100 px-2 py-1 rounded">
                        {booking.pnr}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-900">
                        {activeTab === 'issued' ? (
                          booking.ticket
                        ) : activeTab === 'pending' ? (
                          <span className="text-amber-600 font-semibold">
                            Pending
                          </span>
                        ) : activeTab === 'failed' ? (
                          <span className="text-red-600 font-semibold">
                            Failed
                          </span>
                        ) : (
                          booking.ticket
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-10">
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <Send className="w-4 h-4" />
                              Email Client
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <Share2 className="w-4 h-4" />
                              Share
                            </button>
                            <div className="border-t border-slate-200 my-1"></div>
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">3</span> of{' '}
                <span className="font-medium">172</span> results
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all text-sm">
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium text-sm">
                  1
                </button>
                <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all text-sm">
                  2
                </button>
                <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all text-sm">
                  3
                </button>
                <span className="px-2 text-slate-500">...</span>
                <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all text-sm">
                  10
                </button>
                <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all text-sm">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Detailed View */}
          <div className="border-t border-slate-200 p-6 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Booking Details: {selectedBooking}
                </h3>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Confirmed
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  E-Ticket (Price)
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  E-Ticket (No Price)
                </button>
              </div>
            </div>

            {/* Customer Profile Card */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    PW
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      Physics Wala
                    </h4>
                    <p className="text-sm text-slate-600">Client ID: CL00145</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        physics@example.com
                      </span>
                      <span className="flex items-center gap-1 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        +91 98765 43210
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-2">
                  <User className="w-4 h-4" />
                  View Full Profile
                </button>
              </div>
            </div>

            {/* Flight Segment */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  Flight Segment
                </h4>
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                  <Edit2 className="w-4 h-4" />
                  Modify Segment
                </button>
              </div>
              <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-blue-200">
                    <Plane className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">
                      Azerbaijan Airlines • J2
                    </p>
                    <div className="flex items-center gap-6 mt-3">
                      <div>
                        <p className="text-3xl font-bold text-slate-900">
                          04:25
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          DEL Terminal 3
                        </p>
                      </div>
                      <div className="flex-1 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-0.5 bg-slate-300"></div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500 font-medium">
                              19H 30M
                            </p>
                            <p className="text-xs text-amber-600 font-semibold mt-1">
                              1 Stop
                            </p>
                          </div>
                          <div className="flex-1 h-0.5 bg-slate-300"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-slate-900">
                          23:55
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          VKO Terminal A
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Passenger Details
                </h4>
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                  <Plus className="w-4 h-4" />
                  Add Passenger
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        First Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        Last Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        DOB
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        Passport No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        Ticket No
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-900">01</td>
                      <td className="px-4 py-3 text-slate-900">Mr.</td>
                      <td className="px-4 py-3 text-slate-900 font-medium">
                        Amit
                      </td>
                      <td className="px-4 py-3 text-slate-900 font-medium">
                        Kumar
                      </td>
                      <td className="px-4 py-3 text-slate-600">21-03-1955</td>
                      <td className="font-mono text-sm text-slate-900 bg-slate-100 rounded py-1 inline-block">
                        Z12345
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-slate-900">
                        123-111111000
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fare Breakdown & Payment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Fare Breakdown
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      label: 'Base Fare',
                      purchase: '₹40,000',
                      sale: '₹40,000',
                    },
                    { label: 'Taxes', purchase: '₹4,000', sale: '₹4,000' },
                    { label: 'Extra Baggage', purchase: '₹200', sale: '₹200' },
                    { label: 'Seat Charges', purchase: '₹200', sale: '₹200' },
                    { label: 'Service Charge', purchase: '-', sale: '₹200' },
                    { label: 'Markup', purchase: '-', sale: '₹20' },
                    { label: 'Discount', purchase: '-', sale: '-₹100' },
                    { label: 'Payment Gateway', purchase: '₹5', sale: '₹5' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm py-2.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 -mx-2 rounded transition-all"
                    >
                      <span className="text-slate-600">{item.label}</span>
                      <div className="flex gap-12">
                        <span className="text-slate-900 w-24 text-right">
                          {item.purchase}
                        </span>
                        <span className="text-slate-900 w-24 text-right font-medium">
                          {item.sale}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between text-lg font-bold pt-4 border-t-2 border-slate-300 px-2 -mx-2">
                    <span className="text-slate-900">Total Amount</span>
                    <span className="text-blue-600">₹45,200</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Razorpay Order ID
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Order ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Razorpay Payment ID
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Payment ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Payment Status
                    </label>
                    <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option>Completed</option>
                      <option>Pending</option>
                      <option>Failed</option>
                      <option>Refunded</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h5 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Additional Payment
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Mode
                        </label>
                        <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg">
                          <option>Cash</option>
                          <option>Card</option>
                          <option>UPI</option>
                          <option>Bank Transfer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Amount
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                          placeholder="₹0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Reference
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                          placeholder="Ref No"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Activity Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Notes
                </h4>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Add any additional notes or comments..."
                ></textarea>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium">
                  Save Note
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Activity Log
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded transition-all">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-slate-900 font-medium">
                        Booking Confirmed
                      </p>
                      <p className="text-xs text-slate-500">
                        08 Nov 2025, 10:30 AM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded transition-all">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-slate-900 font-medium">
                        Payment Received
                      </p>
                      <p className="text-xs text-slate-500">
                        08 Nov 2025, 10:25 AM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded transition-all">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-slate-900 font-medium">
                        Booking Created
                      </p>
                      <p className="text-xs text-slate-500">
                        08 Nov 2025, 10:15 AM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirTicketManagement;
