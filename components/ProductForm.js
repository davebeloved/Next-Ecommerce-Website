import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "./Layout";
import { getError } from "../utils/error";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}
export default function AdminProductEditScreen({
  _id,
  // image: existingImg,
  name: existingName,
  slug: existingSlug,
  brand: existingBrand,
  description: existingDesc,
  price: existingPrice,
  oldPrice: existingOldPrice,
  category: existingCat,
  countInStock: existingCount,
}) {
  const [name, setName] = useState(existingName || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [brand, setBrand] = useState(existingBrand || "");
  const [description, setDescription] = useState(existingDesc || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [oldPrice, setOldPrice] = useState(existingOldPrice || "");
  const [category, setCategory] = useState(existingCat || "");
  const [file, setFile] = useState("");
  const [countInStock, setCountInStock] = useState(existingCount || "");

  const { query } = useRouter();
  const productId = query.id;
  //   console.log(productId);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const {
    register,
    // handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("oldPrice", data.oldPrice);
        setValue("image", data.image);
        setValue("category", data.category);
        setValue("brand", data.brand);
        setValue("countInStock", data.countInStock);
        setValue("description", data.description);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, [productId, setValue]);

  const router = useRouter();

  const handleSubmit = async (e, imageField) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const url = "https://api.cloudinary.com/v1_1/dsfm0so1k/image/upload";

      dispatch({ type: "UPLOAD_REQUEST" });
      // const {
      //   data: { signature, timestamp },
      // } = await axios("/api/admin/cloudinary-sign");

      // const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      // formData.append("signature", signature);
      // formData.append("timestamp", timestamp);
      // formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      formData.append("upload_preset", "next_store");

      const { data } = await axios.post(url, formData);
      console.log(data);
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue(imageField, data.url);

      const newProducts = {
        name,
        slug,
        oldPrice,
        price,
        category,
        image: data.url,
        brand,
        countInStock,
        description,
      };
      // const result = await axios.get(`/api/admin/products`);
      // const id = result.data._id;
      if (_id) {
        await axios.put("/api/products", {
          ...newProducts,
          _id,
        });

        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("Product updated successfully");
      } else {
        await axios.post("/api/products", newProducts);
        dispatch({ type: "UPDATE_SUCCESS" });

        toast.success("Product Ctreated successfully");
      }

      router.push("/admin/products");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  };
  const path = router.pathname;
  console.log(path);

  return (
    <Layout title={`Edit Product ${productId}`}>
      <div className="grid py-[70px] md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products" className="font-bold">
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {/* {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : ( */}
          <form
            className="mx-auto max-w-screen-md"
            // onSubmit={handleSubmit(submitHandler)}
            onSubmit={handleSubmit}
          >
            {path === "/admin/product/new" ? (
              <h1 className="mb-4 pt-5 text-xl">{`New Product`}</h1>
            ) : (
              <h1 className="pt-5 mb-4 text-xl">{`Edit Product`}</h1>
            )}
            <div className="mb-4">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="w-full"
                id="name"
                autoFocus
                {...register("name", {
                  required: "Please enter name",
                })}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                className="w-full"
                id="slug"
                {...register("slug", {
                  required: "Please enter slug",
                })}
                onChange={(e) => setSlug(e.target.value)}
              />
              {errors.slug && (
                <div className="text-red-500">{errors.slug.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="oldPrice">Old Price</label>
              <input
                type="text"
                className="w-full"
                id="oldPrice"
                {...register("oldPrice", {
                  required: "Please enter old price",
                })}
                onChange={(e) => setOldPrice(e.target.value)}
              />
              {errors.oldPrice && (
                <div className="text-red-500">{errors.price.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                className="w-full"
                id="price"
                {...register("price", {
                  required: "Please enter price",
                })}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price && (
                <div className="text-red-500">{errors.price.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="image">image</label>
              <input
                type="text"
                className="w-full"
                id="image"
                {...register("image", {
                  required: "Please enter image",
                })}
              />
              {errors.image && (
                <div className="text-red-500">{errors.image.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="imageFile">Upload image</label>
              <input
                type="file"
                className="w-full"
                id="imageFile"
                // onChange={uploadHandler}
                onChange={(e) => setFile(e.target.files[0])}
              />

              {loadingUpload && <div>Uploading....</div>}
            </div>
            <div className="mb-4">
              <label htmlFor="category">category</label>
              <input
                type="text"
                className="w-full"
                id="category"
                {...register("category", {
                  required: "Please enter category",
                })}
                onChange={(e) => setCategory(e.target.value)}
              />
              {errors.category && (
                <div className="text-red-500">{errors.category.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="brand">brand</label>
              <input
                type="text"
                className="w-full"
                id="brand"
                {...register("brand", {
                  required: "Please enter brand",
                })}
                onChange={(e) => setBrand(e.target.value)}
              />
              {errors.brand && (
                <div className="text-red-500">{errors.brand.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="countInStock">countInStock</label>
              <input
                type="text"
                className="w-full"
                id="countInStock"
                {...register("countInStock", {
                  required: "Please enter countInStock",
                })}
                onChange={(e) => setCountInStock(e.target.value)}
              />
              {errors.countInStock && (
                <div className="text-red-500">
                  {errors.countInStock.message}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="countInStock">description</label>
              <input
                type="text"
                className="w-full"
                id="description"
                {...register("description", {
                  required: "Please enter description",
                })}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <div className="text-red-500">{errors.description.message}</div>
              )}
            </div>
            <div className="mb-4">
              <button disabled={loadingUpdate} className="primary-button">
                {loadingUpdate ? "Loading" : "Update"}
              </button>
            </div>
            <div className="mb-4">
              <Link href={`/admin/products`}>Back</Link>
            </div>
          </form>
          {/* )} */}
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditScreen.auth = { adminOnly: true };
