import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../api';
import { useAuth } from '../hooks/useAuth';
import { useChat } from './ChatContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { state: authState } = useAuth();
  const { socket } = useChat();
  const token = localStorage.getItem("token");

  const fetchNotifications = useCallback(async () => {
    if (!authState.isAuthenticated || !token) return;
    setLoading(true);
    try {
      const response = await notificationAPI.getNotifications(token);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
      
      const countRes = await notificationAPI.getUnreadCount(token);
      if (countRes.ok) {
        const { count } = await countRes.json();
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [authState.isAuthenticated, token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      };

      socket.on("notification_received", handleNewNotification);

      return () => {
        socket.off("notification_received", handleNewNotification);
      };
    }
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      const response = await notificationAPI.markAsRead(id, token);
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await notificationAPI.markAllAsRead(token);
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const clearAll = async () => {
    try {
      const response = await notificationAPI.clearAll(token);
      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const notificationToDelete = notifications.find(n => n.id === id);
      const response = await notificationAPI.deleteNotification(id, token);
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (notificationToDelete && !notificationToDelete.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      clearAll,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
