import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion"

export default function HotelFAQ() {
    const faqItems = [
        {
            question: "Q. How can I do a hotel booking at the lowest price through Nixtour?",
            answer: "Nixtour is your cheapest hotel booking site and you can easily complete the process at the lowest prices without any hassles. Simply visit the Nixtour app or site and enter the check-in and check-out dates, room specifications, and city name in the Hotel section. You will then find a vast range of hotels on offer, including everything from discount hotels near me to mid-range and luxury properties. Personalize searches based on the price range, location, and other filters before narrowing down the top hotel choice. You can also utilize discounts and promo codes at the time of booking for maximum benefits."
        },
        {
            question: "Q. Is it ok to choose 'Pay at hotel' option for an online hotel booking?",
            answer: "It is absolutely fine if you choose the pay at hotel option for your online hotel bookings. It is reliable and secure, since you do not have to pay anything upfront and can book absolutely free of charge. At the same time, you can cancel your hotel booking in case you don't like the property or your trip plans hit any roadblock. Yet, make sure you read through all the booking and cancellation terms and conditions with care to avoid future hassles."
        },
        {
            question: "Q. How can I book cheap hotel rooms in 5 star hotels?",
            answer: "You should first check and compare the available 5-star hotel options in your preferred location online. Ideally, you should travel on weekdays and in the off-season to get cheaper rates on 5-star accommodation. Locations with lesser tourist crowds at specific times of the year (mostly due to the weather conditions) may enable five-star rooms at really attractive rates."
        },
        {
            question: "Q. Is it possible to get a refund if I need to cancel my hotel booking?",
            answer: "Yes, you can get a refund in case you cancel your booking. However, make sure you read the terms and conditions with care while booking your hotel, including the terms of cancellation and the period within which you can cancel and get a refund. Cancellations beyond this timeline may not be eligible for refunds. Free cancellation provisions are always best while booking hotels online."
        },
        {
            question: "Q. What is the check-in and check-out time at most hotels?",
            answer: "Check-in and check-out times vary across hotels across India. However, in most cases, the usual check-in time is between 1-3 PM, while the check-out time can be around 11 AM-12 PM."
        },
        {
            question: "Q. How do I know if my hotel booking is confirmed?",
            answer: "Once you complete your booking online, you will view the confirmation page and details on the screen itself. You will also receive notifications via email or WhatsApp about the status of your hotel booking."
        },
        {
            question: "Q. Where can I find current deals and offers of Nixtour?",
            answer: "To find the top last minute hotel deals and offers online, you can check the official Nixtour page for Hotels. Visit the page and find more details about all the rewards that you can get on your bookings. Utilize discount coupons and promo codes while completing your bookings to get amazing travel deals online."
        },
        {
            question: "Q. How to find the best hotels near me?",
            answer: "Choosing your hotel from a reliable booking site is the need of the hour today. You can visit the Nixtour website to explore the top-rated and most-recommended hotels in multiple cities/locations. Finding the best hotels near you is easy with Nixtour, since you get access to attractive rates and quality properties with good amenities."
        },
        {
            question: "Q. How to find the cheapest hotel deals in any city?",
            answer: "Finding a good budget hotel near me in any city can seem difficult, considering the multiple options available these days. However, you can count on Nixtour to discover fabulous hotel deals in your chosen cities and destinations without any hassles. Visit the official website and get access to great online offers and deals on hotel bookings."
        },
        {
            question: "Q. Can I cancel or amend my hotel reservation last minute if I need to?",
            answer: "You can only cancel your hotel reservation at the last minute if your booking came with the free cancellation feature. Otherwise, it will be chargeable, as per the terms and conditions given in the booking voucher. Check this carefully before finalizing your booking. At the same time, amending may be possible in some situations. Reach out to your booking site directly for assistance in these scenarios."
        }
    ];

    return (
        <section className="sm:py-12 py-5 sm:px-24 px-5">
            <div className="mx-auto">
                <h2 className="text-3xl font-semibold mb-8 text-left">
                    Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border-b"
                        >
                            <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-gray-600">
                                <p dangerouslySetInnerHTML={{__html : item.answer}}></p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
} 