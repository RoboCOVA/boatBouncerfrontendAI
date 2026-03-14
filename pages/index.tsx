import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { getSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useRef, useState } from "react";

import dynamic from "next/dynamic";
import Meta from "@/components/layout/meta";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import SearchResults from "@/components/searchResults";
import { useRouter } from "next/router";
import { BiExpandAlt } from "react-icons/bi";
import useWindowSize from "@/lib/hooks/use-window-size";
import MapWithClustering from "@/components/Map/MapWithClustering";

const AddressAutoFill = dynamic(
  async () => await import("../components/search/home"),
  {
    suspense: true,
    ssr: false,
  },
);

export default function Home(props: any) {
  const mainRef = useRef<HTMLElement | null>(null);
  const { data, error } = props;
  const [expanded, setExpanded] = useState(true);

  const router = useRouter();
  const { address, city, state } = router.query;
  const { isTablet } = useWindowSize();

  let element = null;
  let intialText = "Discover our latest boats ready for your next adventure";

  if (data?.data && data?.total && data?.total > 0) {
    element = <SearchResults boats={data.data} total={data.total} />;
  }

  if (error) {
    element = (
      <div className="m-5 my-5 flex flex-col gap-1.5">
        <motion.p className="items-center justify-start text-start text-xl font-semibold text-orange-400 sm:min-w-[320px]">
          Oops! Something went wrong.
        </motion.p>
        <motion.p className="mx-0.5 items-center justify-start text-start font-semibold text-gray-600 sm:min-w-[320px]">
          Please try again later.
        </motion.p>
      </div>
    );
  }

  if (Object.keys(router.query).length === 0 && data?.data?.length === 0) {
    intialText = "There aren't any boats registred yet!";
  }

  if (
    data &&
    (data?.data?.length === 0 || data?.length === 0) &&
    Object.keys(router.query).length > 0
  ) {
    element = (
      <div className="m-5 my-5 flex flex-col gap-1.5">
        <motion.p className="items-center justify-start text-start text-xl font-semibold text-orange-400 sm:min-w-[320px]">
          No Matching Boats Found!
        </motion.p>
        <motion.p className="mx-0.5 items-center justify-start text-start font-semibold text-gray-600 sm:min-w-[320px]">
          Try searching with different parameters.
        </motion.p>
      </div>
    );
  }

  return (
    <main
      ref={mainRef}
      id="mainPage"
      className="flex min-h-screen flex-col overflow-hidden duration-[0.5s]"
    >
      <Meta
        title="boatbouncer"
        description="Welcome to BoatBouncer, your premier destination for boat rentals and water activities! Whether you are looking to explore the open waters, enjoy a day out with friends and family, or simply want to relax and take in the scenery, we have the perfect options for you. So if you're ready to hit the water and experience and start your adventure, come to BoatBouncer. We look forward to providing you with a memorable and enjoyable experience that you'll never forget."
      />
      <div className="relative left-0 right-0 top-0 duration-500">
        <AnimatePresence>
          <motion.div className="relative my-0 flex h-full flex-col lg:h-screen lg:flex-row-reverse">
            <div
              className={`relative w-full 
            lg:h-screen lg:w-2/3 lg:overflow-hidden lg:bg-gray-100 ${
              expanded ? "lg:!w-2/3" : "!w-full"
            } ${isTablet ? "w-full" : ""}`}
            >
              <MapWithClustering data={data} />
              {/* <MapContainer data={data} /> */}
              <BiExpandAlt
                size={44}
                onClick={() => setExpanded(!expanded)}
                className="bottom-1.5 right-1.5 z-50 hidden cursor-pointer rounded-full border-2 border-cyan-600 bg-white p-2.5 text-cyan-600 lg:absolute lg:block"
              />
            </div>
            <motion.div
              className={`h-auto w-full overflow-hidden py-5 transition-all duration-150 lg:mt-20 lg:shadow-xl lg:drop-shadow-xl ${
                expanded
                  ? "lg:w-1/3 lg:min-w-[26.5rem] xl:min-w-[28rem]"
                  : "!w-0 lg:min-w-0"
              } ${isTablet ? "w-full" : ""}`}
            >
              {!error ? (
                Object.keys(router.query).length > 0 ? (
                  <div>
                    {data?.total && (address || city || state) && (
                      <p className="mx-4 mt-5 font-manrope text-lg font-semibold">
                        {data?.total ? data.total : 0}
                        {data?.total > 1 ? " boats" : " boat"} in{" "}
                        {address ? `${address}` : ""}
                        {city ? `${address ? "," : ""} ${city}` : ""}
                        {state ? `${city ? "," : ""} ${state}` : ""}
                      </p>
                    )}
                    {data?.total && !(address || city || state) && (
                      <p className="mx-4 mt-5 font-manrope text-xl font-medium tracking-widest">
                        {data?.total ? data.total : 0}
                        {data?.total > 1 ? " boats" : " boat"} are found!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-6 sm:py-2.5">
                    <h2 className="mb-3 text-lg font-semibold text-gray-800 sm:text-xl">
                      Welcome to BoatBouncer
                    </h2>
                    <p className="text-xs text-gray-600 sm:text-base">
                      {intialText}
                    </p>
                  </div>
                )
              ) : null}
              <div className="boat-wrapper flex h-full flex-col overflow-y-scroll px-2.5 lg:h-[calc(100vh-13rem)]">
                {element}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute left-0 right-0 top-0">
          <Header {...props} page="home"></Header>
        </div>

        <motion.div className="absolute left-1/2 top-[9.25rem] z-30 w-[95%] -translate-x-1/2 -translate-y-1/2 sm:left-[43.5%] sm:w-4/5 md:w-2/3 lg:left-[62.5%] lg:w-1/3 xl:left-[57.5%]">
          {/* <motion.p className="text-center text-4xl font-bold md:text-6xl">
            <span className="text-white">Happiness is a way </span>
            <span className="text-cyan-600">of travel</span>
          </motion.p>

          <motion.p className="home-sub__header mb-14 mt-2 text-center font-sans text-4xl font-bold sm:mt-3 md:text-6xl">
            Not a destination
          </motion.p> */}

          <Suspense fallback="Loading. . .">
            <AddressAutoFill page="home" />
          </Suspense>
        </motion.div>
      </div>

      {/* <Announce /> */}
      {/* <Section /> */}
      <Footer />
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let data: any = null;
  let error: boolean | null = null;

  const { req, query } = context;

  const queryString = new URLSearchParams(
    query as Record<string, string>,
  ).toString();

  const session: Session | null = await getSession({ req });

  try {
    const myHeaders = new Headers();

    myHeaders.append("Authorization", "Bearer " + session?.token);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}boat?${queryString}`,
      requestOptions,
    );

    data = await data.json();

    if (!data) {
      error = true;
    }
  } catch (err) {
    error = true;
  }

  return {
    props: {
      ...session,
      data: Array.isArray(data) ? data[0] : [],
      error,
    },
  };
}
