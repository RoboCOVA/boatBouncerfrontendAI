import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { ShowToast } from "@/components/shared/CustomToast";
import { ERROR_MESSAGES } from "@/lib/constants";
import Header from "@/components/shared/header";

const Spinner = () => (
  <div className="flex items-center justify-center">
    <svg
      className="h-10 w-10 animate-spin text-cyan-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  </div>
);

const OAuthSuccess = () => {
  const router = useRouter();
  const { id, provider } = router.query;

  useEffect(() => {
    const verifyUser = async () => {
      if (!id || !provider) return;

      try {
        const status = await signIn("credentials", {
          redirect: false,
          id: id,
          provider: provider,
          callbackUrl: "/",
        });

        if (status?.ok && status?.url) {
          Router.push({
            pathname: status?.url,
          });
        } else {
          let errorType = status?.error;
          let facebookId = id;
          try {
            const parsed = JSON.parse(status?.error as any);
            errorType = parsed.type;
            facebookId = parsed.facebookId;
          } catch (e) {
            // fallback: error is not JSON
          }

          if (errorType === ERROR_MESSAGES.USER_NOT_VERIFIED) {
            Router.push({
              pathname: "/user/verify-account",
              query: {
                id: facebookId,
                provider,
              },
            });
          } else {
            ShowToast({
              title: "signing failed",
              status: "fail",
              message: "signing failed, please refresh",
            });
          }
        }
      } catch (error) {
        ShowToast({
          status: "fail",
          title: "verification failed",
          message: "Error verifying user",
        });
      }
    };

    verifyUser();
  }, [id, provider]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
      <div className="flex flex-col items-center rounded-xl bg-white p-8 shadow-lg">
        <Spinner />
        <h1 className="mt-6 text-xl font-semibold text-cyan-700 md:text-2xl">
          Verifying your account…
        </h1>
        <p className="mt-2 max-w-xs text-center text-gray-500">
          Please wait while we verify your account and redirect you. This should
          only take a moment.
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
