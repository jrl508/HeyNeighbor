import React, { useState, useEffect } from "react";
import { useChat } from "../../../contexts/ChatContext";
import { useAuth } from "../../../hooks/useAuth";
import ChatWindow from "./ChatWindow";
import Avatar from "../../../components/Avatar";
import { capitalize } from "../../../util/UtilFunctions";
import "../../../styles/Inbox.css";

const Inbox = () => {
  const { conversations, unreadCount, refreshConversations } = useChat();
  const { state } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
  };

  return (
    <div className="inbox-container">
      <div className="inbox-sidebar">
        <div className="inbox-header">
          <h2 className="title is-4">Messages</h2>
          {unreadCount > 0 && (
            <span className="tag is-danger is-rounded">{unreadCount}</span>
          )}
        </div>
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <div className="p-4 has-text-centered has-text-grey">
              No messages yet
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${
                  selectedConversation?.id === conv.id ? "active" : ""
                } ${conv.unread_count > 0 ? "unread" : ""}`}
                onClick={() => handleSelectConversation(conv)}
              >
                <Avatar src={conv.other_user_image} size="md" />
                <div className="conv-info">
                  <div className="conv-top">
                    <span className="user-name">
                      {capitalize(conv.other_user_first_name)}{" "}
                      {capitalize(conv.other_user_last_name)}
                    </span>
                    <span className="conv-date">
                      {conv.last_message_at
                        ? new Date(conv.last_message_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <div className="conv-bottom">
                    <span className="last-message">
                      {conv.last_message || "No messages yet"}
                    </span>
                    {conv.unread_count > 0 && (
                      <span className="unread-badge">{conv.unread_count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="inbox-chat">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            key={selectedConversation.id}
          />
        ) : (
          <div className="no-chat-selected">
            <div className="has-text-centered">
              <i className="mdi mdi-forum-outline is-size-1 has-text-grey-lighter"></i>
              <p className="has-text-grey">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
