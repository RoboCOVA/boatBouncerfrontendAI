import React, { useEffect, useState } from "react";
import BaseLayout from "../../base";
import Balancer from "react-wrap-balancer";
import { Google } from "@/components/shared/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import Form from "../form";
import { FaFacebookF } from "react-icons/fa6";
import { authProviders } from "@/lib/constants";

type step = {
  errors: boolean;
  values: boolean;
};

const signInWithAuth = (provider: string) => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
};

function Register() {
  const [step, setSteps] = useState(1);

  const [mandatoryStep, setMandatoryStep] = useState({
    errors: false,
    values: false,
  });

  function setStep(step: number) {
    setSteps(step);
  }

  function setMandatory(obj: step) {
    setMandatoryStep(obj);
  }

  const initialValues = {
    email: "",
    newPassword: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    id: "",
  };

  return (
    <BaseLayout
      action="Sign up"
      prompt="Create your account"
      step={step}
      setStep={setSteps}
      mandatory={mandatoryStep}
    >
      <Form
        type="Create account"
        initialValues={initialValues}
        setMandatory={setMandatory}
        page="register"
        step={step}
        setStep={setStep}
      />

      <div className="my-4 rounded-md border-2 border-gray-300 text-center">
        <button
          className="flex w-full justify-center py-3"
          onClick={() => signInWithAuth(authProviders.GOOGLE)}
        >
          <Google className="size-6" />{" "}
          <p className="ml-2 cursor-pointer font-medium text-gray-700">
            Sign up with Google
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
            Sign up with Facebook
          </p>
        </button>
      </div> */}
      <motion.p className="mt-7 pb-10 text-center text-sm text-gray-500">
        <Balancer>
          Already have an account?{" "}
          <Link href="/user/login" className="font-medium text-orange-500">
            Login
          </Link>
        </Balancer>
      </motion.p>
    </BaseLayout>
  );
}

export default Register;
