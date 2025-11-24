import { Link } from 'react-router-dom';
import Header from '../../pages/header';
import Footer from '../../components/footer/footer';
import { AlertCircleIcon, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

const NotFound = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="mb-8">
          <AlertCircleIcon className="h-24 w-24 text-destructive mx-auto" />
        </div>

        <h1 className="text-6xl font-bold tracking-tighter mb-4">404</h1>

        <h2 className="text-2xl font-semibold mb-2">Page not found</h2>

        <p className="text-muted-foreground max-w-md mb-8">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </p>

        <Button asChild className='bg-[#BC1110] font-semibold hover:bg-[#BC1110]/90 text-white rounded' size="lg">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
