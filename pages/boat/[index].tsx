import { AnimatePresence, motion } from "framer-motion";
import Carousel from "@/components/layout/carousel";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ArrowDownCircle, CheckCircle2, MapPin, XCircle } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import {
  Fragment,
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import BookingForm from "@/components/booking/form";
import Meta from "@/components/layout/meta";
import Reviews from "@/components/reviews";
import { useSelector } from "react-redux";
import SearchResults from "@/components/searchResults";
import { authGetter, authPoster } from "@/lib/utils";
import useFetcher from "@/lib/hooks/use-axios";
import Favorite from "@/components/shared/icons/favorite";
import { TransitionProps } from "@mui/material/transitions";
import {
  AppBar,
  Dialog,
  IconButton,
  Button,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PriceChip from "@/components/shared/PriceChip";
import { LISTING_TYPE } from "@/lib/constants";
import { number } from "yup";
import { ShowToast } from "@/components/shared/CustomToast";

const SPECS = ["year", "length", "model", "manufacturer", "maxPassengers"];

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Search(props: any) {
  const { data, error, ...user } = props;
  const boats = useSelector((state: any) => state.boat.boats);
  const [boatId, setBoadId] = useState<string | undefined>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [open, setOpen] = useState(false);

  const { Axios } = useFetcher();
  const { data: session } = useSession();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let element = null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBoadId(location.pathname.split("/").pop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof window]);

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
    const getFavorites = async () => {
      try {
        const favorites = await authGetter(Axios, "boat/favorites");

        if (favorites.total == 0) return;

        const favoriteIds = favorites.data.map(
          (favorite: any) => favorite.boat._id,
        );

        if (favoriteIds.includes(data._id)) {
          setIsFavorite(true);
        }
      } catch (error: any) {}
    };

    if (!session?.token) return;
    getFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  useEffect(() => {
    if (!error) return;

    ShowToast({
      status: "fail",
      title: "Error Occured",
      message: "Please make sure your internet is working and try again.",
    });
  }, [error]);

  if (data) {
    element = (
      <div
        className={`mx-4 grid w-full grid-cols-1 gap-6 sm:mx-6 ${
          data.owner === user._id
            ? ""
            : "md:mx-6 lg:grid-cols-[4fr_2.25fr] xl:grid-cols-[4fr_1.75fr] 2xl:grid-cols-[4fr_1.25fr]"
        }`}
      >
        <div>
          <Carousel
            self={data.owner === user._id}
            images={data?.imageUrls.filter((img: string) => img)}
          />
          {data.owner === user._id && (
            <p className="mt-1 text-center text-lg italic">
              Note: Since you are creator of this boat, you can&apos;t book for
              yourself
            </p>
          )}
          {data.owner !== user._id && (
            <>
              <Button
                className="mt-0.5 flex w-full flex-row items-center justify-center gap-2 rounded bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none active:translate-y-0.5 active:outline-none xs:text-base sm:py-2.5 md:py-4 md:text-lg lg:hidden"
                onClick={handleClickOpen}
              >
                Request A Booking
              </Button>
            </>
          )}

          <br />

          {data.listingType === LISTING_TYPE.ACTIVITY && (
            <>
              <h1 className="mb-1 text-lg font-bold">Activities</h1>
              <div className=" text-gray-500 lg:text-lg">
                {data.activityTypes.map(
                  ({
                    type,
                    durationHours,
                  }: {
                    type: string;
                    durationHours: number;
                  }) => (
                    <div
                      className="flex max-w-60 flex-row justify-between"
                      key={type}
                    >
                      <p>{type}</p>
                      <p>{durationHours} hours</p>
                    </div>
                  ),
                )}
              </div>
              <br />
            </>
          )}

          <h1 className="mb-1 text-lg font-bold">Description</h1>
          <p className="text-gray-700">{data.description}</p>
          <br />

          {data.listingType === LISTING_TYPE.RENTALS && (
            <>
              <h1 className="mb-1 text-lg font-bold">Features and Amenities</h1>
              <ul className="flex flex-row flex-wrap gap-5">
                {Array.isArray(data?.features) &&
                  data?.features?.map((item: string, index: number) => (
                    <span
                      key={index}
                      className="flex flex-row items-center gap-2 text-gray-500 lg:text-lg"
                    >
                      <CheckCircle2 />
                      <li key={index}>{item}</li>
                    </span>
                  ))}

                {Array.isArray(data?.amenities) &&
                  data?.amenities?.map((item: string, index: number) => (
                    <span
                      key={index}
                      className="flex flex-row items-center gap-2 text-gray-500 lg:text-lg"
                    >
                      <CheckCircle2 />
                      <li key={index}>{item}</li>
                    </span>
                  ))}
              </ul>
              <br />
            </>
          )}

          <h1 className="mb-2 text-lg font-bold">Specifications</h1>
          <ul className="ml-1 flex flex-col flex-wrap gap-5">
            {SPECS?.map((item: string, index: number) => (
              <Fragment key={index}>
                {(data[item] || typeof data[item] === "number") && (
                  <div className="relative grid w-fit grid-cols-[180px_auto]">
                    <div className="absolute bottom-0 h-0.5 w-full bg-gray-600"></div>
                    <p className="text-gray-600 lg:text-lg">{`${
                      item[0].toUpperCase() + item.slice(1)
                    }`}</p>
                    <p className="font-medium text-gray-900">{data[item]}</p>
                  </div>
                )}
              </Fragment>
            ))}
          </ul>
          <br />
        </div>
        {data.owner !== user._id && (
          <>
            <div className="mx-auto hidden w-full lg:block">
              <BookingForm data={data} user={user} />
            </div>
            {data.owner !== user._id && (
              <Dialog
                open={open}
                TransitionComponent={Transition}
                // keepMounted
                fullScreen
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                  sx: {
                    bgcolor: "background.paper",
                    color: "text.primary",
                  },
                }}
              >
                <AppBar sx={{ position: "relative" }}>
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleClose}
                      aria-label="close"
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography
                      sx={{ ml: 2, flex: 1 }}
                      variant="h6"
                      component="div"
                    >
                      Fill Booking Request Form
                    </Typography>
                  </Toolbar>
                </AppBar>
                <BookingForm data={data} user={user} screen="small" />
              </Dialog>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mt-20 flex min-h-screen flex-col">
      <Meta
        title={data ? data.boatName : "boat"}
        description={data?.description}
      />

      <Header {...user}>
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
        >
          <div className="m-4 flex flex-row justify-between sm:m-7">
            {data ? (
              <div>
                <h1 className="md:text-2x font-inter text-lg font-bold sm:text-xl lg:text-3xl">
                  {data?.boatName}
                  {session?.token && (
                    <button
                      onClick={(event: any) => favoriteClickHn(event, boatId)}
                      className="ml-2 rounded-lg bg-gray-200 p-2"
                    >
                      <Favorite isFavorite={isFavorite} />
                    </button>
                  )}
                </h1>
                <p className="mt-1.5 inline-flex text-xs text-gray-600 xs:text-sm sm:text-base">
                  <MapPin className="mt-1" size={18} />{" "}
                  {data?.location?.address}. {data?.location?.city},{" "}
                  {data?.location?.state} {data?.location?.zipCode}{" "}
                </p>
              </div>
            ) : null}

            {data?.listingType ? (
              <div className="ml-1 flex h-fit flex-row gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 2xl:gap-4">
                {/* Per Hour or Per Person Price */}
                <div className="flex flex-col items-start gap-1">
                  <PriceChip
                    price={
                      data.listingType === LISTING_TYPE.ACTIVITY
                        ? data?.pricing.perPerson
                        : data?.pricing.perHour
                    }
                    currency={data?.currency}
                    className="!bg-gray-200 p-1 xs:px-3 xs:py-1.5"
                    type={
                      data?.listingType === LISTING_TYPE.ACTIVITY
                        ? "person"
                        : "hour"
                    }
                  />
                  {data.listingType === LISTING_TYPE.RENTALS &&
                    data?.pricing?.hourDiscount?.[0] && (
                      <p className="flex items-start gap-1 text-xs text-gray-500 sm:text-sm">
                        <ArrowDownCircle
                          size={16}
                          className="mt-0.5 text-orange-600"
                        />
                        {data.pricing.hourDiscount[0].discountPercentage}%
                        {" on "}
                        {data.pricing.hourDiscount[0].minHoursForDiscount}+ hrs
                      </p>
                    )}
                  {data.listingType === LISTING_TYPE.ACTIVITY &&
                    data?.pricing?.discountPercentage?.[0] && (
                      <p className="flex items-start gap-1 text-xs text-gray-500 sm:text-sm">
                        <ArrowDownCircle
                          size={16}
                          className="mt-0.5 text-orange-600"
                        />
                        {data.pricing.discountPercentage[0].percentage}% on{" "}
                        {data.pricing.discountPercentage[0].minPeople}+ ppl
                      </p>
                    )}

                  {(data?.pricing.perPerson || data?.pricing.perHour) && (
                    <p className="flex items-start gap-1 text-xs text-gray-500 sm:text-sm">
                      # {data?.pricing.perPerson ? "max" : "min"}{" "}
                      {data?.pricing.perPerson ? "person" : "hours"}:
                      {data?.pricing.perPerson
                        ? data.maxPassengers
                        : data.pricing.minHours}
                    </p>
                  )}
                </div>

                {/* Per Day Price */}
                {data.listingType !== LISTING_TYPE.ACTIVITY && (
                  <div className="flex flex-col items-start  gap-1">
                    {data?.pricing.perDay && (
                      <PriceChip
                        price={data?.pricing.perDay}
                        currency={data?.currency}
                        className="!bg-gray-200 p-1 xs:px-3 xs:py-1.5"
                        type="day"
                      />
                    )}
                    {data?.pricing?.dayDiscount?.[0] && (
                      <p className="flex items-start gap-1 text-xs text-gray-500 sm:text-sm">
                        <ArrowDownCircle
                          size={16}
                          className="mt-0.5 text-orange-600"
                        />
                        {data.pricing.dayDiscount[0].discountPercentage}% on{" "}
                        {data.pricing.dayDiscount[0].minDaysForDiscount}+ days
                      </p>
                    )}
                    {data?.pricing.perDay && (
                      <p className="flex items-start gap-1 text-xs text-gray-500 sm:text-sm">
                        # min days: {data.pricing.minDays}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <div className="flex w-full flex-wrap justify-evenly gap-x-1.5 gap-y-2.5">
            {element}
          </div>

          <div className="mx-4 sm:mx-6 md:mx-6">
            <div className="flex flex-row flex-wrap gap-6 pb-4 pt-0">
              <Reviews
                boatId={data?._id}
                boatName={data?.name}
                showReviewButton={true}
              />
            </div>

            {boatId && boats && boats.data && boats.data.length > 0 && (
              <p className="mb-3 text-lg font-bold text-black">
                Related Bookings
              </p>
            )}

            {boatId && boats && boats.data && boats.data.length > 0 && (
              <SearchResults
                boats={boats.data.filter(
                  ({ _id }: { _id: string }) => _id != boatId,
                )}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { req, params } = context;

  let session = await getSession({ req });

  if (!session) {
    session = null;
  }

  const myHeaders = new Headers();

  myHeaders.append("Authorization", "Bearer " + session?.token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  let data = null;
  let error = null;

  try {
    data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/boat/${params.index}`,
      requestOptions,
    );

    data = await data.json();

    if (!data) {
      error = true;
    }
  } catch (error) {
    error = true;
  }

  return {
    props: {
      ...session,
      data,
      error,
    },
  };
}
