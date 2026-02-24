import { Link } from 'react-router-dom';
import { Ticket, Search } from 'lucide-react';

export function Header() {
  return (
    <header className='px-15 sticky top-0 z-50 border-b bg-background/80 backdrop-blur'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Left: ロゴ */}
        <Link
          to='results'
          className='font-bold text-lg'
        >
          <img src='/images/goexpress.png' />
        </Link>

        <nav className='hidden md:flex items-center gap-6 text-sm font-medium'>
          <Link
            to='search'
            className='font-bold text-lg'
          >
            <Search />
            新幹線でさがす
          </Link>
          <Link
            to='reservation-list'
            className='font-bold text-lg'
          >
            <Ticket />
            予約確認
          </Link>
        </nav>
      </div>
    </header>
  );
}
