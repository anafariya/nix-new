'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  companyName: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  passengers: string;
  groupType: string;
  acceptTerms: boolean;
}

interface GroupType {
  GroupTypeId: number;
  GroupTypeName: string;
}

interface TravelFormProps {
  isModal?: boolean;
  airlineName?: string;
  setShowBookingModal?: (show: boolean) => void;
  hideX?: boolean;
}

export default function TravelForm({
  isModal = false,
  airlineName,
  setShowBookingModal,
  hideX,
}: TravelFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    companyName: '',
    departureAirport: '',
    arrivalAirport: '',
    departureDate: '',
    passengers: '',
    groupType: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [isLoadingGroupTypes, setIsLoadingGroupTypes] = useState(false);
  useEffect(() => {
    const fetchGroupTypes = async () => {
      setIsLoadingGroupTypes(true);
      try {
        const response = await fetch(
          'https://api.nixtour.com/api/List/GroupTypeList'
        );
        const data = await response.json();
        setGroupTypes(data.Data || []);
      } catch (error) {
        console.error('Error fetching group types:', error);
      } finally {
        setIsLoadingGroupTypes(false);
      }
    };
    fetchGroupTypes();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should contain only letters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else {
      const digits = formData.mobile.replace(/\D/g, '');
      if (digits.length !== 10) {
        newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
      }
    }

    if (!formData.departureAirport.trim()) {
      newErrors.departureAirport = 'Departure airport is required';
    }

    if (!formData.arrivalAirport.trim()) {
      newErrors.arrivalAirport = 'Arrival airport is required';
    }

    if (!formData.departureDate.trim()) {
      newErrors.departureDate = 'Departure date is required';
    }

    if (!formData.passengers.trim()) {
      newErrors.passengers = 'Number of passengers is required';
    } else if (parseInt(formData.passengers) < 9) {
      newErrors.passengers = 'Minimum 9 passengers required for group booking';
    }

    if (!formData.groupType) {
      newErrors.groupType = 'Group type is required';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Please accept terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const payload = {
        Name: formData.name,
        Mobile: formData.mobile.replace(/\D/g, ''),
        EmailId: formData.email,
        Holiday_Adult: 0,
        Holiday_Child: 0,
        Holiday_Infant: 0,
        Holiday_PackageName: '',
        Holiday_Destination: '',
        Visa_VisaTypeId: 0,
        Visa_Destination: '',
        GroupBooking_CompanyName: formData.companyName,
        GroupBooking_FromLocation: formData.departureAirport,
        GroupBooking_ToLocation: formData.arrivalAirport,
        GroupBooking_DepartureDate: formData.departureDate,
        GroupBooking_Airline: airlineName || '',
        GroupBooking_NoofPassenger: parseInt(formData.passengers),
        GroupBooking_GroupTypeId: parseInt(formData.groupType),
        PageUrl: window.location.href,
        SessionId: '',
        CreateId: 0,
        EnquiryFor: '',
        VisaType: '',
        GroupType: '',
      };

      const response = await fetch(
        'https://api.nixtour.com/api/Enquiry/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data) {
        setSubmitStatus({
          type: 'success',
          message: 'Your enquiry has been submitted successfully!',
        });
        setFormData({
          name: '',
          email: '',
          mobile: '',
          companyName: '',
          departureAirport: '',
          arrivalAirport: '',
          departureDate: '',
          passengers: '',
          groupType: '',
          acceptTerms: false,
        });
        setTimeout(() => setSubmitStatus({ type: null, message: '' }), 2000);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit enquiry. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={`flex justify-center items-center ${isModal ? 'min-h-0' : 'min-h-[60vh]'} ${isModal ? '' : 'py-8'}`}>
        <div
          className={`bg-gray-50 rounded-2xl shadow-lg ${isModal ? 'p-2 sm:p-4 md:p-6' : 'p-3 sm:p-6'} w-full ${isModal ? 'max-w-full' : ''}`}
        >
          <div className={`${isModal ? 'px-1 xs:px-2 sm:px-4' : 'px-2 xs:px-4 sm:px-6'} pb-2`}>
            {isModal ? (
              <>
                {!hideX && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowBookingModal?.(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-center mb-1">
                  {airlineName ? (
                    <>
                      Looking for{' '}
                      <span className="text-[brown] font-bold">
                        "{airlineName}"
                      </span>{' '}
                      Group Booking?
                    </>
                  ) : (
                    'Looking for Group Booking?'
                  )}
                </h3>
                <div className="text-center text-xs xs:text-sm sm:text-base font-medium text-gray-700 mb-4">
                  Get Group Quote within 48 Hrs
                </div>
              </>
            ) : (
              <div className="">
                <h3 className="text-xl xs:text-2xl font-bold  text-center">
                  Enquiry Form
                </h3>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isModal ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                  {/* Name Field */}
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none ${isModal ? 'text-sm' : 'sm:text-sm'}`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  {/* Email Field */}
                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Id<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none ${isModal ? 'text-sm' : 'sm:text-sm'}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  {/* Mobile Field */}
                  <div className="w-full">
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mobile No<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none ${isModal ? 'text-sm' : 'sm:text-sm'}`}
                      placeholder="Enter your mobile number"
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                  {/* Company Name Field */}
                  <div className="w-full">
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none ${isModal ? 'text-sm' : 'sm:text-sm'}`}
                      placeholder="Enter company name (optional)"
                    />
                  </div>
                  {/* Departure Airport Field */}
                  <div className="w-full">
                    <label
                      htmlFor="departureAirport"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Departure Airport<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="departureAirport"
                      name="departureAirport"
                      value={formData.departureAirport}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.departureAirport ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none ${isModal ? 'text-sm' : 'sm:text-sm'}`}
                      placeholder="Departure Airport"
                    />
                    {errors.departureAirport && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.departureAirport}
                      </p>
                    )}
                  </div>
                  {/* Arrival Airport Field */}
                  <div className="w-full">
                    <label
                      htmlFor="arrivalAirport"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Arrival Airport<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="arrivalAirport"
                      name="arrivalAirport"
                      value={formData.arrivalAirport}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.arrivalAirport ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none ${isModal ? 'text-sm' : 'sm:text-sm'}`}
                      placeholder="Arrival Airport"
                    />
                    {errors.arrivalAirport && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.arrivalAirport}
                      </p>
                    )}
                  </div>
                  {/* Departure Date Field */}
                  <div className="w-full">
                    <label
                      htmlFor="departureDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Departure Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="departureDate"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.departureDate ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none ${isModal ? 'text-sm' : 'sm:text-sm'}`}
                    />
                    {errors.departureDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.departureDate}
                      </p>
                    )}
                  </div>
                  {/* No. of Passengers */}
                  <div className="w-full">
                    <label
                      htmlFor="passengers"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      No. of Passenger<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="passengers"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleInputChange}
                      min="9"
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.passengers ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none ${isModal ? 'text-sm' : 'sm:text-sm'}`}
                      placeholder="No. of Passenger"
                    />
                    {errors.passengers && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.passengers}
                      </p>
                    )}
                  </div>
                  {/* Group Type */}
                  <div className="w-full">
                    <label
                      htmlFor="groupType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Group Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="groupType"
                      name="groupType"
                      value={formData.groupType}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.groupType ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none ${isModal ? 'text-sm' : 'sm:text-sm'}`}
                      disabled={isLoadingGroupTypes}
                    >
                      <option value="">
                        {isLoadingGroupTypes
                          ? 'Loading...'
                          : 'Select Group Type'}
                      </option>
                      {groupTypes.map((type) => (
                        <option key={type.GroupTypeId} value={type.GroupTypeId}>
                          {type.GroupTypeName}
                        </option>
                      ))}
                    </select>
                    {errors.groupType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.groupType}
                      </p>
                    )}
                  </div>
                </div>
                {/* Accept Terms */}
                <div className="flex items-center mt-4 sm:mt-6 mb-2 flex-wrap">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className={`ml-2 ${isModal ? 'text-xs sm:text-sm' : 'text-sm'} text-gray-700`}
                  >
                    I Accept{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="underline"
                    >
                      Terms & Conditions
                    </button>
                    <span className="text-red-500">*</span>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-xs mt-2 text-left">
                    {errors.acceptTerms}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-[brown] hover:bg-[brown] rounded-[6px] text-white font-semibold py-2 px-4 transition duration-200 disabled:bg-gray-400 mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                {/* Submit Status Message */}
                {submitStatus.type && (
                  <div
                    className={`p-2 rounded mt-4 text-center ${
                      submitStatus.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xs:gap-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none  sm:text-sm`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Id<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none  sm:text-sm`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  {/* Mobile Field */}
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mobile No<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none  sm:text-sm`}
                      placeholder="Enter your mobile number"
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                  {/* Company Name Field */}
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none  sm:text-sm`}
                      placeholder="Enter company name (optional)"
                    />
                  </div>
                                     {/* Route Fields: Departure and Arrival Airport */}
                   <div className="col-span-1 md:col-span-2 flex gap-4">
                     <div className="w-1/2">
                       <label
                         htmlFor="departureAirport"
                         className="block text-sm font-medium text-gray-700 mb-1"
                       >
                         Departure Airport<span className="text-red-500">*</span>
                       </label>
                       <input
                         type="text"
                         id="departureAirport"
                         name="departureAirport"
                         value={formData.departureAirport}
                         onChange={handleInputChange}
                         className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.departureAirport ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none  sm:text-sm`}
                         placeholder="Departure Airport"
                       />
                       {errors.departureAirport && (
                         <p className="text-red-500 text-xs mt-1">
                           {errors.departureAirport}
                         </p>
                       )}
                     </div>
                     <div className="w-1/2">
                       <label
                         htmlFor="arrivalAirport"
                         className="block text-sm font-medium text-gray-700 mb-1"
                       >
                         Arrival Airport<span className="text-red-500">*</span>
                       </label>
                       <input
                         type="text"
                         id="arrivalAirport"
                         name="arrivalAirport"
                         value={formData.arrivalAirport}
                         onChange={handleInputChange}
                         className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.arrivalAirport ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none  sm:text-sm`}
                         placeholder="Arrival Airport"
                       />
                       {errors.arrivalAirport && (
                         <p className="text-red-500 text-xs mt-1">
                           {errors.arrivalAirport}
                         </p>
                       )}
                     </div>
                   </div>
                  {/* Departure Date Field */}
                  <div>
                    <label
                      htmlFor="departureDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Departure Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="departureDate"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.departureDate ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none  sm:text-sm`}
                    />
                    {errors.departureDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.departureDate}
                      </p>
                    )}
                  </div>
                  {/* No. of Passengers */}
                  <div>
                    <label
                      htmlFor="passengers"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      No. of Passenger<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="passengers"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleInputChange}
                      min="9"
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.passengers ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none  sm:text-sm`}
                      placeholder="No. of Passenger"
                    />
                    {errors.passengers && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.passengers}
                      </p>
                    )}
                  </div>
                  {/* Group Type */}
                  <div>
                    <label
                      htmlFor="groupType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Group Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="groupType"
                      name="groupType"
                      value={formData.groupType}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.groupType ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none  sm:text-sm`}
                      disabled={isLoadingGroupTypes}
                    >
                      <option value="">
                        {isLoadingGroupTypes
                          ? 'Loading...'
                          : 'Select Group Type'}
                      </option>
                      {groupTypes.map((type) => (
                        <option key={type.GroupTypeId} value={type.GroupTypeId}>
                          {type.GroupTypeName}
                        </option>
                      ))}
                    </select>
                    {errors.groupType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.groupType}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start justify-between gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="acceptTerms"
                        className="ml-2 text-sm text-gray-700"
                      >
                        I Accept{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="underline"
                        >
                          Terms & Conditions
                        </button>
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full md:w-full bg-[brown] hover:bg-[brown] rounded-[6px] text-white font-semibold py-2 px-4 transition duration-200 disabled:bg-gray-400"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-xs mt-2 text-left">
                    {errors.acceptTerms}
                  </p>
                )}
                {/* Submit Status Message */}
                {submitStatus.type && (
                  <div
                    className={`p-2 rounded mt-4 text-center ${
                      submitStatus.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <Modal open={showTermsModal} onClose={() => setShowTermsModal(false)}>
        <div className="max-h-[80vh] !rounded-[12px] overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Terms & Conditions</h2>
          <div className="text-xs sm:text-sm text-gray-700 space-y-4">
            <p>
              By submitting this enquiry form, you agree to the following terms
              and conditions:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>All information provided must be accurate and complete.</li>
              <li>Group bookings require a minimum of 9 passengers.</li>
              <li>
                Fares are subject to availability and may change without notice.
              </li>
              <li>Booking confirmation is subject to airline approval.</li>
              <li>
                Payment terms and cancellation policies apply as per airline
                rules.
              </li>
              <li>
                Nixtour acts as a facilitator and is not responsible for airline
                decisions.
              </li>
              <li>All bookings are subject to airline terms and conditions.</li>
            </ul>
            <p>
              For complete terms and conditions, please visit our{' '}
              <a href="/user-agreement" className=" underline">
                Terms & Conditions page
              </a>
              .
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
