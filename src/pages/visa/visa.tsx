import Footer from '../footer';
import { Navbar } from '../../components/navbar/navbar';
import VisaLandingPage from '../../components/visa/VisaLandingPage';
import { Helmet } from 'react-helmet';

function Visa() {
  return (
    <div>
      <Helmet>
        <title>Best Visa Service Consultant for Tourist & Business Visas</title>
        <meta name="description" content="Tourist Visa & Business Visa Consultancy Services. Apply Tourist Visa & Business Visa Online with Nix Tour, visa agent in Noida.Get visas on time, guaranteed." />
        <meta name="keywords" content="Visa application, Visa assistance, Visa Information, Visa form filling, Travel Insurance, Visa agent in Noida, Best visa service provider, Visa assistance Noida, Fast visa processing, Visa consultancy Noida, Best Visa Services & Tour Operator" />
      </Helmet>
      <Navbar />
      <VisaLandingPage />
      <Footer />
    </div>
  );
}

export default Visa;
