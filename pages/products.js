import React from "react";
import Layout from "../components/Layout";
import db from "../utils/db";
import Product from "../models/Product";
import Link from "next/link";

const products = ({ products }) => {
  console.log(products);
  return (
    <Layout title="All Products">
      <div className="px-20 py-32">
        <h2 className="font-bold text-2xl  mb-10">All Products</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div className="card " key={product.slug}>
              <Link href={`/product/${product.slug}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded shadow object-cover h-40 w-64"
                />
              </Link>
              <div className="flex flex-col items-center justify-center p-5">
                <Link href={`/product/${product.slug}`}>
                  <h2 className="text-lg font-bold">{product.name}</h2>
                </Link>
                <p className=" font-semibold">{product.brand}</p>
                <div className="flex gap-x-3 mb-2">
                  <p className="font-semibold text-xl line-through">
                    ${product.oldPrice}
                  </p>
                  <p className="font-semibold text-xl">${product.price}</p>
                </div>
                <button
                  className="primary-button"
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
