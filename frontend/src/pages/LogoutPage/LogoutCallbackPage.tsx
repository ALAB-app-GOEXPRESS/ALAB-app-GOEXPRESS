import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LogoutCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('idToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('email');

    navigate('/search?logout=success');
  }, [navigate]);

  return null;
};
