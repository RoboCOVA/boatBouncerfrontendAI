import Header from "@/components/shared/header";
import Link from "next/link";

const OAuthFailure = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="flex flex-col items-center rounded-xl bg-white p-8 shadow-lg">
        <svg
          className="mb-4 h-12 w-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        <h1 className="mt-2 text-2xl font-semibold text-red-700">
          OAuth Sign-in Failed
        </h1>
        <p className="mt-2 max-w-xs text-center text-gray-500">
          Sorry, we couldn&apos;t sign you in with your provider. This may be a
          temporary issue or you may have denied access.
        </p>
        <Link href="/user/login" legacyBehavior>
          <a className="mt-6 inline-block rounded bg-red-600 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-red-700">
            Back to Login
          </a>
        </Link>
      </div>
    </div>
  );
};

export default OAuthFailure;
