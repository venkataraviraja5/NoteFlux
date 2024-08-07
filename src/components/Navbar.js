"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex md:justify-between m-10 items-center text-black sm:flex-row justify-around">
        <div>
          {pathname === '/' ? (
            <Link href="/workspace" className="bg-[#dafa53] rounded-full text-sm py-1 px-5">
              Workspace
            </Link>
          ) : pathname === '/workspace' ? (
            <Link href="/" className="bg-[#dafa53] rounded-full text-sm py-1 px-5">
              Home
            </Link>
          ) : (
            <>
              <Link href="/" className="bg-[#dafa53] rounded-full text-sm py-1 px-5">
                Home
              </Link>
              <Link href="/workspace" className="bg-[#dafa53] rounded-full text-sm py-1 px-5">
                Workspace
              </Link>
            </>
          )}
        </div>
        <div className="flex gap-10">
          {!session ? (
            <>
              <Link href="/login" className="bg-[#dafa53] rounded-full text-sm py-1 px-5">
                Login
              </Link>
              <Link href="/register" className="bg-[#dafa53] rounded-full text-sm py-1 px-5">
                Register
              </Link>
            </>
          ) : (
            session.provider !== "google" && session.user?.username && (
              <span className="bg-[#dafa53] rounded-full text-sm py-1 px-5">
                {session.user.username}
              </span>
            )
          )}
          {session && (
            <button
              onClick={() => signOut()}
              className="py-1 px-5 text-sm bg-sky-300 rounded-full"
            >
              Logout
            </button>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
