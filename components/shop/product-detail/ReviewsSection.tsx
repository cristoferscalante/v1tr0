"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";
import type { Review } from "@/lib/data/mockProducts";

interface ReviewsSectionProps {
  reviews?: Review[];
  productName: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, productName }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <section className="py-12 border-t border-primary/20">
        <h2 className="text-3xl font-bold text-white mb-8">Rating & Reviews</h2>
        <div className="text-center py-12 bg-backgroundSecondary/30 rounded-2xl border border-primary/20">
          <p className="text-textSecondary">
            Sé el primero en dejar una reseña para {productName}
          </p>
        </div>
      </section>
    );
  }

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  // Count ratings by star
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="py-12 border-t border-primary/20">
      <h2 className="text-3xl font-bold text-white mb-8">Rating & Reviews</h2>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Side - Overall Rating */}
        <div className="space-y-6">
          {/* Average Score */}
          <div className="text-center lg:text-left">
            <div className="text-7xl font-bold text-white mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-textSecondary">
              Basado en {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {ratingCounts.map(({ star, count }) => {
              const percentage = (count / reviews.length) * 100;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-white font-semibold">{star}</span>
                  </div>
                  <div className="flex-1 h-2 bg-backgroundSecondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-textSecondary text-sm min-w-[40px] text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-backgroundSecondary/50 rounded-2xl border border-primary/20"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="text-primary font-bold text-lg">
                      {review.author.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Author Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold">{review.author}</h4>
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" aria-label="Compra verificada" />
                      )}
                    </div>
                    <p className="text-textSecondary text-sm">
                      {new Date(review.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-textSecondary leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
