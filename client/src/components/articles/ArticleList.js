import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ArticleList.css";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";
import Panier from "./Panier";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoriesData, setCategoriesData] = useState([]);
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
  });
  const [panier, setPanier] = useState([]);
  const navigate = useNavigate();
  const [rabaisPct, setRabaisPct] = useState("");

  const fetchitems = () => {
    axios
      .get("http://localhost:8000/api/article")
      .then((response) => {
        setArticles(response.data);
        setFilteredArticles(response.data);

      })
      .catch((error) => {
        console.error(error);
      });
  };


  useEffect(() => {
    fetchitems();
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
        console.log("All Cookies:", document.cookie);
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
        console.log("Erreur lors de la récupération des données utilisateur");
      }
    };
    fetchUserData();

    const cartId = localStorage.getItem("PANIER_LOCAL_STORAGE");
    if (cartId) {
      console.log("Cart ID from Local Storage:", cartId);
    } else {
      console.log("No cart ID found in Local Storage.");
    }
  }, []);


  
  const filterByCategory = () => {
    const normalizedSearchInput = searchInput.toLowerCase();
    const tmp = articles.filter(
      (article) =>
        article.description.toLowerCase().includes(normalizedSearchInput) &&
        (!selectedCategory ||
          article.categorie.toLowerCase() === selectedCategory.toLowerCase())
    );
    setFilteredArticles(tmp);
  };

  useEffect(() => {
    // Fonction de filtrage qui s'exécute lorsque la catégorie sélectionnée change
    filterByCategory(); // Appel initial de la fonction de filtrage
  }, [selectedCategory, searchInput, articles]);

  // Nouveau useEffect pour gérer la recherche en temps réel
  useEffect(() => {
    const timer = setTimeout(() => {
      filterByCategory();
    }, 300); // Délai de 300 ms pour éviter une recherche excessive

    return () => clearTimeout(timer);
  }, [searchInput, selectedCategory]);

  const consultation = (articleId, articleConsul) => {
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

  const test = () => {
    console.log(userData);
    if (userData.id == "null") {
      alert("Tu es bien connecté bg");
    } else {
      alert("Connecte toi frerot");
    }
  };

  // const handleArticleClick = (articleId, articleConsultation) => {
  //   consultation(articleId, articleConsultation + 1);
  // };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
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

  const handleLogout = () => {
    // Supprimer le token du local storage
    localStorage.removeItem("token");
    navigate("/login");

    // Mettre à jour l'état pour effacer les données utilisateur
    setUserData(null);
  };

  const recommander = (articleId) => {
    axios
      .post(`http://localhost:8000/recommander`, { id: articleId })
      .then((response) => {
        console.log(response.data);
        fetchitems();
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const rabais = (articleId) => {
    axios
    .post("http://localhost:8000/update/rabais", {
    id: articleId,
    rabais: rabaisPct,
  })
  .then((response) => {
    console.log(response.data);
    fetchitems();
  })
  .catch((error) => {
    console.log(error);
  });
  };

  function calculatePriceWithRabais(article) {
    const prix = parseFloat(article.prix);
    const rabaisPct = parseFloat(article.rabais);

    if (!isNaN(prix) && !isNaN(rabaisPct)) {
      const prixAvecRabais = prix - (prix * rabaisPct) / 100;
      return prixAvecRabais.toFixed(2); // Arrondi à 2 décimales
    }

    return "N/A"; // En cas d'erreur de calcul, affiche "N/A"
  }

  return (
    <div>
      <Nav />
      <div className="article-container">
        <h3>Voici la liste des articles:</h3>
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
        />
        <button onClick={handleFilterButtonClick}>Search</button>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Description</th>
              <th>Prix</th>
              <th>Prix avec Rabais</th>
              <th>Consultation</th>
              <th>Catégorie</th>
              <th>Stock</th>
              <th>Recommander</th>
              <th>Rabais</th>
              <th>Date d'ajout</th>
              <th>Modif</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id}>
                <td onClick={() => navigate(`/article-details/${article.id}`)}>
                  {article.description}
                </td>
                <td>${article.prix}</td>
                <td>${calculatePriceWithRabais(article)}</td>
                <td>{article.consultation}</td>
                <td>{article.categorie}</td>
                <td>{article.stock}</td>
                <td>
                  <button onClick={() => recommander(article.id)}>
                    Recommander du stock
                  </button>
                </td>
                <td>
                  {article.rabais}
                  <input
                    type="number"
                    min="10"
                    max="100"
                    onChange={(event) => {
                      setRabaisPct(event.target.value);
                    }}
                  ></input>
                  <button onClick={() => rabais(article.id)}>MAJ</button>
                </td>
                <td>{article.dateadd.date}</td>
                <td>
                  <button onClick={() => navigate(`/modif-article-details/${article.id}`)}>Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default ArticleList;
