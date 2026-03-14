import BaseLayout from "@/components/auth/base";
import Meta from "@/components/layout/meta";
import { ShowToast } from "@/components/shared/CustomToast";
import { LoadingCircle } from "@/components/shared/icons";
import { auth } from "@/lib/config";
import { poster } from "@/lib/utils";
import { Alert } from "@material-tailwind/react";
import dayjs from "dayjs";
import { RecaptchaVerifier } from "firebase/auth";
import { Formik } from "formik";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const initNotification = {
  time: "",
  message: "",
};

function Index() {
  const router = useRouter();
  const { query } = router;
  const { phoneNumber, encryption } = query;
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [verificationError, setVerificationError] = useState<any>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | undefined | null>();
  const [notification, setNotification] = useState(initNotification);
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    if (phoneNumber) return;
    Router.push({
      pathname: "/user/login",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!notification.time) return;

    const timer = setInterval(() => {
      // Creates an interval which will update the current data every minute
      // This will trigger a rerender every component that uses the useDate hook.
      setCurrentTime(dayjs());
    }, 1000);

    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    };
  }, [notification.time]);

  const handleResetCode = async () => {
    // let resendSms = await poster()
    setResendLoader(true);

    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible", // this property is important otherwise the captcha will be displayed on the screen
        },
        auth,
      );
    }

    recaptchaRef.current
      .verify()
      .then(async (token: string) => {
        try {
          const response = await poster("user/resendSms", {
            phoneNumber,
            recaptchaToken: token,
          });

          if (typeof response !== "string") {
            setNotification({
              time: "",
              message: "A verification code is sent to your phone",
            });

            setTimeout(() => {
              setNotification(initNotification);
            }, 4000);
          } else {
            if (typeof response == "string") {
              setNotification({
                time: response,
                message: "A verification code is sent to your phone",
              });

              setTimeout(() => {
                setNotification(initNotification);
              }, 4000);
            }
          }

          setResendLoader(false);
        } catch (error: any) {
          setVerificationError(
            error?.message ?? "Resending failed, try again!",
          );
          setResendLoader(false);
          setNotification(initNotification);
        }
      })
      .catch((error: any) => {
        setResendLoader(false);
        setVerificationError(error?.message ?? "Resending failed, try again!");
      })
      .finally(() => {
        recaptchaRef.current = null;
      });
  };

  return (
    <>
      <Meta title="verify" />

      <BaseLayout
        action="Verify your phone number"
        prompt={`We have sent verification code to your phone number number`}
      >
        <Formik
          initialValues={{ phoneNumber: phoneNumber, code: "" }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setIsVerifying(true);
              setVerificationError(null);
              setSubmitting(true);
              const verifiedSms = await poster("user/validateResetOTP", {
                phoneNumber: values.phoneNumber,
                verificationCode: values.code,
                encryption: encryption,
              });

              if (typeof verifiedSms == "string") {
                Router.push({
                  pathname: "/user/password/new",
                  query: { encryption: verifiedSms },
                });
              } else {
                setVerificationError("Invalid code or unknown error");
              }
            } catch (error) {
              ShowToast({
                title: "Error",
                message: "Invalid code or unknown error",
                status: "fail",
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
                <div className="mb-5 flex min-w-[240px] flex-col">
                  <label htmlFor="phoneNumberInput">Phone Number</label>
                  <input
                    className="rounded-md border-gray-300 shadow-sm outline-none drop-shadow-sm focus:border-cyan-600"
                    name="phoneNumber"
                    type="tel"
                    id="phoneNumberInput"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onBlur={handleBlur}
                    readOnly
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="codeInput">Code</label>
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
                  />
                  <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                    {errors.code && touched.code && errors.code}
                  </p>
                </div>

                <div className="mt-6 ">
                  {verificationError && (
                    <div className="text-center text-orange-700">
                      {verificationError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full rounded-md bg-cyan-600 py-3 text-center font-medium text-white hover:bg-cyan-700 active:active:translate-y-[1.5px]"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <p>Reset Password</p>
                      {isVerifying && <LoadingCircle />}
                    </span>
                  </button>
                  <div className="flex items-center justify-center">
                    <p></p>
                    <div id="recaptcha-container"></div>
                    <button
                      onClick={handleResetCode}
                      disabled={Boolean(
                        notification.time &&
                          dayjs(notification.time).isValid() &&
                          currentTime.isBefore(dayjs(notification.time)),
                      )}
                      type="button"
                      className={`mt-5 flex flex-row items-center gap-1.5 text-center text-base font-semibold not-italic leading-6 tracking-[0.5px] text-cyan-600 ${
                        Boolean(
                          notification.time &&
                            dayjs(notification.time).isValid() &&
                            currentTime.isBefore(dayjs(notification.time)),
                        ) && "cursor-not-allowed text-cyan-200"
                      }`}
                    >
                      Resend code {resendLoader && <LoadingCircle />}{" "}
                      {Boolean(
                        notification.time &&
                          dayjs(notification.time).isValid() &&
                          currentTime.isBefore(dayjs(notification.time)),
                      )
                        ? `${dayjs(notification.time).diff(
                            currentTime,
                            "second",
                          )}s`
                        : null}
                    </button>
                  </div>
                  {(notification.message || notification.time) && (
                    <Alert
                      variant="outlined"
                      className="mx-auto mt-2 flex justify-center"
                    >
                      {notification.message}
                    </Alert>
                  )}
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
