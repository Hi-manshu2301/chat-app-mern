import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ChatInput from "./ChatInput";

export default function ChatContainer({ contact, socket }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    if (!contact) return;
    (async () => {
      const { data } = await api.post("/messages/get", {
        from: user.id,
        to: contact._id,
      });
      setMessages(data);
    })();
  }, [contact, user.id]);

  useEffect(() => {
    if (!socket?.current) return;
    socket.current.on("msg-receive", ({ from, message }) => {
      if (from === contact?._id) {
        setMessages((prev) => [...prev, { fromSelf: false, message }]);
      }
    });
    return () => socket.current?.off("msg-receive");
  }, [socket, contact]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    await api.post("/messages/add", {
      from: user.id,
      to: contact._id,
      message: text,
    });
    socket.current?.emit("send-msg", { to: contact._id, from: user.id, message: text });
    setMessages((prev) => [...prev, { fromSelf: true, message: text }]);
  };

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={contact.avatarImage} alt="avatar" />
          </div>
          <div className="username">
            <h3>{contact.username}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div ref={scrollRef} key={msg.id || index}>
            <div className={`message ${msg.fromSelf ? "sent" : "received"}`}>
              <div className="content">
                <p>{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar img {
        height: 3rem;
      }
      .username h3 {
        color: white;
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: white;
      }
    }

    .sent {
      justify-content: flex-end;
      .content {
        background-color: #4e0eff;
      }
    }

    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
