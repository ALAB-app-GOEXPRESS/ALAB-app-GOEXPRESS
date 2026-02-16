import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { SearchPage } from './pages/Search/SearchPage';
import { ResultPage } from './pages/Search/ResultPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'search', element: <SearchPage /> },
      { path: 'results', element: <ResultPage /> },
    ],
  },
]);
