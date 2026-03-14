import Lists from "@/components/booking/lists";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { AnimatePresence, motion } from "framer-motion";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetcher from "@/lib/hooks/use-axios";
import Details from "@/components/booking/details";
import Link from "next/link";
import Preview from "@/components/offer/preview";
import Meta from "@/components/layout/meta";
import Chat from "@/components/chat";
import { useRouter } from "next/router";
import { Box, CircularProgress } from "@mui/material";
import {
  resetId,
  resetBoatId,
  setActiveId,
  setCancelledActiveId,
  setDefaultActiveId,
} from "features/bookmark/bookmarkSlice";
import * as Avatar from "@radix-ui/react-avatar";
import _ from "lodash";
import { DoubleArrowLeftIcon } from "@radix-ui/react-icons";
import { authGetter } from "@/lib/utils";
import BookedBoats from "@/components/BookedBoats";
import HistoryBox from "@/components/layout/historyBox";
import { ShowToast } from "@/components/shared/CustomToast";

export const SELECT_VALUE = {
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const bookingTypes = [
  {
    id: 1,
    type: "Completed Bookings",
    value: SELECT_VALUE.COMPLETED,
  },
  {
    id: 2,
    type: "Cancelled Bookings",
    value: SELECT_VALUE.CANCELLED,
  },
];

export default function Bookmarks(props: any) {
  const { ...user } = props;
  const { data: session } = useSession();
  const { id, cancelId, defaultId } = useSelector(
    (state: any) => state.bookmark.bookmarkInfo,
  );
  const { boatId, target } = useSelector(
    (state: any) => state.bookmark.bookmarkInfo,
  );
  const [bookmarks, setBookmarks] = useState<any>();
  const { fetchWithAuth, data, loading, error, Axios } = useFetcher();

  const router = useRouter();
  const { query } = router;
  const [selected, setSelected] = useState(bookingTypes[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tempData, setTempData] = useState<any>([]);

  const [bookingTab, setBookingTab] = useState(boatId ? "owner" : "renter");
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState(false);
  const [userProfileRightOpen, setUserProfileRightOpen] = useState(false);

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen);
  const handleUserProfileLeftSidebarToggle = () =>
    setUserProfileLeftOpen(!userProfileLeftOpen);
  const handleUserProfileRightSidebarToggle = () =>
    setUserProfileRightOpen(!userProfileRightOpen);

  let element = null;

  const setRefreshHn = () => {
    setRefresh((r) => !r);
  };

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
    if (!target) return;

    setBookingTab(target);
  }, [target]);

  useEffect(() => {
    if (!session?.token) return;

    if (selected.value === SELECT_VALUE.CANCELLED) {
      fetchWithAuth(
        `/booking/canceled${
          bookingTab === "owner" ? "?as=owner" : "?as=renter"
        }`,
      );
    } else {
      fetchWithAuth(
        `/booking/completed${
          bookingTab === "owner" ? "?as=owner" : "?as=renter"
        }`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingTab, session?.token, refresh, selected.value, id]);

  useEffect(() => {
    if (!id) return;
    if (!session?.token) return;

    if (data && Array.isArray(data)) {
      setTempData(data);
    }

    let bookmark = data && data.filter((d: any) => d._id === id);
    if (bookmark) {
      setBookmarks(bookmark[0]);
    }
  }, [id, data, session?.token]);

  useEffect(() => {
    if (!data) return;
    if (!session?.token) return;

    if (data && Array.isArray(data)) {
      setTempData(data);
    }
  }, [data, session?.token]);

  useEffect(() => {
    if (!id || !data || !Array.isArray(data) || !data[0]) return;

    if (selected.value === SELECT_VALUE.CANCELLED) {
      if (cancelId) {
        dispatch(setActiveId(cancelId));
      } else {
        dispatch(setActiveId(data[0]._id));
        dispatch(setCancelledActiveId(data[0]._id));
      }
    } else {
      if (defaultId) {
        dispatch(setActiveId(defaultId));
      } else {
        dispatch(setActiveId(data[0]._id));
        dispatch(setDefaultActiveId(data[0]._id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.value, bookingTab, data]);

  useEffect(() => {
    if (!error) return;

    ShowToast({
      status: "fail",
      title: "Error Occured",
      message: "Please make sure your internet is working and try again.",
    });
  }, [error]);

  if (Array.isArray(data) && data.length > 0 && !boatId) {
    const groupedData = _.groupBy(data, ({ boatId }) => boatId?._id);

    element = Object.keys(groupedData).map((id: string) => {
      if (!groupedData[id][0].boatId) return;
      return (
        <BookedBoats
          page="listing"
          key={id}
          boatId={id}
          _id={groupedData[id][0]._id}
          favorite={favorites.includes(id)}
          boatImg={groupedData[id][0].boatId.imageUrls[0]}
          boatImgs={groupedData[id][0].boatId.imageUrls}
          boatName={groupedData[id][0].boatId.boatName}
          location={groupedData[id][0].boatId.location}
          captained={groupedData[id][0].boatId.captained}
          pricing={groupedData[id][0].boatId.pricing}
          listingType={groupedData[id][0].boatId.listingType}
        >
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-row gap-2">
              <button
                // onClick={() => bookingClickHn(boat)}
                className="my-2 flex flex-row items-center rounded-lg border border-solid border-amber-500 px-3 py-2 text-sm font-medium text-amber-500"
              >
                Bookings{" "}
                <Avatar.Root className=" ml-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700">
                  <Avatar.Fallback>{groupedData[id].length}</Avatar.Fallback>
                </Avatar.Root>
              </button>
            </div>
          </div>
        </BookedBoats>
      );
    });
  }

  if (tempData && tempData.length && tempData?.length > 0 && boatId) {
    element = (
      <Lists
        bookmarks={tempData.filter((d: any) => d.boatId?._id == boatId)}
        userType={bookingTab}
        selected={selected.value}
      />
    );
  }

  if (data && data?.length === 0) {
    element = (
      <motion.p className="flex h-12 items-center justify-start whitespace-nowrap text-center text-2xl font-semibold text-orange-400">
        You have no {selected.value === "cancelled" ? "cancelled" : "active"}{" "}
        requests
      </motion.p>
    );
  }

  if (
    boatId &&
    tempData &&
    Array.isArray(tempData) &&
    tempData?.filter((d: any) => d.boatId?._id == boatId).length === 0
  ) {
    element = (
      <motion.p className="flex h-12 items-center justify-start whitespace-nowrap text-center text-2xl font-semibold text-orange-400">
        You have no {selected.value === "cancelled" ? "cancelled" : "active"}{" "}
        requests
      </motion.p>
    );
  }

  if (loading && !id) {
    element = (
      <div className="h-60 w-full">
        <div className="flex h-full w-full items-center justify-center text-cyan-600">
          <CircularProgress color="inherit" size="5vh" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 flex min-h-screen flex-col">
      <Meta title="bookmarks" />
      <Header {...user}>
        <Link href="/" className="ml-6 text-sm font-bold text-cyan-600">
          Home
        </Link>
      </Header>
      <hr className="mb-2 mt-1 h-px border-0 bg-white" />

      <div className="mx-4 sm:mb-6 sm:ml-7">
        <p className="mb-1 text-3xl font-medium text-gray-900">Bookings</p>
        <p className=" text-gray-500">
          Track, manage bookings as renter and owner at one place.
        </p>
        <div className="after:block after:h-px after:w-full after:bg-gray-300 after:content-['']">
          <div className="relative mt-6 flex items-center gap-4">
            <button
              onClick={() => {
                setBookingTab("owner");
              }}
              className={`p-2 text-sm font-medium leading-5 ${
                bookingTab === "owner"
                  ? "border border-b-[#219EBC] bg-[#F9F5FF] text-[#219EBC]"
                  : "text-[#667085]"
              }`}
            >
              As Owner
            </button>
            <button
              onClick={() => {
                setBookingTab("renter");
              }}
              className={`p-2 text-sm font-medium leading-5 ${
                bookingTab === "renter"
                  ? "border border-b-[#219EBC] bg-[#F9F5FF] text-[#219EBC]"
                  : "text-[#667085]"
              }`}
            >
              As Renter
            </button>

            {data && boatId && (
              <button
                onClick={() => {
                  dispatch(resetBoatId());
                  dispatch(resetId());
                  setBookmarks(null);
                }}
                className={`${
                  boatId ? "opacity-100" : "opacity-0"
                } absolute bottom-0.5 right-0 flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-cyan-600 px-3 py-2 text-center text-white transition-all duration-1000 hover:bg-cyan-700 active:translate-y-[1.5px]`}
              >
                <DoubleArrowLeftIcon className="text-3xl" /> BACK
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative -mt-0 mb-0 mr-3 sm:-mt-5 sm:mb-2 sm:ml-7 sm:mr-4">
        <div className="z-50 float-right w-fit cursor-pointer rounded-lg text-center text-white transition-all duration-1000">
          <HistoryBox selected={selected} setSelected={setSelected} />
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`mt-4 flex w-full flex-row gap-y-6 sm:mt-0 ${
            id ? "flex-col sm:flex-row" : ""
          }`}
          key="bookmakers-div"
        >
          <div
            className={`mb-4 flex h-fit w-full flex-wrap justify-center gap-x-3 gap-y-3 ${
              id
                ? "mx-5 sm:ml-7 sm:min-w-[360px] sm:max-w-[50%] md:max-w-sm"
                : "mx-3 grid grid-cols-1 gap-x-2.5 sm:ml-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {element}
          </div>

          {id && bookmarks && (
            <div className="flex w-full flex-col gap-0 pl-2.5 sm:mr-4">
              <div className="flex flex-row items-center gap-3 border-b border-solid border-b-slate-200 bg-[#219EBC] px-6 py-2.5 sm:mx-0 sm:rounded-[16px_16px_0px_0px]">
                <Avatar.Root className="inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
                  <Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-white text-[16px] font-semibold text-violet11">
                    {`${bookmarks?.[
                      bookingTab === "renter" ? "owner" : "renter"
                    ]?.firstName[0].toUpperCase()}${bookmarks?.[
                      bookingTab === "renter" ? "owner" : "renter"
                    ]?.lastName?.[0]?.toUpperCase()}`}
                  </Avatar.Fallback>
                </Avatar.Root>
                <p className="text-white">
                  {
                    bookmarks?.[bookingTab === "renter" ? "owner" : "renter"]
                      ?.firstName
                  }{" "}
                  {
                    bookmarks?.[bookingTab === "renter" ? "owner" : "renter"]
                      ?.lastName
                  }
                </p>
              </div>
              <div className="flex w-full flex-col items-start gap-8 lg:mb-5 lg:gap-2 xl:flex-row">
                <div className="flex w-full flex-col bg-[#F8FAFC] xl:min-w-[296px] xl:max-w-[348px]">
                  <div className="p-6">
                    <p className="font-inter font-medium text-[#1C1B1F]">
                      Booking Information
                    </p>
                    <Details info={bookmarks} />
                  </div>
                  <div className="mt-16 flex w-full flex-col sm:mx-0">
                    {bookmarks?.offerId && (
                      <p className="flex flex-col items-start gap-2 bg-[#023047] px-6 py-4">
                        <span className="font-medium text-white">
                          {selected.value == "completed"
                            ? "Completed Offer"
                            : "Cancelled Offer"}
                        </span>
                      </p>
                    )}
                    {bookmarks?.offerId && (
                      <Preview
                        {...bookmarks?.offerId}
                        type={bookmarks.type}
                        className="bg-white px-4"
                      />
                    )}
                  </div>
                </div>
                <div className="flex h-full w-full overflow-y-clip xl:relative">
                  <Box
                    className="h-[75vh] w-full grow xl:absolute xl:bottom-0 xl:left-0 xl:right-0 xl:top-0 xl:h-auto"
                    sx={{
                      backgroundColor: "action.hover",
                    }}
                  >
                    <Chat
                      bookmarks={bookmarks}
                      user={user}
                      cancelled={
                        selected.value == "cancelled" ||
                        selected.value == "completed"
                      }
                      bookingTab={bookingTab}
                      userProfileRightOpen={userProfileRightOpen}
                      handleLeftSidebarToggle={handleLeftSidebarToggle}
                      handleUserProfileRightSidebarToggle={
                        handleUserProfileRightSidebarToggle
                      }
                    />
                  </Box>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        <div className="mb-5"></div>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;

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
    },
  };
}
