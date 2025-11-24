import CTAImage from '../../assets/images/cta-img.jpg';
import CTAGraphicImage from '../../assets/images/CTA-graphics.png';
import axios from 'axios';
import { useState } from 'react';

export default function CTA() {
  // Enquiry form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = { name: '', phone: '', email: '', destination: '' };
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should contain only letters';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else {
      const digits = formData.phone.replace(/\D/g, '');
      if (digits.length !== 10) {
        newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
      }
    }
    if (!formData.destination) {
      newErrors.destination = 'Destination is required';
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // Submit handler
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    try {
      const payload = {
        Name: formData.name,
        Mobile: formData.phone.replace(/\D/g, ''),
        EmailId: formData.email,
        Holiday_Adult: 0,
        Holiday_Child: 0,
        Holiday_Infant: 0,
        Holiday_PackageName: '',
        Holiday_Destination: formData.destination,
        Visa_VisaTypeId: 0,
        Visa_Destination: '',
        GroupBooking_CompanyName: '',
        GroupBooking_FromLocation: '',
        GroupBooking_ToLocation: '',
        GroupBooking_Airline: '',
        GroupBooking_NoofPassenger: 0,
        GroupBooking_GroupTypeId: 0,
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
        setFormData({ name: '', phone: '', email: '', destination: '' });
        setTimeout(() => setSubmitStatus({ type: null, message: '' }), 2000);
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to submit enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full h-fit py-6 xs:py-8 sm:py-10 md:py-16 bg-nix-prime-trans relative">
      <img
        src={CTAImage}
        alt=""
        className="hidden md:block w-full md:w-[30%] h-full object-cover object-center absolute top-0 right-0 z-[1]"
      />

      <div className="w-full max-w-[95%] xs:max-w-[90%] lg:max-w-[80%] mx-auto relative z-[2] h-full flex flex-col md:flex-row items-center justify-between gap-6 xs:gap-8">
        <div className="w-full md:w-[60%] flex flex-col justify-center items-center gap-3 xs:gap-4 md:gap-5 mb-6 xs:mb-8 md:mb-0">
          <h3 className="text-nix-prime text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-[poppins] text-center px-2">
            Trying to find a trip suitable for you?
          </h3>
          <img src={CTAGraphicImage} alt="" className="w-[90%] xs:w-[80%] md:w-auto" />
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-[48px] text-nix-txt text-center font-extrabold px-2">
            Our experts would love to Curate a package just for you!
          </h2>
        </div>

        <div className="w-full md:w-[40%] bg-[var(--nix-white)] rounded-[15px] xs:rounded-[20px] shadow-[0_0_10px_#00000055] text-center p-3 xs:p-4 md:p-5 border border-[var(--nix-prime)]">
          <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-[25px] font-[poppins] font-normal px-1">
            Didn't find what you were looking for? No worries! We'll create a customized itinerary just for you!
          </h3>
          <form className="flex flex-col gap-3 xs:gap-4 md:gap-5 mt-3 xs:mt-4 md:mt-5">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`px-3 xs:px-4 md:px-5 py-2 md:py-2.5 rounded-full border ${errors.name ? 'border-red-500' : 'border-[#ddd]'} outline-none transition-all text-sm xs:text-[15px] md:text-[16px] font-[poppins] hover:border-[#aaa]`}
            />
            {errors.name && <p className="text-red-500 text-xs text-left px-2 -mt-2 mb-1">{errors.name}</p>}
            <input
              type="text"
              id="numberOnly"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`px-3 xs:px-4 md:px-5 py-2 md:py-2.5 rounded-full border ${errors.phone ? 'border-red-500' : 'border-[#ddd]'} outline-none transition-all text-sm xs:text-[15px] md:text-[16px] font-[poppins] hover:border-[#aaa]`}
            />
            {errors.phone && <p className="text-red-500 text-xs text-left px-2 -mt-2 mb-1">{errors.phone}</p>}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`px-3 xs:px-4 md:px-5 py-2 md:py-2.5 rounded-full border ${errors.email ? 'border-red-500' : 'border-[#ddd]'} outline-none transition-all text-sm xs:text-[15px] md:text-[16px] font-[poppins] hover:border-[#aaa]`}
            />
            {errors.email && <p className="text-red-500 text-xs text-left px-2 -mt-2 mb-1">{errors.email}</p>}
            <input
              type="text"
              placeholder="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className={`px-3 xs:px-4 md:px-5 py-2 md:py-2.5 rounded-full border ${errors.destination ? 'border-red-500' : 'border-[#ddd]'} outline-none transition-all text-sm xs:text-[15px] md:text-[16px] font-[poppins] hover:border-[#aaa]`}
            />
            {errors.destination && <p className="text-red-500 text-xs text-left px-2 -mt-2 mb-1">{errors.destination}</p>}
            {submitStatus.type && (
              <div className={`p-2 rounded mb-2 text-center text-xs xs:text-sm ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{submitStatus.message}</div>
            )}
            <button
              type="submit"
              id="take-off"
              onClick={handleEnquirySubmit}
              className="bg-red-600 hover:bg-red-700 text-white px-3 xs:px-4 md:px-5 py-2.5 xs:py-3 md:py-[15px] rounded-full font-[poppins] font-semibold text-sm xs:text-base md:text-[18px] transition-all cursor-pointer"
              disabled={isSubmitting}
            >
              <i className="fa-regular fa-paper-plane"></i> {isSubmitting ? 'Submitting...' : 'Take Off'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
