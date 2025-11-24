import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Plane,
  Umbrella,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';

export default function ContactPage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen sm:py-12 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-center sm:mb-12 mb-6 text-[#BC1110]">
            Contact us
          </h1>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Head Office (Kolkata) */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-6">
                    Head Office
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-6 h-6 mt-1 text-primary" />
                      <div>
                        <h3 className="font-semibold">
                          Nixtour India Private Ltd.
                        </h3>
                        <p className="text-muted-foreground">
                          BL-GA60, 576 Rajdanga Main Road, Near GST Bhawan,<br />
                          Kolkata, West Bengal 700107, India
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <a
                        href="mailto:support@nixtour.com"
                        className="text-primary hover:underline"
                      >
                        support@nixtour.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a
                        href="tel:+91-8252646969"
                        className="text-primary hover:underline"
                      >
                        +91-8252646969
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Corporate Office (Noida) */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-6">
                    Corporate Office
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-6 h-6 mt-1 text-primary" />
                      <div>
                        <h3 className="font-semibold">
                          Nixtour India Private Ltd.
                        </h3>
                        <p className="text-muted-foreground">
                          B19, Sector 60, Noida, Uttar Pradesh 201301, India
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <a
                        href="mailto:support@nixtour.com"
                        className="text-primary hover:underline"
                      >
                        support@nixtour.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a
                        href="tel:+91-8252646969"
                        className="text-primary hover:underline"
                      >
                        +91-8252646969
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Contacts */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-6">
                    Additional Contacts
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-medium text-base sm:text-lg">
                          Agency Support:
                        </span>{' '}
                        <a
                          href="mailto:agencysupport@nixtour.com"
                          className="text-primary hover:underline"
                        >
                          agencysupport@nixtour.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Plane className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-medium text-base sm:text-lg">
                          Visa:
                        </span>{' '}
                        <a
                          href="mailto:visa@nixtour.com"
                          className="text-primary hover:underline"
                        >
                          visa@nixtour.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Umbrella className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-medium text-base sm:text-lg">
                          Holidays:
                        </span>{' '}
                        <a
                          href="mailto:holidays@nixtour.com"
                          className="text-primary hover:underline"
                        >
                          holidays@nixtour.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-medium text-base sm:text-lg">
                          Job Opportunities:
                        </span>{' '}
                        <a
                          href="mailto:hr@nixtour.com"
                          className="text-primary hover:underline"
                        >
                          hr@nixtour.com
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map for Corporate Office (Noida) only */}
            <div className="h-[510px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14014.96489338106!2d77.35794095!3d28.6139396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45e3e3e3e3e%3A0x3e3e3e3e3e3e3e3e!2sB-19%2C%20Sector%2060%2C%20Noida%2C%20Uttar%20Pradesh%20201301%2C%20India!5e0!3m2!1sen!2sin!4v1718030000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nixtour India Private Ltd. Corporate Office Noida Location"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
