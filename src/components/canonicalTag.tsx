import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const CanonicalTag = () => {
  const [canonicalUrl, setCanonicalUrl] = useState('');
  useEffect(() => {
    setCanonicalUrl(window.location.href);
  }, []);
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default CanonicalTag;
