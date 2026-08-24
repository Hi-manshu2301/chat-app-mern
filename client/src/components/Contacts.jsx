import React, { useState } from "react";
import styled from "styled-components";

export default function Contacts({ contacts, currentUser, onSelect }) {
  const [activeId, setActiveId] = useState(undefined);

  const handleClick = (contact, index) => {
    setActiveId(index);
    onSelect(contact);
  };

  return (
    <Container>
      <div className="brand">
        <h3>Pulse Chat</h3>
      </div>
      <div className="contacts">
        {contacts.map((contact, index) => (
          <div
            key={contact._id}
            className={`contact ${index === activeId ? "active" : ""}`}
            onClick={() => handleClick(contact, index)}
          >
            <div className="avatar">
              <img src={contact.avatarImage} alt="avatar" />
            </div>
            <div className="username">
              <h3>{contact.username}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="current-user">
        <div className="avatar">
          <img src={currentUser?.avatarImage} alt="avatar" />
        </div>
        <div className="username">
          <h2>{currentUser?.username}</h2>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  background-color: #080420;
  overflow: hidden;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;

    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      width: 90%;
      cursor: pointer;
      border-radius: 0.2rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 0 1rem;
      transition: 0.3s ease-in-out;

      .avatar img {
        height: 3rem;
      }

      .username h3 {
        color: white;
      }
    }

    .active {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .avatar img {
      height: 3.5rem;
    }

    .username h2 {
      color: white;
      font-size: 1.2rem;
    }
  }
`;
