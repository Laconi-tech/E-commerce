import React, { Component } from "react"; // Supprimez les imports inutilisés
import "bootstrap/dist/css/bootstrap.css";
import "./nav.css";
import user from "./user.svg";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import Popup from "../pop-up/Pop-up";
import Panier from "../articles/Panier";

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
    };
  }

  openPopup = () => {
    this.setState({ isPopupOpen: true });
  };

  closePopup = () => {
    this.setState({ isPopupOpen: false });
  };

  // handleLogout = () => {
  //   // Logique de déconnexion ici
  // };

  render() {
    const userData = null;

    return (
      <nav className="custom-nav">
        <div className="eco">
          <div className="ecoshop">
            <h1>ECOSHOP</h1>
            <div className="user">
              <Panier />

              <Link to="/profil">
                {" "}
                <img
                  src={user}
                  id="profil-btn"
                  alt="Icône d'utilisateur"
                  height={30}
                />
              </Link>
            </div>
          </div>
          <div className="choix" style={{ width: "100%" }}>
            <button className="menu" style={{ width: "100px", height: "50px" }}>
              <strong>
                <Link to="/" className="article-link">
                  ACCUEIL
                </Link>
              </strong>
            </button>
            <button className="menu" style={{ width: "100px", height: "50px" }}>
              <strong>
                <Link to="/article-listing" className="article-link">
                  PRODUIT
                </Link>
              </strong>
            </button>
            {/* <button className='menu' style={{ width: '150px', height: '50px' }}>
              <strong>PRODUIT</strong>
            </button> */}
            <button className="menu" style={{ width: "150px", height: "50px" }}>
              <strong>
                <Link to="/orders-list" className="article-link">
                  COMMANDES
                </Link>
              </strong>
            </button>
          </div>
          <Popup trigger={this.state.isPopupOpen} onClose={this.closePopup}>
            <p>Vouler vous vous Deconnecter </p>
            {userData && (
              <p>
                {userData.prenom} <button>OUI</button>{" "}
              </p>
            )}
            <button>
              {" "}
              <Link to="/">NON</Link>
            </button>
          </Popup>
        </div>
      </nav>
    );
  }
}
