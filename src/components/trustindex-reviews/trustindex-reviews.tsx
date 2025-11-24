import { useState } from 'react';

const TrustindexReviews = () => {
    const [iframeError, setIframeError] = useState(false);

    return (
        <div className="w-full px-4 py-8">
            {iframeError ? (
                <div className="text-center text-gray-500 p-4">
                    Failed to load reviews. Please refresh the page.
                </div>
            ) : (
                <div className=''>
                    <h1 className='text-2xl font-bold text-start sm:px-20 px-4 mb-4'>Reviews from our customers</h1>
                    <iframe
                        src="/reviews.html"
                        title="Customer Reviews"
                        className='w-full h-[300px] border-none overflow-hidden sm:px-12 px-4'
                        loading="lazy"
                        onError={() => setIframeError(true)}
                        sandbox="allow-scripts allow-same-origin"
                    />
                </div>
            )}
        </div>
    );
};

export default TrustindexReviews; 