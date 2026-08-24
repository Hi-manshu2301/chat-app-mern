import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const AVATAR_STYLES = ["adventurer", "bottts", "pixel-art", "thumbs"];

export default function SetAvatar() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [avatars, setAvatars] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const toastOptions = { position: "bottom-right", autoClose: 5000, theme: "dark" };

  useEffect(() => {
    const seeds = Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 10));
    const urls = seeds.map(
      (seed, i) =>
        `https://api.dicebear.com/7.x/${AVATAR_STYLES[i % AVATAR_STYLES.length]}/svg?seed=${seed}`
    );
    setAvatars(urls);
    setLoading(false);
  }, []);

  const handleConfirm = async () => {
    if (selected === null) {
      toast.error("Pick an avatar first", toastOptions);
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post("/auth/set-avatar", {
        avatarImage: avatars[selected],
      });
      updateUser({ ...user, isAvatarSet: data.isSet, avatarImage: data.image });
      navigate("/chat");
    } catch (err) {
      toast.error("Failed to set avatar, try again", toastOptions);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <span>Loading avatars...</span>
      </Container>
    );
  }

  return (
    <Container>
      <div className="title-container">
        <h1>Pick an avatar</h1>
      </div>
      <div className="avatars">
        {avatars.map((url, index) => (
          <div
            key={url}
            className={`avatar ${selected === index ? "selected" : ""}`}
            onClick={() => setSelected(index)}
          >
            <img src={url} alt={`avatar-${index}`} />
          </div>
        ))}
      </div>
      <button className="submit-btn" onClick={handleConfirm} disabled={saving}>
        {saving ? "Saving..." : "Set as Profile Picture"}
      </button>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .title-container h1 {
    color: white;
  }

  .avatars {
    display: flex;
    gap: 2rem;
  }

  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4rem;
    border-radius: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }

  .avatar img {
    height: 6rem;
    background-color: #ffffff35;
    border-radius: 50%;
  }

  .selected {
    border: 0.4rem solid #4e0eff;
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #4e0eff90;
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  span {
    color: white;
  }
`;
