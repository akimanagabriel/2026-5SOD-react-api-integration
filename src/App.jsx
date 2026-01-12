import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function App() {
  // define a state to store data from fakestore
  const [products, setProducts] = useState([]);
  // a fn to read a products from fakestore backend
  async function getAllProducts() {
    const response = await axios.get("https://fakestoreapi.com/products");
    // console.log(response.data);
    setProducts(response.data);
  }

  // use side effect to load all data at initial component mount
  useEffect(() => {
    getAllProducts();
  }, []);

  if (products.length === 0) {
    // return <h1>Loading ....</h1>;
    return (
      <h1>
        <Loader size={100} /> Please wait ....
      </h1>
    );
  }

  return (
    <>
      <h1>ALL PRODUCTS</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-10">
        {products.map((item) => (
          <div
            className=" shadow rounded-2xl p-5"
            key={item.id}
          >
            <img
              src={item.image}
              alt=""
              className="h-[200px]"
            />
            <h2>
              {item.id}. {item.title}
            </h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
