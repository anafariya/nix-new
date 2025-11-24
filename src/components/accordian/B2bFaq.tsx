import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion"

export default function B2bFaq() {
    return (
        <div className="mx-auto">
            <div className="py-6">
                <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-t">
                        <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                            Q. What is a B2B travel portal?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Online B2B travel portal in India that helps travel agents book flights, hotels, visas, and insurance easily while earning good commissions.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                            Q. How do I sign up as a travel agent?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            You can register using the Nix Tour travels agent partner login. Just verify your mobile number, upload KYC documents, and you're ready to start.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                            Q. Is Nix Tour the best option for hotel bookings?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Yes. It's a trusted hotel booking platform for travel agents with access to over 8 lakh properties and flexible cancellation policies.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                            Q. Can I track my commissions and bookings online?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Absolutely. Our online booking platform for travel agent commission agreement keeps everything transparent and easy to manage.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                            Q. Why is Nix Tour called the best B2B travel portal in India?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Because it offers the best fares, fast support, and tools designed for agents. That's why it's known as India's leading B2B travel portal.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                            Q. Do you offer international bookings?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Yes. As a top B2B travel portal in India, Nix Tour lets agent's book domestic and international flights and hotels on one platform.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                        <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                            Q. Are there any travel agent partner offers?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Yes, we provide regular travel agent partner offers and incentives to help our travel agents partner network grow.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-8">
                        <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                            Q. Can I use other platforms like Booking.com with Nix Tour?
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600">
                            Yes. We also support the Booking.com travel agent platform to give agents more flexibility.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
} 