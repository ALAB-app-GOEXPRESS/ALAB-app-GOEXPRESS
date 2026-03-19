import { useEffect } from 'react';

export const LoginCallbackPage: React.FC = () => {
  useEffect(() => {
    const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    const userId = params.get('user_id');
    const userName = params.get('user_name');

    if (idToken) sessionStorage.setItem('idToken', idToken);
    if (userId) sessionStorage.setItem('userId', userId || '');
    if (userName) sessionStorage.setItem('userName', userName || '');

    // トークンを保存したら任意の画面へ遷移
    window.location.replace('/search');
  }, []);

  return <div>ログイン処理中です...</div>;
};
