import React from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

export default function Welcome() {
  const { user } = useAuth();
  return (
    <Container>
      <h1>
        Welcome, <span>{user?.username}!</span>
      </h1>
      <h3>Pick a contact from the left to start chatting.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;

  span {
    color: #4e0eff;
  }
`;
