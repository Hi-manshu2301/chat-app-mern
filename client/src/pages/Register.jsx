import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const toastOptions = { position: "bottom-right", autoClose: 5000, theme: "dark" };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match", toastOptions);
      return false;
    }
    if (form.username.length < 3) {
      toast.error("Username must be at least 3 characters", toastOptions);
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(data.user, data.token);
      navigate("/set-avatar");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed", toastOptions);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <div className="brand">
          <h1>Pulse Chat</h1>
        </div>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Create User"}
        </button>
        <span>
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </FormContainer>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;

  .brand h1 {
    color: white;
    text-transform: uppercase;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
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

  span a {
    color: #4e0eff;
    text-decoration: none;
    font-weight: bold;
  }
  span {
    color: white;
  }
`;
