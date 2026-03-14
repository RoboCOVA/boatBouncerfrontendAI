import BaseLayout from "@/components/auth/base";
import Meta from "@/components/layout/meta";
import { ShowToast } from "@/components/shared/CustomToast";
import { LoadingCircle } from "@/components/shared/icons";
import { auth } from "@/lib/config";
import { poster } from "@/lib/utils";
import dayjs from "dayjs";
import { RecaptchaVerifier } from "firebase/auth";
import { Formik } from "formik";
import { signIn } from "next-auth/react";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function Index() {
  const router = useRouter();
  const { query } = router;
  const { id, provider } = query;
  const [token, setToken] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const recaptchaRef = useRef<RecaptchaVerifier | undefined | null>();

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [enteredPhone, setEnteredPhone] = useState<string | null>(null);
  const [resendLoader, setResendLoader] = useState(false);
  const [expireTime, setExpireTime] = useState("");
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    if (id || provider) return;
    Router.push({
      pathname: "/user/login",
    });
  }, [id, provider]);

  useEffect(() => {
    recaptchaRef.current = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible", // this property is important otherwise the captcha will be displayed on the screen
      },
      auth,
    );
  }, []);

  useEffect(() => {
    if (!expireTime) return;

    const timer = setInterval(() => {
      // Creates an interval which will update the current data every minute
      // This will trigger a rerender every component that uses the useDate hook.
      setCurrentTime(dayjs());
    }, 1000);

    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    };
  }, [expireTime]);

  if (!id) {
    return;
  }

  const enableReaptchHn = async (phoneNumber: string) => {
    const token = await recaptchaRef.current?.verify();
    if (token) setRecaptchaToken(token);
    const encryption = await poster("auth/update", {
      id,
      provider,
      phoneNumber,
      recaptchaToken: token,
    });

    if (typeof encryption === "string") {
      ShowToast({
        title: "code sent",
        message: "verification code is sent to your phone",
        status: "success",
      });
    } else {
      ShowToast({
        title: "Failed to send code",
        message: "Failed to send verification code to your phone",
        status: "fail",
      });
    }
    setToken(encryption);

    recaptchaRef.current?.clear();
    recaptchaRef.current = null;

    return true;
  };

  const resendSms = async (phoneNumber: string) => {
    try {
      setResendLoader(true);
      const response = await poster("user/resendSms", {
        phoneNumber,
        recaptchaToken,
      });
      ShowToast({
        title: "code resent",
        message: "resendt otp to your phone succesfully",
        status: "success",
      });
      setExpireTime(response);
    } catch (error) {
      ShowToast({
        title: "Error occured",
        message: "resending otp to your phone failed",
        status: "fail",
      });
    } finally {
      setResendLoader(false);
    }
  };

  return (
    <>
      <Meta title="Verify Account" />

      <BaseLayout
        action="Verify Your Account"
        prompt="Add phone number to verify your account. we send otp quickly"
      >
        <Formik
          initialValues={{ code: "", phoneNumber: "" }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              setIsVerifying(true);

              if (step === "phone") {
                setSubmitting(true);
                await enableReaptchHn(values.phoneNumber);

                setEnteredPhone(values.phoneNumber);
                setStep("code");
              } else {
                setIsVerifying(true);
                setSubmitting(true);

                const status = await signIn("credentials", {
                  redirect: false,
                  phoneNumber: values.phoneNumber,
                  verificationCode: values.code,
                  encryption: token,
                  callbackUrl: "/",
                });

                if (status?.ok && status?.url) {
                  Router.push({
                    pathname: status?.url,
                  });
                } else {
                  ShowToast({
                    title: "Verification failed",
                    status: "fail",
                    message:
                      "unable to verify your code, please enter correct one",
                  });
                }
              }
            } catch (error: any) {
              ShowToast({
                status: "fail",
                title: "Error occurred",
                message: error?.message ?? "Code sending failed, try again!",
              });
            } finally {
              setIsVerifying(false);
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            resetForm,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <fieldset>
                {step === "phone" && (
                  <div className="mb-5 flex flex-col">
                    <label
                      htmlFor="phoneNumberInput"
                      className="mb-1.5 text-gray-500"
                    >
                      phone number
                    </label>
                    <div className="relative flex h-11 flex-col">
                      <PhoneInput
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone number"
                        defaultCountry="US"
                        value={values.phoneNumber}
                        onBlur={handleBlur}
                        international={false}
                        onChange={(value) =>
                          setFieldValue("phoneNumber", value)
                        }
                      />
                      {errors.phoneNumber && touched.phoneNumber && (
                        <p className="ml-1 text-xs text-orange-700">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === "code" && (
                  <>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-gray-700">
                        Code sent to: <b>{enteredPhone}</b>
                      </span>
                      <button
                        type="button"
                        className="text-sm text-cyan-600 underline"
                        onClick={() => {
                          setStep("phone");
                          setEnteredPhone(null);
                          resetForm();
                        }}
                      >
                        Change phone
                      </button>
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="codeInput"
                        className="mb-0.5 text-gray-500"
                      >
                        Code
                      </label>
                      <input
                        type="text"
                        name="code"
                        id="codeInput"
                        className="rounded-md border-gray-300 shadow-sm outline-none drop-shadow-sm focus:border-cyan-600"
                        value={values.code}
                        placeholder="Enter verification code"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        disabled={!enteredPhone}
                      />
                      <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                        {errors.code && touched.code && errors.code}
                      </p>
                    </div>
                  </>
                )}

                <div id="recaptcha-container" className="my-5" />

                {step === "code" && (
                  <div className="flex items-center justify-center">
                    <p></p>
                    <button
                      type="button"
                      onClick={() => resendSms(values.phoneNumber)}
                      disabled={Boolean(
                        expireTime &&
                          dayjs(expireTime).isValid() &&
                          currentTime.isBefore(dayjs(expireTime)),
                      )}
                      className={`mt-5 flex flex-row items-center gap-1.5 text-center text-base font-semibold not-italic leading-6 tracking-[0.5px] text-cyan-600 ${
                        Boolean(
                          expireTime &&
                            dayjs(expireTime).isValid() &&
                            currentTime.isBefore(dayjs(expireTime)),
                        ) && "cursor-not-allowed text-cyan-200"
                      }`}
                    >
                      Resend code {resendLoader && <LoadingCircle />}
                      {Boolean(
                        expireTime &&
                          dayjs(expireTime).isValid() &&
                          currentTime.isBefore(dayjs(expireTime)),
                      )
                        ? `${dayjs(expireTime).diff(currentTime, "second")}s`
                        : null}
                    </button>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-cyan-600 py-3 text-center font-medium text-white hover:bg-cyan-700"
                    disabled={
                      isSubmitting || (step === "code" && !enteredPhone)
                    }
                  >
                    <span className="flex items-center justify-center gap-1">
                      {isVerifying ? (
                        <p>
                          {step === "phone" ? "Sending..." : "Verifying..."}
                        </p>
                      ) : (
                        <p>{step === "phone" ? "Send code" : "Verify code"}</p>
                      )}
                      {isVerifying && <LoadingCircle />}
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
