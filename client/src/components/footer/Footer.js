import React from "react";
import "./footer.css";
import MySvgImage from "./instagram.svg";

function Footer() {
  return (
    <div className="footer">
      <p>Nous contactrer</p>
      <hr></hr>
      <div className="">
        <img
          src={MySvgImage}
          alt="SVG Image"
          style={{ width: "20px", height: "20px" }}
        />
        <img
          src={MySvgImage}
          alt="SVG Image"
          style={{ width: "20px", height: "20px" }}
        />
        <img
          src={MySvgImage}
          alt="SVG Image"
          style={{ width: "20px", height: "20px" }}
        />
        <img
          src={MySvgImage}
          alt="SVG Image"
          style={{ width: "20px", height: "20px" }}
        />
      </div>
      <hr></hr>
      create by : idriss, wilfrid, alexendre, bazou, nicola, benjamin.
    </div>
  );
}

export default Footer;
