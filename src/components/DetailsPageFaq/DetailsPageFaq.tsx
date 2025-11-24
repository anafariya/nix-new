import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

interface FAQ {
  Question: string;
  Answer: string;
}

interface DetailsPageFaqProps {
  faqs: FAQ[];
}

export default function DetailsPageFaq({ faqs }: DetailsPageFaqProps) {
  return (
    <div className="mx-auto">
      <div className="py-6">
        <h2 className="text-2xl font-semibold mb-6">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="border-t"
            >
              <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                {faq.Question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600">
                <p dangerouslySetInnerHTML={{ __html: faq.Answer }}></p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
