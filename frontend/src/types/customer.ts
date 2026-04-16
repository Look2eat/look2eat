
export interface Customer {
  name: string;
  phone: string;
  points: number;
  expiryDate: string;
  negativeReview: boolean;
  lastVisit?: string;
  rewards: {
    id: string;
    pointsRequired: number;
    description: string;
  }[];
  promotionalrewards?: {
    id: string;
    description: string;
    expiry: Date;
  }[];
  isNew?: boolean;
}