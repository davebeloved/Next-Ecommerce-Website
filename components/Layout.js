import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Menu } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "../utils/Store";
import DropdownLink from "./DropdownLink";
import { useRouter } from "next/router";
import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import Footer from "./Footer";
import { FaBars, FaAngleRight } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const [query, setQuery] = useState("");

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const [showNav, setShowNav] = useState(false);

  const handleShowMenu = () => {
    setShowNav(true);
  };
  const handleCloseMenu = () => {
    setShowNav(false);
  };
  return (
    <>
      <Head>
        <title>{title ? title + " - Obi-Store" : "Obi-Store"}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex  flex-col justify-center lg:flex-row mb-12 h-[70px] lg:items-center  lg:px-16 lg:justify-between bg-[#d1411e] shadow-md fixed z-[1000] top-0 w-full">
            <div className="flex items-center lg:gap-x-10 my-5 lg:my-0">
              <Link
                href={"/"}
                className="flex items-center pl-3 md:pl-6 lg:pl-0 text-sm md:text-lg px-5 lg:px-0 text-white my-auto hover:text-white font-bold"
              >
                <div className="bg-white rounded-full p-[10px] w-[30px] h-[30px] md:w-[50px] md:h-[50px]">
                  <Image
                    src="/img/telephone.png"
                    alt=""
                    width="32"
                    height="32"
                  />
                </div>
                <div className="ml-3 text-white text-xs md:text-xl">
                  {/* <div className=" text-white">ORDER NOW!</div> */}

                  <div className=" text-white">OBI-EXCEL TOOLS</div>
                  <div className=" text-white">+2348063645038</div>
                </div>
              </Link>

              {/* <Link
                href="/"
                className="text-sm md:text-lg px-5 lg:px-0 text-white my-auto hover:text-white font-bold"
              >
                OBI-EXCEL TOOLS
              </Link> */}
              <form
                onSubmit={submitHandler}
                className="mx-auto flex items-center   justify-center"
              >
                <input
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                  placeholder="Search products"
                />
                <button
                  className="rounded rounded-tl-none rounded-bl-none bg-white p-1 text-sm dark:text-black"
                  type="submit"
                  id="button-addon2"
                >
                  <SearchIcon className="h-5 w-5"></SearchIcon>
                </button>
              </form>
              {showNav ? (
                <AiFillCloseCircle
                  onClick={handleCloseMenu}
                  size={30}
                  className="mr-5 lg:hidden cursor-pointer text-white transition-all duration-500 ease-in"
                />
              ) : (
                <FaBars
                  onClick={handleShowMenu}
                  size={25}
                  color="white"
                  className="mr-5 lg:hidden cursor-pointer transition-all duration-500 ease-in"
                />
              )}
            </div>

            <div
              className={
                !showNav
                  ? `px-5 lg:px-0 flex flex-col lg:flex-row lg:items-center gap-x-6   text-white  py-5 left-0 my-16 lg:py-0 space-y-6 lg:space-y-0 lg:my-0 z-[-1] lg:z-auto absolute lg:static bg-[#d1411e] w-full lg:w-auto top-[-400px] opacity-0 lg:opacity-100 transition-all ease-in duration-500`
                  : `px-5 lg:px-0 flex flex-col lg:flex-row lg:items-center gap-x-6   text-white  py-5 left-0 my-16 lg:py-0 space-y-6 lg:space-y-0 lg:my-0 z-[-1] lg:z-auto absolute lg:static bg-[#d1411e] w-full lg:w-auto top-0 opacity-100 transition-all ease-in duration-500`
              }
            >
              <Link
                href="/"
                className="text-white font-semibold hover:text-white"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-white font-semibold hover:text-white"
              >
                All Products
              </Link>
              <Link
                href="/search"
                className="text-white font-semibold hover:text-white"
              >
                Categories
              </Link>
              <Link
                href="/cart"
                className="p-2 text-white font-semibold hover:text-white"
              >
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-white px-2 py-1 text-xs font-bold text-[#d1411e]">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className="relative  inline-block">
                  <Menu.Button className="text-white font-semibold flex items-center">
                    {session.user.name}
                    {showNav ? (
                      <FaAngleRight className="mt-1" />
                    ) : (
                      <IoIosArrowDown className="mt-1" />
                    )}
                  </Menu.Button>
                  <Menu.Items className="absolute left-[68px] lg:left-[-168px] lg:top-10 top-2 lg:right-0 w-56 origin-top-right bg-white    shadow-lg ">
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link text-[#d1411e] font-semibold hover:text-white hover:bg-[#d1411e]"
                        href="/profile"
                      >
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link text-[#d1411e] font-semibold hover:text-white hover:bg-[#d1411e]"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link text-[#d1411e] font-semibold hover:text-white hover:bg-[#d1411e]"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link text-[#d1411e] font-semibold hover:text-white hover:bg-[#d1411e]"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className="p-2 text-white">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        {/* <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 Amazona</p>
        </footer> */}
        <Footer />
      </div>
    </>
  );
}
