import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../nav/Nav";
import Slider from "../carousel/Slider";
import Footer from "../footer/Footer";

const PopularArticle = () => {
  const [articles, setArticles] = useState([]);
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
  });
  const [rabaisPct, setRabaisPct] = useState("");


  function calculatePriceWithRabais(article) {
    const prix = parseFloat(article.prix);
    const rabaisPct = parseFloat(article.rabais);

    if (!isNaN(prix) && !isNaN(rabaisPct)) {
      const prixAvecRabais = prix - (prix * rabaisPct) / 100;
      return prixAvecRabais.toFixed(2); // Arrondi à 2 décimales
    }

    return "N/A"; // En cas d'erreur de calcul, affiche "N/A"
  }

  const consultation = (articleId) => {
    axios
      .post(`http://localhost:8000/consultation`, {
        id : articleId
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


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

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/populararticle")
      .then((response) => {
        setArticles(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetchUserData();
  }, []); 

  return (
    <div>
      <Nav />
      <div className="carousel">
        <Slider />
      </div>

      <ol className="articles-list">
        {articles.map((article) => (
          <li key={article.id} className="article-item">
            <a href={`/article-details/${article.id}`} className="article-link"
            onClick={() => consultation(article.id)}
            >
              <div className="card">
                <img src={article.photo_url} alt={article.photo} />
                <div className="details">
                  <h3>{article.description}</h3>
                  {article.rabais > 0 ? (
                    <p className="price">
                      ${calculatePriceWithRabais(article)}
                      <span className="pricebarre">${article.prix}</span>
                    </p>
                  ) : (
                    <p className="price">${article.prix}</p>
                )}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ol>
      <Footer />
    </div>
  );
};

export default PopularArticle;
