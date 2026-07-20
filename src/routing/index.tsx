import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Dashboard } from '../pages/Dashboard';
import { Portfolio } from '../pages/Portfolio';
import { Watchlist } from '../pages/Watchlist';
import { StockDetails } from '../pages/StockDetails';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'watchlist', element: <Watchlist /> },
      { path: 'stocks/:symbol', element: <StockDetails /> },
    ],
  },
]);
