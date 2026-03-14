import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit2 } from "lucide-react";
import { IncomingMessage } from "http";
import { CreditCard, Plus } from "lucide-react";
import { AiOutlineDelete } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { getSession, useSession } from "next-auth/react";

import { Loading } from "@/components/shared/loading";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import useFetcher from "@/lib/hooks/use-axios";
import Meta from "@/components/layout/meta";
import Card from "@/components/card";

export default function Index(props: any) {
  const stripeCustomerId = props.stripeCustomerId;
  const { fetchWithAuth, data, loading, error } = useFetcher();
  const [refresh, setRefresh] = useState(true);

  const { data: session } = useSession();

  const addPaymentHn = () => {};

  useEffect(() => {
    if (!session?.token) return;

    fetchWithAuth("user/getMethods");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token, refresh]);

  const refreshHn = () => {
    setRefresh((r) => !r);
  };

  let cardListDisplayEl = <></>;

  if (loading || (!data && !error)) {
    cardListDisplayEl = (
      <div key="loading-card" className="mt-0">
        <Loading />
      </div>
    );
  }

  if (error) {
    cardListDisplayEl = (
      <div
        key="error-card"
        className="mr-4 h-12 items-center justify-center text-3xl text-red-500"
      >
        Error fetching your Payment lists
      </div>
    );
  }

  if (data && data.length === 0) {
    cardListDisplayEl = (
      <div
        key="no-card"
        className="mx-4 mb-10 flex h-14 justify-center text-center text-lg text-orange-400 sm:text-xl md:text-2xl lg:text-3xl"
      >
        You haven&apos;t added any payment methods for later use.
      </div>
    );
  }

  if (data && data.length > 0) {
    cardListDisplayEl = (
      <div className="mx-10 mb-10 flex flex-row flex-wrap gap-6" key="has-card">
        {data.map((card: any, index: number) => (
          <div
            key={card.id}
            className="group relative flex w-fit min-w-[260px] max-w-xs flex-col gap-0"
          >
            <div className="flex h-20 items-end rounded-t-[20px] bg-[#8ECAE6] pb-3 pl-4 text-base font-semibold leading-[19px] text-white shadow-[8px_10px_16px_rgba(0,0,0,0.05)] backdrop-blur-[6px]">
              Savings Account
            </div>

            <div className="absolute hidden h-full w-full rounded-[20px] text-center group-hover:flex group-hover:backdrop-blur-sm">
              <div className="m-auto flex flex-row gap-4 text-center">
                <button className="rounded-lg border border-solid border-[#219EBC] bg-[#219EBC] shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
                  <Edit2 size="20" className="m-2 text-white" />{" "}
                </button>
                <button className="rounded-lg border border-solid border-[#EF4444] bg-[#EF4444] shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
                  <AiOutlineDelete className="m-2 h-[20px] w-[20px] text-white" />
                </button>
              </div>
            </div>

            <div className="flex h-28 flex-col justify-end rounded-b-[20px] bg-gray-700 pb-4 pl-4 pr-3">
              <p className="font-manrope text-xs font-semibold uppercase not-italic leading-4 tracking-wider text-white">
                {card?.card?.funding}
              </p>
              <div className="flex flex-row items-center justify-between gap-9">
                <p className="mb-2 font-manrope text-base font-semibold leading-[22px] tracking-[0.15em] text-white">
                  ******** : ****{card?.card?.last4}
                </p>
                <div className="rounded bg-[rgba(255,255,255,0.1)]">
                  <CreditCard
                    width="30"
                    height="18"
                    className="m-2 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-20 flex min-h-screen flex-col">
      <Meta title="payments" />

      <Header {...props}>
        <Link href="/" className="ml-6 text-sm font-bold text-cyan-600">
          Home
        </Link>
      </Header>
      <AnimatePresence>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-6 mb-6 mt-5 flex flex-col items-center justify-between sm:mx-12 sm:flex-row"
        >
          <div className="text-center sm:text-start">
            <p className="text-3xl font-medium text-gray-900">Payments</p>
            <p className="mb-4 whitespace-pre-wrap text-gray-500">
              Track and Manage your payments at one place
            </p>
          </div>
          <Card
            prompt="title"
            data="description"
            confirmHandler={addPaymentHn}
            description="large"
            stripeCustomerId={stripeCustomerId}
            refreshHn={refreshHn}
          >
            <button className="flex h-fit w-fit flex-row items-center justify-center gap-1 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white sm:gap-2 sm:px-3">
              <Plus size="20" /> Add Payment Card
            </button>
          </Card>
        </motion.div>
        {cardListDisplayEl}
      </AnimatePresence>
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
