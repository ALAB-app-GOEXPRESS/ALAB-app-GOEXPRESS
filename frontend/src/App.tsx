import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';

function App() {
  const isLoggedIn = !!localStorage.getItem('idToken');
  return (
    <>
      {isLoggedIn && <Header />}
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
