import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrdersList.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { jsPDF } from "jspdf";
import Nav from "../nav/Nav";
import { Link } from "react-router-dom";

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState([]);
  const [pays, setPays] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .get("http://localhost:8000/api/profile", config)
        .then((response) => {
          setUserId(response.data.id);
          setUserData(response.data);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération de l'ID utilisateur :",
            error
          );
        });

      axios
        .get("http://localhost:8000/api/orders", config)
        .then((response) => {
          const userOrders = response.data.filter(
            (order) => order.id_client === userId
          );
          setOrders(userOrders);
          console.log(userOrders);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des commandes :",
            error
          );
        });
    }
  }, [userId]);

  const downloadPDF = (prix, commande, date, ville, adresse, idPays) => {
    const doc = new jsPDF();

    doc.text(`${userData.nom} ${userData.prenom}`, 10, 10);
    doc.text(`N° de commande : ${commande}`, 10, 20);
    doc.text(`Date de la commande: ${date}`, 10, 30);

    let yPosition = 50;
    let totalprice = 0;

    axios
      .get(`http://localhost:8000/api/pays/${idPays}`)
      .then((response) => {
        console.log(response.data[0].nom);
        setPays(response.data[0].nom);
      })
      .catch((error) => {
        console.error(error);
      });

    orders.forEach((order) => {
      if (order.commande_id === commande) {
        doc.text(`Détails de la commande:`, 10, yPosition);
        yPosition += 10;

        order.panierData.forEach((item) => {
          const priceWithDiscount = item.prix - (item.prix * item.rabais) / 100;
          totalprice += priceWithDiscount;

          if (priceWithDiscount == item.prix) {
            doc.text(`${item.description} - ${item.prix}`, 10, yPosition);
          } else {
            doc.text(
              `$${item.description} - ${priceWithDiscount.toFixed(
                2
              )} (Prix initial: $${item.prix})`,
              10,
              yPosition
            );
          }

          yPosition += 10;
        });

        let frais = prix - totalprice;
        doc.text(`Frais totaux: ${frais.toFixed(2)}`, 10, yPosition);
        yPosition += 10;
      }
    });
    doc.text(`Adresse : ${adresse} , ${ville}`, 10, yPosition);
    yPosition += 10;

    doc.text(`Pays de livraison : ${pays}`, 10, yPosition);
    yPosition += 10;

    doc.text(`Prix total : ${prix}`, 10, yPosition);
    yPosition += 10;

    doc.save("recap.pdf");
  };

  return (
    <div>
      <Nav />
      <div className="orders-list-container">
        <h2 className="orders-list-header">Liste de vos commandes :</h2>
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-number">
                N° de commande : {order.commande_id}
              </div>
              <div className="order-details">
                Prix: <span className="order-price">${order.prix}</span> ,
                Statut :{" "}
                <span className="order-status">
                  {order.is_expedited ? "Expédiée" : "En attente"}
                </span>
                , Date: <span className="order-date">{order.date}</span>
                <button
                  className="btn btn-dark"
                  onClick={() =>
                    downloadPDF(
                      order.prix,
                      order.commande_id,
                      order.date,
                      order.ville,
                      order.adresse,
                      order.id_pays
                    )
                  }
                >
                  Télécharger la facture
                </button>
              </div>
              <div className="order-items">
                {order.panierData.map((item) => {
                  const priceWithDiscount =
                    item.prix - (item.prix * item.rabais) / 100;

                  return (
                    <div key={item.id_article} className="order-item-details">
                      <img
                        src={item.photo_url}
                        alt={item.description}
                        className="item-photo"
                      />
                      <div className="item-description">{item.description}</div>
                      <div className="item-price">
                        ${priceWithDiscount.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrdersList;
