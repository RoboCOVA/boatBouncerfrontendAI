/* eslint-disable @next/next/no-img-element */
import dayjs from "dayjs";
import { Triangle } from "lucide-react";
import {
  setActiveId,
  setCancelledActiveId,
  setDefaultActiveId,
} from "features/bookmark/bookmarkSlice";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "../layout/carousel";
import Favorite from "../shared/icons/favorite";
import { useEffect, useRef, useState } from "react";
import { authPoster } from "@/lib/utils";
import useFetcher from "@/lib/hooks/use-axios";
import { useSession } from "next-auth/react";
import * as Avatar from "@radix-ui/react-avatar";
import Link from "next/link";
import PriceChip from "../shared/PriceChip";
import { LISTING_TYPE } from "@/lib/constants";

const Boat = ({
  page,
  children,
  boatImg,
  location,
  status,
  start,
  checked,
  currency,
  end,
  renterPrice,
  boatImgs,
  type,
  _id,
  captained,
  pricing,
  boatName,
  favorite,
  markerId,
  boatId,
  peer,
  listingType,
}: {
  page: string;
  children: React.ReactNode;
  boatImg: string | undefined | null;
  checked?: boolean;
  location:
    | {
        address: string;
        city: string;
      }
    | undefined
    | null;
  status?: string;
  currency?: string;
  start?: Date;
  end?: Date;
  renterPrice?: number;
  type?: string;
  _id?: string;
  favorite?: boolean;
  boatId?: string;
  captained?: boolean;
  pricing?: any;
  boatName?: any;
  boatImgs?: string[];
  markerId?: string;
  peer?: any;
  listingType?: string;
}) => {
  const dispatch = useDispatch();
  const { id } = useSelector((state: any) => state.bookmark.bookmarkInfo);
  const images = boatImgs?.filter((boat: string) => boat);
  const [isFavorite, setIsFavorite] = useState(favorite ?? false);
  const { data: session } = useSession();
  const { Axios } = useFetcher();
  const bookingRef = useRef<HTMLDivElement | null>(null);

  const favoriteClickHn = async (
    event: React.MouseEvent<HTMLElement>,
    id: string | undefined,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!id) return;
    setIsFavorite((fav) => !fav);
    try {
      await authPoster(Axios, `boat/addFavorite/${boatId}`);
    } catch (error) {
      setIsFavorite((fav) => !fav);
    }
  };

  useEffect(() => {
    if (!session?.token) return;
    setIsFavorite(favorite ?? false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorite]);

  useEffect(() => {
    if (!id) return;

    bookingRef.current?.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  return (
    <div
      ref={bookingRef}
      className={`relative ${
        page == "bookmarks" ? "-z-0 " : " z-10 "
      } flex h-full w-full flex-col ${
        page == "bookmarks" && "mr-8"
      } shadow-custom1 transition-all duration-200 hover:shadow-custom2 ${
        id && id == _id
          ? "duration-400 w-full flex-col border-[2.5px] border-[#219EBC] transition-[border-color] sm:flex-row"
          : "duration-400 w-full border-zinc-100 transition-[border-color]"
      } ${_id && " cursor-pointer "} gap-0 rounded-lg border border-solid
      ${
        listingType === LISTING_TYPE.ACTIVITY
          ? "!rounded border !border-blue-500"
          : "!rounded border !border-yellow-700"
      }
      `}
      onClick={() => {
        if (_id) {
          dispatch(setActiveId(_id));
          if (status === "Cancelled") {
            dispatch(setCancelledActiveId(_id));
          } else {
            dispatch(setDefaultActiveId(_id));
          }
        }
      }}
      onMouseEnter={() => {
        if (markerId) {
          document.getElementById(markerId)?.classList.add("active_div");
        }
      }}
      onMouseLeave={() => {
        if (markerId) {
          document.getElementById(markerId)?.classList.remove("active_div");
        }
      }}
    >
      {session?.token &&
        (page === "listing" || page === "favorite" || page === "search") && (
          <button
            onClick={(event) => favoriteClickHn(event, boatId)}
            className="absolute right-3 top-3 z-10 rounded-full bg-white p-2"
          >
            <Favorite isFavorite={isFavorite} />
          </button>
        )}
      {id && id == _id && (
        <Triangle className="absolute -right-[21.5px] bottom-1/2 hidden rotate-90 fill-[#219EBC] text-[#219EBC] sm:block" />
      )}

      {!id && page !== "listing" && page !== "favorite" && (
        <div className={`w-full ${page == "bookmarks" ? "h-32" : "h-full"}`}>
          {boatImg ? <Carousel images={images} page={page} /> : <img alt="" />}
        </div>
      )}

      {(page == "listing" || page == "favorite") && boatImg && (
        <Link key={boatId} href={`/boat/${boatId}`} target="_blank">
          <div className="h-full">
            <Carousel images={images} page={page} />
          </div>
        </Link>
      )}

      <div className="relative h-fit p-2 pl-4">
        <div className="flex flex-row items-center justify-between">
          {page !== "bookmarks" ? (
            <p className="text-xs font-light text-zinc-900">
              {location?.address}, {location?.city}
            </p>
          ) : (
            <p className="order-none mb-1.5 mt-2 flex flex-none grow-0 flex-row items-center justify-center rounded-xl bg-[#F2F4F7] px-3 py-0.5 text-center text-xs font-medium leading-[18px] text-[#344054]">
              {status === "Processing" ? "Accepted" : status}
            </p>
          )}
          {page !== "listing" && (
            <p>
              {/* <span style={{ fontSize: "8px" }} className="text-zinc-400">
                28 Bookings
              </span>
              <span
                className="ml-1 font-sans font-semibold tracking-wide text-zinc-900"
                style={{ fontSize: "10px" }}
              >
                4.5 *
              </span> */}
            </p>
          )}
        </div>
        {page == "bookmarks" && start && (
          <p className="mb-0.5 text-start text-xs font-normal text-[#1C1B1F]">
            {dayjs(start).format("ddd MMM D YYYY h:mm A")} -{" "}
            {dayjs(end).format("ddd MMM D YYYY h:mm A")}
          </p>
        )}
        {page === "bookmarks" && peer && (
          <div className="mb-0.5  flex flex-row items-center justify-start gap-1.5 py-1 text-sm font-normal">
            <Avatar.Root className="inline-flex h-[40px] w-[40px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
              <Avatar.Image
                className="h-full w-full rounded-[inherit] object-cover"
                src={peer?.profilePicture}
                alt=""
              />
              <Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-cyan-600 text-[15px] font-semibold text-white">
                {`${peer.firstName[0].toUpperCase()}${peer.lastName?.[0]?.toUpperCase()}`}
              </Avatar.Fallback>
            </Avatar.Root>
            <p>{peer.firstName}</p> <p>{peer?.lastName ?? null}</p>
          </div>
        )}

        <p
          className={`max-w-xs pr-2 font-inter text-xs font-semibold text-black sm:text-sm lg:text-base`}
        >
          {boatName}
        </p>

        {page !== "bookmarks" && (
          <p
            className={`absolute -top-8 right-0 w-fit rounded-ee-sm px-2.5 py-1 uppercase text-white ${
              listingType === LISTING_TYPE.RENTALS
                ? "bg-yellow-700"
                : "bg-blue-500"
            }`}
          >
            {listingType}
          </p>
        )}

        {page !== "bookmarks" && (
          <ul className="my-2 flex flex-row items-center gap-2 text-xs font-medium">
            {/* <li className="whitespace-nowrap rounded-2xl bg-gray-100 px-2 py-1 text-zinc-700">
              <span>4-8 Hours Rental</span>
            </li> */}
            {captained && (
              <li className="whitespace-nowrap rounded-2xl bg-orange-50 px-2 py-1 text-orange-700">
                <span>Captained</span>
              </li>
            )}
            {!captained && (
              <li className="whitespace-nowrap rounded-2xl bg-orange-50 px-2 py-1">
                <span>No Captain</span>
              </li>
            )}
          </ul>
        )}
        {page !== "listing" &&
          page !== "bookmarks" &&
          pricing &&
          (listingType === LISTING_TYPE.ACTIVITY ? (
            <PriceChip
              type="person"
              currency={currency}
              price={pricing.perPerson}
            />
          ) : (
            <div className="flex flex-row gap-5">
              <PriceChip
                type="hour"
                currency={currency}
                price={pricing.perHour}
              />

              {pricing.perDay && (
                <PriceChip
                  type="day"
                  currency={currency}
                  price={pricing.perDay}
                />
              )}
            </div>
          ))}
        {page === "bookmarks" && (
          <p className="mt-1.5 flex flex-row justify-between text-zinc-900">
            <span className="text-lg font-light leading-7 text-[#1C1B1F]">
              {currency == "USD" ? "$" : "€"}
              {listingType === LISTING_TYPE.ACTIVITY
                ? pricing.perPerson
                : pricing[type === "Per_Hour" ? "perHour" : "perDay"]}
              /
              <span className="text-base">
                {type === "Per_Hour"
                  ? "hour"
                  : type === "Per_Day"
                  ? "day"
                  : "person"}
              </span>
            </span>{" "}
            <span className="text-lg font-light leading-7 text-[#1C1B1F]">
              {type === "Per_Hour" || type === "Per_Person"
                ? (dayjs(end).diff(dayjs(start), "minute") / 60).toFixed(2)
                : type === "Per_Day"
                ? dayjs(end).diff(dayjs(start), "day").toFixed(2)
                : ""}
              {type === "Per_Hour" || type === "Per_Person"
                ? " hours"
                : type === "Per_Day"
                ? " days"
                : ""}
            </span>
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default Boat;
