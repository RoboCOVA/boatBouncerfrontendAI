import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import useFetcher from "@/lib/hooks/use-axios";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import Boat from "../boat";
import {
  resetBoat,
  setBoatInfo,
  setEditableBoat,
} from "features/boat/boatSlice";
import AlertDialogs from "../shared/alertDialog";
import { Badge, CircularProgress } from "@mui/material";
import { authGetter } from "@/lib/utils";
import Router from "next/router";
import { setActiveBoatId, setTarget } from "features/bookmark/bookmarkSlice";
import toast from "react-hot-toast";
import { ShowToast } from "../shared/CustomToast";
import SyncLoading from "../shared/syncLoading";

const PAGE_SIZE = 10;

const DisplayListings = ({
  addListingsHn,
}: {
  addListingsHn: (status: any) => void;
}) => {
  const {
    fetchWithAuthWCancellation,
    // deleteBoat,
    // updateBoat,
    data,
    Axios,
    loading,
    error,
    // fetchWithAuthSync,
  } = useFetcher();
  const [favorites, setFavorites] = useState<string[]>([]);
  const editableListing = useSelector((state: any) => state.boat.editableBoat);
  // const [chargesEnabled, setchargesEnabled] = useState<Boolean | null>(null);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [listings, setListings] = useState<any[]>([]);

  const [pageNo, setPageNo] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  // const router = useRouter();
  // const { success } = router.query;

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const favorites = await authGetter(Axios, "boat/favorites");
        if (favorites.total == 0) return;

        const favoriteIds = favorites.data.map(
          (favorite: any) => favorite.boat._id,
        );

        setFavorites(favoriteIds);
      } catch (error) {}
    };

    if (!session?.token) return;
    getFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  useEffect(() => {
    if (!session?.token) return;
    fetchWithAuthWCancellation(
      `/boat/listing?pageNo=${pageNo}&size=${PAGE_SIZE}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token, pageNo]);

  // useEffect(() => {
  //   if (!session?.token) return;

  //   fetchWithAuthSync("/user/current")
  //     .then((res: AxiosResponse) => {
  //       setchargesEnabled(res.data.chargesEnabled);
  //     })
  //     .catch(() => {
  //       setchargesEnabled(false);
  //     });
  // }, [session?.token]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pageNo]);

  useEffect(() => {
    if (!data || loading || error) return;

    if (Array.isArray(data)) {
      setListings(data);
    }
  }, [data, loading, error]);

  let displayEl = null;

  if (loading && !error && listings.length == 0) {
    displayEl = (
      <div className="my-auto mb-3 flex w-full items-center text-cyan-600">
        <CircularProgress color="inherit" size="5vh" />
      </div>
    );
  }

  const nextPage = () => {
    setPageNo((page) => page + 1);
  };

  const prevPage = () => {
    setPageNo((page) => page - 1);
  };

  const editListingHandler = (boat: any) => {
    let boatFields;

    if (boat.listingType === "activity") {
      boatFields = {
        _id: boat._id,
        boatName: boat.boatName,
        description: boat.description,
        address: boat.location.address,
        securityAllowance: boat.securityAllowance.split(" ")[0],
        location: boat.location,
        currency: "USD",
        maxPassengers: boat.maxPassengers,
        imageUrls: boat.imageUrls,
        latLng: {
          latitude: boat.latLng?.coordinates
            ? boat.latLng.coordinates[1]
            : null,
          longitude: boat.latLng?.coordinates
            ? boat.latLng?.coordinates[0]
            : null,
        },
        listingType: boat.listingType,
        activityType: boat.activityTypes?.[0]?.type ?? "",
        activityDuration: boat.activityTypes?.[0]?.durationHours ?? "",
        cancelationPolicy: [
          {
            refund: boat?.cancelationPolicy?.[0]?.refund ?? "",
            priorHours: boat?.cancelationPolicy?.[0]?.priorHours,
          },
        ],
        minPeople: boat.pricing.discountPercentage?.[0]?.minPeople ?? "",
        discount: boat.pricing.discountPercentage?.[0]?.percentage ?? "",
        perPerson: boat.pricing.perPerson,
      };
    } else {
      boatFields = {
        _id: boat._id,
        boatName: boat.boatName,
        boatType: boat.boatType,
        description: boat.description,
        manufacturer: boat.manufacturer,
        model: boat.model,
        year: boat.year,
        length: boat?.["length"] || 0, // Assuming length might not be present in the API response
        maxPassengers: boat.maxPassengers,
        imageUrls: boat.imageUrls,
        location: {
          city: boat.location.city,
          state: boat.location.state,
          address: boat.location.address,
          zipCode: boat.location.zipCode,
        },
        address: boat.location.address,
        features: boat.features,
        securityAllowance: boat.securityAllowance,
        currency: boat.currency,
        latLng: {
          latitude: boat.latLng?.coordinates
            ? boat.latLng.coordinates[1]
            : null,
          longitude: boat.latLng?.coordinates
            ? boat.latLng.coordinates[0]
            : null,
        },
        listingType: boat.listingType,
        perHourPrice: boat.pricing.perHour,
        perDayPrice: boat.pricing.perDay,
        hours: boat.pricing.minHours || 0,
        days: boat.pricing.minDays,
        hourlyDiscount: boat.pricing.hourDiscount?.[0]?.discountPercentage || 0,
        minHoursForDiscount:
          boat.pricing.hourDiscount?.[0]?.minHoursForDiscount || 0,
        dailyDiscount: boat.pricing.dayDiscount?.[0]?.discountPercentage,
        minDaysForDiscount: boat.pricing.dayDiscount?.[0]?.minDaysForDiscount,
        cancelationPolicy: boat.cancelationPolicy,
      };
    }

    dispatch(setEditableBoat(boatFields));
    dispatch(setBoatInfo(boatFields));
    addListingsHn(true);
  };

  const addNewListingHn = () => {
    dispatch(resetBoat());
    addListingsHn(true);
  };

  const deleteBoatHandler = async (boat: any) => {
    dispatch(resetBoat());
    try {
      setIsDeleting(true);
      let deleteBoat = await Axios.delete(`boat/${boat._id}`);
      if (deleteBoat.status == 200) {
        ShowToast({
          title: "Boat Deleted",
          message: "The boat has been successfully deleted.",
          status: "success",
        });
        const deletedListings = listings.filter(
          (list) => list._id !== boat._id,
        );

        setListings(deletedListings);
        if (deletedListings.length === 0) {
          if (pageNo > 1) {
            setPageNo((p) => p - 1);
          } else {
            fetchWithAuthWCancellation(
              `/boat/listing?pageNo=${pageNo}&size=${PAGE_SIZE}`,
            );
          }
        }
      }
    } catch (error) {
      ShowToast({
        title: "Error",
        message: "An error occurred while deleting the boat.",
        status: "fail",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const pauseBoatHandler = async (boat: any) => {
    try {
      let updateBoat = await Axios.put(`boat/${boat._id}`, {
        status: boat.status === "active" ? "paused" : "active",
        listingType: boat.listingType,
      });
      if (updateBoat.status == 200) {
        const updatedListings = listings.map((list) => {
          if (list._id === boat._id) {
            return {
              ...list,
              status: boat.status === "active" ? "paused" : "active",
            };
          } else return list;
        });
        setListings(updatedListings);
      }
    } catch (error) {
      ShowToast({
        title: "Error",
        message: "An error occurred while updating the boat.",
        status: "fail",
      });
    }
  };

  // const getPaymentHn = () => {
  //   fetchWithAuthSync("/user/stripAccount", {})
  //     .then((res: AxiosResponse) => {
  //       router.replace(res.data.url);
  //     })
  //     .catch(() => {});
  // };

  if (!error && !loading && data && data?.length == 0 && pageNo == 1) {
    displayEl = (
      <motion.p className="flex h-12 items-center justify-start text-start text-2xl font-semibold text-orange-400 sm:min-w-[320px]">
        You have no listings added.
      </motion.p>
    );
  }

  if (error) {
    displayEl = (
      <motion.p className="flex h-12 items-center justify-start text-start text-2xl font-semibold text-orange-700 sm:min-w-[320px]">
        Error occured on getting listings
      </motion.p>
    );
  }

  if (listings && listings.length === 0 && pageNo > 1) {
    prevPage();
  }

  const bookingClickHn = (boat: any) => {
    dispatch(setActiveBoatId(boat._id));
    dispatch(setTarget("owner"));
    Router.push({
      pathname: "/bookings",
    });
  };

  if (listings && listings.length > 0) {
    displayEl = (
      <Fragment>
        {listings.map((boat: any) => (
          <Boat
            page="listing"
            boatId={boat._id}
            key={boat._id}
            favorite={favorites.includes(boat._id)}
            boatImg={boat.imageUrls[0]}
            boatImgs={boat.imageUrls}
            boatName={boat.boatName}
            location={boat.location}
            captained={boat.captained} // FIX FE-07: use direct boolean field
            listingType={boat.listingType}
          >
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-row gap-2">
                <button
                  onClick={() => editListingHandler(boat)}
                  className="my-2 rounded-lg border border-solid border-cyan-600 px-3 py-2 text-sm font-medium text-cyan-600"
                >
                  Edit Listing
                </button>
                <button
                  onClick={() => bookingClickHn(boat)}
                  className="my-2 flex flex-row items-center gap-4 rounded-lg border border-solid border-amber-500 px-3 py-2 text-sm font-medium text-amber-500"
                >
                  Bookings
                  <Badge badgeContent={boat.count} color="primary"></Badge>
                </button>
              </div>
              <div className="flex flex-row gap-2">
                <AlertDialogs
                  prompt="Yes, delete boat"
                  data={boat}
                  confirmHandler={deleteBoatHandler}
                  description={
                    "This action cannot be undone. This will permanently delete your listing information from our servers."
                  }
                >
                  <button className="my-2 rounded-lg border border-orange-700 px-3 text-sm font-medium text-orange-700 sm:py-2">
                    Delete Listing
                  </button>
                </AlertDialogs>
                {boat.status && (
                  <AlertDialogs
                    prompt={`Yes, ${
                      boat.status === "active" ? "pause" : "unpause"
                    } the boat`}
                    data={boat}
                    confirmHandler={pauseBoatHandler}
                    description={`${
                      boat.status === "active"
                        ? "This boat will not be available when searching. You have to unpause when you want to make it available for search."
                        : "This boat will be available when searching now. You have to pause again when you want to make it unavailable for search."
                    }`}
                  >
                    <button className="my-2 rounded-lg border border-solid border-amber-500 px-3 text-sm font-medium text-gray-500 sm:py-2">
                      {boat.status === "active" ? "PAUSE" : "UNPAUSE"}
                    </button>
                  </AlertDialogs>
                )}
              </div>
            </div>
          </Boat>
        ))}
      </Fragment>
    );
  }

  return (
    <div className="2xl:container sm:mx-10 md:mx-12 lg:mx-14 xl:mx-16 2xl:mx-auto">
      {/* {typeof chargesEnabled === "boolean" &&
        !chargesEnabled &&
        !error &&
        !loading &&
        data &&
        data?.length >= 1 && (
          <>
            <div className="mb-10 flex flex-col flex-wrap text-base font-medium italic text-orange-400 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
              <p className="sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                {success && "(Payment method addition was unsuccessful)"}
              </p>
              <p>
                Your boats will not be visible unless you add a method to get
                payments.{" "}
                <Link onClick={getPaymentHn} href="" className="underline">
                  Add Here
                </Link>{" "}
              </p>
            </div>
          </>
        )} */}
      {/* {success &&
        success == "true" &&
        typeof chargesEnabled === "boolean" &&
        chargesEnabled && (
          <p className="mb-3 w-fit rounded border py-1 pl-1.5 pr-5 text-lg font-medium italic text-[#2e7d32]">
            Congratulations! Your payment method has been successfully set up to
            receive payments.
          </p>
        )} */}
      <div className="flex flex-row items-center justify-between">
        <p className="text-xl font-medium text-gray-900 sm:text-3xl">
          My Listings
        </p>
        <button
          onClick={addNewListingHn}
          className="flex flex-row items-center gap-2 rounded-lg bg-cyan-600 px-3 py-3 font-inter text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-cyan-700 active:translate-y-[1.5px] sm:gap-2 sm:px-7 sm:py-[1rem]"
        >
          <Plus size="20" /> Add New Listing
        </button>
      </div>
      <p className="mb-6 mt-1 text-gray-500">
        Track, manage and forecast your Listings.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {displayEl}
      </div>
      {listings?.length > 10 && (
        <>
          <hr className="mb-2 mt-5" />
          <div className="mx-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-lg">
              Page {pageNo} | ({listings?.length} results)
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={prevPage}
                className={`rounded-lg border px-5 py-1.5 text-lg font-medium ${
                  pageNo === 1 ? "opacity-40" : ""
                }`}
                disabled={pageNo === 1}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                className={`rounded-lg border px-5 py-1.5 text-lg font-medium ${
                  pageNo * PAGE_SIZE >= data?.length ? "opacity-40" : ""
                }`}
                disabled={pageNo * PAGE_SIZE >= data?.length}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      <div className="mb-10"></div>

      {isDeleting && <SyncLoading />}
    </div>
  );
};

export default DisplayListings;
