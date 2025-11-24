import { useLocation } from 'react-router-dom';
import PackageDetails from '../pages/holiday-package-details';
import HolidaySearchResults from '../pages/holiday-landing-page/HolidaySearchResults';
import NotFound from '../pages/not-found/not-found';

const HolidayRouteHandler = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Extract the part after /holiday/
  const holidayPath = pathname.replace('/holiday/', '');
  
  // Check if it ends with -tour-packages
  if (holidayPath.endsWith('-tour-packages')) {
    return <HolidaySearchResults />;
  }
  
  // Check if it's a single segment (package name)
  const segments = holidayPath.split('/');
  if (segments.length === 1 && holidayPath !== '') {
    return <PackageDetails />;
  }

  return <NotFound />;
};

export default HolidayRouteHandler;