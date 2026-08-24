import React, { useState } from "react";
import styled from "styled-components";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length === 0) return;
    onSend(text);
    setText("");
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji" onClick={() => setShowPicker((v) => !v)}>
          <BsEmojiSmileFill />
          {showPicker && (
            <div className="emoji-picker-wrapper">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 1rem;

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    position: relative;

    .emoji {
      position: relative;
      cursor: pointer;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
      }
    }

    .emoji-picker-wrapper {
      position: absolute;
      bottom: 3rem;
      left: 0;
      z-index: 10;
    }
  }

  .input-container {
    width: 100%;
    display: flex;
    gap: 1rem;
    background-color: #ffffff34;
    border-radius: 2rem;
    padding: 0.3rem 1rem;

    input {
      flex: 1;
      background-color: transparent;
      color: white;
      border: none;
      padding: 0.7rem;
      font-size: 1.1rem;

      &:focus {
        outline: none;
      }
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #4e0eff;
      border: none;
      border-radius: 1rem;
      padding: 0.4rem 0.8rem;
      cursor: pointer;

      svg {
        color: white;
        font-size: 1.3rem;
      }
    }
  }
`;
