import React, { useState } from "react";
import axios from "axios";
import Nav from "../nav/Nav";
import { useNavigate } from "react-router-dom";
import './Login.css';

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/login", formData)
      .then((response) => {
        console.log("Logged in:", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.removeItem("PANIER_LOCAL_STORAGE");
        navigate("/profil");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Nav />
      <form onSubmit={handleSubmit}>
        <div>
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
    </div>
  );
};

export default LoginForm;
