import { useEffect } from 'react';

export const LoginPage: React.FC = () => {
  useEffect(() => {
    window.location.replace('http://localhost:8080/oauth2/authorization/cognito');
  }, []);

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl pt-6'>
      ログインページにリダイレクトしています。自動で切り替わらない場合は
      <a href='http://localhost:8080/oauth2/authorization/cognito'>こちら</a>
      をクリックしてください。
    </div>
  );
};
