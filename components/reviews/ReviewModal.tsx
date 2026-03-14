import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Review } from "./types";
import useFetcher from "@/lib/hooks/use-axios";
import { ShowToast } from "@/components/shared/CustomToast";
import RatingInput from "./RatingInput";

export interface ReviewFormValues {
  rating: number;
  reviewMessage: string;
}

const validationSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Rating is required")
    .required("Rating is required"),
  reviewMessage: Yup.string()
    .min(10, "Review must be at least 10 characters")
    .required("Review message is required"),
});

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  boatName: string;
  existingReview?: Review;
  onSuccess?: () => void;
}

export const ReviewModal = ({
  isOpen,
  onClose,
  bookingId,
  boatName,
  existingReview,
  onSuccess,
}: ReviewModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { fetchWithAuthSync, deleteBoat } = useFetcher();

  const initialValues: ReviewFormValues = {
    rating: existingReview?.rating || 0,
    reviewMessage: existingReview?.reviewMessage || "",
  };

  const handleSubmit = async (
    values: ReviewFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ReviewFormValues>,
  ) => {
    try {
      if (existingReview) {
        // Update existing review
        await fetchWithAuthSync(`/reviews/${existingReview._id}`, values, 'PATCH');
        ShowToast({
          title: "Success",
          message: "Review updated successfully",
          status: "success",
        });
      } else {
        // Create new review
        await fetchWithAuthSync("/reviews", {
          ...values,
          bookingId,
        });
        ShowToast({
          title: "Thank you!",
          message: "Your review has been submitted",
          status: "success",
        });
      }

      onClose();
      onSuccess?.();
      resetForm();
    } catch (error) {
      console.error("Error submitting review:", error);
      ShowToast({
        title: "Error",
        message: "Failed to submit review. Please try again.",
        status: "fail",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    try {
      setIsDeleting(true);
      await deleteBoat(`/reviews/${existingReview._id}`, existingReview);
      ShowToast({
        title: "Success",
        message: "Review deleted successfully",
        status: "success",
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting review:", error);
      ShowToast({
        title: "Error",
        message: "Failed to delete review. Please try again.",
        status: "fail",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as="div">
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {existingReview ? "Edit Your Review" : "Write a Review"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    How was your experience with {boatName}?
                  </p>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    isSubmitting,
                  }) => (
                    <Form className="mt-6 space-y-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Your Rating
                        </label>
                        <Field name="rating">
                          {({ field, form }: any) => (
                            <RatingInput
                              value={values.rating}
                              onChange={(value) =>
                                form.setFieldValue("rating", value)
                              }
                            />
                          )}
                        </Field>
                        {errors.rating && touched.rating && (
                          <div className="mt-1 text-sm text-red-600">
                            {errors.rating}
                          </div>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="reviewMessage"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Your Review
                        </label>
                        <Field
                          as="textarea"
                          id="reviewMessage"
                          name="reviewMessage"
                          rows={4}
                          className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                          placeholder="Share details about your experience..."
                        />
                        {errors.reviewMessage && touched.reviewMessage && (
                          <div className="mt-1 text-sm text-red-600">
                            {errors.reviewMessage}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div>
                          {existingReview && (
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                              onClick={handleDelete}
                              disabled={isDeleting || isSubmitting}
                            >
                              {isDeleting ? "Deleting..." : "Delete Review"}
                            </button>
                          )}
                        </div>
                        <div className="space-x-3">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                            onClick={onClose}
                            disabled={isSubmitting || isDeleting}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={
                              isSubmitting || isDeleting || values.rating === 0
                            }
                            className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
                              values.rating === 0
                                ? "cursor-not-allowed bg-gray-300"
                                : "bg-teal-600 hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                            }`}
                          >
                            {isSubmitting
                              ? "Submitting..."
                              : existingReview
                              ? "Update Review"
                              : "Submit Review"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReviewModal;
