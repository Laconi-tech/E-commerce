import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../nav/Nav";
import Panier from "../articles/Panier";

function ModifyCategories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
  });
  useEffect(() => {
    fetchCategories();

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

  const fetchCategories = () => {
    fetch("http://localhost:8000/show_categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      );
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!categoryName.trim()) {
      console.error("Le nom de la catégorie ne peut pas être vide.");
      return;
    }

    fetch("http://localhost:8000/add_category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
          setCategoryName("");
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la requête d'ajout de catégorie :",
          error
        );
      });
  };

  const handleDeleteCategory = (categoryId) => {
    fetch(`http://localhost:8000/delete_category/${categoryId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la requête de suppression de catégorie :",
          error
        );
      });
  };

  return (
    <div>
      <Nav />
    <div className="container mt-4">
      
      <h1 className="mb-4">Liste des catégories</h1>
      
      <table className="table">
        <thead>
          <tr>
            <th>Catégorie</th>
            {userData.admin == "ROLE_ADMIN" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={userData.admin == "ROLE_ADMIN" ? 2 : 1}>
                Aucune catégorie disponible.
              </td>
            </tr>
          ) : (
            categories.map((categorie) => (
              <tr key={categorie.id}>
                <td>{categorie.categorie}</td>
                {userData.admin == "ROLE_ADMIN" && (
                  <td>
                    <button
                      onClick={() => handleDeleteCategory(categorie.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {userData.admin == "ROLE_ADMIN" && (
        <div className="mt-4">
          <h2>Ajouter une nouvelle catégorie</h2>
          <form
            action="http://localhost:8000/add_category"
            method="post"
            className="mb-4"
          >
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">
                Nom de la catégorie :
              </label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                className="form-control"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Ajouter
            </button>
          </form>
        </div>
      )}
    </div>
    </div>
  );

}

export default ModifyCategories;
