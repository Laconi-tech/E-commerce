// ProfileComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Panier from "../articles/Panier";
import { useNavigate } from "react-router-dom";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";
import ExcelJS from 'exceljs';
import './Profil.css';

const ProfileComponent = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          console.log(token);
          const response = await axios.get(
            "http://localhost:8000/api/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUserData(response.data);
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

  const handleLogout = () => {
    // Supprimer le token du local storage
    localStorage.removeItem("token");
    navigate("/login");
    // Mettre à jour l'état pour effacer les données utilisateur
    setUserData(null);
  };

  const exportToExcel = async () => {
    try {
      const clientResponse = await axios.get("http://localhost:8000/client");
      const usersData = clientResponse.data;
      console.log(usersData);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('ProfileData');
      worksheet.addRow(['Voici les tous les clients ordonnés par le nombre de visites'])
      worksheet.addRow(['ID', 'Prénom', 'Nom' , 'Rôle', 'Adresse', 'Ville', 'Pays']);
      
      usersData.forEach(userData => {
        worksheet.addRow([userData.id, userData.prenom, userData.nom, userData.roles, userData.adresse, userData.ville, userData.pays ]);
      });
      
      worksheet.addRow(['----------------------------------------------------------------------------------']);
      worksheet.addRow(['----------------------------------------------------------------------------------']);
      
      const articleResponse = await axios.get("http://localhost:8000/api/article");
      const articles = articleResponse.data;
      worksheet.addRow(['Voici tous les articles'])
      worksheet.addRow(['ID', "Nom", "categorie", "stock", "prix", "rabais", "dateadd", "poids"]);
      articles.forEach(article => {
        
        worksheet.addRow([article.id, article.description, article.categorie, article.stock, article.prix, article.rabais, article.dateadd, article.poids]);
      });
      
      worksheet.addRow(['----------------------------------------------------------------------------------']);
      worksheet.addRow(['----------------------------------------------------------------------------------']);

      const orderResponse = await axios.get("http://localhost:8000/orders");
      const orders = orderResponse.data;
      worksheet.addRow(['Voici toutes les commandes'])
      worksheet.addRow(['N° de Commande', 'Nom', 'Prenom', 'Date', 'Prix Total', 'Pays', 'Adresse', 'Ville']);

      for (const order of orders) {
      worksheet.addRow([order.commande_id, order.nom, order.prenom, order.date, order.prix, order.pays, order.adresse, order.ville]);
      worksheet.addRow(['ID', "Nom", "Prix"]); // En-tête des articles pour cette commande

      for (const article of order.panierData) {
        worksheet.addRow([article.id_article, article.description, article.prix]);
      }

      worksheet.addRow(['----------------------------------------------------------------------------------']);
      worksheet.addRow(['----------------------------------------------------------------------------------']);
      }
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ecommerce_data.xlsx';
      a.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Nav />
      {userData ? (
        <div>
          {/* <p>{userData.id}</p> */}
          {userData.admin == "ROLE_USER" ? (
            <h3>Salut a toi {userData.prenom} tu es un utilisateur </h3>
          ) : (
            <h3>Salut a toi {userData.prenom} tu es un administrateur</h3>
          )}
          <div className="profile-buttons">
            <button onClick={handleLogout}>Se déconnecter</button>
            <button onClick={() => navigate("/Payment")}>Coordonnées bancaires</button>
            <button onClick={() => navigate("/Update")}>Modifier le profil</button>
          
      {userData.admin == "ROLE_ADMIN" ?<button onClick={exportToExcel}>Exporter données</button>: <p></p>}
      </div>

        </div>
      ) : (
        <div className="button-container">
          <button onClick={() => navigate("/register-form")}>Inscription</button>
         <button onClick={() => navigate("/login")}>Connexion</button>
        </div>
      )}
      
    </div>
  );
};

export default ProfileComponent;
