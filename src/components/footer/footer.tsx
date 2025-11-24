import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import logo from '../../assets/nixtour_logo.svg';
import ITA from '../../assets/images/iata.png';
import Skal from '../../assets/images/skal-logo.png';
import Tai from '../../assets/images/taai-red.png';

const WhatsAppButton = () => {
  const phoneNumber = '918252646969';
  const message = 'Hello, I have a question about Nixtour';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 rounded-full p-3 text-white hover:bg-green-600 shadow-lg z-[1000]"
      aria-label="Chat on WhatsApp"
    >
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
};

export default function Footer() {
  return (
    <footer className="bg-[#eeeeee] pt-6 pb-6 mt-5 no-anchor-color">
      <div className="container mx-auto sm:px-[36px] px-4">
        {/* Navigation Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-10">
          {/* Column 1 */}
          <div className="space-y-3">
            <a href="/about-us" className="block hover:underline">
              About Nixtour
            </a>
            <a href="/offer" className="block hover:underline">
              Offers
            </a>
            <a href="/service" className="block hover:underline">
              Our Services
            </a>
            <a href="/domesticflights" className="block hover:underline">
              Domestic Airlines
            </a>
            <a href="/internationalflights" className="block hover:underline">
              International Airlines
            </a>
            <a href="#" className="block hover:underline">
              Popular Destinations
            </a>
            <a href="#" className="block hover:underline">
              Join Us
            </a>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <a href="/privacy-policy" className="block hover:underline">
              Privacy Policy
            </a>
            <a href="/user-agreement" className="block hover:underline">
              Terms & Conditions
            </a>
            <a href="/contact-us" className="block hover:underline">
              Contact Us
            </a>
            <a href="/b2bagents" className="block hover:underline">
              Agents
            </a>
            <a href="/group-booking" className="block hover:underline">
              Group Booking
            </a>
            <a href="/news" className="block hover:underline">
              News
            </a>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <a
              href="https://www.nixhealthcare.org"
              className="block hover:underline"
            >
              Nix Hospital
            </a>
            <a
              href="https://nixstudyabroad.com"
              className="block hover:underline"
            >
              Nix Study Abroad
            </a>
            <a
              href="https://nixtourcharter.com/"
              className="block hover:underline"
            >
              Nixtour Charters
            </a>
            <a
              href="https://blog.nixtour.com"
              className="block hover:underline"
            >
              Nixtour Blogs
            </a>
          </div>
        </div>

        {/* Social Media and Newsletter Section */}
        <div className="sm:py-8 flex flex-col md:flex-row justify-between items-center sm:gap-8 gap-6">
          {/* Social Media Icons */}
          <div className="flex gap-6">
            <a
              href="https://www.facebook.com/nixtourcom"
              className="text-[#8B1F1F] hover:opacity-80"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/nixtour"
              className="text-[#8B1F1F] hover:opacity-80"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://x.com/nixtourofficial"
              className="text-[#8B1F1F] hover:opacity-80"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://www.youtube.com/@Nixtourofficial"
              className="text-[#8B1F1F] hover:opacity-80"
            >
              <Youtube className="h-6 w-6" />
            </a>
          </div>

          {/* Newsletter Subscription */}
          <div className="flex w-full max-w-lg gap-2">
            <Input
              type="email"
              placeholder="Enter your email to subscribe deals and offers"
              className="flex-1 rounded-[5px] bg-white placeholder:text-gray-400 placeholder:text-start h-10"
            />
            <Button className="bg-[#BC1110] hover:bg-[#BC1110]/90 text-white h-10 rounded-[5px]">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="pt-8 border-t border-[#8B1F1F] mt-4 sm:mt-0">
          <div className="flex sm:flex-row flex-col sm:gap-[92px]">
            {/* Logo */}
            <div className="">
              <div>
                <img
                  src={logo}
                  alt="Nixtour Logo"
                  width={120}
                  height={40}
                  className="mb-4"
                />
              </div>

              {/* Company Description */}
              <p className="text-sm max-w-3xl">
                NixTour is an IATA-accredited travel agency-the one-stop travel
                solution for all your needs. We are India's fastest-emerging
                online travel website and have a customer-centric Approach. We
                have been serving the fields since 2015. We also specialize in
                special student Airfares. Each student is our top priority
                because we offer them an extra luggage allowance and discounted
                airfare up to 15%-20%, extra luggage, and no-cost rescheduling;
                however, such offers depend on the airline's terms and
                conditions.
              </p>
            </div>
            {/* Accreditation Logos and Copyright */}
            <div className="flex flex-col justify-center items-start gap-4 pt-4 px-4 sm:px-8 lg:px-16">
              <div className="flex gap-4 w-full sm:gap-8 items-center justify-center border-b border-[#8B1F1F] pb-4">
                <img
                  src={ITA}
                  alt="IATA Logo"
                  className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] lg:w-[140px] lg:h-[140px] object-contain"
                />
                <img
                  src={Skal}
                  alt="SKAL Logo"
                  className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] lg:w-[140px] lg:h-[140px] object-contain"
                />
                <img
                  src={Tai}
                  alt="Tai Logo"
                  className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] lg:w-[80px] lg:h-[80px] object-contain"
                />
              </div>
              <p className="text-sm text-center lg:text-left w-full">
                Copyright © 2024 - Nix tour India Pvt Ltd
              </p>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </footer>
  );
}
