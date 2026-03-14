import Boat from "../boat";
import useWindowSize from "@/lib/hooks/use-window-size";
import { Fragment, useEffect, useRef, useState } from "react";

import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import {
  setActiveId,
  setCancelledActiveId,
  setDefaultActiveId,
} from "features/bookmark/bookmarkSlice";
import { useDispatch, useSelector } from "react-redux";
import { SELECT_VALUE } from "@/pages/history";
import useFetcher from "@/lib/hooks/use-axios";
import { useSession } from "next-auth/react";
import ReviewButton from "../reviews/ReviewButton";

const DESKTOP_PER_PAGE = 4;

const Lists = ({
  bookmarks,
  userType,
  selected,
}: {
  bookmarks: any;
  userType: string;
  selected?: string;
}) => {
  const [index, setIndex] = useState(0);
  const { isMobile, isDesktop } = useWindowSize();
  const dispatch = useDispatch();
  const { id } = useSelector((state: any) => state.bookmark.bookmarkInfo);
  const bookmarksRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const { fetchWithAuthSync } = useFetcher();

  const scrollBookmarkHn = (drxn: string) => {
    if (isMobile) {
      if (drxn === "left") {
        if (index - 1 < 0) {
          setIndex(bookmarks.length - 1);
          dispatch(setActiveId(bookmarks[bookmarks.length - 1]._id));

          const status = bookmarks[bookmarks.length - 1].status;
          if (status === "Cancelled") {
            dispatch(setCancelledActiveId(bookmarks[bookmarks.length - 1]._id));
          } else {
            dispatch(setDefaultActiveId(bookmarks[bookmarks.length - 1]._id));
          }
        } else {
          setIndex((index) => index - 1);
          dispatch(setActiveId(bookmarks[index - 1]._id));

          const status = bookmarks[index - 1].status;
          if (status === "Cancelled") {
            dispatch(setCancelledActiveId(bookmarks[index - 1]._id));
          } else {
            dispatch(setDefaultActiveId(bookmarks[index - 1]._id));
          }
        }
      }

      if (drxn === "right") {
        if (index === bookmarks.length - 1) {
          // If at last item, go to first
          setIndex(0);
          dispatch(setActiveId(bookmarks[0]._id));

          const status = bookmarks[0].status;
          if (status === "Cancelled") {
            dispatch(setCancelledActiveId(bookmarks[0]._id));
          } else {
            dispatch(setDefaultActiveId(bookmarks[0]._id));
          }
        } else {
          // Go to next item
          const nextIndex = index + 1;
          setIndex(nextIndex);
          dispatch(setActiveId(bookmarks[nextIndex]._id));

          const status = bookmarks[nextIndex].status;
          if (status === "Cancelled") {
            dispatch(setCancelledActiveId(bookmarks[nextIndex]._id));
          } else {
            dispatch(setDefaultActiveId(bookmarks[nextIndex]._id));
          }
        }
      }
    }

    /**
     * 
     * dispatch(setActiveId(_id));
          if (status === "Cancelled") {
            dispatch(setCancelledActiveId(_id));
          } else {
            dispatch(setDefaultActiveId(_id));
          }
     */

    if (isDesktop) {
      if (bookmarks.length > index * DESKTOP_PER_PAGE + DESKTOP_PER_PAGE) {
        if (drxn == "right") {
          setIndex((index) => index + 1);
          dispatch(setActiveId(bookmarks[(index + 1) * DESKTOP_PER_PAGE]._id));

          const status = bookmarks[(index + 1) * DESKTOP_PER_PAGE].status;
          if (status === "Cancelled") {
            dispatch(
              setCancelledActiveId(
                bookmarks[(index + 1) * DESKTOP_PER_PAGE]._id,
              ),
            );
          } else {
            dispatch(
              setDefaultActiveId(bookmarks[(index + 1) * DESKTOP_PER_PAGE]._id),
            );
          }
        }
        if (drxn == "left" && index > 0) {
          setIndex((index) => index - 1);
          dispatch(setActiveId(bookmarks[(index - 1) * DESKTOP_PER_PAGE]._id));

          const status = bookmarks[(index - 1) * DESKTOP_PER_PAGE].status;
          if (status === "Cancelled") {
            dispatch(
              setCancelledActiveId(
                bookmarks[(index - 1) * DESKTOP_PER_PAGE]._id,
              ),
            );
          } else {
            dispatch(
              setDefaultActiveId(bookmarks[(index - 1) * DESKTOP_PER_PAGE]._id),
            );
          }
        }
      } else {
        if (drxn == "left" && index > 0) {
          setIndex((index) => index - 1);
          dispatch(setActiveId(bookmarks[(index - 1) * DESKTOP_PER_PAGE]._id));

          const status = bookmarks[(index - 1) * DESKTOP_PER_PAGE].status;
          if (status === "Cancelled") {
            dispatch(
              setCancelledActiveId(
                bookmarks[(index - 1) * DESKTOP_PER_PAGE]._id,
              ),
            );
          } else {
            dispatch(
              setDefaultActiveId(bookmarks[(index - 1) * DESKTOP_PER_PAGE]._id),
            );
          }
        }
      }
    }

    bookmarksRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!id || !session) return;
    fetchWithAuthSync(`/reviews/booking/${id}`).then((res) => {
      console.log(res.data);
    });
  }, [id, session]);

  let element = <></>;

  useEffect(() => {
    if (!isMobile) return;

    const findIndex = bookmarks?.findIndex(
      (bookmark: any) => bookmark._id == id,
    );

    if (findIndex && findIndex !== -1) {
      setIndex(findIndex);
    } else {
      setIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    if (!id) return;

    const findIndex = bookmarks?.findIndex(
      (bookmark: any) => bookmark._id == id,
    );

    if (findIndex && findIndex !== -1) {
      setIndex(findIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!isDesktop) return;
    if (!id) return;

    const findIndex = bookmarks?.findIndex(
      (bookmark: any) => bookmark._id == id,
    );

    if (findIndex && findIndex !== -1) {
      setIndex(Math.floor(findIndex / DESKTOP_PER_PAGE));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!isDesktop) return;

    const findIndex = bookmarks?.findIndex(
      (bookmark: any) => bookmark._id == id,
    );

    if (findIndex && findIndex !== -1) {
      setIndex(Math.floor(findIndex / DESKTOP_PER_PAGE));
    } else {
      setIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  element =
    bookmarks[index] &&
    (id
      ? [
          ...(isMobile
            ? [bookmarks[index]]
            : bookmarks.slice(
                index * DESKTOP_PER_PAGE,
                index * DESKTOP_PER_PAGE + DESKTOP_PER_PAGE,
              )),
        ]
      : bookmarks
    ).map((boat: any, index: number) => (
      <Boat
        page="bookmarks"
        key={index}
        boatImg={boat.boatId.imageUrls[0]}
        boatImgs={boat.boatId.imageUrls}
        boatName={boat.boatId.boatName}
        location={boat.boatId.location}
        status={boat?.offerId ? boat?.offerId.status : boat.status}
        start={boat.duration.start}
        end={boat.duration.end}
        renterPrice={boat.renterPrice}
        pricing={boat.boatId.pricing}
        currency={boat.boatId.currency}
        type={boat.type}
        captained={boat.boatId.captained} // FIX FE-07: use direct boolean field
        peer={userType == "renter" ? boat.owner : boat.renter}
        _id={boat._id}
        listingType={boat?.boatId?.listingType}
      >
        {selected &&
          selected === SELECT_VALUE.COMPLETED &&
          userType === "renter" && (
            <ReviewButton
              bookingId={boat._id}
              boatName={boat.boatId.boatName}
              userType={userType}
            />
          )}
      </Boat>
    ));

  return (
    <Fragment>
      {element}

      {bookmarks &&
        id &&
        bookmarks?.length &&
        ((isMobile && bookmarks.length > 1) ||
          (isDesktop && bookmarks.length > 4)) && (
          <div className="mr-10 flex flex-row items-center justify-center gap-6">
            <AiFillLeftCircle
              onClick={() => scrollBookmarkHn("left")}
              className="cursor-pointer text-[#219EBC]"
              size={36}
            />
            <AiFillRightCircle
              onClick={() => scrollBookmarkHn("right")}
              className="cursor-pointer text-[#219EBC]"
              size={36}
            />
          </div>
        )}
    </Fragment>
  );
};

export default Lists;
