import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { io } from "socket.io-client";
import api, { SOCKET_URL } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import Logout from "../components/Logout";

export default function Chat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(undefined);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!user.isAvatarSet) {
      navigate("/set-avatar");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    socket.current = io(SOCKET_URL);
    socket.current.emit("add-user", user.id);
    return () => socket.current?.disconnect();
  }, [user]);

  useEffect(() => {
    if (!user?.isAvatarSet) return;
    (async () => {
      const { data } = await api.get("/auth/contacts");
      setContacts(data);
    })();
  }, [user]);

  if (!user) return null;

  return (
    <Container>
      <div className="chat-container">
        <Contacts contacts={contacts} currentUser={user} onSelect={setSelectedContact} />
        {selectedContact === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer contact={selectedContact} socket={socket} />
        )}
      </div>
      <div className="logout-container">
        <Logout />
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;

  .chat-container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
  }

  .logout-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
  }
`;
