import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../nav/Nav";
import './Login.css';

const LoginFormW = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    panier: localStorage.getItem("PANIER_LOCAL_STORAGE"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/login", formData)
      .then((response) => {
        console.log("Logged in:", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.removeItem("PANIER_LOCAL_STORAGE");
        navigate("/panier");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Nav />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Mot de passe:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-button-container">
          <button type="submit">Connexion</button>
        </div>
    </form>
  );
};

export default LoginFormW;
