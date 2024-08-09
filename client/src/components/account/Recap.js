import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Nav from "../nav/Nav";

const Recap = () => {
  const [panierItems, setPanierItems] = useState([]);
  const navigate = useNavigate();
  const [isPanierHovered, setIsPanierHovered] = useState(false);
  const [isUserConnected, setIsUserConnected] = useState(false);
  // const [totalPrice, setTotalPrice] = useState(0);
  const [nom, setNom] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    admin: [],
    id: null,
    id_pays: null,
    adresse: adresse,
    ville: ville,
  });
  const [paysList, setPaysList] = useState([]);
  const [prixFrais, setPrixFrais] = useState(0);
  const [fraisDePort, setFraisDePort] = useState(0);
  const [livraisonCost, setLivraisonCost] = useState(0);
  const [livraisonOption, setLivraisonOption] = useState("");
  const [moyen, setMoyen] = useState([]);
  const [panier, setPanier] = useState([]);
  const [formData, setFormData] = useState({
    id_pays: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const totalPrice = panierItems.reduce(
    (total, panierItem) => total + panierItem.prix,
    0
  );
  const totalPoids = panierItems.reduce(
    (total, panierItem) => total + panierItem.poids,
    0
  );

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchPanierItems();
  }, [userData.id]);

  const fetchUserData = async () => {
    const paysListResponse = await axios.get("http://localhost:8000/api/pays");
    console.log(paysListResponse.data);
    setPaysList(paysListResponse.data);
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.get("http://localhost:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        console.log(response.data);
        setVille(response.data.ville);
        setAdresse(response.data.adresse);
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
    const moyen = localStorage.getItem("MOYEN");

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

      axios
        .get(`http://localhost:8000/moyen/${userData.id}`)
        .then((response) => {
          console.log(response.data);
          setNom(response.data[0].nom);
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
          setPanier(cookie);
          console.log(cookie);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (moyen) {
      axios
        .get(`http://localhost:8000/moyenNoco/${moyen}`)
        .then((response) => {
          console.log(response.data);
          setNom(response.data[0].nom);
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

  const makeOrder = (idClient, prixtotal, idPays) => {
    if (idClient === null) {
      axios
        .post("http://localhost:8000/order/noco", {
          id_client: null,
          prix: prixtotal,
          id_pays: idPays,
          ville: ville,
          adresse: adresse,
          panier: panier,
        })
        .then((response) => {
          console.log(response.data);
          navigate("/article-listing");
          localStorage.removeItem("MOYEN");
          localStorage.removeItem("PANIER_LOCAL_STORAGE");
        })

        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post("http://localhost:8000/make/commande", {
          id_client: idClient,
          prix: prixtotal,
          id_pays: idPays,
          ville: ville,
          adresse: adresse,
        })
        .then((response) => {
          console.log(response.data);
          navigate("/article-listing");
        })

        .catch((error) => {
          console.error(error);
        });
    }
  };

  const calculateLivraisonCost = (poids) => {
    if (poids <= 0.25) return 4.95;
    if (poids <= 0.5) return 6.7;
    if (poids <= 0.75) return 7.6;
    if (poids <= 1) return 8.25;
    if (poids <= 2) return 9.55;
    if (poids <= 5) return 14.65;
    if (poids <= 10) return 21.3;
    if (poids <= 15) return 26.95;

    const remainingWeight = poids - 15;
    const additionalKg = Math.ceil(remainingWeight);

    const costPerAdditionalKg = 6.45;

    const totalCost = 26.95 + additionalKg * costPerAdditionalKg;

    return totalCost;
  };

  const handleChangePays = (selectedPaysId) => {
    if (selectedPaysId === "") {
      setFraisDePort(0);
      setPrixFrais(0);
    } else {
      axios
        .get(`http://localhost:8000/api/pays/${selectedPaysId}`)
        .then((response) => {
          setFraisDePort(response.data[0].frais);
          const poidsEnKg = totalPoids / 1000;
          const Frais = calculateLivraisonCost(poidsEnKg);
          setPrixFrais(Frais);
          console.log(response.data[0].id);
          setFormData((prevFormData) => ({
            ...prevFormData,
            id_pays: response.data[0].id,
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setUserData((prevUserData) => ({
      ...prevUserData,
      id_pays: selectedPaysId,
    }));
  };

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
              {/* <button onClick={() => suppression(panierItem.id, panierItem.prix, panierItem.id_panier, userData.id)} className="delete-button">
                                <i className="fas fa-trash"></i>
                            </button> */}
            </div>
          </div>
        ))}
      <div className="livraison-option">
        <label>Choisissez une option de livraison :</label>
        <select
          onChange={(e) => {
            setLivraisonOption(e.target.value);
            if (e.target.value === "rapide") {
              setLivraisonCost(7);
            } else if (e.target.value === "normal") {
              setLivraisonCost(4);
            } else {
              setLivraisonCost(0);
            }
          }}
        >
          <option value="">Sélectionnez le mode livraison</option>
          <option value="rapide">Livraison Rapide (+7€)</option>
          <option value="normal">Livraison Normale (+4€)</option>
        </select>
      </div>
      <div>Frais de port : {fraisDePort}€</div>
      <div>
        Poids total des articles: {totalPoids}g ({totalPoids / 1000}kg)
      </div>
      <div>Frais de poids: {prixFrais}€</div>
      <input
        type="text"
        placeholder="Quelle est ton adresse"
        value={adresse}
        onChange={(event) => {
          setAdresse(event.target.value);
        }}
      ></input>
      <input
        type="text"
        placeholder="Dans quelle ville habite tu"
        value={ville}
        onChange={(event) => {
          setVille(event.target.value);
        }}
      ></input>
      <label>Pays:</label>
      <select
        name="id_pays"
        value={formData.id_pays}
        onChange={(e) => handleChangePays(e.target.value)}
      >
        <option>Choisis ton pays de livraison</option>
        {paysList.map((pays) => (
          <option key={pays.id} value={pays.id}>
            {pays.nom} - {pays.frais_de_port}
          </option>
        ))}
      </select>

      <p>Carte utilisé: {nom}</p>
      <div className="prix">
        Prix total: $
        {parseFloat(calculateTotalPriceWithRabais(panierItems)) +
          livraisonCost +
          fraisDePort +
          prixFrais}
      </div>
      <button
        onClick={() => {
          const prixTotal =
            parseFloat(calculateTotalPriceWithRabais(panierItems)) +
            livraisonCost +
            fraisDePort +
            prixFrais;
          makeOrder(userData.id, prixTotal, formData.id_pays);
        }}
      >
        Valider la commande
      </button>
    </div>
    </div>
  );
};

export default Recap;
