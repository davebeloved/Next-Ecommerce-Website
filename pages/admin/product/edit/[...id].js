import React, { useEffect, useState } from "react";
// import ProductForm from "../../../../components/ProductForm";
import { useRouter } from "next/router";
import axios from "axios";
import ProductForm from "../../../../components/ProductForm";

export default function EditScreen() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      // console.log(response.data);
      setProductInfo(response.data);
    });
  }, []);
  console.log("product", productInfo);
  return (
    <div>
      <div>
        {/* <h1>Edit product</h1> */}
        {productInfo && <ProductForm {...productInfo} />}
      </div>
    </div>
  );
}
