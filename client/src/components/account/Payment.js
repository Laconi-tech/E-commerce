import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Nav from "../nav/Nav";

const PaymentForm = () => {
  const [clientID, setClientID] = useState("");
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [type, setType] = useState("");
  const [numeroCarte, setNumeroCarte] = useState("");
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
    id_pays: null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/update/moyen", {
        client_id: clientID,
        nom: nom,
        type: type,
        NumeroCarte: numeroCarte,
      });

      console.log("Données insérées avec succès:", response.data);
      navigate("/profil");
    } catch (error) {
      console.error("Erreur lors de l'insertion des données:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    // Effect to fetch payment data when clientID changes
    if (clientID !== null) {
      fetchPaymentData();
    }
  }, [clientID]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.get("http://localhost:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Récupérer l'ID client depuis la réponse et le stocker dans le state
        if (response.data && response.data) {
          setClientID(response.data.id);
        }

        setUserData(response.data);
      } else {
        console.log("Aucun token trouvé.");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur :",
        error
      );
    }
  };

  const fetchPaymentData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/moyen/${clientID}`
      );
      console.log(response.data);
      setNom(response.data[0].nom);
      setType(response.data[0].type);
      setNumeroCarte(response.data[0].numerocarte);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de paiement :",
        error
      );
    }
  };

  return (
    <div>
      <Nav />
      <h2>Formulaire d'Insertion</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="number"
            value={clientID}
            onChange={(e) => setClientID(e.target.value)}
            hidden
          />
        </label>
        <br />
        <label>
          Nom:
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </label>
        <br />
        <label>
          Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </label>
        <br />
        <label>
          Numéro de Carte:
          <input
            type="text"
            value={numeroCarte}
            onChange={(e) => setNumeroCarte(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Insérer</button>
      </form>
    </div>
  );
};

export default PaymentForm;
