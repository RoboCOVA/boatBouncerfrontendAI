import React, { useState, useRef } from "react";
import { formRegisterSchema, formUpdateSchema } from "./schema";
import { Formik } from "formik";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { poster } from "@/lib/utils";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/config";
import Router, { useRouter } from "next/router";
import useFetcher from "@/lib/hooks/use-axios";
import { LoadingCircle } from "@/components/shared/icons";
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { returnClass } from "@/components/shared/styles/input";
import { ShowToast } from "@/components/shared/CustomToast";

type step = {
  errors: boolean;
  values: boolean;
};

type Props = {
  type: String | null | undefined;
  initialValues: {
    email?: string;
    newPassword?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    id?: string | undefined | null;
    authProviders?: string[];
    oldPassword?: string;
  };
  page: String | null | undefined;
  setStep?: (step: number) => void;
  step?: number;
  triggerRefresh?: () => void;
  setMandatory?: (obj: step) => void;
};

function Form({
  type,
  initialValues,
  page,
  setStep,
  step,
  triggerRefresh,
  setMandatory,
}: Props) {
  const submitFormRef = useRef<HTMLButtonElement | null>(null);
  const { updateUser } = useFetcher();
  const [accountStatus, setAccountStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });
  const [recaptchaLoader, setRecaptchaLoader] = useState(false);
  const [Recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);
  const accountRef = useRef<HTMLFormElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { fetchWithAuthSync } = useFetcher();

  const router = useRouter();
  const { query } = router;
  const { redirect_to } = query;

  const { update: sessionUpdate } = useSession();

  const setupRecaptcha = (cb: any) => {
    const recaptcha = new RecaptchaVerifier(
      "recaptcha-container",
      {
        callback: cb,
      },
      auth,
    );

    recaptcha
      .render()
      .then(() => {
        setTimeout(() => {
          setRecaptchaLoader(false);
        }, 1000);
      })
      .catch(() => {
        ShowToast({
          status: "fail",
          title: "Error occured",
          message: "unable to render recaptcha",
        });
      });

    setRecaptcha(recaptcha);
  };

  const recaptchAfterValidation = async (res: any, credentials: any) => {
    try {
      setRecaptchaLoader(true);
      await poster("user/createAccount", credentials);

      const smsResponse = await poster("user/sendSms", {
        phoneNumber: credentials.phoneNumber,
        recaptchaToken: res,
      });

      if (
        smsResponse._id ||
        smsResponse.phoneNumber == credentials.phoneNumber
      ) {
        if (submitFormRef.current) {
          submitFormRef.current.style.display = "none";
        }

        Router.push({
          pathname: "/user/verify",
          query: { ...credentials, recaptchaToken: res, redirect_to },
        });
      }
    } catch (error: any) {
      setRecaptchaLoader(false);
      ShowToast({
        status: "fail",
        title: "Error occured",
        message: error.message,
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={
        page === "update" ? formUpdateSchema : formRegisterSchema
      }
      onSubmit={async (values, { setSubmitting, setValues }) => {
        let finalValues = Object.assign(
          {},
          {
            firstName: values.firstName,
            lastName: values.lastName,
            address: values.address,
            phoneNumber: values.phoneNumber,
            state: values.state,
            city: values.city,
            email: values.email,
            zipCode: values.zipCode,
            ...(values.confirmPassword && { password: values.confirmPassword }),
          },
        );

        if (page === "update") {
          try {
            if (accountRef.current) {
              accountRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "start",
              });
            }
            setAccountStatus({ loading: true, error: false, success: false });

            if (!finalValues.password) {
              delete finalValues.password;
            }

            if (initialValues.phoneNumber === finalValues.phoneNumber) {
              delete finalValues.phoneNumber;
            }

            if (initialValues.firstName === finalValues.firstName) {
              delete finalValues.firstName;
            }

            if (initialValues.lastName === finalValues.lastName) {
              delete finalValues.lastName;
            }

            if (initialValues.email === finalValues.email) {
              delete finalValues.email;
            }

            if (
              !values.oldPassword &&
              finalValues.password &&
              initialValues.authProviders?.includes("local")
            ) {
              ShowToast({
                status: "fail",
                title: "Error",
                message: "Old password is required",
              });
              return;
            }

            if (
              !initialValues.authProviders?.includes("local") &&
              finalValues.password
            ) {
              await fetchWithAuthSync(
                "/auth/local",
                { password: finalValues.password },
                "PATCH",
              );

              delete finalValues.password;
            }

            await updateUser(`user/${initialValues.id}`, {
              ...finalValues,
              oldPassword: values.oldPassword,
            });

            // update only the fields that changed
            if (finalValues.firstName) {
              sessionUpdate({
                firstName: finalValues.firstName,
              });
            }

            if (finalValues.lastName) {
              sessionUpdate({
                lastName: finalValues.lastName,
              });
            }

            if (finalValues.email) {
              sessionUpdate({
                email: finalValues.email,
              });
            }

            if (finalValues.phoneNumber) {
              sessionUpdate({
                phoneNumber: finalValues.phoneNumber,
              });
            }

            ShowToast({
              status: "success",
              title: "Success",
              message: "Account updated successfully",
            });
            triggerRefresh?.();
            setValues({
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          } catch (error: any) {
            ShowToast({
              status: "fail",
              title: "Error",
              message: error.response?.data?.message || "Account update failed",
            });
          } finally {
            setAccountStatus({ loading: false, error: false, success: false });
          }
        } else if (page === "register") {
          Recaptcha?.clear();
          try {
            setRecaptchaLoader(true);
            const isValidUser = await poster(
              "/user/validateUserForm",
              finalValues,
            );
            if (isValidUser) {
              setupRecaptcha((args: any) => {
                recaptchAfterValidation(args, finalValues);
              });
            }
          } catch (error: any) {
            setRecaptchaLoader(false);
            ShowToast({
              status: "fail",
              title: "Error occured",
              message: error.message,
            });
          }
        }
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
      }) => (
        <form
          ref={accountRef}
          onSubmit={handleSubmit}
          onChange={() => {
            setMandatory?.({
              values: !!(
                values.confirmPassword &&
                values.email &&
                values.firstName &&
                values.lastName &&
                values.newPassword &&
                values.phoneNumber
              ),
              errors: Object.keys(errors).length > 0,
            });
          }}
          className="relative"
        >
          {step === 1 && (
            <motion.div
              animate={{ x: [100, 0] }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-5 grid w-full grid-cols-2 gap-2.5">
                <div className="relative h-11 w-full">
                  <input
                    type="text"
                    name="firstName"
                    className={
                      returnClass(!!(errors.firstName && touched.firstName))[0]
                    }
                    placeholder=" "
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <label
                    className={`${
                      returnClass(!!(errors.firstName && touched.firstName))[1]
                    }`}
                  >
                    First name
                  </label>

                  {errors.firstName && touched.firstName && (
                    <p className="text-xs text-orange-700">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="relative h-11 w-full">
                  <input
                    type="text"
                    name="lastName"
                    className={
                      returnClass(!!(errors.lastName && touched.lastName))[0]
                    }
                    placeholder=" "
                    value={values.lastName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <label
                    className={`${
                      returnClass(!!(errors.lastName && touched.lastName))[1]
                    }`}
                  >
                    Last name
                  </label>

                  {errors.lastName && touched.lastName && (
                    <p className="ml-1 text-xs text-orange-700">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative mb-5 flex h-11 flex-col">
                <PhoneInput
                  type="tel"
                  disabled={page === "update"}
                  name="phoneNumber"
                  placeholder="Phone number"
                  defaultCountry="US"
                  value={values.phoneNumber}
                  onBlur={handleBlur}
                  onChange={(value) => {
                    setValues({ ...values, phoneNumber: value });
                  }}
                />

                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="ml-1 text-xs text-orange-700">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div className="relative mb-5 flex flex-col">
                <input
                  readOnly={page === "update"}
                  name="email"
                  type="email"
                  placeholder=" "
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setValues({ ...values, email: e.target.value });
                  }}
                  className={returnClass(!!(errors.email && touched.email))[0]}
                />
                <label
                  className={`${
                    returnClass(!!(errors.email && touched.email))[1]
                  }`}
                >
                  Email
                </label>

                {errors.email && touched.email && (
                  <p className="ml-1 text-xs text-orange-700">{errors.email}</p>
                )}
              </div>

              {initialValues.authProviders?.includes("local") &&
                page === "update" && (
                  <div className="relative mb-5 flex flex-col">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="oldPassword"
                      className={
                        returnClass(
                          !!(errors.oldPassword && touched.oldPassword),
                        )[0]
                      }
                      value={values.oldPassword}
                      placeholder=" "
                      onBlur={handleBlur}
                      onChange={handleChange}
                      autoComplete="on"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-2.5 top-2.5 opacity-70"
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                    <label
                      className={`${
                        returnClass(
                          !!(errors.oldPassword && touched.oldPassword),
                        )[1]
                      }`}
                    >
                      Old Password
                    </label>

                    {errors.oldPassword && touched.oldPassword && (
                      <p className="ml-1 text-xs text-orange-700">
                        {errors.oldPassword}
                      </p>
                    )}
                  </div>
                )}

              <div className="relative mb-5 flex flex-col">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  className={
                    returnClass(
                      !!(errors.newPassword && touched.newPassword),
                    )[0]
                  }
                  value={values.newPassword}
                  placeholder=" "
                  onBlur={handleBlur}
                  onChange={handleChange}
                  autoComplete="on"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2.5 top-2.5 opacity-70"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
                <label
                  className={`${
                    returnClass(
                      !!(errors.newPassword && touched.newPassword),
                    )[1]
                  }`}
                >
                  {page === "update" ? "New Password" : "Password"}
                </label>

                {errors.newPassword && touched.newPassword && (
                  <p className="ml-1 text-xs text-orange-700">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="relative mb-5 flex flex-col">
                <input
                  type={showResetPassword ? "text" : "password"}
                  name="confirmPassword"
                  className={
                    returnClass(
                      !!(errors.confirmPassword && touched.confirmPassword),
                    )[0]
                  }
                  value={values.confirmPassword}
                  placeholder=" "
                  onBlur={handleBlur}
                  onChange={handleChange}
                  autoComplete="on"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-2.5 opacity-70"
                  onClick={() => setShowResetPassword((p) => !p)}
                >
                  {showResetPassword ? <Eye /> : <EyeOff />}
                </button>
                <label
                  className={`${
                    returnClass(
                      !!(errors.confirmPassword && touched.confirmPassword),
                    )[1]
                  }`}
                >
                  {page === "update" ? "Confirm Password" : "Re-type Password"}
                </label>

                {!errors.newPassword &&
                  errors.confirmPassword &&
                  touched.confirmPassword && (
                    <p className="ml-1 h-fit text-xs text-orange-700">
                      {errors.confirmPassword}
                    </p>
                  )}
              </div>
            </motion.div>
          )}

          <div className="flex w-full justify-center text-center">
            <div
              id="recaptcha-container"
              className="flex w-full justify-center"
            ></div>
          </div>

          <motion.div className={`mt-4 rounded-md text-center`}>
            <button
              type="submit"
              ref={submitFormRef}
              onClick={() => {
                if (page === "update") {
                  // add something later
                } else {
                  !(
                    values.confirmPassword &&
                    values.email &&
                    values.firstName &&
                    values.lastName &&
                    values.newPassword &&
                    values.phoneNumber
                  ) && setStep?.(1);
                }
              }}
              className={`flex w-full flex-row-reverse items-center justify-center gap-2 rounded-md bg-cyan-600 py-3 font-medium  text-white hover:bg-cyan-700 active:translate-y-[1.5px]`}
              disabled={Object.keys(errors).length > 0 || accountStatus.loading}
            >
              <span>
                {!accountStatus.error && accountStatus.loading && (
                  <LoadingCircle />
                )}
              </span>
              <span>
                {accountStatus.error && !accountStatus.loading && (
                  <XCircle color="red" />
                )}
              </span>
              <span>
                {!accountStatus.error &&
                  !accountStatus.loading &&
                  accountStatus.success && <CheckCircle2 />}
              </span>
              <span className="flex items-center justify-center gap-1">
                {type}
                {recaptchaLoader && <LoadingCircle />}
              </span>
            </button>
          </motion.div>
        </form>
      )}
    </Formik>
  );
}

export default Form;
