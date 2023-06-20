/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
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
  );
}
