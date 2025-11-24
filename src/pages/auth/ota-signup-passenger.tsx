import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  CreditCard,
  Globe,
  Calendar,
  Users,
  Edit2,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  Save,
  X,
  Plane,
  UserPlus,
  Shield,
  Star,
  Clock,
  MessageCircle,
  LoaderIcon,
} from 'lucide-react';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import axios from 'axios';
import { useAuthStore } from '../../../stores/authStore';
import { useGoogleLogin } from '../../components/useGoogleLogin';
import logo from '../../assets/Favicon.png';

const OTASystem = () => {
  const [currentPage, setCurrentPage] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState('Individual');
  const [showAddPassenger, setShowAddPassenger] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1: details, 2: OTP verification
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [data, setData] = useState({
    FirstName: '',
    LastName: '',
    DateOfBirth: '',
    Password: '',
    Email: '',
    CompanyName: '',
    GSTNumber: '',
  });
  const [loading, setloading] = useState(false);
  const [mailornumber, setMailOrNumber] = useState('');
  const [DialCode, setDialCode] = useState('+91');
  const [signinStep, setSigninStep] = useState(1); // 1: details, 2: OTP verification
  const [usingPassword, setUsingPassword] = useState(false);

  const setUser = useAuthStore((state: any) => state.setUser);
  const type =
    new URLSearchParams(window.location.search)?.get('type') || 'signin';

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (['signup', 'signin'].includes(type)) setCurrentPage(type);
  }, []);

  const passengers = [
    {
      id: 1,
      title: 'Mr.',
      firstName: 'Amit',
      lastName: 'Kumar',
      dob: '1985-03-15',
      passport: 'Z1234567',
      nationality: 'Indian',
      gender: 'Male',
      phone: '+91 9876543210',
      email: 'amit.k@email.com',
      frequent: true,
      status: 'verified',
    },
    {
      id: 2,
      title: 'Mrs.',
      firstName: 'Priya',
      lastName: 'Sharma',
      dob: '1990-07-22',
      passport: 'A9876543',
      nationality: 'Indian',
      gender: 'Female',
      phone: '+91 9876543211',
      email: 'priya.s@email.com',
      frequent: false,
      status: 'verified',
    },
    {
      id: 3,
      title: 'Ms.',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dob: '1988-11-10',
      passport: 'B5432109',
      nationality: 'American',
      gender: 'Female',
      phone: '+1 555-0123',
      email: 'sarah.j@email.com',
      frequent: true,
      status: 'pending',
    },
    {
      id: 4,
      title: 'Mr.',
      firstName: 'Raj',
      lastName: 'Patel',
      dob: '1995-05-18',
      passport: 'C8765432',
      nationality: 'Indian',
      gender: 'Male',
      phone: '+91 9876543212',
      email: 'raj.p@email.com',
      frequent: false,
      status: 'verified',
    },
  ];

  const { login } = useGoogleLogin({
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    serverUrl: '',

    onSuccess: (data) => {
      console.log('Login success:', data);
      // store in Zustand or redirect
      if (data?.Success) setUser(data?.User);
    },

    onError: (err) => {
      alert(err?.response?.data?.Message);
      console.error('Google login error:', err);
    },
  });

  const handleOtpChange = (index: any, value: any) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: any, e: any) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOTP = async (e: any) => {
    e.preventDefault();

    console.log('handleSendOTP called');

    if (!acceptedTerms) {
      alert('Please accept the terms and conditions.');
      console.log('Terms and conditions not accepted');
      return;
    }
    if (!phoneNumber) {
      alert('Please enter a phone number.');
      console.log('Phone number not entered');
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber) || phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      console.log('Invalid phone number');
      return;
    }
    if (!data.FirstName) {
      alert('Please enter your first name.');
      console.log('First name not entered');
      return;
    }
    if (data.FirstName.length < 3) {
      alert('Please enter valid first name.');
      console.log('First name is invalid');
      return;
    }
    if (!data.LastName) {
      alert('Please enter your last name.');
      console.log('Last name not entered');
      return;
    }
    if (data.LastName.length < 3) {
      alert('Please enter valid last name.');
      console.log('Last name is invalid');
      return;
    }
    if (!data.Email) {
      alert('Please enter your email.');
      console.log('Email not entered');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
      alert('Please enter a valid email address.');
      console.log('Email is invalid');
      return;
    }
    if (!data.Password) {
      alert('Please enter a password.');
      console.log('Password not entered');
      return;
    }
    if (data.Password.length < 8) {
      alert('Password must be at least 8 characters long.');
      console.log('Password is invalid');
      return;
    }
    if (!data.DateOfBirth) {
      alert('Please enter your date of birth.');
      console.log('Date of birth not entered');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.DateOfBirth)) {
      alert('Please enter a valid date of birth (YYYY-MM-DD).');
      console.log('Date of birth is invalid');
      return;
    }

    if (accountType === 'Company' || accountType != 'Individual') {
      if (!data.GSTNumber) {
        alert('Please enter GST number.');
        console.log('GST number not entered');
        return;
      }
      if (data.GSTNumber.length < 15) {
        alert('Please enter valid GST number.');
        console.log('GST number is invalid');
        return;
      }
      if (!data.CompanyName) {
        alert('Please enter your Company Name.');
        console.log('Company Name not entered');
        return;
      }
      if (data.CompanyName.length < 3) {
        alert('Please enter valid Company Name.');
        console.log('Company Name is invalid');
        return;
      }
    }
    // Simulate sending OTP via WATI
    console.log('Sending OTP request to API', {
      ...data,
      PhoneNumber: phoneNumber,
    });

    setloading(true);
    try {
      const response = await axios.post(
        'https://api.nixtour.com/api/Auth/register',
        { ...data, PhoneNumber: phoneNumber },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('OTP sent successfully', response);
      console.log(response.data?.Message);
      setloading(false);
      setSignupStep(2);
    } catch (error: any) {
      setloading(false);
      alert(error?.response?.data?.Message);
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOTP = async (e: any) => {
    e.preventDefault();
    // console.log('Verifying OTP:', otp.join(''));

    if (currentPage === 'signin' && mailornumber) {
      setPhoneNumber(mailornumber);
    }

    setloading(true);
    try {
      // Simulate OTP verification
      const response = await axios.post(
        'https://api.nixtour.com/api/Auth/verify-otp',
        { PhoneNumber: phoneNumber, OTPCode: otp.join('') },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert(response.data?.Message);
      if (response.data.Success) {
        setUser(response.data.User);
        localStorage.setItem('AccessToken', response.data.AccessToken);
        localStorage.setItem('RefreshToken', response.data.RefreshToken);
        setSignupStep(3);
        setData({
          FirstName: '',
          LastName: '',
          DateOfBirth: '',
          Password: '',
          Email: '',
          CompanyName: '',
          GSTNumber: '',
        });
        setPhoneNumber('');
        setMailOrNumber('');
        setDialCode('+91');
        setOtp(['', '', '', '', '', '']);
      }

      setloading(false);
      console.log(response.data?.Message);

      window.location.href = '/';

      console.log('Verify OTP response:', response);
      // Success - redirect or show success message
    } catch (error: any) {
      setloading(false);
      alert(error?.response?.data?.Message);

      console.error('Error verifying OTP:', error);
    }
  };

  const handleResendOTP = async () => {
    console.log('handleResendOTP called');
    if (currentPage === 'signin' && mailornumber) {
      setPhoneNumber(mailornumber);
      setSigninStep(2);
    }
    setIsResendingOTP(true);
    setTimeout(() => {
      console.log('setTimeout called');
      setIsResendingOTP(false);
      setOtp(['', '', '', '', '', '']);
    }, 2000);
    // Simulate OTP resend
    try {
      const response = await axios.post(
        'https://api.nixtour.com/api/Auth/send-otp',
        {
          PhoneNumber: phoneNumber || mailornumber,
          Purpose: mailornumber ? 'login' : 'registration',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setMailOrNumber('');
      setDialCode('+91');
      alert(response.data?.Message);
      console.log('handleResendOTP response:', response);
    } catch (error: any) {
      alert(error?.response?.data?.Message);

      console.error('Error handling resend OTP:', error);
    }
  };

  const handleLogin = async () => {
    console.log('handleLogin called');
    // Simulate login
    if (!data.Email && !mailornumber) {
      alert('Please enter email.');
      console.error('handleLogin: Email is empty');
    }
    if (
      data.Email
        ? data.Email.length < 3 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)
        : mailornumber.length < 3 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailornumber)
    ) {
      alert('Please enter valid email.');
      console.error('handleLogin: Email is invalid');
    }
    if (!data.Password) {
      alert('Please enter password.');
      console.error('handleLogin: Password is empty');
    }
    if (data.Password.length < 8) {
      alert('Please enter valid password.');
      console.error('handleLogin: Password is invalid');
    }

    setloading(true);
    console.log('handleLogin: Data', data);
    await axios
      .post(
        'https://api.nixtour.com/api/Auth/login',
        {
          Email: data.Email || mailornumber,
          Password: data.Password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        if (response.data?.Success) {
          setUser(response.data.User);
          localStorage.setItem('AccessToken', response.data.AccessToken);
          localStorage.setItem('RefreshToken', response.data.RefreshToken);
          setData({
            FirstName: '',
            LastName: '',
            DateOfBirth: '',
            Password: '',
            Email: '',
            CompanyName: '',
            GSTNumber: '',
          });
          setMailOrNumber('');
          setDialCode('+91');
          setPhoneNumber('');

          console.log(response.data?.Message);

          setloading(false);

          window.location.href = '/';
        }
        console.log('handleLogin: Login response', response);
      })
      .catch((error) => {
        setloading(false);
        console.error('handleLogin: Error logging in', error);
        alert(error?.response?.data?.Message);
      });
  };

  const SigninPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-6 pt-10">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-10 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  {logo ? (
                    <img src={logo} alt="nixtour_logo" className="w-8" />
                  ) : (
                    <Plane className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Nixtour</h1>
                  <p className="text-blue-100 text-sm">Welcome Back!</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">Sign in to continue</h2>
              <p className="text-blue-100 mb-6">
                Access your bookings and manage your travel plans
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: Globe,
                    title: 'Your Bookings',
                    desc: 'Access all your travel plans',
                  },
                  {
                    icon: Users,
                    title: 'Saved Travelers',
                    desc: 'Quick booking for family',
                  },
                  {
                    icon: Star,
                    title: 'Exclusive Deals',
                    desc: 'Member-only offers',
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg flex-shrink-0">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-blue-100 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Trusted by</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xl font-bold">50,000+ Travelers</p>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          {signinStep === 1 ? (
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Welcome Back
                </h2>
                <p className="text-slate-600 text-sm">
                  Sign in to your account
                </p>
              </div>

              {/* Social Sign In */}
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 font-medium text-slate-700 hover:border-slate-400"
                  onClick={login} // 👈 this triggers Google login
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 font-medium text-slate-700 hover:border-slate-400"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">
                    Or sign in with email
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {currentPage === 'signin' &&
                !/[^0-9]/.test(mailornumber) &&
                mailornumber ? (
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                      htmlFor="mailornumber"
                    >
                      Phone Number
                    </label>
                    <div className="relative flex">
                      <select
                        name="DialCode"
                        id="DialCode"
                        onChange={(e) => setDialCode(e.target.value)}
                        value={DialCode}
                        className="px-3 py-2.5 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+61">+61</option>
                        <option value="+81">+81</option>
                        <option value="+86">+86</option>
                        {/* Add more country codes as needed */}
                      </select>
                      <div className="relative flex-1">
                        <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          name="Phone"
                          id="mailornumber"
                          autoFocus
                          onChange={(e) => setMailOrNumber(e.target.value)}
                          value={mailornumber}
                          placeholder="1234567890"
                          className="w-full px-4 py-2.5 pl-10 border border-slate-300 border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                      htmlFor="mailornumber"
                    >
                      Email Address or Mobile No
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="Email"
                        id="mailornumber"
                        autoFocus
                        onChange={(e) => setMailOrNumber(e.target.value)}
                        value={mailornumber}
                        placeholder="john@example.com or +91 1234567890"
                        className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className="block text-sm font-medium text-slate-700"
                    htmlFor="Password"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="Password"
                    id="Password"
                    onChange={handleInputChange}
                    value={data.Password}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 pl-10 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm text-slate-600">
                  Remember me for 30 days
                </label>
              </div> */}

                <button
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                  onClick={handleResendOTP}
                >
                  {loading && <LoaderIcon className="w-5 h-5 mr-2" />} Sign In
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setCurrentPage('signup')}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {usingPassword ? (
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          className="block text-sm font-medium text-slate-700"
                          htmlFor="Password"
                        >
                          Password
                        </label>
                        <a
                          href="#"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Forgot Password?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="Password"
                          id="Password"
                          onChange={handleInputChange}
                          value={data.Password}
                          placeholder="Enter your password"
                          className="w-full px-4 py-2.5 pl-10 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Verify Button */}
                    <button
                      onClick={handleLogin}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      {loading && <LoaderIcon className="w-5 h-5 mr-2" />}
                      <CheckCircle className="w-5 h-5" />
                      Continue
                    </button>

                    {/* Back Button */}
                    <button
                      onClick={() => setUsingPassword(!usingPassword)}
                      className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
                    >
                      Continue with OTP
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Verify WhatsApp OTP
                      </h2>
                      <p className="text-slate-600 text-sm">
                        We've sent a 6-digit code to
                        <br />
                        <span className="font-semibold text-slate-900">
                          {phoneNumber || '+91 98765 43210'}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* OTP Input */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                          Enter OTP
                        </label>
                        <div className="flex justify-center gap-2">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleOtpChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className="w-12 h-12 text-center text-xl font-bold border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Resend OTP */}
                      <div className="text-center">
                        <p className="text-sm text-slate-600 mb-2">
                          Didn't receive the code?
                        </p>
                        <button
                          onClick={handleResendOTP}
                          disabled={isResendingOTP}
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold disabled:text-slate-400"
                        >
                          {isResendingOTP ? 'Sending...' : 'Resend OTP'}
                        </button>
                      </div>

                      {/* Verify Button */}
                      <button
                        onClick={handleVerifyOTP}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        {loading && <LoaderIcon className="w-5 h-5 mr-2" />}
                        <CheckCircle className="w-5 h-5" />
                        Verify & Continue
                      </button>

                      {/* Back Button */}
                      <button
                        onClick={() => setUsingPassword(!usingPassword)}
                        className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
                      >
                        Continue with Password
                      </button>
                    </div>

                    {/* WATI Badge */}
                    <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">
                          Secured by WATI WhatsApp Business API
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const SignupPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-6 pt-10">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left Side - Branding */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-10 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  {logo ? (
                    <img src={logo} alt="nixtour_logo" className="w-8" />
                  ) : (
                    <Plane className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Nixtour</h1>
                  <p className="text-blue-100 text-sm">
                    Book Smart, Travel Easy
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  {
                    icon: Globe,
                    title: 'Worldwide Destinations',
                    desc: '1000+ locations',
                  },
                  {
                    icon: Shield,
                    title: 'Secure & Safe',
                    desc: 'Protected bookings',
                  },
                  {
                    icon: CreditCard,
                    title: 'Best Prices',
                    desc: 'Exclusive deals',
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg flex-shrink-0">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-blue-100 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Trusted by</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xl font-bold">50,000+ Travelers</p>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
            {signupStep === 1 ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    Create Your Account
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Quick & easy registration
                  </p>
                </div>

                {/* Account Type Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => setAccountType('Individual')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      accountType === 'Individual'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1" />
                    <p className="font-semibold text-sm">Individual</p>
                  </button>
                  <button
                    onClick={() => setAccountType('Company')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      accountType === 'Company'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1" />
                    <p className="font-semibold text-sm">Business</p>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                        htmlFor="FirstName"
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        name="FirstName"
                        id="FirstName"
                        value={data.FirstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={data.LastName}
                        name="LastName"
                        id="LastName"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={data.Email}
                        name="Email"
                        id="Email"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      WhatsApp Number *
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-5 h-5 text-green-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        name="PhoneNumber"
                        id="PhoneNumber"
                        className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-green-500" />
                      We'll send OTP via WhatsApp for verification
                    </p>
                  </div>

                  {(accountType === 'Company' ||
                    accountType !== 'Individual') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Company Name *
                        </label>
                        <div className="relative">
                          <Building2 className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            placeholder="Your Company Name"
                            value={data.CompanyName}
                            name="CompanyName"
                            id="CompanyName"
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          GST Number (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="22AAAAA0000A1Z5"
                          value={data.GSTNumber}
                          name="GSTNumber"
                          id="GSTNumber"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="date"
                        value={data.DateOfBirth}
                        name="DateOfBirth"
                        id="DateOfBirth"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={data.Password}
                        name="Password"
                        id="Password"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 pl-10 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Min 8 characters with uppercase, lowercase & numbers
                    </p>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={() => setAcceptedTerms(!acceptedTerms)}
                      className="w-4 h-4 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-600">
                      I agree to the{' '}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>

                  <button
                    onClick={handleSendOTP}
                    disabled={!acceptedTerms}
                    className={
                      'w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2' +
                      (!acceptedTerms && 'bg-gray-400 opacity-50')
                    }
                  >
                    {loading && <LoaderIcon className="w-5 h-5 mr-2" />}
                    <MessageCircle className="w-5 h-5" />
                    Send OTP via WhatsApp
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-slate-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-medium text-slate-700"
                      onClick={login} // 👈 this triggers Google login
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-medium text-slate-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="#1877F2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-sm text-slate-600">
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setCurrentPage('signin');
                          setSignupStep(1);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Verify WhatsApp OTP
                  </h2>
                  <p className="text-slate-600 text-sm">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-semibold text-slate-900">
                      {phoneNumber || '+91 98765 43210'}
                    </span>
                  </p>
                </div>

                <div className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                      Enter OTP
                    </label>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-bold border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-2">
                      Didn't receive the code?
                    </p>
                    <button
                      onClick={handleResendOTP}
                      disabled={isResendingOTP}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold disabled:text-slate-400"
                    >
                      {isResendingOTP ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerifyOTP}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    {loading && <LoaderIcon className="w-5 h-5 mr-2" />}
                    <CheckCircle className="w-5 h-5" />
                    Verify & Continue
                  </button>

                  {/* Back Button */}
                  <button
                    onClick={() => setSignupStep(1)}
                    className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
                  >
                    Back to Registration
                  </button>
                </div>

                {/* WATI Badge */}
                <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">
                      Secured by WATI WhatsApp Business API
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const PassengerManagement = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-28">
      <header className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Passenger Management
                </h1>
                <p className="text-sm text-slate-500">
                  Manage all your travelers in one place
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddPassenger(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
            >
              <UserPlus className="w-5 h-5" />
              Add Passenger
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Passengers</p>
                <p className="text-3xl font-bold text-slate-900">
                  {passengers.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Verified</p>
                <p className="text-3xl font-bold text-slate-900">
                  {passengers.filter((p) => p.status === 'verified').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Frequent Flyers</p>
                <p className="text-3xl font-bold text-slate-900">
                  {passengers.filter((p) => p.frequent).length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">
                  Pending Verification
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {passengers.filter((p) => p.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, passport, email..."
                  className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <select className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Status</option>
              <option>Verified</option>
              <option>Pending</option>
            </select>
            <select className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Nationalities</option>
              <option>Indian</option>
              <option>American</option>
              <option>British</option>
            </select>
            <button className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">Select All</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export All
              </button>
              <button className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import CSV
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                    Passenger
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Passport
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Nationality
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Contact
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
                {passengers.map((passenger) => (
                  <tr
                    key={passenger.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {passenger.firstName.charAt(0)}
                          {passenger.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {passenger.title} {passenger.firstName}{' '}
                            {passenger.lastName}
                          </p>
                          <p className="text-sm text-slate-500">
                            {passenger.gender}
                          </p>
                        </div>
                        {passenger.frequent && (
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> // title="Frequent Flyer"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(passenger.dob).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-sm text-slate-900">
                          {passenger.passport}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {passenger.nationality}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3 h-3" />
                          {passenger.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-3 h-3" />
                          {passenger.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {passenger.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing{' '}
                <span className="font-medium">1-{passengers.length}</span> of{' '}
                <span className="font-medium">{passengers.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all text-sm">
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium text-sm">
                  1
                </button>
                <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all text-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddPassenger && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                Add New Passenger
              </h3>
              <button
                onClick={() => setShowAddPassenger(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title *
                    </label>
                    <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Mr.</option>
                      <option>Mrs.</option>
                      <option>Ms.</option>
                      <option>Dr.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gender *
                    </label>
                    <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Passport Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      placeholder="A1234567"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nationality *
                    </label>
                    <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Indian</option>
                      <option>American</option>
                      <option>British</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="passenger@example.com"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Mark as Frequent Flyer
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowAddPassenger(false)}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Passenger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Navbar />
      {/* <div className="absolute top-28 left-4 bg-white rounded-lg shadow-lg border border-slate-200 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCurrentPage('signin');
              setSignupStep(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 'signin'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setCurrentPage('signup');
              setSignupStep(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 'signup'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setCurrentPage('passenger-management')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 'passenger-management'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Passenger Mgmt
          </button>
        </div>
      </div> */}

      {currentPage === 'signin'
        ? SigninPage()
        : currentPage === 'signup'
          ? SignupPage()
          : PassengerManagement()}
      <Footer />
    </div>
  );
};

export default OTASystem;
