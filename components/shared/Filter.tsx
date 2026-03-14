import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaThumbtack } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";

import {
  setPriceRange,
  setDates,
  setListingType,
  setBoatType,
  setMaxPassengers,
  setAmenities,
  resetFilters,
  setActivityType,
} from "features/filters/filterSlice";
import { RootState } from "./store";

interface FiltersProps {
  features: string[];
  boatTypes: string[];
  activities: string[];
  close: () => void;
}

const Filters = ({ features, boatTypes, activities, close }: FiltersProps) => {
  const router = useRouter();
  const { query } = router;
  const {
    priceRange,
    dates,
    listingType,
    boatType,
    maxPassengers,
    amenities,
    activityType,
  } = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch();
  const [isFilterCleared, setIsFilterCleared] = useState(false);

  const handleFilterChange = () => {
    // Logic to apply filters
    if (priceRange.min) {
      query.minPrice = priceRange.min;
    } else {
      delete query?.minPrice;
    }

    if (priceRange.max) {
      query.maxPrice = priceRange.max;
    } else {
      delete query?.maxPrice;
    }

    if (dates.start) {
      query.startDate = dates.start;
    } else {
      delete query?.startDate;
    }

    if (dates.end) {
      query.endDate = dates.end;
    } else {
      delete query?.endDate;
    }

    if (listingType) {
      query.listingType = listingType;
    } else {
      delete query?.listingType;
    }

    if (
      boatType.length > 0 &&
      listingType &&
      boatType.length === boatTypes.length
    ) {
      query.boatTypes = JSON.stringify(boatType);
    } else {
      delete query?.boatTypes;
    }

    if (
      activityType.length > 0 &&
      listingType &&
      activityType.length === activities.length
    ) {
      query.activityTypes = JSON.stringify(activityType);
    } else {
      delete query?.activityTypes;
    }

    if (maxPassengers) {
      query.maxPassengers = maxPassengers;
    } else {
      delete query?.maxPassengers;
    }

    if (
      listingType &&
      amenities.length > 0 &&
      amenities.length !== features.length
    ) {
      query.features = JSON.stringify(amenities);
    } else {
      delete query?.features;
    }

    router.push({
      pathname: "/",
      query,
    });

    setTimeout(() => {
      close();
    }, 200);
  };

  function toLocalDateTimeString(date = new Date()) {
    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

  useEffect(() => {
    if (!isFilterCleared) return;

    handleFilterChange();
    setIsFilterCleared(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilterCleared]);

  return (
    <div className="boat-wrapper relative h-fit max-h-[72.5vh] w-[95vw] min-w-72 overflow-y-scroll rounded-lg bg-gray-50 px-8 text-gray-800 shadow-custom2 drop-shadow-2xl xs:min-w-[23rem] sm:w-[80vw] lg:w-[40vw] lg:min-w-[25rem]">
      <h2 className="sticky top-0 z-10 mb-4 h-20 w-full bg-gray-50 pt-8 text-lg font-bold">
        Filters
      </h2>

      {/* Common Fields */}
      <div className="mb-4 px-px">
        <label className="block font-medium">Price Range</label>
        <div className="flex gap-2">
          {/* Min Price */}
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                dispatch(setPriceRange({ ...priceRange, min: e.target.value }))
              }
              className="w-full rounded border border-cyan-600 p-2 pl-8 font-bold text-gray-600 focus:border-2 focus:border-cyan-600"
            />
          </div>

          {/* Max Price */}
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                dispatch(setPriceRange({ ...priceRange, max: e.target.value }))
              }
              className="w-full rounded border border-cyan-600 p-2 pl-8 font-bold text-gray-600 focus:border-2 focus:border-cyan-600"
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex w-full flex-col gap-2 px-px md:flex-row lg:flex-col 2xl:flex-row">
        <div className="flex w-full flex-col gap-0 2xl:w-1/2">
          <label className="block font-medium">Start Date</label>
          <input
            type="datetime-local"
            value={dates.start}
            placeholder="Start Date"
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => {
              const selected = new Date(e.target.value);
              const now = new Date();

              if (selected < now) {
                // If invalid, reset or snap to now
                dispatch(
                  setDates({ ...dates, start: toLocalDateTimeString(now) }),
                );
              } else {
                dispatch(
                  setDates({
                    ...dates,
                    start: toLocalDateTimeString(selected),
                  }),
                );
              }
            }}
            className="w-full rounded border border-cyan-600 p-2 font-bold text-gray-600 focus:border-2 focus:border-cyan-600 focus:ring-0"
          />
        </div>
        <div className="flex w-full flex-col gap-0 2xl:w-1/2">
          <label className="block font-medium">End Date</label>
          <input
            min={dates.start}
            value={dates.end}
            placeholder="End Date"
            type="datetime-local"
            onChange={(e) =>
              dispatch(setDates({ ...dates, end: e.target.value }))
            }
            className="w-full rounded border border-cyan-600 p-2 font-bold text-gray-600 focus:border-2 focus:border-cyan-600 focus:ring-0"
          />
        </div>
      </div>

      {/* Max Passengers */}
      <div className="mb-4 w-full px-px">
        <label className="block font-medium">
          Max Number of Spots Available
        </label>
        <input
          type="number"
          value={maxPassengers}
          onChange={(e) => dispatch(setMaxPassengers(e.target.value))}
          className="w-full rounded border border-cyan-600 p-2 font-bold text-gray-600  focus:border-2 focus:border-cyan-600"
        />
      </div>

      {/* Listing Type */}
      <div className="mb-4 px-px">
        <label className="mb-2 block font-medium">Type of Listing</label>
        <div className="flex gap-4">
          {/* Rental Button */}
          <button
            type="button"
            onClick={() => {
              if (listingType === "rental") dispatch(setListingType(""));
              else dispatch(setListingType("rental"));
            }}
            className={`flex w-1/2 items-center justify-center gap-2 rounded border px-4 py-2 font-bold sm:w-fit ${
              listingType === "rental"
                ? "border-yellow-700 bg-yellow-700 text-white"
                : "border-cyan-600 bg-white text-yellow-700"
            }`}
          >
            <FaThumbtack
              className={`${
                listingType === "rental" ? "text-white" : "text-yellow-700"
              }`}
            />
            Rental
          </button>

          {/* Activity Button */}
          <button
            type="button"
            onClick={() => {
              if (listingType === "activity") dispatch(setListingType(""));
              else dispatch(setListingType("activity"));
            }}
            className={`flex w-1/2 items-center justify-center gap-2 rounded border px-4 py-2 font-bold sm:w-fit ${
              listingType === "activity"
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-cyan-600 bg-white text-blue-500"
            }`}
          >
            <FaThumbtack
              className={`${
                listingType === "activity" ? "text-white" : "text-blue-500"
              }`}
            />
            Activity
          </button>
        </div>
      </div>

      {/* Conditional Fields */}
      {listingType === "rental" && (
        <div className="w-full">
          {/* Boat Type */}
          <div className="mb-4 px-px">
            <label className="mb-1 block font-medium underline">
              Boat Type
            </label>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {boatTypes.map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    value={type}
                    type="checkbox"
                    checked={boatType.includes(type)}
                    onChange={(e) =>
                      dispatch(
                        setBoatType(
                          e.target.checked
                            ? [...boatType, type]
                            : boatType.filter((t) => t !== type),
                        ),
                      )
                    }
                    className="size-4 border border-cyan-600 font-bold text-gray-600 accent-cyan-600"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <label className="mb-1 block font-medium underline">
            Features/Amenities
          </label>

          <div className="mb-4 flex flex-row flex-wrap gap-x-4 gap-y-2 px-px">
            {features.map((feature, index) => (
              <div key={`${feature}${index}`}>
                <label className="flex items-center gap-1.5" htmlFor={feature}>
                  <input
                    id={feature}
                    name={feature}
                    type="checkbox"
                    value={feature}
                    checked={amenities.includes(feature)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Add the feature to the amenities array
                        dispatch(setAmenities([...amenities, feature]));
                      } else {
                        // Remove the feature from the amenities array
                        dispatch(
                          setAmenities(amenities.filter((t) => t !== feature)),
                        );
                      }
                    }}
                    className="size-4 rounded border border-cyan-600 text-cyan-600 accent-cyan-600"
                  />
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {listingType === "activity" && (
        <div className="w-full">
          {/* Activity Type */}
          <div className="mb-4 px-px">
            <label className="mb-1 block font-medium underline">
              Activity Type
            </label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {activities?.map((type: string) => (
                <label key={type} className="flex items-center gap-1.5">
                  <input
                    value={type}
                    type="checkbox"
                    checked={activityType.includes(type)}
                    onChange={(e) =>
                      dispatch(
                        setActivityType(
                          e.target.checked
                            ? [...activityType, type]
                            : activityType.filter((t) => t !== type),
                        ),
                      )
                    }
                    className="size-4 border border-cyan-600 font-bold text-gray-600 accent-cyan-600"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Apply and Clear Filters */}
      <div className="sticky bottom-0 flex w-full flex-row-reverse gap-4 bg-white py-2.5">
        <button
          type="button"
          onClick={() => handleFilterChange()}
          className="w-full rounded bg-cyan-600 py-2 text-white"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch(resetFilters());
            dispatch(setListingType(""));
            dispatch(setActivityType(activities));
            dispatch(setAmenities(features));
            dispatch(setBoatType(boatTypes));
            setIsFilterCleared((f) => !f);
          }}
          className="w-full rounded bg-gray-300 py-2 text-gray-800"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
