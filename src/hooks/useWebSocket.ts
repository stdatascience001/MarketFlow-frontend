import { useEffect, useRef } from "react";
import { useMarketStore } from "../store/useMarketStore";

const getWebSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return apiUrl.replace(/^http/, "ws") + "/api/ws";
};

const useWebSocket = (url: string = getWebSocketUrl()) => {
  const updateStockPrice  = useMarketStore((state) => state.updateStockPrice);
  const marketStatus      = useMarketStore((state) => state.marketStatus);
  const refreshMarketStatus = useMarketStore((state) => state.refreshMarketStatus);
  const socketRef         = useRef<WebSocket | null>(null);

  // Refresh market status every minute so the store stays current
  useEffect(() => {
    const timer = setInterval(refreshMarketStatus, 60_000);
    return () => clearInterval(timer);
  }, [refreshMarketStatus]);

  useEffect(() => {
    // Do NOT connect to the live feed when the market is closed
    if (!marketStatus.isOpen) {
      // Close any existing socket when market closes
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    const connect = () => {
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Connected to FastAPI WebSocket");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.T === 'q' && data.S && data.bp) {      // Quote
            updateStockPrice(data.S, data.bp);
          } else if (data.T === 't' && data.S && data.p) { // Trade
            updateStockPrice(data.S, data.p);
          } else if (data.T === 'b' && data.S && data.c) { // Bar
            updateStockPrice(data.S, data.c);
          } else if (data.symbol && data.price) {          // Generic fallback
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

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.onclose = null; // Prevent reconnection on unmount
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [url, marketStatus.isOpen, updateStockPrice]);
};

export default useWebSocket;
