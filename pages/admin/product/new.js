import React from "react";
import ProductForm from "../../../components/ProductForm";
import Layout from "../../../components/Layout";

export default function NewProduct() {
  return (
    <div>
      <Layout>
        <h2>New Product</h2>
        <ProductForm />
      </Layout>
    </div>
  );
}
