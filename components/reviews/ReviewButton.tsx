import { useState, useEffect } from "react";
import ReviewModal from "./ReviewModal";
import useFetcher from "@/lib/hooks/use-axios";

interface ReviewButtonProps {
  bookingId: string;
  boatName: string;
  userType: string;
}

const ReviewButton = ({ bookingId, boatName, userType }: ReviewButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchWithAuthSync } = useFetcher();

  interface ReviewResponse {
    data: any; // Replace 'any' with your actual review data type if available
  }

  useEffect(() => {
    const checkForReview = async () => {
      try {
        const response = await fetchWithAuthSync(
          `/reviews/booking/${bookingId}`,
        );

        console.log("response", response);

        setHasReview(!!response?.data?.data?.length);
      } catch (error) {
        console.error("Error checking for review:", error);
        setHasReview(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId && userType === "renter") {
      checkForReview();
    } else {
      setIsLoading(false);
    }
  }, [bookingId, userType, fetchWithAuthSync]);

  if (isLoading || hasReview || userType !== "renter") {
    return null;
  }

  return (
    <>
      {!hasReview && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="rounded-md bg-[#219EBC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a7d94] focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:ring-offset-2"
          >
            Add a Review
          </button>
        </div>
      )}

      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        bookingId={bookingId}
        boatName={boatName}
        onSuccess={() => setHasReview(true)}
      />
    </>
  );
};

export default ReviewButton;
