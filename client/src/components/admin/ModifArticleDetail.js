import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer"
import "../articles/ArticleDetails.css";
import Panier from "../articles/Panier";

const ModifArticleDetails = () => {
  const { id } = useParams();
  const [articleDetails, setArticleDetails] = useState(null);
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/article")
      .then((response) => {
        const article = response.data.find(
          (article) => article.id === Number(id)
        );
        setArticleDetails(article);
      })
      .catch((error) => {
        console.error(error);
      });
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const response = await axios.get(
            "http://localhost:8000/api/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
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

    fetchUserData();
  }, [id]);

  if (!articleDetails) {
    return;
  }

  return (
    <>
    <Nav />
      <div className="article-details-container">
        <div className="article-image">
          <img
            src={articleDetails.photo_url}
            alt={articleDetails.description}
          />
        </div>
        <div className="payment-details">
          <h3>{articleDetails.description}</h3>
          <h4>A propos de cet article</h4>
          <p>{articleDetails.caracteristiques}</p>
          <p className="price">${articleDetails.prix}</p>
          <p className="stock">Stock: {articleDetails.stock}</p>
          <button className="buy-button">Buy Now</button>
        </div>
      </div>

      <div>
        <form action="http://localhost:8000/api/modif" method="POST">
          <label for="name">id: </label>
          <input
            type="text"
            name="id"
            placeholder="id"
            value={articleDetails.id}
            disable
          />
          <br></br>
          <label for="name">Description: </label>
          <input type="text" name="description" placeholder="Description" />
          <br></br>
          <label for="name">Photo: </label>
          <input type="text" name="photo" placeholder="Photo" />
          <br></br>
          <label for="name">Photo_url: </label>
          <input type="text" name="photo_url" placeholder="Photo_url" />
          <br></br>
          <label for="name">Caractéristiques: </label>
          <input
            type="text"
            name="caracteristiques"
            placeholder="Caractéristiques"
          />
          <br></br>
          <label for="name">Prix: </label>
          <input type="number" name="prix" placeholder="Prix" />
          <br></br>
          <label for="name">Stock: </label>
          <input type="number" name="stock" placeholder="Stock" />
          <br></br>
          <label for="name">Catégorie: </label>
          <input type="text" name="categorie" placeholder="Catégorie" />
          <br></br>
          <label for="name">
            Tapez "supprimer" pour retirer l'article de la vente:{" "}
          </label>
          <input type="text" name="supprimer" placeholder="supprimer" />
          <br></br>
          <input type="submit" value="Submit"></input>
        </form>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default ModifArticleDetails;
