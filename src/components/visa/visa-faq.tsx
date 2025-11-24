"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion"

const faqData = [
    {
        question: "Q. Can I trust online visa services in Nixtour?",
        answer: "Yes, Nixtour's visa services are generally reliable, but final approval depends on the embassy. Ensure your documents are complete for a smooth process.",
    },
    {
        question: "Q. Does Nixtour provide visa services?",
        answer: "Yes, Nixtour facilitates visa application and submission to embassies.",
    },
    {
        question: "Q. What visa fees are involved?",
        answer: "Service fee (non‑refundable) + embassy charges.",
    },
    {
        question: "Q. Which countries can I apply for a visa through the Nix Tour?",
        answer: "NixTour offers visa assistance for popular travel destinations, including the UAE (Dubai), Thailand, Singapore, Malaysia, Schengen countries, USA, UK, Russia, Azerbaijan, Srilanka, Turkey, Uzbekistan and more. Availability may vary depending on the destination and visa type (e-Visa, tourist, business, etc.).",
    },
    {
        question: "Q. How do I apply for a visa through NixTour?",
        answer: "Visit the NixTour Visa section on their website. Select your destination, choose the visa type, and follow the instructions to upload required documents. Our team will process and submit your application to the concerned embassy or consulate.",
    },
    {
        question: "Q. Does NixTour assist if the embassy calls me for an interview?",
        answer: "No. NixTour facilitates document submission but does not intervene in embassy procedures like interviews or biometric appointments. You will need to attend those directly if required.",
    },
    {
        question: "Q. Is it safe to submit my documents online?",
        answer: "Yes. NixTour uses secure systems to protect user data and ensure confidentiality throughout the visa process.",
    },
    {
        question: "Q. What documents are needed for visa processing?",
        answer: "It depends on your travel destination. Generally, you'll need a valid passport, recent photographs, flight bookings, hotel reservations, and financial documents. NixTour will share a checklist once you select your destination and visa type.",
    },
    {
        question: "Q. Can I track the status of my visa application?",
        answer: "Yes. Nix Tour provides regular updates on your visa application via email and SMS. You can also check your status through your Nix Tour account dashboard.",
    },
    {
        question: "Q. Does NixTour offer urgent or express visa services?",
        answer: "Yes, for select countries, express visa services are available at an additional cost. You'll see the processing time and fees before booking. Always check availability as it depends on embassy guidelines.",
    },
    {
        question: "Q. Can I reapply if my visa is rejected?",
        answer: "Yes — but treated as a new application with new fees.",
    },
    {
        question: "Q. Is Visa Charges refundable if my visa is rejected?",
        answer: "Some Embassy refunds Visa Charges if a Visa is not granted. Refund of Visa Charges due to refusal of Visa is the sole decision of the embassy. Service Charge Charged by Nixtour is not refundable.",
    },
    {
        question: "Q. Can I cancel my visa application after submission?",
        answer: "You can cancel, but visa fees and service charges are non-refundable once the application is submitted to the embassy. Always check cancellation terms before proceeding.",
    },
];

export function VisaFaq() {
    return (
        <section className="sm:py-12 py-5 ">
            <div className="mx-auto">
                <h2 className="text-3xl font-semibold mb-8 text-left">
                    Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqData.map((item, index) => (
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
    )
} 