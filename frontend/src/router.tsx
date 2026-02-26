import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { ResultPage } from './pages/ResultPage/ResultPage';
import { TrainDetailPage } from './pages/TrainDetailPage/TrainDetailPage';
import { ReservationListPage } from './pages/ReservationListPage/ReservationListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'search', element: <SearchPage /> },
      { path: 'results', element: <ResultPage /> },
      { path: 'train-detail', element: <TrainDetailPage /> },
      { path: 'reservation-list', element: <ReservationListPage /> },
    ],
  },
]);
