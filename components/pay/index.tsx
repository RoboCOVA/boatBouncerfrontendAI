import React, { ReactNode, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./index.module.css";
import useFetcher from "@/lib/hooks/use-axios";
import { useSession } from "next-auth/react";
import Preview from "../offer/preview";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { useStripe } from "@stripe/react-stripe-js";
import Link from "next/link";
import { LoadingCircle } from "../shared/icons";

const Pay = ({
  children,
  bookmarks,
}: {
  children: ReactNode;
  bookmarks: any;
}) => {
  const { fetchWithAuth, loading, data, error, fetchWithAuthSync } =
    useFetcher();

  const [paymentStatus, setPaymentStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });

  const { data: session } = useSession();
  const [value, setValue] = useState("");
  const stripe = useStripe();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!session?.token) return;

    fetchWithAuth("user/getMethods");
  }, [session?.token]);

  const reset = (timer: number) => {
    setTimeout(() => {
      if (cancelRef.current) cancelRef.current.click();
    }, timer);
  };

  const completePaymentHn = () => {
    setPaymentStatus({ loading: true, error: false, success: false });
    fetchWithAuthSync("/intent", {
      description: "boatRenting",
      metadata: {
        offerId: bookmarks.offerId._id,
      },
    })
      .then(async (response) => {
        try {
          const confirmPayment = await stripe?.confirmCardPayment(
            response.data.client_secret,
            {
              payment_method: value,
            },
          );
          if (confirmPayment?.paymentIntent) {
            setPaymentStatus({ loading: false, error: false, success: true });
            setTimeout(() => {
              if (cancelRef.current) cancelRef.current.click();
            }, 1500);
          } else {
            setPaymentStatus({ loading: false, error: true, success: false });
            reset(1500);
          }
        } catch (error) {
          setPaymentStatus({ loading: false, error: true, success: false });
          reset(1500);
        }
      })
      .catch((error) => {
        setPaymentStatus({ loading: false, error: true, success: false });
        reset(1500);
      });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles["DialogOverlay"]} />
        <Dialog.Content
          className={`${styles["DialogContent"]} w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3`}
        >
          <Dialog.Title className="flex flex-row justify-between">
            <div className="w-full text-center sm:text-start">
              <p className="flex flex-col text-3xl font-medium leading-[38px] text-[#101828]">
                Make Payment
              </p>
              <p className="text-base font-normal leading-6 text-[#667085]">
                Start your payment for you booking
              </p>
            </div>
          </Dialog.Title>
          <div className={styles["DialogDescription"]}>
            <Preview
              source="pay"
              {...bookmarks?.offerId}
              type={bookmarks.type}
              className="bg-white px-4"
            />

            {data && Boolean(data?.length) && !loading && !error && (
              <div className="flex">
                <button
                  id="states-button"
                  data-dropdown-toggle="dropdown-states"
                  className="z-10 inline-flex flex-shrink-0 items-center rounded-l-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                  type="button"
                >
                  Savings Account
                </button>

                <label htmlFor="states" className="sr-only">
                  Choose your Account
                </label>
                <select
                  id="states"
                  className="block w-full rounded-r-lg border border-l-2 border-gray-300 border-l-gray-100 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:border-l-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  onChange={(event) => {
                    setPaymentStatus({
                      loading: false,
                      error: false,
                      success: false,
                    });
                    setValue(event.target.value);
                  }}
                >
                  <option defaultValue="">Choose your Account</option>
                  {data.map((account: any) => (
                    <option key={account.id} value={account.id}>
                      * * * * * * * * {account.card.last4}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {data && !Boolean(data?.length) && !loading && !error && (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 px-2 py-6">
                <p className="text-center text-sm leading-5 text-gray-800">
                  No Cards Found
                </p>
                <p className="text-center text-xs font-light leading-4 text-gray-800">
                  Please create your card to make a payment
                </p>
                <Link
                  href={"/payments"}
                  className="flex h-9 flex-row items-center justify-center gap-2 rounded-lg border border-solid border-[#219EBC] bg-[#219EBC] px-3.5 py-2 text-sm font-medium leading-5 text-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                >
                  Create Card
                </Link>
              </div>
            )}

            <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row">
              <Dialog.Close asChild>
                <button
                  ref={cancelRef}
                  className="flex h-fit w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid bg-white px-3.5 py-2 text-base font-medium leading-6 text-gray-700 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:w-1/2"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={completePaymentHn}
                type="submit"
                className="flex h-fit w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-[#219EBC] bg-[#219EBC] px-3.5 py-2 font-medium  leading-6 text-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:w-1/2"
              >
                <span>
                  {!paymentStatus.error && paymentStatus.loading && (
                    <LoadingCircle />
                  )}
                </span>
                <span>
                  {paymentStatus.error && !paymentStatus.loading && (
                    <XCircle color="red" />
                  )}
                </span>
                <span>
                  {!paymentStatus.error &&
                    !paymentStatus.loading &&
                    paymentStatus.success && <CheckCircle2 />}
                </span>
                <span>
                  {!paymentStatus.error &&
                    !paymentStatus.loading &&
                    !paymentStatus.success && <Circle />}
                </span>
                Complete Payment
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Pay;
