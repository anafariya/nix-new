import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';

interface FlightRoute {
  FlightRoutesId: number;
  Name: string;
  Url: string;
}

interface FlightRoutesListProps {
  airlineId?: number;
  className?: string;
}

const FlightRoutesList: React.FC<FlightRoutesListProps> = ({ airlineId, className = "" }) => {
  const [flightRoutes, setFlightRoutes] = useState<FlightRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlightRoutes();
  }, [airlineId]);

  const fetchFlightRoutes = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build API URL - include airlineId only if provided (for airline pages)
      const apiUrl = airlineId
        ? `https://api.nixtour.com/api/Web/FlightRouteList?airlineid=${airlineId}`
        : 'https://api.nixtour.com/api/Web/FlightRouteList';

      const response = await fetch(apiUrl);

      if (response.ok) {
        const result = await response.json();
        // Handle different response formats
        let routesData: FlightRoute[] = [];
        if (Array.isArray(result)) {
          routesData = result;
        } else if (result.Data && result.Data.FlightRouteList && Array.isArray(result.Data.FlightRouteList)) {
          routesData = result.Data.FlightRouteList;
        } else if (result.Data && Array.isArray(result.Data)) {
          routesData = result.Data;
        } else if (result.data && Array.isArray(result.data)) {
          routesData = result.data;
        } else if (result.FlightRouteList && Array.isArray(result.FlightRouteList)) {
          routesData = result.FlightRouteList;
        }

        setFlightRoutes(routesData);
      } else {
        setError('Failed to fetch flight routes');
      }
    } catch (err) {
      setError('Error fetching flight routes');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteClick = (route: FlightRoute) => {
    // Store the flight route ID for the details page
    sessionStorage.setItem('selectedFlightRouteId', route.FlightRoutesId.toString());

    // Use the URL from API but navigate to our flight route details page structure
    const routeUrl = route.Url.startsWith('/') ? route.Url : `/${route.Url}`;

    // Navigate to the route details page
    window.location.href = routeUrl;
  };

  if (loading) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="text-gray-600">Loading flight routes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!flightRoutes.length) {
    return null; // Don't show anything if no routes available
  }

  return (
    <div className={`flight-routes-section ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-left">
          {airlineId ? 'Popular Flight Routes' : 'Popular Flight Routes'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flightRoutes.length > 0 ? (
            flightRoutes.map((route) => (
              <div
                key={route.FlightRoutesId}
                onClick={() => handleRouteClick(route)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[#BC1110]/30 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#BC1110] rounded-full flex items-center justify-center flex-shrink-0">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                      {route.Name}
                    </h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No flight routes available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightRoutesList;