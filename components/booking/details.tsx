import { LISTING_TYPE } from "@/lib/constants";
import dayjs from "dayjs";

const Details = ({ info }: { info: any }) => {
  const {
    type,
    duration: { start, end },
    status,
    offerId,
  } = info;

  if (!info.boatId) return null;

  const pricingArr = info.boatId.pricing;

  const perType = (str: string) =>
    str
      .toLowerCase()
      .split("_")
      .reduce(
        (acc, curr, i) =>
          acc + (i ? curr[0].toUpperCase() + curr.slice(1) : curr),
        "",
      );

  const priceValue = pricingArr[`${perType(type)}`];

  const startDate = info.duration.start;
  const endDate = info.duration.end;

  let duration =
    info.type === "Per_Hour"
      ? dayjs(endDate).diff(dayjs(startDate), "minute") / 60
      : dayjs(endDate).diff(dayjs(startDate), "day");

  if (info.type === "Per_Day") {
    duration = duration;
  }

  let discountPercentage = 0;

  if (type === "Per_Hour") {
    const hourDiscount = pricingArr.hourDiscount?.find(
      (discount: { minHoursForDiscount: number }) =>
        duration >= discount.minHoursForDiscount,
    );
    discountPercentage = hourDiscount?.discountPercentage || 0;
  } else if (type === "Per_Day") {
    const dayDiscount = pricingArr.dayDiscount?.find(
      (discount: { minDaysForDiscount: number }) =>
        duration >= discount.minDaysForDiscount,
    );
    discountPercentage = dayDiscount?.discountPercentage || 0;
  } else if (type === "Per_Person") {
    discountPercentage = info.discountPercentage;
    duration = info.noPeople;
  }

  // Calculate the total price with discount
  const priceBeforeDiscount = duration * priceValue;
  const totalPrice =
    priceBeforeDiscount - (priceBeforeDiscount * discountPercentage) / 100;

  const currency = info.boatId.currency;

  return (
    <div className="flex flex-col">
      <p className="mt-2 text-xs font-light leading-4 text-[#333333]">Boat</p>
      <p className="text-sm font-normal leading-5 text-[#1C1B1F]">
        {info.boatId.boatName}
      </p>
      <p className="mt-2 text-xs font-light leading-4 text-[#333333]">
        Captain
      </p>
      <p className="text-sm font-normal leading-5 text-[#1C1B1F]">
        {info.boatId.captained ? "Included" : "Not Included"}
      </p>

      <p className="mt-2 text-xs font-light leading-4 text-[#333333]">
        Durations
      </p>
      <p className="text-sm font-normal leading-5 text-[#1C1B1F]">
        {type === "Per_Hour" || type === "Per_Person"
          ? (dayjs(end).diff(dayjs(start), "minute") / 60).toFixed(2)
          : dayjs(end).diff(dayjs(start), "day").toFixed(2)}{" "}
        {type === "Per_Hour" || type === "Per_Person" ? "hours" : "days"}
      </p>
      {info?.boatId?.listingType === LISTING_TYPE.ACTIVITY && (
        <>
          <p className="mt-2 text-xs font-light leading-4 text-[#333333]">
            No of people
          </p>
          <p className="text-sm font-normal leading-5 text-[#1C1B1F]">
            {info.noPeople}
          </p>
        </>
      )}
      {discountPercentage > 0 && (
        <>
          <p className="mt-2 text-xs font-light leading-4 text-[#333333]">
            Original Price
          </p>
          <p className="ml-0.5 text-sm font-normal leading-5 text-[#1C1B1F]">
            {currency === "USD" ? "$" : "€"}
            {`${priceBeforeDiscount}`}
          </p>
        </>
      )}
      {discountPercentage > 0 && (
        <>
          <p className="mt-2 text-xs font-light leading-4 text-amber-600">
            Discount ({discountPercentage}%):
          </p>
          <p className="ml-0.5 text-sm font-normal leading-5 text-amber-600">
            - {currency === "USD" ? "$" : "€"}
            {`${priceBeforeDiscount - totalPrice}`}
          </p>
        </>
      )}

      <p className="mt-2 text-xs font-light  leading-4 text-[#333333]">
        {discountPercentage > 0 ? "Final Price" : "Total Price"}
      </p>
      <p className="ml-0.5 text-sm font-normal leading-5 text-[#1C1B1F]">
        {currency === "USD" ? "$" : "€"}
        {`${totalPrice}`}
      </p>
      <p className="mt-2 text-xs font-light leading-4 text-[#333333]">
        Departure Time
      </p>
      <p className="text-sm font-normal leading-5 text-[#1C1B1F]">
        {dayjs(start).format(`dddd, MMMM D, YYYY h:mm A`)}
      </p>
      <p className="mt-2 text-xs font-light leading-4 text-[#333333]">
        Return Time
      </p>
      <p className="text-sm font-normal leading-5 text-[#1C1B1F]">
        {dayjs(end).format(`dddd, MMMM D, YYYY h:mm A`)}
      </p>
      <p className="mt-2 text-xs font-light leading-4 text-[#333333]">Status</p>
      <p className="mt-0.5 w-fit rounded-xl bg-[#F2F4F7] px-4 py-1 text-sm font-normal leading-5 text-[#1C1B1F]">
        {offerId
          ? offerId.status === "Processing"
            ? "Accepted"
            : offerId.status
          : status}
      </p>
    </div>
  );
};

export default Details;
