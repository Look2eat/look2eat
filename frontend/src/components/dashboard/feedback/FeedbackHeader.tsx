"use client";

import { Button } from "@/components/ui/button";
import { ElasticSwitch } from "@/components/ui/elastic-switch-shadcnui";
import FeedbackSettingsDialog from "./FeedbackSettingsDialog";
import { useFeedback } from "../../../lib/auth/FeedbackContext";
import { useState } from "react";

export function FeedbackHeader() {
    const { data, handleToggleFeedback, refetch } = useFeedback();
    const [toggling, setToggling] = useState(false);

    const onToggle = async (enabled: boolean) => {
        setToggling(true);
        try {
            await handleToggleFeedback(enabled);
        } finally {
            setToggling(false);
        }
    };

    return (
        <div className="font-poppins">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-3">Collect Feedback</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Gather insights from your customers to improve their experience and boost
                        your business.
                    </p>
                </div>

                <ElasticSwitch
                    checked={data?.feedbackEnabled ?? false}
                    disabled={toggling}
                    onCheckedChange={onToggle}
                />
            </div>

            <div className="flex items-end justify-end mt-6">
                <FeedbackSettingsDialog
                    trigger={
                        <Button variant="default" className="w-full md:w-auto">
                            Edit Feedback
                        </Button>
                    }
                    onSaved={refetch}
                />
            </div>
        </div>
    );
}