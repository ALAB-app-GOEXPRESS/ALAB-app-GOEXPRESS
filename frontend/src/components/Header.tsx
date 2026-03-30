import { NavLink } from 'react-router-dom';
import { Ticket, TrainFront, CircleUser } from 'lucide-react';
import { useState } from 'react';
import { getUserNavigator } from '@/utils/userNavigator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleLogout } from '@/utils/logout';

export const Header: React.FC = () => {
  const [userName, setUserName] = useState(getUserNavigator());

  const logout = () => {
    sessionStorage.removeItem('idToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('email');

    setUserName(null);

    // バックエンドのログアウト処理を実行
    handleLogout();
  };

  return (
    <header className='sticky top-0 z-50 border-b bg-white'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl flex h-16 items-center'>
        <NavLink
          to='search'
          className='font-bold text-lg'
        >
          <img src='/images/goexpress.png' />
        </NavLink>

        <nav className='hidden md:flex items-center gap-1 text-sm font-medium ml-auto'>
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
          {userName !== null && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='py-1.5 px-3 inline-flex items-center gap-2 text-13 rounded-lg hover:bg-input/50 cursor-pointer'>
                  <CircleUser />
                  <p>{userName}</p>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={logout}>ログアウト</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {userName === null && (
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
