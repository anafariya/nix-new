import customer from '../../assets/images/customer.webp';
import rating from '../../assets/images/rating.webp';
import love from '../../assets/images/love.webp';
import support from '../../assets/images/support.webp';

export default function WhyChooseNixtour() {
  return (
    <section className="py-12 ">
      <h2 className="text-4xl font-extrabold text-[#a30f0d] text-center mb-10">
        Why Choose Nixtour
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-6 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="bg-[#f8f4f4] rounded-xl p-6 flex flex-col items-center w-full md:w-1/4 shadow-sm">
          <img src={customer} alt="Happy customers" className="w-20 h-20 mb-4" />
          <h3 className="font-bold text-lg mb-1">10 Million+</h3>
          <div className="w-12 border-t-2 border-[#a30f0d] mb-2" />
          <p className="text-center text-gray-700 text-sm">
            Happy customers from 65+ countries all around.
          </p>
        </div>
        {/* Card 2 */}
        <div className="bg-[#f8f4f4] rounded-xl p-6 flex flex-col items-center w-full md:w-1/4 shadow-sm">
          <img src={rating} alt="Ratings" className="w-20 h-20 mb-4" />
          <h3 className="font-bold text-lg mb-1">4.6 / 5.0</h3>
          <div className="w-12 border-t-2 border-[#a30f0d] mb-2" />
          <p className="text-center text-gray-700 text-sm">
            Cumulative ratings of our trips across platforms.
          </p>
        </div>
        {/* Card 3 */}
        <div className="bg-[#f8f4f4] rounded-xl p-6 flex flex-col items-center w-full md:w-1/4 shadow-sm">
          <img src={love} alt="Curated with love" className="w-20 h-20 mb-4" />
          <h3 className="font-bold text-lg mb-1">Curated with love</h3>
          <div className="w-12 border-t-2 border-[#a30f0d] mb-2" />
          <p className="text-center text-gray-700 text-sm">
            Expert-guided trips with meticulous planning.
          </p>
        </div>
        {/* Card 4 */}
        <div className="bg-[#f8f4f4] rounded-xl p-6 flex flex-col items-center w-full md:w-1/4 shadow-sm">
          <img src={support} alt="24*7 Support" className="w-20 h-20 mb-4" />
          <h3 className="font-bold text-lg mb-1">24*7 Support</h3>
          <div className="w-12 border-t-2 border-[#a30f0d] mb-2" />
          <p className="text-center text-gray-700 text-sm">
            We are always there to help you pre, post and on the trip.
          </p>
        </div>
      </div>
    </section>
  );
} 