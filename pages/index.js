import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import db from "../utils/db";
import { Store } from "../utils/Store";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function Home({ products, featuredProducts }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  console.log("feature", featuredProducts);
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
  console.log("featuure", featuredProducts);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  return (
    <Layout title="Home Page">
      <div className="">
        <div
          className=" bg-black h-[300px] md:h-[500px] embla w-full absolute -mb-52 top-0 left-0"
          ref={emblaRef}
        >
          <div className="embla__container h-[60vh] mt-[50px] w-full">
            {featuredProducts.map((product) => (
              <div key={product._id} className=" embla__slide h-full w-full">
                <Link
                  href={`/product/${product.slug}`}
                  passHref
                  className="flex w-full"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* <Carousel showThumbs={false} autoPlay>
        <div className=" h-[60vh] mt-[50px] w-full">
        {featuredProducts.map((product) => (
          <div key={product._id} className=" h-full w-full">
          <Link
          href={`/product/${product.slug}`}
          passHref
          className="flex w-full"
          >
          <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  />
                  </Link>
                  </div>
                  ))}
                  </div>
                </Carousel> */}
        <div className=" px-5 md:px-10 lg:px-20 md:-ml-16 mt-[340px] md:mt-[550px] lg:ml-0  lg:mt-[600px]">
          <h2 className="text-center lg:text-left text-2xl my-12 font-bold">
            Latest Products
          </h2>
          <div className="  grid grid-cols-1 md:gap-20 lg:gap-10 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductItem
                product={product}
                key={product.slug}
                addToCartHandler={addToCartHandler}
              ></ProductItem>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 16,
  }).lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}
