import React, { ReactNode, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateType } from "react-tailwindcss-datepicker/dist/types";
import { addHours } from "date-fns";

import styles from "./index.module.css";
import Preview from "./preview";
import useFetcher from "@/lib/hooks/use-axios";
import SyncLoading from "../shared/syncLoading";
import { ShowToast } from "../shared/CustomToast";

const Offer = ({
  children,
  bookId,
  type,
  boatPrice,
  captainPrice,
  // paymentServiceFee,
  departureDate,
  returnDate,
  offerType,
  _id,
  bookmarks,
  setRefreshHn,
}: {
  children: ReactNode;
  bookId: string;
  type?: string;
  boatPrice: string;
  captainPrice: string;
  // paymentServiceFee: string;
  departureDate?: DateType;
  returnDate?: DateType;
  offerType: string;
  _id?: string;
  bookmarks: any;
  setRefreshHn?: () => void;
}) => {
  const [currency, setCurrency] = useState("USD");
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const { fetchWithAuthSync, updateOffer } = useFetcher();
  const [isOffering, setIsOffering] = useState(false);

  const [price, setPrice] = useState({
    boatPrice: boatPrice ? boatPrice : bookmarks.renterPrice,
    captainPrice: captainPrice,
    // paymentServiceFee: paymentServiceFee,
  });

  const [startDate, setStartDate] = useState<Date | null>(
    new Date(bookmarks.duration.start),
  );

  const [endDate, setEndDate] = useState<Date | null>(
    new Date(bookmarks.duration.end),
  );

  const filterPassedStartTime = (time: Date) => {
    const currentDate = addHours(new Date(), 1);
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  useEffect(() => {
    setStartDate(new Date(bookmarks.duration.start));
    setEndDate(new Date(bookmarks.duration.end));

    setPrice({
      boatPrice: boatPrice ? boatPrice : bookmarks.renterPrice,
      captainPrice: captainPrice,
      // paymentServiceFee: paymentServiceFee,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarks]);

  const filterPassedEndTime = (time: Date) => {
    const currentDate = addHours(
      startDate ? new Date(startDate) : new Date(),
      0.5,
    );
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const handlePriceChange = (key: string, value: string | number) => {
    setPrice({ ...price, [key]: value });
  };

  const submitOfferHn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const offer = {
      bookId,
      boatPrice: Number(price.boatPrice),
      captainPrice: Number(price.captainPrice),
      // paymentServiceFee: Number(price.paymentServiceFee),
      localTax: 20.4,
      returnDate: endDate,
      departureDate: startDate,
    };

    if (offerType == "create") {
      setIsOffering(true);
      fetchWithAuthSync("/offer", offer)
        .then(() => {
          ShowToast({
            title: "Offer Created",
            message: "offer created succesfully",
            status: "success",
          });
          setRefreshHn?.();
          if (closeRef.current) closeRef.current.click();
        })
        .catch(() => {
          ShowToast({
            title: "Offer Failed",
            message: "offer creation failed",
            status: "fail",
          });
        })
        .finally(() => {
          setIsOffering(false);
        });
    } else if (offerType == "update" && _id) {
      setIsOffering(true);
      updateOffer(`/offer/${_id}`, offer)
        .then(() => {
          ShowToast({
            title: "Offer Updated",
            message: "offer updated succesfully",
            status: "success",
          });
          setRefreshHn?.();
          if (closeRef.current) closeRef.current.click();
        })
        .catch(() => {
          ShowToast({
            title: "Offer Failed",
            message: "offer updation failed",
            status: "fail",
          });
        })
        .finally(() => {
          setIsOffering(false);
        });
    }
  };

  useEffect(() => {
    setPrice((price) => ({
      ...price,
      paymentServiceFee: `${(
        (Number(price.boatPrice) + Number(price.captainPrice)) *
        0.075
      ).toFixed(2)}`,
    }));
  }, [price.boatPrice, price.captainPrice]);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles["DialogOverlay"]} />
        <Dialog.Content
          className={`${styles["DialogContent"]} w-11/12 sm:w-5/6 md:w-[90%] lg:w-[85%] xl:w-2/3 `}
        >
          <div
            className={`${styles["DialogDescription"]} mb-8 ml-5 mr-6 mt-[33px] flex w-full flex-col items-stretch gap-4 md:mx-[34px] md:mt-8 md:flex-row`}
          >
            <div className="w-full py-4 md:w-[47.5%]">
              <p className="text-3xl font-medium leading-[38px] text-gray-900">
                {_id ? "Edit an offer" : "Create an offer"}
              </p>
              <p className="text-gray-500">
                {_id ? "Update" : "Create"} an offer for booking
              </p>
              <form onSubmit={submitOfferHn} id="offerForm">
                <label
                  htmlFor="boatPrice"
                  className="mt-4 block text-xs leading-6 text-gray-700"
                >
                  Boat Price
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">
                      {" "}
                      {currency == "USD" ? "$" : "€"}
                    </span>
                  </div>
                  <input
                    type="number"
                    name="boatPrice"
                    id="boatPrice"
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="0.00"
                    value={price.boatPrice}
                    onChange={(event) =>
                      handlePriceChange(event.target.name, event.target.value)
                    }
                    required
                  />
                  {/* <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      onChange={(event) => setCurrency(event.target.value)}
                      value={currency}
                      className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div> */}
                </div>
                <label
                  htmlFor="captainPrice"
                  className="mt-4 block text-xs leading-6 text-gray-700"
                >
                  Captain Price
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">
                      {" "}
                      {currency == "USD" ? "$" : "€"}
                    </span>
                  </div>
                  <input
                    type="number"
                    name="captainPrice"
                    id="captainPrice"
                    value={price.captainPrice}
                    min={0}
                    onChange={(event) =>
                      handlePriceChange(event.target.name, event.target.value)
                    }
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="0.00"
                    required
                  />
                  {/* <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value)}
                      className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div> */}
                </div>
                {/* <label
                  htmlFor="paymentServiceFee"
                  className="mt-4 block text-xs leading-6 text-gray-700"
                >
                  Payment Service Fee (7.5 %)
                </label> */}
                {/* <div className="relative rounded-md shadow-sm"> */}
                {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">
                      {currency == "USD" ? "$" : "€"}
                    </span>
                  </div>
                  <input
                    type="number"
                    name="paymentServiceFee"
                    id="paymentServiceFee"
                    value={price.paymentServiceFee}
                    disabled
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="0.00"
                    required
                  /> */}
                {/* <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value)}
                      className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div> */}
                {/* </div> */}
                <label
                  htmlFor="departureDate"
                  className="mt-4 block text-xs leading-6 text-gray-700"
                >
                  Departure Date
                </label>
                <div className="relative rounded-md shadow-sm">
                  <DatePicker
                    timeFormat="p"
                    dateFormat="Pp"
                    showTimeSelect
                    selected={startDate}
                    minDate={new Date()}
                    onChange={(date) => {
                      setStartDate(date);
                    }}
                    filterTime={filterPassedStartTime}
                    placeholderText="-- / -- / ----"
                    wrapperClassName="w-full"
                    className="mx-auto mb-5 mt-2 w-full cursor-default justify-center rounded-md border-none bg-white py-2 pl-3 pr-10 text-gray-900 shadow-custom1 focus:outline-none  sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="returnDate"
                  className="mt-4 block text-xs leading-6 text-gray-700"
                >
                  Return Date
                </label>
                <div className="relative rounded-md shadow-sm">
                  <DatePicker
                    timeFormat="p"
                    dateFormat="Pp"
                    showTimeSelect
                    selected={endDate}
                    minDate={new Date(startDate ? startDate : "")}
                    onChange={(date) => {
                      setEndDate(date);
                    }}
                    filterTime={filterPassedEndTime}
                    placeholderText="-- / -- / ----"
                    wrapperClassName="w-full"
                    className="mx-auto mb-5 mt-2 w-full cursor-default justify-center rounded-md border-none bg-white py-2 pl-3 pr-10 text-gray-900 shadow-custom1 focus:outline-none  sm:leading-6"
                  />
                </div>
              </form>
            </div>
            <div className="flex w-full flex-col justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 md:w-[52.5%]">
              <div>
                <p className="text-3xl font-medium leading-[38px] text-gray-900">
                  Offer Preview
                </p>
                <p className="text-gray-500">
                  This is how your offer will look like
                </p>
                <div className="my-0 h-fit w-full border border-dashed border-slate-200 md:my-6">
                  <Preview
                    {...price}
                    returnDate={startDate}
                    departureDate={endDate}
                    currency={currency}
                    type={type}
                  />
                </div>
              </div>
              <p className="mb-10 hidden after:block after:h-px after:w-full after:bg-gray-300 after:content-[''] md:block"></p>
              <div className="flex w-full flex-row justify-center gap-4 self-end px-4 ">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    ref={closeRef}
                    className="w-full whitespace-nowrap rounded-lg border border-solid bg-white px-1.5 py-[10px] font-medium text-gray-700 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  form="offerForm"
                  className="w-full whitespace-nowrap rounded-lg border border-solid border-[#219EBC] bg-[#219EBC] px-1.5 py-[10px] font-medium text-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                >
                  {_id ? "Update" : "Create"} Offer
                </button>
              </div>
              {isOffering && <SyncLoading />}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Offer;
