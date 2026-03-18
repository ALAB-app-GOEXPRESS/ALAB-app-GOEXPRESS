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
import { LoginPage } from './pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'search', element: <TrainSearchPage /> },
      { path: 'results', element: <SearchResultPage /> },
      { path: 'train-detail', element: <TrainDetailPage /> },
      { path: 'reservation-result', element: <ReservationResultPage /> },
      { path: 'reservation-list', element: <ReservationListPage /> },
      { path: 'reservation-detail', element: <ReservationDetailPage /> },
      { path: 'seat-map', element: <SeatMapPage /> },
      { path: 'reservation-confirm', element: <ReservationConfirmPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
