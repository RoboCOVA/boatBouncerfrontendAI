import React, { useState } from 'react';
import Star from '../shared/icons/star';

interface RatingInputProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
} as const;

function RatingInput({
  value,
  onChange,
  readOnly = false,
  size = 'md',
}: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center">
      {stars.map((star) => {
        const isFilled = star <= (hoverRating || value);
        return (
          <button
            key={star}
            type="button"
            className={`${sizeClasses[size]} ${!readOnly ? 'cursor-pointer' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            disabled={readOnly}
            aria-label={`Rate ${star} out of 5`}
          >
            <Star fill={isFilled ? '#4FAEAB' : '#D9D9D9'} />
          </button>
        );
      })}
    </div>
  );
}

export default RatingInput;
