export interface Review {
  _id: string;
  userId: string;
  boatId: string;
  bookingId: string;
  rating: number;
  reviewMessage: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    image?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface ReviewFormData {
  rating: number;
  reviewMessage: string;
}

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  boatName: string;
  existingReview?: Review;
  onSuccess?: () => void;
}
