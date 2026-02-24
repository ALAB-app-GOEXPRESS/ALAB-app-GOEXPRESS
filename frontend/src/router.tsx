import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { ResultPage } from './pages/ResultPage/ResultPage';
import { ReservationResultPage } from './pages/ReservationDetailPage/ReservationResultPage';
import { ReservationListPage } from './pages/ReservationListPage/ReservationListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'search', element: <SearchPage /> },
      { path: 'results', element: <ResultPage /> },
      { path: 'reservation-result', element: <ReservationResultPage /> },
      { path: 'reservation-list', element: <ReservationListPage /> },
    ],
  },
]);
