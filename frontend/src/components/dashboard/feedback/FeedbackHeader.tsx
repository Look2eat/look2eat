import { Button } from "@/components/ui/button";
import { ElasticSwitch } from "@/components/ui/elastic-switch-shadcnui";

export function FeedbackHeader() {
    return (
        <div>
            <div className="flex items-start justify-between "  >
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Collect Feedback</h2>
                    <p className="text-muted-foreground mb-6"> Gather insights from your customers to improve their experience and boost your business.</p>
                </div>


                <ElasticSwitch />

            </div>
            <div className="flex items-end justify-end">
                <Button variant="default" className="w-full md:w-auto">
                    Edit Feedback
                </Button>
            </div>
        </div>
    )
}
