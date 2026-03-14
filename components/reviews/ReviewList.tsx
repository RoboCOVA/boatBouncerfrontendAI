import Image from "next/image";
import { format } from "date-fns";
import { Review } from "./types";
import RatingInput from "./RatingInput";

interface ReviewListProps {
  reviews: Review[];
  onEdit?: (review: Review) => void;
  showActions?: boolean;
  currentUserId?: string;
}

export const ReviewList = ({
  reviews,
  onEdit,
  showActions = false,
  currentUserId,
}: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="pb-4 text-center text-gray-500">
        No reviews yet. Be the first to leave a review!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 py-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {reviews &&
        reviews.map((review) => (
          <div
            key={review._id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm drop-shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-teal-400 bg-white">
                  <Image
                    src={review.user?.image || "/empty-profile-picture.png"}
                    alt={review.user?.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {`${review.user?.firstName} ${review.user?.lastName}`}
                  </h4>
                  <div className="mt-1 flex items-center">
                    <RatingInput value={review.rating} readOnly size="sm" />
                    <span className="ml-2 text-sm text-gray-500">
                      {format(new Date(review.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{review.reviewMessage}</p>
          </div>
        ))}
    </div>
  );
};

export default ReviewList;
