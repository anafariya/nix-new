import { Navbar } from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'
import FlightSearch from '../../components/flight-search/flight-search'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

type Airline = {
    AirlineId: number;
    AirlineName: string;
    AirlineType: string;
};

type GroupedAirlines = {
    [key: string]: Airline[];
};

function groupAirlinesByAlphabet(airlines: Airline[]): GroupedAirlines {
    const grouped: GroupedAirlines = {};
    alphabet.forEach(letter => { grouped[letter] = []; });
    airlines.forEach((airline: Airline) => {
        const firstLetter = airline.AirlineName?.[0]?.toUpperCase();
        if (grouped[firstLetter]) {
            grouped[firstLetter].push(airline);
        }
    });
    return grouped;
}

function DomesticFlights() {
    const [airlines, setAirlines] = useState<GroupedAirlines>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch('https://api.nixtour.com/api/Web/AirlineList')
            .then(res => res.json())
            .then(data => {
                if (data.Success && Array.isArray(data.Data)) {
                    const domesticAirlines = data.Data.filter((airline: Airline) => airline.AirlineType == 'Domestic');
                    setAirlines(groupAirlinesByAlphabet(domesticAirlines));
                } else {
                    setAirlines({});
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load airlines');
                setLoading(false);
            });
    }, []);

    const handleAirlineClick = (airline: Airline) => {
        const formattedName = airline.AirlineName.replace(/\s+/g, '-').toLowerCase();
        navigate(`/flights/${formattedName}`);
    };

    const nonEmptyAlphabets = alphabet.filter(letter => {
        const airlinesForLetter = airlines[letter] || [];
        return airlinesForLetter.length > 0;
    });

    return (
        <div className='min-h-screen bg-white'>
            <Navbar />
            {/* Blue header */}
            <div className="bg-[#2073C7] py-20 xs:py-24 sm:py-28 md:py-32 text-center">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">Domestic Airlines</h1>
            </div>
            {/* Flight Search UI */}
            <div className="flex justify-center -mt-24 xs:-mt-28 sm:-mt-32 md:-mt-36 mb-6 xs:mb-8 sm:mb-10 px-2 xs:px-4">
                <div className="w-full  md:max-w-2xl">
                    <FlightSearch />
                </div>
            </div>
            {/* Domestic Airline List */}
            <div className="max-w-[90%] md:max-w-6xl mx-auto px-2 xs:px-4 pb-16">
                <h2 className="text-xl xs:text-2xl font-bold mb-6 text-[#1cb0f6]">Domestic Airline List</h2>
                {loading ? (
                    <div className="text-center py-10 text-lg">Loading airlines...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {nonEmptyAlphabets.map((letter) => {
                            const list = airlines[letter] || [];
                            return (
                                <div key={letter} className="">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3 sm:mb-4">{letter}</h3>
                                    <ul className="space-y-1 sm:space-y-2">
                                        {list.map((airline: Airline) => (
                                            <li key={airline.AirlineId}>
                                                <button
                                                    onClick={() => handleAirlineClick(airline)}
                                                    className="font-semibold text-xs sm:text-sm md:text-base text-black text-left w-full"
                                                >
                                                    {airline.AirlineName}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default DomesticFlights
