import { RouterProvider } from 'react-router-dom';
import { router } from './routing';
import useWebSocket from './hooks/useWebSocket';
import './index.css';

function App() {
  // Initialize global WebSocket connection for real-time market data
  useWebSocket();

  return <RouterProvider router={router} />;
}

export default App;
