import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion"

export default function FAQSection() {
    return (
        <div className="mx-auto">
            <div className="py-6">
                <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-t">
                        <AccordionTrigger className="text-base font-normal hover:no-underline text-left">
                            Q. Which Website Is Best For Students to Book Air Ticket Bookings?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            NixTour offers special student airfares with extra luggage allowance and discounts up to 15-20%.
                            Our dedicated service makes us the best choice for student air ticket bookings.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. How To Book the Cheapest Air Ticket Online?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Compare prices, be flexible with dates, book in advance, and use NixTour's affordable services
                            to find the best deals on air tickets.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. How To Refund Air Ticket Purchased At NixTour?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            We offer a transparent refund process with complimentary rescheduling. Contact our customer
                            service team to initiate your refund request.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. Why We Should Book Air Tickets at NixTour?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            NixTour offers competitive prices, transparent refund policies, free rescheduling, and excellent
                            customer service, making us your ideal choice for air ticket bookings.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. Where can I book cheap flight tickets online?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            You can book the cheapest domestic and international flights on NixTour. The platform offers great deals, safe payment options, real-time tracking, and last-minute discounts to make booking fast and affordable.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. How can I get the cheapest flight tickets?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            To find the cheapest flights, stay flexible with your travel dates and destination. Book your tickets in advance—ideally 30 to 60 days before departure. Book with NixTour and check budget airlines for better deals. Even shifting your travel by a day or two can make a big difference in fare.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. Is it better to buy flight tickets at the airport?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            No, it is best to book online through NixTour. Airport tickets are usually more expensive, while NixTour offers exclusive last-minute deals and discounts.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. How do I book cheap flights on NixTour?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Booking on NixTour is super easy. Just select your "From" and "To" destinations, pick a travel date, and use the calendar to see prices for the entire month. Choose your date, add passenger details, and hit search. You will get multiple airline options to choose from.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-9">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. How can I get 50% off on a flight?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            To save up to 50%, try booking early, being flexible with travel dates, and looking for offers like student discounts, cashback, or promo codes.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-10">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. How do I book flight tickets for a visa application?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            For visa purposes, either book a refundable ticket or use a flight reservation service that provides a flight itinerary without full payment. These "dummy tickets" are accepted as proof of onward travel for most visa applications.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-11">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. Can I reserve a flight without paying?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Yes, some platforms like NixTour allow you to hold a flight reservation without paying right away. These are temporary bookings that you can confirm later.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-12">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. Which is the best website to book flights in India?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            NixTour is the best website to book flights in India. These platforms offer competitive prices, user-friendly interfaces, and regular discounts for both domestic and international travel.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-13">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. Does NixTour offer discounts on domestic flights?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Yes, NixTour gives you access to active domestic flight offers. Once you apply the deal, just use the price filter and sort flights in ascending order to find the cheapest options.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-14">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. How soon will I get my flight booking confirmation?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            You will receive a confirmation message and email within minutes after completing your booking on NixTour.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-15">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. Can I book hotels with NixTour too?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Yes! You can also book your hotel stay on NixTour. Use the same platform to find the perfect stay anywhere.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-16">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. What is the best day to book cheap flights?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Earlier, Tuesday was the cheapest, but now it is Sunday. Book your flight on a Sunday at least 21 days before your trip to save the most.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-17">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. How many seats can I book at once?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            You can book up to 9 seats in one go when booking flights on NixTour.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-18">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. Is NixTour a safe site to book flight tickets?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Yes, NixTour is a secure and reliable platform for booking both domestic and international flights. It offers safe payment options, booking confirmation via email and SMS, and 24/7 customer support.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-19">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. Does NixTour allow booking refundable flight tickets?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Yes, NixTour offers both refundable and non-refundable flight options. You can choose a refundable ticket if you need flexibility for cancellations or visa applications.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-20">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. What are dummy flight tickets for visa applications?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Dummy tickets are temporary flight reservations used as proof of onward travel when applying for a visa. They're not confirmed bookings but are accepted by most embassies.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-21">
                        <AccordionTrigger className="text-base font-normal hover:no-underline">
                            Q. What types of flights can I book on NixTour?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            You can book both domestic and international one-way, round-trip, and multi-city flights through NixTour, along with hotel and holiday packages.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}

