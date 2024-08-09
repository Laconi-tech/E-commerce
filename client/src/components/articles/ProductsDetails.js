import React from "react";

const ProductDetails = ({ product }) => {
  return (
    <div>
      <h1>{product.description}</h1>
      <p>{product.caracteristiques}</p>
      <p className="price">${product.prix}</p>
      <p className="stock">Stock: {product.stock}</p>
    </div>
  );
};

export default ProductDetails;
