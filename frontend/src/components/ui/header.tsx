import { NavLink } from 'react-router-dom';
import { Ticket, Search } from 'lucide-react';

export function Header() {
  return (
    <header className='sticky top-0 z-50 border-b bg-white'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl flex h-16 items-center'>
        <NavLink
          to='results'
          className='font-bold text-lg'
        >
          <img src='/images/goexpress.png' />
        </NavLink>

        <nav className='hidden md:flex items-center gap-1 text-sm font-medium ml-auto'>
          <NavLink
            to='results'
            className={({ isActive }) =>
              isActive
                ? 'py-1.5 px-4 inline-flex items-center gap-2 text-13 rounded-lg bg-primary text-white'
                : 'py-1.5 px-4 inline-flex items-center gap-2 text-13 rounded-lg'
            }
          >
            <Search />
            新幹線をさがす
          </NavLink>
          <NavLink
            to='reservation-list'
            className={({ isActive }) =>
              isActive
                ? 'py-1.5 px-3 inline-flex items-center gap-2 text-13 rounded-lg bg-primary text-white'
                : 'py-1.5 px-3 inline-flex items-center gap-2 text-13 rounded-lg'
            }
          >
            <Ticket />
            予約確認
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
