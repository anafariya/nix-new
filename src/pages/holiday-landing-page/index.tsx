// import WhyChoose from '../../components/holiday-landing/WhyChoose';
import FAQ from '../../components/holiday-landing/FAQ';
import HolidayEngine from '../../components/holiday-landing/holiday-engine';
import Testimonial from '../../components/holiday-landing/Testimonial';
import TopPicks from '../../components/holiday-landing/TopPicks';
import OverTop from '../../components/holiday-landing/OverTop';
import CTA from '../../components/holiday-landing/CTA';
import VisaGateway from '../../components/holiday-landing/VisaGateway';
import PackagesByTheme from '../../components/holiday-landing/PackagesByTheme';
import PackageFilterSection from '../../components/holiday-landing/PackageFilterSection';
import VisaDestinations from '../../components/holiday-landing/VisaDestinations';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';

export default function HolidayLandingPage() {
  return (
    <main>
      <Navbar />
      <HolidayEngine />
      <TopPicks />
      <PackageFilterSection />
      <PackagesByTheme />
      <CTA />
      <VisaDestinations />
      <VisaGateway />
      <OverTop />
      {/* <WhyChoose /> */}
      <Testimonial />
      <FAQ />
      <Footer />
    </main>
  );
}
