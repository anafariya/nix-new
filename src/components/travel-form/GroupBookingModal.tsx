import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import axios from "axios";

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

interface GroupBookingModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export default function GroupBookingModal({ open, onClose, title = "Looking for Group Booking?" }: GroupBookingModalProps) {
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
    acceptTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [isLoadingGroupTypes, setIsLoadingGroupTypes] = useState(false);
  console.log(isLoadingGroupTypes)
  useEffect(() => {
    const fetchGroupTypes = async () => {
      setIsLoadingGroupTypes(true);
      try {
        const response = await axios.get('https://api.nixtour.com/api/List/GroupTypeList');
        setGroupTypes(response.data.Data || []);
      } catch (error) {
        console.error('Error fetching group types:', error);
      } finally {
        setIsLoadingGroupTypes(false);
      }
    };
    fetchGroupTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    if (!formData.departureAirport.trim()) newErrors.departureAirport = 'Departure airport is required';
    if (!formData.arrivalAirport.trim()) newErrors.arrivalAirport = 'Arrival airport is required';
    if (!formData.departureDate.trim()) newErrors.departureDate = 'Departure date is required';
    if (!formData.passengers.trim()) newErrors.passengers = 'Number of passengers is required';
    else if (parseInt(formData.passengers) < 9) newErrors.passengers = 'Minimum 9 passengers required for group booking';
    if (!formData.groupType) newErrors.groupType = 'Group type is required';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Please accept terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
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
        GroupBooking_Airline: '',
        GroupBooking_NoofPassenger: parseInt(formData.passengers),
        GroupBooking_GroupTypeId: parseInt(formData.groupType),
        PageUrl: window.location.href,
        SessionId: '',
        CreateId: 0,
        EnquiryFor: '',
        VisaType: '',
        GroupType: '',
      };
      const response = await axios.post(
        'https://api.nixtour.com/api/Enquiry/submit',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data) {
        setSubmitStatus({ type: 'success', message: 'Your enquiry has been submitted successfully!' });
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
          acceptTerms: false
        });
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
          onClose();
        }, 2000);
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to submit enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4 sm:p-6 !rounded-lg">
        <div className="bg-gray-100 rounded-xl p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            {title}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email Id*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Mobile No*
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter company name (optional)"
              />
            </div>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Departure Airport*
                </label>
                <input
                  type="text"
                  name="departureAirport"
                  value={formData.departureAirport}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.departureAirport ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Departure Airport"
                />
                {errors.departureAirport && <p className="text-red-500 text-xs mt-1">{errors.departureAirport}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Arrival Airport*
                </label>
                <input
                  type="text"
                  name="arrivalAirport"
                  value={formData.arrivalAirport}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.arrivalAirport ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Arrival Airport"
                />
                {errors.arrivalAirport && <p className="text-red-500 text-xs mt-1">{errors.arrivalAirport}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Departure Date*
              </label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.departureDate ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate}</p>}
            </div>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  No. of Passenger*
                </label>
                <input
                  type="number"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  min="9"
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.passengers ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter number of passengers"
                />
                {errors.passengers && <p className="text-red-500 text-xs mt-1">{errors.passengers}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Group Type*
                </label>
                <select
                  name="groupType"
                  value={formData.groupType}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.groupType ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  <option value="">Select Group Type</option>
                  {groupTypes.map((type) => (
                    <option key={type.GroupTypeId} value={type.GroupTypeId}>
                      {type.GroupTypeName}
                    </option>
                  ))}
                </select>
                {errors.groupType && <p className="text-red-500 text-xs mt-1">{errors.groupType}</p>}
              </div>
            </div>
            <div className="flex items-start space-x-2 mb-4">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="text-sm">
                <span className="text-gray-700">I Accept </span>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Terms & Conditions.
                </button>
                {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
              </div>
            </div>
            {submitStatus.type && (
              <div className={`p-2 rounded mb-2 text-center ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {submitStatus.message}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[brown] hover:bg-[brown] rounded-[6px] text-white font-semibold py-2 px-4 transition duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
      <Modal open={showTermsModal} onClose={() => setShowTermsModal(false)}>
        <div className="max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
          <div className="text-sm text-gray-700 space-y-4">
            <p>
              By submitting this enquiry form, you agree to the following terms and conditions:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>All information provided must be accurate and complete.</li>
              <li>Group bookings require a minimum of 9 passengers.</li>
              <li>Fares are subject to availability and may change without notice.</li>
              <li>Booking confirmation is subject to airline approval.</li>
              <li>Payment terms and cancellation policies apply as per airline rules.</li>
              <li>Nixtour acts as a facilitator and is not responsible for airline decisions.</li>
              <li>All bookings are subject to airline terms and conditions.</li>
            </ul>
            <p>
              For complete terms and conditions, please visit our 
              <a href="/terms-conditions" className="text-blue-600 hover:text-blue-800 underline ml-1">
                Terms & Conditions page
              </a>.
            </p>
          </div>
        </div>
      </Modal>
    </Modal>
  );
} 