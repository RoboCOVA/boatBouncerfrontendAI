import { useState } from "react";
import Swipe from "react-easy-swipe";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import DynamicImage from "./image";

/**
 * Carousel component for nextJS and Tailwind.
 * Using external library react-easy-swipe for swipe gestures on mobile devices (optional)
 *
 * @param images - Array of images with src and alt attributes
 * @returns React component
 */
export default function Carousel({
  images,
  page,
  self,
}: {
  images: any;
  page?: string;
  self?: boolean;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  // const url = buildUrl()

  const handleNextSlide = () => {
    let newSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newSlide);
    setDirection(1);
  };

  const handlePrevSlide = () => {
    let newSlide = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
    setDirection(-1);
  };

  return (
    <div className="relative">
      <div
        className={`group relative m-auto flex ${
          page == "search" || page == "listing" || page == "favorite"
            ? " lg:h-[24vh]"
            : page == "bookmarks"
            ? "h-32"
            : "h-[22.5vh] xs:h-[35vh] sm:h-[40vh] md:h-[42.5vh] lg:h-[47.5vh] xl:h-[52.5vh] 2xl:h-[62.5vh]"
        } w-full overflow-hidden rounded shadow-sm drop-shadow-sm ${
          self && "lg:h-[62.5vh] xl:h-[67.7vh] 2xl:h-[75.75vh]"
        }`}
      >
        {page !== "bookmarks" && (
          <AiFillLeftCircle
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handlePrevSlide();
            }}
            className={`absolute inset-y-1/2 left-4 z-20 m-auto cursor-pointer transition-all ${
              page == "search" || page == "listing" || page == "favorite"
                ? "left-2.5 text-3xl opacity-0 group-hover:opacity-75 sm:left-2.5"
                : "left-4 text-3xl opacity-90 sm:left-5 md:text-4xl xl:text-5xl"
            } rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-green-400`}
          />
        )}

        <Swipe
          onSwipeLeft={handleNextSlide}
          onSwipeRight={handlePrevSlide}
          className="relative !z-10 h-full w-full"
        >
          {images &&
            images?.length &&
            images.length > 0 &&
            images.map((image: string, index: number) => {
              if (index === currentSlide) {
                return (
                  <DynamicImage
                    image={image}
                    key={index}
                    index={index}
                    direction={direction}
                  />
                );
              }
            })}
        </Swipe>

        {page !== "bookmarks" && (
          <AiFillRightCircle
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleNextSlide();
            }}
            className={`absolute inset-y-1/2 transition-all ${
              page == "search" || page == "listing" || page == "favorite"
                ? "right-2.5 text-3xl opacity-0 group-hover:opacity-75 sm:right-2.5"
                : "right-4 text-3xl opacity-90 sm:right-5 md:text-4xl xl:text-5xl"
            } z-20 m-auto cursor-pointer rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-green-400`}
          />
        )}
      </div>
    </div>
  );
}
