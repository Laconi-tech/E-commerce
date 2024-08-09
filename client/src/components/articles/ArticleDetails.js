import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ArticleDetails.css";
import { useNavigate } from "react-router-dom";
import Panier from "./Panier";
import Avis from "../commentaire/Comment";
import Nav from "../nav/Nav";

const ArticleDetails = () => {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const [articleDetails, setArticleDetails] = useState(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
  });
  const [articleId, setArticleId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [commentaires, setCommentaires] = useState([]);
  

  const fetchCommentaire = () => {
    axios.get(`http://localhost:8000/commentaires/${articleId}`)
     .then(response => {
       console.log(response.data);
       setCommentaires(response.data);
     })
     .catch(error => {
       console.log("failed");
     })
 };

 const handleSubmit = async (event) => {
  console.log(comment);
  console.log(articleId);
  console.log(clientId); 

  event.preventDefault();
  try {
    const response = await axios.post('http://localhost:8000/api/commentaire', {
      comment: comment,
      articleId: articleId,
      clientId: clientId,
    });
    console.log(response.data);
    fetchCommentaire();
    setComment('');
  } catch (error) {
    console.error('Erreur:', error);
  }
};


  useEffect(() => {
    axios
      .get("http://localhost:8000/api/article")
      .then((response) => {
        const article = response.data.find(
          (article) => article.id === Number(id)
        );
        setArticleDetails(article);
        setArticleId(article.id);
        fetchCommentaire();
      })
      .catch((error) => {
        console.error(error);
      });

      

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
          console.log(response.data);
          setUserData(response.data);
          setClientId(response.data.id);
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
    
  }, [id, articleId]);

  useEffect(() => {
    // ... (autre code existant)

    // Récupération du cookie "PANIER_COOKIE"
    const panierCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("PANIER_COOKIE="));

    if (panierCookie) {
      const panierId = panierCookie.split("=")[1];
      console.log("Valeur du cookie PANIER_COOKIE:", panierId);
    } else {
      console.log("Cookie PANIER_COOKIE non trouvé.");
    }

    // ... (autre code existant)
  }, []);

  

  const handleCommentChange = (event) => {
    setComment(event.target.value);
};

  const createpanier = (articleId, articlePrice, idUser) => {
    axios
      .post("http://localhost:8000/make/panier", {
        id: articleId,
        prix: articlePrice,
        id_user: idUser,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/article-listing");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!articleDetails) {
    return;
  }

  const calculatePriceWithRabais = (articleDetails) => {
    const prix = parseFloat(articleDetails.prix);
    const rabaisPct = parseFloat(articleDetails.rabais);

    if (!isNaN(prix) && !isNaN(rabaisPct)) {
      const prixAvecRabais = prix - (prix * rabaisPct) / 100;
      return prixAvecRabais.toFixed(2); // Arrondi à 2 décimales
    }

    return "N/A"; // En cas d'erreur de calcul, affiche "N/A"
  };

  return (
    <div>

      <Nav />
    <div className="article-details-container">
      <div className="article-image">
        <p>Salut a toi {userData.prenom}</p>
        {/* <p className="stock">
          Nombre de consultation: {articleDetails.consultation}
        </p> */}
        <h2>{articleDetails.categorie}</h2>
        <img src={articleDetails.photo_url} alt={articleDetails.description} />
        
      </div>
      <div className="payment-details">
        <h3>{articleDetails.description}</h3>
        <h4>A propos de cet article</h4>
        <p>{articleDetails.caracteristiques}</p>

        {articleDetails.rabais > 0 ? (
          <div>
            <p>
              <span className="price1">${articleDetails.prix}</span>
              <span className="rabais"> -{articleDetails.rabais}%</span>
            </p>
            <p className="price">${calculatePriceWithRabais(articleDetails)}</p>
          </div>
        ) : (
          <p className="price">${articleDetails.prix}</p>
        )}
        {articleDetails.stock !== 0 ? (
          <div>
            <p className="stock">Stock: {articleDetails.stock}</p>
            <button className="buy-button">Buy Now</button>
            <button
              className="panier-button"
              onClick={() =>
                createpanier(
                  articleDetails.id,
                  articleDetails.prix,
                  userData.id
                )
              }
            >
              Ajouter au panier
            </button>
          </div>
        ) : (
          <div>
            <p classname="rupture">Rupture de stock</p>
            <button className="buy-button-rupture" disabled>
              Rupture
            </button>
          </div>
          
        )}
    <div className="comment-box">
            <h3>Voici les commentaires</h3>
              {commentaires.length === 0 ? (
              <p>Aucun commentaire. Soyez le premier à donner votre avis !</p>
              ) : (
                commentaires.map((commentaire, index) => (
                <div key={index} className="comment">
             <p>{commentaire.prenom} {commentaire.nom} : {commentaire.commentaire}</p>
            </div>
          ))
        )}
    </div>
        {userData.id !== null &&
        <div className="comment-form">
                  <form onSubmit={handleSubmit}>
                    <textarea
                      placeholder='Donne moi ton avis sur le produit'
                      value={comment}
                      onChange={handleCommentChange}
                    ></textarea>
                    <br />
                    <button type='submit'>Envoyer</button>
                  </form>
                </div>
        }
            
      </div>
    </div>
    </div>
  );
};

export default ArticleDetails;
