import { useCallback } from 'react';
import nixtourLogo from '../assets/nixtour_logo.svg';

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  amount: number; // in paise (multiply by 100)
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface UseRazorpayReturn {
  initializePayment: (options: RazorpayOptions) => Promise<RazorpayResponse>;
  loadRazorpayScript: () => Promise<boolean>;
}

export const useRazorpay = (): UseRazorpayReturn => {
  // Load Razorpay script dynamically
  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }, []);

  // Initialize Razorpay payment
  const initializePayment = useCallback(
    async (options: RazorpayOptions): Promise<RazorpayResponse> => {
      return new Promise(async (resolve, reject) => {
        // Load script if not already loaded
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          reject(new Error('Failed to load Razorpay SDK'));
          return;
        }

        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          reject(new Error('Razorpay Key ID not found in environment variables'));
          return;
        }

        // Default options
        const defaultOptions = {
          currency: import.meta.env.VITE_CURRENCY || 'INR',
          name: import.meta.env.VITE_COMPANY_NAME || 'Nixtour',
          image: nixtourLogo, // Use imported logo
          theme: {
            color: '#BC1110', // Nixtour brand color (red)
            backdrop_color: '#F5F5F5',
          },
        };

        const razorpayOptions = {
          key: razorpayKey,
          ...defaultOptions,
          ...options,
          amount: options.amount, // Amount in paise
          handler: function (response: RazorpayResponse) {
            console.log('✅ Payment successful:', response);
            resolve(response);
          },
          modal: {
            ondismiss: function () {
              console.log('❌ Payment cancelled by user');
              reject(new Error('Payment cancelled by user'));
            },
            escape: true,
            backdropclose: false,
          },
        };

        console.log('🔧 Initializing Razorpay with options:', razorpayOptions);

        try {
          const rzp = new window.Razorpay(razorpayOptions);

          rzp.on('payment.failed', function (response: any) {
            console.error('❌ Payment failed:', response.error);
            reject(new Error(response.error.description || 'Payment failed'));
          });

          rzp.open();
        } catch (error) {
          console.error('❌ Error initializing Razorpay:', error);
          reject(error);
        }
      });
    },
    [loadRazorpayScript]
  );

  return {
    initializePayment,
    loadRazorpayScript,
  };
};