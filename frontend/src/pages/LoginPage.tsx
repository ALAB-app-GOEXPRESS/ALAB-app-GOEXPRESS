import { useEffect } from 'react';

export const LoginPage: React.FC = () => {
  useEffect(() => {
      window.location.replace("https://ap-northeast-1usoicgi0x.auth.ap-northeast-1.amazoncognito.com/login?client_id=s0ksgqnpm35f0a3jlnkqc329d&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fd84l1y8p4kdic.cloudfront.net")
  }, []);

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl pt-6'>
      ログインページにリダイレクトしています。自動で切り替わらない場合は
      <a href='https://ap-northeast-1usoicgi0x.auth.ap-northeast-1.amazoncognito.com/login?client_id=s0ksgqnpm35f0a3jlnkqc329d&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fd84l1y8p4kdic.cloudfront.net'>
        こちら
      </a>
      をクリックしてください。
    </div>
  );
};
