import BaseLayout from "@/components/auth/base";
import Meta from "@/components/layout/meta";
import { LoadingCircle } from "@/components/shared/icons";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { poster } from "@/lib/utils";
import { Formik } from "formik";
import Router from "next/router";
import { useState } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/config";
import * as Yup from "yup";
import { E164Number } from "libphonenumber-js/core";

function Index() {
  const [recaptchaLoader, setRecaptchaLoader] = useState(false);
  const [verificationError, setVerificationError] = useState<any>(null);
  let phoneNumber: E164Number | undefined;

  const setupRecaptcha = (cb: any) => {
    setRecaptchaLoader(true);
    const recaptcha = new RecaptchaVerifier(
      "recaptcha-container",
      {
        callback: cb,
      },
      auth,
    );

    // FIX FE-06: removed misplaced recaptcha.clear() — it was called synchronously
    // before render() completed, clearing an uninitialized recaptcha instance.
    // The recaptcha is now only used via the callback, not cleared prematurely.
    recaptcha
      .render()
      .then(() => {
        setTimeout(() => {
          setRecaptchaLoader(false);
        }, 1000);
      })
      .catch(() => {
        setRecaptchaLoader(false);
      });
  };

  const recaptchAfterValidation = async (
    res: string,
    phoneNumber?: E164Number,
  ) => {
    try {
      setRecaptchaLoader(true);

      const response = await poster("user/forgetPassword", {
        phoneNumber,
        recaptchaToken: res,
      });

      setRecaptchaLoader(false);

      Router.push({
        pathname: "/user/password/confirm",
        query: { phoneNumber: phoneNumber, encryption: response },
      });
    } catch (error: any) {
      setVerificationError(error?.message);
      setRecaptchaLoader(false);
    }
  };

  return (
    <>
      <Meta title="recover account" />

      <BaseLayout
        action="Find your account"
        prompt={`Please enter your phone number to search for your account.`}
      >
        <Formik
          initialValues={{ phoneNumber }}
          validationSchema={Yup.object().shape({
            phoneNumber: Yup.string().required("Phone number is required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setupRecaptcha((args: any) => {
              recaptchAfterValidation(args, values.phoneNumber);
            });
          }}
        >
          {({
            values,
            errors,
            touched,
            setValues,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={handleSubmit}
              onChange={() => {
                setVerificationError(null);
              }}
            >
              <fieldset>
                <div className="relative mb-3 flex h-11 flex-col">
                  <PhoneInput
                    type="tel"
                    name="phoneNumber"
                    placeholder="phone number"
                    defaultCountry="US"
                    value={values?.phoneNumber}
                    onBlur={handleBlur}
                    onChange={(value) => {
                      setVerificationError(null);
                      setValues({ phoneNumber: value });
                    }}
                  />

                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="ml-1 text-xs text-orange-700">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="flex w-full justify-center text-center">
                  <div
                    id="recaptcha-container"
                    className="flex w-full justify-center"
                  ></div>
                </div>

                <div className="mt-3 ">
                  {verificationError && (
                    <div className="ml-1 text-center text-xs text-orange-700 sm:text-sm">
                      {verificationError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-md bg-cyan-600 py-3 text-center font-medium text-white hover:bg-cyan-700 active:active:translate-y-[1.5px]"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <p>RESET PASSWORD</p>
                      {recaptchaLoader && <LoadingCircle />}
                    </span>
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </Formik>
      </BaseLayout>
    </>
  );
}

export default Index;
