"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div>
      <ul className="flex md:justify-between m-10 items-center text-black sm:flex-row justify-around">
        <div>
          <Link href="/">
            <li className="bg-[#dafa53] rounded-full text-sm py-1 px-5">Home</li>
          </Link>
        </div>
        <div className="flex gap-10">
          {/* <Link href="/dashboard">
            <li className="bg-[#dafa53] rounded-full font-semibold py-1 px-5">Dashboard</li>
          </Link> */}
          {!session ? (
            <>
              <Link href="/login">
                <li className="bg-[#dafa53] rounded-full text-sm py-1 px-5">Login</li>
              </Link>
              <Link href="/register">
                <li className="bg-[#dafa53] rounded-full text-sm py-1 px-5">Register</li>
              </Link>
            </>
          ) : (
            session.provider !== "google" && session.user?.username && (
              <li className="bg-[#dafa53] rounded-full text-sm py-1 px-5 items-center">{session.user?.username}</li>
            )
          )}
          {session && (
            <li>
              <button
                onClick={() => {
                  signOut();
                }}
                className="py-1 px-5 text-sm bg-sky-300 rounded-full"
              >
                Logout
              </button>
            </li>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
