// ファイル名: src/components/Header.tsx

import { NavLink } from 'react-router-dom';
import { Ticket, TrainFront, CircleUser } from 'lucide-react';
// toast は非同期処理がなくなったため、不要になります
import { getUserNavigator } from '@/utils/userNavigator';

export const Header: React.FC = () => {
  // ユーザー名は、コンポーネントが描画されるときに一度だけ取得します
  const userName = getUserNavigator();

  /**
   * ログアウトリンクがクリックされた瞬間に、フロントエンドのセッション情報をクリアする関数です。
   * これにより、ユーザーがブラウザの「戻る」ボタンで戻ろうとしても、
   * アプリはログアウト状態として正しく表示されます。
   */
  const handleLogoutClick = () => {
    sessionStorage.clear();
  };

  return (
    <header className='sticky top-0 z-50 border-b bg-white'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl flex h-16 items-center'>
        {/* ロゴ */}
        <NavLink
          to='search'
          className='font-bold text-lg'
        >
          <img src='/images/goexpress.png' />
        </NavLink>

        {/* ナビゲーションメニュー */}
        <nav className='hidden md:flex items-center gap-1 text-sm font-medium ml-auto'>
          {/* 「新幹線をさがす」リンク */}
          <NavLink
            to='search'
            className={({ isActive }) =>
              isActive
                ? 'py-1.5 px-4 inline-flex items-center gap-2 text-13 rounded-lg bg-primary/10 cursor-default'
                : 'py-1.5 px-4 inline-flex items-center gap-2 text-13 rounded-lg hover:bg-input/50'
            }
          >
            <TrainFront />
            新幹線をさがす
          </NavLink>

          {/* 「予約確認」リンク */}
          <NavLink
            to='reservation-list'
            className={({ isActive }) =>
              isActive
                ? 'py-1.5 px-3 inline-flex items-center gap-2 text-13 rounded-lg bg-primary/10 cursor-default'
                : 'py-1.5 px-3 inline-flex items-center gap-2 text-13 rounded-lg hover:bg-input/50'
            }
          >
            <Ticket />
            予約確認
          </NavLink>

          {/* ログイン状態に応じて表示を切り替え */}
          {userName !== null ? (
            // 【ログインしている場合】
            // ログアウトボタンを、バックエンドのエンドポイントへの単純なリンク(aタグ)として実装します。
            // これにより、フロントエンドでの複雑な非同期処理がなくなり、動作が安定します。
            <a
              href='/api/logout'
              className='py-1.5 px-3 inline-flex items-center gap-2 text-13 rounded-lg hover:bg-input/50'
              onClick={handleLogoutClick} // リンク先に飛ぶ直前にセッション情報をクリア
            >
              <CircleUser />
              <p>{userName}</p>
            </a>
          ) : (
            // 【ログアウトしている場合】
            // ログインページへのリンクを表示します
            <NavLink
              to='login'
              className='py-1.5 px-3 inline-flex items-center gap-2 text-13 rounded-lg hover:bg-input/50'
            >
              <CircleUser />
              <p>ログイン</p>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};
