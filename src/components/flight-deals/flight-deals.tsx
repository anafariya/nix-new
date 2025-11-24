import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

interface FlightDeal {
    destination: string
    price: number
}

const flightDeals: FlightDeal[] = [
    { destination: "Delhi", price: 5097 },
    { destination: "Mumbai", price: 3114 },
    { destination: "Chennai", price: 5319 },
    { destination: "Pune", price: 3824 },
    { destination: "Banglore", price: 2531 },
    { destination: "Kolkata", price: 4195 },
]

export default function FlightDeals({
    scrollRef
}:{
    scrollRef: React.RefObject<HTMLDivElement>
}) {
    const handleScrollToBooking = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Card className="mx-auto sm:p-6">
            <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-4 sm:mb-0">
                    <p className="text-gray-600 mb-2">Departing from</p>
                    <Select defaultValue="BLR">
                        <SelectTrigger className="w-full sm:w-[200px] bg-white">
                            <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BLR">Bengaluru (BLR)</SelectItem>
                            <SelectItem value="DEL">Delhi (DEL)</SelectItem>
                            <SelectItem value="BOM">Mumbai (BOM)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* <div>
                    <p className="text-gray-600 mb-2">Travel Period</p>
                    <Tabs defaultValue="jan" className="w-full sm:w-[300px]">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger
                                value="jan"
                                className="data-[state=active]:bg-[#BC1110] data-[state=active]:text-white"
                            >
                                Jan
                            </TabsTrigger>
                            <TabsTrigger
                                value="feb"
                                className="data-[state=active]:bg-[#BC1110] data-[state=active]:text-white"
                            >
                                Feb
                            </TabsTrigger>
                            <TabsTrigger
                                value="mar"
                                className="data-[state=active]:bg-[#BC1110] data-[state=active]:text-white"
                            >
                                Mar
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div> */}
            </div>

            <CardContent className="p-0">
                {flightDeals.map((deal) => (
                    <div
                        key={deal.destination}
                        className="grid grid-cols-3 sm:grid-cols-3 py-4 border-b last:border-b-0 items-start"
                    >
                        <div className="text-center sm:text-start sm:text-base text-sm sm:ml-4 ml-0">
                            <h3 className="font-bold">To {deal.destination}</h3>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="sm:text-base text-sm font-semibold">Starting From</p>
                            <p className="sm:text-base text-sm text-[#a30f0d] font-bold">
                                <span className="sm:text-base text-xs text-[#a30f0d] font-bold">₹</span>
                                {deal.price}
                            </p>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end">
                            <Button
                                onClick={handleScrollToBooking}
                                className="bg-[#BC1110] font-semibold hover:bg-[#BC1110]/90 text-white text-[10px] sm:text-xs rounded-full sm:px-10"
                            >
                                BOOK NOW
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>

        </Card>
    )
}
