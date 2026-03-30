import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { TrainSearchPage } from './pages/TrainSearchPage/TrainSearchPage';
import { SearchResultPage } from './pages/SearchResultPage/SearchResultPage';
import { TrainDetailPage } from './pages/TrainDetailPage/TrainDetailPage';
import { ReservationResultPage } from './pages/ReservationResultPage/ReservationResultPage';
import { ReservationListPage } from './pages/ReservationListPage/ReservationListPage';
import { ReservationDetailPage } from './pages/ReservationDetailPage/ReservationDetailPage';
import { SeatMapPage } from './pages/SeatMapPage/SeatMapPage';
import { ReservationConfirmPage } from './pages/ReservationConfirmPage/ReservationConfirmPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { LoginCallbackPage } from './pages/LoginPage/LoginCallbackPage';
import { LogoutCallbackPage } from './pages/LogoutPage/LogoutCallbackPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'login-callback', element: <LoginCallbackPage /> },
      { path: 'callback-logout', element: <LogoutCallbackPage /> },
      { path: 'search', element: <TrainSearchPage /> },
      { path: 'results', element: <SearchResultPage /> },
      { path: 'train-detail', element: <TrainDetailPage /> },
      { path: 'reservation-result', element: <ReservationResultPage /> },
      { path: 'reservation-list', element: <ReservationListPage /> },
      { path: 'reservation-detail', element: <ReservationDetailPage /> },
      { path: 'seat-map', element: <SeatMapPage /> },
      { path: 'reservation-confirm', element: <ReservationConfirmPage /> },
    ],
  },
]);
