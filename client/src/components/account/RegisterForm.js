import React, { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import Nav from "../nav/Nav";

const countries = {
  1: "Etats-Unis",
  2: "Chine",
  3: "Inde",
  4: "Brésil",
  5: "Russie",
  6: "Japon",
  7: "Allemagne",
  8: "France",
  9: "Royaume-Uni",
  10: "Italie",
};

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    adresse: "",
    ville: "",
    is_admin: false,
    id_pays: 8,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const requestData = {
      ...formData,
      password: hashedPassword,
    };

    axios
      .post("http://localhost:8000/api/register", requestData)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.removeItem("PANIER_LOCAL_STORAGE");
        navigate("/profil");
      })
      .catch((error) => {
        console.error(formData);
      });
  };

  return (
    <div> <Nav />
    <div className="container mt-5">
      <div className="card p-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2 className="text-center mb-4">Formulaire d'Inscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
              id="email"
              required
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mot de passe:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-control"
              id="password"
              required
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="nom" className="form-label">
              Nom:
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              className="form-control"
              id="nom"
              required
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="prenom" className="form-label">
              Prénom:
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              className="form-control"
              id="prenom"
              required
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="adresse" className="form-label">
              Adresse:
            </label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              className="form-control"
              id="adresse"
              required
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="ville" className="form-label">
              Ville:
            </label>
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleInputChange}
              className="form-control"
              id="ville"
              required
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="pays" className="form-label">
              Pays:
            </label>
            <select
              name="id_pays"
              value={formData.id_pays}
              onChange={handleInputChange}
              className="form-select"
              id="pays"
            >
              {Object.entries(countries).map(([id, country]) => (
                <option key={id} value={id}>
                  {country}
                </option>
              ))}
            </select>
          </div>
  
          {/*
          <div className="mb-3">
            <label htmlFor="isAdmin" className="form-check-label">
              Admin:
            </label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleInputChange}
              className="form-check-input"
              id="isAdmin"
            />
          </div>
          */}
  
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
  
};

export default RegistrationForm;
