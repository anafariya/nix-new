"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";

interface EnquiryType {
  EnquiryTypeId: number;
  EnquiryTypeName: string;
}

interface GroupType {
  GroupTypeId: number;
  GroupTypeName: string;
}

interface VisaType {
  VisaTypeId: number;
  VisaType: string;
}

export default function EnquiryPage() {
  const [enquiryTypes, setEnquiryTypes] = useState<EnquiryType[]>([]);
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    enquiryType: "Holiday",
    // Holiday fields
    adults: 2,
    children: 0,
    infants: 0,
    packageName: "",
    destination: "",
    // Visa fields
    visaType: "",
    visaDestination: "",
    // Group Booking fields
    companyName: "",
    fromLocation: "",
    toLocation: "",
    airline: "",
    passengers: "",
    groupType: "",
    travelDate: "",
  });

  // Fetch enquiry types, group types, and visa types on component mount
  useEffect(() => {
    fetchEnquiryTypes();
    fetchGroupTypes();
    fetchVisaTypes();
  }, []);

  const fetchEnquiryTypes = async () => {
    try {
      const url = "https://api.nixtour.com/api/List/EnquiryTypeList";
      console.log("[WebEnquiry] Types URL:", url);
      const response = await fetch(url);
      console.log("[WebEnquiry] Types status:", response.status);
      const data = await response.json();
      console.log("[WebEnquiry] Types JSON:", data);
      if (data.Success && Array.isArray(data.Data)) {
        console.log("Enquiry types from API:", data.Data);
        setEnquiryTypes(data.Data);
      }
    } catch (error) {
      console.error("[WebEnquiry] Types error:", error);
    }
  };

  const fetchGroupTypes = async () => {
    try {
      const url = "https://api.nixtour.com/api/List/GroupTypeList";
      console.log("[WebEnquiry] GroupTypes URL:", url);
      const response = await fetch(url);
      console.log("[WebEnquiry] GroupTypes status:", response.status);
      const data = await response.json();
      console.log("[WebEnquiry] GroupTypes JSON:", data);
      if (data.Success && Array.isArray(data.Data)) {
        setGroupTypes(data.Data);
      }
    } catch (error) {
      console.error("[WebEnquiry] GroupTypes error:", error);
    }
  };

  const fetchVisaTypes = async () => {
    try {
      const url = "https://api.nixtour.com/api/List/VisaTypeList";
      const response = await fetch(url);
      const data = await response.json();
      if (data.Success && Array.isArray(data.Data)) {
        setVisaTypes(data.Data);
      }
    } catch (error) {
      console.error("[WebEnquiry] VisaTypes error:", error);
    }
  };

  // Helper function to get EnquiryTypeId by name
  const getEnquiryTypeIdByName = (name: string) => {
    const found = enquiryTypes.find((t) => t.EnquiryTypeName === name);
    return found?.EnquiryTypeId || 0;
  };

  // Comprehensive validation function
  const validateForm = () => {
    const errors: string[] = [];

    // Common validations
    if (!formData.name.trim()) {
      errors.push("Name is required");
    }
    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }
    if (!formData.mobile.trim()) {
      errors.push("Mobile number is required");
    } else {
      const digits = formData.mobile.replace(/\D/g, '');
      if (digits.length !== 10) {
        errors.push("Please enter a valid 10-digit mobile number");
      }
    }

    // Type-specific validations
    switch (formData.enquiryType) {
      case "Holiday":
        if (!formData.destination.trim()) {
          errors.push("Destination is required for Holiday enquiry");
        }
        if (!formData.adults || formData.adults < 1) {
          errors.push("At least 1 adult is required for Holiday enquiry");
        }
        // Package name is optional for Holiday
        break;

      case "Visa":
        if (!formData.visaType.trim()) {
          errors.push("Visa Type is required for Visa enquiry");
        }
        if (!formData.visaDestination.trim()) {
          errors.push("Destination is required for Visa enquiry");
        }
        break;

      case "Group Booking":
      case "Group-Booking": // API returns "Group-Booking"
        // Company name is optional for Group Booking
        if (!formData.fromLocation.trim()) {
          errors.push("From Location is required for Group Booking");
        }
        if (!formData.toLocation.trim()) {
          errors.push("To Location is required for Group Booking");
        }
        if (!formData.airline.trim()) {
          errors.push("Airline is required for Group Booking");
        }
        if (!formData.passengers.trim() || parseInt(formData.passengers) < 9) {
          errors.push("Minimum 9 passengers required for Group Booking");
        }
        if (!formData.groupType.trim()) {
          errors.push("Group Type is required for Group Booking");
        }
        if (!formData.travelDate.trim()) {
          errors.push("Travel Date is required for Group Booking");
        }
        break;
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(", "));
      return;
    }

    setLoading(true);

    try {
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem("sessionId") || "syst" : "syst";
      const createId = 101;
      
      const currentDateTime = new Date().toISOString();
      
      // Create payload according to API documentation - 100% compliant
      const payload = {
        EnquiryId: 0, // Required field as per API doc
        EnquiryTypeId: getEnquiryTypeIdByName(formData.enquiryType),
        Name: formData.name,
        Mobile: formData.mobile.replace(/\D/g, ''),
        EmailId: formData.email,
        Holiday_Adult: formData.enquiryType === "Holiday" ? formData.adults : 0,
        Holiday_Child: formData.enquiryType === "Holiday" ? formData.children : 0,
        Holiday_Infant: formData.enquiryType === "Holiday" ? formData.infants : 0,
        Holiday_PackageName: formData.enquiryType === "Holiday" ? formData.packageName : '',
        Holiday_Destination: formData.enquiryType === "Holiday" ? formData.destination : '',
        Visa_VisaTypeId: formData.enquiryType === "Visa" ? parseInt(formData.visaType) || 0 : 0,
        Visa_Destination: formData.enquiryType === "Visa" ? formData.visaDestination : '',
        GroupBooking_CompanyName: (formData.enquiryType === "Group Booking" || formData.enquiryType === "Group-Booking") ? formData.companyName : '',
        GroupBooking_FromLocation: (formData.enquiryType === "Group Booking" || formData.enquiryType === "Group-Booking") ? formData.fromLocation : '',
        GroupBooking_ToLocation: (formData.enquiryType === "Group Booking" || formData.enquiryType === "Group-Booking") ? formData.toLocation : '',
        GroupBooking_DepartureDate: (formData.enquiryType === "Group Booking" || formData.enquiryType === "Group-Booking") ? (formData.travelDate || currentDateTime) : null,
        GroupBooking_Airline: (formData.enquiryType === "Group Booking" || formData.enquiryType === "Group-Booking") ? formData.airline : '',
        GroupBooking_NoofPassenger: (formData.enquiryType === "Group Booking" || formData.enquiryType === "Group-Booking") ? parseInt(formData.passengers) : 0,
        GroupBooking_GroupTypeId: (formData.enquiryType === "Group Booking" || formData.enquiryType === "Group-Booking") ? parseInt(formData.groupType) : 0,
        PageUrl: window.location.href,
        SessionId: sessionId,
        CreateId: createId,
        EnquiryFor: formData.enquiryType,
        VisaType: formData.enquiryType === "Visa" ? formData.visaType : '',
        GroupType: (formData.enquiryType === "Group Booking" || formData.enquiryType === "Group-Booking") ? formData.groupType : '',
        EnquiryDate: currentDateTime,
        EnquiryType: formData.enquiryType,
        Status: "New Enquiry",
        StatusDate: currentDateTime,
        Remarks: ''
      };

      console.log("[WebEnquiry] Submit payload:", payload);
      const url = "https://api.nixtour.com/api/Enquiry/submit";
      console.log("[WebEnquiry] Submit URL:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("[WebEnquiry] Submit status:", response.status);
      const data = await response.json();
      console.log("[WebEnquiry] Submit JSON:", data);
      // After success, hint the admin view by telling which filters will match it
      if (data?.Success) {
        console.log("[WebEnquiry] Submitted with type:", formData.enquiryType);
        console.log("[WebEnquiry] Tip: In admin, set Enquiry Type to", formData.enquiryType, "and Status to 'New Enquiry' with today's date range to view it.");
      }

      if (data.Success) {
        console.log("Enquiry submitted successfully!");
        toast.success("Enquiry submitted successfully! We'll get back to you soon.");
        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          enquiryType: "Holiday",
          adults: 2,
          children: 0,
          infants: 0,
          packageName: "",
          destination: "",
          visaType: "",
          visaDestination: "",
          companyName: "",
          fromLocation: "",
          toLocation: "",
          airline: "",
          passengers: "",
          groupType: "",
          travelDate: "",
        });
      } else {
        console.error("API returned error:", data.Error);
        toast.error(data.Error || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  const renderEnquiryForm = () => {
    switch (formData.enquiryType) {
      case "Holiday":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Information for Holiday */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile No. *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter your mobile number"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            
            {/* Holiday Specific Fields */}
            <div>
              <Label htmlFor="destination" className="text-sm font-medium text-gray-700">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="e.g., Bali, Thailand, Europe"
                className="mt-1 placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <div>
                <Label htmlFor="packageName" className="text-sm font-medium text-gray-700">Package Name</Label>
                <Input
                  id="packageName"
                  value={formData.packageName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, packageName: e.target.value }))}
                  placeholder="e.g., Bali Paradise Package"
                  className="mt-1 placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="adults" className="text-sm font-medium text-gray-700">Adult *</Label>
                <Input
                  id="adults"
                  type="number"
                  value={formData.adults}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, adults: parseInt(e.target.value) || 0 }))}
                  min="1"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="children" className="text-sm font-medium text-gray-700">Child</Label>
                <Input
                  id="children"
                  type="number"
                  value={formData.children}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                  min="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="infants" className="text-sm font-medium text-gray-700">Infant</Label>
                <Input
                  id="infants"
                  type="number"
                  value={formData.infants}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, infants: parseInt(e.target.value) || 0 }))}
                  min="0"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );
      case "Visa":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Information for Visa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile No. *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter your mobile number"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            
            {/* Visa Specific Fields */}
            <div>
              <Label htmlFor="visaDestination" className="text-sm font-medium text-gray-700">Destination *</Label>
              <Input
                id="visaDestination"
                value={formData.visaDestination}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, visaDestination: e.target.value }))}
                placeholder="e.g., USA, UK, Australia"
                className="mt-1 placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <div>
                <Label htmlFor="visaType" className="text-sm font-medium text-gray-700">Visa Type *</Label>
                <Select 
                  value={formData.visaType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, visaType: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    {visaTypes.map((type) => (
                      <SelectItem key={type.VisaTypeId} value={type.VisaTypeId.toString()}>
                        {type.VisaType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case "Group Booking":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Information for Group Booking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile No. *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter your mobile number"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            
            {/* Group Booking Specific Fields */}
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Your company name (optional)"
                className="mt-1 placeholder:text-gray-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fromLocation" className="text-sm font-medium text-gray-700">From Location *</Label>
                <Input
                  id="fromLocation"
                  value={formData.fromLocation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
                  placeholder="e.g., Mumbai"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="toLocation" className="text-sm font-medium text-gray-700">To Location *</Label>
                <Input
                  id="toLocation"
                  value={formData.toLocation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, toLocation: e.target.value }))}
                  placeholder="e.g., Delhi"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label htmlFor="travelDate" className="text-sm font-medium text-gray-700">Departure Date *</Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, travelDate: e.target.value }))}
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline" className="text-sm font-medium text-gray-700">Airline *</Label>
                <Input
                  id="airline"
                  value={formData.airline}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, airline: e.target.value }))}
                  placeholder="e.g., Air India, IndiGo"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="passengers" className="text-sm font-medium text-gray-700">No. of Passenger *</Label>
                <Input
                  id="passengers"
                  type="number"
                  value={formData.passengers}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, passengers: e.target.value }))}
                  min="9"
                  placeholder="Minimum 9 passengers"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="groupType" className="text-sm font-medium text-gray-700">Group Type *</Label>
              <Select 
                value={formData.groupType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, groupType: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select group type" />
                </SelectTrigger>
                <SelectContent>
                  {groupTypes.map((type) => (
                    <SelectItem key={type.GroupTypeId} value={type.GroupTypeId.toString()}>
                      {type.GroupTypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "GroupBooking":
      case "Group-Booking":
      case "Group_Booking":
        // Fallback cases for different naming conventions
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Information for Group Booking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile No. *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter your mobile number"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            
            {/* Group Booking Specific Fields */}
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Your company name (optional)"
                className="mt-1 placeholder:text-gray-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fromLocation" className="text-sm font-medium text-gray-700">From Location *</Label>
                <Input
                  id="fromLocation"
                  value={formData.fromLocation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
                  placeholder="e.g., Mumbai"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="toLocation" className="text-sm font-medium text-gray-700">To Location *</Label>
                <Input
                  id="toLocation"
                  value={formData.toLocation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, toLocation: e.target.value }))}
                  placeholder="e.g., Delhi"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label htmlFor="travelDate" className="text-sm font-medium text-gray-700">Departure Date *</Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, travelDate: e.target.value }))}
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline" className="text-sm font-medium text-gray-700">Airline *</Label>
                <Input
                  id="airline"
                  value={formData.airline}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, airline: e.target.value }))}
                  placeholder="e.g., Air India, IndiGo"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="passengers" className="text-sm font-medium text-gray-700">No. of Passenger *</Label>
                <Input
                  id="passengers"
                  type="number"
                  value={formData.passengers}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, passengers: e.target.value }))}
                  min="9"
                  placeholder="Minimum 9 passengers"
                  className="mt-1 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="groupType" className="text-sm font-medium text-gray-700">Group Type *</Label>
              <Select 
                value={formData.groupType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, groupType: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select group type" />
                </SelectTrigger>
                <SelectContent>
                  {groupTypes.map((type) => (
                    <SelectItem key={type.GroupTypeId} value={type.GroupTypeId.toString()}>
                      {type.GroupTypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 text-[#BC1110]">
            Submit Your Enquiry
          </h1>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-gray-600">
                Tell us about your travel requirements and we'll get back to you with the best offers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Enquiry Type Selection */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Enquiry Type</h2>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Select Enquiry Type *</Label>
                  <Select 
                    value={formData.enquiryType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, enquiryType: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {enquiryTypes.map((type) => (
                        <SelectItem key={type.EnquiryTypeId} value={type.EnquiryTypeName}>
                          {type.EnquiryTypeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enquiry Type Specific Details */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Enquiry Details</h2>
                {renderEnquiryForm()}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#BC1110] hover:bg-[#A00D0C] text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-medium"
                >
                  {loading ? "Submitting..." : "Submit Enquiry"}
                </Button>
              </div>
            </form>

            {/* Additional Information */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2 sm:mb-3">What happens next?</h3>
              <ul className="text-sm sm:text-base text-blue-800 space-y-1 sm:space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>We'll review your enquiry within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Our travel experts will contact you with personalized offers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>You'll receive detailed quotes and travel recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>We'll assist you throughout the booking process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
