import { useEffect } from "react";
import { useMarketStore } from "../store/useMarketStore";

const getWebSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return apiUrl.replace(/^http/, "ws") + "/api/ws";
};

const useWebSocket = (url: string = getWebSocketUrl()) => {
  const updateStockPrice = useMarketStore((state) => state.updateStockPrice);

  useEffect(() => {
    const connect = () => {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log("Connected to FastAPI WebSocket");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // console.log("Real-time Market Data:", data);
          
          if (data.T === 'q' && data.S && data.bp) { // Quote
             updateStockPrice(data.S, data.bp);
          } else if (data.T === 't' && data.S && data.p) { // Trade
             updateStockPrice(data.S, data.p);
          } else if (data.T === 'b' && data.S && data.c) { // Bar
             updateStockPrice(data.S, data.c);
          } else if (data.symbol && data.price) { // Generic format fallback
             updateStockPrice(data.symbol, data.price);
          }
        } catch (e) {
          console.error("Failed to parse websocket message", e);
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from FastAPI WebSocket. Reconnecting in 3s...");
        setTimeout(connect, 3000);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        socket.close();
      };

      return socket;
    };

    const socket = connect();

    return () => {
      socket.onclose = null; // Prevent reconnection on unmount
      socket.close();
    };
  }, [url, updateStockPrice]);
};

export default useWebSocket;
