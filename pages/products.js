import React from "react";
import Layout from "../components/Layout";
import db from "../utils/db";
import Product from "../models/Product";
import Link from "next/link";
import { TbCurrencyNaira } from "react-icons/tb";
import { Store } from "../utils/Store";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";

const products = ({ products }) => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });

    toast.success("Product added to the cart");
  };
  return (
    <Layout title="All Products">
      <div className="px-5 md:px-10 lg:px-20 mt-32 md:-ml-16 lg:ml-0 ">
        <h2 className="text-center lg:text-left text-2xl my-12 font-bold">
          All Products
        </h2>
        <div className="grid grid-cols-1 md:gap-20 lg:gap-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div className="card w-full md:w-[250px] " key={product.slug}>
              <Link href={`/product/${product.slug}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded shadow object-cover h-40 w-64"
                />
              </Link>
              <div className="flex flex-col items-center justify-center p-5">
                <Link href={`/product/${product.slug}`}>
                  {product.name.length > 20 ? (
                    <h2 className="text-lg font-bold">
                      {product.name.substring(0, 20)}...
                    </h2>
                  ) : (
                    <h2 className="text-lg font-bold">{product.name}</h2>
                  )}
                </Link>
                {product.brand.length > 20 ? (
                  <p className="text-gray-600 text-lg font-bold">
                    {product.brand.substring(0, 20)}...
                  </p>
                ) : (
                  <p className="text-gray-600 text-lg font-bold">
                    {product.brand}
                  </p>
                )}
                <div className="flex gap-x-3 mb-2">
                  <p className="flex items-center text-gray-400 font-semibold text-xl line-through">
                    <TbCurrencyNaira />
                    {product.oldPrice}
                  </p>
                  <p className="flex items-center font-semibold text-xl">
                    <TbCurrencyNaira />
                    {product.price}
                  </p>
                </div>
                <button
                  className="primary-button w-full"
                  type="button"
                  onClick={() => addToCartHandler(product)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default products;

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
