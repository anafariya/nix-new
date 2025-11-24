import TravelForm from '../../components/travel-form/travel-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { ClipboardList, DollarSign, Plane, Users } from 'lucide-react';
import Map from '../../assets/svgs/map.svg';
import GroupBookingFlights from '../../components/group-booking-flights/group-booking-flights';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import FAQ from '../../components/holiday-landing/FAQ';

function index() {
  const faqs = [
    {
      question: 'Q. Is a group flight ticket cheaper?',
      answer:
        'Yes, group flight tickets are usually cheaper than individual bookings. Airlines often provide special group discounts when you book for 10 or more passengers under one reservation.',
    },
    {
      question: 'Q. How to do group booking in flight?',
      answer:
        'To do a group booking in flight, visit the Nixtour website, or contact our group booking desk, or consult a trusted group flight booking agent. You will need to fill out a group quote request form with travel details. NIxTour will help you get group flight tickets with discounts.',
    },
    {
      question: 'Q. What is the discount for IndiGo group booking flights?',
      answer:
        'IndiGo offers exclusive group booking discounts based on the number of travellers, route, and travel date. You can get customised fare quotes and flexible payment options by contacting the IndiGo group booking helpline via Nixtour.',
    },
    {
      question: 'Q. Do airlines charge more for group bookings?',
      answer:
        'No, airlines typically do not charge more for group bookings. In fact, group flight booking often comes with added benefits like locked fares, better flexibility, and lower average ticket prices.',
    },
    {
      question: 'Q. What is a group discount?',
      answer:
        'A group discount is a special reduced fare offered by airlines when a minimum number of passengers—usually 10 or more—travel together on the same flight itinerary.',
    },
    {
      question: 'Q. Best group flight booking agents?',
      answer:
        'Top group flight booking agents in India include Nixtour, MakeMyTrip, and dedicated airline group desks like IndiGo, SpiceJet, and Air India. NixTour is one of the Best group flight booking agents that help secure the best group booking flight offers and manages the entire process smoothly.',
    },
    {
      question: 'Q. What is group booking in flight?',
      answer:
        'Group booking in flight allows 10 or more passengers to book tickets under one reservation with added benefits and fixed fares.',
    },
    {
      question: 'Q. How to book group flight tickets?',
      answer:
        'You can book group flight tickets through the NixTour website, a top group flight booking agent. Simply fill out a quote request form with your travel details to get the best group fare.',
    },
    {
      question: 'Q. What are the group booking flight prices like?',
      answer:
        'Group booking flight prices are usually discounted and may vary based on the airline, route, and group size.',
    },
    {
      question: 'Q. Is there a group booking flight discount available?',
      answer:
        'Yes, NixTour offers special group booking flight discounts for both domestic and international routes.',
    },
    {
      question: 'Q. What is the group booking policy for airlines?',
      answer:
        'Each airline has its own group booking policy, typically offering flexible payments, name change options, and fixed fare quotes.',
    },
    {
      question: 'Q. What are the main group booking benefits?',
      answer:
        'Group booking benefits include discounted fares, dedicated support, and easier management of passenger details.',
    },
    {
      question: 'Q. Who are group flight booking agents?',
      answer:
        'Group flight booking agents are professionals or agencies that assist with bulk flight reservations, discounts, and paperwork.',
    },
    {
      question: 'Q. How to do group booking in flight?',
      answer:
        'You can do group booking in a flight by contacting NixTour, a trusted group booking agent, reaching out to the airline\'s group desk, or filling out an online group quote form.',
    },
    {
      question: 'Q. Which airlines offer cheap flights group bookings?',
      answer:
        'IndiGo, SpiceJet, Air India, and Emirates offer cheap group bookings with various offers and discounts.',
    },
    {
      question: 'Q. What is the best way to book flights for a group?',
      answer:
        'The best way to book group flights is through airline group booking desks or verified agents like NixTour, who offers group discounts.',
    },
    {
      question: 'Q. How to get flight ticket group booking offers?',
      answer:
        'Check airline websites or agents (Nix Tour) for flight ticket group booking offers during promotions or early bookings.',
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="lg:px-[112px] md:px-12 sm:px-6 px-6 min-h-screen">
        <div className="sm:pt-[40px] pt-5">
          <h2 className="sm:text-2xl text-xl font-semibold mb-4">
            Group Booking in Flight & Corporate Travel Deals
          </h2>
        </div>
        <div className="sm:pt-5">
          <h3 className="sm:text-xl text-lg font-semibold mb-3">
            Looking for Air Ticket for more than 9 Passengers?
          </h3>
          <p className="text-justify">
            Nixtour is your one-stop solution for booking group airline tickets
            to several destinations across the globe. Get attractive deals on
            group air tickets with round-the-clock support and service. We
            specialize in bulk flight booking across multiple airlines.
          </p>
        </div>
        <div className="py-8">
          <TravelForm hideX />
        </div>
        <div>
          <p className="text-justify">
            When it comes to group airline tickets, you may find it difficult to
            get hold of the right providers in a highly competitive and
            confusing market. Of course, group plane tickets require specialized
            services, since not every online platform or agent is equipped to do
            the same. It requires special relationships with airlines/carriers
            along with other stakeholders in the travel and logistics industry.
          </p>
          <p className="text-justify mt-1">
            This is where Nixtour stands out as your ideal group flight booking
            agents. We ensure a smooth and hassle-free process of bulk flight
            air ticket booking, across leading global airlines like Emirates,
            Etihad, Malaysia Airlines, and Singapore Airlines, Indigo Airlines,
            Air India, Aeroflot, Uzbekistan Airways and more. You can also get
            fabulous discounted air fare while booking group air fare. With our
            vast experience and connections across the sector, we can take care
            of all your group booking flight needs promptly and in an organized
            manner. What’s more, you can expect super-quick service once you
            contact us, with a dedicated agent taking care of all your queries
            and providing the solutions right away.
          </p>
          <p className="text-justify mt-1">
            So, without waiting any further, reach out to Nixtour right away and
            let us take care of all your group airline tickets and other
            bookings at a discounted air fares.
          </p>
        </div>
        <div className="py-5">
          <GroupBookingFlights />
        </div>
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              How to book Group Air ticket with Nixtour?
            </h1>
            <p className="text-base">
              Planning a trip for a group? Save on group flight tickets and
              explore the best group airline tickets deals with these simple
              tips
            </p>
          </div>

          <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-[25px]">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Fill Group Booking Form
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share your travel details through our form to access group
                  flight booking discounts and special deals on bulk flight
                  bookings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-[25px]">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Wait for our Group Travel Desk quote
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive a tailored quote featuring the best prices for group
                  airline tickets, maximizing savings for your group travel
                  plans.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-[25px]">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Negotiate Air Fare for Group Air ticket Booking
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Work with our team to negotiate airfares and secure discounts
                  on group airline tickets and bulk flight bookings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-[25px]">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Book your Airticket for more than 9 Passengers
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Easily book for 9+ passengers with exclusive group flight
                  booking discounts, ensuring affordable and smooth bulk ticket
                  reservations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Group Booking FAQ Section */}

        <FAQ landing={false} faqs={faqs} />

        <div className="flex items-center justify-center pt-2">
          <img className="object-cover" src={Map} alt="" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default index;
