import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const LogoutCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
    // const params = new URLSearchParams(hash);
    // const idToken = params.get('id_token');
    // const userId = params.get('user_id');
    // const userName = params.get('user_name');
    // const email = params.get('email');

    // if (idToken) sessionStorage.setItem('idToken', idToken);
    // if (userId) sessionStorage.setItem('userId', userId || '');
    // if (userName) sessionStorage.setItem('userName', userName || '');
    // if (email) sessionStorage.setItem('email', email || '');

    toast.success('ログアウトが完了しました', { position: 'bottom-right', duration: 5000 });

    navigate('/search');
  }, [navigate]);

  return <div>ログアウト処理中です...</div>;
};
