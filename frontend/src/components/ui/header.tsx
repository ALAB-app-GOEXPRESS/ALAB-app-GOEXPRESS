import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Left: ロゴ */}
        <Link
          to='results'
          className='font-bold text-lg'
        >
          <img src='/images/goexpress.png' />
        </Link>
      </div>
    </header>
  );
}
