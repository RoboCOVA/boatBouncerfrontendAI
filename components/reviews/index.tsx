import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReviewList from "./ReviewList";
import useFetcher from "@/lib/hooks/use-axios";

interface ReviewsProps {
  boatId: string;
  boatName: string;
  bookingId?: string; // Optional: If coming from a booking
  showReviewButton?: boolean; // Whether to show the "Write a Review" button
}

const Reviews = ({ boatId }: ReviewsProps) => {
  const { data: session } = useSession();
  const userId = session?._id || ""; // FIX FE-05: session stores _id not id

  // Use the useFetcher hook to handle API calls
  const { fetchWithAuth, data: reviewsData, loading, error } = useFetcher();

  // Initial fetch and refetch function
  const fetchReviews = useCallback(() => {
    if (boatId) {
      fetchWithAuth(`reviews/boat/${boatId}`);
    }
  }, [boatId]);

  // Initial fetch
  useEffect(() => {
    if (!session) return;
    fetchReviews();
  }, [fetchReviews, session]);

  // Ensure reviews is always an array
  const reviews = Array.isArray(reviewsData) ? reviewsData : [];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 w-full animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
      </div>

      <ReviewList
        reviews={reviews}
        showActions={!!session}
        currentUserId={userId}
      />
    </div>
  );
};

export default Reviews;
