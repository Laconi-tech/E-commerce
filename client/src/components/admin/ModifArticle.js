import React, { useState, useEffect } from "react";
import axios from "axios";
import "../articles/ArticleDetails.css";
import Panier from "../articles/Panier";
import Nav from "../nav/Nav";

const ModifArticle = () => {
  const [articles, setArticles] = useState([]);
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
  });
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/article")
      .then((response) => {
        setArticles(response.data);
        setFilteredArticles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:8000/api/categorie")
      .then((response) => {
        setCategoriesData(response.data);
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
  }, []);

  const consultation = (articleId, articleConsul) => {
    axios
      .post(`http://localhost:8000/api/article/${articleId}`, {
        consultation: articleConsul,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // const handleArticleClick = (articleId, articleConsultation) => {
  //   consultation(articleId, articleConsultation + 1);
  // };

  const deleteadmin = (articleId) => {
    axios
      .post(`http://localhost:8000/api/modif/${articleId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const DeleteArticleClick = (articleId) => {
    deleteadmin(articleId);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filterArticles = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      const normalizedSearchInput = searchInput.toLowerCase();
      const tmp = articles.filter(
        (article) =>
          article.description.toLowerCase().includes(normalizedSearchInput) && // Utilise "includes" au lieu de "startsWith"
          (!selectedCategory ||
            article.categorie.toLowerCase() === selectedCategory.toLowerCase())
      );
      setFilteredArticles(tmp);
    }
  };

  const handleFilterButtonClick = () => {
    const normalizedSearchInput = searchInput.toLowerCase();
    const tmp = articles.filter(
      (article) =>
        article.description.toLowerCase().includes(normalizedSearchInput) && // Utilise "includes" au lieu de "startsWith"
        (!selectedCategory ||
          article.categorie.toLowerCase() === selectedCategory.toLowerCase())
    );
    setFilteredArticles(tmp);
  };

  return (
    <div>
      <Nav />
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categoriesData.map((category) => (
            <option key={category.id} value={category.categorie}>
              {category.categorie}
            </option>
          ))}
        </select>
        <input
          type="text"
          id="searchBar"
          name="searchBar"
          onChange={(e) => handleInputChange(e)}
          onKeyUp={filterArticles}
        />
        <button onClick={handleFilterButtonClick}>Search</button>
      </div>
      <div style={{ width: "300px" }}>
        {filteredArticles.map((article) => (
          <div className="card">
            <img src={article.photo_url} alt={article.description} />
            <div className="details">
              <h3>{article.description}</h3>
              <p className="price">${article.prix}</p>
              <p className="category">{article.categorie}</p>

              <button>
                <a
                  key={article.id}
                  href={`/modif-article-details/${article.id}`}
                  className="article-link"
                  onClick={() => consultation(article.id, article.consultation)}
                >
                  Modifier
                </a>
              </button>

              <button onClick={() => DeleteArticleClick(article.id)}>
                Supprimer
              </button>

              {/* <form ></form> */}
              {/* {article.stock} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModifArticle;
