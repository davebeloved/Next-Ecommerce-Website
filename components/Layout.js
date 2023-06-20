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

  return (
    <>
      <Head>
        <title>{title ? title + " - Amazona" : "Amazona"}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex mb-12 h-[70px] items-center px-20 justify-between bg-[#d1411e] shadow-md fixed z-[1000] top-0 w-full">
            <Link
              href="/"
              className="text-lg text-white hover:text-white font-bold"
            >
              Onlinn-Shop
            </Link>
            <form
              onSubmit={submitHandler}
              className="mx-auto  hidden  justify-center md:flex"
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
            <div className="flex items-center gap-x-6  z-10 text-white">
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
                href="/categoies"
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
                    <IoIosArrowDown className="mt-1" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
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
