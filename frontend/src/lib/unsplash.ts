/**
 * ---------------------------------------------------------------------------
 * Unsplash search — used by ThemeStep's banner picker
 * ---------------------------------------------------------------------------
 * Requires NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in the environment.
 * Get a free key at https://unsplash.com/developers
 * ---------------------------------------------------------------------------
 */

import { UnsplashImage } from "@/types/loyalty";

const UNSPLASH_API = "https://api.unsplash.com";

interface UnsplashApiPhoto {
    id: string;
    alt_description: string | null;
    urls: { regular: string; thumb: string };
    user: { name: string; links: { html: string } };
}

function mapPhoto(photo: UnsplashApiPhoto): UnsplashImage {
    return {
        id: photo.id,
        url: photo.urls.regular,
        thumbUrl: photo.urls.thumb,
        alt: photo.alt_description ?? "Food photo",
        credit: photo.user.name,
        creditUrl: photo.user.links.html,
    };
}

export async function searchUnsplashPhotos(
    query: string,
    perPage = 12
): Promise<UnsplashImage[]> {
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
        throw new Error("Unsplash isn't configured. Set NEXT_PUBLIC_UNSPLASH_ACCESS_KEY.");
    }

    const res = await fetch(
        `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`,
        { headers: { Authorization: `Client-ID ${accessKey}` } }
    );

    if (!res.ok) {
        throw new Error("Couldn't search Unsplash. Try a different term.");
    }

    const data = await res.json();
    return (data.results as UnsplashApiPhoto[]).map(mapPhoto);
}

/**
 * Curated set of food/restaurant banner images shown before the merchant
 * searches for anything. Stable Unsplash photo IDs picked for restaurant /
 * food themes so the picker isn't empty on first load even without a query.
 */
export const PRELOADED_FOOD_BANNERS: UnsplashImage[] = [
    {
        id: "preset-1",
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
        thumbUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=60",
        alt: "Restaurant table spread with shared plates",
        credit: "Unsplash",
        creditUrl: "https://unsplash.com",
    },
    {
        id: "preset-2",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
        thumbUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=60",
        alt: "Plated fine dining dish",
        credit: "Unsplash",
        creditUrl: "https://unsplash.com",
    },
    {
        id: "preset-3",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
        thumbUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=60",
        alt: "Pizza fresh out of the oven",
        credit: "Unsplash",
        creditUrl: "https://unsplash.com",
    },
    {
        id: "preset-4",
        url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&q=80",
        thumbUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&q=60",
        alt: "Cafe interior with warm lighting",
        credit: "Unsplash",
        creditUrl: "https://unsplash.com",
    },
    {
        id: "preset-5",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
        thumbUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=60",
        alt: "Burger and fries close up",
        credit: "Unsplash",
        creditUrl: "https://unsplash.com",
    },
    {
        id: "preset-6",
        url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
        thumbUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&q=60",
        alt: "Coffee and pastries flat lay",
        credit: "Unsplash",
        creditUrl: "https://unsplash.com",
    },
];