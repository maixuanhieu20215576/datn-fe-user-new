import React from "react";

interface CardProps {
  image: string;
  title: string;
  description: string;
  rating: number;
  price: string;
  discountPrice: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps & { discountPrice?: string }> = ({
  image,
  title,
  description,
  rating,
  price,
  discountPrice,
  onClick,
}) => {
  return (
    <div
      className="max-w-md rounded-lg shadow-lg overflow-hidden bg-white flex-1 min-h-[350px] flex flex-col"
      onClick={onClick}
    >
      <img className="w-full h-56 object-cover" src={image} alt={title} />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 flex-grow">{description}</p>
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="flex">
                {/* Display filled stars (yellow) */}
                <span className="text-yellow-500">
                  {"★".repeat(Math.round(rating))}
                </span>

                {/* Display unfilled stars (grey) */}
                <span className="text-gray-300">
                  {"★".repeat(5 - Math.round(rating))}
                </span>
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({rating.toFixed(1)})
              </span>
            </div>
          </div>
          <div className="text-right">
            {discountPrice ? (
              <>
                <span className="text-sm text-gray-500 line-through mr-2">
                  {price}
                </span>
                <span className="text-lg font-semibold text-green-600">
                  {discountPrice}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-green-600">
                {price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
