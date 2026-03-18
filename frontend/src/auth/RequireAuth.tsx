import { Navigate, Outlet } from 'react-router-dom';
 
export const RequireAuth: React.FC = () => {
  const token = localStorage.getItem('idToken');
 
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  return <Outlet />;
};