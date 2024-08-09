import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Panier.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import shop from "./shop.svg";
import Nav from "../nav/Nav";

const Panier = () => {
  const [panierItems, setPanierItems] = useState([]);
  const navigate = useNavigate();
  const [isPanierHovered, setIsPanierHovered] = useState(false);
  // const [totalPrice, setTotalPrice] = useState(0);
  const [panier, setPanier] = useState(null);
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
  });

  const totalPrice = panierItems.reduce(
    (total, panierItem) => total + panierItem.prix,
    0
  );

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchPanierItems();
  }, [userData.id]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.get("http://localhost:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  const suppression = (panierItemId, panierItemPrix, panierId, userDataId) => {
    axios
      .post("http://localhost:8000/cart/item", {
        id: panierItemId,
        prix: panierItemPrix,
        id_panier: panierId,
        id_client: userDataId,
      })
      .then((response) => {
        console.log(response.data);
        fetchPanierItems();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const calculatePriceWithRabais = (panierItems) => {
    const prix = parseFloat(panierItems.prix);
    const rabaisPct = parseFloat(panierItems.rabais);

    if (!isNaN(prix) && !isNaN(rabaisPct)) {
      const prixAvecRabais = prix - (prix * rabaisPct) / 100;
      return prixAvecRabais.toFixed(2);
    }

    return "N/A";
  };

  const calculateTotalPriceWithRabais = (panierItems) => {
    const totalPrixAvecRabais = panierItems.reduce((total, panierItem) => {
      const prix = parseFloat(panierItem.prix);
      const rabaisPct = parseFloat(panierItem.rabais);
      const prixAvecRabais =
        isNaN(prix) || isNaN(rabaisPct) ? 0 : prix - (prix * rabaisPct) / 100;
      return total + prixAvecRabais;
    }, 0);

    return totalPrixAvecRabais.toFixed(2);
  };

  const fetchPanierItems = () => {
    const token = localStorage.getItem("token");
    const cookie = localStorage.getItem("PANIER_LOCAL_STORAGE");
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .get(`http://localhost:8000/panier/${userData.id}`, config)
        .then((response) => {
          setPanierItems(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (cookie) {
      axios
        .get(`http://localhost:8000/panique/${cookie}`)
        .then((response) => {
          setPanierItems(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const createNewPanier = () => {
    axios
      .post("http://localhost:8000/noconnect")
      .then((response) => {
        console.log(response.data);
        const cartId = response.data.cartId;
        localStorage.setItem("PANIER_LOCAL_STORAGE", cartId);
        console.log("Local Storage:", localStorage);
        navigate("/article-listing");
      })

      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {/* <Nav /> */}
      <div className="sac">
        {userData.id !== null ||
        localStorage.getItem("PANIER_LOCAL_STORAGE") ? (
          <DropdownButton
            title={
              <span>
                <FontAwesomeIcon />
                <img src={shop} alt="Icône du panier" height={30} />(
                {panierItems.length})
              </span>
            }
            variant="success"
            id="dropdown-panier"
            onMouseEnter={() => setIsPanierHovered(true)} // Gérer le survol
            onMouseLeave={() => setIsPanierHovered(false)} // Gérer la sortie du survol
            show={isPanierHovered}
          >
            {panierItems &&
              panierItems.map((panierItem) => (
                <Dropdown.Item
                  key={panierItem.id_article}
                  className="custom-dropdown-item1"
                >
                  <div className="item-content">
                    <img
                      src={panierItem.photo_url}
                      alt={panierItem.description}
                      className="item-image"
                    />
                    <div className="item-info">
                      <h3
                        className="item-title"
                        onClick={() =>
                          navigate(`/article-details/${panierItem.id_article}`)
                        }
                      >
                        {panierItem.description}
                      </h3>
                      {panierItem.rabais > 0 ? (
                        <div>
                          <h3 className="item-price">
                            ${calculatePriceWithRabais(panierItem)}{" "}
                            <span className="barre">${panierItem.prix}</span>
                          </h3>
                        </div>
                      ) : (
                        <h3 className="item-price">${panierItem.prix}</h3>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        suppression(
                          panierItem.id,
                          panierItem.prix,
                          panierItem.id_panier,
                          userData.id
                        )
                      }
                      className="delete-button"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </Dropdown.Item>
              ))}
            <Dropdown.Divider />
            <Dropdown.ItemText className="prix">
              Prix total: ${calculateTotalPriceWithRabais(panierItems)}
              <button onClick={() => navigate("/panier")}>
                Voir sur la page
              </button>
            </Dropdown.ItemText>
          </DropdownButton>
        ) : (
          <button className="success" onClick={createNewPanier}>
            Créer un panier
          </button>
        )}
      </div>
    </div>
  );
};

export default Panier;
