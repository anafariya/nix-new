import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  landing?: boolean;
  faqs?: FAQItem[];
}

export default function FAQ({ landing = true, faqs }: FAQProps) {
  const defaultFaqItems = [
    {
      question: 'Q. What services do you offer?',
      answer:
        'We provide customized travel packages, flight and hotel bookings, visa assistance, guided tours, and 24/7 customer support for a seamless travel experience.',
    },
    {
      question: 'Q. Can I customize my travel package?',
      answer:
        'Yes, absolutely! We offer fully customizable travel packages tailored to your preferences, including destination, budget, activities, and accommodations.',
    },
    {
      question: 'Q. How do I book a package with you?',
      answer:
        'Booking is simple! You can browse our website, choose a package, and book online, or contact our support team for assistance.',
    },
    {
      question: 'Q. Do you assist with visas?',
      answer:
        'Yes, we provide visa assistance services, including documentation guidance and application submission, to make the process smooth and hassle-free.',
    },
    {
      question: 'Q. What happens if I need to cancel my trip?',
      answer:
        'We understand that plans can change. Cancellation policies vary depending on the package and services booked. Contact our team for specific details and assistance.',
    },
  ];

  const faqItems = faqs && faqs.length > 0 ? faqs : defaultFaqItems;

  return (
    <section className="py-4 xs:py-5 sm:py-8 md:py-12 text-nix-txt">
      <div className={`mx-auto px-3 xs:px-4 ${landing ? 'max-w-[95%] xs:max-w-[90%] md:max-w-[80%]' : 'w-full'}`}>
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold mb-4 xs:mb-6 sm:mb-8 text-left">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b"
            >
              <AccordionTrigger className="text-sm xs:text-base font-medium hover:no-underline text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm xs:text-base text-gray-600">
               <p dangerouslySetInnerHTML={{__html : item.answer}}></p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
