import React, { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "../../../contexts/ChatContext";
import { useAuth } from "../../../hooks/useAuth";
import {
  getMessages,
  markAsRead,
  archiveConversation,
  unarchiveConversation,
  blockUser,
  unblockUser,
  getBlockStatus,
} from "../../../api/messaging";
import Avatar from "../../../components/Avatar";
import { capitalize } from "../../../util/UtilFunctions";
import { formatMessageTimestamp } from "../../../util/dateUtils";
import Icon from "@mdi/react";
import {
  mdiSend,
  mdiDotsVertical,
  mdiArchive,
  mdiBlockHelper,
  mdiArrowULeftTop,
  mdiCancel,
  mdiChevronLeft,
} from "@mdi/js";

const ChatWindow = ({ conversation, onBack }) => {
  const { socket, refreshConversations } = useChat();
  const { state: authState } = useAuth();
  const { user } = authState;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [blockedStatus, setBlockedStatus] = useState({ isBlocked: false });
  const [chatError, setChatError] = useState(null);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const token = localStorage.getItem("token");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchBlockStatus = async () => {
      try {
        const response = await getBlockStatus(conversation.other_user_id, token);
        setBlockedStatus(response);
      } catch (err) {
        console.error("Error fetching block status:", err);
      }
    };
    fetchBlockStatus();

    if (socket) {
      socket.on("error", (error) => {
        setChatError(error.message);
      });
    }

    return () => {
      if (socket) {
        socket.off("error");
      }
    };
  }, [conversation.other_user_id, socket, token]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleArchive = async () => {
    if (window.confirm("Are you sure you want to archive this conversation?")) {
      try {
        await archiveConversation(conversation.id, token);
        refreshConversations();
        if (onBack) onBack();
      } catch (err) {
        setChatError(err.message || "Failed to archive conversation");
      } finally {
        setShowMenu(false);
      }
    }
  };

  const handleUnarchive = async () => {
    try {
      await unarchiveConversation(conversation.id, token);
      refreshConversations();
    } catch (err) {
      setChatError(err.message || "Failed to unarchive conversation");
    } finally {
      setShowMenu(false);
    }
  };

  const handleBlock = async () => {
    if (window.confirm(`Are you sure you want to block ${capitalize(conversation.other_user_first_name)}? This will prevent them from sending you messages or booking your tools.`)) {
      try {
        await blockUser(conversation.other_user_id, token);
        setBlockedStatus({ isBlocked: true });
        setChatError("User blocked successfully.");
        refreshConversations();
      } catch (err) {
        setChatError(err.message || "Failed to block user");
      } finally {
        setShowMenu(false);
      }
    }
  };

  const handleUnblock = async () => {
    try {
      await unblockUser(conversation.other_user_id, token);
      setBlockedStatus({ isBlocked: false });
      setChatError("User unblocked successfully.");
      refreshConversations();
    } catch (err) {
      setChatError(err.message || "Failed to unblock user");
    } finally {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(conversation.id, token);
        setMessages(data);
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    markAsRead(conversation.id, token).then(() => refreshConversations());

    if (socket) {
      socket.emit("join_room", conversation.id);

      socket.on("new_message", (message) => {
        if (message.conversation_id === conversation.id) {
          setMessages((prev) => {
            if (message.sender_id === user.id) {
              return prev.map(m => m.isOptimistic && m.content === message.content ? message : m);
            }
            return [...prev, message];
          });
          markAsRead(conversation.id, token).then(() => refreshConversations());
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit("leave_room", conversation.id);
        socket.off("new_message");
      }
    };
  }, [conversation.id, socket, token, refreshConversations, scrollToBottom, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversation.id,
      content: newMessage,
      sender_id: user.id,
      created_at: new Date().toISOString(),
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    const messageData = {
      conversation_id: conversation.id,
      content: newMessage,
      receiver_id: conversation.other_user_id,
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button 
          className="button is-white mobile-back-button" 
          onClick={onBack}
        >
          <Icon path={mdiChevronLeft} size={1.2} />
        </button>
        <Avatar src={conversation.other_user_image} size="sm" />
        <span className="ml-3 has-text-weight-bold is-size-6">
          {capitalize(conversation.other_user_first_name)}{" "}
          {capitalize(conversation.other_user_last_name)}
        </span>
        <div className="dropdown is-right is-hoverable ml-auto" ref={menuRef}>
          <div className="dropdown-trigger">
            <button
              className="button is-small is-white"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              onClick={toggleMenu}
            >
              <Icon path={mdiDotsVertical} size={0.8} />
            </button>
          </div>
          {showMenu && (
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {conversation.archived_at ? (
                  <a href="#" className="dropdown-item" onClick={handleUnarchive}>
                    <Icon path={mdiArrowULeftTop} size={0.7} className="mr-2" />
                    Unarchive
                  </a>
                ) : (
                  <a href="#" className="dropdown-item" onClick={handleArchive}>
                    <Icon path={mdiArchive} size={0.7} className="mr-2" />
                    Archive
                  </a>
                )}
                <hr className="dropdown-divider" />
                {blockedStatus.isBlockedByMe ? (
                  <a href="#" className="dropdown-item" onClick={handleUnblock}>
                    <Icon path={mdiCancel} size={0.7} className="mr-2" />
                    Unblock User
                  </a>
                ) : (
                  <a href="#" className="dropdown-item" onClick={handleBlock}>
                    <Icon path={mdiBlockHelper} size={0.7} className="mr-2" />
                    Block User
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {blockedStatus.isBlocked && (
        <div className="notification is-danger is-light is-size-7 p-2 m-0">
          {blockedStatus.isBlockedByMe && !blockedStatus.isBlockedByOther && (
            <>You have blocked this user.</>
          )}
          {!blockedStatus.isBlockedByMe && blockedStatus.isBlockedByOther && (
            <>This user has blocked you.</>
          )}
          {blockedStatus.isBlockedByMe && blockedStatus.isBlockedByOther && (
            <>Communication disabled.</>
          )}
        </div>
      )}
      {chatError && (
        <div className="notification is-danger is-light is-size-7 p-2 m-0 is-flex is-align-items-center">
          <span className="is-flex-grow-1">{chatError}</span>
          <button className="delete chat-error-delete ml-auto" onClick={() => setChatError(null)}></button>
        </div>
      )}
      <div className="chat-messages">
        {loading ? (
          <div className="has-text-centered p-6">Loading...</div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isMe = msg.sender_id === user.id;
              return (
                <div
                  key={msg.id || index}
                  className={`message-bubble ${isMe ? "me" : "them"}`}
                >
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">
                    {formatMessageTimestamp(msg.created_at)}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <div className="field has-addons" style={{ width: "100%" }}>
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder={
                blockedStatus.isBlocked
                  ? "Blocked"
                  : "Type a message..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={blockedStatus.isBlocked}
            />
          </div>
          <div className="control">
            <button className="button is-primary" type="submit" disabled={blockedStatus.isBlocked}>
              <Icon path={mdiSend} size={1} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
