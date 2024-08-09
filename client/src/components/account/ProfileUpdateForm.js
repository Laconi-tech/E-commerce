import React, { useState, useEffect } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import Nav from "../nav/Nav";
import "./update.css"

const ProfileUpdateForm = ({ clientId }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    adresse: "",
    ville: "",
    // Ajoutez d'autres champs de formulaire ici selon vos besoins
  });
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
    id_pays: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          console.log(token);
          const response = await axios.get(
            "https://localhost:8000/api/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUserData(response.data);
          setFormData(response.data);
          console.log(response.data);
        } else {
          console.log("Aucun token trouvé.");
        }
      } catch (error) {
        console.log("Erreur lors de la récupération des données utilisateur");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const requestData = {
      id: userData.id,
      email: formData.email,
      password: hashedPassword,
      nom: formData.nom,
      prenom: formData.prenom,
      adresse: formData.adresse,
      ville: formData.ville,
      // Ajoutez d'autres champs de formulaire ici selon vos besoins
    };

    axios
      .post("https://localhost:8000/api/update", requestData)
      .then((response) => {
        console.log(response.data);
        // Gérez la réponse en conséquence (par exemple, affichez un message de succès)
        navigate("/profil"); // Redirigez l'utilisateur vers la page de profil après la mise à jour
      })
      .catch((error) => {
        console.error(error);
        // Gérez les erreurs en conséquence
      });
  };

  useEffect(() => {
    console.log(userData.id);
    // Récupérez les données du profil existant et pré-remplissez le formulaire
    axios
      .get(`https://localhost:8000/api/profile/`)
      .then((response) => {
        const userData = response.data;
        setFormData({
          email: userData.email,
          nom: userData.nom,
          prenom: userData.prenom,
          adresse: userData.adresse,
          ville: userData.ville,

        });
        console.log(userData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userData.id]);

  return (
    <div>
      <Nav />
      <h2>Formulaire de Mise à Jour de Profil</h2>
      <form className="profile-update-form" onSubmit={handleUpdate}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <label>Mot de passe:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />

        <label>Nom:</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
        />

        <label>Prénom:</label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleInputChange}
        />

        <label>Adresse:</label>
        <input
          type="text"
          name="adresse"
          value={formData.adresse}
          onChange={handleInputChange}
        />

        <label>Ville:</label>
        <input
          type="text"
          name="ville"
          value={formData.ville}
          onChange={handleInputChange}
        />

        <button type="submit">Mettre à jour le profil</button>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
