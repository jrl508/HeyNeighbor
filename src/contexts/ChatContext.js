import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { getConversations } from "../api/messaging";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { state } = useAuth();
  const { isAuthenticated, user } = state;
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const data = await getConversations(token);
      console.log("Fetched conversations (after archive action):", data); // DEBUG
      setConversations(data);
      const totalUnread = data.reduce((acc, conv) => acc + parseInt(conv.unread_count || 0), 0);
      setUnreadCount(totalUnread);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem("token");
      const newSocket = io("http://localhost:3001", {
        auth: { token },
      });

      newSocket.on("connect", () => {
        console.log("[Socket] Connected to server");
      });

      newSocket.on("inbox_update", () => {
        fetchConversations();
      });

      newSocket.on("connect_error", (err) => {
        console.error("[Socket] Connection error:", err.message);
      });

      setSocket(newSocket);
      fetchConversations();

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      setSocket(null);
      setConversations([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user, fetchConversations]);

  const value = {
    socket,
    conversations,
    unreadCount,
    loading,
    refreshConversations: fetchConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
