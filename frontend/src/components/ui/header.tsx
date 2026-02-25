import { NavLink } from 'react-router-dom';
import { Ticket, Search } from 'lucide-react';

export function Header() {
  return (
    <header className='px-15 sticky top-0 z-50 border-b bg-background/80 backdrop-blur'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Left: ロゴ */}
        <NavLink
          to='results'
          className='font-bold text-lg'
        >
          <img src='/images/goexpress.png' />
        </NavLink>

        <nav className='hidden md:flex items-center gap-6 text-sm font-medium'>
          <NavLink
            to='results'
            className={({ isActive }) =>
              isActive
                ? 'p-2 inline-flex items-center gap-2 font-bold text-lg rounded-lg bg-primary text-white'
                : 'p-2 inline-flex items-center gap-2 font-bold text-lg rounded-lg'
            }
          >
            <Search />
            新幹線をさがす
          </NavLink>
          <NavLink
            to='reservation-list'
            className={({ isActive }) =>
              isActive
                ? 'p-2 inline-flex items-center gap-2 font-bold text-lg rounded-lg bg-primary text-white'
                : 'p-2 inline-flex items-center gap-2 font-bold text-lg rounded-lg'
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
