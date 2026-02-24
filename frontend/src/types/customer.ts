import { Reward } from "./rewards";
export interface Customer {
    name: string;
    phone: string;
    points: number;
    isNew?: boolean;
    negativeReview?:boolean;
    lastVisit?: string;
    expiryDate: string;
    rewards: Reward[];
  }