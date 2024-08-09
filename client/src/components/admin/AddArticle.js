import React, { useState, useEffect } from "react";
import axios from "axios";
import "../articles/ArticleList.css";
import Panier from "../articles/Panier";
import Nav from "../nav/Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button } from "react-bootstrap";

const AddArticle = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
  });

  useEffect(() => {
    // C'est pour effectuer une requête GET vers l'API pour récupérer la liste des articles
    axios
      .get("http://localhost:8000/api/article")
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:8000/api/categorie")
      .then((response) => {
        setCategories(response.data);
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
  }, []);

  return (
    <div>
       <Nav /> 
      {/* {articles.map((article) => (
        <a key={article.id} href={`/article-details/${article.id}`} className="article-link">
          <div className="card">
            <img src={article.photo_url} alt={article.description} />
            <div className="details">
              <h3>{article.description}</h3>
              <p className="price">${article.prix}</p>
            </div>
          </div>
        </a>
      ))} */}
      <>
      {userData.admin == "ROLE_ADMIN" ? (
  <div className="mx-auto p-4 border rounded col-md-6">
    <h1>Ajoute un article</h1>
    <form
      action="http://localhost:8000/api/add"
      method="POST"
      className="mt-4"
    >
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description:
        </label>
        <input
          type="text"
          name="description"
          className="form-control"
          id="description"
          placeholder="Description"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="photo" className="form-label">
          Photo:
        </label>
        <input
          type="text"
          name="photo"
          className="form-control"
          id="photo"
          placeholder="Photo"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="photo_url" className="form-label">
          Photo URL:
        </label>
        <input
          type="text"
          name="photo_url"
          className="form-control"
          id="photo_url"
          placeholder="Photo_url"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="caracteristiques" className="form-label">
          Caractéristiques:
        </label>
        <input
          type="text"
          name="caracteristiques"
          className="form-control"
          id="caracteristiques"
          placeholder="Caractéristiques"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="prix" className="form-label">
          Prix:
        </label>
        <input
          type="text"
          name="prix"
          className="form-control"
          id="prix"
          placeholder="Prix"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="stock" className="form-label">
          Stock:
        </label>
        <input
          type="number"
          name="stock"
          className="form-control"
          id="stock"
          placeholder="Stock"
          required
        />
      
      </div>

      <div className="mb-3">
        <label htmlFor="stock" className="form-label">
          Poids:
        </label>
        <input
          type="number"
          name="poids"
          className="form-control"
          id="poids"
          placeholder="poids"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="categorie" className="form-label">
          Catégorie:
        </label>
        <select
          name="categorie"
          className="form-select"
          id="categorie"
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((categorie) => (
            <option key={categorie.id} value={categorie.id}>
              {categorie.id} - {categorie.categorie}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Ajouter
      </button>
    </form>
  </div>
) : (
  <p className="mt-4">
    Tu n'es pas admin et tu ne peux pas ajouter d'articles. 😥
  </p>
)}

      </>
    </div>
  );
};

export default AddArticle;
