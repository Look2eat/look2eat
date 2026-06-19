// demo.tsx

import React from 'react';
import { TravelRouteCard } from '@/components/ui/card-7';

const TravelRouteCardDemo = () => {
    return (
        <div className="flex  bg-background">
            <TravelRouteCard
                titleRating="Average Rating"
                titleReviewPushed="Reviews pushed to Google"
                rating="4.5"

                numberOfReviews="120"

                imageUrl="https://plus.unsplash.com/premium_photo-1682310144714-cb77b1e6d64a?q=80&w=2712&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="font-sans"
            />
        </div>
    );
};

export default TravelRouteCardDemo;