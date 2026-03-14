import { Google, LoadingCircle } from "@/components/shared/icons";
import Balancer from "react-wrap-balancer";
import { Formik } from "formik";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebookF } from "react-icons/fa6";
import Link from "next/link";

import BaseLayout from "../../base";
import { loginSchema } from "./loginSchema";
import Router, { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { authProviders } from "@/lib/constants";
import { ShowToast } from "@/components/shared/CustomToast";

const signInWithAuth = (provider: string) => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
};

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { query } = router;
  const { redirect_to } = query;

  const url =
    redirect_to && typeof redirect_to === "string"
      ? new URL(redirect_to, "http://localhost")
      : null;

  return (
    <BaseLayout
      action="Log in"
      prompt="Welcome back! Please enter your details."
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setIsLoading(true);
          const status = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl: url?.pathname ?? "/",
          });

          if (status?.ok && status?.url) {
            Router.push({
              pathname: status?.url,
              query: url ? Object.fromEntries(url.searchParams) : null,
            });
          } else {
            setIsLoading(false);
            if (status?.error && status?.error === "Bad Gateway. Try again") {
              ShowToast({
                status: "fail",
                title: "Error occured",
                message: "Please check your connection and try again",
              });
            } else {
              ShowToast({
                status: "fail",
                title: "Error occured",
                message: status?.error ?? "Unknown error occured",
              });
            }
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <fieldset className="w-full">
              <div className="mb-5 flex flex-col">
                <label htmlFor="useremailInput" className="mb-1">
                  Email
                </label>
                <input
                  className="rounded-md border-gray-300 shadow-sm outline-none drop-shadow-sm focus:border-2 focus:border-cyan-600"
                  name="email"
                  type="email"
                  id="useremailInput"
                  placeholder="Enter your email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                  {errors.email && touched.email && errors.email}
                </p>
              </div>
              <div className="relative flex flex-col">
                <label htmlFor="passwordInput" className="mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="passwordInput"
                  className="rounded-md border-gray-300 shadow-sm outline-none drop-shadow-sm focus:border-2 focus:border-cyan-600"
                  value={values.password}
                  placeholder="●●●●●●●●"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  autoComplete="on"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-9 opacity-70"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
                <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                  {errors.password && touched.password && errors.password}
                </p>
              </div>
              <div className="flex flex-row items-center justify-between gap-8">
                <div className="my-6 flex flex-row items-center gap-1">
                  {""}
                </div>
                <Link
                  href={"/user/password"}
                  type="button"
                  className="text-sm font-medium text-cyan-600"
                >
                  Forgot password
                </Link>
              </div>

              <div className="cursor-pointer rounded-md bg-cyan-600 text-center hover:bg-cyan-700 active:translate-y-[1.5px]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full flex-row items-center justify-center gap-1 py-3 font-manrope font-medium text-white"
                >
                  Sign in {isLoading && <LoadingCircle />}
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </Formik>

      <div className="my-4 rounded-md border-2 border-gray-300 text-center">
        <button
          className="flex w-full justify-center py-3"
          onClick={() => signInWithAuth(authProviders.GOOGLE)}
        >
          <Google className="size-6" />{" "}
          <p className="ml-2 cursor-pointer font-medium text-gray-700">
            Sign in with Google
          </p>
        </button>
      </div>

      {/* <div className="mb-8 rounded-md border-2 border-gray-300 text-center">
        <button
          className="flex w-full justify-center rounded-md py-3 "
          onClick={() => signInWithAuth(authProviders.FACEBOOK)}
        >
          <FaFacebookF className="size-6 text-blue-600" />{" "}
          <p className="ml-2 cursor-pointer font-medium text-gray-700">
            Sign in with Facebook
          </p>
        </button>
      </div> */}
      <motion.p className="mt-7 text-center font-manrope text-sm text-gray-500">
        <Balancer>
          Don&apos;t have an account?{" "}
          <Link
            href={`/user/register${
              redirect_to ? `?redirect_to=${redirect_to}` : ``
            }`}
            className="font-medium text-cyan-500"
          >
            Sign up
          </Link>
        </Balancer>
      </motion.p>
    </BaseLayout>
  );
}

export default Login;
