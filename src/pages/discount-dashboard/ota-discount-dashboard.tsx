import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Percent,
  Tag,
  TrendingUp,
  Plane,
  MapPin,
  X,
} from 'lucide-react';

export default function DiscountDashboard() {
  const [activeTab, setActiveTab] = useState('active');
  const [showModal, setShowModal] = useState(false);
  // const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discountType, setDiscountType] = useState('general');

  const stats = [
    {
      label: 'Active Discounts',
      value: '24',
      change: '+12%',
      icon: Tag,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Redemptions',
      value: '1,847',
      change: '+23%',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Revenue Impact',
      value: '$45.2K',
      change: '+8%',
      icon: Percent,
      color: 'bg-purple-500',
    },
    {
      label: 'Expiring Soon',
      value: '7',
      change: '-3',
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  const airlines = [
    'All Airlines',
    'Emirates',
    'Qatar Airways',
    'Singapore Airlines',
    'Lufthansa',
    'British Airways',
    'American Airlines',
  ];

  const discounts = [
    {
      id: 1,
      code: 'EMIRATES25',
      type: 'Percentage',
      value: '25%',
      status: 'active',
      usage: '234/500',
      expiry: '2025-12-31',
      specificType: 'airline',
      airline: 'Emirates',
      route: null,
      travelDates: null,
    },
    {
      id: 2,
      code: 'NYC-LON50',
      type: 'Fixed Amount',
      value: '$50',
      status: 'active',
      usage: '89/200',
      expiry: '2025-11-15',
      specificType: 'route',
      airline: null,
      route: 'JFK → LHR',
      travelDates: null,
    },
    {
      id: 3,
      code: 'XMAS2024',
      type: 'Percentage',
      value: '15%',
      status: 'active',
      usage: '456/1000',
      expiry: '2025-12-31',
      specificType: 'travelDate',
      airline: null,
      route: null,
      travelDates: 'Dec 20-26, 2024',
    },
    {
      id: 4,
      code: 'QATAR-DXB30',
      type: 'Fixed Amount',
      value: '$30',
      status: 'active',
      usage: '167/500',
      expiry: '2025-11-30',
      specificType: 'airline-route',
      airline: 'Qatar Airways',
      route: 'DOH → DXB',
      travelDates: null,
    },
    {
      id: 5,
      code: 'SUMMER-LAX',
      type: 'Percentage',
      value: '20%',
      status: 'scheduled',
      usage: '0/300',
      expiry: '2025-08-31',
      specificType: 'route-date',
      airline: null,
      route: 'Any → LAX',
      travelDates: 'Jun 1 - Aug 31, 2025',
    },
    {
      id: 6,
      code: 'SINGAPORE-NYC',
      type: 'Percentage',
      value: '18%',
      status: 'active',
      usage: '78/200',
      expiry: '2025-12-15',
      specificType: 'airline-route-date',
      airline: 'Singapore Airlines',
      route: 'SIN → JFK',
      travelDates: 'Nov 15 - Dec 15, 2025',
    },
  ];

  const filteredDiscounts = discounts.filter((d) => {
    if (activeTab === 'active') return d.status === 'active';
    if (activeTab === 'scheduled') return d.status === 'scheduled';
    if (activeTab === 'expired') return d.status === 'expired';
    return true;
  });

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpecificityBadge = (discount: any) => {
    const badges = [];
    if (discount.airline)
      badges.push({
        label: discount.airline,
        icon: Plane,
        color: 'bg-blue-50 text-blue-700',
      });
    if (discount.route)
      badges.push({
        label: discount.route,
        icon: MapPin,
        color: 'bg-purple-50 text-purple-700',
      });
    if (discount.travelDates)
      badges.push({
        label: discount.travelDates,
        icon: Calendar,
        color: 'bg-orange-50 text-orange-700',
      });
    return badges;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Flight Discount Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage airline, route, and travel date specific discounts
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create Discount
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <span
                  className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {['all', 'active', 'scheduled', 'expired'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search discounts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={20} />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Discounts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specificity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDiscounts.map((discount) => (
                  <tr
                    key={discount.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {discount.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {getSpecificityBadge(discount).map((badge, idx) => (
                          <span
                            key={idx}
                            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${badge.color}`}
                          >
                            <badge.icon size={12} />
                            {badge.label}
                          </span>
                        ))}
                        {getSpecificityBadge(discount).length === 0 && (
                          <span className="text-xs text-gray-500 italic">
                            General
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {discount.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-blue-600">
                        {discount.value}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${(parseInt(discount.usage.split('/')[0]) / parseInt(discount.usage.split('/')[1])) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {discount.usage}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {discount.expiry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(discount.status)}`}
                      >
                        {discount.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="View"
                        >
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Discount Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Flight Discount
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., EMIRATES25"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Percentage</option>
                      <option>Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid From
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Specificity Options */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Specificity Settings
                </h3>
                <p className="text-sm text-gray-600">
                  Configure airline, route, and travel date restrictions for
                  this discount
                </p>

                {/* Airline Specific */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="airline-specific"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        setDiscountType(
                          e.target.checked ? 'airline' : 'general'
                        )
                      }
                    />
                    <label
                      htmlFor="airline-specific"
                      className="flex items-center gap-2 font-medium text-gray-900"
                    >
                      <Plane size={18} className="text-blue-600" />
                      Airline Specific
                    </label>
                  </div>
                  {discountType !== 'general' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Airlines (Multiple)
                      </label>
                      <select
                        multiple
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      >
                        {airlines
                          .filter((a) => a !== 'All Airlines')
                          .map((airline) => (
                            <option key={airline} value={airline}>
                              {airline}
                            </option>
                          ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Hold Ctrl/Cmd to select multiple airlines
                      </p>
                    </div>
                  )}
                </div>

                {/* Route Specific */}
                <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="route-specific"
                      className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <label
                      htmlFor="route-specific"
                      className="flex items-center gap-2 font-medium text-gray-900"
                    >
                      <MapPin size={18} className="text-purple-600" />
                      Route Specific
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Origin Airport
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., JFK, LAX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination Airport
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., LHR, DXB"
                      />
                    </div>
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    + Add Another Route
                  </button>
                </div>

                {/* Travel Date Specific */}
                <div className="bg-orange-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="date-specific"
                      className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                    />
                    <label
                      htmlFor="date-specific"
                      className="flex items-center gap-2 font-medium text-gray-900"
                    >
                      <Calendar size={18} className="text-orange-600" />
                      Travel Date Specific
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Travel Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Travel End Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <label className="text-sm font-medium text-gray-700">
                      Applicable Days:
                    </label>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                      (day) => (
                        <label key={day} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                          <span className="text-sm text-gray-700">{day}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
