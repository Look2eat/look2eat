/**
 * ---------------------------------------------------------------------------
 * Loyalty settings — shared types
 * ---------------------------------------------------------------------------
 */

export interface Milestone {
    /** Present once the milestone has been created on the server. */
    id?: string;
    /** Description shown to the customer, e.g. "Free dessert on us". */
    name: string;
    /** Coins required to unlock this milestone. */
    coinsRequired: number;
    /** Description of the cashback/offer the customer receives. */
    cashbackOffer: string;
    /** Local-only flag used while a row is mid-save. */
    _status?: "idle" | "saving" | "error";
}

export interface LoyaltyTerm {
    id: string;
    label: string;
    selected: boolean;
    /** True for the synthetic "minimum redeem amount" term appended at save time. */
    isDynamic?: boolean;
}

export interface LoyaltyTheme {
    logoFile: File | null;
    logoPreview: string | null;
    bannerFile: File | null;
    bannerPreview: string | null;
    primaryColor: string;
}

export interface UnsplashImage {
    id: string;
    url: string;
    thumbUrl: string;
    alt: string;
    credit: string;
    creditUrl: string;
}

export interface LoyaltySettings {
    theme: LoyaltyTheme;
    coinRatioValue: number;
    /** How many days before unused coins expire. 0 means they never expire. */
    pointsExpiryDays: number;
    milestones: Milestone[];
    terms: LoyaltyTerm[];
    minRedeemAmount: number;
}