import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";

export default function NotFoundPage(props: any) {
  const session = useSession();
  const { data } = session || {};

  return (
    <div className="flex min-h-screen flex-col ">
      <Header {...data} />
      <section className="mt-10 w-full flex-grow bg-gray-200 py-10 text-center text-gray-900">
        <h1 className="my-5 text-2xl font-semibold lg:text-3xl">
          Oops, page is not found!
        </h1>
        <h1 className="text-lg font-semibold lg:text-xl">
          Link to{" "}
          <Link
            href={"/"}
            className="mx-1 rounded bg-gray-300 px-2 text-cyan-600"
          >
            Home Page
          </Link>{" "}
        </h1>
      </section>
      <Footer />
    </div>
  );
}
