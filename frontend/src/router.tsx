import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { ResultPage } from './pages/ResultPage/ResultPage';
import { ReservationResultPage } from './pages/ReservationResultPage/ReservationResultPage';
import { TrainDetailPage } from './pages/TrainDetailPage/TrainDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'search', element: <SearchPage /> },
      { path: 'results', element: <ResultPage /> },
      { path: 'reservation-detail', element: <ReservationResultPage /> },
      { path: 'train-detail', element: <TrainDetailPage /> },
    ],
  },
]);
