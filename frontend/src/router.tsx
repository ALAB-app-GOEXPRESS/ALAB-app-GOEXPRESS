import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { ResultPage } from './pages/ResultPage/ResultPage';
import { TrainDetailPage } from './pages/TrainDetailPage/TrainDetailPage';
import { ReservationResultPage } from './pages/ReservationResultPage/ReservationResultPage';
import { ReservationListPage } from './pages/ReservationListPage/ReservationListPage';
import { ReservationDetailPage } from './pages/ReservationDetailPage/ReservationDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'search', element: <SearchPage /> },
      { path: 'results', element: <ResultPage /> },
      { path: 'train-detail', element: <TrainDetailPage /> },
      { path: 'reservation-result', element: <ReservationResultPage /> },
      { path: 'reservation-list', element: <ReservationListPage /> },
      { path: 'reservation-detail', element: <ReservationDetailPage /> },
    ],
  },
]);
