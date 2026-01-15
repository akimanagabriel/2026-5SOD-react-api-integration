import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SingleProductVIew() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  async function getSingleProductById() {
    const { data } = await axios.get("https://fakestoreapi.com/products/" + id);
    setProduct(data);
  }

  useEffect(() => {
    getSingleProductById();
  }, []);

  if (!product) {
    return <h1>Loading ...</h1>;
  }

  return (
    <div className="p-20">
      <h1>SINGLE PRODUCT DETAILS</h1>
      <div className="grid grid-cols-2">
        <img
          src={product.image}
          alt=""
          className="h-100"
        />
        <div>
          <h1 className="text-orange-700 font-semibold text-2xl mb-10">
            {product.title}
          </h1>
          <p>{product.description}</p>
          <h1 className="text-5xl mt-4 ">${product.price}</h1>
        </div>\

        <div className="space-x-5">
          <button className="px-6 py-2 text-white bg-orange-700 hover:bg-orange-400 rounded-xl">
            Add to cart
          </button>
          <button className="px-6 py-2 text-white bg-orange-700 hover:bg-orange-400 rounded-xl">
            Add to wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProductVIew;
