import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../nav/Nav";

const Register = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [nom, setnom] = useState("");
  const [prenom, setprenom] = useState("");
  const [adresse, setadresse] = useState("");
  const [ville, setville] = useState("");
  const [pays, setpays] = useState([]);
  const [payselected, setpayselected] = useState("");
  const [selectedPays, setSelectedPays] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/pays")
      .then((response) => {
        setpays(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const handleRegister = () => {
    const formData = {
      email: email,
      password: password,
      nom: nom,
      prenom: prenom,
      adresse: adresse,
      ville: ville,
      id_pays: selectedPays,
    };

    axios
      .post("http://localhost:8000/api/register", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSelectChange = (event) => {
    setSelectedPays(event.target.value);
  };

  return (
    <div>
      <Nav />

      <div className="Form">
        <input
          type="text"
          placeholder="Entre ton nom"
          onChange={(event) => {
            setnom(event.target.value);
          }}
        ></input>
        <input
          type="text"
          placeholder="Entre ton prénom"
          onChange={(event) => {
            setprenom(event.target.value);
          }}
        ></input>
        <input
          type="email"
          placeholder="Entre ton email"
          onChange={(event) => {
            setemail(event.target.value);
          }}
        ></input>
        <input
          type="password"
          placeholder="Entre ton mot de passe"
          onChange={(event) => {
            setpassword(event.target.value);
          }}
        ></input>
        <textarea
          placeholder="Quelle est ton adresse"
          onChange={(event) => {
            setadresse(event.target.value);
          }}
        ></textarea>
        <input
          type="text"
          placeholder="Dans quelle ville habites-tu?"
          onChange={(event) => {
            setville(event.target.value);
          }}
        ></input>
        <select select value={selectedPays} onChange={handleSelectChange}>
          <option value="">Sélectionnez un pays</option>
          {pays.map((pay) => (
            <option key={pay.id}>
              {pay.id} - {pay.nom}
            </option>
          ))}
        </select>
        <button onClick={handleRegister}>Inscrit toi</button>
      </div>
    </div>
  );
};

export default Register;
