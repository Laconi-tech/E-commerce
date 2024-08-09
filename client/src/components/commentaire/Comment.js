import React from "react";

function commentaire() {
  return (
    <div>
      <form>
        <input type="text" placeholder="nom"></input>
        <input type="text" placeholder="prenom"></input>
        <textarea placeholder="Donne moi ton avis sur le produit"></textarea>
        <input type="button">Send </input>
      </form>
    </div>
  );
}

export default commentaire;
