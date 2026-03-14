import { Fragment, useEffect, useState } from "react";
import {
  setActiveId,
  setActiveBoatId,
  setTarget,
  setDefaultActiveId,
} from "features/bookmark/bookmarkSlice";
import useFetcher from "@/lib/hooks/use-axios";
import { useDispatch } from "react-redux";
import Router from "next/router";
import DatePicker from "react-datepicker";
import { addDays, addHours } from "date-fns";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "next-auth/react";
import { LoadingCircle } from "../shared/icons";
import { LISTING_TYPE, PER_TYPES } from "@/lib/constants";
import { ShowToast } from "../shared/CustomToast";
import { FormControl, MenuItem, Select } from "@mui/material";

interface IProps {
  data: any;
  user: any;
  screen?: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const BookingForm = ({ data, user, screen }: IProps) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { fetchWithAuthSync } = useFetcher();

  const [pricingType, setPricingType] = useState(
    data.listingType === LISTING_TYPE.ACTIVITY
      ? PER_TYPES.PER_PERSON
      : PER_TYPES.PER_HOUR,
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [numPeople, setNumPeople] = useState(1);
  const [booking, setBooking] = useState(false);
  const [activityType, setActivityType] = useState(
    data.listingType === LISTING_TYPE.ACTIVITY
      ? data.activityTypes?.[0]?.type
      : "",
  );
  const [duration, setDuration] = useState<number | null>(null);
  const BOOKING_PER_TYPES: any = [];

  if (data?.pricing.perHour) {
    BOOKING_PER_TYPES.push(PER_TYPES.PER_HOUR);
  }

  if (data?.pricing.perDay) {
    BOOKING_PER_TYPES.push(PER_TYPES.PER_DAY);
  }

  const perHourPrice = data.pricing?.perHour || 0;
  const perDayPrice = data.pricing?.perDay || 0;
  const perPersonPrice = data.pricing?.perPerson || 0;
  const hourDiscount = data.pricing?.hourDiscount?.[0] || null;
  const dayDiscount = data.pricing?.dayDiscount?.[0] || null;
  const personDiscount = data.pricing?.discountPercentage?.[0] || null;
  const minHours = data.pricing?.minHours || 0;
  const minDays = data.pricing?.minDays || 0;
  const bookedRanges =
    data.bookings?.map((booking: any) => ({
      start: new Date(booking.duration.start),
      end: new Date(booking.duration.end),
    })) ?? [];

  const calculatePrice = () => {
    let totalPrice = 0;
    let discountedPrice = 0;
    let discountApplied = false;
    let discountPercentage = 0;

    if (data.listingType === LISTING_TYPE.RENTALS) {
      if (pricingType === PER_TYPES.PER_HOUR) {
        totalPrice = (duration || 0) * perHourPrice;
        if (
          hourDiscount &&
          (duration || 0) >= hourDiscount.minHoursForDiscount
        ) {
          discountPercentage = hourDiscount.discountPercentage;
          discountedPrice =
            totalPrice - (totalPrice * discountPercentage) / 100;
          discountApplied = true;
        }
      } else if (pricingType === PER_TYPES.PER_DAY) { // FIX FE-03: use constant instead of string literal
        totalPrice = (duration || 0) * perDayPrice;
        if (dayDiscount && (duration || 0) >= dayDiscount.minDaysForDiscount) {
          discountPercentage = dayDiscount.discountPercentage;
          discountedPrice =
            totalPrice - (totalPrice * discountPercentage) / 100;
          discountApplied = true;
        }
      }
    } else if (data.listingType === "activity") {
      totalPrice = numPeople * perPersonPrice;
      if (personDiscount && numPeople >= personDiscount.minPeople) {
        discountPercentage = personDiscount.percentage;
        discountedPrice = totalPrice - (totalPrice * discountPercentage) / 100;
        discountApplied = true;
      }
    }

    const finalPrice = discountApplied ? discountedPrice : totalPrice;

    return {
      total: totalPrice.toFixed(2),
      discounted: discountApplied ? discountedPrice.toFixed(2) : null,
      discountPercentage: discountApplied ? discountPercentage : 0,
      final: finalPrice.toFixed(2),
      hasDiscount: discountApplied,
    };
  };

  const handleBookingSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!session) {
      Router.push({
        pathname: `/user/login`,
        query: { redirect_to: `/boat/${data._id}` },
      });
      return;
    }

    if (data.listingType === "rental") {
      if (!startDate || !duration) {
        ShowToast({
          title: "Error on Booking",
          message: `Start date and duration are required`,
          status: "fail",
        });
        return;
      }

      if (
        (pricingType === PER_TYPES.PER_HOUR && duration < minHours) ||
        (pricingType === PER_TYPES.PER_DAY && duration < minDays) // FIX FE-03
      ) {
        ShowToast({
          title: "Error on Booking",
          message: `Minimum booking duration is ${
            pricingType === PER_TYPES.PER_HOUR ? minHours : minDays
          } ${pricingType === PER_TYPES.PER_HOUR ? "hours" : "days"}.`,
          status: "fail",
        });

        return;
      }
    } else if (data.listingType === LISTING_TYPE.ACTIVITY) {
      if (numPeople < 1) {
        ShowToast({
          title: "Error on Booking",
          message: `Number of people must be at least 1`,
          status: "fail",
        });
        return;
      }

      if (!activityType) {
        ShowToast({
          title: "Error on Booking",
          message: `Select an activity type`,
          status: "fail",
        });
        return;
      }

      if (!startDate || !duration) {
        ShowToast({
          title: "Error on Booking",
          message: `Both start and duration are required!`,
          status: "fail",
        });
        return;
      }
    }

    if (startDate && duration && !isRangeAvailable(startDate, duration)) {
      ShowToast({
        title: "Error on Booking",
        message: "The selected time range is unavailable.",
        status: "fail",
      });
      return;
    }

    // Calculate the end date
    let endDate: Date | null = null;
    if (data.listingType === "rental") {
      if (pricingType === PER_TYPES.PER_HOUR) {
        endDate = addHours(startDate as Date, duration || 0);
      } else if (pricingType === PER_TYPES.PER_DAY) {
        endDate = addDays(startDate as Date, duration || 0);
      }
    } else if (data.listingType === LISTING_TYPE.ACTIVITY) {
      endDate = addHours(startDate as Date, duration || 0);
    }

    const bookingData = {
      boatId: data._id,
      type: pricingType,
      duration: {
        start: startDate?.toISOString(),
        end: endDate,
      },
      renter: user._id,
      renterPrice: calculatePrice().final,
      ...(data.listingType === LISTING_TYPE.ACTIVITY && { activityType }),
      ...(data.listingType === LISTING_TYPE.ACTIVITY && {
        noPeople: numPeople,
      }),
      ...(data.listingType === LISTING_TYPE.RENTALS &&
        pricingType === PER_TYPES.PER_HOUR && { hours: duration }),
      ...(data.listingType === LISTING_TYPE.RENTALS &&
        pricingType === PER_TYPES.PER_DAY && { days: duration }),
      ...(data.listingType === LISTING_TYPE.ACTIVITY && { hours: duration }),
    };

    setBooking(true);

    try {
      const response = await fetchWithAuthSync("/booking", bookingData);
      dispatch(setActiveId(response.data._id));
      dispatch(setDefaultActiveId(response.data._id));
      dispatch(setActiveBoatId(data._id));
      dispatch(setTarget("renter"));

      Router.push({ pathname: "/bookings" });
    } catch (error: any) {
      ShowToast({
        title: "Error on Booking",
        message: error?.response?.data?.message || error.message,
        status: "fail",
      });
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => {
    if (activityType) {
      const selectedActivity = data.activityTypes.find(
        (activity: { type: string }) => activity.type === activityType,
      );
      setDuration(selectedActivity?.durationHours || null);
    }
  }, [activityType, data.activityTypes]);

  useEffect(() => {
    setStartDate(null);
  }, [duration]);

  const isRangeAvailable = (start: Date, duration: number) => {
    const end =
      pricingType === PER_TYPES.PER_HOUR
        ? addHours(start, duration)
        : addDays(start, duration);

    return !bookedRanges.some((range: any) => {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);

      const isOverlapping =
        (start >= rangeStart && start < rangeEnd) ||
        (end > rangeStart && end <= rangeEnd) ||
        (start <= rangeStart && end >= rangeEnd);

      return isOverlapping;
    });
  };

  const filterAvailableTimes = (date: Date) => {
    if (!duration) {
      return true;
    }

    const now = new Date();
    if (date < now) {
      return false;
    }

    const isAvailable = isRangeAvailable(date, duration);
    return isAvailable;
  };

  const filterAvailableDates = (date: Date) => {
    if (!duration) return false;

    const now = new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // If the date is in the past, disable it
    if (date < now && !isSameDay(date, now)) {
      return false;
    }

    // For today, check if there are any future time slots available
    if (isSameDay(date, now)) {
      // Check next 4 hours in 30-minute intervals
      const checkTime = new Date(now);
      checkTime.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0); // Round up to next 30 minutes

      // Check until end of day
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      while (checkTime <= endOfDay) {
        if (filterAvailableTimes(new Date(checkTime))) {
          return true;
        }
        checkTime.setMinutes(checkTime.getMinutes() + 30);
      }

      return false;
    }

    // For future dates, just check a few sample times to see if any are available
    const sampleTimes = [
      new Date(date.setHours(9, 0, 0, 0)), // 9 AM
      new Date(date.setHours(12, 0, 0, 0)), // 12 PM
      new Date(date.setHours(15, 0, 0, 0)), // 3 PM
      new Date(date.setHours(18, 0, 0, 0)), // 6 PM
      new Date(date.setHours(21, 0, 0, 0)), // 9 PM
      new Date(date.setHours(24, 0, 0, 0)), // 12 AM
    ];

    return sampleTimes.some((time) => filterAvailableTimes(time));
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <div
      className={`w-full rounded-lg bg-white ${
        !screen && "border border-gray-200"
      } p-4 ${!screen && "shadow-sm drop-shadow-md"} sm:p-6 md:p-8`}
    >
      <form className="w-full space-y-4" onSubmit={handleBookingSubmit}>
        <h5 className="text-lg font-bold text-gray-900">Book Here</h5>

        {data.listingType === "rental" && (
          <div className="w-full">
            {/* Pricing Type Selector */}
            <div className="mb-5 w-full">
              <Listbox value={pricingType} onChange={setPricingType}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="ml-1 block font-medium leading-6 sm:text-sm">
                      Type
                    </Listbox.Label>
                    <div className="relative mt-2 w-full">
                      <Listbox.Button className="relative w-full cursor-default rounded-md  py-2 pl-3 pr-10 text-left shadow-custom1 focus:outline-none sm:leading-6">
                        <span className="block truncate">
                          {pricingType.split("_").join(" ")}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {BOOKING_PER_TYPES.map((type: any) => (
                            <Listbox.Option
                              key={type}
                              value={type}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-cyan-600 text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9",
                                )
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "block truncate",
                                    )}
                                  >
                                    {type.split("_").join(" ")}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                      <CheckIcon
                                        className="h-5 w-5 text-cyan-600"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
          </div>
        )}

        {data.listingType === "activity" && (
          <>
            {/* Number of People */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Number of People
              </label>
              <input
                type="number"
                value={numPeople}
                onChange={(e) => setNumPeople(Number(e.target.value))}
                min={1}
                max={data.maxPassengers}
                className="w-full rounded-md border border-gray-300 p-2 outline-0 hover:border-[1.5px] hover:border-cyan-600 focus:border-2 focus:border-cyan-600"
              />
            </div>
          </>
        )}
        {data.listingType === "activity" && (
          <div className="mb-8 flex flex-col">
            <label className="block text-sm font-medium text-gray-900">
              Activity Type
            </label>
            <FormControl fullWidth className="relative">
              <Select
                id="boatType"
                name="boatType"
                placeholder="Activity Type"
                value={activityType}
                onChange={(event) => {
                  setActivityType(event.target.value);
                }}
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #d1d5db",
                  },
                  width: "100%",
                  border: "none",
                  backgroundColor: "white",
                  minHeight: "2.75rem",
                  "& .MuiSelect-select": {
                    paddingTop: 0.8,
                    paddingBottom: 0.8,
                    paddingLeft: 1.75,
                    paddingRight: 1.75,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #d1d5db",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "2px solid #0891b2",
                  },
                }}
              >
                {data?.activityTypes?.map((type: { type: string }) => (
                  <MenuItem key={type.type} value={type.type}>
                    {type.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {/* Date Pickers */}
        <div className="flex w-full flex-col space-y-4">
          {data.listingType === "activity" && (
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Number of Hours
              </label>
              <input
                type="number"
                placeholder="Enter number of hours"
                value={duration || ""}
                disabled={data.listingType === LISTING_TYPE.ACTIVITY}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                className="w-full rounded-md border border-gray-300 p-2 outline-0 placeholder:text-gray-300 hover:border-[1.5px] hover:border-cyan-600 focus:border-2 focus:border-cyan-600 disabled:border-none disabled:bg-gray-200"
              />
            </div>
          )}

          {data.listingType === "rental" && (
            <div>
              <label className="block text-sm font-medium text-gray-900">
                {pricingType === PER_TYPES.PER_HOUR
                  ? "Number of Hours"
                  : "Number of Days"}
              </label>
              <input
                type="number"
                placeholder="Enter number of hours"
                value={duration || ""}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                className="w-full rounded-md border border-gray-300 p-2 outline-0 placeholder:text-gray-300 hover:border-[1.5px] hover:border-cyan-600 focus:border-2 focus:border-cyan-600"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Start Time
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                if (!date) return;

                // Check if the selected time is available
                const now = new Date();
                let adjustedDate = new Date(date);

                // If the selected time is in the past or not available, find the next available time
                if (
                  adjustedDate < now ||
                  !isRangeAvailable(adjustedDate, duration || 1)
                ) {
                  // Start checking from either now or the selected date, whichever is later
                  const startTime = new Date(
                    Math.max(now.getTime(), adjustedDate.getTime()),
                  );
                  // Round up to the next 30-minute interval
                  startTime.setMinutes(
                    Math.ceil(startTime.getMinutes() / 30) * 30,
                    0,
                    0,
                  );

                  let checkTime = new Date(startTime);
                  // Check up to 7 days in the future
                  const maxCheckTime = new Date(checkTime);
                  maxCheckTime.setDate(maxCheckTime.getDate() + 7);

                  while (checkTime <= maxCheckTime) {
                    if (isRangeAvailable(checkTime, duration || 1)) {
                      adjustedDate = checkTime;
                      break;
                    }
                    // Check in 30-minute intervals
                    checkTime = new Date(checkTime.getTime() + 30 * 60 * 1000);
                  }
                }

                setStartDate(adjustedDate);
              }}
              minDate={new Date()}
              placeholderText="Start Date"
              showTimeSelect
              dateFormat="Pp"
              filterDate={filterAvailableDates}
              filterTime={filterAvailableTimes}
              disabled={!duration}
              className="w-full rounded-md border border-gray-300 p-2 outline-0 hover:border-[1.5px] hover:border-cyan-600 focus:border-2 focus:border-cyan-600 disabled:bg-gray-100 disabled:hover:border-inherit"
              wrapperClassName="w-full"
            />
          </div>
        </div>

        {/* Price Summary */}
        {(() => {
          const price = calculatePrice();
          return (
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm font-medium">
                  {price.hasDiscount ? "Original Price" : "Total Price"}
                </p>
                <p className="text-sm">
                  {data.currency === "USD" ? "$" : "€"}
                  {price.total}
                </p>
              </div>
              {price.hasDiscount && (
                <>
                  <div className="flex justify-between text-amber-600">
                    <p className="text-sm font-medium">
                      Discount ({price.discountPercentage}%):
                    </p>
                    <p className="text-sm font-medium">
                      -{data.currency === "USD" ? "$" : "€"}
                      {(
                        parseFloat(price.total) -
                        parseFloat(price.discounted || "0")
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <p className="text-sm font-medium">Final Price:</p>
                    <p className="text-sm font-bold">
                      {data.currency === "USD" ? "$" : "€"}
                      {price.final}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* Submit Button */}
        <button
          type="submit"
          className="relative flex w-full flex-row items-center justify-center gap-1.5 rounded bg-cyan-600 py-2 text-white hover:bg-cyan-700"
        >
          <span className="text-white">Request Booking</span>
          {booking && (
            <span>
              <LoadingCircle />
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
