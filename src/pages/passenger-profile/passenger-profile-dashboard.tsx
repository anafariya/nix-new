import { useState } from 'react';
import {
  User,
  Calendar,
  Globe,
  Plane,
  FileText,
  Settings,
  // Bell,
  // LogOut,
  Edit2,
  Save,
  X,
  Upload,
  Download,
  Eye,
  Lock,
  Shield,
  Star,
  CheckCircle,
  Clock,
  // AlertTriangle,
  Heart,
  Trash2,
  ChevronRight,
  Award,
  TrendingUp,
  History,
} from 'lucide-react';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import { useAuthStore } from '../../../stores/authStore';

const PassengerProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, profile, bookings, documents, preferences, security
  const [isEditing, setIsEditing] = useState(false);
  // const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const user = useAuthStore((state) => state.user);

  // User data
  const [userData, setUserData] = useState({
    title: 'Mr.',
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91 9876543210',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    nationality: 'Indian',
    address: '123 MG Road, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560001',
    passportNumber: 'Z1234567',
    passportExpiry: '2028-03-15',
    passportIssueDate: '2018-03-15',
    passportIssuingCountry: 'India',
    mealPreference: 'Vegetarian',
    seatPreference: 'Window',
    specialAssistance: '',
    frequentFlyer: true,
    profileImage: null,
  });

  const frequentFlyerPrograms = [
    {
      id: 1,
      airline: 'IndiGo',
      airlineCode: '6E',
      memberNumber: 'FF123456789',
      status: 'Gold',
      points: 45000,
    },
    {
      id: 2,
      airline: 'Air India',
      airlineCode: 'AI',
      memberNumber: 'MA987654321',
      status: 'Silver',
      points: 28000,
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      reference: 'BK2511100001',
      route: 'DEL → BOM',
      date: '2025-12-15',
      time: '10:30 AM',
      airline: 'IndiGo',
      status: 'Confirmed',
      pnr: 'ABC123',
    },
    {
      id: 2,
      reference: 'BK2511100002',
      route: 'BOM → GOI',
      date: '2025-12-20',
      time: '02:45 PM',
      airline: 'Air India',
      status: 'Confirmed',
      pnr: 'XYZ789',
    },
  ];

  const pastBookings = [
    {
      id: 3,
      reference: 'BK2509150001',
      route: 'DEL → SVO',
      date: '2025-09-15',
      airline: 'Azerbaijan Airlines',
      status: 'Completed',
    },
    {
      id: 4,
      reference: 'BK2508010001',
      route: 'BLR → DXB',
      date: '2025-08-01',
      airline: 'Emirates',
      status: 'Completed',
    },
    {
      id: 5,
      reference: 'BK2507120001',
      route: 'BOM → LHR',
      date: '2025-07-12',
      airline: 'British Airways',
      status: 'Completed',
    },
  ];

  const documents = [
    {
      id: 1,
      type: 'passport',
      name: 'Passport Copy',
      uploadDate: '2024-03-15',
      expiryDate: '2028-03-15',
      verified: true,
    },
    {
      id: 2,
      type: 'visa',
      name: 'US Visa',
      uploadDate: '2024-06-20',
      expiryDate: '2026-06-20',
      verified: true,
    },
    {
      id: 3,
      type: 'vaccine',
      name: 'COVID-19 Certificate',
      uploadDate: '2024-01-10',
      expiryDate: null,
      verified: true,
    },
  ];

  // const notifications = [
  //   {
  //     id: 1,
  //     type: 'booking',
  //     message: 'Your flight to Mumbai is confirmed',
  //     time: '2 hours ago',
  //     read: false,
  //   },
  //   {
  //     id: 2,
  //     type: 'reminder',
  //     message: 'Passport expiring in 3 years',
  //     time: '1 day ago',
  //     read: false,
  //   },
  //   {
  //     id: 3,
  //     type: 'offer',
  //     message: 'Special discount on international flights',
  //     time: '2 days ago',
  //     read: true,
  //   },
  // ];

  const stats = {
    totalTrips: 15,
    countries: 8,
    miles: 125000,
    savings: 15000,
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back,{' '}
              {user?.FirstName ||
                user?.Name?.split(' ')[0] ||
                userData.firstName}
              ! ✈️
            </h2>
            <p className="text-blue-100 mb-4">Ready for your next adventure?</p>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Book a Flight
            </button>
          </div>
          {userData.frequentFlyer && (
            <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">Frequent Flyer</span>
              </div>
              <p className="text-sm text-blue-100">Gold Status</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Plane className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalTrips}
          </p>
          <p className="text-sm text-slate-600">Total Trips</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.countries}</p>
          <p className="text-sm text-slate-600">Countries Visited</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.miles.toLocaleString()}
          </p>
          <p className="text-sm text-slate-600">Miles Traveled</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ₹{stats.savings.toLocaleString()}
          </p>
          <p className="text-sm text-slate-600">Total Savings</p>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Plane className="w-6 h-6 text-blue-600" />
            Upcoming Trips
          </h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-blue-600 font-semibold">
                        {booking.reference}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="text-lg font-bold text-slate-900">
                        {booking.route}
                      </h4>
                      <span className="text-sm text-slate-600">
                        {booking.airline}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </span>
                      <span className="font-mono">PNR: {booking.pnr}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Plane className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No upcoming trips</p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Book Your Next Trip
            </button>
          </div>
        )}
      </div>

      {/* Frequent Flyer Programs */}
      {frequentFlyerPrograms.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-600" />
            Frequent Flyer Programs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {frequentFlyerPrograms.map((program) => (
              <div
                key={program.id}
                className="border border-slate-200 rounded-lg p-4 bg-gradient-to-br from-slate-50 to-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {program.airlineCode}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {program.airline}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {program.status} Member
                      </p>
                    </div>
                  </div>
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Member Number</span>
                    <span className="font-mono font-medium text-slate-900">
                      {program.memberNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Points Balance</span>
                    <span className="font-bold text-blue-600">
                      {program.points.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ProfileTab = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Personal Information
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2 font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Picture */}
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          {user?.Name?.charAt(0)?.toUpperCase() ||
            user?.FirstName?.charAt(0)?.toUpperCase() ||
            userData.firstName.charAt(0)}
          {user?.Name?.split(' ')?.[1]?.charAt(0)?.toUpperCase() ||
            user?.LastName?.charAt(0)?.toUpperCase() ||
            userData.lastName.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {/* {userData.title}{' '} */}
            {user?.Name?.split(' ')?.[0] ||
              user?.FirstName ||
              userData.firstName}{' '}
            {user?.Name?.split(' ')?.[1] || user?.LastName || userData.lastName}
          </h3>
          <p className="text-slate-600 mb-3">{user?.Email || userData.email}</p>
          {isEditing && (
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Photo
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              {isEditing ? (
                <select
                  value={userData.title}
                  onChange={(e) =>
                    setUserData({ ...userData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                  <option>Dr.</option>
                </select>
              ) : (
                <p className="text-base text-slate-900">{userData.title}</p>
              )}
            </div> */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-base text-slate-900">
                  {user?.FirstName ||
                    user?.Name?.split(' ')?.[0] ||
                    userData.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-base text-slate-900">
                  {user?.LastName ||
                    user?.Name?.split(' ')?.[1] ||
                    userData.lastName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={userData.dateOfBirth}
                  onChange={(e) =>
                    setUserData({ ...userData, dateOfBirth: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-base text-slate-900">
                  {new Date(
                    user?.DateOfBirth || userData.dateOfBirth
                  ).toLocaleDateString()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gender
              </label>
              {isEditing ? (
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              ) : (
                <p className="text-base text-slate-900">
                  {user?.Gender || userData.gender}
                </p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nationality
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.nationality}
                  onChange={(e) =>
                    setUserData({ ...userData, nationality: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-base text-slate-900">
                  {userData.nationality}
                </p>
              )}
            </div> */}
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-base text-slate-900">
                  {user?.Email || userData.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-base text-slate-900">
                  {user?.PhoneNumber || userData.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        {/* <div className="pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Address</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Street Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-base text-slate-900">{userData.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.city}
                    onChange={(e) =>
                      setUserData({ ...userData, city: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-base text-slate-900">{userData.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.state}
                    onChange={(e) =>
                      setUserData({ ...userData, state: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-base text-slate-900">{userData.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.country}
                    onChange={(e) =>
                      setUserData({ ...userData, country: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-base text-slate-900">{userData.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Postal Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.postalCode}
                    onChange={(e) =>
                      setUserData({ ...userData, postalCode: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-base text-slate-900">
                    {userData.postalCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div> */}

        {/* Passport Information */}
        {/* <div className="pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Passport Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Passport Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.passportNumber}
                  onChange={(e) =>
                    setUserData({ ...userData, passportNumber: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                />
              ) : (
                <p className="text-base text-slate-900 font-mono">
                  {userData.passportNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Issuing Country
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.passportIssuingCountry}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      passportIssuingCountry: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-base text-slate-900">
                  {userData.passportIssuingCountry}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Issue Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={userData.passportIssueDate}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      passportIssueDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-base text-slate-900">
                  {new Date(userData.passportIssueDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expiry Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={userData.passportExpiry}
                  onChange={(e) =>
                    setUserData({ ...userData, passportExpiry: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-base text-slate-900">
                    {new Date(userData.passportExpiry).toLocaleDateString()}
                  </p>
                  {new Date(userData.passportExpiry).getTime() - Date.now() <
                    180 * 24 * 60 * 60 * 1000 && (
                    <AlertTriangle
                      className="w-5 h-5 text-amber-600"
                      aria-details="Expiring soon"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );

  const BookingsTab = () => (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Upcoming Trips
        </h3>
        {upcomingBookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-slate-200 rounded-lg p-6 mb-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-blue-600 font-bold">
                    {booking.reference}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {booking.status}
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">
                  {booking.route}
                </h4>
                <p className="text-slate-600">{booking.airline}</p>
              </div>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                View Details
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-600 mb-1">Date</p>
                <p className="font-semibold text-slate-900">{booking.date}</p>
              </div>
              <div>
                <p className="text-slate-600 mb-1">Time</p>
                <p className="font-semibold text-slate-900">{booking.time}</p>
              </div>
              <div>
                <p className="text-slate-600 mb-1">PNR</p>
                <p className="font-semibold text-slate-900 font-mono">
                  {booking.pnr}
                </p>
              </div>
              <div>
                <p className="text-slate-600 mb-1">Actions</p>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Download
                  </button>
                  <button className="text-slate-600 hover:text-slate-700 text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Past Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Past Trips</h3>
        <div className="space-y-3">
          {pastBookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <History className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {booking.route}
                  </p>
                  <p className="text-sm text-slate-600">
                    {booking.date} • {booking.airline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  {booking.status}
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">My Documents</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{doc.name}</h4>
                  <p className="text-sm text-slate-600 capitalize">
                    {doc.type}
                  </p>
                </div>
              </div>
              {doc.verified && (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Uploaded</span>
                <span className="text-slate-900">{doc.uploadDate}</span>
              </div>
              {doc.expiryDate && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Expires</span>
                  <span className="text-slate-900">{doc.expiryDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Status</span>
                <span
                  className={`font-semibold ${doc.verified ? 'text-green-600' : 'text-orange-600'}`}
                >
                  {doc.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
              <button className="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                View
              </button>
              <button className="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        Travel Preferences
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Flight Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Meal Preference
              </label>
              <select
                value={userData.mealPreference}
                onChange={(e) =>
                  setUserData({ ...userData, mealPreference: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Vegan</option>
                <option>Kosher</option>
                <option>Halal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Seat Preference
              </label>
              <select
                value={userData.seatPreference}
                onChange={(e) =>
                  setUserData({ ...userData, seatPreference: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Window</option>
                <option>Aisle</option>
                <option>Middle</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Special Assistance
              </label>
              <textarea
                value={userData.specialAssistance}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    specialAssistance: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Any special requirements..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <p className="font-medium text-slate-900">
                  Booking Confirmations
                </p>
                <p className="text-sm text-slate-600">
                  Receive email confirmations for bookings
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <p className="font-medium text-slate-900">Flight Reminders</p>
                <p className="text-sm text-slate-600">
                  Get reminders before your flights
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <p className="font-medium text-slate-900">Promotional Offers</p>
                <p className="text-sm text-slate-600">
                  Receive special deals and discounts
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <p className="font-medium text-slate-900">SMS Notifications</p>
                <p className="text-sm text-slate-600">
                  Receive SMS for important updates
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          Security Settings
        </h2>

        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">Password</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Last changed 3 months ago
                </p>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Change Password
                </button>
              </div>
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Add an extra layer of security
                </p>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium">
                  Enable 2FA
                </button>
              </div>
              <Shield className="w-8 h-8 text-slate-400" />
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Active Sessions
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Manage your logged-in devices
                </p>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium">
                  View Sessions
                </button>
              </div>
              <Globe className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-slate-600 mb-6">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
          Delete Account
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">TravelHub</h1>
                <p className="text-xs text-slate-500">My Account</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Bell className="w-6 h-6" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {userData.firstName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {userData.firstName} {userData.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{userData.email}</p>
                </div>
              </div>

              <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Navbar */}

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'profile', label: 'My Profile', icon: User },
                  { id: 'bookings', label: 'My Bookings', icon: Plane },
                  { id: 'documents', label: 'Documents', icon: FileText },
                  { id: 'preferences', label: 'Preferences', icon: Settings },
                  { id: 'security', label: 'Security', icon: Shield },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'bookings' && <BookingsTab />}
            {activeTab === 'documents' && <DocumentsTab />}
            {activeTab === 'preferences' && <PreferencesTab />}
            {activeTab === 'security' && <SecurityTab />}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}

      <Footer />
    </div>
  );
};

export default PassengerProfileDashboard;
