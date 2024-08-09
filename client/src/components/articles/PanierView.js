import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Panier.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Nav from "../nav/Nav";

const PanierView = () => {
  const [panierItems, setPanierItems] = useState([]);
  const navigate = useNavigate();
  const [isPanierHovered, setIsPanierHovered] = useState(false);
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [isUserConnected, setIsUserConnected] = useState(false);
  // const [totalPrice, setTotalPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
    id_pays: null,
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
        })
        .catch((error) => {
          console.error(userData.id);
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

  const makeOrder = () => {
    navigate("/payment2");
    // if(idClient === null){
    //     console.log("inscrit toi d'abord");
    // }

    // else{
    // axios.post("http://localhost:8000/make/commande", {id_client : idClient, prix: prixtotal, id_pays: idPays, ville: ville, adresse: adresse})
    //     .then(response => {
    //         console.log(response.data);
    //         navigate("/article-listing")
    //     })

    //     .catch(error => {
    //         console.error(error);
    //     })
    // }
  };

  console.log(totalPrice);
  let popup = <p>eeeeee</p>;
  const token = localStorage.getItem("token");
  if (totalPrice > 100 && token == null) {
    popup = (
      <div className="popup">
        <p>
          Tu ne peux pas passer de commande supérieur à 100 € sans être
          connecté. Inscris-toi ou connecte-toi pour passer commande.
        </p>
        <button onClick={() => navigate("/register-form2")}>Inscris-toi</button>
        <button onClick={() => navigate("/login2")}>Connecte toi</button>
        <button onClick={() => setShowPopup(false)}>Fermer</button>
      </div>
    );
  } else {
    popup = (
      <div className="popup">
        <p>
          Tu n'es pas connecté. Inscris-toi ou connecte-toi pour passer
          commande.
        </p>
        <button onClick={() => navigate("/register-form2")}>Inscris-toi</button>
        <button onClick={() => navigate("/login2")}>Connecte toi</button>
        <button onClick={() => navigate("/Payment2")}>Paye directement</button>
        <button onClick={() => setShowPopup(false)}>Fermer</button>
      </div>
    );
  }

  let testo = <p>testoooooooo !!!!!</p>;

  return (
    <div>
      <Nav />
      <div className="sac1">
        <h3>Salut a toi {userData.prenom} voici ton panier</h3>
        {panierItems &&
          panierItems.map((panierItem) => (
            <div key={panierItem.id_article} className="custom-dropdown-item">
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
            </div>
          ))}
        <div className="prix">
          Prix total: ${calculateTotalPriceWithRabais(panierItems)}
        </div>
        {/* <input type="text" placeholder="Quelle est ton adresse" value={adresse} onChange={(event) => {
                setAdresse(event.target.value)
            }}></input>
            <input type="text" placeholder="Dans quelle ville habite tu" value={ville} onChange={(event) => {
                setVille(event.target.value)
            }}></input> */}
        <button
          onClick={() => {
            if (userData.id === null) {
              setShowPopup(true); // Afficher le popup si l'utilisateur n'est pas connecté
            } else {
              makeOrder(
                userData.id,
                calculateTotalPriceWithRabais(panierItems),
                userData.id_pays
              );
            }
          }}
        >
          Valider la commande
        </button>

        {showPopup &&
          // <div className="popup">
          // <p>Tu n'es pas connecté. Inscris-toi ou connecte-toi pour passer commande.</p>
          // <button onClick={() => navigate("/register-form2")}>Inscris-toi</button>
          // <button onClick={() => navigate("/login2")}>Connecte toi</button>
          // <button onClick={() => navigate("/Payment2")}>Paye directement</button>
          // <button onClick={() => setShowPopup(false)}>Fermer</button>
          // </div>
          popup}
      </div>
    </div>
  );
};

export default PanierView;
