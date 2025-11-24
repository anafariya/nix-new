import { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Plane,
  Phone,
  LoaderIcon,
  CheckCircle,
  Shield,
  MessageCircle,
} from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../../stores/authStore';
import { useGoogleLogin } from '../useGoogleLogin';
import logo from '../../assets/Favicon.png';

export const OTALoginPopup: React.FC<{
  setRedirect: any;
  redirectURL: any;
}> = ({ setRedirect, redirectURL }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    mailornumber: '',
    Password: '',
    DialCode: '+91',
  });

  const setUser = useAuthStore((state) => state.setUser);

  const [signinStep, setSigninStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usingPassword, setUsingPassword] = useState(false);

  const { login } = useGoogleLogin({
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    serverUrl: '',

    onSuccess: (data: any) => {
      console.log('Login success:', data);
      // store in Zustand or redirect
      if (data?.Success) setUser(data?.User);

      setRedirect(false);

      window.location.href = redirectURL;
    },

    onError: (err: any) => {
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

  const handleVerifyOTP = async (e: any) => {
    e.preventDefault();
    // console.log('Verifying OTP:', otp.join(''));

    setLoading(true);
    try {
      // Simulate OTP verification
      const response = await axios.post(
        'https://api.nixtour.com/api/Auth/verify-otp',
        { PhoneNumber: formData.mailornumber, OTPCode: otp.join('') },
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
        setSigninStep(3);
        setFormData({
          mailornumber: '',
          DialCode: '',
          Password: '',
        });
        setOtp(['', '', '', '', '', '']);
      }

      setLoading(false);
      console.log(response.data?.Message);

      console.log('Verify OTP response:', response);
      // Success - redirect or show success message
      setRedirect(false);
      window.location.href = redirectURL;
    } catch (error: any) {
      setLoading(false);
      alert(error?.response?.data?.Message);

      console.error('Error verifying OTP:', error);
    }
  };

  const handleResendOTP = async () => {
    console.log('handleResendOTP called');
    if (formData.mailornumber) {
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
          PhoneNumber: formData.mailornumber,
          Purpose: 'login',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setFormData({
        mailornumber: '',
        DialCode: '',
        Password: '',
      });
      alert(response.data?.Message);
      setLoading(false);

      console.log('handleResendOTP response:', response);
    } catch (error: any) {
      alert(error?.response?.data?.Message);
      setLoading(false);

      console.error('Error handling resend OTP:', error);
    }
  };

  const handleLogin = async () => {
    console.log('handleLogin called');
    // Simulate login
    if (!formData.mailornumber) {
      alert('Please enter email or phone number.');
      console.error('handleLogin: Email or phone number is empty');
    }
    if (
      formData.mailornumber.length < 3 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mailornumber)
    ) {
      alert('Please enter valid email or phone number.');
      console.error('handleLogin: Email or phone number is invalid');
    }
    if (!formData.Password) {
      alert('Please enter password.');
      console.error('handleLogin: Password is empty');
    }
    if (formData.Password.length < 8) {
      alert('Please enter valid password.');
      console.error('handleLogin: Password is invalid');
    }

    setLoading(true);
    console.log('handleLogin: Data', formData);
    await axios
      .post(
        'https://api.nixtour.com/api/Auth/login',
        {
          Email: formData.mailornumber,
          Password: formData.Password,
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
          setFormData({
            mailornumber: '',
            Password: '',
            DialCode: '',
          });

          console.log(response.data?.Message);

          setLoading(false);

          // Success - redirect or show success message
          window.location.href = redirectURL;
          setRedirect(false);
        }
        console.log('handleLogin: Login response', response);
      })
      .catch((error) => {
        setLoading(false);
        console.error('handleLogin: Error logging in', error);
        alert(error?.response?.data?.Message);
      });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle login/signup logic here
    setLoading(true);

    await handleResendOTP();

    // window.location.href = redirectURL;
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) {
    setRedirect(false);
    // return (
    //   <div className="fixed min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    //     <button
    //       onClick={() => setIsOpen(true)}
    //       className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
    //     >
    //       Open Login
    //     </button>
    //   </div>
    // );
  }

  if (isSignUp) window.location.href = '/auth?type=signup';

  return (
    <div className="fixed z-[1000] top-0 left-0 min-h-screen w-full flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95dvh] overflow-hidden overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] z-10">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Header with Brand */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-white">
          <div className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="nixtour_logo" className="w-8" />
            ) : (
              <Plane className="w-8 h-8" />
            )}
            <h2 className="text-2xl font-bold">Nixtour</h2>
          </div>
          <p className="text-blue-100 text-sm">
            {isSignUp
              ? 'Create your account to start booking'
              : 'Welcome back! Sign in to continue'}
          </p>
        </div>

        {/* Form */}
        {signinStep === 1 ? (
          <div className="px-8 py-6">
            <div className="space-y-4">
              <div className="space-y-4">
                {!/[^0-9]/.test(formData.mailornumber) &&
                formData.mailornumber ? (
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
                        onChange={handleChange}
                        value={formData.DialCode}
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
                          name="mailornumber"
                          id="mailornumber"
                          autoFocus
                          onChange={handleChange}
                          value={formData.mailornumber}
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
                        name="mailornumber"
                        id="mailornumber"
                        autoFocus
                        onChange={handleChange}
                        value={formData.mailornumber}
                        placeholder="john@example.com or +91 1234567890"
                        className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => setRedirect(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                {loading && <LoaderIcon className="w-5 h-5 mr-2" />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                <span
                  className="text-sm font-medium text-gray-700"
                  onClick={login}
                >
                  Google
                </span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Facebook
                </span>
              </button>
            </div>

            {/* Toggle Sign Up/Sign In */}
            <p className="text-center text-sm text-gray-600 mt-6">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
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
                        onChange={handleChange}
                        value={formData.Password}
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

                  {/* Login Button */}
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
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl p-8 py-4 border border-slate-200">
                  <div className="text-center mb-4">
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
                        {formData.mailornumber || '+91 98765 43210'}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
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
                  <div className="mt-4">
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
  );
};
