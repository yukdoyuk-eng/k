import { CuratedSpot } from './types';

const MIN_REVIEWS_THRESHOLD = 20; // CONSTANT 'm'
const AVERAGE_GLOBAL_RATING = 4.15; // CONSTANT 'C'
const MZ_TAG_WEIGHT_COEFFICIENT = 0.05; // CONSTANT 'w' or 'omega'

export function calculateAestheticScore(spot: CuratedSpot): number {
  const customReviewsLength = spot.customReviews?.length || 0;
  const customReviewsSum = spot.customReviews?.reduce((acc, r) => acc + r.rating, 0) || 0;

  // Recalculate average raw rating R
  const v_original = spot.reviewsCount;
  const v_total = v_original + customReviewsLength;

  if (v_total === 0) {
    return AVERAGE_GLOBAL_RATING;
  }

  // Raw average rating R
  const R = ((spot.ratingRaw * v_original) + customReviewsSum) / v_total;

  const m = MIN_REVIEWS_THRESHOLD;
  const C = AVERAGE_GLOBAL_RATING;
  const w = MZ_TAG_WEIGHT_COEFFICIENT;

  // Bayesian Average calculation
  const bayesianAverage = (v_total * R + m * C) / (v_total + m);

  // MZ Custom Tags Multiplier (based on matching attributes up to 3)
  const mzTagsCount = spot.mzTags ? spot.mzTags.length : 0;
  const mzMultiplier = 1 + w * Math.min(mzTagsCount, 3);

  const finalScore = bayesianAverage * mzMultiplier;
  
  // Cap at 5.0 and round to two decimal places
  return Math.min(Math.round(finalScore * 100) / 100, 5.0);
}
