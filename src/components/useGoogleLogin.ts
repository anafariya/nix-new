import { useEffect, useRef } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  serverUrl?: string; // e.g. "/api/auth/google"
  clientId?: string; // Google Client ID
}

export const useGoogleLogin = ({
  onSuccess,
  onError,
  serverUrl = 'https://api.nixtour.com/api/Auth/google-signin',
  clientId,
}: GoogleLoginOptions) => {
  const initialized = useRef(false);

  useEffect(() => {
    console.log('Checkpoint 1');

    if (initialized.current) return;

    console.log('Checkpoint 2');

    if (!window.google) return;
    console.log('Checkpoint 3');

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || clientId,
      callback: handleLoginResponse,
    });

    console.log('Checkpoint 4');

    // window.google.accounts.id.renderButton(
    //   document.getElementById('googleLoginBtn') // ,{ theme: 'outline', size: 'large' }
    // );
    // window.google.accounts.id.renderButton(
    //   document.getElementById('googleSignupBtn') // ,{ theme: 'outline', size: 'large' }
    // );

    initialized.current = true;
  }, [clientId, onSuccess, onError]);

  const handleLoginResponse = async (googleResponse: any) => {
    console.log(googleResponse);

    try {
      const IdToken = googleResponse.credential;

      console.log({ IdToken });

      const serverResponse = await axios.post(
        import.meta.env.VITE_GOOGLE_AUTH_SERVER_URL || serverUrl,
        {
          IdToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      onSuccess?.(serverResponse.data);
    } catch (error: any) {
      onError?.(error);
    }
  };

  // EXPOSE THIS to trigger login manually
  const login = () => {
    console.log('Checkpoint 5');

    if (!window.google) return;
    console.log('Checkpoint 6');

    // Ensure we've initialized the SDK before calling prompt
    // if (!initialized.current) {
    console.log('Checkpoint 7');
    // Attempt to initialize now (safe to call again)
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || clientId,
      callback: handleLoginResponse,
    });
    //   initialized.current = true;
    // }

    try {
      console.log('Checkpoint 8');
      window.google.accounts.id.prompt();
      console.log('Checkpoint 9');
    } catch (err) {
      console.log('Checkpoint 10');

      onError?.(err);
      console.error('google.accounts.id.prompt() failed', err);
    }
  };

  return { login };
};

//   return {
//     renderButton: () => {
//       if (!window.google) return;
//       window.google.accounts.id.prompt(); // optional auto popup
//     },
//   };
