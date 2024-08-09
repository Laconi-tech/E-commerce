import React, { useState } from "react";
import axios from "axios";
import Nav from "../nav/Nav";
import bcrypt from "bcryptjs";

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

    // Prépare les données à envoyer
    const requestData = {
      ...formData,
      password: hashedPassword,
    };

    axios
      .post("http://localhost:8000/api/register", requestData)
      .then((response) => {
        console.log(response.data);
        // Faire quelque chose après l'inscription réussie, comme rediriger l'utilisateur
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
        <div>
          <label>Nom:</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Prénom:</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Adresse:</label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ville:</label>
          <input
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Inscription</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
