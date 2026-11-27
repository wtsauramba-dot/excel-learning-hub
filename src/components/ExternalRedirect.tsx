import React, { useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ExternalRedirectProps {
  to: string;
}

// Sends the browser to an external URL (used so old /login and /signup
// links on this site land on the learning portal).
export const ExternalRedirect: React.FC<ExternalRedirectProps> = ({ to }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return <LoadingSpinner fullScreen />;
};
