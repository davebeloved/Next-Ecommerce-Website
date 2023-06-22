/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import { TbCurrencyNaira } from "react-icons/tb";

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card w-full md:w-[250px]">
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow object-cover h-40 w-full"
        />
      </Link>
      <div className="flex flex-col items-center  justify-center p-5">
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
          <p className="text-gray-600 text-lg font-bold">{product.brand}</p>
        )}

        <div className="flex  gap-x-3 mb-2">
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
  );
}
