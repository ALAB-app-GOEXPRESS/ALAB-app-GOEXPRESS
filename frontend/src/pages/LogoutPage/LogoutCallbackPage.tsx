import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LogoutCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem('showLogoutToast', 'true');

    navigate('/search');
  }, [navigate]);

  return null;
};
