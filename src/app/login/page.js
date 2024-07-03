"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
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
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        setError("");
        if (res?.url) router.replace("/dashboard");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
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
          <h1 className="text-2xl text-center font-semibold mb-8">Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full border border-gray-300 text-black rounded px-3 py-1 mb-4 focus:outline-none focus:border-blue-400 focus:text-black text-sm"
              placeholder="Email"
              required
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
                "Sign In"
              )}
            </button>
            <p className="text-red-600 text-[14px] mb-4">{error && error}</p>
          </form>
          <button
            className="w-full bg-black text-white py-1 rounded hover:bg-gray-800 text-sm"
            onClick={() => {
              signIn("google");
            }}
          >
            Sign In with Google
          </button>
          <div className="text-center text-gray-500 mt-4 text-sm">- OR -</div>
          <Link
            className="block text-center text-sky-300 hover:underline mt-2 text-sm"
            href="/register"
          >
            Register Here
          </Link>
        </div>
      </div>
    )
  );
};

export default Login;
