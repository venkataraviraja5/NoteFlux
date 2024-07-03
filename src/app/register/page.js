"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ClipLoader from "react-spinners/ClipLoader";

const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target[0].value;
    const username = e.target[1].value;
    const password = e.target[2].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      setIsLoading(false);
      return;
    }

    if (!username || username.trim() === "") {
      setError("Username is required");
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });
      if (res.status === 400) {
        setError("This email is already registered");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  if (sessionStatus === "loading") {
    return   (
      <div className="flex min-h-screen items-center justify-center">
        <ClipLoader size={50} color={"#123abc"} loading={true} />
      </div>
    );
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-[#212121] p-8 rounded shadow-md w-96">
          <h1 className="text-2xl text-center font-semibold mb-8">Register</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full border border-gray-300 text-black rounded px-3 py-1 mb-4 focus:outline-none focus:border-blue-400 focus:text-black text-sm"
              placeholder="Email "
              required
            />
            <input
              type="text" // Updated
              className="w-full border border-gray-300 text-black rounded px-3 py-1 mb-4 focus:outline-none focus:border-blue-400 focus:text-black text-sm"
              placeholder="Username" // Added
              required // Added
            />
            <input
              type="password"
              className="w-full border border-gray-300 text-black rounded px-3 py-1 mb-4 focus:outline-none focus:border-blue-400 focus:text-black text-sm"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className={`w-full py-1 rounded text-sm ${
                isLoading
                  ? "bg-orange-300 text-gray-800 cursor-not-allowed"
                  : "bg-sky-300 text-black hover:bg-orange-300"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader size={20} color={"#123abc"} loading={true} />
              ) : (
                "Register"
              )}
            </button>
            <p className="text-red-600 text-[14px] mb-4">{error && error}</p>
          </form>
          <div className="text-center text-gray-500 mt-4 text-sm">- OR -</div>
          <Link
            className="block text-center text-sky-300 text-sm hover:underline mt-2"
            href="/login"
          >
            Login with an existing account
          </Link>
        </div>
      </div>
    )
  );
};

export default Register;
