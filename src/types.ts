export type GuType = 'DONGNAM' | 'SEOBUK';
export type SpotCategory = 'Heritage' | 'Nature' | 'Taste';

export interface District {
  id: number;
  gu: GuType;
  subName: string; // e.g., '목천읍', '불당동', '북면', '성성동'
  themeBg: string;
  themeText: string;
  description: string;
}

export interface CustomReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CuratedSpot {
  id: number;
  districtId: number;
  spotName: string;
  category: SpotCategory;
  googlePlaceId: string;
  latitude: number;
  longitude: number;
  mzTags: string[];
  curatorDescription: string;
  ratingRaw: number; // initial Google rating
  reviewsCount: number; // initial reviews count
  historyRatings?: number[]; // list of ratings to aid real-time updates
  weightedScore?: number; // computed Bayesian Aesthetic Score
  customReviews?: CustomReview[];
  imageUrl?: string;
}
