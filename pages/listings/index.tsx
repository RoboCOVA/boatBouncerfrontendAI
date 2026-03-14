import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { IncomingMessage } from "http";
import { getSession, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddListing from "@/components/listing/add";
import DisplayListings from "@/components/listing/display";
import Meta from "@/components/layout/meta";
import { ShowToast } from "@/components/shared/CustomToast";
import useFetcher from "@/lib/hooks/use-axios";

export default function Index(props: any) {
  const [enableAddList, setEnableAddList] = useState(false);

  const { data: session } = useSession();
  const { Axios, fetchWithAuthSync } = useFetcher();

  const addListingHandler = (status: boolean) => {
    setEnableAddList(status);
  };

  let listingEl = <DisplayListings addListingsHn={addListingHandler} />;

  if (enableAddList) {
    listingEl = <AddListing cancelHn={addListingHandler} />;
  }

  useEffect(() => {
    if (!session?.token) return;

    fetchWithAuthSync("/user/current")
      .then()
      .catch((error) => {
        if (error?.response?.status === 401) {
          ShowToast({
            status: "fail",
            title: "Error",
            message: "Session expired",
          });
          signOut({ callbackUrl: "/user/login" });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const mode = queryParams.get("mode");

      if (mode === "create") {
        setEnableAddList(true);
      } else {
        setEnableAddList(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof window]);

  return (
    <div className="mt-20 flex min-h-screen flex-col ">
      <Meta title="listings" />

      <Header {...props}>
        <Link href="/" className="ml-6 text-sm font-bold text-cyan-600">
          Home
        </Link>
      </Header>
      <main className="my-4 sm:mt-8">{listingEl}</main>
      <Footer />
    </div>
  );
}

export async function getServerSideProps({
  req,
}: {
  req: IncomingMessage | undefined;
}) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...session,
    }, // will be passed to the page component as props
  };
}
