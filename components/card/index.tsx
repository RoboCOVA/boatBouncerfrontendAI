import React, { ReactNode, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./index.module.css";
import { Circle } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { accountInfos, billingInfos } from "./infos";
import { useDispatch, useSelector } from "react-redux";
import { updateCard } from "features/card/cardSlice";

import {
  CardElement,
  useElements,
  useStripe,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  AddressElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import {
  BillingDetails,
  StripeCardCvcElementChangeEvent,
  StripeCardElement,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
} from "@stripe/stripe-js";
import dayjs from "dayjs";
import useFetcher from "@/lib/hooks/use-axios";
import { StripeElementChangeEvent } from "@stripe/stripe-js";

const Card = ({
  children,
  stripeCustomerId,
  prompt,
  data,
  description,
  confirmHandler,
  refreshHn,
}: {
  children: ReactNode;
  prompt: string;
  confirmHandler: Function;
  data: string;
  description: string;
  stripeCustomerId: string;
  refreshHn: () => void;
}) => {
  const cardInfo = useSelector((state: any) => state.card.cardInfo);
  const [save, setSave] = useState(false);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const { attachPaymentCard, getPaymentCards } = useFetcher();

  const [numError, setNumError] = useState<StripeElementChangeEvent["error"]>();
  const [cvcError, setCvcError] = useState<StripeElementChangeEvent["error"]>();
  const [expiryError, setExpiryError] =
    useState<StripeElementChangeEvent["error"]>();

  const stripe = useStripe();
  const elements = useElements();

  const handleCardSumbit = async (event?: any) => {
    event?.preventDefault();
    const cardElement: any = elements?.getElement(CardNumberElement);

    const addressElement = elements?.getElement("address");

    const address = await addressElement?.getValue();
    const value: any = address?.value;

    const paymentMethod: any = await stripe?.createPaymentMethod({
      type: "card",
      card: cardElement as StripeCardElement,
      billing_details: value,
    });

    if (paymentMethod?.paymentMethod?.id) {
      attachPaymentCard("user/attachMethod/" + paymentMethod?.paymentMethod?.id)
        .then(() => {
          setSave(true);
          setTimeout(() => {
            refreshHn();
            if (!cancelRef.current) return;
            cancelRef.current.click();
          }, 1000);
        })
        .catch((error: any) => console.log(error));
    }
  };

  const onCardNumberChange = (e: StripeCardNumberElementChangeEvent) => {
    setNumError(e.error);
  };

  const onCardCvcChange = (e: StripeCardCvcElementChangeEvent) => {
    setCvcError(e.error);
  };

  const onCardExpiryChange = (e: StripeCardExpiryElementChangeEvent) => {
    setExpiryError(e.error);
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
                Add Card
              </p>
              <p className="text-base font-normal leading-6 text-[#667085]">
                Add a new card to your cards list
              </p>
            </div>
            <div className="hidden flex-row gap-3 sm:flex">
              <Dialog.Close asChild>
                <button
                  ref={cancelRef}
                  className="flex h-fit flex-row items-center justify-center gap-2 rounded-lg border border-solid bg-white px-3.5 py-2 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                form="card-form"
                className="flex h-fit w-fit flex-row items-center justify-center gap-2 rounded-lg border border-solid border-[#219EBC] bg-[#219EBC] px-3.5 py-2 text-sm font-medium leading-5 text-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
              >
                <Circle size="20" />{" "}
                <span className="whitespace-nowrap">
                  {save ? "Saved" : "Save Card"}
                </span>
              </button>
            </div>
          </Dialog.Title>
          <div className={styles["DialogDescription"]}>
            <form id="card-form" onSubmit={handleCardSumbit}>
              <CardNumberElement
                onChange={(e) => onCardNumberChange(e)}
                className={`my-0 mb-2 mt-[10px] block rounded-md border-2 border-solid bg-[#fafafa] px-[14px] py-[10px] transition-all duration-150 ${
                  numError ? "border-[#d44e4e]" : " border-[#e2e8f0]"
                }`}
              />
              {numError && (
                <span id="card-errors" role="alert" className="text-[#d44e4e]">
                  {numError?.message}
                </span>
              )}

              <div className="flex w-full flex-col sm:flex-row sm:gap-4">
                <div className="w-full sm:w-1/2">
                  <CardCvcElement
                    onChange={(e) => onCardCvcChange(e)}
                    className={`${
                      cvcError ? "border-[#d44e4e]" : " border-[#e2e8f0]"
                    } my-0 mb-2 mt-[10px] block w-full rounded-md border-2 border-solid border-[#e2e8f0] bg-[#fafafa] px-[14px] py-[10px] transition-all duration-150`}
                  />
                  {numError && (
                    <span
                      id="card-errors"
                      role="alert"
                      className="text-[#d44e4e]"
                    >
                      {cvcError?.message}
                    </span>
                  )}
                </div>

                <div className="w-full sm:w-1/2">
                  <CardExpiryElement
                    onChange={(e) => onCardExpiryChange(e)}
                    className={`${
                      expiryError ? "border-[#d44e4e]" : " border-[#e2e8f0]"
                    } my-0 mb-2 mt-[10px] block w-full rounded-md border-2 border-solid border-[#e2e8f0] bg-[#fafafa] px-[14px] py-[10px] transition-all duration-150`}
                  />
                  {numError && (
                    <span
                      id="card-errors"
                      role="alert"
                      className="text-[#d44e4e]"
                    >
                      {expiryError?.message}
                    </span>
                  )}
                </div>
              </div>
              {/* </div> */}
              <div className="my-4 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                <p className="text-base font-bold leading-6 text-[#101828] ">
                  Billing Information
                </p>
              </div>
              <hr className="my-4 h-px w-full bg-gray-200" />

              <AddressElement options={{ mode: "shipping" }} />

              <div className="mt-4 flex flex-col gap-4 sm:hidden">
                <Dialog.Close asChild>
                  <button
                    ref={cancelRef}
                    className="flex h-fit flex-row items-center justify-center gap-2 rounded-lg border border-solid bg-white px-3.5 py-2 text-base font-medium leading-6 text-gray-700 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="flex h-fit w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-[#219EBC] bg-[#219EBC] px-3.5 py-2  font-medium leading-6 text-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                >
                  {save ? "Created" : "Create Card"}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Card;
